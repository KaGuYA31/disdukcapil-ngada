"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Globe,
  Users,
  Scale,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Phone,
  ExternalLink,
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
    icon: FileText,
    title: "Ketentuan Umum",
    color: "green",
    items: [
      "Website ini disediakan oleh Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) Kabupaten Ngada sebagai sarana informasi dan layanan administrasi kependudukan",
      "Seluruh konten yang tersedia di website ini bersifat informatif dan tidak mengikat secara hukum kecuali yang secara eksplisit ditetapkan",
      "Pengguna website wajib mematuhi seluruh peraturan perundang-undangan yang berlaku di Republik Indonesia terkait administrasi kependudukan",
      "Disdukcapil Kabupaten Ngada berhak mengubah, memperbarui, atau menghapus konten website sewaktu-waktu tanpa pemberitahuan terlebih dahulu",
      "Penggunaan website ini tunduk pada yurisdiksi hukum Negara Republik Indonesia",
    ],
  },
  {
    icon: Globe,
    title: "Penggunaan Layanan Online",
    color: "teal",
    items: [
      "Layanan online yang tersedia meliputi: pendaftaran layanan, pengecekan status pengajuan, informasi persyaratan dokumen, dan formulir digital",
      "Setiap pengguna wajib memberikan data yang benar, akurat, dan terkini saat menggunakan layanan online",
      "Satu akun pengguna hanya boleh digunakan oleh satu individu dan tidak boleh dialihkan kepada pihak lain tanpa izin tertulis",
      "Disdukcapil tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan data yang dimasukkan oleh pengguna",
      "Pengguna dilarang menggunakan website untuk tujuan ilegal, termasuk namun tidak terbatas pada penipuan, pemalsuan dokumen, dan tindakan melawan hukum lainnya",
      "Sistem layanan online dapat mengalami gangguan teknis yang sifatnya temporer. Disdukcapil akan berupaya secepat mungkin memulihkan layanan",
    ],
  },
  {
    icon: Shield,
    title: "Data & Privasi",
    color: "amber",
    items: [
      "Data pribadi yang dikumpulkan melalui website ini diolah sesuai dengan Kebijakan Privasi & Keamanan Data yang berlaku",
      "Penggunaan data biometrik (sidik jari, iris mata, pengenalan wajah) hanya untuk keperluan administrasi kependudukan sesuai ketentuan Kemendagri",
      "Disdukcapil berkomitmen melindungi data pribadi pengguna dengan menerapkan standar keamanan yang ditetapkan pemerintah",
      "Data yang bersifat rahasia tidak akan dibagikan kepada pihak ketiga tanpa persetujuan pemilik data, kecuali diwajibkan oleh peraturan perundang-undangan",
      "Pengguna bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi yang digunakan dalam layanan online",
    ],
  },
  {
    icon: Users,
    title: "Hak & Kewajiban Pengguna",
    color: "purple",
    items: [
      "Pengguna berhak mendapatkan layanan administrasi kependudukan yang cepat, tepat, dan transparan",
      "Pengguna berhak mengakses dan memperoleh informasi terkait proses layanan yang sedang berjalan",
      "Pengguna berhak menyampaikan saran, kritik, dan pengaduan terkait layanan yang diberikan",
      "Pengguna wajib melengkapi seluruh persyaratan dokumen yang dipersyaratkan untuk setiap jenis layanan",
      "Pengguna wajib hadir sesuai jadwal yang telah ditentukan untuk perekaman biometrik dan pengambilan dokumen",
      "Pengguna wajib menjaga ketertiban dan kenyamanan saat berkunjung ke kantor Disdukcapil",
      "Pengguna wajib melaporkan perubahan data kependudukan dalam jangka waktu yang ditetapkan oleh peraturan perundang-undangan",
    ],
  },
  {
    icon: Scale,
    title: "Pembatasan Tanggung Jawab",
    color: "rose",
    items: [
      "Disdukcapil tidak menjamin ketersediaan website selama 24 jam tanpa gangguan. Pemeliharaan sistem dapat dilakukan secara berkala",
      "Informasi yang disajikan di website ini bersifat informatif dan mungkin tidak selalu mencerminkan kondisi terkini",
      "Disdukcapil tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi yang diperoleh melalui website ini",
      "Tautan (link) ke website pihak ketiga yang muncul di website ini hanya untuk kenyamanan pengguna. Disdukcapil tidak bertanggung jawab atas konten atau kebijakan privasi website tersebut",
      "Disdukcapil tidak bertanggung jawab atas keterlambatan proses layanan yang disebabkan oleh kelengkapan dokumen yang tidak memenuhi syarat",
    ],
  },
  {
    icon: RefreshCw,
    title: "Perubahan Ketentuan",
    color: "green",
    items: [
      "Disdukcapil Kabupaten Ngada berhak mengubah syarat dan ketentuan ini sewaktu-waktu sesuai kebutuhan",
      "Perubahan ketentuan akan diumumkan melalui website resmi dan/atau papan pengumuman kantor Disdukcapil",
      "Pengguna dianjurkan untuk secara berkala meninjau halaman ini guna mengetahui perubahan terbaru",
      "Penggunaan website secara berkelanjutan setelah adanya perubahan ketentuan dianggap sebagai persetujuan terhadap ketentuan yang telah diperbarui",
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

export default function SyaratKetentuanPage() {
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
                      { label: "Syarat & Ketentuan" },
                    ]}
                  />
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Legal
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <Shield className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Syarat & Ketentuan
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-green-100 text-lg md:text-xl leading-relaxed"
                >
                  Ketentuan penggunaan layanan website Dinas Kependudukan dan
                  Pencatatan Sipil Kabupaten Ngada.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="mt-6 flex items-center gap-3 flex-wrap"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                    <Calendar className="h-3.5 w-3.5 text-green-200" />
                    Berlaku sejak 1 Januari 2024
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                    <FileText className="h-3.5 w-3.5 text-green-200" />
                    UU No. 24 Tahun 2013
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

        {/* Effective Date */}
        <div className="container mx-auto px-4 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Berlaku efektif sejak: <span className="font-semibold text-gray-700 dark:text-gray-300">1 Januari 2024</span>
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
                      <ol className="space-y-3">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                            <span
                              className={`w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${colors.iconColor}`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mt-10"
          >
            <Card className="border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Disclaimer
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Syarat dan ketentuan ini disusun berdasarkan peraturan perundang-undangan yang berlaku di Indonesia
                  dan ditujukan untuk seluruh pengguna layanan Disdukcapil Kabupaten Ngada. Dengan menggunakan website
                  ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang tercantum di halaman ini.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-6"
          >
            <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Butuh Bantuan?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Alamat</p>
                    <p className="text-gray-700 dark:text-gray-300">Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86411</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Telepon</p>
                    <p className="text-gray-700 dark:text-gray-300">(0382) 21073</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
                    <p className="text-gray-700 dark:text-gray-300">disdukcapil@ngadakab.go.id</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Jam Operasional</p>
                    <p className="text-gray-700 dark:text-gray-300">Senin – Jumat, 08.00 – 15.00 WITA</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/hubungi-kami"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-green-600/20"
                  >
                    <Phone className="h-4 w-4" />
                    Hubungi Kami
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/kebijakan-privasi"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm font-medium transition-all duration-200"
                  >
                    <Shield className="h-4 w-4" />
                    Kebijakan Privasi
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* JSON-LD BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Beranda",
                  item: "https://disdukcapil-ngada.vercel.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Syarat & Ketentuan",
                  item: "https://disdukcapil-ngada.vercel.app/syarat-ketentuan",
                },
              ],
            }),
          }}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
