import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * One-time setup: ensures berita and inovasi tables exist with all required columns.
 * Call POST /api/setup-schema to run.
 * Safe to run multiple times (idempotent).
 */
export async function POST() {
  try {
    // Step 1: Check what tables exist
    const tableCheck = await db.$queryRawUnsafe(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('berita', 'inovasi');
    `);
    const existingTables = new Set(
      (tableCheck as { table_name: string }[]).map(r => r.table_name)
    );

    // Step 2: Create missing tables
    if (!existingTables.has("berita")) {
      await db.$executeRawUnsafe(`
        CREATE TABLE "berita" (
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
    }

    if (!existingTables.has("inovasi")) {
      await db.$executeRawUnsafe(`
        CREATE TABLE "inovasi" (
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
    }

    // Step 3: Add missing columns to berita
    const beritaCols = await db.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'berita' AND table_schema = 'public';
    `);
    const existingBeritaCols = new Set(
      (beritaCols as { column_name: string }[]).map(r => r.column_name)
    );

    const beritaRequired = [
      { name: "photos", type: "TEXT" },
      { name: "videos", type: "TEXT" },
      { name: "authorId", type: "TEXT" },
      { name: "viewCount", type: "INTEGER NOT NULL DEFAULT 0" },
      { name: "thumbnail", type: "TEXT" },
      { name: "excerpt", type: "TEXT" },
      { name: "isPublished", type: "BOOLEAN NOT NULL DEFAULT true" },
    ];

    for (const col of beritaRequired) {
      if (!existingBeritaCols.has(col.name)) {
        await db.$executeRawUnsafe(
          `ALTER TABLE "berita" ADD COLUMN "${col.name}" ${col.type};`
        );
      }
    }

    // Step 4: Add missing columns to inovasi
    const inovasiCols = await db.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'inovasi' AND table_schema = 'public';
    `);
    const existingInovasiCols = new Set(
      (inovasiCols as { column_name: string }[]).map(r => r.column_name)
    );

    const inovasiRequired = [
      { name: "photos", type: "TEXT" },
      { name: "videos", type: "TEXT" },
      { name: "viewCount", type: "INTEGER NOT NULL DEFAULT 0" },
      { name: "order", type: "INTEGER NOT NULL DEFAULT 0" },
    ];

    for (const col of inovasiRequired) {
      if (!existingInovasiCols.has(col.name)) {
        await db.$executeRawUnsafe(
          `ALTER TABLE "inovasi" ADD COLUMN "${col.name}" ${col.type};`
        );
      }
    }

    // Verify
    const finalBerita = await db.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'berita' AND table_schema = 'public' AND column_name = 'videos';
    `);
    const finalInovasi = await db.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'inovasi' AND table_schema = 'public' AND column_name = 'videos';
    `);

    return NextResponse.json({
      success: true,
      message: "Schema updated successfully",
      details: {
        beritaVideosExists: (finalBerita as { column_name: string }[]).length > 0,
        inovasiVideosExists: (finalInovasi as { column_name: string }[]).length > 0,
      },
    });
  } catch (error) {
    console.error("Schema setup error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update schema" },
      { status: 500 }
    );
  }
}
