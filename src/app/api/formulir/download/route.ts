import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Increment downloadCount for a given formulir code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameter code wajib diisi",
        },
        { status: 400 }
      );
    }

    const formulir = await db.formulir.findUnique({
      where: { code },
    });

    if (!formulir) {
      return NextResponse.json(
        {
          success: false,
          error: "Formulir tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const updated = await db.formulir.update({
      where: { code },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Download count berhasil ditambah",
      data: {
        code: updated.code,
        downloadCount: updated.downloadCount,
      },
    });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menambah download count",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
