"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Database,
  Eye,
  Unlock,
  ShieldCheck,
  BarChart3,
  CreditCard,
  Baby,
  Users,
  MoveRight,
  Heart,
  FileJson,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { OPERATING_HOURS, CONTACT_INFO } from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const datasets = [
  {
    title: "Jumlah Penduduk per Kecamatan",
    icon: BarChart3,
    theme: "teal",
    bgIcon: "bg-teal-100",
    textIcon: "text-teal-600",
    borderHover: "hover:border-teal-400",
    description: "Data demografis penduduk berdasarkan kecamatan",
  },
  {
    title: "Statistik KTP-el",
    icon: CreditCard,
    theme: "emerald",
    bgIcon: "bg-emerald-100",
    textIcon: "text-emerald-600",
    borderHover: "hover:border-emerald-400",
    description: "Data pembuatan dan penerbitan KTP-el",
  },
  {
    title: "Statistik Akta Kelahiran",
    icon: Baby,
    theme: "amber",
    bgIcon: "bg-amber-100",
    textIcon: "text-amber-600",
    borderHover: "hover:border-amber-400",
    description: "Data pencatatan akta kelahiran",
  },
  {
    title: "Statistik Kartu Keluarga",
    icon: Users,
    theme: "rose",
    bgIcon: "bg-rose-100",
    textIcon: "text-rose-600",
    borderHover: "hover:border-rose-400",
    description: "Data kepemilikan dan pembuatan KK",
  },
  {
    title: "Statistik Perpindahan",
    icon: MoveRight,
    theme: "teal",
    bgIcon: "bg-teal-100",
    textIcon: "text-teal-600",
    borderHover: "hover:border-teal-400",
    description: "Data perpindahan penduduk",
  },
  {
    title: "Statistik Akta Perkawinan",
    icon: Heart,
    theme: "amber",
    bgIcon: "bg-amber-100",
    textIcon: "text-amber-600",
    borderHover: "hover:border-amber-400",
    description: "Data pencatatan pernikahan dan perceraian",
  },
];

export default function OpenDataPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-br from-green-700 to-green-900 text-white py-16 overflow-hidden">
          {/* Decorative Gradient Orbs */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />

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
                      { label: "Info Kependudukan", href: "/statistik" },
                      { label: "Open Data" },
                    ]}
                  />
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3"
                >
                  <Database className="h-9 w-9 md:h-10 md:w-10 text-green-200" />
                  Open Data Kependudukan
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg">
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200 mt-2">
                  Komitmen kami untuk keterbukaan data demi transparansi pelayanan publik.
                  Seluruh data kependudukan yang tersedia dapat diakses dan digunakan oleh masyarakat
                  untuk keperluan penelitian, analisis, dan pengembangan.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Section 1: Prinsip Open Data */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <p className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-2">
                PRINSIP KAMI
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Prinsip Open Data
              </h2>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                Tiga prinsip utama yang menjadi fondasi kebijakan keterbukaan data kami
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div variants={fadeInUp}>
                <Card className="border-2 hover:border-green-300 hover:shadow-lg transition-all duration-300 h-full text-center group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Unlock className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Keterbukaan</h3>
                    <p className="text-gray-500">
                      Seluruh data kependudukan yang tidak bersifat rahasia dibuka untuk publik demi
                      transparansi dan akuntabilitas pelayanan administrasi.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-2 hover:border-teal-300 hover:shadow-lg transition-all duration-300 h-full text-center group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                      <Eye className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aksesibilitas</h3>
                    <p className="text-gray-500">
                      Data disediakan dalam format yang mudah diakses dan digunakan oleh siapa saja,
                      termasuk dalam format JSON dan CSV untuk pengembang.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-2 hover:border-amber-300 hover:shadow-lg transition-all duration-300 h-full text-center group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                      <ShieldCheck className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Akuntabilitas</h3>
                    <p className="text-gray-500">
                      Data yang dipublikasikan telah diverifikasi dan dapat dipertanggungjawabkan
                      kebenarannya sesuai dengan regulasi yang berlaku.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* Section 2: Dataset Tersedia */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <p className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-2">
                DATA TERBUKA
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dataset Tersedia
              </h2>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                Berikut dataset kependudukan yang dapat diakses dan diunduh oleh publik
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => {
                const Icon = dataset.icon;
                return (
                  <motion.div
                    key={dataset.title}
                    variants={fadeInUp}
                  >
                    <Card
                      className={`border-2 border-gray-100 ${dataset.borderHover} hover:shadow-lg transition-all duration-300 h-full group`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`w-12 h-12 ${dataset.bgIcon} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`h-6 w-6 ${dataset.textIcon}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{dataset.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{dataset.description}</p>
                        <Button
                          variant="outline"
                          className={`w-full ${dataset.textIcon} border-current/20 hover:bg-current/5 group/btn`}
                          asChild
                        >
                          <Link href="/statistik">
                            Lihat Data
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Section 3: Format Data */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <p className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-2">
                FORMAT DATA
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Format Data yang Tersedia
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileJson className="h-7 w-7 text-teal-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">JSON</h3>
                      <p className="text-gray-500 text-sm">
                        Format terstruktur untuk integrasi aplikasi dan pengembangan web
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileSpreadsheet className="h-7 w-7 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">CSV</h3>
                      <p className="text-gray-500 text-sm">
                        Format tabel untuk analisis data menggunakan spreadsheet atau tools analitik
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-7 w-7 text-rose-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">PDF</h3>
                      <p className="text-gray-500 text-sm">
                        Format dokumen untuk pelaporan dan keperluan cetak resmi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* Section 4: CTA - Butuh Data Spesifik? */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <Card className="bg-gradient-to-br from-green-700 to-green-900 text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />
              <CardContent className="p-8 md:p-10 text-center relative z-10">
                <MessageCircle className="h-10 w-10 text-green-200 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Butuh Data Spesifik?</h2>
                <p className="text-green-100 max-w-xl mx-auto mb-6">
                  Jika Anda membutuhkan data yang tidak tersedia di halaman ini,
                  silakan hubungi kami melalui WhatsApp. Tim kami siap membantu kebutuhan data Anda.
                </p>
                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent("Halo, saya membutuhkan data kependudukan yang spesifik. Bisa dibantu?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-white text-green-700 hover:bg-green-50 font-semibold text-base"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Hubungi via WhatsApp
                  </Button>
                </a>
                <p className="text-green-200/70 text-xs mt-4">
                  {OPERATING_HOURS.fullText}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
