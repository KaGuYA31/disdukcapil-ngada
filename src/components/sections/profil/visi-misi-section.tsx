"use client";

import { motion } from "framer-motion";
import { Target, Eye, Quote, Sparkles } from "lucide-react";

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

      {/* Decorative geometric shapes */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-[8%] w-6 h-6 bg-green-100 rounded-sm rotate-12 opacity-60 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[40%] left-[5%] w-4 h-4 bg-teal-100 rounded-full opacity-50 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-32 right-[12%] w-3 h-3 bg-emerald-200 rounded-full opacity-40 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[45%] left-[10%] w-5 h-5 border-2 border-green-200 rounded-sm rotate-45 opacity-40 hidden lg:block"
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
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2"
          >
            Arah dan Tujuan Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-400 mt-4">
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
          <div className="absolute -inset-4 bg-gradient-to-br from-green-100/60 via-teal-50/40 to-emerald-100/60 dark:from-green-900/20 dark:via-teal-900/10 dark:to-emerald-900/20 rounded-3xl blur-xl pointer-events-none" />

          {/* Animated gradient border wrapper */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 opacity-80" />
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-green-100/30 dark:shadow-green-900/20 overflow-hidden">
              {/* Animated gradient overlay */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(20,184,166,0.03) 50%, rgba(16,185,129,0.03) 100%)",
                    "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.03) 50%, rgba(20,184,166,0.05) 100%)",
                    "linear-gradient(135deg, rgba(20,184,166,0.03) 0%, rgba(16,185,129,0.05) 50%, rgba(5,150,105,0.03) 100%)",
                    "linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(20,184,166,0.03) 50%, rgba(16,185,129,0.03) 100%)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl pointer-events-none"
              />

              {/* Subtle inner stripe pattern */}
              <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 12px)`,
                }}
              />

              {/* Corner decorative sparkle */}
              <div className="absolute top-4 right-4 opacity-10">
                <Sparkles className="h-8 w-8 text-green-500" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <Sparkles className="h-6 w-6 text-teal-500" />
              </div>

              <div className="relative z-10">
                {/* Label + Icon */}
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Visi
                  </h3>
                </motion.div>

                {/* Quote with decorative icon */}
                <motion.div variants={fadeInUp} className="relative pl-2 md:pl-4">
                  <div className="absolute -top-3 -left-1 md:-top-4 md:-left-2">
                    <div className="relative">
                      <Quote className="h-10 w-10 md:h-14 md:w-14 text-green-200 dark:text-green-800" />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-green-200/20 dark:bg-green-700/20 rounded-full blur-md"
                      />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pl-8 md:pl-12 italic">
                    <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-300 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      &ldquo;{visi}&rdquo;
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ==================== Decorative Divider ==================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="flex items-center justify-center gap-4 mb-20 max-w-4xl mx-auto"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-800 dark:to-teal-800 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent" />
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
            <div className="w-14 h-14 bg-gray-800 dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Misi
            </h3>
          </motion.div>

          {/* Timeline container */}
          <div className="relative">
            {/* Vertical line — mobile: left-aligned, desktop: centered */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-teal-400 to-emerald-500 dark:from-green-600 dark:via-teal-600 dark:to-emerald-700" />

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
                          <motion.div
                            whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="inline-block max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 text-right"
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                              {item}
                            </p>
                          </motion.div>
                        </div>

                        {/* Circle — center */}
                        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.2 }}
                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50 ring-4 ring-white dark:ring-gray-950 cursor-default"
                          >
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </motion.div>
                        </div>

                        {/* Empty — right side desktop */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]" />

                        {/* Card — mobile only (right of line) */}
                        <div className="md:hidden flex-1 ml-14">
                          <motion.div
                            whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                              {item}
                            </p>
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      /* === ODD item: empty left, circle center, card on RIGHT === */
                      <>
                        {/* Empty — left side desktop */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]" />

                        {/* Circle — center */}
                        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.2 }}
                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50 ring-4 ring-white dark:ring-gray-950 cursor-default"
                          >
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </motion.div>
                        </div>

                        {/* Card — right side (desktop) */}
                        <div className="hidden md:block w-[calc(50%-2.5rem)]">
                          <motion.div
                            whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                              {item}
                            </p>
                          </motion.div>
                        </div>

                        {/* Card — mobile only (right of line) */}
                        <div className="md:hidden flex-1 ml-14">
                          <motion.div
                            whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                              {item}
                            </p>
                          </motion.div>
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
