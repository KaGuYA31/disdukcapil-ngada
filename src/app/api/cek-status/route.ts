import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  checkRateLimit,
  sanitizeString,
  validateNIK,
  validateNomorPengajuan,
  maskNIK,
  decrypt,
  logSecurityEvent,
  secureResponse,
} from "@/lib/security";

// ============================================
// IN-MEMORY RATE LIMITER (standalone for cek-status)
// ============================================

interface RateEntry {
  count: number;
  resetTime: number;
}

const rateStore = new Map<string, RateEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateStore.entries()) {
      if (entry.resetTime < now) rateStore.delete(key);
    }
  }, 5 * 60 * 1000);
}

function localRateLimit(request: NextRequest): {
  allowed: boolean;
  retryAfter: number;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  let ip = "unknown";
  if (forwarded) ip = forwarded.split(",")[0].trim();
  else if (realIp) ip = realIp;
  else if (cfIp) ip = cfIp;

  const key = `cek-status:${ip}`;
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;
  const now = Date.now();

  let entry = rateStore.get(key);

  if (!entry || entry.resetTime < now) {
    rateStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  rateStore.set(key, entry);
  return { allowed: true, retryAfter: 0 };
}

// ============================================
// HELPERS
// ============================================

/**
 * Mask name: "Johannes Sebastianus" -> "J************* S**********"
 * Shows first letter of each word + asterisks
 */
function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part.charAt(0) + "*".repeat(part.length - 1);
    })
    .join(" ");
}

/**
 * Decrypt NIK if encrypted (handles "plain:" prefix and encrypted format)
 */
function decryptNIK(nik: string): string {
  if (!nik) return "";
  try {
    return decrypt(nik);
  } catch {
    return nik;
  }
}

/**
 * Build status timeline for pengajuan
 * Statuses: Baru -> Diverifikasi -> Diproses -> Selesai (or Ditolak)
 */
function buildPengajuanTimeline(submission: {
  status: string;
  tanggalPengajuan: Date | string | null;
  tanggalProses: Date | string | null;
  tanggalSelesai: Date | string | null;
  updatedAt: Date | string;
}): Array<{
  status: string;
  label: string;
  date: string | null;
  completed: boolean;
  active: boolean;
}> {
  const statuses = ["Baru", "Diverifikasi", "Diproses", "Selesai"];
  const statusLabels: Record<string, string> = {
    Baru: "Pengajuan Diterima",
    Diverifikasi: "Dokumen Diverifikasi",
    Diproses: "Sedang Diproses",
    Selesai: "Selesai",
  };

  // If rejected, add Ditolak as special status
  const isRejected = submission.status === "Ditolak";

  if (isRejected) {
    // Find where rejection happened
    const rejectionIndex = submission.tanggalProses
      ? 3 // Rejected during processing
      : submission.status === "Ditolak" && !submission.tanggalProses
        ? 1 // Rejected early
        : 2;

    const timeline = statuses.slice(0, Math.min(rejectionIndex, 4)).map((s, i) => {
      let date: string | null = null;
      if (s === "Baru") date = submission.tanggalPengajuan?.toString() || submission.updatedAt.toString();
      if (s === "Diverifikasi" && submission.tanggalProses) date = submission.tanggalProses.toString();

      return {
        status: s,
        label: statusLabels[s],
        date,
        completed: i < rejectionIndex - 1,
        active: i === rejectionIndex - 1,
      };
    });

    timeline.push({
      status: "Ditolak",
      label: "Ditolak",
      date: submission.updatedAt.toString(),
      completed: true,
      active: true,
    });

    return timeline;
  }

  const currentIdx = statuses.indexOf(submission.status);
  const dateMap: Record<string, string | null> = {
    Baru: submission.tanggalPengajuan?.toString() || submission.updatedAt.toString(),
    Diverifikasi: submission.tanggalProses?.toString() || null,
    Diproses: submission.tanggalProses?.toString() || null,
    Selesai: submission.tanggalSelesai?.toString() || null,
  };

  return statuses.map((s, i) => ({
    status: s,
    label: statusLabels[s],
    date: dateMap[s],
    completed: i <= currentIdx,
    active: i === currentIdx,
  }));
}

/**
 * Build status timeline for pengaduan
 * Statuses: Baru -> Diproses -> Selesai
 */
function buildPengaduanTimeline(complaint: {
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): Array<{
  status: string;
  label: string;
  date: string | null;
  completed: boolean;
  active: boolean;
}> {
  const statuses = ["Baru", "Diproses", "Selesai"];
  const statusLabels: Record<string, string> = {
    Baru: "Pengaduan Diterima",
    Diproses: "Sedang Ditangani",
    Selesai: "Selesai",
  };

  const currentIdx = statuses.indexOf(complaint.status);
  return statuses.map((s, i) => {
    let date: string | null = null;
    if (i === 0) date = complaint.createdAt.toString();
    else if (i === 1 && currentIdx >= 1) date = complaint.updatedAt.toString();
    else if (i === 2 && currentIdx === 2) date = complaint.updatedAt.toString();

    return {
      status: s,
      label: statusLabels[s],
      date,
      completed: i <= currentIdx,
      active: i === currentIdx,
    };
  });
}

// ============================================
// POST /api/cek-status
// ============================================

export async function POST(request: NextRequest) {
  // Rate limiting: max 10 requests per minute per IP
  const rateCheck = localRateLimit(request);
  if (!rateCheck.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/cek-status" }, request);
    return NextResponse.json(
      {
        success: false,
        error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateCheck.retryAfter} detik.`,
        retryAfter: rateCheck.retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { query, type } = body as { query?: string; type?: "pengajuan" | "pengaduan" };

    // Default type is pengajuan
    const searchType = type === "pengaduan" ? "pengaduan" : "pengajuan";

    // Validate input
    if (!query || typeof query !== "string" || !query.trim()) {
      return secureResponse(
        { success: false, error: "Masukkan NIK atau nomor pengajuan untuk pencarian" },
        400
      );
    }

    const sanitizedQuery = sanitizeString(query.trim());

    if (searchType === "pengaduan") {
      return handlePengaduan(sanitizedQuery, request);
    }

    return handlePengajuan(sanitizedQuery, request);
  } catch (error) {
    console.error("Error in cek-status:", error);
    logSecurityEvent("CEK_STATUS_ERROR", { error: String(error) }, request);
    return secureResponse(
      { success: false, error: "Terjadi kesalahan sistem. Silakan coba lagi nanti." },
      500
    );
  }
}

// ============================================
// PENGAJUAN HANDLER
// ============================================

async function handlePengajuan(query: string, request: NextRequest) {
  // Auto-detect input type
  const isNomorPengajuan = query.toUpperCase().startsWith("ONL-");

  if (isNomorPengajuan) {
    // Validate nomor pengajuan format
    const validation = validateNomorPengajuan(query.toUpperCase());
    if (!validation.valid) {
      return secureResponse(
        { success: false, error: validation.error || "Format nomor pengajuan tidak valid" },
        400
      );
    }

    // Search by nomor pengajuan
    const submission = await db.pengajuanOnline.findUnique({
      where: { nomorPengajuan: query.toUpperCase() },
      include: {
        layanan: { select: { name: true, slug: true } },
        dokumen: { select: { id: true, namaDokumen: true, fileName: true, fileSize: true } },
      },
    });

    if (!submission) {
      logSecurityEvent("CEK_STATUS_NOT_FOUND", { query, type: "pengajuan" }, request);
      return secureResponse(
        { success: false, error: "Pengajuan tidak ditemukan. Pastikan nomor pengajuan benar." },
        404
      );
    }

    return buildPengajuanResponse(submission, request);
  } else {
    // Treat as NIK (must be 16 digits)
    const nikValidation = validateNIK(query);
    if (!nikValidation.valid) {
      return secureResponse(
        { success: false, error: nikValidation.error || "Format NIK tidak valid. NIK harus 16 digit angka." },
        400
      );
    }

    // Search by NIK — find most recent submission
    const submissions = await db.pengajuanOnline.findMany({
      where: { nik: query },
      orderBy: { createdAt: "desc" },
      take: 1,
      include: {
        layanan: { select: { name: true, slug: true } },
        dokumen: { select: { id: true, namaDokumen: true, fileName: true, fileSize: true } },
      },
    });

    if (submissions.length === 0) {
      // Also try encrypted NIK (in case stored encrypted)
      const { encrypt } = await import("@/lib/security");
      const encryptedNik = encrypt(query);
      const encryptedSubmissions = await db.pengajuanOnline.findMany({
        where: { nik: encryptedNik },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          layanan: { select: { name: true, slug: true } },
          dokumen: { select: { id: true, namaDokumen: true, fileName: true, fileSize: true } },
        },
      });

      if (encryptedSubmissions.length === 0) {
        logSecurityEvent("CEK_STATUS_NOT_FOUND", { query: "NIK", type: "pengajuan" }, request);
        return secureResponse(
          { success: false, error: "Pengajuan tidak ditemukan untuk NIK tersebut." },
          404
        );
      }

      return buildPengajuanResponse(encryptedSubmissions[0], request);
    }

    return buildPengajuanResponse(submissions[0], request);
  }
}

/**
 * Build the pengajuan response with masked data and timeline
 */
function buildPengajuanResponse(
  submission: {
    id: string;
    nomorPengajuan: string;
    namaLengkap: string;
    nik: string;
    kecamatan: string | null;
    status: string;
    catatan: string | null;
    tanggalPengajuan: Date | string | null;
    tanggalProses: Date | string | null;
    tanggalSelesai: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    layanan: { name: string; slug: string };
    dokumen: Array<{ id: string; namaDokumen: string; fileName: string; fileSize: string | null }>;
  },
  request: NextRequest
) {
  const decryptedNik = decryptNIK(submission.nik);

  const responseData = {
    type: "pengajuan" as const,
    nomorPengajuan: submission.nomorPengajuan,
    namaLengkap: maskName(submission.namaLengkap),
    nikMasked: maskNIK(decryptedNik || submission.nik),
    kecamatan: submission.kecamatan || null,
    status: submission.status,
    catatan: submission.catatan,
    layanan: submission.layanan.name,
    tanggalPengajuan: submission.tanggalPengajuan?.toString() || submission.createdAt.toString(),
    tanggalProses: submission.tanggalProses?.toString() || null,
    tanggalSelesai: submission.tanggalSelesai?.toString() || null,
    updatedAt: submission.updatedAt.toString(),
    timeline: buildPengajuanTimeline({
      status: submission.status,
      tanggalPengajuan: submission.tanggalPengajuan,
      tanggalProses: submission.tanggalProses,
      tanggalSelesai: submission.tanggalSelesai,
      updatedAt: submission.updatedAt,
    }),
    dokumen: submission.dokumen.map((d) => ({
      namaDokumen: d.namaDokumen,
      fileName: d.fileName,
      fileSize: d.fileSize,
    })),
  };

  logSecurityEvent(
    "CEK_STATUS_SUCCESS",
    { type: "pengajuan", nomorPengajuan: submission.nomorPengajuan },
    request
  );

  return secureResponse({ success: true, data: responseData }, 200);
}

// ============================================
// PENGADUAN HANDLER
// ============================================

async function handlePengaduan(query: string, request: NextRequest) {
  // Search pengaduan by ID (cuid format) or by ticket-like string
  const { validateUUID } = await import("@/lib/security");

  let complaint;

  if (validateUUID(query)) {
    complaint = await db.pengaduan.findUnique({
      where: { id: query },
    });
  } else {
    // Try searching by subject or name (for broader search)
    complaint = await db.pengaduan.findFirst({
      where: {
        OR: [
          { subject: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { id: query },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!complaint) {
    logSecurityEvent("CEK_STATUS_NOT_FOUND", { query, type: "pengaduan" }, request);
    return secureResponse(
      { success: false, error: "Pengaduan tidak ditemukan." },
      404
    );
  }

  // Mask name in pengaduan response
  const responseData = {
    type: "pengaduan" as const,
    id: complaint.id,
    subject: complaint.subject,
    namaLengkap: maskName(complaint.name),
    status: complaint.status,
    response: complaint.response,
    createdAt: complaint.createdAt.toString(),
    updatedAt: complaint.updatedAt.toString(),
    timeline: buildPengaduanTimeline({
      status: complaint.status,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    }),
  };

  logSecurityEvent(
    "CEK_STATUS_SUCCESS",
    { type: "pengaduan", id: complaint.id },
    request
  );

  return secureResponse({ success: true, data: responseData }, 200);
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed. Gunakan POST request." },
    { status: 405 }
  );
}
