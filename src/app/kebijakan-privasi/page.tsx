"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Bell,
  FileText,
  Scale,
  HeadphonesIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

const sections = [
  {
    icon: Database,
    title: "Pengumpulan Data",
    color: "green",
    items: [
      "Data dikumpulkan hanya untuk keperluan administrasi kependudukan sesuai UU No. 24 Tahun 2013",
      "Data yang dikumpulkan meliputi: data identitas (NIK, nama, tempat/tanggal lahir), data keluarga (KK), dan data dokumen kependudukan",
      "Data dikumpulkan melalui formulir resmi, perekaman biometrik, dan dokumen pendukung yang diserahkan oleh pemohon",
      "Kami tidak mengumpulkan data yang tidak relevan dengan layanan administrasi kependudukan",
    ],
  },
  {
    icon: Lock,
    title: "Penyimpanan & Keamanan",
    color: "teal",
    items: [
      "Data disimpan dalam sistem database terenkripsi yang dihosting di server yang aman",
      "Akses data dibatasi hanya untuk petugas yang berwenang dengan sistem autentikasi berlapis",
      "Data biometrik (sidik jari, iris mata) disimpan sesuai standar keamanan yang ditetapkan Kemendagri",
      "Backup data dilakukan secara berkala untuk mencegah kehilangan data",
      "Kami menerapkan firewall, SSL/TLS, dan audit log untuk melindungi data dari akses tidak sah",
    ],
  },
  {
    icon: Eye,
    title: "Penggunaan Data",
    color: "amber",
    items: [
      "Data hanya digunakan untuk: penerbitan dokumen kependudukan, verifikasi data, statistik kependudukan, dan peningkatan layanan",
      "Data tidak akan dijual, disewakan, atau dibagikan kepada pihak ketiga tanpa persetujuan pemilik data",
      "Data agregat (tanpa identitas personal) dapat digunakan untuk keperluan statistik dan perencanaan pembangunan",
      "Penggunaan data untuk tujuan lain selain layanan kependudukan memerlukan persetujuan tertulis dari pemilik data",
    ],
  },
  {
    icon: UserCheck,
    title: "Hak Pemilik Data",
    color: "purple",
    items: [
      "Hak untuk mengakses dan memperoleh salinan data pribadi yang tersimpan",
      "Hak untuk meminta perbaikan atau koreksi data yang tidak akurat",
      "Hak untuk mengajukan keberatan atas pengolahan data tertentu",
      "Hak untuk meminta penghapusan data sesuai ketentuan peraturan perundang-undangan",
      "Hak untuk menarik persetujuan yang telah diberikan sebelumnya",
    ],
  },
  {
    icon: Bell,
    title: "Notifikasi Perubahan",
    color: "rose",
    items: [
      "Perubahan kebijakan privasi akan diumumkan melalui website resmi dan papan pengumuman kantor",
      "Pengguna data akan diberitahu melalui kontak yang terdaftar jika ada perubahan signifikan",
      "Versi terbaru kebijakan privasi selalu tersedia di halaman ini",
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Hubungi Kami",
    color: "green",
    items: [
      "Untuk pertanyaan terkait privasi data, hubungi: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
      "Alamat: Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86411",
      "Telepon: (0382) 21073",
      "Email: disdukcapil@ngadakab.go.id",
      "Jam operasional: Senin – Jumat, 08.00 – 15.00 WITA",
    ],
  },
];

const colorMap: Record<string, { bg: string; iconBg: string; iconColor: string; borderColor: string }> = {
  green: {
    bg: "from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800/50",
  },
  teal: {
    bg: "from-teal-50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/10",
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200 dark:border-teal-800/50",
  },
  amber: {
    bg: "from-amber-50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800/50",
  },
  purple: {
    bg: "from-purple-50 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/10",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800/50",
  },
  rose: {
    bg: "from-rose-50 to-pink-50/50 dark:from-rose-900/20 dark:to-pink-900/10",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-800/50",
  },
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 right-[15%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />

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
                      { label: "Kebijakan Privasi" },
                    ]}
                  />
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Keamanan Data
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Kebijakan Privasi & Keamanan Data
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-green-100 text-lg md:text-xl leading-relaxed"
                >
                  Komitmen kami dalam melindungi data pribadi Anda sesuai dengan
                  peraturan perundang-undangan yang berlaku.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="mt-6 flex items-center gap-3 flex-wrap"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                    <FileText className="h-3.5 w-3.5 text-green-200" />
                    UU No. 24 Tahun 2013
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                    <Scale className="h-3.5 w-3.5 text-green-200" />
                    PP No. 71 Tahun 2019
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                    <Lock className="h-3.5 w-3.5 text-green-200" />
                    Enkripsi & Keamanan
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
                className="fill-gray-50 dark:fill-gray-950"
              />
            </svg>
          </div>
        </section>

        {/* Last Updated */}
        <div className="container mx-auto px-4 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Terakhir diperbarui: 1 Januari 2025
            </p>
          </motion.div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 pb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-6"
          >
            {sections.map((section) => {
              const SectionIcon = section.icon;
              const colors = colorMap[section.color];
              return (
                <motion.div key={section.title} variants={fadeInUp}>
                  <Card
                    className={`border ${colors.borderColor} bg-gradient-to-br ${colors.bg} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <div
                          className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <SectionIcon
                            className={`h-5 w-5 ${colors.iconColor}`}
                          />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${colors.iconColor.replace("text-", "bg-")} mt-2 flex-shrink-0`}
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Legal Basis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mt-10"
          >
            <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Dasar Hukum
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
                  <li>
                    Undang-Undang Nomor 24 Tahun 2013 tentang Perubahan atas Undang-Undang Nomor 23 Tahun 2006 tentang Administrasi Kependudukan
                  </li>
                  <li>
                    Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem Administrasi Kependudukan
                  </li>
                  <li>
                    Peraturan Menteri Dalam Negeri Nomor 102 Tahun 2019 tentang Syarat, Tata Cara Prosedur, dan Mekanisme Penerbitan Kartu Tanda Penduduk Elektronik
                  </li>
                  <li>
                    Peraturan Menteri Dalam Negeri Nomor 9 Tahun 2016 tentang Percepatan Peningkatan Cakupan Pemilik Dokumen Kependudukan
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
