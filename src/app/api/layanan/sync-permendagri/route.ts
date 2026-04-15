import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Types for requirements structure
interface RequirementGroup {
  label: string;
  items: string[];
}

// Types for forms structure
interface FormsData {
  codes: string[];
  links: { name: string; url: string; size?: string }[];
}

interface ProcedureStep {
  step: number;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface LayananDefinition {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  requirements: RequirementGroup[];
  procedures: ProcedureStep[];
  forms: FormsData;
  faq: FAQItem[];
  processingTime: string;
  fee: string;
  order: number;
}

// ============================================================
// ALL SERVICE DEFINITIONS BASED ON PERMENDAGRI NO. 6 TAHUN 2026
// (Perubahan atas Permendagri No. 109 Tahun 2019)
// ============================================================

const PERMENDAGRI_SERVICES: LayananDefinition[] = [
  // ────────────────────────────────────────────────────────────
  // A. PENDAFTARAN PENDUDUK (Population Registration)
  // ────────────────────────────────────────────────────────────

  // 1. KTP-el
  {
    name: "KTP-el (Kartu Tanda Penduduk Elektronik)",
    slug: "ktp-el",
    description:
      "Kartu identitas elektronik untuk warga negara Indonesia yang berusia 17 tahun atau sudah menikah/pernah menikah. Meliputi pembuatan baru, penggantian rusak/hilang, dan perubahan data.",
    icon: "CreditCard",
    category: "Pendaftaran Penduduk",
    requirements: [
      {
        label: "Baru: KTP-el Baru",
        items: [
          "Formulir F-1.02 (Pendaftaran Peristiwa Kependudukan)",
          "KK Asli",
          "Akta Kelahiran / Surat Keterangan Lahir",
          "Surat Keterangan dari Kelurahan/Desa",
        ],
      },
      {
        label: "Hilang/Rusak",
        items: [
          "Formulir F-1.02",
          "KK Asli",
          "Surat Keterangan Kehilangan dari Kepolisian (untuk hilang)",
          "KTP-el Rusak (untuk rusak)",
        ],
      },
      {
        label: "Perubahan Data",
        items: [
          "Formulir F-1.02",
          "KK Asli",
          "Surat Keterangan / Bukti Perubahan Data",
          "Dokumen Pendukung Perubahan (akta perkawinan, akta kelahiran, dll)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan sesuai jenis layanan" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil Kab. Ngada pada jam kerja" },
      { step: 3, title: "Pendaftaran", description: "Ambil nomor antrian dan daftar di loket pelayanan" },
      { step: 4, title: "Verifikasi Data", description: "Petugas memverifikasi kelengkapan dan keabsahan dokumen" },
      { step: 5, title: "Perekaman/Pencetakan", description: "Perekaman biometrik (untuk rekam baru) atau pencetakan KTP-el langsung" },
    ],
    forms: { codes: ["F-1.02"], links: [] },
    faq: [
      { question: "Berapa lama proses pembuatan KTP-el?", answer: "Untuk pencetakan ulang, proses SELESAI DI TEMPAT. Untuk rekam baru, proses paling lambat 14 hari kerja." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Seluruh layanan pembuatan KTP-el adalah GRATIS sesuai Permendagri No. 6 Tahun 2026." },
      { question: "Dokumen apa yang wajib dibawa?", answer: "KK Asli dan formulir F-1.02 wajib dibawa untuk semua jenis layanan KTP-el." },
    ],
    processingTime: "Selesai di Tempat*",
    fee: "GRATIS",
    order: 1,
  },

  // 2. Kartu Keluarga (KK)
  {
    name: "Kartu Keluarga (KK)",
    slug: "kartu-keluarga",
    description:
      "Dokumen kependudukan yang memuat data susunan keluarga, hubungan kekeluargaan, dan jumlah anggota keluarga. Meliputi KK Baru, Pecah KK, dan Gabung KK.",
    icon: "Users",
    category: "Pendaftaran Penduduk",
    requirements: [
      {
        label: "Baru: Membentuk Keluarga Baru",
        items: [
          "Formulir F-1.01 (Biodata Keluarga)",
          "KTP-el Kepala Keluarga dan Anggota Keluarga",
          "Surat Nikah / Kutipan Akta Perkawinan",
          "Akta Kelahiran Anggota Keluarga",
          "Buku Nikah (jika sudah menikah)",
          "Kutipan Akta Perceraian (jika cerai)",
        ],
      },
      {
        label: "Pecah KK",
        items: [
          "KK Asli",
          "Formulir F-1.02",
          "KTP-el",
          "Akta Kelahiran / Akta Perkawinan",
        ],
      },
      {
        label: "Gabung KK",
        items: [
          "KK Asli (kedua KK)",
          "Formulir F-1.02",
          "KTP-el",
          "Surat Pernyataan Bersedia Menerima Sebagai Anggota Keluarga (F-1.03B)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan sesuai jenis layanan" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil pada jam kerja" },
      { step: 3, title: "Pendaftaran", description: "Daftar di loket pelayanan dengan dokumen lengkap" },
      { step: 4, title: "Verifikasi", description: "Petugas memverifikasi kelengkapan data dan dokumen" },
      { step: 5, title: "Pencetakan KK", description: "KK dicetak dan dapat diambil di tempat" },
    ],
    forms: { codes: ["F-1.01", "F-1.02", "F-1.03B"], links: [] },
    faq: [
      { question: "Apakah pembuatan KK dikenakan biaya?", answer: "TIDAK ADA. Pembuatan Kartu Keluarga adalah GRATIS." },
      { question: "Berapa lama prosesnya?", answer: "Proses SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
      { question: "Apa bedanya Pecah KK dan Gabung KK?", answer: "Pecah KK untuk memisahkan anggota keluarga dari KK induk. Gabung KK untuk bergabung ke KK yang sudah ada." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 2,
  },

  // 3. Kartu Identitas Anak (KIA)
  {
    name: "Kartu Identitas Anak (KIA)",
    slug: "kartu-identitas-anak",
    description:
      "Kartu identitas untuk anak yang berusia di bawah 17 tahun dan belum menikah. KIA diterbitkan sebagai bukti identitas anak untuk berbagai keperluan administrasi.",
    icon: "Baby",
    category: "Pendaftaran Penduduk",
    requirements: [
      {
        label: "Baru",
        items: [
          "Formulir F-1.02",
          "KK Asli",
          "Akta Kelahiran Anak",
          "KTP-el Orang Tua",
        ],
      },
      {
        label: "Hilang/Rusak",
        items: [
          "KK Asli",
          "Akta Kelahiran",
          "KIA Rusak (untuk rusak) / Surat Keterangan Kehilangan dari Kepolisian",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan dokumen persyaratan lengkap" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil pada jam kerja" },
      { step: 3, title: "Pendaftaran", description: "Daftar di loket pelayanan" },
      { step: 4, title: "Verifikasi & Penerbitan", description: "Petugas memverifikasi dokumen dan menerbitkan KIA" },
    ],
    forms: { codes: ["F-1.02"], links: [] },
    faq: [
      { question: "Untuk usia berapa KIA bisa dibuat?", answer: "KIA bisa dibuat untuk anak usia 0-17 tahun yang belum menikah." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Pembuatan KIA adalah GRATIS." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 3,
  },

  // 4. Surat Keterangan Pindah
  {
    name: "Surat Keterangan Pindah",
    slug: "surat-keterangan-pindah",
    description:
      "Layanan administrasi perpindahan penduduk antar kelurahan/kecamatan/kabupaten/kota/provinsi. Diterbitkan untuk penduduk yang akan pindah domisili.",
    icon: "MoveRight",
    category: "Pendaftaran Penduduk",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-1.03 (Pendaftaran Perpindahan Penduduk)",
          "KK Asli",
          "KTP-el Pemohon dan Anggota Keluarga yang Pindah",
          "Surat Kuasa Pengasuhan Anak dari Orang Tua/Wali (F-1.03A) jika membawa anak < 17 tahun",
          "Surat Pernyataan Bersedia Menerima Sebagai Anggota Keluarga (F-1.03B) jika menumpang KK",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan formulir F-1.03 dan dokumen pendukung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di loket pelayanan Disdukcapil asal" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data dan dokumen" },
      { step: 4, title: "Penerbitan SKPWNI", description: "Surat Keterangan Pindah (SKPWNI) diterbitkan" },
    ],
    forms: { codes: ["F-1.03", "F-1.03A", "F-1.03B"], links: [] },
    faq: [
      { question: "Berapa lama SKPWNI berlaku?", answer: "SKPWNI berlaku 30 hari sejak diterbitkan." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Penerbitan Surat Keterangan Pindah adalah GRATIS." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 4,
  },

  // 5. Surat Keterangan Pindah Luar Negeri (SKPLN)
  {
    name: "Surat Keterangan Pindah Luar Negeri (SKPLN)",
    slug: "skpln",
    description:
      "Layanan penerbitan Surat Keterangan Pindah Luar Negeri bagi WNI yang akan pindah ke luar wilayah Negara Kesatuan Republik Indonesia.",
    icon: "MapPin",
    category: "Pendaftaran Penduduk",
    requirements: [
      {
        label: "Persyaratan SKPLN",
        items: [
          "Formulir F-1.03",
          "KK Asli",
          "KTP-el",
          "Paspor",
          "Dokumen Perjalanan",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan formulir F-1.03, paspor, dan dokumen perjalanan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di loket pelayanan Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data dan dokumen" },
      { step: 4, title: "Penerbitan SKPLN", description: "SKPLN diterbitkan" },
    ],
    forms: { codes: ["F-1.03"], links: [] },
    faq: [
      { question: "Berapa lama SKPLN berlaku?", answer: "SKPLN berlaku sesuai ketentuan peraturan perundang-undangan." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Penerbitan SKPLN adalah GRATIS." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 5,
  },

  // ────────────────────────────────────────────────────────────
  // B. PENCATATAN SIPIL (Civil Registration)
  // ────────────────────────────────────────────────────────────

  // 6. Akta Kelahiran
  {
    name: "Akta Kelahiran",
    slug: "akta-kelahiran",
    description:
      "Akta catatan sipil yang diterbitkan untuk setiap peristiwa kelahiran yang terjadi dalam wilayah NKRI, sesuai ketentuan Permendagri No. 6 Tahun 2026.",
    icon: "Baby",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01A (Pelaporan Pencatatan Sipil dalam Wilayah NKRI)",
          "Surat Keterangan Lahir dari Dokter/Bidan/RS/Puskesmas",
          "KTP-el Pelapor",
          "KK Pelapor",
          "KTP-el dan KK Orang Tua",
          "Surat Nikah / Kutipan Akta Perkawinan Orang Tua (jika menikah)",
          "Data 2 (dua) orang Saksi beserta KTP-el",
        ],
      },
      {
        label: "Jika Tidak Ada Surat Keterangan Lahir",
        items: [
          "SPTJM Kebenaran Data Kelahiran (F-2.03)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat keterangan lahir dan formulir F-2.01A" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kelengkapan dokumen dan data saksi" },
      { step: 4, title: "Penerbitan", description: "Akta Kelahiran diterbitkan dan dicetak" },
    ],
    forms: { codes: ["F-2.01A", "F-2.03"], links: [] },
    faq: [
      { question: "Apakah ada biaya untuk akta kelahiran?", answer: "TIDAK ADA. Seluruh layanan pencatatan kelahiran adalah GRATIS." },
      { question: "Bagaimana jika tidak ada surat keterangan lahir?", answer: "Dapat menggunakan SPTJM Kebenaran Data Kelahiran (F-2.03)." },
      { question: "Berapa batas waktu pencatatan kelahiran?", answer: "Pencatatan kelahiran paling lambat 60 hari setelah tanggal kelahiran. Lebih dari 60 hari menggunakan prosedur pencatatan terlambat." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 6,
  },

  // 7. Akta Kematian
  {
    name: "Akta Kematian",
    slug: "akta-kematian",
    description:
      "Akta catatan sipil yang diterbitkan untuk setiap peristiwa kematian yang terjadi dalam wilayah NKRI, sesuai ketentuan Permendagri No. 6 Tahun 2026.",
    icon: "Heart",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01A (Pelaporan Pencatatan Sipil dalam Wilayah NKRI)",
          "Surat Keterangan Kematian dari Dokter/RS/Puskesmas/Tenaga Kesehatan",
          "KTP-el Almarhum/Almarhumah",
          "KK Asli",
          "KTP-el Pelapor",
          "Akta Kelahiran Almarhum/Almarhumah",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat keterangan kematian dan dokumen pendukung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data kematian" },
      { step: 4, title: "Penerbitan", description: "Akta Kematian diterbitkan" },
    ],
    forms: { codes: ["F-2.01A"], links: [] },
    faq: [
      { question: "Apakah ada biaya untuk akta kematian?", answer: "TIDAK ADA. Seluruh layanan pencatatan kematian adalah GRATIS." },
      { question: "Berapa batas waktu pencatatan kematian?", answer: "Pencatatan kematian sebaiknya dilakukan sesegera mungkin, paling lambat 30 hari setelah tanggal kematian." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 7,
  },

  // 8. Akta Perkawinan
  {
    name: "Akta Perkawinan",
    slug: "akta-perkawinan",
    description:
      "Pencatatan peristiwa perkawinan warga negara Indonesia yang dilangsungkan berdasarkan hukum agama dan telah dicatatkan pada Kantor Urusan Agama (KUA), sesuai Permendagri No. 6 Tahun 2026.",
    icon: "FileText",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01B (Pelaporan Perkawinan)",
          "Buku Nikah Asli",
          "KTP-el Suami dan Istri",
          "KK Suami dan Istri",
          "KTP-el 2 (dua) orang Saksi",
          "Akta Kelahiran Suami dan Istri",
        ],
      },
      {
        label: "Untuk Poligami",
        items: [
          "Kutipan Akta Perkawinan Sebelumnya",
        ],
      },
      {
        label: "Jika Tidak Ada Buku Nikah/Akta Perkawinan",
        items: [
          "SPTJM Kebenaran sebagai Pasangan Suami Istri (F-2.04)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan Buku Nikah asli dan formulir F-2.01B" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data perkawinan dan dokumen saksi" },
      { step: 4, title: "Penerbitan", description: "Akta Perkawinan diterbitkan" },
    ],
    forms: { codes: ["F-2.01B", "F-2.04"], links: [] },
    faq: [
      { question: "Apakah ada biaya untuk akta perkawinan?", answer: "TIDAK ADA. Seluruh layanan pencatatan perkawinan adalah GRATIS." },
      { question: "Kedua mempelai harus hadir?", answer: "Ya, kedua mempelai diharuskan hadir langsung di kantor Disdukcapil." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 8,
  },

  // 9. Akta Perceraian
  {
    name: "Akta Perceraian",
    slug: "akta-perceraian",
    description:
      "Pencatatan perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan, sesuai Permendagri No. 6 Tahun 2026.",
    icon: "Gavel",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01C (Pelaporan Perceraian)",
          "Kutipan Akta Perkawinan / Akta Nikah",
          "Putusan Pengadilan / Penetapan Pengadilan",
          "Akta Perkawinan Asli",
          "KTP-el Suami dan Istri",
          "KK Asli",
          "KTP-el 2 (dua) orang Saksi",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan putusan pengadilan dan formulir F-2.01C" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi putusan pengadilan dan dokumen pendukung" },
      { step: 4, title: "Penerbitan", description: "Akta Perceraian diterbitkan" },
    ],
    forms: { codes: ["F-2.01C"], links: [] },
    faq: [
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Seluruh layanan pencatatan perceraian adalah GRATIS." },
      { question: "Apakah putusan pengadilan harus berkekuatan hukum tetap?", answer: "Ya, putusan pengadilan harus sudah berkekuatan hukum tetap (inkracht)." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 9,
  },

  // 10. Pengakuan Anak / Pengesahan Anak
  {
    name: "Pengakuan Anak / Pengesahan Anak",
    slug: "pengakuan-anak",
    description:
      "Layanan pencatatan pengakuan anak dan pengesahan anak berdasarkan putusan pengadilan, sesuai Permendagri No. 6 Tahun 2026.",
    icon: "Users",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01D",
          "Putusan Pengadilan",
          "Akta Kelahiran Anak",
          "KTP-el Orang Tua / Wali",
          "KK Asli",
          "KTP-el 2 (dua) orang Saksi",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan putusan pengadilan dan formulir F-2.01D" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi putusan pengadilan dan dokumen pendukung" },
      { step: 4, title: "Penerbitan", description: "Akta Pengakuan/Pengesahan Anak diterbitkan" },
    ],
    forms: { codes: ["F-2.01D"], links: [] },
    faq: [
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Layanan ini GRATIS." },
      { question: "Apakah putusan pengadilan diperlukan?", answer: "Ya, pengakuan anak dan pengesahan anak memerlukan putusan pengadilan." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 10,
  },

  // 11. Pembetulan Akta Pencatatan Sipil
  {
    name: "Pembetulan Akta Pencatatan Sipil",
    slug: "pembetulan-akta",
    description:
      "Layanan pembetulan, pembatalan, atau penerbitan kembali akta pencatatan sipil yang mengandung kesalahan, sesuai Permendagri No. 6 Tahun 2026.",
    icon: "FileText",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01F (Pembetulan/Pembatalan/Penerbitan Kembali Akta)",
          "Akta Asli yang akan dibetulkan",
          "Dokumen Pendukung yang benar (sesuai jenis pembetulan)",
          "SPTJM Pembetulan Akta (F-2.04B)",
        ],
      },
      {
        label: "Untuk Pembetulan Berat",
        items: [
          "Putusan Pengadilan",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan akta asli dan dokumen pendukung yang benar" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil dengan formulir F-2.01F" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi dokumen dan data pembetulan" },
      { step: 4, title: "Pembetulan & Penerbitan", description: "Akta dibetulkan dan diterbitkan kembali" },
    ],
    forms: { codes: ["F-2.01F", "F-2.04B"], links: [] },
    faq: [
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Layanan pembetulan akta adalah GRATIS." },
      { question: "Apa perbedaan pembetulan ringan dan berat?", answer: "Pembetulan ringan dapat dilakukan di Disdukcapil. Pembetulan berat (seperti perubahan nama, status) memerlukan putusan pengadilan." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 11,
  },

  // 12. Perubahan Nama / Status Kewarganegaraan
  {
    name: "Perubahan Nama / Status Kewarganegaraan",
    slug: "perubahan-nama-kewarganegaraan",
    description:
      "Layanan perubahan nama dan/atau status kewarganegaraan berdasarkan putusan pengadilan, sesuai Permendagri No. 6 Tahun 2026.",
    icon: "RefreshCw",
    category: "Pencatatan Sipil",
    requirements: [
      {
        label: "Persyaratan Umum",
        items: [
          "Formulir F-2.01E",
          "Putusan Pengadilan",
          "KTP-el",
          "KK Asli",
          "Akta Kelahiran",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan putusan pengadilan dan formulir F-2.01E" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi putusan pengadilan dan dokumen" },
      { step: 4, title: "Pembaharuan Data", description: "Data diperbarui di sistem dan dokumen diterbitkan kembali" },
    ],
    forms: { codes: ["F-2.01E"], links: [] },
    faq: [
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Layanan ini GRATIS." },
      { question: "Apakah perubahan nama memerlukan putusan pengadilan?", answer: "Ya, perubahan nama dan status kewarganegaraan harus melalui putusan pengadilan terlebih dahulu." },
    ],
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    order: 12,
  },
];

// Legal basis reference
const DASAR_HUKUM = {
  utama: "Permendagri No. 6 Tahun 2026",
  lengkap:
    "Peraturan Menteri Dalam Negeri tentang Perubahan atas Permendagri No. 109 Tahun 2019 tentang Formulir dan Buku yang Digunakan dalam Administrasi Kependudukan",
  pendukung: [
    "UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    "Permendagri No. 109 Tahun 2019 tentang Formulir dan Buku dalam Administrasi Kependudukan",
    "PP No. 37 Tahun 2021 tentang Capil",
  ],
};

// POST - Sync layanan with Permendagri No. 6 Tahun 2026
export async function POST(request: NextRequest) {
  try {
    const results = {
      updated: 0,
      created: 0,
      skipped: 0,
      errors: [] as string[],
      details: [] as { slug: string; action: string }[],
    };

    for (const serviceDef of PERMENDAGRI_SERVICES) {
      try {
        const existingLayanan = await db.layanan.findUnique({
          where: { slug: serviceDef.slug },
        });

        const requirementsJson = JSON.stringify(serviceDef.requirements);
        const proceduresJson = JSON.stringify(serviceDef.procedures);
        const formsJson = JSON.stringify(serviceDef.forms);
        const faqJson = JSON.stringify(serviceDef.faq);

        if (existingLayanan) {
          // Update existing layanan
          await db.layanan.update({
            where: { slug: serviceDef.slug },
            data: {
              name: serviceDef.name,
              description: serviceDef.description,
              icon: serviceDef.icon,
              category: serviceDef.category,
              requirements: requirementsJson,
              procedures: proceduresJson,
              forms: formsJson,
              faq: faqJson,
              processingTime: serviceDef.processingTime,
              fee: serviceDef.fee,
              order: serviceDef.order,
              isActive: true,
            },
          });
          results.updated++;
          results.details.push({
            slug: serviceDef.slug,
            action: "updated",
          });
        } else {
          // Create new layanan
          await db.layanan.create({
            data: {
              name: serviceDef.name,
              slug: serviceDef.slug,
              description: serviceDef.description,
              icon: serviceDef.icon,
              category: serviceDef.category,
              requirements: requirementsJson,
              procedures: proceduresJson,
              forms: formsJson,
              faq: faqJson,
              processingTime: serviceDef.processingTime,
              fee: serviceDef.fee,
              order: serviceDef.order,
              isActive: true,
            },
          });
          results.created++;
          results.details.push({
            slug: serviceDef.slug,
            action: "created",
          });
        }
      } catch (error) {
        const msg = `Error processing ${serviceDef.slug}: ${error instanceof Error ? error.message : String(error)}`;
        results.errors.push(msg);
        console.error(msg);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sync Permendagri No. 6 Tahun 2026 berhasil",
      data: {
        dasarHukum: DASAR_HUKUM,
        summary: {
          totalServices: PERMENDAGRI_SERVICES.length,
          updated: results.updated,
          created: results.created,
          skipped: results.skipped,
          errors: results.errors.length,
        },
        details: results.details,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error("Error syncing Permendagri data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal sinkronisasi data Permendagri",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
