"use client";

import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ServicesListSection } from "@/components/sections/layanan/services-list-section";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
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

export default function LayananPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Decorative gradient orbs */}
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
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Layanan" }]} />
                </motion.div>
                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Layanan Kami
                  </span>
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <FileText className="h-9 w-9 md:h-11 md:w-11 text-green-200" />
                  Layanan Administrasi
                  <br className="hidden sm:block" />
                  <span className="text-green-200">Kependudukan</span>
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed">
                  Informasi lengkap tentang persyaratan dan prosedur layanan
                  administrasi kependudukan sesuai UU No. 24 Tahun 2013.
                </motion.p>
              </motion.div>

              {/* Free Service Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }}
                className="mt-8 bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">SELURUH LAYANAN GRATIS</h2>
                    <p className="text-green-100">
                      Sesuai kebijakan pemerintah, seluruh layanan administrasi kependudukan 
                      <strong> TIDAK DIPUNGUT BIAYA </strong> apapun. Termasuk pembuatan KTP-el, 
                      KK, Akta, legalisasi dokumen, dan seluruh layanan lainnya.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Key Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.7 } }}
                className="grid sm:grid-cols-2 gap-4 mt-6"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                    Dasar Hukum
                  </h3>
                  <ul className="text-sm text-green-100 space-y-1.5">
                    <li>• UU No. 24 Tahun 2013 tentang Administrasi Kependudukan</li>
                    <li>• Permendagri No. 3 Tahun 2024</li>
                    <li>• SE Menpan RB Tahun 2024 - Pelayanan Publik Gratis</li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                    Informasi Penting
                  </h3>
                  <ul className="text-sm text-green-100 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-green-300" />
                      Layanan selesai di tempat (kecuali rekam baru KTP-el)
                    </li>
                    <li>• Bawa dokumen asli dan fotokopi</li>
                    <li>• Datang langsung ke kantor Disdukcapil</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.9 } }}
                className="mt-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4"
              >
                <p className="text-green-100 text-sm">
                  <strong>Catatan:</strong> Seluruh layanan dapat diselesaikan pada hari yang sama 
                  selama semua persyaratan terpenuhi. Untuk rekam baru KTP-el, diperlukan waktu 
                  3-5 hari kerja karena proses perekaman biometrik dan sinkronisasi data ke pusat.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <ServicesListSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
