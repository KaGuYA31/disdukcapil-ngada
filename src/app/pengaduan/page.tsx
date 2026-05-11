"use client";

import { motion } from "framer-motion";
import { MessageSquare, Clock, CheckCircle2, Send, FileEdit, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PengaduanSection } from "@/components/sections/pengaduan/pengaduan-section";
import { RecentSubmissions } from "@/components/sections/pengaduan/recent-submissions";

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

const submissionSteps = [
  { step: 1, label: "Isi Formulir", icon: FileEdit },
  { step: 2, label: "Kirim", icon: Send },
  { step: 3, label: "Diproses", icon: Clock },
  { step: 4, label: "Selesai", icon: CheckCircle2 },
];

export default function PengaduanPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

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

          {/* Floating decorative shapes */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 right-[12%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-20 left-[15%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Bantuan & Pengaduan" }]} />
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Bantuan & Pengaduan
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-3"
                >
                  <MessageSquare className="h-9 w-9 md:h-11 md:w-11 text-green-200" />
                  Bantuan & Pengaduan
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed">
                  Sampaikan pertanyaan, keluhan, atau saran Anda untuk membantu
                  kami meningkatkan kualitas pelayanan.
                </motion.p>

                {/* Progress Steps Indicator */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex items-center gap-2 sm:gap-0 overflow-x-auto pb-2"
                >
                  {submissionSteps.map((item, idx) => {
                    const StepIcon = item.icon;
                    return (
                      <div key={item.step} className="flex items-center">
                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-w-fit">
                          <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <StepIcon className="h-4 w-4 text-green-200" />
                          </div>
                          <span className="text-sm font-medium text-green-100 whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                        {idx < submissionSteps.length - 1 && (
                          <div className="px-1 sm:px-2 flex-shrink-0">
                            <div className="w-4 sm:w-8 h-px bg-green-400/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>

                {/* Estimated Response Time */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-6 flex items-center gap-3 bg-green-600/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/30"
                >
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Estimasi Waktu Respons</p>
                    <p className="text-sm text-green-200">
                      1–3 hari kerja melalui email atau telepon
                    </p>
                  </div>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-4 flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4 text-green-300" />
                  <span className="text-sm text-green-200">Data Anda terjamin kerahasiaannya</span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-white dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        {/* Recent Submissions Section */}
        <RecentSubmissions />

        {/* Main Pengaduan Form Section */}
        <PengaduanSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
