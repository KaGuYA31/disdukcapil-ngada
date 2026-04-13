import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  checkRateLimit,
  sanitizeString,
  encrypt,
  decrypt,
  validatePhone,
  maskNIK,
  logSecurityEvent,
  secureResponse,
} from "@/lib/security";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const VALID_STATUSES = ["Baru", "Diproses", "Selesai", "Ditolak"];

// GET - Fetch all complaints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStatus = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10") || 10));

    const where: { status?: string } = {};
    if (rawStatus) {
      const status = sanitizeString(rawStatus);
      if (VALID_STATUSES.includes(status)) {
        where.status = status;
      }
    }

    const [complaints, total] = await Promise.all([
      db.pengaduan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.pengaduan.count({ where }),
    ]);

    // Mask NIK in response (decrypt first if encrypted)
    const maskedComplaints = complaints.map((c: any) => {
      if (!c.nik) return { ...c, nik: null };
      const decryptedNik = decrypt(c.nik);
      return { ...c, nik: maskNIK(decryptedNik) };
    });

    return secureResponse({
      success: true,
      data: maskedComplaints,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return secureResponse(
      { success: false, error: "Gagal mengambil data pengaduan" },
      500
    );
  }
}

// POST - Create new complaint
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 submissions per minute per IP
    const rateLimit = checkRateLimit(request, { windowMs: 60 * 1000, maxRequests: 3 });
    if (!rateLimit.allowed) {
      logSecurityEvent("RATE_LIMIT_EXCEEDED", {
        endpoint: "/api/pengaduan",
        retryAfter: rateLimit.retryAfter,
      }, request);
      return secureResponse(
        {
          success: false,
          error: "Terlalu banyak permintaan. Silakan coba lagi dalam " + rateLimit.retryAfter + " detik.",
        },
        429
      );
    }

    const body = await request.json();
    const { name, nik, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return secureResponse(
        { success: false, error: "Semua field wajib harus diisi" },
        400
      );
    }

    // Sanitize all string inputs
    const sanitizedName = sanitizeString(String(name));
    const sanitizedSubject = sanitizeString(String(subject));
    const sanitizedMessage = sanitizeString(String(message));
    const sanitizedEmail = sanitizeString(String(email)).toLowerCase();
    const sanitizedPhone = sanitizeString(String(phone));

    // Validate email format
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return secureResponse(
        { success: false, error: "Format email tidak valid" },
        400
      );
    }

    // Validate phone format
    const phoneValidation = validatePhone(sanitizedPhone);
    if (!phoneValidation.valid) {
      return secureResponse(
        { success: false, error: phoneValidation.error },
        400
      );
    }

    // Encrypt NIK before storing (if provided)
    const sanitizedNik = nik ? sanitizeString(String(nik)) : null;
    const encryptedNik = sanitizedNik ? encrypt(sanitizedNik) : null;

    const complaint = await db.pengaduan.create({
      data: {
        name: sanitizedName,
        nik: encryptedNik,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        status: "Baru",
      },
    });

    logSecurityEvent("PENGADUAN_SUBMITTED", {
      complaintId: complaint.id,
    }, request);

    return secureResponse({
      success: true,
      data: {
        ...complaint,
        nik: sanitizedNik ? maskNIK(sanitizedNik) : null,
      },
      message: "Pengaduan berhasil dikirim",
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return secureResponse(
      { success: false, error: "Gagal mengirim pengaduan" },
      500
    );
  }
}
