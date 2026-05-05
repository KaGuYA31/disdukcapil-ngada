import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

// Parse Excel file and extract all data
async function parseExcelFile(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const result: Record<string, unknown[]> = {};

  // Parse each sheet
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    result[sheetName] = data;
  }

  return result;
}

// Extract periode from data
function extractPeriode(data: Record<string, unknown[]>): string {
  try {
    const ringkasan = data["Ringkasan_Umum"] || data["RINGKASAN_UMUM"] || Object.values(data)[0];
    if (ringkasan && Array.isArray(ringkasan)) {
      for (const row of ringkasan) {
        if (Array.isArray(row)) {
          const rowStr = row.join(" ").toLowerCase();
          if (rowStr.includes("periode") || rowStr.includes("februari") || rowStr.includes("2025")) {
            for (const cell of row) {
              if (typeof cell === "string" && (cell.includes("2025") || cell.includes("2024"))) {
                return cell.replace("Periode:", "").trim();
              }
            }
          }
        }
      }
    }
    const now = new Date();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  } catch {
    return "Februari 2025";
  }
}

// Parse Ringkasan Umum
function parseRingkasanUmum(data: unknown[][]) {
  const result: Record<string, string | number> = {};
  
  for (const row of data) {
    if (Array.isArray(row) && row.length >= 2) {
      const label = String(row[1] || "").toString().toLowerCase().trim();
      const value = row[2];
      
      if (label.includes("total penduduk")) {
        result.totalPenduduk = Number(value) || 0;
      } else if (label === "laki-laki") {
        result.lakiLaki = Number(value) || 0;
      } else if (label === "perempuan") {
        result.perempuan = Number(value) || 0;
      } else if (label.includes("rasio jenis kelamin")) {
        result.rasioJK = Number(value) || 0;
      } else if (label.includes("jumlah kecamatan")) {
        result.jumlahKecamatan = Number(value) || 0;
      } else if (label.includes("kelurahan") || label.includes("desa")) {
        result.jumlahKelurahan = Number(value) || 0;
      } else if (label.includes("disabilitas")) {
        result.jumlahDisabilitas = Number(value) || 0;
      }
    }
  }
  
  return result;
}

// Parse Penduduk Per Kecamatan
function parsePendudukKecamatan(data: unknown[][], periode: string) {
  const result: Array<{
    kodeKec: string;
    kecamatan: string;
    lakiLaki: number;
    perempuan: number;
    total: number;
    rasioJK: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[3] || "").toString().trim();
    if (kecamatan && kecamatan !== "TOTAL" && kecamatan !== "") {
      result.push({
        kodeKec: String(row[2] || ""),
        kecamatan: kecamatan.toUpperCase(),
        lakiLaki: Number(row[4]) || 0,
        perempuan: Number(row[5]) || 0,
        total: Number(row[6]) || 0,
        rasioJK: Number(row[7]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Penduduk Per Kelurahan
function parsePendudukKelurahan(data: unknown[][], periode: string) {
  const result: Array<{
    kecamatan: string;
    kelurahan: string;
    lakiLaki: number;
    perempuan: number;
    total: number;
    rasioJK: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    const kelurahan = String(row[3] || "").toString().trim();
    
    if (kecamatan && kelurahan && kecamatan !== "TOTAL") {
      result.push({
        kecamatan: kecamatan.toUpperCase(),
        kelurahan: kelurahan.toUpperCase(),
        lakiLaki: Number(row[4]) || 0,
        perempuan: Number(row[5]) || 0,
        total: Number(row[6]) || 0,
        rasioJK: Number(row[7]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Distribusi Agama
function parseDistribusiAgama(data: unknown[][], periode: string) {
  const result: Array<{
    agama: string;
    jumlah: number;
    persentase: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const agama = String(row[2] || "").toString().trim();
    if (agama && agama !== "TOTAL" && agama !== "") {
      result.push({
        agama: agama.toUpperCase(),
        jumlah: Number(row[3]) || 0,
        persentase: Number(row[4]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Agama Per Kecamatan
function parseAgamaKecamatan(data: unknown[][], periode: string) {
  const result: Array<{
    kecamatan: string;
    buddha: number;
    hindu: number;
    islam: number;
    katholik: number;
    kepercayaan: number;
    khonghucu: number;
    kristen: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    if (kecamatan && kecamatan !== "TOTAL" && kecamatan !== "") {
      result.push({
        kecamatan: kecamatan.toUpperCase(),
        buddha: Number(row[3]) || 0,
        hindu: Number(row[4]) || 0,
        islam: Number(row[5]) || 0,
        katholik: Number(row[6]) || 0,
        kepercayaan: Number(row[7]) || 0,
        khonghucu: Number(row[8]) || 0,
        kristen: Number(row[9]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Distribusi Pendidikan
function parseDistribusiPendidikan(data: unknown[][], periode: string) {
  const result: Array<{
    tingkat: string;
    jumlah: number;
    persentase: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const tingkat = String(row[2] || "").toString().trim();
    if (tingkat && tingkat !== "TOTAL" && tingkat !== "") {
      result.push({
        tingkat: tingkat,
        jumlah: Number(row[3]) || 0,
        persentase: Number(row[4]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Distribusi Pekerjaan
function parseDistribusiPekerjaan(data: unknown[][], periode: string) {
  const result: Array<{
    pekerjaan: string;
    jumlah: number;
    persentase: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const pekerjaan = String(row[2] || "").toString().trim();
    if (pekerjaan && pekerjaan !== "TOTAL" && pekerjaan !== "") {
      result.push({
        pekerjaan: pekerjaan.toUpperCase(),
        jumlah: Number(row[3]) || 0,
        persentase: Number(row[4]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Status Perkawinan
function parseStatusPerkawinan(data: unknown[][], periode: string) {
  const result: Array<{
    status: string;
    jumlah: number;
    persentase: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const status = String(row[2] || "").toString().trim();
    if (status && status !== "TOTAL" && status !== "") {
      result.push({
        status: status.toUpperCase(),
        jumlah: Number(row[3]) || 0,
        persentase: Number(row[4]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Perkawinan Per Kecamatan
function parsePerkawinanKecamatan(data: unknown[][], periode: string) {
  const result: Array<{
    kecamatan: string;
    belumKawin: number;
    kawin: number;
    ceraiHidup: number;
    ceraiMati: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    if (kecamatan && kecamatan !== "TOTAL" && kecamatan !== "KABUPATEN") {
      result.push({
        kecamatan: kecamatan.toUpperCase(),
        belumKawin: Number(row[3]) || 0,
        kawin: Number(row[4]) || 0,
        ceraiHidup: Number(row[5]) || 0,
        ceraiMati: Number(row[6]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Distribusi Disabilitas
function parseDistribusiDisabilitas(data: unknown[][], periode: string) {
  const result: Array<{
    jenis: string;
    jumlah: number;
    persentase: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const jenis = String(row[2] || "").toString().trim();
    if (jenis && jenis !== "TOTAL" && jenis !== "") {
      result.push({
        jenis: jenis.toUpperCase(),
        jumlah: Number(row[3]) || 0,
        persentase: Number(row[4]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// Parse Dokumen Per Kecamatan
function parseDokumenKecamatan(data: unknown[][], periode: string) {
  const result: Array<{
    kecamatan: string;
    wktp: number;
    ektpCetak: number;
    ektpBelum: number;
    totalKK: number;
    kkCetak: number;
    kkBelum: number;
    aktaLahir: number;
    aktaBelum: number;
    aktaPersen: number;
    kiaMiliki: number;
    kiaBelum: number;
    kiaPersen: number;
    periode: string;
  }> = [];
  
  let startRow = false;
  for (const row of data) {
    if (!Array.isArray(row)) continue;
    
    const firstCell = String(row[0] || "");
    if (firstCell.includes("NO") || firstCell.includes("No")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    if (kecamatan && kecamatan !== "TOTAL" && kecamatan !== "") {
      result.push({
        kecamatan: kecamatan.toUpperCase(),
        wktp: Number(row[3]) || 0,
        ektpCetak: Number(row[4]) || 0,
        ektpBelum: Number(row[5]) || 0,
        totalKK: Number(row[6]) || 0,
        kkCetak: Number(row[7]) || 0,
        kkBelum: Number(row[8]) || 0,
        aktaLahir: Number(row[9]) || 0,
        aktaBelum: Number(row[10]) || 0,
        aktaPersen: Number(row[11]) || 0,
        kiaMiliki: Number(row[12]) || 0,
        kiaBelum: Number(row[13]) || 0,
        kiaPersen: Number(row[14]) || 0,
        periode: periode,
      });
    }
  }
  
  return result;
}

// POST - Upload and process Excel file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { success: false, error: "File harus berformat Excel (.xlsx atau .xls)" },
        { status: 400 }
      );
    }

    // Read file
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawData = await parseExcelFile(buffer);
    const periode = extractPeriode(rawData);

    // Find the correct sheet names (case-insensitive)
    const sheetNames = Object.keys(rawData);
    const findSheet = (name: string) => {
      return sheetNames.find(s => s.toLowerCase().includes(name.toLowerCase())) || null;
    };

    // Parse all data
    const ringkasanSheet = findSheet("ringkasan") || sheetNames[0];
    const kecamatanSheet = findSheet("kecamatan");
    const kelurahanSheet = findSheet("kelurahan");
    const agamaSheet = findSheet("agama") && !findSheet("agama_kecamatan") ? findSheet("agama") : null;
    const agamaKecamatanSheet = findSheet("agama_kecamatan") || findSheet("agama_per");
    const pendidikanSheet = findSheet("pendidikan");
    const pekerjaanSheet = findSheet("pekerjaan");
    const perkawinanSheet = findSheet("perkawinan");
    const perkawinanKecSheet = findSheet("perkawinan_kecamatan") || findSheet("status_perkawinan");
    const disabilitasSheet = findSheet("disabilitas");
    const dokumenSheet = findSheet("dokumen");

    // Parse ringkasan
    const ringkasanData = ringkasanSheet ? parseRingkasanUmum(rawData[ringkasanSheet] as unknown[][]) : {};
    
    // Save ringkasan
    if (ringkasanData.totalPenduduk) {
      await db.dataRingkasan.create({
        data: {
          periode: periode,
          totalPenduduk: Number(ringkasanData.totalPenduduk) || 171027,
          lakiLaki: Number(ringkasanData.lakiLaki) || 84471,
          perempuan: Number(ringkasanData.perempuan) || 86556,
          rasioJK: Number(ringkasanData.rasioJK) || 97.59,
          jumlahKecamatan: Number(ringkasanData.jumlahKecamatan) || 12,
          jumlahKelurahan: Number(ringkasanData.jumlahKelurahan) || 206,
          jumlahDisabilitas: Number(ringkasanData.jumlahDisabilitas) || 1810,
        },
      });
    }

    // Save kecamatan data
    if (kecamatanSheet) {
      const kecamatanData = parsePendudukKecamatan(rawData[kecamatanSheet] as unknown[][], periode);
      if (kecamatanData.length > 0) {
        await db.pendudukKecamatan.createMany({ data: kecamatanData });
      }
    }

    // Save kelurahan data
    if (kelurahanSheet) {
      const kelurahanData = parsePendudukKelurahan(rawData[kelurahanSheet] as unknown[][], periode);
      if (kelurahanData.length > 0) {
        await db.pendudukKelurahan.createMany({ data: kelurahanData });
      }
    }

    // Save agama data
    if (agamaSheet) {
      const agamaData = parseDistribusiAgama(rawData[agamaSheet] as unknown[][], periode);
      if (agamaData.length > 0) {
        await db.distribusiAgama.createMany({ data: agamaData });
      }
    }

    // Save agama kecamatan data
    if (agamaKecamatanSheet) {
      const agamaKecData = parseAgamaKecamatan(rawData[agamaKecamatanSheet] as unknown[][], periode);
      if (agamaKecData.length > 0) {
        await db.agamaKecamatan.createMany({ data: agamaKecData });
      }
    }

    // Save pendidikan data
    if (pendidikanSheet) {
      const pendidikanData = parseDistribusiPendidikan(rawData[pendidikanSheet] as unknown[][], periode);
      if (pendidikanData.length > 0) {
        await db.distribusiPendidikan.createMany({ data: pendidikanData });
      }
    }

    // Save pekerjaan data
    if (pekerjaanSheet) {
      const pekerjaanData = parseDistribusiPekerjaan(rawData[pekerjaanSheet] as unknown[][], periode);
      if (pekerjaanData.length > 0) {
        await db.distribusiPekerjaan.createMany({ data: pekerjaanData });
      }
    }

    // Save status perkawinan data
    if (perkawinanSheet) {
      const statusData = parseStatusPerkawinan(rawData[perkawinanSheet] as unknown[][], periode);
      if (statusData.length > 0) {
        await db.statusPerkawinan.createMany({ data: statusData });
      }
    }

    // Save perkawinan kecamatan data
    if (perkawinanKecSheet) {
      const perkawinanKecData = parsePerkawinanKecamatan(rawData[perkawinanKecSheet] as unknown[][], periode);
      if (perkawinanKecData.length > 0) {
        await db.perkawinanKecamatan.createMany({ data: perkawinanKecData });
      }
    }

    // Save disabilitas data
    if (disabilitasSheet) {
      const disabilitasData = parseDistribusiDisabilitas(rawData[disabilitasSheet] as unknown[][], periode);
      if (disabilitasData.length > 0) {
        await db.distribusiDisabilitas.createMany({ data: disabilitasData });
      }
    }

    // Save dokumen kecamatan data
    if (dokumenSheet) {
      const dokumenData = parseDokumenKecamatan(rawData[dokumenSheet] as unknown[][], periode);
      if (dokumenData.length > 0) {
        await db.dokumenKecamatan.createMany({ data: dokumenData });
      }
    }

    // Save upload history
    await db.uploadHistory.create({
      data: {
        fileName: file.name,
        periode: periode,
        totalRecords: Object.keys(rawData).length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diupload dan diproses",
      periode: periode,
      sheets: Object.keys(rawData),
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses file Excel" },
      { status: 500 }
    );
  }
}

// GET - Get all statistics data
export async function GET() {
  try {
    const [
      ringkasan,
      kecamatan,
      kelurahan,
      agama,
      pendidikan,
      pekerjaan,
      perkawinan,
      disabilitas,
      dokumen,
      ringkasanDokumen,
      uploadHistory,
    ] = await Promise.all([
      db.dataRingkasan.findFirst({ orderBy: { createdAt: "desc" } }),
      db.pendudukKecamatan.findMany({ orderBy: { kecamatan: "asc" } }),
      db.pendudukKelurahan.findMany({ orderBy: [{ kecamatan: "asc" }, { kelurahan: "asc" }] }),
      db.distribusiAgama.findMany({ orderBy: { jumlah: "desc" } }),
      db.distribusiPendidikan.findMany({ orderBy: { jumlah: "desc" } }),
      db.distribusiPekerjaan.findMany({ orderBy: { jumlah: "desc" } }),
      db.statusPerkawinan.findMany({ orderBy: { jumlah: "desc" } }),
      db.distribusiDisabilitas.findMany({ orderBy: { jumlah: "desc" } }),
      db.dokumenKecamatan.findMany({ orderBy: { kecamatan: "asc" } }),
      db.ringkasanDokumen.findFirst({ orderBy: { createdAt: "desc" } }),
      db.uploadHistory.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    // If ringkasanDokumen exists, use it; otherwise calculate from dokumen kecamatan
    const docSummary = ringkasanDokumen || (dokumen.length > 0 ? {
      ektpCetak: dokumen.reduce((sum, d) => sum + d.ektpCetak, 0),
      ektpBelum: dokumen.reduce((sum, d) => sum + d.ektpBelum, 0),
      aktaLahir: dokumen.reduce((sum, d) => sum + d.aktaLahir, 0),
      aktaBelum: dokumen.reduce((sum, d) => sum + d.aktaBelum, 0),
      kiaMiliki: dokumen.reduce((sum, d) => sum + d.kiaMiliki, 0),
      kiaBelum: dokumen.reduce((sum, d) => sum + d.kiaBelum, 0),
    } : null);

    return NextResponse.json({
      success: true,
      data: {
        ringkasan,
        kecamatan,
        kelurahan,
        agama,
        pendidikan,
        pekerjaan,
        perkawinan,
        disabilitas,
        dokumen,
        ringkasanDokumen: docSummary,
        uploadHistory,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kependudukan" },
      { status: 500 }
    );
  }
}
