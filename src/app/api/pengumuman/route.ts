import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch active announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const announcements = await db.pengumuman.findMany({
      where: {
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pengumuman" },
      { status: 500 }
    );
  }
}
