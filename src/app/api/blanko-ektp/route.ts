import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch blanko E-KTP availability (public)
export async function GET() {
  try {
    const blanko = await db.blankoEKTP.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: blanko || {
        id: null,
        jumlahTersedia: 0,
        keterangan: null,
        updatedAt: null,
      },
    });
  } catch (error) {
    console.error("Error fetching blanko E-KTP:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data blanko E-KTP" },
      { status: 500 }
    );
  }
}

// PUT - Update blanko E-KTP availability (admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { jumlahTersedia, keterangan, updatedBy } = body;

    // Validate input
    if (typeof jumlahTersedia !== "number" || jumlahTersedia < 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah tersedia harus berupa angka positif" },
        { status: 400 }
      );
    }

    // Check if a record already exists
    const existing = await db.blankoEKTP.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    let blanko;

    if (existing) {
      // Update existing record
      blanko = await db.blankoEKTP.update({
        where: { id: existing.id },
        data: {
          jumlahTersedia,
          keterangan: keterangan || null,
          updatedBy: updatedBy || null,
        },
      });
    } else {
      // Create new record
      blanko = await db.blankoEKTP.create({
        data: {
          jumlahTersedia,
          keterangan: keterangan || null,
          updatedBy: updatedBy || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: blanko,
      message: "Data blanko E-KTP berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating blanko E-KTP:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data blanko E-KTP" },
      { status: 500 }
    );
  }
}
