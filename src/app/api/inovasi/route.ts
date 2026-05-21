import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// Ensure columns exist (safe to run multiple times)
async function ensureColumns() {
  try {
    await db.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "inovasi" ADD COLUMN IF NOT EXISTS "photos" TEXT;
        ALTER TABLE "inovasi" ADD COLUMN IF NOT EXISTS "videos" TEXT;
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);
  } catch {
    // Columns might already exist or this is SQLite - ignore errors
  }
}

// GET - Fetch innovation activities (using raw SQL for schema resilience)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const all = searchParams.get("all") === "true";

    // If ID is provided, fetch single item
    if (id) {
      const safeId = id.replace(/'/g, "''");
      const rows = await db.$queryRawUnsafe(
        `SELECT * FROM "inovasi" WHERE "id" = '${safeId}' LIMIT 1`
      );
      if (!Array.isArray(rows) || (rows as Record<string, unknown>[]).length === 0) {
        return NextResponse.json(
          { success: false, error: "Inovasi tidak ditemukan" },
          { status: 404 }
        );
      }
      const inovasi = (rows as Record<string, unknown>[])[0];
      await db.$executeRawUnsafe(
        `UPDATE "inovasi" SET "viewCount" = COALESCE("viewCount", 0) + 1 WHERE "id" = '${safeId}'`
      );
      return NextResponse.json({ success: true, data: inovasi });
    }

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
      conditions.push(`("title" ILIKE $${conditions.length + 1} OR "description" ILIKE $${conditions.length + 2} OR "content" ILIKE $${conditions.length + 3})`);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const selectQuery = `SELECT * FROM "inovasi"${whereClause} ORDER BY COALESCE("date", "createdAt") DESC LIMIT ${limit} OFFSET ${offset}`;
    const countQuery = `SELECT COUNT(*)::int as count FROM "inovasi"${whereClause}`;
    const catQuery = `SELECT "category", COUNT(*)::int as count FROM "inovasi" WHERE ${all ? '1=1' : '"isPublished" = true'} GROUP BY "category" ORDER BY "category" ASC`;

    const [rows, countRows, catRows] = await Promise.all([
      params.length > 0 ? db.$queryRawUnsafe(selectQuery, ...params) : db.$queryRawUnsafe(selectQuery),
      params.length > 0 ? db.$queryRawUnsafe(countQuery, ...params) : db.$queryRawUnsafe(countQuery),
      db.$queryRawUnsafe(catQuery),
    ]);

    const total = Array.isArray(countRows) && countRows.length > 0
      ? (countRows as { count: number }[])[0].count : 0;
    const categories = Array.isArray(catRows)
      ? (catRows as { category: string; count: number }[]).map((r) => r.category).filter(Boolean)
      : [];

    return NextResponse.json(
      {
        success: true,
        data: rows,
        categories,
        pagination: { total, page, pageSize: limit, totalPages: Math.ceil(total / limit) },
      },
      {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      }
    );
  } catch (error) {
    console.error("Error fetching innovation activities:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data inovasi", debug: msg },
      { status: 500 }
    );
  }
}

// POST - Create new innovation activity (raw SQL)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      photo,
      photos,
      videos,
      location,
      date,
      category,
      isPublished,
      author,
    } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: "Judul, deskripsi, dan konten harus diisi" },
        { status: 400 }
      );
    }

    // Ensure photos/videos columns exist in production DB
    await ensureColumns();

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    // Check for existing slug using raw SQL
    const existing = await db.$queryRawUnsafe(
      `SELECT "id" FROM "inovasi" WHERE "slug" = $1 LIMIT 1`,
      baseSlug
    );
    const slug = Array.isArray(existing) && (existing as any[]).length > 0
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;

    const id = randomUUID();
    const photosValue = photos && Array.isArray(photos) && photos.length > 0
      ? JSON.stringify(photos) : null;
    const videosValue = videos && Array.isArray(videos) && videos.length > 0
      ? JSON.stringify(videos) : null;

    // Insert using parameterized raw SQL
    await db.$executeRawUnsafe(
      `INSERT INTO "inovasi" ("id", "title", "slug", "description", "content", "photo", "photos", "videos", "location", "date", "category", "isPublished", "author", "viewCount", "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, 0, NOW(), NOW())`,
      id, title, slug, description, content,
      photo || null, photosValue, videosValue,
      location || null, date ? new Date(date) : null,
      category || "Jemput Bola", isPublished !== false,
      author || null
    );

    // Fetch the created record
    const rows = await db.$queryRawUnsafe(
      `SELECT * FROM "inovasi" WHERE "id" = $1`,
      id
    );

    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? (rows as any[])[0] : null,
      message: "Inovasi berhasil dibuat",
    });
  } catch (error) {
    console.error("Error creating innovation activity:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat inovasi", debug: msg },
      { status: 500 }
    );
  }
}

// PUT - Update innovation activity (raw SQL)
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
      videos,
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

    await ensureColumns();

    // Check if exists
    const existingRows = await db.$queryRawUnsafe(
      `SELECT * FROM "inovasi" WHERE "id" = $1 LIMIT 1`,
      id
    );

    if (!Array.isArray(existingRows) || (existingRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Inovasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = (existingRows as any[])[0];

    // Generate new slug if title changed
    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);
      const slugCheck = await db.$queryRawUnsafe(
        `SELECT "id" FROM "inovasi" WHERE "slug" = $1 AND "id" != $2 LIMIT 1`,
        baseSlug, id
      );
      newSlug = Array.isArray(slugCheck) && (slugCheck as any[]).length > 0
        ? `${baseSlug}-${Date.now()}`
        : baseSlug;
    }

    // Build dynamic UPDATE
    const setClauses: string[] = [`"updatedAt" = NOW()`];
    const values: unknown[] = [];
    let paramIdx = 0;

    if (title) {
      paramIdx++;
      setClauses.push(`"title" = $${paramIdx}`);
      values.push(title);
      paramIdx++;
      setClauses.push(`"slug" = $${paramIdx}`);
      values.push(newSlug);
    }
    if (description) {
      paramIdx++;
      setClauses.push(`"description" = $${paramIdx}`);
      values.push(description);
    }
    if (content) {
      paramIdx++;
      setClauses.push(`"content" = $${paramIdx}`);
      values.push(content);
    }
    if (photo !== undefined) {
      paramIdx++;
      setClauses.push(`"photo" = $${paramIdx}`);
      values.push(photo);
    }
    if (photos !== undefined) {
      paramIdx++;
      setClauses.push(`"photos" = $${paramIdx}`);
      values.push(Array.isArray(photos) && photos.length > 0 ? JSON.stringify(photos) : null);
    }
    if (videos !== undefined) {
      paramIdx++;
      setClauses.push(`"videos" = $${paramIdx}`);
      values.push(Array.isArray(videos) && videos.length > 0 ? JSON.stringify(videos) : null);
    }
    if (location !== undefined) {
      paramIdx++;
      setClauses.push(`"location" = $${paramIdx}`);
      values.push(location);
    }
    if (date) {
      paramIdx++;
      setClauses.push(`"date" = $${paramIdx}`);
      values.push(new Date(date));
    }
    if (category) {
      paramIdx++;
      setClauses.push(`"category" = $${paramIdx}`);
      values.push(category);
    }
    if (isPublished !== undefined) {
      paramIdx++;
      setClauses.push(`"isPublished" = $${paramIdx}`);
      values.push(isPublished);
    }
    if (author !== undefined) {
      paramIdx++;
      setClauses.push(`"author" = $${paramIdx}`);
      values.push(author);
    }

    values.push(id);

    await db.$executeRawUnsafe(
      `UPDATE "inovasi" SET ${setClauses.join(", ")} WHERE "id" = $${paramIdx + 1}`,
      ...values
    );

    // Fetch updated record
    const updated = await db.$queryRawUnsafe(
      `SELECT * FROM "inovasi" WHERE "id" = $1`,
      id
    );

    return NextResponse.json({
      success: true,
      data: Array.isArray(updated) ? (updated as any[])[0] : null,
      message: "Inovasi berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating innovation activity:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui inovasi", debug: msg },
      { status: 500 }
    );
  }
}

// DELETE - Delete innovation activity (raw SQL)
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

    // Check if exists
    const existingRows = await db.$queryRawUnsafe(
      `SELECT "id" FROM "inovasi" WHERE "id" = $1 LIMIT 1`,
      id
    );

    if (!Array.isArray(existingRows) || (existingRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Inovasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.$executeRawUnsafe(
      `DELETE FROM "inovasi" WHERE "id" = $1`,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Inovasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting innovation activity:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus inovasi", debug: msg },
      { status: 500 }
    );
  }
}
