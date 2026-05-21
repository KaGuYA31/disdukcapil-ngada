import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to check if string is a CUID
function isCuid(str: string): boolean {
  return str.startsWith("c") && str.length === 25;
}

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

// GET - Fetch single news by slug or id (raw SQL)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const safeSlug = slug.replace(/'/g, "''");

    let rows;
    if (isCuid(slug)) {
      // Try by id first, then by slug
      rows = await db.$queryRawUnsafe(
        `SELECT * FROM "berita" WHERE "id" = '${safeSlug}' LIMIT 1`
      );
      if (!Array.isArray(rows) || (rows as any[]).length === 0) {
        rows = await db.$queryRawUnsafe(
          `SELECT * FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
        );
      }
    } else {
      rows = await db.$queryRawUnsafe(
        `SELECT * FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
      );
    }

    if (!Array.isArray(rows) || (rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: (rows as any[])[0] });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil berita" },
      { status: 500 }
    );
  }
}

// PUT - Update news (raw SQL)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, content, category, thumbnail, photos, videos, author, isPublished } = body;

    await ensureColumns();

    const safeSlug = slug.replace(/'/g, "''");

    // Find news by slug or id
    let rows;
    if (isCuid(slug)) {
      rows = await db.$queryRawUnsafe(
        `SELECT * FROM "berita" WHERE "id" = '${safeSlug}' LIMIT 1`
      );
      if (!Array.isArray(rows) || (rows as any[]).length === 0) {
        rows = await db.$queryRawUnsafe(
          `SELECT * FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
        );
      }
    } else {
      rows = await db.$queryRawUnsafe(
        `SELECT * FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
      );
    }

    if (!Array.isArray(rows) || (rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = (rows as any[])[0];

    // Generate new slug if title changed
    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slugCheck = await db.$queryRawUnsafe(
        `SELECT "id" FROM "berita" WHERE "slug" = $1 AND "id" != $2 LIMIT 1`,
        baseSlug, existing.id
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
    if (excerpt !== undefined) {
      paramIdx++;
      setClauses.push(`"excerpt" = $${paramIdx}`);
      values.push(excerpt);
    }
    if (content) {
      paramIdx++;
      setClauses.push(`"content" = $${paramIdx}`);
      values.push(content);
    }
    if (category) {
      paramIdx++;
      setClauses.push(`"category" = $${paramIdx}`);
      values.push(category);
    }
    if (thumbnail !== undefined) {
      paramIdx++;
      setClauses.push(`"thumbnail" = $${paramIdx}`);
      values.push(thumbnail);
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
    if (author !== undefined) {
      paramIdx++;
      setClauses.push(`"author" = $${paramIdx}`);
      values.push(author);
    }
    if (isPublished !== undefined) {
      paramIdx++;
      setClauses.push(`"isPublished" = $${paramIdx}`);
      values.push(isPublished);
    }

    values.push(existing.id);

    await db.$executeRawUnsafe(
      `UPDATE "berita" SET ${setClauses.join(", ")} WHERE "id" = $${paramIdx + 1}`,
      ...values
    );

    // Fetch updated record
    const updated = await db.$queryRawUnsafe(
      `SELECT * FROM "berita" WHERE "id" = $1`,
      existing.id
    );

    return NextResponse.json({
      success: true,
      data: Array.isArray(updated) ? (updated as any[])[0] : null,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui berita", debug: msg },
      { status: 500 }
    );
  }
}

// DELETE - Delete news (raw SQL)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const safeSlug = slug.replace(/'/g, "''");

    // Find news by slug or id
    let rows;
    if (isCuid(slug)) {
      rows = await db.$queryRawUnsafe(
        `SELECT "id" FROM "berita" WHERE "id" = '${safeSlug}' LIMIT 1`
      );
      if (!Array.isArray(rows) || (rows as any[]).length === 0) {
        rows = await db.$queryRawUnsafe(
          `SELECT "id" FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
        );
      }
    } else {
      rows = await db.$queryRawUnsafe(
        `SELECT "id" FROM "berita" WHERE "slug" = '${safeSlug}' LIMIT 1`
      );
    }

    if (!Array.isArray(rows) || (rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.$executeRawUnsafe(
      `DELETE FROM "berita" WHERE "id" = $1`,
      (rows as any[])[0].id
    );

    return NextResponse.json({ success: true, message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting news:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus berita", debug: msg },
      { status: 500 }
    );
  }
}
