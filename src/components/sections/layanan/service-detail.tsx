"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
  MoveRight,
  ScrollText,
  Sparkles,
  Loader2,
  File,
  ClipboardCheck,
  Printer,
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const sidebarStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  Users,
  Baby,
  Heart,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  Gavel,
  MoveRight,
};

interface Layanan {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  requirements: string;
  procedures: string;
  forms: string | null;
  faq: string | null;
  processingTime: string | null;
  fee: string | null;
  isActive: boolean;
  category?: string;
}

// Requirement type: supports both grouped and flat formats
type RequirementItem = { label: string; description?: string } | { label: string; items: string[] };

function isRequirementGroup(req: RequirementItem): req is { label: string; items: string[] } {
  return 'items' in req && Array.isArray(req.items);
}

// Default service data for fallback
const defaultServices: Record<string, {
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
    description: "Kartu identitas elektronik untuk warga negara Indonesia yang berusia 17 tahun atau sudah menikah/pernah menikah.",
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
        title: "KTP-el Penggantian (Rusak/Hilang)",
        items: [
          "KTP-el rusak (diserahkan untuk dimusnahkan) atau Surat Keterangan Kehilangan dari Kepolisian",
          "FC Kartu Keluarga (Terbaru)",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan dengan lengkap" },
      { step: 2, title: "Datang ke Kantor", description: "Kunjungi kantor Disdukcapil pada jam kerja" },
      { step: 3, title: "Pendaftaran", description: "Ambil nomor antrian dan daftar di loket pelayanan" },
      { step: 4, title: "Verifikasi Data", description: "Petugas memverifikasi kelengkapan dokumen" },
      { step: 5, title: "Pencetakan", description: "KTP-el dicetak dan dapat diambil di tempat" },
    ],
    forms: [{ title: "Formulir F-1.01", url: "#", size: "250 KB" }],
    faq: [
      { question: "Berapa lama proses pembuatan KTP-el?", answer: "Untuk cetak KTP-el, proses SELESAI DI TEMPAT. Untuk rekam baru, proses 3-5 hari kerja." },
      { question: "Apakah ada biaya?", answer: "TIDAK ADA. Seluruh layanan pembuatan KTP-el adalah GRATIS." },
    ],
    notes: [
      "Untuk REKAM BARU KTP-el, pemohon wajib hadir untuk perekaman biometrik",
      "Semua layanan GRATIS tanpa dipungut biaya apapun",
    ],
  },
  "kartu-keluarga": {
    id: "kartu-keluarga",
    icon: Users,
    title: "Kartu Keluarga (KK)",
    description: "Dokumen kependudukan yang memuat data susunan keluarga, hubungan kekeluargaan, dan jumlah anggota keluarga.",
    category: "Dokumen Keluarga",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 53-59 tentang Kartu Keluarga" },
    ],
    requirements: [
      {
        title: "KK Baru (Membentuk Keluarga)",
        items: [
          "Mengisi Formulir F-1.01",
          "FC Buku Nikah / Kutipan Akta Perkawinan",
          "FC Ijazah / Akta Lahir",
        ],
      },
      {
        title: "Tambah Anggota (Anak)",
        items: [
          "KK Lama (Asli)",
          "Surat Keterangan Lahir dari Bidan/RS",
          "FC Buku Nikah Orang Tua",
        ],
      },
      {
        title: "KK Hilang/Rusak",
        items: [
          "Surat Keterangan Hilang dari Kepolisian (jika hilang)",
          "KTP-el Kepala Keluarga",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan semua dokumen persyaratan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di loket pelayanan" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kelengkapan data" },
      { step: 4, title: "Pencetakan KK", description: "KK dicetak dan dapat diambil di tempat" },
    ],
    forms: [{ title: "Formulir F-1.01", url: "#", size: "200 KB" }],
    faq: [
      { question: "Apakah pembuatan KK dikenakan biaya?", answer: "TIDAK ADA. Pembuatan Kartu Keluarga adalah GRATIS." },
      { question: "Berapa lama prosesnya?", answer: "Proses SELESAI DI TEMPAT jika semua persyaratan sudah lengkap." },
    ],
    notes: ["Semua layanan GRATIS tanpa dipungut biaya apapun"],
  },
  "akta-kelahiran": {
    id: "akta-kelahiran",
    icon: Baby,
    title: "Akta Kelahiran",
    description: "Akta catatan sipil yang diterbitkan untuk setiap peristiwa kelahiran.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 27-32 tentang Pencatatan Kelahiran" },
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
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat kelahiran dan dokumen pendukung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kelengkapan data" },
      { step: 4, title: "Penerbitan", description: "Akta Kelahiran diterbitkan dan dicetak" },
    ],
    forms: [{ title: "Formulir F-2.01", url: "#", size: "180 KB" }],
    faq: [
      { question: "Apakah ada biaya untuk akta kelahiran?", answer: "TIDAK ADA. Seluruh layanan pencatatan kelahiran adalah GRATIS." },
    ],
    notes: ["Semua layanan GRATIS tanpa dipungut biaya apapun"],
  },
  "akta-kematian": {
    id: "akta-kematian",
    icon: Heart,
    title: "Akta Kematian",
    description: "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 33-38 tentang Pencatatan Kematian" },
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
      { step: 1, title: "Persiapan Berkas", description: "Siapkan surat kematian" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data kematian" },
      { step: 4, title: "Penerbitan", description: "Akta Kematian diterbitkan" },
    ],
    forms: [],
    faq: [],
    notes: ["KTP-el almarhum wajib diserahkan untuk dimusnahkan"],
  },
  "akta-perkawinan": {
    id: "akta-perkawinan",
    icon: FileText,
    title: "Akta Perkawinan",
    description: "Pencatatan peristiwa perkawinan warga negara Indonesia.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-red-600",
    bgColor: "bg-red-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 39-48 tentang Pencatatan Perkawinan" },
    ],
    requirements: [
      {
        title: "Pencatatan Perkawinan",
        items: [
          "Kutipan Akta Nikah dari KUA atau Surat Nikah (asli)",
          "FC KTP-el kedua mempelai",
          "FC Kartu Keluarga kedua mempelai",
          "FC Akta Kelahiran kedua mempelai",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan Akta Nikah dari KUA" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data" },
      { step: 4, title: "Penerbitan", description: "Akta Perkawinan diterbitkan" },
    ],
    forms: [],
    faq: [],
    notes: ["Kedua mempelai diharuskan hadir"],
  },
  "akta-perceraian": {
    id: "akta-perceraian",
    icon: Gavel,
    title: "Akta Perceraian",
    description: "Pencatatan perceraian yang telah memiliki kekuatan hukum tetap.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 49-52 tentang Pencatatan Perceraian" },
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
      { step: 1, title: "Persiapan Berkas", description: "Siapkan putusan pengadilan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi putusan" },
      { step: 4, title: "Penerbitan", description: "Akta Perceraian diterbitkan" },
    ],
    forms: [],
    faq: [],
    notes: ["Putusan pengadilan harus sudah berkekuatan hukum tetap (inkracht)"],
  },
  "perubahan-data": {
    id: "perubahan-data",
    icon: RefreshCw,
    title: "Perubahan Data Kependudukan",
    description: "Layanan perubahan atau pemutakhiran data kependudukan.",
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
          "Akta Perkawinan atau Akta Perceraian",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan dokumen bukti perubahan" },
      { step: 2, title: "Pendaftaran", description: "Daftar di kantor Disdukcapil" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi kebenaran data" },
      { step: 4, title: "Update Data", description: "Data diperbarui di sistem" },
    ],
    forms: [],
    faq: [],
    notes: ["Perubahan nama memerlukan putusan pengadilan"],
  },
  "legalisasi": {
    id: "legalisasi",
    icon: Stamp,
    title: "Legalisasi Dokumen",
    description: "Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang.",
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
    faq: [],
    notes: ["Bawa dokumen asli untuk verifikasi"],
  },
  "pindah-datang-kk-sendiri": {
    id: "pindah-datang-kk-sendiri",
    icon: MoveRight,
    title: "Pindah Datang (Buat KK Sendiri)",
    description: "Layanan perpindahan penduduk untuk membuat KK baru.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 19-26 tentang Perpindahan Penduduk" },
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
      { step: 2, title: "Pendaftaran", description: "Daftar di Disdukcapil tujuan" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data" },
      { step: 4, title: "Penerbitan KK", description: "KK baru diterbitkan" },
    ],
    forms: [],
    faq: [],
    notes: ["SKPWNI berlaku 30 hari sejak diterbitkan"],
  },
  "pindah-datang-numpang-kk": {
    id: "pindah-datang-numpang-kk",
    icon: Users,
    title: "Pindah Datang (Numpang KK)",
    description: "Layanan perpindahan penduduk untuk menumpang pada KK yang sudah ada.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    sameDayService: true,
    legalBasis: [
      { name: "UU No. 24 Tahun 2013", description: "Pasal 19-26 tentang Perpindahan Penduduk" },
    ],
    requirements: [
      {
        title: "Pindah Datang (Numpang KK)",
        items: [
          "Surat Keterangan Pindah (SKPWNI) dari daerah asal (asli)",
          "KK Asli Penampung",
          "Surat Keterangan Domisili",
          "Mengisi Formulir F-1.01",
        ],
      },
    ],
    procedures: [
      { step: 1, title: "Persiapan Berkas", description: "Siapkan SKPWNI dan KK penampung" },
      { step: 2, title: "Pendaftaran", description: "Daftar di Disdukcapil tujuan" },
      { step: 3, title: "Verifikasi", description: "Petugas memverifikasi data" },
      { step: 4, title: "Update KK", description: "Data ditambahkan ke KK penampung" },
    ],
    forms: [],
    faq: [],
    notes: ["SKPWNI berlaku 30 hari sejak diterbitkan"],
  },
};

// Helper: get related services by category (excluding current)
function getRelatedServices(currentSlug: string, category?: string) {
  return Object.values(defaultServices)
    .filter((s) => s.id !== currentSlug && (category ? s.category === category : true))
    .slice(0, 4);
}

// Related Services Card component
function RelatedServicesCard({ service }: { service: { id: string; icon: typeof CreditCard; title: string; description: string; category: string; color: string; bgColor: string } }) {
  const ServiceIcon = service.icon;
  return (
    <Link href={`/layanan/${service.id}`}>
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-gray-200 h-full group">
        <CardContent className="p-4">
          <div className={`w-10 h-10 ${service.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
            <ServiceIcon className={`h-5 w-5 ${service.color}`} />
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs mb-2">
            {service.category}
          </Badge>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{service.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">
            {service.description.length > 80
              ? service.description.substring(0, 80) + "..."
              : service.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// Office Hours component (reusable)
function OfficeHours() {
  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-teal-600" />
          Jam Pelayanan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Senin - Jumat</span>
            <span className="font-medium">08.00 - 15.00 WITA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sabtu - Minggu</span>
            <span className="text-red-500 font-medium">Tutup</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServiceDetail({ slug }: { slug: Promise<{ slug: string }> }) {
  const params = useParams();
  const slugValue = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Layanan | null>(null);

  // Inject print styles
  useEffect(() => {
    const styleId = "service-detail-print-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @media print {
        /* Hide non-essential elements */
        header,
        footer,
        [data-whatsapp],
        [data-back-to-top],
        [data-quick-access],
        [data-cookie-banner],
        .print-hide {
          display: none !important;
        }

        /* Remove shadows and borders from cards */
        .border-gray-200,
        .border-green-200,
        .border-yellow-200 {
          border: 1px solid #e5e7eb !important;
          box-shadow: none !important;
        }

        /* Page setup for A4 */
        @page {
          size: A4;
          margin: 15mm 15mm 20mm 15mm;
        }

        /* White background */
        body {
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Ensure content is properly formatted */
        section {
          break-inside: avoid;
        }

        /* Hide print button itself */
        [data-print-button] {
          display: none !important;
        }

        /* Show hero gradient in print */
        .bg-gradient-to-br {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Ensure grid prints properly */
        .grid {
          display: block !important;
        }
        .grid > * {
          margin-bottom: 1rem;
        }
        .lg\\:col-span-2 {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/layanan?slug=${slugValue}`);
        const result = await response.json();
        if (result.success && result.data) {
          setService(result.data);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slugValue]);

  // Use default data if no service from database
  const defaultService = defaultServices[slugValue];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Memuat data layanan...</p>
      </div>
    );
  }

  // If we have service from database, use it; otherwise use default
  if (service) {
    const Icon = iconMap[service.icon || "FileText"] || FileText;
    const requirements = JSON.parse(service.requirements || "[]");
    const procedures = JSON.parse(service.procedures || "[]");
    const formsData = service.forms ? JSON.parse(service.forms) : null;
    const formCodes = formsData?.codes || [];
    const formFiles = formsData?.links || [];
    const faqData = service.faq ? JSON.parse(service.faq) : [];

    const relatedServices = getRelatedServices(slugValue);

    return (
      <>
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
            >
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
                    <BreadcrumbPage className="text-white">{service.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{service.name}</h1>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Print Button */}
        <div className="container mx-auto px-4 -mt-6 mb-6" data-print-button>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-full transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span className="sm:hidden">Cetak</span>
              <span className="hidden sm:inline">Cetak Halaman</span>
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="lg:col-span-2 space-y-6"
              >
                {/* Quick Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Waktu Proses</p>
                          <p className="font-semibold text-gray-900">{service.processingTime || "Selesai di Tempat"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <Card className="border-green-200 bg-green-50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600">Biaya</p>
                          <p className="font-bold text-green-700 text-lg">{service.fee || "GRATIS"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Free Service Notice */}
                <motion.div variants={staggerItem}>
                  <Card className="bg-green-50 border-green-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800">Pelayanan Gratis</p>
                        <p className="text-sm text-green-700">
                          Seluruh layanan administrasi kependudukan <strong>TIDAK DIPUNGUT BIAYA</strong> apapun (GRATIS).
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Description */}
                <motion.div variants={staggerItem}>
                  <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        Deskripsi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Requirements */}
                {requirements.length > 0 && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          Persyaratan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {requirements.map((req: RequirementItem, index: number) => (
                            isRequirementGroup(req) ? (
                              <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  {req.label}
                                </p>
                                <ul className="space-y-1.5 ml-4">
                                  {req.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-gray-700">{req.label}</p>
                                  {req.description && (
                                    <p className="text-sm text-gray-500">{req.description}</p>
                                  )}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Procedures */}
                {procedures.length > 0 && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ClipboardCheck className="h-5 w-5 text-teal-600" />
                          Prosedur
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-4">
                            {procedures.map((proc: { step: number; title: string; description?: string }) => (
                              <div key={proc.step} className="flex gap-4 relative">
                                <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">
                                  {proc.step}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{proc.title}</p>
                                  {proc.description && (
                                    <p className="text-sm text-gray-600">{proc.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Form Codes */}
                {formCodes.length > 0 && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-teal-600" />
                          Kode Formulir
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          Formulir yang digunakan sesuai Permendagri No. 6 Tahun 2026:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formCodes.map((code: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1.5 text-sm font-mono"
                            >
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Formulir Downloads */}
                {(formFiles.length > 0 || formCodes.length > 0) && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="h-5 w-5 text-red-600" />
                          Formulir Layanan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          Unduh dan isi formulir berikut sebelum mengurus layanan:
                        </p>
                        <div className="space-y-2">
                          {formFiles.length > 0
                            ? // Use formFiles (enriched links from DB)
                              formFiles.map((file: { name: string; url: string; size?: string; code?: string }, index: number) => (
                                <a
                                  key={index}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => {
                                    if (file.code) {
                                      fetch("/api/formulir/download", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ code: file.code }),
                                      }).catch(() => {});
                                    }
                                  }}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                  <File className="h-5 w-5 text-red-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    {file.size && (
                                      <p className="text-xs text-gray-500">{file.size}</p>
                                    )}
                                  </div>
                                  <Download className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                </a>
                              ))
                            : // Fallback: generate links from formCodes
                              formCodes.map((code: string, index: number) => {
                                const fileName = code.replace(/\./g, "-") + ".pdf";
                                return (
                                  <a
                                    key={index}
                                    href={`/formulir/${fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                      fetch("/api/formulir/download", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ code }),
                                      }).catch(() => {});
                                    }}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                  >
                                    <File className="h-5 w-5 text-red-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {code} - Formulir
                                      </p>
                                      <p className="text-xs text-gray-500 font-mono">{code}</p>
                                    </div>
                                    <Download className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  </a>
                                );
                              })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* FAQ */}
                {faqData.length > 0 && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-green-600" />
                          Pertanyaan Umum (FAQ)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {faqData.map((faq: { question: string; answer: string }, index: number) => (
                            <AccordionItem key={index} value={`faq-${index}`}>
                              <AccordionTrigger className="text-sm text-left hover:text-green-700">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-gray-600">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Column - Sidebar */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={sidebarStaggerContainer}
                className="space-y-6"
              >
                {/* Dasar Hukum Card */}
                <motion.div variants={staggerItem}>
                  <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <ScrollText className="h-6 w-6 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-lg mb-2">Dasar Hukum</h3>
                          <div className="space-y-2">
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                              <p className="font-semibold text-sm">Permendagri No. 6 Tahun 2026</p>
                              <p className="text-green-100 text-xs mt-1">Perubahan atas Permendagri No. 109 Tahun 2019 tentang Formulir dan Buku yang Digunakan dalam Administrasi Kependudukan</p>
                            </div>
                            <div className="space-y-1 text-xs text-green-100">
                              <p>&#8226; UU No. 24 Tahun 2013</p>
                              <p>&#8226; PP No. 37 Tahun 2021</p>
                              <p>&#8226; Permendagri No. 109/2019</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Free Service Banner */}
                <motion.div variants={staggerItem}>
                  <Card className="border-green-200 bg-green-50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-10 w-10 mx-auto mb-3 text-green-600" />
                      <h3 className="font-bold text-xl mb-2 text-green-800">GRATIS</h3>
                      <p className="text-green-700 text-sm mb-4">
                        Seluruh layanan administrasi kependudukan tidak dipungut biaya apapun.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Notice */}
                <motion.div variants={staggerItem}>
                  <Card className="bg-yellow-50 border-yellow-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-6">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Penting!</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Seluruh layanan diproses dengan datang langsung ke kantor
                            Disdukcapil dengan membawa berkas lengkap.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Office Hours */}
                <motion.div variants={staggerItem}>
                  <OfficeHours />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MoveRight className="h-5 w-5 text-green-600" />
                Layanan Terkait
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedServices.map((rs) => (
                  <RelatedServicesCard key={rs.id} service={rs} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back Button */}
        <div className="container mx-auto px-4 pb-12">
          <Link href="/layanan">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Layanan
            </Button>
          </Link>
        </div>
      </>
    );
  }

  // Fallback to default hardcoded data
  if (!defaultService) {
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

  // Render with default data
  const Icon = defaultService.icon;
  const relatedServices = getRelatedServices(slugValue, defaultService.category);

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
          >
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
                  <BreadcrumbPage className="text-white">{defaultService.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${defaultService.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-8 w-8 ${defaultService.color}`} />
              </div>
              <div>
                <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                  {defaultService.category}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold">{defaultService.title}</h1>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Print Button */}
      <div className="container mx-auto px-4 -mt-6 mb-6" data-print-button>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span className="sm:hidden">Cetak</span>
            <span className="hidden sm:inline">Cetak Halaman</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="lg:col-span-2 space-y-6"
            >
              {/* Quick Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div variants={staggerItem}>
                  <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Waktu Proses</p>
                        <p className="font-semibold text-gray-900">{defaultService.processingTime}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Card className="border-green-200 bg-green-50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Biaya</p>
                        <p className="font-bold text-green-700 text-lg">{defaultService.fee}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Requirements */}
              <motion.div variants={staggerItem}>
                <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-600" />
                      Persyaratan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {defaultService.requirements.map((reqGroup, groupIndex) => (
                        <div key={groupIndex}>
                          <h4 className="font-semibold text-gray-800 mb-3">{reqGroup.title}</h4>
                          <ul className="space-y-2">
                            {reqGroup.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                          {groupIndex < defaultService.requirements.length - 1 && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Procedures */}
              <motion.div variants={staggerItem}>
                <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-teal-600" />
                      Prosedur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-4">
                        {defaultService.procedures.map((proc) => (
                          <div key={proc.step} className="flex gap-4 relative">
                            <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">
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
              </motion.div>

              {/* Notes */}
              {defaultService.notes.length > 0 && (
                <motion.div variants={staggerItem}>
                  <Card className="border-yellow-200 bg-yellow-50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        Catatan Penting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {defaultService.notes.map((note, index) => (
                          <li key={index} className="flex items-start gap-2 text-yellow-800">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* FAQ */}
              {defaultService.faq.length > 0 && (
                <motion.div variants={staggerItem}>
                  <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-600" />
                        Pertanyaan Umum
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {defaultService.faq.map((item, index) => (
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
                </motion.div>
              )}
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={sidebarStaggerContainer}
              className="space-y-6"
            >
              {/* Free Service Banner */}
              <motion.div variants={staggerItem}>
                <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-10 w-10 mx-auto mb-3" />
                    <h3 className="font-bold text-xl mb-2">GRATIS</h3>
                    <p className="text-green-100 text-sm mb-4">
                      Seluruh layanan administrasi kependudukan tidak dipungut biaya apapun.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Office Hours */}
              <motion.div variants={staggerItem}>
                <OfficeHours />
              </motion.div>

              {/* Contact CTA */}
              <motion.div variants={staggerItem}>
                <Card className="bg-green-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MoveRight className="h-5 w-5 text-green-600" />
              Layanan Terkait
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.map((rs) => (
                <RelatedServicesCard key={rs.id} service={rs} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <div className="container mx-auto px-4 pb-12">
        <Link href="/layanan">
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Layanan
          </Button>
        </Link>
      </div>
    </>
  );
}
