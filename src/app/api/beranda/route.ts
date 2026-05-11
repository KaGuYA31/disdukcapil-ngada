import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/retry";

// GET - Fetch data for homepage
export async function GET() {
  try {
    // Fetch all data in parallel with retry
    const [ringkasan, ringkasanDokumen, kepalaDinas, blankoEKTP, pimpinanList] = await withRetry(
      () => Promise.all([
        db.dataRingkasan.findFirst({ orderBy: { createdAt: "desc" } }),
        db.ringkasanDokumen.findFirst({ orderBy: { createdAt: "desc" } }),
        db.strukturOrganisasi.findFirst({ where: { position: "Kepala Dinas" } }),
        db.blankoEKTP.findFirst({ orderBy: { updatedAt: "desc" } }),
        db.pimpinan.findMany({ orderBy: { role: "asc" } }),
      ]),
      { context: "Beranda GET", maxRetries: 2, delayMs: 300 }
    );

    // Calculate cakupan akta
    const totalAkta = (ringkasanDokumen?.aktaLahir || 0) + (ringkasanDokumen?.aktaBelum || 0);
    const cakupanAkta = totalAkta > 0 
      ? ((ringkasanDokumen?.aktaLahir || 0) / totalAkta) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ringkasan: ringkasan ? {
          totalPenduduk: ringkasan.totalPenduduk,
          lakiLaki: ringkasan.lakiLaki,
          perempuan: ringkasan.perempuan,
          rasioJK: ringkasan.rasioJK,
          periode: ringkasan.periode,
        } : null,
        dokumen: ringkasanDokumen ? {
          ektpCetak: ringkasanDokumen.ektpCetak,
          ektpBelum: ringkasanDokumen.ektpBelum,
          aktaLahir: ringkasanDokumen.aktaLahir,
          aktaBelum: ringkasanDokumen.aktaBelum,
          kiaMiliki: ringkasanDokumen.kiaMiliki,
          kiaBelum: ringkasanDokumen.kiaBelum,
          cakupanAkta: cakupanAkta,
        } : null,
        kepalaDinas: kepalaDinas ? {
          name: kepalaDinas.name,
          position: kepalaDinas.position,
          photo: kepalaDinas.photo,
          description: kepalaDinas.description,
        } : null,
        blankoEKTP: blankoEKTP ? {
          jumlahTersedia: blankoEKTP.jumlahTersedia,
          keterangan: blankoEKTP.keterangan,
          updatedAt: blankoEKTP.updatedAt,
        } : null,
        bupati: pimpinanList.find(p => p.role === "Bupati") ? {
          name: pimpinanList.find(p => p.role === "Bupati")!.name,
          photo: pimpinanList.find(p => p.role === "Bupati")!.photo,
          periode: pimpinanList.find(p => p.role === "Bupati")!.periode,
        } : null,
        wakilBupati: pimpinanList.find(p => p.role === "Wakil Bupati") ? {
          name: pimpinanList.find(p => p.role === "Wakil Bupati")!.name,
          photo: pimpinanList.find(p => p.role === "Wakil Bupati")!.photo,
          periode: pimpinanList.find(p => p.role === "Wakil Bupati")!.periode,
        } : null,
      },
    });
  } catch (error) {
    console.error("Error fetching beranda data:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data beranda" },
      { status: 500 }
    );
  }
}
