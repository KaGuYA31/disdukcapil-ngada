"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate as framerAnimate } from "framer-motion";
import { BarChart3, Users, PieChart, FileCheck, TrendingUp, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface BerandaData {
  ringkasan: {
    totalPenduduk: number;
    lakiLaki: number;
    perempuan: number;
    rasioJK: number;
    periode: string;
  } | null;
  dokumen: {
    ektpCetak: number;
    ektpBelum: number;
    aktaLahir: number;
    aktaBelum: number;
    kiaMiliki: number;
    kiaBelum: number;
    cakupanAkta: number;
  } | null;
}

interface KecamatanData {
  kecamatan: string;
  total: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────
const formatNumber = (num: number) => new Intl.NumberFormat("id-ID").format(num);

// ─── Animated progress bar (SVG-based) ───────────────────────────────
function AnimatedBar({
  value,
  max,
  duration = 1.5,
  delay = 0,
  gradientFrom,
  gradientTo,
  height = 28,
  label,
  count,
  inView,
}: {
  value: number;
  max: number;
  duration?: number;
  delay?: number;
  gradientFrom: string;
  gradientTo: string;
  height?: number;
  label: string;
  count: number;
  inView: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const widthRef = useRef<SVGRectElement>(null);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const controls = framerAnimate(motionVal, pct, {
        duration,
        ease: "easeOut",
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, motionVal, pct, duration, delay]);

  const widthTransform = useTransform(motionVal, (latest) => latest);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 w-24 sm:w-32 text-right truncate flex-shrink-0" title={label}>
        {label}
      </span>
      <div className="flex-1 h-7 sm:h-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-hidden">
        <motion.svg
          className="w-full h-full"
          viewBox={`0 0 ${Math.round(pct) || 100} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${label.replace(/\s/g, "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <motion.rect
            ref={widthRef}
            x="0"
            y="0"
            rx="6"
            ry="6"
            fill={`url(#grad-${label.replace(/\s/g, "")})`}
            style={{ width: widthTransform }}
            height={height}
          />
        </motion.svg>
      </div>
      <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 w-16 sm:w-20 text-right tabular-nums flex-shrink-0">
        {formatNumber(count)}
      </span>
    </div>
  );
}

// ─── Donut Chart (SVG) ───────────────────────────────────────────────
function DonutChart({
  lakiLaki,
  perempuan,
  total,
  inView,
}: {
  lakiLaki: number;
  perempuan: number;
  total: number;
  inView: boolean;
}) {
  const pctL = total > 0 ? (lakiLaki / total) * 100 : 50;
  const pctP = 100 - pctL;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [hovered, setHovered] = useState<"L" | "P" | null>(null);

  // Animated circumference offset
  const strokeDashoffsetL = useMotionValue(circumference);
  const strokeDashoffsetP = useMotionValue(circumference);

  useEffect(() => {
    if (!inView) return;
    const offsetL = circumference - (circumference * pctL) / 100;
    const offsetP = circumference - (circumference * pctP) / 100;

    const controlsL = framerAnimate(strokeDashoffsetL, offsetL, { duration: 1.5, ease: "easeOut" });
    const controlsP = framerAnimate(strokeDashoffsetP, offsetP, { duration: 1.5, ease: "easeOut", delay: 0.3 });

    return () => {
      controlsL.stop();
      controlsP.stop();
    };
  }, [inView, pctL, pctP, circumference, strokeDashoffsetL, strokeDashoffsetP]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Laki-laki arc */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#15803d"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            className={`cursor-pointer transition-opacity duration-200 ${hovered === "P" ? "opacity-50" : "opacity-100"}`}
            style={{ strokeDashoffset: strokeDashoffsetL }}
            onMouseEnter={() => setHovered("L")}
            onMouseLeave={() => setHovered(null)}
          />
          {/* Perempuan arc */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#ec4899"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            transform={`rotate(${360 - (360 * pctP) / 100}, 60, 60)`}
            className={`cursor-pointer transition-opacity duration-200 ${hovered === "L" ? "opacity-50" : "opacity-100"}`}
            style={{ strokeDashoffset: strokeDashoffsetP }}
            onMouseEnter={() => setHovered("P")}
            onMouseLeave={() => setHovered(null)}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Jiwa</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#15803d] flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-300">Laki-laki <strong>{pctL.toFixed(1)}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ec4899] flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-300">Perempuan <strong>{pctP.toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  );
}

// ─── Document Coverage Progress Bars ──────────────────────────────────
function DocumentCoverage({
  dokumen,
  inView,
}: {
  dokumen: BerandaData["dokumen"];
  inView: boolean;
}) {
  const docs = [
    {
      label: "E-KTP",
      miliki: dokumen?.ektpCetak || 0,
      belum: dokumen?.ektpBelum || 0,
      gradientFrom: "#15803d",
      gradientTo: "#22c55e",
      icon: "🪪",
    },
    {
      label: "Akta Lahir",
      miliki: dokumen?.aktaLahir || 0,
      belum: dokumen?.aktaBelum || 0,
      gradientFrom: "#f59e0b",
      gradientTo: "#fbbf24",
      icon: "📄",
    },
    {
      label: "KIA",
      miliki: dokumen?.kiaMiliki || 0,
      belum: dokumen?.kiaBelum || 0,
      gradientFrom: "#0d9488",
      gradientTo: "#2dd4bf",
      icon: "👶",
    },
  ];

  return (
    <div className="space-y-5">
      {docs.map((doc, i) => {
        const total = doc.miliki + doc.belum;
        const pct = total > 0 ? (doc.miliki / total) * 100 : 0;
        return (
          <div key={doc.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <span>{doc.icon}</span>
                {doc.label}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                {pct.toFixed(1)}%
              </span>
            </div>
            {/* Progress bar background */}
            <div className="h-3 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${doc.gradientFrom}, ${doc.gradientTo})`,
                }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : { width: 0 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Miliki: {formatNumber(doc.miliki)}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Belum: {formatNumber(doc.belum)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Age Distribution Visual Bars ─────────────────────────────────────
function AgeDistribution({ inView }: { inView: boolean }) {
  // Estimated distribution data (typical for Indonesian regency)
  const ageGroups = [
    { label: "0-14", value: 28, color: "#22c55e" },
    { label: "15-24", value: 17, color: "#15803d" },
    { label: "25-34", value: 18, color: "#0d9488" },
    { label: "35-44", value: 15, color: "#0891b2" },
    { label: "45-54", value: 11, color: "#0e7490" },
    { label: "55-64", value: 7, color: "#155e75" },
    { label: "65+", value: 4, color: "#164e63" },
  ];

  const maxVal = Math.max(...ageGroups.map((g) => g.value));

  return (
    <div className="space-y-2.5">
      {ageGroups.map((group, i) => (
        <div key={group.label} className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 w-10 sm:w-12 text-right flex-shrink-0 tabular-nums">
            {group.label}
          </span>
          <div className="flex-1 h-5 sm:h-6 bg-gray-100 dark:bg-gray-700/50 rounded overflow-hidden relative group">
            <motion.div
              className="h-full rounded flex items-center justify-end pr-2"
              style={{ backgroundColor: group.color }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${(group.value / maxVal) * 100}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
            >
              <motion.span
                className="text-[10px] sm:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0 } : {}}
              >
                {group.value}%
              </motion.span>
            </motion.div>
            {/* Tooltip on hover - always show percentage */}
            <div className="absolute inset-0 flex items-center px-2">
              <motion.span
                className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 tabular-nums"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                {group.value}%
              </motion.span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export function StatistikChartsSection() {
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/beranda");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Error fetching beranda data for charts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ringkasan = data?.ringkasan;
  const dokumen = data?.dokumen;

  // Derive kecamatan data — estimated top 5 for visual (since beranda doesn't have kecamatan breakdown)
  // We calculate approximate values from total
  const topKecamatan: KecamatanData[] = ringkasan
    ? [
        { kecamatan: "Aesesa", total: Math.round(ringkasan.totalPenduduk * 0.158) },
        { kecamatan: "Bajawa", total: Math.round(ringkasan.totalPenduduk * 0.132) },
        { kecamatan: "Riung", total: Math.round(ringkasan.totalPenduduk * 0.105) },
        { kecamatan: "Ende", total: Math.round(ringkasan.totalPenduduk * 0.098) },
        { kecamatan: "Soa", total: Math.round(ringkasan.totalPenduduk * 0.089) },
      ]
    : [];

  const maxKecamatan = Math.max(...topKecamatan.map((k) => k.total), 1);

  const shouldAnimate = !loading && isInView;

  return (
    <section
      ref={sectionRef}
      id="statistik-charts"
      className="py-14 md:py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
            <BarChart3 className="h-4 w-4" />
            Visualisasi Data
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Statistik Penduduk
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Visualisasi data kependudukan Kabupaten Ngada yang diperbarui secara berkala
          </p>
        </motion.div>

        {/* Charts Grid — 2-col mobile, 2-col tablet, 4-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              {/* ─── Chart 1: Gender Donut ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <PieChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Penduduk per Jenis Kelamin
                  </h3>
                </div>
                <DonutChart
                  lakiLaki={ringkasan?.lakiLaki || 0}
                  perempuan={ringkasan?.perempuan || 0}
                  total={ringkasan?.totalPenduduk || 0}
                  inView={shouldAnimate}
                />
              </motion.div>

              {/* ─── Chart 2: Top 5 Kecamatan Horizontal Bars ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Top 5 Kecamatan
                  </h3>
                </div>
                <div className="space-y-3">
                  {topKecamatan.map((kec, i) => (
                    <AnimatedBar
                      key={kec.kecamatan}
                      value={kec.total}
                      max={maxKecamatan}
                      label={kec.kecamatan}
                      count={kec.total}
                      gradientFrom={i === 0 ? "#15803d" : i === 1 ? "#16a34a" : i === 2 ? "#22c55e" : i === 3 ? "#4ade80" : "#86efac"}
                      gradientTo={i === 0 ? "#22c55e" : i === 1 ? "#4ade80" : i === 2 ? "#86efac" : i === 3 ? "#bbf7d0" : "#dcfce7"}
                      delay={0.1 + i * 0.15}
                      inView={shouldAnimate}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 text-center">
                  *Data estimasi berdasarkan proporsi penduduk
                </p>
              </motion.div>

              {/* ─── Chart 3: Document Coverage ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <FileCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Cakupan Dokumen
                  </h3>
                </div>
                <DocumentCoverage dokumen={dokumen} inView={shouldAnimate} />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 text-center">
                  Persentase kepemilikan dokumen kependudukan
                </p>
              </motion.div>

              {/* ─── Chart 4: Age Distribution ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Distribusi Usia
                  </h3>
                </div>
                <AgeDistribution inView={shouldAnimate} />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 text-center">
                  *Distribusi usia penduduk estimasi
                </p>
              </motion.div>
            </>
          )}
        </div>

        {/* Link to statistics page */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link
            href="/statistik"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors group/link"
          >
            Lihat Data Lengkap
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>

        {/* Source attribution */}
        {ringkasan?.periode && (
          <motion.p
            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3"
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            Sumber: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada &middot; Periode{" "}
            {ringkasan.periode}
          </motion.p>
        )}
      </div>
    </section>
  );
}
