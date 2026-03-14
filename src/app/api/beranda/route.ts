import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch data for homepage
export async function GET() {
  try {
    // Fetch ringkasan data
    const ringkasan = await db.dataRingkasan.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // Fetch ringkasan dokumen
    const ringkasanDokumen = await db.ringkasanDokumen.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // Fetch kepala dinas from struktur organisasi
    const kepalaDinas = await db.strukturOrganisasi.findFirst({
      where: {
        position: "Kepala Dinas",
      },
    });

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
