import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateNIK,
  validatePhone,
  sanitizeString,
  checkRateLimit,
  secureResponse,
  logSecurityEvent,
  encrypt,
  decrypt,
  maskNIK,
} from "@/lib/security";

// ============================================
// GET - List all online services or submissions
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "services" or "submissions"
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (type === "services") {
      // Get all layanan that can be done online
      const layanan = await db.layanan.findMany({
        where: {
          isActive: true,
          isOnline: true,
        },
        orderBy: { order: "asc" },
      });

      return secureResponse({
        success: true,
        data: layanan.map((l) => ({
          ...l,
          requirements: l.requirements ? JSON.parse(l.requirements) : [],
          procedures: l.procedures ? JSON.parse(l.procedures) : [],
          forms: l.forms ? JSON.parse(l.forms) : [],
        })),
      });
    }

    if (type === "submissions") {
      // Rate limit for admin submissions query
      const rateCheck = checkRateLimit(request, {
        windowMs: 60 * 1000,
        maxRequests: 60,
      });

      if (!rateCheck.allowed) {
        return NextResponse.json(
          { success: false, error: "Terlalu banyak permintaan" },
          { status: 429 }
        );
      }

      // Get all submissions (admin only - should add auth check in production)
      const whereClause: any = {};
      
      if (status && status !== "all") {
        whereClause.status = status;
      }

      if (search) {
        const sanitizedSearch = sanitizeString(search);
        whereClause.OR = [
          { nomorPengajuan: { contains: sanitizedSearch } },
          { namaLengkap: { contains: sanitizedSearch } },
        ];
        // Note: Cannot search encrypted NIK directly
      }

      const submissions = await db.pengajuanOnline.findMany({
        where: whereClause,
        include: {
          layanan: {
            select: { name: true, slug: true },
          },
          dokumen: {
            select: {
              id: true,
              namaDokumen: true,
              fileName: true,
              fileSize: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Mask NIK in response for security
      const sanitizedSubmissions = submissions.map((s) => ({
        ...s,
        nik: s.nik ? maskNIKFromEncrypted(s.nik) : null,
      }));

      return secureResponse({
        success: true,
        data: sanitizedSubmissions,
      });
    }

    // Default: return online services
    const layanan = await db.layanan.findMany({
      where: {
        isActive: true,
        isOnline: true,
      },
      orderBy: { order: "asc" },
    });

    return secureResponse({
      success: true,
      data: layanan.map((l) => ({
        ...l,
        requirements: l.requirements ? JSON.parse(l.requirements) : [],
        procedures: l.procedures ? JSON.parse(l.procedures) : [],
        forms: l.forms ? JSON.parse(l.forms) : [],
      })),
    });
  } catch (error) {
    console.error("Error fetching online services:", error);
    return secureResponse(
      { success: false, error: "Failed to fetch data" },
      500
    );
  }
}

// ============================================
// POST - Create new submission
// ============================================
export async function POST(request: NextRequest) {
  // Rate limiting: 5 submissions per minute per IP
  const rateCheck = checkRateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 5,
  });

  if (!rateCheck.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/layanan-online POST" }, request);
    
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak pengajuan. Silakan tunggu " + rateCheck.retryAfter + " detik.",
        retryAfter: rateCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfter),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const {
      layananId,
      namaLengkap,
      nik,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      noTelepon,
      email,
      keterangan,
      dokumen,
    } = body;

    // Sanitize all string inputs
    const sanitizedData = {
      layananId: sanitizeString(layananId),
      namaLengkap: sanitizeString(namaLengkap),
      nik: sanitizeString(nik),
      tempatLahir: sanitizeString(tempatLahir),
      alamat: sanitizeString(alamat),
      rt: sanitizeString(rt),
      rw: sanitizeString(rw),
      kelurahan: sanitizeString(kelurahan),
      kecamatan: sanitizeString(kecamatan),
      noTelepon: sanitizeString(noTelepon),
      email: sanitizeString(email),
      keterangan: sanitizeString(keterangan),
    };

    // Validate required fields
    if (!sanitizedData.layananId || !sanitizedData.namaLengkap || !sanitizedData.nik || !sanitizedData.noTelepon) {
      return secureResponse(
        { success: false, error: "Field wajib harus diisi" },
        400
      );
    }

    // Validate NIK format with security check
    const nikValidation = validateNIK(sanitizedData.nik);
    if (!nikValidation.valid) {
      logSecurityEvent("INVALID_NIK", { reason: nikValidation.error }, request);
      return secureResponse(
        { success: false, error: nikValidation.error },
        400
      );
    }

    // Validate phone number
    const phoneValidation = validatePhone(sanitizedData.noTelepon);
    if (!phoneValidation.valid) {
      return secureResponse(
        { success: false, error: phoneValidation.error },
        400
      );
    }

    // Check if layanan exists and is online
    const layanan = await db.layanan.findUnique({
      where: { id: sanitizedData.layananId },
    });

    if (!layanan || !layanan.isOnline || !layanan.isActive) {
      return secureResponse(
        { success: false, error: "Layanan tidak tersedia untuk pengajuan online" },
        400
      );
    }

    // Generate nomor pengajuan: ONL-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    
    const todayCount = await db.pengajuanOnline.count({
      where: {
        nomorPengajuan: {
          startsWith: `ONL-${dateStr}`,
        },
      },
    });

    const sequence = String(todayCount + 1).padStart(4, "0");
    const nomorPengajuan = `ONL-${dateStr}-${sequence}`;

    // Encrypt NIK before storing
    const encryptedNIK = encrypt(sanitizedData.nik);

    // Create submission
    const submission = await db.pengajuanOnline.create({
      data: {
        nomorPengajuan,
        layananId: sanitizedData.layananId,
        namaLengkap: sanitizedData.namaLengkap,
        nik: encryptedNIK, // Store encrypted NIK
        tempatLahir: sanitizedData.tempatLahir || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        jenisKelamin: jenisKelamin || null,
        alamat: sanitizedData.alamat || null,
        rt: sanitizedData.rt || null,
        rw: sanitizedData.rw || null,
        kelurahan: sanitizedData.kelurahan || null,
        kecamatan: sanitizedData.kecamatan || null,
        noTelepon: sanitizedData.noTelepon,
        email: sanitizedData.email || null,
        keterangan: sanitizedData.keterangan || null,
        status: "Baru",
        dokumen: dokumen
          ? {
              create: dokumen.map((doc: any) => ({
                namaDokumen: sanitizeString(doc.namaDokumen),
                fileName: sanitizeString(doc.fileName),
                fileUrl: doc.fileUrl,
                fileSize: doc.fileSize || null,
                fileType: doc.fileType || null,
              })),
            }
          : undefined,
      },
      include: {
        layanan: true,
        dokumen: true,
      },
    });

    // Log successful submission
    logSecurityEvent(
      "SUBMISSION_CREATED",
      {
        nomorPengajuan,
        layanan: layanan.name,
        nikMasked: maskNIK(sanitizedData.nik),
      },
      request
    );

    // Return response with masked NIK only
    return secureResponse({
      success: true,
      data: {
        ...submission,
        nik: maskNIK(sanitizedData.nik), // Return masked NIK only
      },
      message: "Pengajuan berhasil dikirim",
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    logSecurityEvent("SUBMISSION_ERROR", { error: String(error) }, request);
    return secureResponse(
      { success: false, error: "Gagal mengirim pengajuan" },
      500
    );
  }
}

// ============================================
// Helper: Mask NIK from encrypted value
// ============================================
function maskNIKFromEncrypted(encryptedNik: string): string {
  try {
    if (encryptedNik && encryptedNik.includes(":")) {
      const decrypted = decrypt(encryptedNik);
      return maskNIK(decrypted);
    }
    return maskNIK(encryptedNik);
  } catch {
    return "****************";
  }
}
