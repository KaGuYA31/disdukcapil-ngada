import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - List all online services or submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "services" or "submissions"
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (type === "services") {
      // Get all layanan that can be done online
      const layanan = await db.layanan.findMany({
        where: {
          isActive: true,
          isOnline: true,
        },
        orderBy: { order: "asc" },
      });

      return NextResponse.json({
        success: true,
        data: layanan.map((l) => ({
          ...l,
          requirements: l.requirements ? JSON.parse(l.requirements) : [],
          procedures: l.procedures ? JSON.parse(l.procedures) : [],
          forms: l.forms ? JSON.parse(l.forms) : [],
        })),
      });
    }

    if (type === "submissions") {
      // Get all submissions (admin only)
      const whereClause: any = {};
      
      if (status && status !== "all") {
        whereClause.status = status;
      }

      if (search) {
        whereClause.OR = [
          { nomorPengajuan: { contains: search } },
          { namaLengkap: { contains: search } },
          { nik: { contains: search } },
        ];
      }

      const submissions = await db.pengajuanOnline.findMany({
        where: whereClause,
        include: {
          layanan: {
            select: { name: true, slug: true },
          },
          dokumen: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: submissions,
      });
    }

    // Default: return online services
    const layanan = await db.layanan.findMany({
      where: {
        isActive: true,
        isOnline: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: layanan.map((l) => ({
        ...l,
        requirements: l.requirements ? JSON.parse(l.requirements) : [],
        procedures: l.procedures ? JSON.parse(l.procedures) : [],
        forms: l.forms ? JSON.parse(l.forms) : [],
      })),
    });
  } catch (error) {
    console.error("Error fetching online services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// POST - Create new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      layananId,
      namaLengkap,
      nik,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      noTelepon,
      email,
      keterangan,
      dokumen,
    } = body;

    // Validate required fields
    if (!layananId || !namaLengkap || !nik || !noTelepon) {
      return NextResponse.json(
        { success: false, error: "Field wajib harus diisi" },
        { status: 400 }
      );
    }

    // Validate NIK format (16 digits)
    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        { success: false, error: "NIK harus 16 digit angka" },
        { status: 400 }
      );
    }

    // Check if layanan exists and is online
    const layanan = await db.layanan.findUnique({
      where: { id: layananId },
    });

    if (!layanan || !layanan.isOnline || !layanan.isActive) {
      return NextResponse.json(
        { success: false, error: "Layanan tidak tersedia untuk pengajuan online" },
        { status: 400 }
      );
    }

    // Generate nomor pengajuan: ONL-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    
    // Get count of today's submissions
    const todayCount = await db.pengajuanOnline.count({
      where: {
        nomorPengajuan: {
          startsWith: `ONL-${dateStr}`,
        },
      },
    });

    const sequence = String(todayCount + 1).padStart(4, "0");
    const nomorPengajuan = `ONL-${dateStr}-${sequence}`;

    // Create submission
    const submission = await db.pengajuanOnline.create({
      data: {
        nomorPengajuan,
        layananId,
        namaLengkap,
        nik,
        tempatLahir: tempatLahir || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        jenisKelamin: jenisKelamin || null,
        alamat: alamat || null,
        rt: rt || null,
        rw: rw || null,
        kelurahan: kelurahan || null,
        kecamatan: kecamatan || null,
        noTelepon,
        email: email || null,
        keterangan: keterangan || null,
        status: "Baru",
        dokumen: dokumen
          ? {
              create: dokumen.map((doc: any) => ({
                namaDokumen: doc.namaDokumen,
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                fileSize: doc.fileSize || null,
                fileType: doc.fileType || null,
              })),
            }
          : undefined,
      },
      include: {
        layanan: true,
        dokumen: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: submission,
      message: "Pengajuan berhasil dikirim",
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim pengajuan" },
      { status: 500 }
    );
  }
}
