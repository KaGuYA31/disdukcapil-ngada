import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category && category !== "Semua") {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const [news, total] = await Promise.all([
      db.berita.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.berita.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data berita" },
      { status: 500 }
    );
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, thumbnail, photos, author, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan konten harus diisi" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    // Check if slug exists
    const existing = await db.berita.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const news = await db.berita.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || content.substring(0, 150) + "...",
        content,
        category: category || "Umum",
        thumbnail,
        photos: photos && Array.isArray(photos) && photos.length > 0 ? JSON.stringify(photos) : null,
        author,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat berita" },
      { status: 500 }
    );
  }
}
