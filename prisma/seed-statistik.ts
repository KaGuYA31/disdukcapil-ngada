import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding statistik data...");

  // Create ringkasan data
  const existingRingkasan = await db.dataRingkasan.findFirst();
  
  if (!existingRingkasan) {
    const ringkasan = await db.dataRingkasan.create({
      data: {
        periode: "Februari 2025",
        totalPenduduk: 171027,
        lakiLaki: 84471,
        perempuan: 86556,
        rasioJK: 97.59,
        jumlahKecamatan: 12,
        jumlahKelurahan: 206,
        jumlahDisabilitas: 1810,
      },
    });
    console.log("Created ringkasan data:", ringkasan.periode);
  } else {
    console.log("Ringkasan data already exists");
  }

  // Create ringkasan dokumen
  const existingDokumen = await db.ringkasanDokumen.findFirst();
  
  if (!existingDokumen) {
    const dokumen = await db.ringkasanDokumen.create({
      data: {
        ektpCetak: 108886,
        ektpBelum: 62141,
        aktaLahir: 78244,
        aktaBelum: 82683,
        kiaMiliki: 25210,
        kiaBelum: 46817,
      },
    });
    console.log("Created dokumen data");
  } else {
    console.log("Dokumen data already exists");
  }

  // Create kepala dinas
  const existingKepala = await db.strukturOrganisasi.findFirst({
    where: { position: "Kepala Dinas" },
  });
  
  if (!existingKepala) {
    const kepala = await db.strukturOrganisasi.create({
      data: {
        name: "Drs. Nama Kepala Dinas, M.Si",
        position: "Kepala Dinas",
        description: "Kepala Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
        order: 1,
      },
    });
    console.log("Created kepala dinas data:", kepala.name);
  } else {
    console.log("Kepala dinas already exists");
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
