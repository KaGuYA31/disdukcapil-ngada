import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateNomorPengajuan,
  sanitizeString,
  checkRateLimit,
  secureResponse,
  logSecurityEvent,
  decrypt,
  maskNIK,
} from "@/lib/security";

/**
 * GET /api/status-pengajuan
 * 
 * Check status of online submission by nomor pengajuan
 * 
 * Security Features:
 * - Rate limiting: 20 requests per minute per IP
 * - Input validation
 * - Masked NIK in response
 * - No sensitive document URLs exposed
 * - No SQL injection (Prisma parameterized queries)
 * 
 * Query params:
 * - nomor: Nomor pengajuan (format: ONL-YYYYMMDD-XXXX)
 * - nik: Last 4 digits of NIK for verification (optional but recommended)
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 20 requests per minute
  const rateCheck = checkRateLimit(request, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  });

  if (!rateCheck.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/status-pengajuan" }, request);
    
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
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const nomor = searchParams.get("nomor");
    const nikLast4 = searchParams.get("nik"); // Optional: last 4 digits for verification

    // Validate nomor pengajuan
    const sanitizedNomor = sanitizeString(nomor || "");
    const nomorValidation = validateNomorPengajuan(sanitizedNomor);
    
    if (!nomorValidation.valid) {
      return secureResponse(
        {
          success: false,
          error: nomorValidation.error,
        },
        400
      );
    }

    // If NIK last 4 provided, validate format
    if (nikLast4) {
      const sanitizedNik = sanitizeString(nikLast4);
      if (!/^\d{4}$/.test(sanitizedNik)) {
        return secureResponse(
          {
            success: false,
            error: "NIK verification harus 4 digit terakhir",
          },
          400
        );
      }
    }

    // Find submission by nomor pengajuan
    const submission = await db.pengajuanOnline.findUnique({
      where: {
        nomorPengajuan: sanitizedNomor,
      },
      include: {
        layanan: {
          select: {
            name: true,
            slug: true,
          },
        },
        dokumen: {
          select: {
            id: true,
            namaDokumen: true,
            fileName: true,
            fileSize: true,
            // Don't expose fileUrl directly
          },
        },
      },
    });

    if (!submission) {
      // Don't reveal whether the nomor exists or not
      logSecurityEvent(
        "STATUS_CHECK_NOT_FOUND",
        { nomorPengajuan: sanitizedNomor },
        request
      );
      
      return secureResponse(
        {
          success: false,
          error: "Pengajuan tidak ditemukan. Pastikan nomor pengajuan benar.",
        },
        404
      );
    }

    // Optional: Verify with last 4 digits of NIK
    if (nikLast4) {
      let fullNik = submission.nik;
      
      // Decrypt if encrypted
      try {
        if (fullNik && fullNik.includes(":")) {
          fullNik = decrypt(fullNik);
        }
      } catch {
        // Keep original if decryption fails
      }
      
      if (!fullNik || !fullNik.endsWith(nikLast4)) {
        logSecurityEvent(
          "STATUS_CHECK_NIK_MISMATCH",
          { nomorPengajuan: sanitizedNomor },
          request
        );
        
        return secureResponse(
          {
            success: false,
            error: "Verifikasi NIK tidak cocok. Pastikan 4 digit terakhir NIK benar.",
          },
          403
        );
      }
    }

    // Decrypt NIK for masking
    let decryptedNik = submission.nik;
    try {
      if (decryptedNik && decryptedNik.includes(":")) {
        decryptedNik = decrypt(decryptedNik);
      }
    } catch {
      // Keep original if decryption fails
    }

    // Prepare safe response data (mask sensitive info)
    const responseData = {
      nomorPengajuan: submission.nomorPengajuan,
      namaLengkap: submission.namaLengkap,
      nikMasked: maskNIK(decryptedNik || submission.nik || ""),
      layanan: submission.layanan.name,
      status: submission.status,
      catatan: submission.catatan,
      tanggalPengajuan: submission.tanggalPengajuan?.toISOString() || submission.createdAt.toISOString(),
      tanggalProses: submission.tanggalProses?.toISOString() || null,
      tanggalSelesai: submission.tanggalSelesai?.toISOString() || null,
      dokumen: submission.dokumen.map((d) => ({
        namaDokumen: d.namaDokumen,
        fileName: d.fileName,
        fileSize: d.fileSize,
        // Don't expose fileUrl
      })),
    };

    logSecurityEvent(
      "STATUS_CHECK_SUCCESS",
      {
        nomorPengajuan: sanitizedNomor,
        status: submission.status,
      },
      request
    );

    return secureResponse(
      {
        success: true,
        data: responseData,
      },
      200
    );
  } catch (error) {
    console.error("Error in status-pengajuan:", error);
    logSecurityEvent("STATUS_CHECK_ERROR", { error: String(error) }, request);
    
    return secureResponse(
      {
        success: false,
        error: "Terjadi kesalahan sistem. Silakan coba lagi nanti.",
      },
      500
    );
  }
}

// Only allow GET method
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Method not allowed. Gunakan GET request." },
    { status: 405 }
  );
}
