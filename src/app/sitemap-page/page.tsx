"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map,
  Home,
  UserCircle,
  FileText,
  CreditCard,
  Users,
  PenLine,
  Stamp,
  Baby,
  Heart,
  Church,
  FileX2,
  Truck,
  Newspaper,
  BarChart3,
  Lightbulb,
  Eye,
  MessageSquareWarning,
  Search,
  Hash,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const sectionFadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

interface SitemapLink {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SitemapCategory {
  title: string;
  description: string;
  links: SitemapLink[];
}

const sitemapCategories: SitemapCategory[] = [
  {
    title: "Halaman Utama",
    description: "Navigasi utama portal Disdukcapil Ngada",
    links: [
      {
        title: "Beranda",
        href: "/",
        description: "Halaman utama dengan informasi umum dan akses cepat layanan",
        icon: Home,
      },
      {
        title: "Profil",
        href: "/profil",
        description: "Profil organisasi, visi misi, sejarah, dan struktur organisasi",
        icon: UserCircle,
      },
      {
        title: "Layanan Publik",
        href: "/layanan",
        description: "Daftar lengkap layanan administrasi kependudukan",
        icon: FileText,
      },
      {
        title: "Layanan Online",
        href: "/layanan-online",
        description: "Pengajuan layanan secara daring tanpa perlu datang ke kantor",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Layanan Kependudukan",
    description: "Layanan terkait dokumen identitas dan data kependudukan",
    links: [
      {
        title: "KTP-el",
        href: "/layanan/ktp-el",
        description: "Pembuatan dan pembaruan Kartu Tanda Penduduk Elektronik",
        icon: CreditCard,
      },
      {
        title: "Kartu Keluarga",
        href: "/layanan/kartu-keluarga",
        description: "Pembuatan dan pembaruan Kartu Keluarga (KK)",
        icon: Users,
      },
      {
        title: "Perubahan Data",
        href: "/layanan/perubahan-data",
        description: "Perubahan data pada dokumen kependudukan",
        icon: PenLine,
      },
      {
        title: "Legalisasi Dokumen",
        href: "/layanan/legalisasi",
        description: "Legalisasi dokumen kependudukan yang telah diterbitkan",
        icon: Stamp,
      },
    ],
  },
  {
    title: "Pencatatan Sipil",
    description: "Layanan pencatatan peristiwa kependudukan dan perpindahan",
    links: [
      {
        title: "Akta Kelahiran",
        href: "/layanan/akta-kelahiran",
        description: "Penerbitan akta kelahiran untuk bayi yang baru lahir",
        icon: Baby,
      },
      {
        title: "Akta Kematian",
        href: "/layanan/akta-kematian",
        description: "Pencatatan dan penerbitan akta kematian",
        icon: Heart,
      },
      {
        title: "Akta Perkawinan",
        href: "/layanan/akta-perkawinan",
        description: "Pencatatan dan penerbitan akta perkawinan",
        icon: Church,
      },
      {
        title: "Akta Perceraian",
        href: "/layanan/akta-perceraian",
        description: "Pencatatan dan penerbitan akta perceraian",
        icon: FileX2,
      },
      {
        title: "Pindah Penduduk",
        href: "/layanan/pindah-penduduk",
        description: "Proses perpindahan penduduk antar kabupaten/kota",
        icon: Truck,
      },
    ],
  },
  {
    title: "Informasi",
    description: "Berita, statistik, dan informasi publik terkini",
    links: [
      {
        title: "Berita",
        href: "/berita",
        description: "Berita dan pengumuman terbaru dari Disdukcapil Ngada",
        icon: Newspaper,
      },
      {
        title: "Statistik",
        href: "/statistik",
        description: "Data statistik kependudukan Kabupaten Ngada",
        icon: BarChart3,
      },
      {
        title: "Inovasi",
        href: "/inovasi",
        description: "Program inovasi dan layanan terbaru",
        icon: Lightbulb,
      },
      {
        title: "Transparansi",
        href: "/transparansi",
        description: "Dokumen peraturan, laporan kinerja, dan publikasi resmi",
        icon: Eye,
      },
      {
        title: "Pengaduan",
        href: "/pengaduan",
        description: "Sampaikan keluhan, saran, atau masukan layanan",
        icon: MessageSquareWarning,
      },
    ],
  },
  {
    title: "Layanan Online",
    description: "Akses layanan digital untuk kemudahan masyarakat",
    links: [
      {
        title: "Cek Status Pengajuan",
        href: "/layanan-online/cek-status",
        description: "Pantau status pengajuan layanan yang telah diajukan",
        icon: Search,
      },
      {
        title: "Cek NIK",
        href: "/layanan-online#cek-nik",
        description: "Verifikasi dan cek validitas Nomor Induk Kependudukan",
        icon: Hash,
      },
      {
        title: "Ajukan Layanan",
        href: "/layanan-online",
        description: "Ajukan layanan administrasi kependudukan secara online",
        icon: ClipboardList,
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb
                    items={[
                      { label: "Beranda", href: "/" },
                      { label: "Peta Situs" },
                    ]}
                  />
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3"
                >
                  <Map className="h-9 w-9 md:h-10 md:w-10 text-green-200" />
                  Peta Situs
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg">
                  Daftar lengkap halaman dan layanan yang tersedia di portal
                  Disdukcapil Ngada
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sitemap Content */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              {sitemapCategories.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={sectionFadeIn}
                >
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {category.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {category.description}
                    </p>
                    <div className="mt-3 h-1 w-16 bg-gradient-to-r from-green-500 to-teal-400 rounded-full" />
                  </div>

                  {/* Links Grid */}
                  <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {category.links.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <motion.div key={link.href} variants={fadeInUp}>
                          <Link
                            href={link.href}
                            className="group block bg-white rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:bg-green-50 hover:border-green-200 hover:shadow-md"
                          >
                            <div className="flex items-start gap-4">
                              {/* Left border accent on hover */}
                              <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center group-hover:bg-green-200 group-hover:text-green-800 transition-colors duration-200">
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-semibold text-gray-900 group-hover:text-green-800 transition-colors duration-200 truncate">
                                    {link.title}
                                  </h3>
                                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                                </div>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                  {link.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ))}

              {/* Bottom Info */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionFadeIn}
                className="mt-8 bg-white rounded-xl border border-gray-200 p-6 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Tidak menemukan halaman yang dicari?
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Jika Anda tidak menemukan informasi yang dicari pada peta
                      situs ini, silakan gunakan fitur pencarian atau hubungi
                      kami melalui WhatsApp untuk bantuan lebih lanjut.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <Home className="w-4 h-4" />
                        Kembali ke Beranda
                      </Link>
                      <Link
                        href="/pengaduan"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <MessageSquareWarning className="w-4 h-4" />
                        Sampaikan Pengaduan
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
