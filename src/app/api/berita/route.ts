import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all news (using raw SQL for schema resilience)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const all = searchParams.get("all") === "true";

    let whereClause = "";
    const params: string[] = [];
    let paramIndex = 1;

    if (!all) {
      whereClause += ` AND "isPublished" = true`;
    }
    if (category && category !== "Semua") {
      params.push(category);
      whereClause += ` AND "category" = $${paramIndex++}`;
    }
    if (q) {
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
      whereClause += ` AND ("title" ILIKE $${paramIndex} OR "excerpt" ILIKE $${paramIndex + 1} OR "content" ILIKE $${paramIndex + 2})`;
      paramIndex += 3;
    }

    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db.$queryRawUnsafe(
        `SELECT * FROM "berita" WHERE 1=1${whereClause} ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset}`,
      ),
      db.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "berita" WHERE 1=1${whereClause}`,
      ),
    ]);

    // Replace parameter placeholders
    let finalRows = rows;
    if (params.length > 0) {
      const finalQuery = `SELECT * FROM "berita" WHERE 1=1${whereClause} ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset}`;
      finalRows = await db.$queryRawUnsafe(finalQuery, ...params);

      const finalCountQuery = `SELECT COUNT(*)::int as count FROM "berita" WHERE 1=1${whereClause}`;
      const countRows = await db.$queryRawUnsafe(finalCountQuery, ...params);
      (countResult as { count: number }[]))[0].count;
    }

    const total = (countResult as { count: number }[])[0]?.count || 0;

    return NextResponse.json(
      {
        success: true,
        data: finalRows,
        pagination: {
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data berita", debug: msg },
      { status: 500 }
    );
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, thumbnail, photos, videos, author, isPublished } = body;

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
        videos: videos && Array.isArray(videos) && videos.length > 0 ? JSON.stringify(videos) : null,
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
