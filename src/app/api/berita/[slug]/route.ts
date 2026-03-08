import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to check if string is a CUID
function isCuid(str: string): boolean {
  return str.startsWith("c") && str.length === 25;
}

// GET - Fetch single news by slug or id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Try to find by slug first, then by id
    let news = await db.berita.findUnique({
      where: { slug },
    });

    if (!news && isCuid(slug)) {
      news = await db.berita.findUnique({
        where: { id: slug },
      });
    }

    if (!news) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil berita" },
      { status: 500 }
    );
  }
}

// PUT - Update news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, content, category, thumbnail, author, isPublished } = body;

    // Find news by slug or id
    let existing = await db.berita.findUnique({
      where: { slug },
    });

    if (!existing && isCuid(slug)) {
      existing = await db.berita.findUnique({
        where: { id: slug },
      });
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    // Generate slug if title changed
    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slugExists = await db.berita.findFirst({
        where: {
          slug: baseSlug,
          NOT: { id: existing.id },
        },
      });
      newSlug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const news = await db.berita.update({
      where: { id: existing.id },
      data: {
        ...(title && { title, slug: newSlug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(author !== undefined && { author }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui berita" },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find news by slug or id
    let existing = await db.berita.findUnique({
      where: { slug },
    });

    if (!existing && isCuid(slug)) {
      existing = await db.berita.findUnique({
        where: { id: slug },
      });
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.berita.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
