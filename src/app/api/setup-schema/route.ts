import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * One-time setup: ensures all tables and columns exist in the production database.
 * Call POST /api/setup-schema to run.
 * Safe to run multiple times (idempotent).
 */
export async function POST() {
  try {
    // Create berita table if not exists
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "berita" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "thumbnail" TEXT,
        "photos" TEXT,
        "videos" TEXT,
        "category" TEXT NOT NULL DEFAULT 'Umum',
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "authorId" TEXT,
        "author" TEXT,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create inovasi table if not exists
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "inovasi" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "photo" TEXT,
        "photos" TEXT,
        "videos" TEXT,
        "location" TEXT,
        "date" TIMESTAMP(3),
        "category" TEXT NOT NULL DEFAULT 'Jemput Bola',
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "author" TEXT,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add missing columns to berita (if table exists but columns don't)
    const beritaColumns = [
      { name: "photos", type: "TEXT" },
      { name: "videos", type: "TEXT" },
      { name: "authorId", type: "TEXT" },
    ];

    for (const col of beritaColumns) {
      await db.$executeRawUnsafe(`
        DO $$ BEGIN
          ALTER TABLE "berita" ADD COLUMN "${col.name}" ${col.type};
        EXCEPTION WHEN duplicate_column THEN NULL;
        END $$;
      `);
    }

    // Add missing columns to inovasi (if table exists but columns don't)
    const inovasiColumns = [
      { name: "photos", type: "TEXT" },
      { name: "videos", type: "TEXT" },
    ];

    for (const col of inovasiColumns) {
      await db.$executeRawUnsafe(`
        DO $$ BEGIN
          ALTER TABLE "inovasi" ADD COLUMN "${col.name}" ${col.type};
        EXCEPTION WHEN duplicate_column THEN NULL;
        END $$;
      `);
    }

    return NextResponse.json({
      success: true,
      message: "Schema updated successfully. Tables created and columns added.",
    });
  } catch (error) {
    console.error("Schema setup error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update schema" },
      { status: 500 }
    );
  }
}
