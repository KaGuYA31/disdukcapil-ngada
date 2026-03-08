"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CreditCard,
  Users,
  Baby,
  Heart,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  ArrowLeft,
  Clock,
  FileCheck,
  AlertCircle,
  Download,
  HelpCircle,
  CheckCircle,
  Gavel,
  UserPlus,
  MoveRight,
  ScrollText,
  Sparkles,
  UserPlus2,
  FileWarning,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const serviceData: Record<string, {
  id: string;
  icon: typeof CreditCard;
  title: string;
  description: string;
  category: string;
  processingTime: string;
  fee: string;
  color: string;
  bgColor: string;
  sameDayService: boolean;
  legalBasis: { name: string; description: string }[];
  requirements: { title: string; items: string[] }[];
  procedures: { step: number; title: string; description: string }[];
  forms: { title: string; url: string; size: string }[];
  faq: { question: string; answer: string }[];
  notes: string[];
}> = {
  "ktp-el": {
    id: "ktp-el",
    icon: CreditCard,
    title: "KTP-el (Kartu Tanda Penduduk Elektronik)",
    description:
      "Kartu identitas elektronik untuk warga negara Indonesia yang berusia 17 tahun atau sudah menikah/pernah menikah, sebagai identitas resmi kependudukan.",
    category: "Dokumen Identitas",
    processingTime: "Selesai di Tempat (Kecuali Rekam Baru)",
    fee: "GRATIS",
    color: "text-green-600",
    bgColor: "bg-green-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 60-64 tentang KTP-el" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Perekaman Baru (Pemula) - Usia 17 Tahun",
        items: [
          "Berusia minimal 17 Tahun",
          "FC Kartu Keluarga (Terbaru)",
          "FC Ijazah Terakhir (WAJIB dibawa)",
          "FC Akta Kelahiran (Hanya jika tidak bersekolah/tidak punya ijazah)",
        ],
      },
      {
        title: "KTP-el Baru (Karena Perkawinan)",
        items: [
          "FC Kartu Keluarga (Terbaru)",
          "FC Buku Nikah / Kutipan Akta Perkawinan",
          "FC Ijazah Terakhir atau FC Akta Kelahiran",
        ],
      },
      {
        title: "KTP-el Penggantian (Rusak)",
        items: [
          "KTP-el rusak (diserahkan untuk dimusnahkan)",
          "FC Kartu Keluarga (Terbaru)",
        ],
      },
      {
        title: "KTP-el Penggantian (Hilang)",
        items: [
          "Surat Keterangan Kehilangan dari Kepolisian (asli)",
          "FC Kartu Keluarga (Terbaru)",
        ],
      },
      {
        title: "KTP-el Perpanjangan",
        items: [
          "KTP-el lama (yang akan diperpanjang)",
          "FC Kartu Keluarga (Terbaru)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan dengan lengkap sesuai jenis permohonan" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil pada jam kerja (Senin-Jumat)" },
      { step: 3, title: "Pendaftaran", description: "Ambil nomor antrian dan daftar di loket pelayanan" },
      { step: 4, title: "Verifikasi Data", description: "Petugas memverifikasi kelengkapan dan kebenaran dokumen" },
      { step: 5, title: "Perekaman Biometrik", description: "Foto wajah dan sidik jari untuk KTP-el (untuk rekam baru)" },
      { step: 6, title: "Pencetakan KTP-el", description: "KTP-el dicetak dan dapat diambil di tempat (kecuali rekam baru)" },
    ],
    forms: [
      { title: "Formulir F-1.01", url: "#", size: "250 KB" },
    ],
    faq: [
      { question: "Berapa lama proses pembuatan KTP-el?", answer: "Untuk cetak KTP-el (penggantian/perubahan data), proses SELESAI DI TEMPAT. Untuk rekam baru KTP-el, proses memakan waktu 3-5 hari kerja karena menunggu data dari pusat." },
      { question: "Apakah ada biaya untuk pembuatan KTP-el?", answer: "TIDAK ADA. Seluruh layanan pembuatan KTP-el adalah GRATIS." },
      { question: "Apa yang harus dilakukan jika KTP-el hilang?", answer: "Laporkan kehilangan ke Polres/Polsek terdekat untuk mendapatkan Surat Keterangan Kehilangan, kemudian bawa ke kantor Disdukcapil." },
    ],
    notes: [
      "Untuk REKAM BARU KTP-el, pemohon wajib hadir untuk perekaman biometrik (foto dan sidik jari)",
      "KTP-el yang rusak wajib diserahkan untuk dimusnahkan",
      "Pastikan data NIK dan KK sesuai dengan database kependudukan",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "kartu-keluarga": {
    id: "kartu-keluarga",
    icon: Users,
    title: "Kartu Keluarga (KK)",
    description:
      "Dokumen kependudukan yang memuat data susunan keluarga, hubungan kekeluargaan, dan jumlah anggota keluarga. KK merupakan dokumen dasar untuk mengurus layanan kependudukan lainnya.",
    category: "Dokumen Keluarga",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 53-59 tentang Kartu Keluarga" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "KK Baru (Membentuk Keluarga)",
        items: [
          "Mengisi Formulir F-1.01",
          "FC Buku Nikah / Kutipan Akta Perkawinan",
          "SPTJM Kebenaran Pasangan Suami Istri (jika tidak ada buku nikah/akta perkawinan)",
          "FC Ijazah / Akta Lahir (untuk validasi biodata)",
        ],
      },
      {
        title: "Tambah Anggota (Anak)",
        items: [
          "KK Lama (Asli)",
          "Surat Keterangan Lahir dari Bidan/RS atau SPTJM Kelahiran",
          "FC Buku Nikah / Akta Perkawinan Orang Tua",
        ],
      },
      {
        title: "KK Hilang",
        items: [
          "Surat Keterangan Hilang dari Kepolisian (asli)",
          "KTP-el Kepala Keluarga",
        ],
      },
      {
        title: "KK Rusak",
        items: [
          "Fisik KK yang rusak (asli)",
          "KTP-el Kepala Keluarga",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan sesuai jenis permohonan" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil dengan membawa berkas lengkap" },
      { step: 3, title: "Pendaftaran", description: "Daftar di loket pelayanan dengan mengisi formulir" },
      { step: 4, title: "Verifikasi Data", description: "Petugas memverifikasi kelengkapan dan kebenaran data" },
      { step: 5, title: "Pencetakan KK", description: "KK dicetak dan dapat diambil di tempat" },
    ],
    forms: [
      { title: "Formulir F-1.01", url: "#", size: "200 KB" },
    ],
    faq: [
      { question: "Apakah pembuatan KK dikenakan biaya?", answer: "TIDAK ADA. Pembuatan Kartu Keluarga adalah GRATIS." },
      { question: "Berapa lama proses pembuatan KK?", answer: "Proses pembuatan KK SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
      { question: "Apakah KK bisa dibuat terpisah dari orang tua?", answer: "Ya, KK terpisah dapat dibuat untuk yang sudah menikah atau pindah domisili." },
    ],
    notes: [
      "KK baru akan diterbitkan jika terjadi perubahan komposisi keluarga",
      "Pastikan semua data NIK anggota keluarga aktif di database",
      "Bawa dokumen asli dan fotokopi untuk verifikasi",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "pindah-datang-kk-sendiri": {
    id: "pindah-datang-kk-sendiri",
    icon: MoveRight,
    title: "Pindah Datang (Buat KK Sendiri)",
    description:
      "Layanan administrasi perpindahan penduduk untuk warga yang pindah dari daerah lain dan akan membuat Kartu Keluarga baru atas nama sendiri.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 19-26 tentang Perpindahan Penduduk" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Pindah Datang (Buat KK Sendiri)",
        items: [
          "Surat Keterangan Pindah (SKPWNI) dari daerah asal (asli)",
          "Mengisi Formulir F-1.01",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan SKPWNI dari Disdukcapil asal" },
      { step: 2, title: "Pendaftaran", description: "Daftar di Disdukcapil tujuan dengan membawa berkas lengkap" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data perpindahan" },
      { step: 4, title: "Penerbitan KK", description: "KK baru diterbitkan dan dicetak" },
    ],
    forms: [
      { title: "Formulir F-1.01", url: "#", size: "200 KB" },
    ],
    faq: [
      { question: "Apakah ada biaya untuk layanan ini?", answer: "TIDAK ADA. Seluruh layanan perpindahan penduduk adalah GRATIS." },
      { question: "Berapa lama prosesnya?", answer: "Proses SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
    ],
    notes: [
      "SKPWNI berlaku 30 hari sejak diterbitkan",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "pindah-datang-numpang-kk": {
    id: "pindah-datang-numpang-kk",
    icon: Users,
    title: "Pindah Datang (Numpang KK)",
    description:
      "Layanan administrasi perpindahan penduduk untuk warga yang pindah dari daerah lain dan akan menumpang pada Kartu Keluarga yang sudah ada.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 19-26 tentang Perpindahan Penduduk" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Pindah Datang (Numpang KK)",
        items: [
          "Surat Keterangan Pindah (SKPWNI) dari daerah asal (asli)",
          "KK Asli Penampung (KK yang akan ditumpangi)",
          "Surat Keterangan Domisili",
          "Mengisi Formulir F-1.01",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan SKPWNI dan KK penampung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di Disdukcapil tujuan dengan membawa berkas lengkap" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data perpindahan" },
      { step: 4, title: "Update KK", description: "Data ditambahkan ke KK penampung" },
    ],
    forms: [
      { title: "Formulir F-1.01", url: "#", size: "200 KB" },
    ],
    faq: [
      { question: "Apakah ada biaya untuk layanan ini?", answer: "TIDAK ADA. Seluruh layanan perpindahan penduduk adalah GRATIS." },
      { question: "Berapa lama prosesnya?", answer: "Proses SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
    ],
    notes: [
      "SKPWNI berlaku 30 hari sejak diterbitkan",
      "KK penampung harus masih aktif",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "akta-kelahiran": {
    id: "akta-kelahiran",
    icon: Baby,
    title: "Akta Kelahiran",
    description:
      "Akta catatan sipil yang diterbitkan untuk setiap peristiwa kelahiran. Akta Kelahiran merupakan dokumen penting untuk keperluan administrasi pendidikan, pekerjaan, dan layanan publik lainnya.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 27-32 tentang Pencatatan Kelahiran" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Akta Kelahiran (Baru)",
        items: [
          "Surat Keterangan Kelahiran dari RS/Bidan/Puskesmas (asli)",
          "FC Kartu Keluarga Orang Tua",
          "FC KTP-el kedua orang tua",
          "FC Buku Nikah / Akta Perkawinan Orang Tua",
        ],
      },
      {
        title: "Akta Kelahiran (Terlambat)",
        items: [
          "Surat Keterangan Kelahiran dari RS/Bidan/Puskesmas atau SPTJM Kelahiran",
          "FC Kartu Keluarga Orang Tua",
          "FC KTP-el kedua orang tua",
          "FC Buku Nikah / Akta Perkawinan Orang Tua",
          "Surat Keterangan dari Kelurahan/Desa",
          "Saksi-saksi (minimal 2 orang)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat kelahiran dan dokumen pendukung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kelengkapan data" },
      { step: 4, title: "Penerbitan", description: "Akta Kelahiran diterbitkan dan dicetak" },
    ],
    forms: [
      { title: "Formulir Pelaporan Kelahiran (F-2.01)", url: "#", size: "180 KB" },
    ],
    faq: [
      { question: "Apakah ada biaya untuk akta kelahiran?", answer: "TIDAK ADA. Seluruh layanan pencatatan kelahiran adalah GRATIS tanpa ada denda atau biaya apapun." },
      { question: "Bagaimana jika tidak punya bukti kelahiran?", answer: "Dapat menggunakan SPTJM Kelahiran dan saksi-saksi." },
    ],
    notes: [
      "Pendaftaran sebaiknya dilakukan sesegera mungkin setelah kelahiran",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "akta-kematian": {
    id: "akta-kematian",
    icon: Heart,
    title: "Akta Kematian",
    description:
      "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian. Akta Kematian diperlukan untuk mengurus hak waris, asuransi, pensiun, dan keperluan administrasi lainnya.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 33-38 tentang Pencatatan Kematian" },
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Akta Kematian",
        items: [
          "Surat Keterangan Kematian dari RS/Dokter/Puskesmas (asli)",
          "Surat Keterangan Kematian dari Kelurahan/Desa (asli)",
          "KTP-el almarhum (asli - akan dimusnahkan)",
          "FC Kartu Keluarga",
          "KTP-el pelapor",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat kematian dari RS/Dokter dan dokumen pendukung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data kematian" },
      { step: 4, title: "Penerbitan", description: "Akta Kematian diterbitkan dan dicetak" },
    ],
    forms: [
      { title: "Formulir Pelaporan Kematian (F-2.02)", url: "#", size: "170 KB" },
    ],
    faq: [
      { question: "Apakah ada biaya untuk layanan ini?", answer: "TIDAK ADA. Seluruh layanan pencatatan kematian adalah GRATIS." },
      { question: "Siapa yang dapat melaporkan kematian?", answer: "Keluarga terdekat atau pihak yang mengetahui peristiwa kematian." },
    ],
    notes: [
      "KTP-el almarhum wajib diserahkan untuk dimusnahkan",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "akta-perkawinan": {
    id: "akta-perkawinan",
    icon: FileText,
    title: "Akta Perkawinan",
    description:
      "Pencatatan peristiwa perkawinan warga negara Indonesia yang dilangsungkan berdasarkan hukum agama atau kepercayaan. Akta Perkawinan merupakan bukti resmi pernikahan.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-red-600",
    bgColor: "bg-red-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 39-48 tentang Pencatatan Perkawinan" },
      { name: "UU No. 1 Tahun 1974", description: "Tentang Perkawinan" },
    ],
    requirements: [
      {
        title: "Pencatatan Perkawinan",
        items: [
          "Kutipan Akta Nikah dari KUA atau Surat Nikah dari Gereja/Tokoh Agama (asli)",
          "FC KTP-el kedua mempelai",
          "FC Kartu Keluarga kedua mempelai",
          "FC Akta Kelahiran kedua mempelai",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan Akta Nikah dari KUA atau dokumen perkawinan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data perkawinan" },
      { step: 4, title: "Penerbitan", description: "Akta Perkawinan diterbitkan" },
    ],
    forms: [
      { title: "Formulir Pencatatan Perkawinan (F-2.03)", url: "#", size: "200 KB" },
    ],
    faq: [
      { question: "Apakah ada biaya untuk pencatatan perkawinan?", answer: "TIDAK ADA. Seluruh layanan pencatatan perkawinan adalah GRATIS." },
      { question: "Berapa lama prosesnya?", answer: "Proses SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
    ],
    notes: [
      "Kedua mempelai diharuskan hadir untuk proses pencatatan",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "akta-perceraian": {
    id: "akta-perceraian",
    icon: Gavel,
    title: "Akta Perceraian",
    description:
      "Pencatatan peristiwa perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 49-52 tentang Pencatatan Perceraian" },
      { name: "UU No. 1 Tahun 1974", description: "Tentang Perkawinan" },
    ],
    requirements: [
      {
        title: "Pencatatan Perceraian",
        items: [
          "Kutipan Putusan Pengadilan yang berkekuatan hukum tetap (asli)",
          "Akta Perkawinan (asli)",
          "FC KTP-el kedua pihak",
          "FC Kartu Keluarga",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan putusan pengadilan yang berkekuatan hukum tetap" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi putusan pengadilan" },
      { step: 4, title: "Penerbitan", description: "Akta Perceraian diterbitkan" },
    ],
    forms: [
      { title: "Formulir Pencatatan Perceraian (F-2.05)", url: "#", size: "190 KB" },
    ],
    faq: [
      { question: "Apakah perceraian harus dicatatkan?", answer: "Ya, untuk memperbarui status kependudukan." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Seluruh layanan pencatatan perceraian adalah GRATIS." },
    ],
    notes: [
      "Putusan pengadilan harus sudah berkekuatan hukum tetap (inkracht)",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "perubahan-data": {
    id: "perubahan-data",
    icon: RefreshCw,
    title: "Perubahan Data Kependudukan",
    description:
      "Layanan perubahan atau pemutakhiran data kependudukan seperti alamat, status perkawinan, dan data administratif lainnya.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 65-73 tentang Perubahan Data" },
    ],
    requirements: [
      {
        title: "Perubahan Alamat",
        items: [
          "KTP-el (asli)",
          "FC Kartu Keluarga",
          "Surat Keterangan Domisili dari Kelurahan/Desa",
        ],
      },
      {
        title: "Perubahan Status Perkawinan",
        items: [
          "KTP-el (asli)",
          "FC Kartu Keluarga",
          "Akta Perkawinan (untuk status menikah)",
          "Akta Perceraian (untuk status cerai)",
        ],
      },
      {
        title: "Koreksi Data",
        items: [
          "KTP-el (asli)",
          "FC Kartu Keluarga",
          "Dokumen pendukung yang benar (akta kelahiran, akta nikah, dll)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan dokumen bukti perubahan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kebenaran data" },
      { step: 4, title: "Update Data", description: "Data diperbarui di sistem" },
    ],
    forms: [
      { title: "Formulir Perubahan Data", url: "#", size: "180 KB" },
    ],
    faq: [
      { question: "Data apa saja yang dapat diubah?", answer: "Alamat, status perkawinan, pendidikan, pekerjaan, dan data administratif lainnya." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Seluruh layanan perubahan data adalah GRATIS." },
    ],
    notes: [
      "Perubahan nama memerlukan putusan pengadilan",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "legalisasi": {
    id: "legalisasi",
    icon: Stamp,
    title: "Legalisasi Dokumen",
    description:
      "Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang untuk keperluan administrasi.",
    category: "Layanan Umum",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    sameDayService: true,
    legalBasis: [
      { name: "Permendagri No. 3 Tahun 2024", description: "Petunjuk Teknis Administrasi Kependudukan" },
    ],
    requirements: [
      {
        title: "Legalisasi Dokumen",
        items: [
          "Dokumen asli yang akan dilegalisasi",
          "Fotokopi dokumen yang akan dilegalisasi",
          "KTP-el pemohon",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Dokumen", description: "Siapkan dokumen asli dan fotokopi" },
      { step: 2, title: "Verifikasi", description: "Petugas memverifikasi keaslian dokumen" },
      { step: 3, title: "Legalisasi", description: "Petugas melegalisasi dokumen" },
    ],
    forms: [],
    faq: [
      { question: "Apakah ada biaya legalisasi?", answer: "TIDAK ADA. Layanan legalisasi dokumen kependudukan adalah GRATIS." },
    ],
    notes: [
      "Bawa dokumen asli untuk verifikasi",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
};

export function ServiceDetail({ slug }: { slug: Promise<{ slug: string }> }) {
  const params = useParams();
  const slugValue = params.slug as string;
  
  const service = useMemo(() => {
    return serviceData[slugValue] || null;
  }, [slugValue]);

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Layanan Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-6">
          Layanan yang Anda cari tidak tersedia.
        </p>
        <Link href="/layanan">
          <Button className="bg-green-700 hover:bg-green-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Layanan
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-green-200 hover:text-white">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-green-300" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/layanan" className="text-green-200 hover:text-white">
                  Layanan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-green-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${service.bgColor} rounded-xl flex items-center justify-center`}>
              <Icon className={`h-8 w-8 ${service.color}`} />
            </div>
            <div>
              <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                {service.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-gray-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Waktu Proses</p>
                      <p className="font-semibold text-gray-900">{service.processingTime}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Biaya</p>
                      <p className="font-bold text-green-700 text-lg">{service.fee}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Same Day Service Notice */}
              {service.sameDayService && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Layanan Selesai di Tempat</p>
                      <p className="text-sm text-green-700">
                        Seluruh proses layanan ini dapat diselesaikan pada hari yang sama selama persyaratan sudah lengkap dan benar.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Free Service Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800">Pelayanan Gratis</p>
                    <p className="text-sm text-blue-700">
                      Seluruh layanan administrasi kependudukan <strong>TIDAK DIPUNGUT BIAYA</strong> apapun (GRATIS).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Basis */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5 text-green-600" />
                    Dasar Hukum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {service.legalBasis.map((basis, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Gavel className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{basis.name}</p>
                          <p className="text-sm text-gray-600">{basis.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    Persyaratan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {service.requirements.map((reqGroup, groupIndex) => (
                      <div key={groupIndex}>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {groupIndex + 1}
                          </Badge>
                          {reqGroup.title}
                        </h4>
                        <ul className="space-y-2 ml-1">
                          {reqGroup.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {groupIndex < service.requirements.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Procedures */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Prosedur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4">
                      {service.procedures.map((proc) => (
                        <div key={proc.step} className="flex gap-4 relative">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">
                            {proc.step}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{proc.title}</p>
                            <p className="text-sm text-gray-600">{proc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {service.notes.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      Catatan Penting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-yellow-800">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* FAQ */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    Pertanyaan Umum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {service.faq.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Free Service Banner */}
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">GRATIS</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Seluruh layanan administrasi kependudukan tidak dipungut biaya apapun.
                  </p>
                  <div className="bg-white/20 rounded-lg p-3 text-sm">
                    <p>Tanpa biaya pendaftaran</p>
                    <p>Tanpa biaya pencetakan</p>
                    <p>Tanpa biaya legalisasi</p>
                  </div>
                </CardContent>
              </Card>

              {/* Notice */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Penting!</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Seluruh layanan diproses dengan datang langsung ke kantor
                        Disdukcapil dengan membawa berkas lengkap. Pastikan semua
                        dokumen asli dan fotokopi dibawa untuk verifikasi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Forms */}
              {service.forms.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5 text-green-600" />
                      Unduh Formulir
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {service.forms.map((form, index) => (
                      <a
                        key={index}
                        href={form.url}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {form.title}
                            </p>
                            <p className="text-xs text-gray-500">{form.size}</p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Contact CTA */}
              <Card className="bg-green-700 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Hubungi kami untuk informasi lebih lanjut
                  </p>
                  <Link href="/pengaduan">
                    <Button className="w-full bg-white text-green-700 hover:bg-green-50">
                      Hubungi Kami
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Jam Pelayanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Senin - Kamis</span>
                      <span className="font-medium">08.00 - 15.30 WITA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumat</span>
                      <span className="font-medium">08.00 - 16.00 WITA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sabtu - Minggu</span>
                      <span className="text-red-500 font-medium">Tutup</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Lokasi Kantor
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Kantor Disdukcapil Kabupaten Ngada</p>
                  <p className="mt-1">Jl. Ahmad Yani No. 1</p>
                  <p>Bajawa, Kabupaten Ngada</p>
                  <p>Nusa Tenggara Timur</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
