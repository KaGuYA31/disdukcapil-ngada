"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Users, IdCard, MapPin, TrendingUp, ArrowRight, BarChart3, TrendingUpIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface RingkasanData {
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  rasioJK: number;
  periode: string;
}

interface DokumenData {
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
  cakupanAkta: number;
}

interface BlankoEKTPData {
  jumlahTersedia: number;
  keterangan: string | null;
  updatedAt: string | null;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

// Custom hook for animated counting
function useAnimatedCounter(
  target: number,
  duration: number = 2000,
  isActive: boolean = false
) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    startTimeRef.current = null;
    const currentTarget = target;
    const currentDuration = duration;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / currentDuration, 1);

      // Ease-out cubic for natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * currentTarget));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(currentTarget);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, target, duration]);

  return count;
}

// Skeleton shimmer card shown while loading
function SkeletonStatCard() {
  return (
    <div className="relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/60 dark:border-gray-700/50 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer rounded-2xl" />
      <div className="relative space-y-4">
        {/* Icon skeleton */}
        <div className="w-14 h-14 rounded-full bg-gray-200/60 dark:bg-gray-700/40" />
        {/* Number skeleton */}
        <div className="h-8 w-28 rounded-lg bg-gray-200/60 dark:bg-gray-700/40" />
        {/* Label skeleton */}
        <div className="h-4 w-24 rounded-md bg-gray-200/60 dark:bg-gray-700/40" />
        {/* Description skeleton */}
        <div className="h-3 w-36 rounded-md bg-gray-200/40 dark:bg-gray-700/30" />
      </div>
    </div>
  );
}

// Enhanced animated stat card component
function AnimatedStatCard({
  icon: Icon,
  rawValue,
  formattedValue,
  label,
  description,
  delay = 0,
  isAnimating,
  isPercent = false,
}: {
  icon: React.ElementType;
  rawValue: number;
  formattedValue: string;
  label: string;
  description: string;
  delay: number;
  isAnimating: boolean;
  isPercent?: boolean;
}) {
  const animatedRaw = useAnimatedCounter(rawValue, 2000, isAnimating);

  const displayValue = isPercent
    ? `${(animatedRaw / 10).toFixed(1)}%`
    : formatNumber(animatedRaw);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isAnimating ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      {/* Gradient border on hover - visible via a pseudo-wrapper */}
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/60 group-hover:via-teal-400/60 group-hover:to-emerald-400/60 transition-all duration-500 blur-sm opacity-0 group-hover:opacity-100" />
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-500/80 group-hover:via-teal-500/80 group-hover:to-emerald-500/80 transition-all duration-500 opacity-0 group-hover:opacity-100" />

      {/* Card body */}
      <div className="relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm group-hover:shadow-xl group-hover:shadow-green-500/10 dark:group-hover:shadow-green-400/10 border border-gray-200/60 dark:border-gray-700/40 transition-all duration-500 group-hover:bg-green-50/40 dark:group-hover:bg-green-900/10">
        {/* Subtle gradient shimmer on top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent dark:via-green-500/30 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Gradient accent line at bottom */}
        <div className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/0 to-transparent group-hover:via-green-400/50 dark:group-hover:via-green-500/30 transition-all duration-500 rounded-full" />

        {/* Circular icon container with gradient + pulse ring */}
        <div className="relative w-14 h-14 mb-4">
          {/* Pulse ring behind icon — always visible, intensifies on hover */}
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-green-400/20 to-teal-500/20 animate-icon-pulse-ring transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-green-400/10 to-teal-500/10 animate-icon-pulse-ring transition-opacity duration-500 group-hover:opacity-100 opacity-20" style={{ animationDelay: "0.5s" }} />
          {/* Icon container */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/20 dark:shadow-green-400/10 transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Number with tabular-nums + trending indicator */}
        <div className="flex items-end gap-2">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-300 bg-clip-text text-transparent tracking-tight" style={{ fontFeatureSettings: '"tnum"' }}>
            {isAnimating ? displayValue : "0"}
          </p>
          {/* Trending indicator */}
          <span className="flex items-center gap-0.5 text-emerald-500 dark:text-emerald-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TrendingUpIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Live</span>
          </span>
        </div>

        {/* Label — improved dark mode contrast */}
        <p className="font-semibold text-gray-700 dark:text-gray-100 mt-1">{label}</p>
        {/* Description — improved dark mode contrast */}
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{description}</p>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const [loading, setLoading] = useState(true);
  const [ringkasan, setRingkasan] = useState<RingkasanData | null>(null);
  const [dokumen, setDokumen] = useState<DokumenData | null>(null);
  const [blankoEKTP, setBlankoEKTP] = useState<BlankoEKTPData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beranda");
        const result = await response.json();
        if (result.success) {
          setRingkasan(result.data.ringkasan);
          setDokumen(result.data.dokumen);
          setBlankoEKTP(result.data.blankoEKTP);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPenduduk = ringkasan?.totalPenduduk || 0;
  const cakupanAktaRaw = dokumen?.cakupanAkta ? Math.round(dokumen.cakupanAkta * 10) : 0;
  const periode = ringkasan?.periode || "-";

  const stats = [
    {
      icon: Users,
      rawValue: totalPenduduk,
      formattedValue: formatNumber(totalPenduduk),
      label: "Total Penduduk",
      description: `Periode ${periode}`,
      isPercent: false,
    },
    {
      icon: IdCard,
      rawValue: blankoEKTP?.jumlahTersedia || 0,
      formattedValue: formatNumber(blankoEKTP?.jumlahTersedia || 0),
      label: "Blanko E-KTP",
      description: blankoEKTP?.keterangan || "Tersedia saat ini",
      isPercent: false,
    },
    {
      icon: MapPin,
      rawValue: 12,
      formattedValue: "12",
      label: "Kecamatan",
      description: "Wilayah Layanan",
      isPercent: false,
    },
    {
      icon: TrendingUp,
      rawValue: cakupanAktaRaw,
      formattedValue: `${dokumen?.cakupanAkta?.toFixed(1) || "0"}%`,
      label: "Cakupan Akta",
      description: "Akta Kelahiran",
      isPercent: true,
    },
  ];

  const shouldAnimate = !loading && isInView;

  return (
    <section ref={sectionRef} className="py-14 md:py-20 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-gray-50 to-teal-50/60 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800" />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%230f766e'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100/50 dark:to-gray-800/50" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
            <BarChart3 className="h-4 w-4" />
            Data Kependudukan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-50 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Ringkasan Data Kependudukan
          </h2>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            Data kependudukan Kabupaten Ngada berdasarkan periode terbaru
          </p>
        </motion.div>

        {/* Stats Grid — responsive: 2 cols mobile, 3 tablet, 4 desktop */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 relative">
            {stats.map((stat, index) => (
              <AnimatedStatCard
                key={index}
                icon={stat.icon}
                rawValue={stat.rawValue}
                formattedValue={stat.formattedValue}
                label={stat.label}
                description={stat.description}
                delay={index * 0.12}
                isAnimating={shouldAnimate}
                isPercent={stat.isPercent}
              />
            ))}
          </div>
        )}

        {/* Link to statistics page */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link
            href="/statistik"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors group/link"
          >
            Lihat Data Lengkap
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* SVG Wave Divider — gray-50 → white */}
      <div className="relative h-12 md:h-16 -mb-px">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 right-0 w-full h-full dark:hidden"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C180 65 360 75 540 60C720 45 900 20 1080 25C1260 30 1380 50 1440 55V80H0V40Z"
            fill="white"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 right-0 w-full h-full hidden dark:block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C180 65 360 75 540 60C720 45 900 20 1080 25C1260 30 1380 50 1440 55V80H0V40Z"
            fill="#111827"
          />
        </svg>
      </div>
    </section>
  );
}
