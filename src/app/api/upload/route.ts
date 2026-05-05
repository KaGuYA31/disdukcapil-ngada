import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "images";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipe file tidak diizinkan. Gunakan JPG, PNG, GIF, atau WebP" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!supabase) {
      // Fallback for local development without Supabase
      const mockFilename = `${Date.now()}-${file.name}`;
      const mockUrl = `/mock-uploads/${folder}/${mockFilename}`;

      return NextResponse.json({
        success: true,
        url: mockUrl,
        filename: mockFilename,
        originalName: file.name,
        path: `${folder}/${mockFilename}`,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        mock: true,
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "jpg";
    const originalName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 50);
    const filename = `${originalName}-${timestamp}-${randomString}.${extension}`;
    const filepath = `${folder}/${filename}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);

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
        { success: false, error: `Gagal mengunggah gambar: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filepath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: filename,
      originalName: file.name,
      path: data.path,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah gambar" },
      { status: 500 }
    );
  }
}
