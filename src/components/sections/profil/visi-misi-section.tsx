"use client";

import { motion } from "framer-motion";
import { Target, Eye, Quote } from "lucide-react";

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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const misiStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const misiItemLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const misiItemRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const visi =
  "Mewujudkan tata kelola administrasi kependudukan yang akurat, tepat waktu, dan berorientasi pada kepuasan masyarakat dalam rangka mendukung pembangunan daerah Kabupaten Ngada.";

const misi = [
  "Meningkatkan kualitas pelayanan administrasi kependudukan yang cepat, tepat, dan akurat",
  "Mengoptimalkan pengelolaan database kependudukan yang terintegrasi dan terkini",
  "Meningkatkan kompetensi dan profesionalisme sumber daya manusia",
  "Mengembangkan sistem pelayanan berbasis teknologi informasi",
  "Meningkatkan jangkauan dan aksesibilitas layanan ke seluruh masyarakat",
  "Membangun koordinasi dan kemitraan dengan instansi terkait",
];

export function VisiMisiSection() {
  return (
    <section id="visi-misi" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #059669 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="text-green-600 font-semibold text-sm uppercase tracking-wider"
          >
            Visi &amp; Misi
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
          >
            Arah dan Tujuan Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Landasan dan pedoman dalam menjalankan tugas pelayanan
            kependudukan
          </motion.p>
        </motion.div>

        {/* ==================== VISI — Prominent Section ==================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto mb-20"
        >
          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-green-100/60 via-teal-50/40 to-emerald-100/60 rounded-3xl blur-xl pointer-events-none" />

          <motion.div
            variants={fadeInUp}
            className="relative bg-white rounded-3xl p-8 md:p-12 border border-green-200/60 shadow-lg shadow-green-100/50 overflow-hidden"
          >
            {/* Subtle inner stripe pattern */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 12px)`,
              }}
            />

            <div className="relative z-10">
              {/* Label + Icon */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-md shadow-green-200/50">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
                  Visi
                </h3>
              </motion.div>

              {/* Quote with decorative icon */}
              <motion.div variants={fadeInUp} className="relative pl-2 md:pl-4">
                <Quote className="h-10 w-10 md:h-12 md:w-12 text-green-200/80 absolute -top-2 -left-1 md:-top-3 md:-left-2" />
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-relaxed pl-6 md:pl-10">
                  <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {visi}
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ==================== MISI — Timeline Roadmap ==================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Misi Header */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-12 justify-center"
          >
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center shadow-md">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Misi
            </h3>
          </motion.div>

          {/* Timeline container */}
          <div className="relative">
            {/* Vertical line — mobile: left-aligned, desktop: centered */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-teal-400 to-emerald-500" />

            <motion.div
              variants={misiStaggerContainer}
              className="space-y-8 md:space-y-12"
            >
              {misi.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    variants={isLeft ? misiItemLeft : misiItemRight}
                    className="relative flex items-start"
                  >
                    {/* Desktop layout — alternating */}
                    {/* Left content placeholder (for right-positioned items on desktop) */}
                    {isLeft ? (
                      /* === EVEN item: card on LEFT, circle center, empty right === */
                      <>
                        {/* Card — left side (desktop only, hidden on mobile) */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)] text-right">
                          <div className="inline-block max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-right">
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {item}
                            </p>
                          </div>
                        </div>

                        {/* Circle — center */}
                        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 ring-4 ring-white">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Empty — right side desktop */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]" />

                        {/* Card — mobile only (right of line) */}
                        <div className="md:hidden flex-1 ml-14">
                          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {item}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* === ODD item: empty left, circle center, card on RIGHT === */
                      <>
                        {/* Empty — left side desktop */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]" />

                        {/* Circle — center */}
                        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 ring-4 ring-white">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Card — right side (desktop) */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]">
                          <div className="max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {item}
                            </p>
                          </div>
                        </div>

                        {/* Card — mobile only (right of line) */}
                        <div className="md:hidden flex-1 ml-14">
                          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {item}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
