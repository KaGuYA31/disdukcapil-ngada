import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

// POST - Import Excel file for population data
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "pendudukKecamatan"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { success: false, error: "Format file harus .xlsx atau .xls" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return NextResponse.json(
        { success: false, error: "File Excel kosong atau tidak valid" },
        { status: 400 }
      );
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: "",
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tidak ada data dalam file Excel" },
        { status: 400 }
      );
    }

    // Handle different import types
    if (type === "pendudukKecamatan") {
      return await importPendudukKecamatan(rows, file.name);
    }

    return NextResponse.json(
      { success: false, error: "Tipe import tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error importing Excel:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengimpor data Excel" },
      { status: 500 }
    );
  }
}

async function importPendudukKecamatan(
  rows: Record<string, unknown>[],
  fileName: string
) {
  // Validate headers
  const firstRow = rows[0];
  const requiredHeaders = ["kodeKec", "kecamatan", "lakiLaki", "perempuan", "total", "rasioJK", "periode"];
  const missingHeaders = requiredHeaders.filter((h) => !(h in firstRow));

  if (missingHeaders.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Kolom wajib tidak ditemukan: ${missingHeaders.join(", ")}. Pastikan menggunakan template yang benar.`,
      },
      { status: 400 }
    );
  }

  // Parse and validate each row
  const records: {
    kodeKec: string;
    kecamatan: string;
    lakiLaki: number;
    perempuan: number;
    total: number;
    rasioJK: number;
    periode: string;
  }[] = [];

  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because row 1 is header, Excel rows start at 1

    const kodeKec = String(row.kodeKec || "").trim();
    const kecamatan = String(row.kecamatan || "").trim();
    const lakiLaki = Number(row.lakiLaki) || 0;
    const perempuan = Number(row.perempuan) || 0;
    const total = Number(row.total) || 0;
    const rasioJK = Number(row.rasioJK) || 0;
    const periode = String(row.periode || "").trim();

    if (!kodeKec || !kecamatan) {
      errors.push(`Baris ${rowNum}: kodeKec dan kecamatan wajib diisi`);
      continue;
    }

    if (lakiLaki < 0 || perempuan < 0 || total < 0) {
      errors.push(`Baris ${rowNum}: nilai tidak boleh negatif`);
      continue;
    }

    records.push({
      kodeKec,
      kecamatan,
      lakiLaki,
      perempuan,
      total,
      rasioJK,
      periode,
    });
  }

  if (records.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Tidak ada data valid untuk diimpor. ${errors.length > 0 ? `Error: ${errors.join("; ")}` : ""}`,
      },
      { status: 400 }
    );
  }

  // Determine the period from the first record
  const periode = records[0].periode;

  // Clear old data for this period (or all data if period matches)
  if (periode) {
    await db.pendudukKecamatan.deleteMany({
      where: { periode },
    });
  } else {
    await db.pendudukKecamatan.deleteMany();
  }

  // Insert new data in batches
  const batchSize = 50;
  let insertedCount = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await db.pendudukKecamatan.createMany({
      data: batch,
    });
    insertedCount += batch.length;
  }

  // Log upload history
  await db.uploadHistory.create({
    data: {
      fileName,
      periode,
      totalRecords: insertedCount,
      uploadedBy: "admin",
    },
  });

  return NextResponse.json({
    success: true,
    message: `Berhasil mengimpor ${insertedCount} data kecamatan`,
    data: {
      imported: insertedCount,
      period: periode,
      errors: errors.length > 0 ? errors : undefined,
    },
  });
}

// GET - Download Excel template
export async function GET() {
  try {
    const templateData = [
      {
        kodeKec: "9101",
        kecamatan: "Aesesa",
        lakiLaki: 8500,
        perempuan: 8700,
        total: 17200,
        rasioJK: 97.70,
        periode: "Februari 2025",
      },
      {
        kodeKec: "9102",
        kecamatan: "Bajawa",
        lakiLaki: 12000,
        perempuan: 12500,
        total: 24500,
        rasioJK: 96.00,
        periode: "Februari 2025",
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 12 }, // kodeKec
      { wch: 25 }, // kecamatan
      { wch: 14 }, // lakiLaki
      { wch: 14 }, // perempuan
      { wch: 12 }, // total
      { wch: 12 }, // rasioJK
      { wch: 18 }, // periode
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Penduduk Kecamatan");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="template_penduduk_kecamatan.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat template Excel" },
      { status: 500 }
    );
  }
}
