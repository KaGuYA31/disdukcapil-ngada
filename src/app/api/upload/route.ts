import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Supabase belum dikonfigurasi. Silakan tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables Vercel." 
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipe file tidak diizinkan. Gunakan JPG, PNG, GIF, atau WebP" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = `images/${filename}`;

    // Convert File to ArrayBuffer then to Buffer
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
      
      // Provide helpful error messages
      if (error.message?.includes("not found") || error.message?.includes("does not exist") || error.message?.includes("Bucket not found")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Bucket 'uploads' belum dibuat. Buka Supabase Dashboard > Storage > New bucket > nama: 'uploads' > centang Public bucket > Create." 
          },
          { status: 500 }
        );
      }

      if (error.message?.includes("policy") || error.message?.includes("permission") || error.message?.includes("denied")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Policy belum diatur. Buka Supabase Dashboard > Storage > uploads > Policies > New Policy > pilih 'For full customization' > Allowed operations: Select, Insert > Target roles: anon > Save." 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: `Gagal mengunggah file: ${error.message}` },
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
      path: data.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase belum dikonfigurasi" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Nama file tidak diberikan" },
        { status: 400 }
      );
    }

    // Security check - prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "Nama file tidak valid" },
        { status: 400 }
      );
    }

    const filepath = `images/${filename}`;

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filepath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { success: false, error: "Gagal menghapus file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus file" },
      { status: 500 }
    );
  }
}
