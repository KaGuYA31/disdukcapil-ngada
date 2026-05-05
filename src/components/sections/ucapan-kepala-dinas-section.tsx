"use client";

import { useRef, useEffect, useState } from "react";
import {
  Quote,
  Shield,
  Lightbulb,
  Eye,
  Users,
  Award,
  Star,
  Clock,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

// ─── Animated Counter Hook ─────────────────────────────────────────────
function useAnimatedCounter(
  target: number,
  isInView: boolean,
  duration = 2000
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let rafId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration]);

  return count;
}

// ─── Vision Pillar Data ───────────────────────────────────────────────
const visionPillars = [
  {
    icon: Shield,
    title: "Integritas",
    description:
      "Kami menegakkan standar pelayanan yang jujur dan profesional dalam setiap proses administrasi kependudukan. Setiap dokumen yang diterbitkan melalui proses verifikasi yang ketat dan akuntabel.",
    gradient: "from-green-500 to-emerald-600",
    glowColor: "group-hover:shadow-green-500/25",
    borderColor: "group-hover:border-green-300 dark:group-hover:border-green-700",
  },
  {
    icon: Lightbulb,
    title: "Inovasi",
    description:
      "Terus berinovasi dalam modernisasi pelayanan publik melalui digitalisasi dan teknologi terkini. Kami berkomitmen menghadirkan kemudahan akses layanan bagi seluruh masyarakat.",
    gradient: "from-teal-500 to-cyan-600",
    glowColor: "group-hover:shadow-teal-500/25",
    borderColor: "group-hover:border-teal-300 dark:group-hover:border-teal-700",
  },
  {
    icon: Eye,
    title: "Transparansi",
    description:
      "Keterbukaan informasi menjadi fondasi kepercayaan publik. Kami menyajikan data kinerja, prosedur layanan, dan informasi penting secara terbuka untuk masyarakat Kabupaten Ngada.",
    gradient: "from-amber-500 to-yellow-600",
    glowColor: "group-hover:shadow-amber-500/25",
    borderColor: "group-hover:border-amber-300 dark:group-hover:border-amber-700",
  },
];

// ─── Quick Stats Data ─────────────────────────────────────────────────
const quickStats = [
  { icon: Clock, value: 10, suffix: "+ Tahun Melayani", label: "Pengalaman" },
  { icon: Users, value: 171, suffix: ".000+ Penduduk", label: "Dilayani" },
  { icon: Award, value: 100, suffix: "% Komitmen", label: "Pelayanan" },
];

// ─── Animation Variants ───────────────────────────────────────────────
const quoteCardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
    },
  },
};

const pillarCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const statPillVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Main Component ───────────────────────────────────────────────────
export function UcapanKepalaDinasSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const yearsCount = useAnimatedCounter(10, isInView, 1800);
  const populationCount = useAnimatedCounter(171, isInView, 2200);
  const commitmentCount = useAnimatedCounter(100, isInView, 1600);

  const counts = [yearsCount, populationCount, commitmentCount];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* ── Background ────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-gray-950 dark:via-green-950/20 dark:to-gray-950" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%2322c55e'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative floating shapes */}
      <motion.div
        className="absolute top-[8%] right-[6%] w-20 h-20 border border-green-200/30 dark:border-green-700/20 rounded-2xl rotate-12 pointer-events-none"
        animate={{ y: [0, -10, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[4%] w-14 h-14 border border-teal-200/30 dark:border-teal-700/20 rounded-full pointer-events-none"
        animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[45%] left-[8%] w-10 h-10 bg-amber-400/10 dark:bg-amber-400/5 rounded-lg rotate-45 pointer-events-none"
        animate={{ y: [0, -12, 0], rotate: [45, 60, 45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-8 h-8 bg-green-300/10 dark:bg-green-400/5 rounded-full pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-[25%] right-[15%] w-6 h-6 border border-emerald-200/40 dark:border-emerald-700/30 rounded-md pointer-events-none"
        animate={{ y: [0, -8, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Background gradient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-green-400/10 dark:bg-green-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-teal-400/10 dark:bg-teal-500/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Section Header ───────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full px-4 py-2 text-sm font-medium border border-green-200/50 dark:border-green-800/50">
              <Quote className="h-4 w-4" />
              Pesan Kepala Dinas
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Pesan{" "}
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400 bg-clip-text text-transparent">
              Kepala Dinas
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-gray-600 dark:text-gray-400 text-lg mt-4 max-w-2xl mx-auto"
          >
            Komitmen dan visi pimpinan Disdukcapil Kabupaten Ngada
          </motion.p>

          {/* Gradient accent line */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-amber-400"
          />
        </motion.div>

        {/* ── Leadership Quote Card ────────────────────────────────── */}
        <motion.div
          variants={quoteCardVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative max-w-4xl mx-auto mb-12"
        >
          {/* Animated gradient border wrapper */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-green-400 via-teal-400 to-amber-400 opacity-40 blur-sm" />

          <div className="relative bg-gradient-to-br from-green-50/30 to-teal-50/20 dark:from-green-900/20 dark:to-teal-900/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-green-200/30 dark:border-green-700/20 shadow-xl overflow-hidden">
            {/* Inner gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100/20 via-transparent to-teal-100/20 dark:from-green-900/10 dark:to-teal-900/10 pointer-events-none" />

            {/* Stripe pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #22c55e 10px, #22c55e 11px)`,
              }}
            />

            {/* Large decorative Quote icon */}
            <div className="absolute top-4 right-6 md:top-6 md:right-10 pointer-events-none">
              <motion.div
                animate={{
                  opacity: [0.06, 0.12, 0.06],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Quote className="h-20 w-20 md:h-28 md:w-28 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>

            {/* Corner sparkle */}
            <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Star className="h-3 w-3 text-amber-400/50 absolute top-4 left-4" />
              </motion.div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Star className="h-2.5 w-2.5 text-green-400/40 absolute bottom-4 right-4" />
              </motion.div>
            </div>

            <div className="relative z-10">
              {/* Quote marks */}
              <div className="text-green-600/30 dark:text-green-400/20 text-6xl md:text-7xl leading-none font-serif select-none mb-2">
                &ldquo;
              </div>

              {/* Main quote text */}
              <blockquote className="text-xl md:text-2xl lg:text-[1.6rem] text-gray-800 dark:text-gray-100 font-medium leading-relaxed italic mb-8 max-w-3xl">
                Kami berkomitmen untuk melayani seluruh masyarakat Kabupaten
                Ngada dengan penuh integritas, kecepatan, dan transparansi. Setiap
                dokumen kependudukan yang kami kelola adalah cerminan hak asasi
                warga negara yang harus kita jaga bersama-sama melalui pelayanan
                yang modern dan berbasis digital.
              </blockquote>

              {/* Signature line decoration */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] flex-1 max-w-[80px] bg-gradient-to-r from-green-500 via-teal-500 to-amber-400 rounded-full" />
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
              </div>

              {/* Author info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                    Kepala Dinas Kependudukan dan Pencatatan Sipil
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                    Kabupaten Ngada, NTT
                  </p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-green-300/50 via-teal-300/50 to-transparent dark:from-green-600/30 dark:via-teal-600/30" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                    Aktif Menjabat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats Row ──────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={statPillVariants}
                whileHover={{ y: -3, scale: 1.04 }}
                className="group relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-xl px-5 py-4 border border-green-200/30 dark:border-green-700/20 shadow-lg shadow-green-500/5 dark:shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
              >
                {/* Top accent on hover */}
                <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-green-400 via-teal-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {counts[index]}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {stat.suffix.replace(/^\d+/, "")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Vision Pillars Section ───────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Tiga Pilar{" "}
              <span className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Pelayanan
              </span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto text-sm md:text-base">
              Fondasi utama yang menjadi landasan kami dalam melayani masyarakat
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {visionPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={pillarCardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/30 shadow-lg ${pillar.glowColor} hover:shadow-xl transition-all duration-300 ${pillar.borderColor}`}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-500 rounded-2xl pointer-events-none`}
                  />

                  {/* Top gradient accent line */}
                  <div
                    className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${pillar.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>

                  <div className="relative z-10">
                    {/* Icon container */}
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${pillar.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                      {pillar.title}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Bottom decorative dot */}
                    <div className="mt-5 flex items-center gap-2">
                      <div
                        className={`h-1 w-6 rounded-full bg-gradient-to-r ${pillar.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                      <div
                        className={`h-1 w-3 rounded-full bg-gradient-to-r ${pillar.gradient} opacity-30 group-hover:opacity-80 transition-opacity duration-300`}
                      />
                      <div
                        className={`h-1 w-1.5 rounded-full bg-gradient-to-r ${pillar.gradient} opacity-20 group-hover:opacity-60 transition-opacity duration-300`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── Footer note ──────────────────────────────────────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-14"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-md mx-auto">
            Pesan ini mencerminkan komitmen Disdukcapil Kabupaten Ngada dalam
            memberikan pelayanan terbaik bagi seluruh masyarakat.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────
export function UcapanKepalaDinasSectionSkeleton() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-gray-950 dark:via-green-950/20 dark:to-gray-950" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm mb-4 w-40 h-9 mx-auto shimmer" />
          <div className="h-10 md:h-12 w-64 md:w-96 mx-auto shimmer rounded-lg mb-4" />
          <div className="h-5 w-80 mx-auto shimmer rounded" />
        </div>

        {/* Quote card skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-8 md:p-12 h-72 md:h-64 shimmer" />
        </div>

        {/* Stats skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800/60 rounded-xl px-5 py-4 w-52 h-16 shimmer"
            />
          ))}
        </div>

        {/* Pillars skeleton */}
        <div className="text-center mb-10">
          <div className="h-8 w-48 mx-auto shimmer rounded-lg mb-2" />
          <div className="h-4 w-64 mx-auto shimmer rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-6 md:p-8 h-56 shimmer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
