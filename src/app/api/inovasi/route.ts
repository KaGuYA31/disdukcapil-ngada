import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/retry";

// GET - Fetch all published innovation activities or single by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // If ID is provided, fetch single item
    if (id) {
      const inovasi = await db.inovasi.findUnique({
        where: { id },
      });

      if (!inovasi) {
        return NextResponse.json(
          { success: false, error: "Inovasi tidak ditemukan" },
          { status: 404 }
        );
      }

      // Increment view count
      await db.inovasi.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return NextResponse.json({
        success: true,
        data: inovasi,
      });
    }

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category && category !== "Semua") {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const [inovasi, total, categoriesResult] = await withRetry(
      () => Promise.all([
        db.inovasi.findMany({
          where,
          orderBy: { date: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.inovasi.count({ where }),
        db.inovasi.groupBy({
          by: ["category"],
          where: { isPublished: true },
          orderBy: { category: "asc" },
        }),
      ]),
      { context: "Inovasi GET", maxRetries: 2, delayMs: 300 }
    );

    const categories = categoriesResult
      .map((r) => r.category)
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: inovasi,
      categories,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching innovation activities:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data inovasi" },
      { status: 500 }
    );
  }
}

// POST - Create new innovation activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      photo,
      photos,
      location,
      date,
      category,
      isPublished,
      author,
    } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: "Judul, deskripsi, dan konten harus diisi" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    // Check if slug exists and make it unique
    const existing = await db.inovasi.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const inovasi = await db.inovasi.create({
      data: {
        title,
        slug,
        description,
        content,
        photo: photo || null,
        photos: photos && Array.isArray(photos) && photos.length > 0 ? JSON.stringify(photos) : null,
        location: location || null,
        date: date ? new Date(date) : null,
        category: category || "Jemput Bola",
        isPublished: isPublished ?? true,
        author: author || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: inovasi,
      message: "Inovasi berhasil dibuat",
    });
  } catch (error) {
    console.error("Error creating innovation activity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat inovasi" },
      { status: 500 }
    );
  }
}

// PUT - Update innovation activity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      content,
      photo,
      photos,
      location,
      date,
      category,
      isPublished,
      author,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID inovasi harus diisi" },
        { status: 400 }
      );
    }

    // Check if innovation exists
    const existing = await db.inovasi.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Inovasi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Generate new slug if title changes
    let slug = existing.slug;
    if (title && title !== existing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);

      const slugExists = await db.inovasi.findUnique({ where: { slug: baseSlug } });
      slug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const inovasi = await db.inovasi.update({
      where: { id },
      data: {
        title: title || existing.title,
        slug,
        description: description || existing.description,
        content: content || existing.content,
        photo: photo !== undefined ? photo : existing.photo,
        photos: photos !== undefined ? (Array.isArray(photos) && photos.length > 0 ? JSON.stringify(photos) : null) : existing.photos,
        location: location !== undefined ? location : existing.location,
        date: date ? new Date(date) : existing.date,
        category: category || existing.category,
        isPublished: isPublished !== undefined ? isPublished : existing.isPublished,
        author: author !== undefined ? author : existing.author,
      },
    });

    return NextResponse.json({
      success: true,
      data: inovasi,
      message: "Inovasi berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating innovation activity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui inovasi" },
      { status: 500 }
    );
  }
}

// DELETE - Delete innovation activity
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID inovasi harus diisi" },
        { status: 400 }
      );
    }

    // Check if innovation exists
    const existing = await db.inovasi.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Inovasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.inovasi.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Inovasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting innovation activity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus inovasi" },
      { status: 500 }
    );
  }
}
