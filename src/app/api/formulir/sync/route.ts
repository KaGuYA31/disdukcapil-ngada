import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Form definitions based on Permendagri No. 6 Tahun 2026
const FORMS = [
  { code: "F-1.01", name: "Formulir Biodata Keluarga", category: "Pendaftaran Penduduk", fileName: "F-1-01.pdf", fileSize: "344 KB", order: 1 },
  { code: "F-1.02", name: "Formulir Pendaftaran Peristiwa Kependudukan", category: "Pendaftaran Penduduk", fileName: "F-1-02.pdf", fileSize: "278 KB", order: 2 },
  { code: "F-1.03", name: "Formulir Pendaftaran Perpindahan Penduduk", category: "Pendaftaran Penduduk", fileName: "F-1-03.pdf", fileSize: "171 KB", order: 3 },
  { code: "F-1.03A", name: "Surat Kuasa Pengasuhan Anak dari Orang Tua/Wali", category: "Persyaratan", fileName: "F-1-03A.pdf", fileSize: "238 KB", order: 4 },
  { code: "F-1.03B", name: "Surat Pernyataan Bersedia Menerima sebagai Anggota Keluarga", category: "Persyaratan", fileName: "F-1-03B.pdf", fileSize: "128 KB", order: 5 },
  { code: "F-1.03C", name: "Surat Pernyataan Tidak Keberatan Penggunaan Alamat", category: "Persyaratan", fileName: "F-1-03C.pdf", fileSize: "237 KB", order: 6 },
  { code: "F-1.04", name: "Surat Pernyataan Tidak Memiliki Dokumen Kependudukan", category: "Persyaratan", fileName: "F-1-04.pdf", fileSize: "261 KB", order: 7 },
  { code: "F-1.05", name: "SPTJM Perkawinan/Perceraian Belum Tercatat", category: "Persyaratan", fileName: "F-1-05.pdf", fileSize: "164 KB", order: 8 },
  { code: "F-1.06", name: "Surat Pernyataan Perubahan Elemen Data Kependudukan", category: "Persyaratan", fileName: "F-1-06.pdf", fileSize: "162 KB", order: 9 },
  { code: "F-1.07", name: "Surat Kuasa dalam Pelayanan Administrasi Kependudukan", category: "Persyaratan", fileName: "F-1-07.pdf", fileSize: "135 KB", order: 10 },
  { code: "F-2.01A", name: "Pelaporan Kelahiran, Lahir Mati, dan Kematian", category: "Pencatatan Sipil", fileName: "F-2-01A.pdf", fileSize: "146 KB", order: 11 },
  { code: "F-2.01B", name: "Pelaporan Perkawinan dan Pembatalan Perkawinan", category: "Pencatatan Sipil", fileName: "F-2-01B.pdf", fileSize: "199 KB", order: 12 },
  { code: "F-2.01C", name: "Pelaporan Perceraian dan Pembatalan Perceraian", category: "Pencatatan Sipil", fileName: "F-2-01C.pdf", fileSize: "200 KB", order: 13 },
  { code: "F-2.01D", name: "Pelaporan Pengangkatan/Pengakuan/Pengesahan Anak", category: "Pencatatan Sipil", fileName: "F-2-01D.pdf", fileSize: "205 KB", order: 14 },
  { code: "F-2.01E", name: "Pelaporan Perubahan Nama/Status Kewarganegaraan", category: "Pencatatan Sipil", fileName: "F-2-01E.pdf", fileSize: "141 KB", order: 15 },
  { code: "F-2.01F", name: "Pembetulan/Pembatalan/Penerbitan Kembali Akta", category: "Pencatatan Sipil", fileName: "F-2-01F.pdf", fileSize: "90 KB", order: 16 },
  { code: "F-2.02A", name: "Pelaporan Kelahiran dan Kematian dari Luar NKRI", category: "Pencatatan Sipil LN", fileName: "F-2-02A.pdf", fileSize: "172 KB", order: 17 },
  { code: "F-2.02B", name: "Pelaporan Perkawinan dan Perceraian dari Luar NKRI", category: "Pencatatan Sipil LN", fileName: "F-2-02B.pdf", fileSize: "145 KB", order: 18 },
  { code: "F-2.02C", name: "Pelaporan Pengangkatan Anak WNI oleh WNA dari Luar NKRI", category: "Pencatatan Sipil LN", fileName: "F-2-02C.pdf", fileSize: "201 KB", order: 19 },
  { code: "F-2.02D", name: "Pelepasan Kewarganegaraan dari Luar NKRI", category: "Pencatatan Sipil LN", fileName: "F-2-02D.pdf", fileSize: "195 KB", order: 20 },
  { code: "F-2.02E", name: "Pembetulan/Pembatalan Akta dari Luar NKRI", category: "Pencatatan Sipil LN", fileName: "F-2-02E.pdf", fileSize: "160 KB", order: 21 },
  { code: "F-2.03", name: "SPTJM Kebenaran Data Kelahiran", category: "Persyaratan", fileName: "F-2-03.pdf", fileSize: "96 KB", order: 22 },
  { code: "F-2.04", name: "SPTJM Kebenaran sebagai Pasangan Suami Istri", category: "Persyaratan", fileName: "F-2-04.pdf", fileSize: "126 KB", order: 23 },
  { code: "F-2.04A", name: "SPTJM Kebenaran Pasangan Suami Istri (Meninggal Sebelum Pencatatan)", category: "Persyaratan", fileName: "F-2-04A.pdf", fileSize: "130 KB", order: 24 },
  { code: "F-2.04B", name: "SPTJM Pembetulan Akta Pencatatan Sipil", category: "Persyaratan", fileName: "F-2-04B.pdf", fileSize: "158 KB", order: 25 },
  { code: "F-2.04C", name: "SPTJM Pembatalan Akta Pencatatan Sipil tanpa Pengadilan", category: "Persyaratan", fileName: "F-2-04C.pdf", fileSize: "158 KB", order: 26 },
  { code: "F-2.04D", name: "Surat Permohonan Penerbitan Kembali Kutipan Akta", category: "Persyaratan", fileName: "F-2-04D.pdf", fileSize: "71 KB", order: 27 },
];

// POST - Sync all formulir definitions to the database (upsert by code)
export async function POST(request: NextRequest) {
  try {
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
      details: [] as { code: string; action: string }[],
    };

    for (const formDef of FORMS) {
      try {
        const existing = await db.formulir.findUnique({
          where: { code: formDef.code },
        });

        if (existing) {
          // Update existing formulir (preserve downloadCount)
          await db.formulir.update({
            where: { code: formDef.code },
            data: {
              name: formDef.name,
              category: formDef.category,
              fileName: formDef.fileName,
              fileSize: formDef.fileSize,
              order: formDef.order,
              isActive: true,
            },
          });
          results.updated++;
          results.details.push({ code: formDef.code, action: "updated" });
        } else {
          // Create new formulir
          await db.formulir.create({
            data: {
              code: formDef.code,
              name: formDef.name,
              category: formDef.category,
              fileName: formDef.fileName,
              fileSize: formDef.fileSize,
              order: formDef.order,
              isActive: true,
            },
          });
          results.created++;
          results.details.push({ code: formDef.code, action: "created" });
        }
      } catch (error) {
        const msg = `Error processing ${formDef.code}: ${error instanceof Error ? error.message : String(error)}`;
        results.errors.push(msg);
        console.error(msg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sinkronisasi formulir berhasil: ${results.created} baru, ${results.updated} diperbarui`,
      data: {
        summary: {
          totalForms: FORMS.length,
          created: results.created,
          updated: results.updated,
          errors: results.errors.length,
        },
        details: results.details,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error("Error syncing formulir:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal sinkronisasi data formulir",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
