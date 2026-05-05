import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  sanitizeString,
  validatePhone,
  checkRateLimit,
  secureResponse,
  logSecurityEvent,
} from "@/lib/security";

// GET - Fetch published testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const parsedLimit = Math.min(Math.max(limit, 1), 50);

    const testimonials = await db.testimoni.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      select: {
        id: true,
        nama: true,
        pekerjaan: true,
        kecamatan: true,
        rating: true,
        isi: true,
        createdAt: true,
      },
    });

    return secureResponse({
      success: true,
      data: testimonials,
      total: testimonials.length,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return secureResponse(
      { success: false, error: "Gagal mengambil data testimoni" },
      500
    );
  }
}

// POST - Submit new testimonial
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 submissions per minute per IP
    const rateCheck = checkRateLimit(request, {
      windowMs: 60 * 1000,
      maxRequests: 3,
    });

    if (!rateCheck.allowed) {
      logSecurityEvent("RATE_LIMITED_TESTIMONI", {
        retryAfter: rateCheck.retryAfter,
      }, request);
      return secureResponse(
        {
          success: false,
          error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateCheck.retryAfter} detik.`,
          retryAfter: rateCheck.retryAfter,
        },
        429
      );
    }

    const body = await request.json();
    const { nama, pekerjaan, kecamatan, rating, isi, noTelepon } = body;

    // Validate required fields
    if (!nama || !nama.trim()) {
      return secureResponse(
        { success: false, error: "Nama wajib diisi" },
        400
      );
    }

    if (!isi || !isi.trim()) {
      return secureResponse(
        { success: false, error: "Isi testimoni wajib diisi" },
        400
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return secureResponse(
        { success: false, error: "Rating harus antara 1 sampai 5" },
        400
      );
    }

    if (nama.trim().length < 3) {
      return secureResponse(
        { success: false, error: "Nama minimal 3 karakter" },
        400
      );
    }

    if (isi.trim().length < 10) {
      return secureResponse(
        { success: false, error: "Isi testimoni minimal 10 karakter" },
        400
      );
    }

    if (isi.trim().length > 1000) {
      return secureResponse(
        { success: false, error: "Isi testimoni maksimal 1000 karakter" },
        400
      );
    }

    // Validate phone if provided
    if (noTelepon && noTelepon.trim()) {
      const phoneCheck = validatePhone(noTelepon.trim());
      if (!phoneCheck.valid) {
        return secureResponse(
          { success: false, error: phoneCheck.error },
          400
        );
      }
    }

    // Sanitize inputs
    const sanitizedNama = sanitizeString(nama.trim());
    const sanitizedIsi = sanitizeString(isi.trim());
    const sanitizedPekerjaan = pekerjaan
      ? sanitizeString(pekerjaan.trim())
      : null;
    const sanitizedKecamatan = kecamatan
      ? sanitizeString(kecamatan.trim())
      : null;
    const sanitizedPhone = noTelepon ? noTelepon.trim() : null;

    // Create testimonial (unpublished by default for admin moderation)
    const testimoni = await db.testimoni.create({
      data: {
        nama: sanitizedNama,
        pekerjaan: sanitizedPekerjaan,
        kecamatan: sanitizedKecamatan,
        rating: Math.round(rating),
        isi: sanitizedIsi,
        noTelepon: sanitizedPhone,
        isPublished: false,
      },
    });

    logSecurityEvent("TESTIMONI_SUBMITTED", {
      testimoniId: testimoni.id,
      nama: sanitizedNama,
      rating: Math.round(rating),
    }, request);

    return secureResponse(
      {
        success: true,
        message:
          "Terima kasih! Testimoni Anda berhasil dikirim dan akan ditinjau oleh admin sebelum ditampilkan.",
        data: {
          id: testimoni.id,
          nama: testimoni.nama,
          rating: testimoni.rating,
        },
      },
      201
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    logSecurityEvent("TESTIMONI_ERROR", {
      error: error instanceof Error ? error.message : "Unknown error",
    }, request);
    return secureResponse(
      { success: false, error: "Gagal mengirim testimoni. Silakan coba lagi." },
      500
    );
  }
}
