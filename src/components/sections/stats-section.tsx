"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Users, IdCard, MapPin, TrendingUp, ArrowRight, Loader2, BarChart3 } from "lucide-react";
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

// Animated stat card component
function AnimatedStatCard({
  icon: Icon,
  rawValue,
  formattedValue,
  label,
  description,
  color,
  bgColor,
  delay = 0,
  isAnimating,
  isPercent = false,
}: {
  icon: React.ElementType;
  rawValue: number;
  formattedValue: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
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
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-green-500/5 dark:hover:shadow-green-400/5 border border-white/60 dark:border-gray-700/50 transition-all duration-300 cursor-default group"
    >
      {/* Subtle gradient shimmer on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent dark:via-green-500/30 rounded-t-2xl" />
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4 ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent tabular-nums">
        {isAnimating ? displayValue : "0"}
      </p>
      <p className="font-semibold text-gray-700 dark:text-gray-200 mt-1">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
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
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/50",
      isPercent: false,
    },
    {
      icon: IdCard,
      rawValue: blankoEKTP?.jumlahTersedia || 0,
      formattedValue: formatNumber(blankoEKTP?.jumlahTersedia || 0),
      label: "Blanko E-KTP",
      description: blankoEKTP?.keterangan || "Tersedia saat ini",
      color: blankoEKTP && blankoEKTP.jumlahTersedia > 0 ? "text-teal-600" : "text-red-600",
      bgColor: blankoEKTP && blankoEKTP.jumlahTersedia > 0 ? "bg-teal-100 dark:bg-teal-900/50" : "bg-red-100 dark:bg-red-900/50",
      isPercent: false,
    },
    {
      icon: MapPin,
      rawValue: 12,
      formattedValue: "12",
      label: "Kecamatan",
      description: "Wilayah Layanan",
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/50",
      isPercent: false,
    },
    {
      icon: TrendingUp,
      rawValue: cakupanAktaRaw,
      formattedValue: `${dokumen?.cakupanAkta?.toFixed(1) || "0"}%`,
      label: "Cakupan Akta",
      description: "Akta Kelahiran",
      color: "text-rose-600",
      bgColor: "bg-rose-100 dark:bg-rose-900/50",
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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Ringkasan Data Kependudukan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Data kependudukan Kabupaten Ngada berdasarkan periode terbaru
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative">
            {/* Decorative dividers between cards (desktop) */}
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[25%] w-px h-3/4 bg-gradient-to-b from-transparent via-green-300/30 dark:via-green-600/20 to-transparent" />
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[50%] w-px h-3/4 bg-gradient-to-b from-transparent via-teal-300/30 dark:via-teal-600/20 to-transparent" />
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[75%] w-px h-3/4 bg-gradient-to-b from-transparent via-emerald-300/30 dark:via-emerald-600/20 to-transparent" />
            {stats.map((stat, index) => (
              <AnimatedStatCard
                key={index}
                icon={stat.icon}
                rawValue={stat.rawValue}
                formattedValue={stat.formattedValue}
                label={stat.label}
                description={stat.description}
                color={stat.color}
                bgColor={stat.bgColor}
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
