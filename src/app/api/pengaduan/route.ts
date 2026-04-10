import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all complaints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where: { status?: string } = {};
    if (status) {
      where.status = status;
    }

    const [complaints, total] = await Promise.all([
      db.pengaduan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.pengaduan.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pengaduan" },
      { status: 500 }
    );
  }
}

// POST - Create new complaint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nik, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib harus diisi" },
        { status: 400 }
      );
    }

    const complaint = await db.pengaduan.create({
      data: {
        name,
        nik: nik || null,
        email,
        phone,
        subject,
        message,
        status: "Baru",
      },
    });

    return NextResponse.json({
      success: true,
      data: complaint,
      message: "Pengaduan berhasil dikirim",
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim pengaduan" },
      { status: 500 }
    );
  }
}
