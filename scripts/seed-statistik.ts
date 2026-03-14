import * as XLSX from "xlsx";
import { db } from "../src/lib/db";
import * as fs from "fs";

// Parse Excel file and extract all data
function parseExcelFile(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const result: Record<string, unknown[]> = {};

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
    const ringkasan = data["Ringkasan_Umum"] || Object.values(data)[0];
    if (ringkasan && Array.isArray(ringkasan)) {
      for (const row of ringkasan) {
        if (Array.isArray(row)) {
          for (const cell of row) {
            if (typeof cell === "string" && (cell.includes("2025") || cell.includes("2024"))) {
              return cell.replace("Periode:", "").trim();
            }
          }
        }
      }
    }
    return "Februari 2025";
  } catch {
    return "Februari 2025";
  }
}

// Parse Ringkasan Umum
function parseRingkasanUmum(data: unknown[][]) {
  const result: Record<string, string | number> = {};
  
  for (const row of data) {
    if (Array.isArray(row) && row.length >= 2) {
      // Try both column 1 and column 2 for label (Excel format varies)
      const label = String(row[1] || row[0] || "").toString().toLowerCase().trim();
      const value = row[2] || row[1];
      
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
    
    // Check if this is the header row (look for "NO" in any column)
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("KECAMATAN")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    // Skip rows that don't have data
    const kecamatan = String(row[3] || row[2] || "").toString().trim();
    if (!kecamatan || kecamatan === "TOTAL" || kecamatan === "KABUPATEN" || kecamatan.toUpperCase().includes("TOTAL")) continue;
    
    // Check if it's a valid number row (has numeric data)
    const lakiLaki = Number(row[4] || row[3]) || 0;
    if (lakiLaki === 0) continue;
    
    result.push({
      kodeKec: String(row[2] || row[1] || ""),
      kecamatan: kecamatan.toUpperCase(),
      lakiLaki: lakiLaki,
      perempuan: Number(row[5] || row[4]) || 0,
      total: Number(row[6] || row[5]) || 0,
      rasioJK: Number(row[7] || row[6]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("KELURAHAN")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    const kelurahan = String(row[3] || "").toString().trim();
    
    if (!kecamatan || !kelurahan || kecamatan.toUpperCase().includes("TOTAL")) continue;
    
    // Check if it's a valid number row
    const lakiLaki = Number(row[4]) || 0;
    if (lakiLaki === 0) continue;
    
    result.push({
      kecamatan: kecamatan.toUpperCase(),
      kelurahan: kelurahan.toUpperCase(),
      lakiLaki: lakiLaki,
      perempuan: Number(row[5]) || 0,
      total: Number(row[6]) || 0,
      rasioJK: Number(row[7]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("AGAMA")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const agama = String(row[2] || "").toString().trim();
    if (!agama || agama.toUpperCase().includes("TOTAL")) continue;
    
    const jumlah = Number(row[3]) || 0;
    if (jumlah === 0) continue;
    
    result.push({
      agama: agama.toUpperCase(),
      jumlah: jumlah,
      persentase: Number(row[4]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("PENDIDIKAN")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const tingkat = String(row[2] || "").toString().trim();
    if (!tingkat || tingkat.toUpperCase().includes("TOTAL")) continue;
    
    const jumlah = Number(row[3]) || 0;
    if (jumlah === 0) continue;
    
    result.push({
      tingkat: tingkat,
      jumlah: jumlah,
      persentase: Number(row[4]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("PEKERJAAN")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const pekerjaan = String(row[2] || "").toString().trim();
    if (!pekerjaan || pekerjaan.toUpperCase().includes("TOTAL")) continue;
    
    const jumlah = Number(row[3]) || 0;
    if (jumlah === 0) continue;
    
    result.push({
      pekerjaan: pekerjaan.toUpperCase(),
      jumlah: jumlah,
      persentase: Number(row[4]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("STATUS")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const status = String(row[2] || "").toString().trim();
    if (!status || status.toUpperCase().includes("TOTAL")) continue;
    
    const jumlah = Number(row[3]) || 0;
    if (jumlah === 0) continue;
    
    result.push({
      status: status.toUpperCase(),
      jumlah: jumlah,
      persentase: Number(row[4]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("DISABILITAS")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const jenis = String(row[2] || "").toString().trim();
    if (!jenis || jenis.toUpperCase().includes("TOTAL")) continue;
    
    const jumlah = Number(row[3]) || 0;
    if (jumlah === 0) continue;
    
    result.push({
      jenis: jenis.toUpperCase(),
      jumlah: jumlah,
      persentase: Number(row[4]) || 0,
      periode: periode,
    });
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
    
    // Check if this is the header row
    const rowStr = row.join(" ").toUpperCase();
    if (rowStr.includes("NO") && rowStr.includes("KECAMATAN")) {
      startRow = true;
      continue;
    }
    
    if (!startRow) continue;
    
    const kecamatan = String(row[2] || "").toString().trim();
    if (!kecamatan || kecamatan.toUpperCase().includes("TOTAL")) continue;
    
    const wktp = Number(row[3]) || 0;
    if (wktp === 0) continue;
    
    result.push({
      kecamatan: kecamatan.toUpperCase(),
      wktp: wktp,
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
  
  return result;
}

async function main() {
  console.log("Starting seed process...");
  
  // Read the Excel file
  const buffer = fs.readFileSync("upload/Data_Kependudukan_Ngada_2025(1).xlsx");
  const rawData = parseExcelFile(buffer);
  const periode = extractPeriode(rawData);
  
  console.log("Periode:", periode);
  console.log("Sheets found:", Object.keys(rawData));
  
  // Find sheets - match exact names first, then partial matches
  const sheetNames = Object.keys(rawData);
  const findSheet = (name: string) => {
    // First try exact match (case-insensitive)
    const exact = sheetNames.find(s => s.toLowerCase() === name.toLowerCase());
    if (exact) return exact;
    // Then try partial match
    return sheetNames.find(s => s.toLowerCase().includes(name.toLowerCase())) || null;
  };
  
  // Parse ringkasan
  const ringkasanSheet = findSheet("Ringkasan_Umum") || sheetNames[0];
  const kecamatanSheet = findSheet("Penduduk_Per_Kecamatan");
  const kelurahanSheet = findSheet("Penduduk_Per_Kelurahan");
  const agamaSheet = findSheet("Distribusi_Agama");
  const pendidikanSheet = findSheet("Distribusi_Pendidikan");
  const pekerjaanSheet = findSheet("Distribusi_Pekerjaan");
  const perkawinanSheet = findSheet("Status_Perkawinan");
  const disabilitasSheet = findSheet("Distribusi_Disabilitas");
  const dokumenSheet = findSheet("Dokumen_Per_Kecamatan");
  
  console.log("Sheets matched:");
  console.log("  ringkasan:", ringkasanSheet);
  console.log("  kecamatan:", kecamatanSheet);
  console.log("  kelurahan:", kelurahanSheet);
  console.log("  agama:", agamaSheet);
  console.log("  pendidikan:", pendidikanSheet);
  console.log("  pekerjaan:", pekerjaanSheet);
  console.log("  perkawinan:", perkawinanSheet);
  console.log("  disabilitas:", disabilitasSheet);
  console.log("  dokumen:", dokumenSheet);
  
  // Parse ringkasan
  const ringkasanData = ringkasanSheet ? parseRingkasanUmum(rawData[ringkasanSheet] as unknown[][]) : {};
  
  // Save ringkasan
  if (ringkasanData.totalPenduduk) {
    console.log("Saving ringkasan data...");
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
    console.log("Saving kecamatan data...");
    const kecamatanData = parsePendudukKecamatan(rawData[kecamatanSheet] as unknown[][], periode);
    console.log(`Found ${kecamatanData.length} kecamatan records`);
    if (kecamatanData.length > 0) {
      await db.pendudukKecamatan.createMany({ data: kecamatanData });
    }
  }

  // Save kelurahan data
  if (kelurahanSheet) {
    console.log("Saving kelurahan data...");
    const kelurahanData = parsePendudukKelurahan(rawData[kelurahanSheet] as unknown[][], periode);
    console.log(`Found ${kelurahanData.length} kelurahan records`);
    if (kelurahanData.length > 0) {
      await db.pendudukKelurahan.createMany({ data: kelurahanData });
    }
  }

  // Save agama data
  if (agamaSheet) {
    console.log("Saving agama data...");
    const agamaData = parseDistribusiAgama(rawData[agamaSheet] as unknown[][], periode);
    console.log(`Found ${agamaData.length} agama records`);
    if (agamaData.length > 0) {
      await db.distribusiAgama.createMany({ data: agamaData });
    }
  }

  // Save pendidikan data
  if (pendidikanSheet) {
    console.log("Saving pendidikan data...");
    const pendidikanData = parseDistribusiPendidikan(rawData[pendidikanSheet] as unknown[][], periode);
    console.log(`Found ${pendidikanData.length} pendidikan records`);
    if (pendidikanData.length > 0) {
      await db.distribusiPendidikan.createMany({ data: pendidikanData });
    }
  }

  // Save pekerjaan data
  if (pekerjaanSheet) {
    console.log("Saving pekerjaan data...");
    const pekerjaanData = parseDistribusiPekerjaan(rawData[pekerjaanSheet] as unknown[][], periode);
    console.log(`Found ${pekerjaanData.length} pekerjaan records`);
    if (pekerjaanData.length > 0) {
      await db.distribusiPekerjaan.createMany({ data: pekerjaanData });
    }
  }

  // Save status perkawinan data
  if (perkawinanSheet) {
    console.log("Saving perkawinan data...");
    const statusData = parseStatusPerkawinan(rawData[perkawinanSheet] as unknown[][], periode);
    console.log(`Found ${statusData.length} perkawinan records`);
    if (statusData.length > 0) {
      await db.statusPerkawinan.createMany({ data: statusData });
    }
  }

  // Save disabilitas data
  if (disabilitasSheet) {
    console.log("Saving disabilitas data...");
    const disabilitasData = parseDistribusiDisabilitas(rawData[disabilitasSheet] as unknown[][], periode);
    console.log(`Found ${disabilitasData.length} disabilitas records`);
    if (disabilitasData.length > 0) {
      await db.distribusiDisabilitas.createMany({ data: disabilitasData });
    }
  }

  // Save dokumen kecamatan data
  if (dokumenSheet) {
    console.log("Saving dokumen kecamatan data...");
    const dokumenData = parseDokumenKecamatan(rawData[dokumenSheet] as unknown[][], periode);
    console.log(`Found ${dokumenData.length} dokumen kecamatan records`);
    if (dokumenData.length > 0) {
      await db.dokumenKecamatan.createMany({ data: dokumenData });
    }
  }

  // Save upload history
  await db.uploadHistory.create({
    data: {
      fileName: "Data_Kependudukan_Ngada_2025(1).xlsx",
      periode: periode,
      totalRecords: Object.keys(rawData).length,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
