"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, ClipboardList } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ServicesListSection } from "@/components/sections/layanan/services-list-section";
import { DocumentCheckerSection } from "@/components/sections/layanan/document-checker-section";

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

// Available services for document checker
const documentCheckerServices = [
  { slug: "ktp-el", label: "KTP-el", icon: "🪪" },
  { slug: "kartu-keluarga", label: "Kartu Keluarga", icon: "👨‍👩‍👧‍👦" },
  { slug: "akta-kelahiran", label: "Akta Kelahiran", icon: "👶" },
  { slug: "akta-kematian", label: "Akta Kematian", icon: "🕊️" },
  { slug: "akta-perkawinan", label: "Akta Perkawinan", icon: "💍" },
  { slug: "akta-perceraian", label: "Akta Perceraian", icon: "📜" },
] as const;

function DocumentCheckerWrapper() {
  const [selectedService, setSelectedService] = useState<string>("ktp-el");

  return (
    <div className="space-y-4">
      {/* Service selector buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {documentCheckerServices.map((service) => (
          <button
            key={service.slug}
            onClick={() => setSelectedService(service.slug)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              selectedService === service.slug
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 scale-105"
                : "bg-white text-gray-700 border border-gray-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            <span>{service.icon}</span>
            <span className="hidden sm:inline">{service.label}</span>
          </button>
        ))}
      </div>

      {/* Document checker for selected service */}
      <DocumentCheckerSection serviceSlug={selectedService} />
    </div>
  );
}

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
                    <li>• Permendagri No. 2 Tahun 2026</li>
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
                      Layanan selesai di tempat
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
                  selama semua persyaratan terpenuhi.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Document Requirements Checker */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-8">
                <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-3">
                  Persyaratan Dokumen
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <ClipboardList className="h-7 w-7 text-teal-600" />
                  Cek Kelengkapan Dokumen Anda
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  Pilih layanan yang ingin diurus untuk mengetahui dokumen yang diperlukan.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
                <DocumentCheckerWrapper />
              </motion.div>
            </motion.div>
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
