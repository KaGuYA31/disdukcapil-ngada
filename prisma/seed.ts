import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Admin
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      name: 'Administrator',
      email: 'admin@ngadakab.go.id',
    },
  });

  // Seed Layanan - Pendaftaran Penduduk
  const pendaftaranPenduduk = [
    {
      name: 'KTP-el (Kartu Tanda Penduduk Elektronik)',
      slug: 'ktp-el',
      description: 'Kartu identitas elektronik untuk WNI berusia 17 tahun atau sudah menikah. Mencakup rekam baru, penggantian rusak/hilang, dan perpanjangan.',
      icon: 'CreditCard',
      category: 'Pendaftaran Penduduk',
      requirements: JSON.stringify([
        { label: 'Fotokopi Kartu Keluarga', description: '1 lembar' },
        { label: 'Surat Pengantar RT/RW', description: 'Asli' },
        { label: 'Akta Kelahiran / Ijazah', description: 'Fotokopi 1 lembar' },
        { label: 'Pas Foto 3x4', description: '2 lembar, latar merah' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Ambil Nomor Antrian', description: 'Di loket pelayanan' },
        { step: 2, title: 'Verifikasi Berkas', description: 'Petugas memeriksa kelengkapan berkas' },
        { step: 3, title: 'Perekaman Data', description: 'Rekam biometrik (sidik jari, iris, foto)' },
        { step: 4, title: 'Cetak KTP-el', description: 'KTP selesai dicetak' },
      ]),
      processingTime: 'Selesai di Tempat*',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 1,
    },
    {
      name: 'Kartu Keluarga (KK)',
      slug: 'kartu-keluarga',
      description: 'Dokumen kependudukan yang memuat data tentang susunan, hubungan, dan jumlah anggota keluarga. Mencakup KK Baru, Tambah Anggota, dan KK Hilang/Rusak.',
      icon: 'Users',
      category: 'Pendaftaran Penduduk',
      requirements: JSON.stringify([
        { label: 'KTP-el asli Kepala Keluarga', description: '' },
        { label: 'Surat Nikah/Cerai (jika ada perubahan)', description: 'Fotokopi' },
        { label: 'Akta Kelahiran anggota keluarga', description: 'Fotokopi' },
        { label: 'Surat Pengantar RT/RW', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Persiapan Berkas', description: 'Siapkan semua persyaratan' },
        { step: 2, title: 'Datang ke Kantor Disdukcapil', description: 'Bawa berkas asli dan fotokopi' },
        { step: 3, title: 'Verifikasi Data', description: 'Petugas memverifikasi data' },
        { step: 4, title: 'Penerbitan KK', description: 'KK dicetak dan diserahkan' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 2,
    },
    {
      name: 'Perubahan Data Kependudukan',
      slug: 'perubahan-data',
      description: 'Layanan perubahan atau pemutakhiran data kependudukan seperti perubahan alamat, status perkawinan, pendidikan, pekerjaan, dan lainnya.',
      icon: 'RefreshCw',
      category: 'Pendaftaran Penduduk',
      requirements: JSON.stringify([
        { label: 'KTP-el asli', description: '' },
        { label: 'KK asli', description: '' },
        { label: 'Dokumen pendukung perubahan', description: 'Sesuai jenis perubahan' },
        { label: 'Surat Pengantar RT/RW', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Siapkan Berkas', description: 'Lengkapi persyaratan sesuai jenis perubahan' },
        { step: 2, title: 'Proses di Loket', description: 'Serahkan berkas ke petugas' },
        { step: 3, title: 'Verifikasi', description: 'Data diverifikasi oleh petugas' },
        { step: 4, title: 'Selesai', description: 'Data diperbarui di database' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 3,
    },
    {
      name: 'Legalisasi Dokumen',
      slug: 'legalisasi',
      description: 'Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang untuk keperluan administrasi.',
      icon: 'Stamp',
      category: 'Pendaftaran Penduduk',
      requirements: JSON.stringify([
        { label: 'Dokumen asli yang akan dilegalisasi', description: '' },
        { label: 'Fotokopi dokumen', description: '2 rangkap' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Siapkan Dokumen', description: 'Bawa dokumen asli dan fotokopi' },
        { step: 2, title: 'Proses Legalisasi', description: 'Petugas mencocokkan dan menandatangani' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 4,
    },
  ];

  // Seed Layanan - Pencatatan Sipil
  const pencatatanSipil = [
    {
      name: 'Akta Kelahiran',
      slug: 'akta-kelahiran',
      description: 'Pencatatan kelahiran untuk setiap peristiwa kelahiran, baik kelahiran baru maupun kelahiran terlambat (lebih dari 60 hari).',
      icon: 'Baby',
      category: 'Pencatatan Sipil',
      requirements: JSON.stringify([
        { label: 'Surat Keterangan Kelahiran dari RS/Bidan', description: 'Asli' },
        { label: 'KTP-el kedua orang tua', description: 'Fotokopi' },
        { label: 'KK / Surat Nikah kedua orang tua', description: 'Fotokopi' },
        { label: 'Surat Pengantar RT/RW', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Persiapan Berkas', description: 'Lengkapi semua persyaratan' },
        { step: 2, title: 'Pendaftaran', description: 'Daftar di loket pencatatan sipil' },
        { step: 3, title: 'Verifikasi', description: 'Petugas memverifikasi data' },
        { step: 4, title: 'Penerbitan Akta', description: 'Akta kelahiran dicetak' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 5,
    },
    {
      name: 'Akta Kematian',
      slug: 'akta-kematian',
      description: 'Pencatatan kematian yang diterbitkan untuk setiap peristiwa kematian warga negara Indonesia.',
      icon: 'Heart',
      category: 'Pencatatan Sipil',
      requirements: JSON.stringify([
        { label: 'Surat Keterangan Kematian dari RS/Dokter', description: 'Asli' },
        { label: 'KTP-el almarhum/ahli waris', description: 'Fotokopi' },
        { label: 'KK asli', description: '' },
        { label: 'Surat Pengantar RT/RW', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Siapkan Berkas', description: 'Lengkapi persyaratan' },
        { step: 2, title: 'Proses Pencatatan', description: 'Di loket pencatatan sipil' },
        { step: 3, title: 'Penerbitan Akta', description: 'Akta kematian dicetak' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 6,
    },
    {
      name: 'Akta Perkawinan',
      slug: 'akta-perkawinan',
      description: 'Pencatatan peristiwa perkawinan WNI yang dilangsungkan berdasarkan hukum agama masing-masing.',
      icon: 'FileText',
      category: 'Pencatatan Sipil',
      requirements: JSON.stringify([
        { label: 'Surat Nikah dari KUA/Pengadilan', description: 'Asli + Fotokopi' },
        { label: 'KTP-el kedua pasangan', description: 'Fotokopi' },
        { label: 'KK kedua pasangan', description: 'Fotokopi' },
        { label: 'Pas Foto 3x4', description: '2 lembar per pasangan' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Persiapan', description: 'Siapkan buku nikah dan berkas' },
        { step: 2, title: 'Pendaftaran', description: 'Daftar di loket pencatatan sipil' },
        { step: 3, title: 'Verifikasi', description: 'Petugas memverifikasi buku nikah' },
        { step: 4, title: 'Penerbitan Akta', description: 'Akta perkawinan dicetak' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 7,
    },
    {
      name: 'Akta Perceraian',
      slug: 'akta-perceraian',
      description: 'Pencatatan perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan.',
      icon: 'Gavel',
      category: 'Pencatatan Sipil',
      requirements: JSON.stringify([
        { label: 'Putusan Pengadilan (telah berkekuatan hukum tetap)', description: 'Asli + Fotokopi' },
        { label: 'KTP-el', description: 'Fotokopi' },
        { label: 'KK', description: 'Fotokopi' },
        { label: 'Akta Perkawinan', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Persiapan', description: 'Siapkan putusan pengadilan dan berkas' },
        { step: 2, title: 'Pendaftaran', description: 'Daftar di loket pencatatan sipil' },
        { step: 3, title: 'Verifikasi', description: 'Petugas memeriksa putusan' },
        { step: 4, title: 'Penerbitan Akta', description: 'Akta perceraian dicetak' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 8,
    },
    {
      name: 'Pindah (Perpindahan Penduduk)',
      slug: 'pindah-penduduk',
      description: 'Layanan administrasi perpindahan penduduk antar kelurahan/kecamatan/kabupaten/kota/provinsi.',
      icon: 'MoveRight',
      category: 'Pencatatan Sipil',
      requirements: JSON.stringify([
        { label: 'KTP-el asli', description: '' },
        { label: 'KK asli', description: '' },
        { label: 'Surat Keterangan Pindah dari kelurahan asal', description: 'Asli' },
        { label: 'Surat Pengantar RT/RW tujuan', description: 'Asli' },
      ]),
      procedures: JSON.stringify([
        { step: 1, title: 'Pengurusan di Daerah Asal', description: 'Minta surat pindah dari kelurahan/kecamatan asal' },
        { step: 2, title: 'Pendaftaran di Daerah Tujuan', description: 'Daftar di Disdukcapil tujuan' },
        { step: 3, title: 'Penerbitan KK Baru', description: 'KK baru diterbitkan di daerah tujuan' },
      ]),
      processingTime: 'Selesai di Tempat',
      fee: 'GRATIS',
      isActive: true,
      isOnline: false,
      order: 9,
    },
  ];

  for (const layanan of [...pendaftaranPenduduk, ...pencatatanSipil]) {
    await prisma.layanan.upsert({
      where: { slug: layanan.slug },
      update: {},
      create: layanan,
    });
  }

  console.log('✅ Seed data berhasil ditambahkan');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
