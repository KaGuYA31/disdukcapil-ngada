"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Users, IdCard, MapPin, TrendingUp, ArrowRight, BarChart3, TrendingUpIcon, Sparkles } from "lucide-react";
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
  const [isComplete, setIsComplete] = useState(false);
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
        setIsComplete(true);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, target, duration]);

  return { count, isComplete };
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
  const { count: animatedRaw, isComplete } = useAnimatedCounter(rawValue, 2000, isAnimating);

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

      {/* Card body — 3D tilt effect */}
      <div className="relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm group-hover:shadow-xl group-hover:shadow-green-500/10 dark:group-hover:shadow-green-400/10 border border-gray-200/60 dark:border-gray-700/40 transition-all duration-500 group-hover:bg-green-50/40 dark:group-hover:bg-green-900/10 stat-card-3d overflow-hidden">
        {/* Subtle gradient shimmer on top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent dark:via-green-500/30 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Bottom accent line — reveal animation 0→100% width */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-3/4 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-500" />

        {/* Circular icon container with gradient + pulse ring + bounce on hover */}
        <div className="relative w-14 h-14 mb-4">
          {/* Pulse ring behind icon — always visible, intensifies on hover */}
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-green-400/20 to-teal-500/20 animate-icon-pulse-ring transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-green-400/10 to-teal-500/10 animate-icon-pulse-ring transition-opacity duration-500 group-hover:opacity-100 opacity-20" style={{ animationDelay: "0.5s" }} />
          {/* Icon container with bounce on hover */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/20 dark:shadow-green-400/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Number with gradient text (green→teal) + completion pulse + trending indicator */}
        <div className="flex items-end gap-2">
          <motion.p
            className={`text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent tracking-tight ${isComplete ? "animate-counter-pulse" : ""}`}
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {isAnimating ? displayValue : "0"}
          </motion.p>
          {/* + suffix with spring animation */}
          {isComplete && !isPercent && (
            <motion.span
              className="text-xl md:text-2xl font-bold text-teal-500 mb-0.5 animate-plus-spring"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
            >
              +
            </motion.span>
          )}
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
      <div className="absolute inset-0 dot-grid-pattern opacity-[0.04] dark:opacity-[0.06]" />

      {/* Decorative gradient orbs — 3 orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl animate-mesh-blob-1" />
      <div className="absolute top-1/2 right-[-10%] w-64 h-64 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-mesh-blob-2" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-mesh-blob-3" />

      {/* Floating geometric decorative shapes — hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
        <div className="absolute top-[12%] left-[8%] w-8 h-8 rounded-lg border border-green-300/20 dark:border-green-500/10 rotate-45 animate-float-1" />
        <div className="absolute top-[25%] right-[12%] w-6 h-6 rounded-full border border-teal-300/20 dark:border-teal-500/10 animate-float-2" style={{ animationDelay: "-5s" }} />
        <div className="absolute bottom-[20%] left-[15%] w-10 h-10 rounded-full border-2 border-green-300/15 dark:border-green-500/8 animate-float-3" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-[30%] right-[8%] w-4 h-4 rounded-sm border border-emerald-300/20 dark:border-emerald-500/10 rotate-12 animate-float-4" style={{ animationDelay: "-7s" }} />
        <div className="absolute top-[60%] left-[5%] w-5 h-5 border border-teal-300/15 dark:border-teal-500/8 rounded-full animate-float-5" style={{ animationDelay: "-10s" }} />
      </div>

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
            <Sparkles className="h-3.5 w-3.5" />
            Data Kependudukan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-teal-500 to-green-600 dark:from-green-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent mb-3 animated-underline">
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
            {/* Connecting dotted lines between cards on desktop — overlay between card gaps */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 connecting-dots opacity-0" aria-hidden="true" />
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
