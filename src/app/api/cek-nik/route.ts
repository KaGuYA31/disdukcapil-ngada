import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateNIK,
  sanitizeString,
  checkRateLimit,
  secureResponse,
  logSecurityEvent,
  decrypt,
  maskNIK,
} from "@/lib/security";

/**
 * POST /api/cek-nik
 * 
 * Check if NIK exists in the system (for validation purposes)
 * 
 * Security Features:
 * - Rate limiting: 10 requests per minute per IP
 * - Input validation with strict NIK format check
 * - No raw NIK in response (masked)
 * - No SQL injection (Prisma parameterized queries)
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 10 requests per minute
  const rateCheck = checkRateLimit(request, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  });

  if (!rateCheck.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/cek-nik" }, request);
    
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak permintaan. Silakan coba lagi dalam " + rateCheck.retryAfter + " detik.",
        retryAfter: rateCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfter),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { nik } = body;

    // Sanitize input
    const sanitizedNIK = sanitizeString(nik);

    // Validate NIK format
    const validation = validateNIK(sanitizedNIK);
    if (!validation.valid) {
      logSecurityEvent("INVALID_NIK_FORMAT", { nikLength: sanitizedNIK?.length }, request);
      
      return secureResponse(
        {
          success: false,
          error: validation.error,
        },
        400
      );
    }

    // Get all submissions (we need to decrypt NIK to compare)
    // In production, use blind indexing for searchable encryption
    const allPengajuan = await db.pengajuanOnline.findMany({
      select: {
        id: true,
        nik: true,
        namaLengkap: true,
        status: true,
        nomorPengajuan: true,
        tanggalPengajuan: true,
        createdAt: true,
        layanan: {
          select: { name: true },
        },
      },
      take: 500, // Limit for performance
      orderBy: { createdAt: "desc" },
    });

    // Find matching NIK (compare decrypted values)
    const matches = allPengajuan.filter((p) => {
      if (!p.nik) return false;
      try {
        if (p.nik.includes(":")) {
          const decrypted = decrypt(p.nik);
          return decrypted === sanitizedNIK;
        }
        return p.nik === sanitizedNIK;
      } catch {
        return p.nik === sanitizedNIK;
      }
    });

    if (matches.length === 0) {
      return secureResponse(
        {
          success: true,
          found: false,
          message: "NIK tidak ditemukan dalam sistem pengajuan online kami.",
        },
        200
      );
    }

    // Return masked data only
    const responseData = matches.map((m) => ({
      nomorPengajuan: m.nomorPengajuan,
      namaLengkap: m.namaLengkap,
      nikMasked: maskNIK(sanitizedNIK),
      layanan: m.layanan?.name || "-",
      status: m.status,
      tanggalPengajuan: m.tanggalPengajuan?.toISOString() || m.createdAt?.toISOString(),
    }));

    logSecurityEvent(
      "NIK_CHECK_SUCCESS",
      {
        nikMasked: maskNIK(sanitizedNIK),
        resultCount: matches.length,
      },
      request
    );

    return secureResponse(
      {
        success: true,
        found: true,
        count: matches.length,
        data: responseData,
      },
      200
    );
  } catch (error) {
    console.error("Error in cek-nik:", error);
    logSecurityEvent("NIK_CHECK_ERROR", { error: String(error) }, request);
    
    return secureResponse(
      {
        success: false,
        error: "Terjadi kesalahan sistem. Silakan coba lagi nanti.",
      },
      500
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
