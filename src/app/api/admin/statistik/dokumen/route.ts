import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch ringkasan dokumen
export async function GET() {
  try {
    const dokumen = await db.ringkasanDokumen.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: dokumen,
    });
  } catch (error) {
    console.error("Error fetching ringkasan dokumen:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dokumen" },
      { status: 500 }
    );
  }
}

// POST - Create or update ringkasan dokumen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ektpCetak, ektpBelum, aktaLahir, aktaBelum, kiaMiliki, kiaBelum } = body;

    // Check if there's existing data
    const existing = await db.ringkasanDokumen.findFirst();

    let dokumen;
    if (existing) {
      // Update existing
      dokumen = await db.ringkasanDokumen.update({
        where: { id: existing.id },
        data: {
          ektpCetak: ektpCetak ?? existing.ektpCetak,
          ektpBelum: ektpBelum ?? existing.ektpBelum,
          aktaLahir: aktaLahir ?? existing.aktaLahir,
          aktaBelum: aktaBelum ?? existing.aktaBelum,
          kiaMiliki: kiaMiliki ?? existing.kiaMiliki,
          kiaBelum: kiaBelum ?? existing.kiaBelum,
        },
      });
    } else {
      // Create new
      dokumen = await db.ringkasanDokumen.create({
        data: {
          ektpCetak: ektpCetak || 0,
          ektpBelum: ektpBelum || 0,
          aktaLahir: aktaLahir || 0,
          aktaBelum: aktaBelum || 0,
          kiaMiliki: kiaMiliki || 0,
          kiaBelum: kiaBelum || 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: dokumen,
      message: "Data dokumen berhasil disimpan",
    });
  } catch (error) {
    console.error("Error saving ringkasan dokumen:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data dokumen" },
      { status: 500 }
    );
  }
}
