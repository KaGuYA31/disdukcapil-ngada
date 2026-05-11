import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch ringkasan data
export async function GET() {
  try {
    const ringkasan = await db.dataRingkasan.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: ringkasan,
    });
  } catch (error) {
    console.error("Error fetching ringkasan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data ringkasan" },
      { status: 500 }
    );
  }
}

// POST - Create or update ringkasan data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { periode, totalPenduduk, lakiLaki, perempuan, rasioJK } = body;

    // Check if there's existing data
    const existing = await db.dataRingkasan.findFirst();

    let ringkasan;
    if (existing) {
      // Update existing
      ringkasan = await db.dataRingkasan.update({
        where: { id: existing.id },
        data: {
          periode: periode || existing.periode,
          totalPenduduk: totalPenduduk ?? existing.totalPenduduk,
          lakiLaki: lakiLaki ?? existing.lakiLaki,
          perempuan: perempuan ?? existing.perempuan,
          rasioJK: rasioJK ?? existing.rasioJK,
        },
      });
    } else {
      // Create new
      ringkasan = await db.dataRingkasan.create({
        data: {
          periode: periode || "Periode Baru",
          totalPenduduk: totalPenduduk || 0,
          lakiLaki: lakiLaki || 0,
          perempuan: perempuan || 0,
          rasioJK: rasioJK || 0,
          jumlahKecamatan: 12,
          jumlahKelurahan: 206,
          jumlahDisabilitas: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: ringkasan,
      message: "Data ringkasan berhasil disimpan",
    });
  } catch (error) {
    console.error("Error saving ringkasan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data ringkasan" },
      { status: 500 }
    );
  }
}
