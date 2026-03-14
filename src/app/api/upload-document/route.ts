import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Supabase belum dikonfigurasi. Silakan tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables." 
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "documents";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validate file type - allow images and documents
    const allowedTypes = [
      "image/jpeg", 
      "image/png", 
      "image/gif", 
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipe file tidak diizinkan. Gunakan PDF, Word, Excel, atau gambar (JPG, PNG)" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 10MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "pdf";
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_").substring(0, 50);
    const filename = `${originalName}-${timestamp}-${randomString}.${extension}`;
    const filepath = `${folder}/${filename}`;

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

    // Format file size
    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: filename,
      originalName: file.name,
      path: data.path,
      size: formatFileSize(file.size),
      type: file.type,
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
    const filepath = searchParams.get("path");

    if (!filepath) {
      return NextResponse.json(
        { success: false, error: "Path file tidak diberikan" },
        { status: 400 }
      );
    }

    // Security check - prevent directory traversal
    if (filepath.includes("..")) {
      return NextResponse.json(
        { success: false, error: "Path file tidak valid" },
        { status: 400 }
      );
    }

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
