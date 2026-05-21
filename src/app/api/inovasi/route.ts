import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

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
        videos: videos && Array.isArray(videos) && videos.length > 0 ? JSON.stringify(videos) : null,
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

    const existing = await db.inovasi.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Inovasi tidak ditemukan" },
        { status: 404 }
      );
    }

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
        videos: videos !== undefined ? (Array.isArray(videos) && videos.length > 0 ? JSON.stringify(videos) : null) : existing.videos,
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
