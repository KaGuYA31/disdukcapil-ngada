import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all pimpinan data
export async function GET() {
  try {
    const pimpinanList = await db.pimpinan.findMany({
      orderBy: { role: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: pimpinanList,
    });
  } catch (error) {
    console.error("Error fetching pimpinan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pimpinan" },
      { status: 500 }
    );
  }
}

// POST/PUT - Upsert pimpinan data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, name, photo, periode } = body;

    if (!role || !name) {
      return NextResponse.json(
        { success: false, error: "Role dan nama wajib diisi" },
        { status: 400 }
      );
    }

    // Upsert: create or update by role
    const pimpinan = await db.pimpinan.upsert({
      where: { role },
      create: { role, name, photo: photo || null, periode: periode || null },
      update: { name, photo: photo || null, periode: periode || null },
    });

    return NextResponse.json({
      success: true,
      data: pimpinan,
    });
  } catch (error) {
    console.error("Error saving pimpinan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data pimpinan" },
      { status: 500 }
    );
  }
}

// POST - Create pimpinan (alternative)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, name, photo, periode } = body;

    if (!role || !name) {
      return NextResponse.json(
        { success: false, error: "Role dan nama wajib diisi" },
        { status: 400 }
      );
    }

    // Upsert: create or update by role
    const pimpinan = await db.pimpinan.upsert({
      where: { role },
      create: { role, name, photo: photo || null, periode: periode || null },
      update: { name, photo: photo || null, periode: periode || null },
    });

    return NextResponse.json({
      success: true,
      data: pimpinan,
    });
  } catch (error) {
    console.error("Error saving pimpinan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data pimpinan" },
      { status: 500 }
    );
  }
}
