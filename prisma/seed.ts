import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const admin = await db.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin123", // In production, this should be hashed
      name: "Administrator",
      email: "admin@ngadakab.go.id",
    },
  });
  console.log("Created admin user:", admin.username);

  // Create sample news
  const newsData = [
    {
      title: "Pelayanan Online Disdukcapil Ngada Kini Lebih Mudah",
      slug: "pelayanan-online-disdukcapil",
      excerpt: "Masyarakat kini dapat mengakses informasi layanan kependudukan secara online melalui portal resmi Disdukcapil Kabupaten Ngada.",
      content: `<p>Masyarakat Kabupaten Ngada kini dapat mengakses informasi layanan kependudukan secara online melalui portal resmi Disdukcapil Kabupaten Ngada. Portal ini menyediakan informasi lengkap tentang persyaratan dan prosedur berbagai layanan administrasi kependudukan.</p>
      
      <h2>Fitur Portal</h2>
      <p>Portal ini menyediakan berbagai fitur yang memudahkan masyarakat untuk:</p>
      <ul>
        <li>Melihat informasi persyaratan setiap layanan</li>
        <li>Mengunduh formulir yang diperlukan</li>
        <li>Membaca panduan prosedur pelayanan</li>
        <li>Mendapatkan informasi terbaru seputar kependudukan</li>
      </ul>`,
      category: "Informasi",
      author: "Admin Disdukcapil",
      isPublished: true,
    },
    {
      title: "Jadwal Pelayanan Bulan Januari 2024",
      slug: "jadwal-pelayanan-januari-2024",
      excerpt: "Informasi jadwal pelayanan Disdukcapil Ngada untuk bulan Januari 2024.",
      content: `<p>Berikut informasi jadwal pelayanan Disdukcapil Ngada untuk bulan Januari 2024. Pastikan Anda datang pada jam kerja yang telah ditentukan untuk mendapatkan pelayanan optimal.</p>
      
      <h2>Jadwal Operasional</h2>
      <ul>
        <li>Senin - Kamis: 08.00 - 15.30 WITA</li>
        <li>Jumat: 08.00 - 16.00 WITA</li>
        <li>Sabtu - Minggu: Tutup</li>
      </ul>`,
      category: "Pengumuman",
      author: "Admin Disdukcapil",
      isPublished: true,
    },
    {
      title: "Sosialisasi Pentingnya Mempunyai Dokumen Kependudukan",
      slug: "sosialisasi-dokumen-kependudukan",
      excerpt: "Tim Disdukcapil Ngada melakukan sosialisasi ke berbagai kecamatan tentang pentingnya memiliki dokumen kependudukan.",
      content: `<p>Tim Disdukcapil Ngada melakukan sosialisasi ke berbagai kecamatan tentang pentingnya memiliki dokumen kependudukan yang lengkap untuk akses pelayanan publik.</p>
      
      <h2>Kegiatan Sosialisasi</h2>
      <p>Kegiatan sosialisasi dilakukan di beberapa kecamatan dengan melibatkan perangkat desa dan masyarakat.</p>`,
      category: "Kegiatan",
      author: "Humas Disdukcapil",
      isPublished: true,
    },
    {
      title: "Pembaharuan Sistem Database Kependudukan",
      slug: "pembaharuan-sistem-database",
      excerpt: "Disdukcapil Ngada melakukan pembaharuan sistem database kependudukan untuk meningkatkan kualitas data.",
      content: `<p>Disdukcapil Ngada melakukan pembaharuan sistem database kependudukan untuk meningkatkan kualitas data dan kecepatan pelayanan kepada masyarakat.</p>`,
      category: "Informasi",
      author: "Admin Disdukcapil",
      isPublished: true,
    },
    {
      title: "Layanan Akta Kelahiran Gratis untuk Bayi Baru Lahir",
      slug: "akta-kelahiran-gratis",
      excerpt: "Pemerintah Kabupaten Ngada menyediakan layanan pencatatan akta kelahiran gratis.",
      content: `<p>Pemerintah Kabupaten Ngada menyediakan layanan pencatatan akta kelahiran gratis untuk bayi yang didaftarkan maksimal 60 hari setelah kelahiran.</p>`,
      category: "Informasi",
      author: "Admin Disdukcapil",
      isPublished: true,
    },
  ];

  for (const news of newsData) {
    const existing = await db.berita.findUnique({
      where: { slug: news.slug },
    });
    if (!existing) {
      const created = await db.berita.create({
        data: news,
      });
      console.log("Created news:", created.title);
    } else {
      console.log("News already exists:", news.slug);
    }
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
