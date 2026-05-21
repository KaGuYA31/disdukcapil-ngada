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

    // Build WHERE clause
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!all) {
      conditions.push('"isPublished" = true');
    }
    if (category && category !== "Semua") {
      params.push(category);
      conditions.push(`"category" = $${conditions.length + 1}`);
    }
    if (q) {
      const pattern = `%${q}%`;
      params.push(pattern, pattern, pattern);
      conditions.push(`("title" ILIKE $${conditions.length + 1} OR "excerpt" ILIKE $${conditions.length + 2} OR "content" ILIKE $${conditions.length + 3})`);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const selectQuery = `SELECT * FROM "berita"${whereClause} ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset}`;
    const countQuery = `SELECT COUNT(*)::int as count FROM "berita"${whereClause}`;

    const [rows, countRows] = await Promise.all([
      params.length > 0 ? db.$queryRawUnsafe(selectQuery, ...params) : db.$queryRawUnsafe(selectQuery),
      params.length > 0 ? db.$queryRawUnsafe(countQuery, ...params) : db.$queryRawUnsafe(countQuery),
    ]);

    const total = Array.isArray(countRows) && countRows.length > 0
      ? (countRows as { count: number }[])[0].count : 0;

    return NextResponse.json(
      {
        success: true,
        data: rows,
        pagination: { total, page, pageSize: limit, totalPages: Math.ceil(total / limit) },
      },
      {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
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

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

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
