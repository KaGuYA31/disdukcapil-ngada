import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // Get admin credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Administrator";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@disdukcapil-ngada.go.id";

  // Create admin user
  const existingAdmin = await db.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const admin = await db.admin.create({
      data: {
        username: adminUsername,
        password: adminPassword,
        name: adminName,
        email: adminEmail,
      },
    });
    console.log("Created admin user:", admin.username);
  } else {
    console.log("Admin user already exists:", adminUsername);
  }

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
      title: "Semua Layanan Kependudukan GRATIS!",
      slug: "layanan-kependudukan-gratis",
      excerpt: "Berdasarkan Permendagri No. 3 Tahun 2024, semua layanan kependudukan tidak dipungut biaya sama sekali.",
      content: `<p>Berdasarkan <strong>Permendagri No. 3 Tahun 2024</strong> dan <strong>SE Menpan RB Tahun 2024</strong>, semua layanan administrasi kependudukan di Disdukcapil Kabupaten Ngada <strong>GRATIS</strong> (tidak dipungut biaya sama sekali).</p>

      <h2>Layanan yang GRATIS</h2>
      <ul>
        <li>Pembuatan KTP-el</li>
        <li>Pembuatan Kartu Keluarga (KK)</li>
        <li>Akta Kelahiran</li>
        <li>Akta Perkawinan</li>
        <li>Akta Perceraian</li>
        <li>Akta Kematian</li>
        <li>Surat Pindah Datang</li>
        <li>Dan layanan kependudukan lainnya</li>
      </ul>

      <p>Datang langsung ke kantor Disdukcapil Ngada dengan membawa persyaratan yang diperlukan.</p>`,
      category: "Informasi",
      author: "Admin Disdukcapil",
      isPublished: true,
    },
    {
      title: "Jadwal Pelayanan Disdukcapil Ngada",
      slug: "jadwal-pelayanan",
      excerpt: "Informasi jadwal pelayanan Disdukcapil Ngada untuk masyarakat.",
      content: `<p>Berikut informasi jadwal pelayanan Disdukcapil Ngada. Pastikan Anda datang pada jam kerja yang telah ditentukan untuk mendapatkan pelayanan optimal.</p>

      <h2>Jadwal Operasional</h2>
      <ul>
        <li><strong>Senin - Kamis:</strong> 08.00 - 15.30 WITA</li>
        <li><strong>Jumat:</strong> 08.00 - 16.00 WITA</li>
        <li><strong>Sabtu - Minggu:</strong> Tutup</li>
      </ul>

      <h2>Lokasi</h2>
      <p>Jl. Ahmed A. Damanik, Soa, Kec. Bajawa, Kabupaten Ngada, Nusa Tenggara Timur</p>`,
      category: "Pengumuman",
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
