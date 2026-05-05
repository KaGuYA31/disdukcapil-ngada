"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  History,
  Trophy,
  Lightbulb,
  Monitor,
  Building2,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Category Types ───────────────────────────────────────────────────
type Category = "Pencapaian" | "Inovasi" | "Digital" | "Infrastruktur";

interface CategoryConfig {
  icon: LucideIcon;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  dotBg: string;
  ringBg: string;
  glowShadow: string;
}

const categoryConfig: Record<Category, CategoryConfig> = {
  Pencapaian: {
    icon: Trophy,
    gradient: "from-emerald-500 to-green-600",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    dotBg: "bg-emerald-600 dark:bg-emerald-500",
    ringBg: "bg-emerald-400",
    glowShadow: "hover:shadow-emerald-500/20",
  },
  Inovasi: {
    icon: Lightbulb,
    gradient: "from-amber-500 to-yellow-600",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
    dotBg: "bg-amber-600 dark:bg-amber-500",
    ringBg: "bg-amber-400",
    glowShadow: "hover:shadow-amber-500/20",
  },
  Digital: {
    icon: Monitor,
    gradient: "from-teal-500 to-cyan-600",
    badgeBg: "bg-teal-100 dark:bg-teal-900/40",
    badgeText: "text-teal-700 dark:text-teal-300",
    borderHover: "hover:border-teal-300 dark:hover:border-teal-700",
    dotBg: "bg-teal-600 dark:bg-teal-500",
    ringBg: "bg-teal-400",
    glowShadow: "hover:shadow-teal-500/20",
  },
  Infrastruktur: {
    icon: Building2,
    gradient: "from-violet-500 to-purple-600",
    badgeBg: "bg-violet-100 dark:bg-violet-900/40",
    badgeText: "text-violet-700 dark:text-violet-300",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-700",
    dotBg: "bg-violet-600 dark:bg-violet-500",
    ringBg: "bg-violet-400",
    glowShadow: "hover:shadow-violet-500/20",
  },
};

// ─── Timeline Data ────────────────────────────────────────────────────
interface Milestone {
  year: number;
  title: string;
  description: string;
  category: Category;
}

const milestones: Milestone[] = [
  {
    year: 2010,
    title: "Pembentukan Disdukcapil Ngada",
    description:
      "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada resmi berdiri sebagai lembaga pelayanan administrasi kependudukan masyarakat.",
    category: "Infrastruktur",
  },
  {
    year: 2013,
    title: "Implementasi Sistem SIAK",
    description:
      "Diterapkannya Sistem Informasi Administrasi Kependudukan (SIAK) untuk integrasi data kependudukan secara digital dan terpusat.",
    category: "Digital",
  },
  {
    year: 2015,
    title: "Penerbitan KTP-el Pertama",
    description:
      "Pencetakan perdana Kartu Tanda Penduduk Elektronik (KTP-el) berbasis biometrik untuk seluruh warga Kabupaten Ngada.",
    category: "Pencapaian",
  },
  {
    year: 2017,
    title: "Layanan Online Perdana",
    description:
      "Peluncuran layanan pendaftaran online untuk mempermudah masyarakat dalam mengurus dokumen kependudukan tanpa harus datang langsung.",
    category: "Inovasi",
  },
  {
    year: 2018,
    title: "Sistem Antrian Digital",
    description:
      "Implementasi sistem antrian digital berbasis nomor urut elektronik untuk mengurangi waktu tunggu dan meningkatkan kenyamanan pelayanan.",
    category: "Digital",
  },
  {
    year: 2020,
    title: "Pelayanan di Era Pandemi",
    description:
      "Adaptasi layanan dengan protokol kesehatan dan penerapan layanan jemput bola untuk tetap melayani masyarakat selama pandemi COVID-19.",
    category: "Inovasi",
  },
  {
    year: 2022,
    title: "100% Cakupan KTP-el",
    description:
      "Pencapaian luar biasa dengan tercapainya 100% cakupan penerbitan KTP-el bagi seluruh penduduk wajib KTP di Kabupaten Ngada.",
    category: "Pencapaian",
  },
  {
    year: 2023,
    title: "Peluncuran Portal Digital Baru",
    description:
      "Diluncurkannya portal layanan digital terbaru dengan tampilan modern dan fitur lengkap untuk kemudahan akses informasi dan pelayanan.",
    category: "Digital",
  },
  {
    year: 2024,
    title: "Penghargaan Pelayanan Publik Terbaik",
    description:
      "Meraih penghargaan pelayanan publik terbaik tingkat provinsi sebagai pengakuan terhadap komitmen dalam memberikan pelayanan prima.",
    category: "Pencapaian",
  },
  {
    year: 2025,
    title: "Modernisasi Pelayanan Digital",
    description:
      "Langkah maju menuju modernisasi pelayanan dengan integrasi AI, validasi biometrik canggih, dan satu data kependudukan terpadu.",
    category: "Inovasi",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────
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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ─── Animated Year Counter ────────────────────────────────────────────
function AnimatedYear({
  targetYear,
  isInView,
}: {
  targetYear: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 2000;
    const duration = 1200;
    const stepTime = duration / (targetYear - start);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= targetYear) {
        clearInterval(timer);
        setCount(targetYear);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, targetYear]);

  return <>{isInView ? count : targetYear}</>;
}

// ─── Main Component ───────────────────────────────────────────────────
export function TimelinePencapaianSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTimelineInView = useInView(timelineRef, {
    once: true,
    amount: 0.05,
  });

  return (
    <section
      id="timeline-pencapaian"
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/20 to-teal-50/20 dark:from-gray-950 dark:via-green-950/10 dark:to-teal-950/10 pointer-events-none" />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 dot-grid-pattern pointer-events-none" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float-1 pointer-events-none" />
      <div
        className="absolute top-1/2 -right-24 w-72 h-72 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float-2 pointer-events-none"
      />
      <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-emerald-400/8 dark:bg-emerald-500/4 rounded-full blur-3xl animate-float-3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* ─── Section Header ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Icon badge */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50">
              <History className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
                Timeline Pencapaian
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2"
          >
            Jejak Langkah{" "}
            <span className="text-gradient-green">Disdukcapil Ngada</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed"
          >
            Jejak langkah dan pencapaian Disdukcapil Kabupaten Ngada dalam
            memberikan pelayanan terbaik kepada masyarakat
          </motion.p>

          {/* Category legend */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            {(
              Object.entries(categoryConfig) as [Category, CategoryConfig][]
            ).map(([cat, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll to explore indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
            <span>Gulir untuk menjelajahi</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Timeline ───────────────────────────────────────── */}
        <motion.div
          ref={timelineRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Animated gradient vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isTimelineInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 origin-top"
              style={{
                background:
                  "linear-gradient(to bottom, #059669, #14b8a6, #10b981, #0d9488, #059669)",
              }}
            />

            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-12">
              {milestones.map((item, index) => {
                const cfg = categoryConfig[item.category];
                const CategoryIcon = cfg.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    variants={isEven ? slideFromLeft : slideFromRight}
                    className={`relative flex items-start gap-4 md:gap-6 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* ─── Pulsing dot ──────────────────────────── */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className="relative"
                      >
                        {/* Year badge circle (gradient) */}
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${cfg.gradient} rounded-full flex items-center justify-center shadow-lg ${cfg.glowShadow}`}
                        >
                          <span className="text-white font-bold text-xs leading-none">
                            <AnimatedYear
                              targetYear={item.year}
                              isInView={isSectionInView}
                            />
                          </span>
                        </div>
                        {/* Pulse ring */}
                        <motion.div
                          animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0.4, 0, 0.4],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                          className={`absolute inset-0 w-12 h-12 rounded-full ${cfg.ringBg}`}
                        />
                        {/* Second subtle ring */}
                        <motion.div
                          animate={{
                            scale: [1, 2, 1],
                            opacity: [0.2, 0, 0.2],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3 + 0.5,
                          }}
                          className={`absolute inset-0 w-12 h-12 rounded-full ${cfg.ringBg}`}
                        />
                      </motion.div>
                    </div>

                    {/* ─── Content Card ─────────────────────────── */}
                    <div
                      className={`ml-16 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                        isEven ? "md:pr-6" : "md:pl-6"
                      }`}
                    >
                      <motion.div
                        whileHover={{
                          y: -4,
                          boxShadow:
                            "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                        }}
                        transition={{ duration: 0.25 }}
                        className={`
                          group relative rounded-xl p-5 md:p-6
                          backdrop-blur-md bg-white/70 dark:bg-gray-900/70
                          border border-gray-200/60 dark:border-gray-700/60
                          shadow-sm transition-all duration-300 cursor-default
                          ${cfg.borderHover}
                        `}
                      >
                        {/* Category badge */}
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="secondary"
                            className={`
                              ${cfg.badgeBg} ${cfg.badgeText}
                              text-xs font-medium px-2.5 py-0.5
                              border-0 flex items-center gap-1.5
                            `}
                          >
                            <CategoryIcon className="h-3 w-3" />
                            {item.category}
                          </Badge>
                        </div>

                        {/* Year label */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`w-2 h-2 rounded-full ${cfg.dotBg}`}
                          />
                          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            {item.year}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg leading-snug">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Bottom accent line (reveal on hover) */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 transition-all duration-500 rounded-full bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400" />
                      </motion.div>
                    </div>

                    {/* Empty space for alternating layout (desktop) */}
                    <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ─── Footer Note ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>
              Data pencapaian disusun berdasarkan laporan tahunan Disdukcapil
              Kabupaten Ngada
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────
export function TimelinePencapaianSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/20 to-teal-50/20 dark:from-gray-950 dark:via-green-950/10 dark:to-teal-950/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 h-8 w-48 animate-shimmer" />
          <div className="h-10 w-72 md:w-96 mx-auto mt-4 rounded-lg bg-gray-200 dark:bg-gray-800 animate-shimmer" />
          <div className="h-4 w-96 max-w-full mx-auto mt-4 rounded bg-gray-200 dark:bg-gray-800 animate-shimmer" />
        </div>

        {/* Timeline skeleton */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {/* Items */}
            <div className="space-y-8 md:space-y-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-4 md:gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot skeleton */}
                  <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-shimmer" />
                  </div>

                  {/* Card skeleton */}
                  <div className="ml-16 md:ml-0 md:w-[calc(50%-2.5rem)]">
                    <div className="rounded-xl p-5 md:p-6 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer mb-3" />
                      <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-shimmer mb-2" />
                      <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700 animate-shimmer mb-2" />
                      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-shimmer" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
