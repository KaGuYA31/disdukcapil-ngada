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
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-shadow cursor-default"
    >
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
        {isAnimating ? displayValue : "0"}
      </p>
      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{label}</p>
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
    <section ref={sectionRef} className="py-12 md:py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2315803d' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l2 3.5-2 3zm0-18V0h20v2H20v2l-2-3.5 2-3z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-gray-900 via-gray-50/80 dark:via-gray-900/80 to-gray-100 dark:to-gray-800" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 mb-3">
            <BarChart3 className="h-4 w-4" />
            Data Kependudukan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Ringkasan Statistik
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            Lihat Statistik Lengkap
            <ArrowRight className="h-4 w-4" />
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
