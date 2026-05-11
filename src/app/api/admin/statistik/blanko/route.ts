import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch blanko EKTP data
export async function GET() {
  try {
    const blanko = await db.blankoEKTP.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: blanko,
    });
  } catch (error) {
    console.error("Error fetching blanko EKTP:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data blanko EKTP" },
      { status: 500 }
    );
  }
}

// POST - Create or update blanko EKTP data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jumlahTersedia, keterangan } = body;

    // Check if there's existing data
    const existing = await db.blankoEKTP.findFirst();

    let blanko;
    if (existing) {
      // Update existing
      blanko = await db.blankoEKTP.update({
        where: { id: existing.id },
        data: {
          jumlahTersedia: jumlahTersedia ?? existing.jumlahTersedia,
          keterangan: keterangan !== undefined ? keterangan : existing.keterangan,
        },
      });
    } else {
      // Create new
      blanko = await db.blankoEKTP.create({
        data: {
          jumlahTersedia: jumlahTersedia || 0,
          keterangan: keterangan || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: blanko,
      message: "Data blanko EKTP berhasil disimpan",
    });
  } catch (error) {
    console.error("Error saving blanko EKTP:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data blanko EKTP" },
      { status: 500 }
    );
  }
}
