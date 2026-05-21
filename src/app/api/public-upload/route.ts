import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";
import { checkRateLimit, logSecurityEvent } from "@/lib/security";

// Allowed file types for public uploads (images + PDFs only)
const PUBLIC_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

// Max file size for public uploads: 5MB
const PUBLIC_MAX_FILE_SIZE = 5 * 1024 * 1024;

// Rate limit: 10 uploads per minute per IP
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
};

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ──
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIG);
    if (!rateLimitResult.allowed) {
      logSecurityEvent("PUBLIC_UPLOAD_RATE_LIMITED", {
        retryAfter: rateLimitResult.retryAfter,
      }, request);
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan upload. Silakan tunggu ${rateLimitResult.retryAfter} detik.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // ── Parse form data ──
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "public";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // ── Validate file type (public: images + PDFs only) ──
    if (!PUBLIC_ALLOWED_TYPES.includes(file.type)) {
      logSecurityEvent("PUBLIC_UPLOAD_INVALID_TYPE", {
        fileType: file.type,
        fileName: file.name,
      }, request);
      return NextResponse.json(
        {
          success: false,
          error:
            "Tipe file tidak diizinkan. Untuk upload publik hanya diperbolehkan: JPG, PNG, GIF, WebP, dan PDF.",
        },
        { status: 400 }
      );
    }

    // ── Validate file size (max 5MB for public) ──
    if (file.size > PUBLIC_MAX_FILE_SIZE) {
      logSecurityEvent("PUBLIC_UPLOAD_FILE_TOO_LARGE", {
        fileSize: file.size,
        maxSize: PUBLIC_MAX_FILE_SIZE,
        fileName: file.name,
      }, request);
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran file terlalu besar. Maksimal 5MB untuk upload publik.",
        },
        { status: 400 }
      );
    }

    // ── Mock upload fallback (local development) ──
    if (!supabase) {
      const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
      };

      const mockFilename = `${Date.now()}-${file.name}`;
      const mockUrl = `/mock-uploads/${folder}/${mockFilename}`;

      return NextResponse.json({
        success: true,
        url: mockUrl,
        filename: mockFilename,
        originalName: file.name,
        path: `${folder}/${mockFilename}`,
        size: formatFileSize(file.size),
        type: file.type,
        mock: true,
      });
    }

    // ── Generate unique filename ──
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "pdf";
    const originalName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 50);
    const filename = `${originalName}-${timestamp}-${randomString}.${extension}`;
    const filepath = `${folder}/${filename}`;

    // ── Upload to Supabase Storage ──
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error (public):", error);

      if (
        error.message?.includes("not found") ||
        error.message?.includes("does not exist") ||
        error.message?.includes("Bucket not found")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Bucket 'uploads' belum dibuat. Buka Supabase Dashboard > Storage > New bucket > nama: 'uploads' > centang Public bucket > Create.",
          },
          { status: 500 }
        );
      }

      if (
        error.message?.includes("policy") ||
        error.message?.includes("permission") ||
        error.message?.includes("denied")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Policy belum diatur. Buka Supabase Dashboard > Storage > uploads > Policies > New Policy > pilih 'For full customization' > Allowed operations: Select, Insert > Target roles: anon > Save.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Gagal mengunggah file: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // ── Get public URL ──
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filepath);

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename,
      originalName: file.name,
      path: data.path,
      size: formatFileSize(file.size),
      type: file.type,
    });
  } catch (error) {
    console.error("Public upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
