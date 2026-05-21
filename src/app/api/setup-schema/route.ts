import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * One-time setup: ensures all columns exist in the production database.
 * Call POST /api/setup-schema to run.
 * Safe to run multiple times (idempotent).
 */
export async function POST() {
  try {
    const statements = [
      // Berita table
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'berita' AND column_name = 'videos') THEN
          ALTER TABLE "berita" ADD COLUMN "videos" TEXT;
        END IF;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;`,
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'berita' AND column_name = 'photos') THEN
          ALTER TABLE "berita" ADD COLUMN "photos" TEXT;
        END IF;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;`,
      // Inovasi table
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inovasi' AND column_name = 'videos') THEN
          ALTER TABLE "inovasi" ADD COLUMN "videos" TEXT;
        END IF;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;`,
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inovasi' AND column_name = 'photos') THEN
          ALTER TABLE "inovasi" ADD COLUMN "photos" TEXT;
        END IF;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;`,
    ];

    for (const sql of statements) {
      await db.$executeRawUnsafe(sql);
    }

    return NextResponse.json({
      success: true,
      message: "Schema updated successfully",
    });
  } catch (error) {
    console.error("Schema setup error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update schema" },
      { status: 500 }
    );
  }
}
