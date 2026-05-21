import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// Ensure columns exist (safe to run multiple times)
async function ensureColumns() {
  try {
    await db.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "berita" ADD COLUMN IF NOT EXISTS "photos" TEXT;
        ALTER TABLE "berita" ADD COLUMN IF NOT EXISTS "videos" TEXT;
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);
  } catch {
    // Columns might already exist or this is SQLite - ignore errors
  }
}

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

// POST - Create new news (using raw SQL for schema resilience)
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

    // Ensure photos/videos columns exist in production DB
    await ensureColumns();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    // Check for existing slug using raw SQL
    const existing = await db.$queryRawUnsafe(
      `SELECT "id" FROM "berita" WHERE "slug" = $1 LIMIT 1`,
      slug
    );
    const finalSlug = Array.isArray(existing) && (existing as any[]).length > 0
      ? `${slug}-${Date.now()}`
      : slug;

    const id = randomUUID();
    const excerptValue = excerpt || content.substring(0, 150) + "...";
    const photosValue = photos && Array.isArray(photos) && photos.length > 0
      ? JSON.stringify(photos) : null;
    const videosValue = videos && Array.isArray(videos) && videos.length > 0
      ? JSON.stringify(videos) : null;

    // Insert using parameterized raw SQL
    await db.$executeRawUnsafe(
      `INSERT INTO "berita" ("id", "title", "slug", "content", "excerpt", "category", "thumbnail", "photos", "videos", "author", "isPublished", "viewCount", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, NOW(), NOW())`,
      id, title, finalSlug, content, excerptValue, category || "Umum", thumbnail || null,
      photosValue, videosValue, author || null, isPublished !== false
    );

    // Fetch the created record
    const rows = await db.$queryRawUnsafe(
      `SELECT * FROM "berita" WHERE "id" = $1`,
      id
    );

    const news = Array.isArray(rows) ? (rows as any[])[0] : null;

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Error creating news:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat berita", debug: msg },
      { status: 500 }
    );
  }
}
