"use client";

import { useRef, useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  FileText,
  Baby,
  BarChart3,
  Clock,
  TrendingUp,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

// ─── Hardcoded Data ────────────────────────────────────────────────
const statsData = {
  totalPenduduk: 154320,
  ktpIssued: 138945,
  kkIssued: 42180,
  aktaIssued: 148760,
};

const kecamatanData = [
  { name: "Bajawa", populasi: 32450 },
  { name: "Aimere", populasi: 18920 },
  { name: "Ngada", populasi: 21340 },
  { name: "Riung", populasi: 15670 },
  { name: "Soa", populasi: 12340 },
  { name: "Golewa", populasi: 14560 },
  { name: "Jerebuu", populasi: 11230 },
  { name: "Bajawa Utara", populasi: 9870 },
  { name: "Bajawa Selatan", populasi: 8940 },
  { name: "Wolowae", populasi: 9200 },
  { name: "Mataloko", populasi: 8560 },
  { name: "Nangaroro", populasi: 7240 },
];

const genderData = { lakiLaki: 78420, perempuan: 75900 };

const ageDistribution = [
  { range: "0-14", label: "Anak-anak", persen: 28.5 },
  { range: "15-24", label: "Remaja", persen: 18.2 },
  { range: "25-34", label: "Dewasa Muda", persen: 16.8 },
  { range: "35-44", label: "Dewasa", persen: 13.5 },
  { range: "45-54", label: "Paruh Baya", persen: 10.2 },
  { range: "55-64", label: "Lansia Muda", persen: 7.1 },
  { range: "65+", label: "Lansia", persen: 5.7 },
];

const lastUpdated = "15 Desember 2024, 08:00 WITA";

// ─── Animated Number Component ─────────────────────────────────────
function AnimatedNumber({
  value,
  duration = 2,
  delay = 0,
}: {
  value: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);
  const hasStartedRef = useRef(false);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (inView && !hasStartedRef.current) {
      hasStartedRef.current = true;
      const timeout = setTimeout(() => {
        controlsRef.current = animate(motionVal, value, {
          duration,
          ease: "easeOut",
        });
        unsubRef.current = rounded.on("change", (v) => setDisplay(v));
      }, delay * 1000);

      return () => {
        clearTimeout(timeout);
        controlsRef.current?.stop();
        unsubRef.current?.();
      };
    }
  }, [inView, motionVal, rounded, value, duration, delay]);

  const formatted = new Intl.NumberFormat("id-ID").format(display);
  return (
    <span ref={ref} className="tabular-nums font-bold">
      {formatted}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/50 group-hover:via-teal-400/50 group-hover:to-emerald-400/50 transition-all duration-500 blur-sm opacity-0 group-hover:opacity-100" />
      <div className="relative rounded-xl p-5 bg-white dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/40 shadow-sm group-hover:shadow-lg transition-all duration-300">
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 shadow-md`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          <AnimatedNumber value={value} delay={delay + 0.3} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Bar Chart (Pure CSS) ──────────────────────────────────────────
function KecamatanBarChart() {
  const maxPop = Math.max(...kecamatanData.map((k) => k.populasi));
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/40 p-5 md:p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        Populasi per Kecamatan
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Data penduduk berdasarkan wilayah kecamatan
      </p>
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {kecamatanData.map((kec, i) => {
          const width = (kec.populasi / maxPop) * 100;
          return (
            <div key={kec.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-24 md:w-28 text-right flex-shrink-0 truncate">
                {kec.name}
              </span>
              <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-700/50 rounded-md overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : { width: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-md relative"
                >
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white whitespace-nowrap">
                    {new Intl.NumberFormat("id-ID").format(kec.populasi)}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Gender Donut (CSS conic-gradient) ─────────────────────────────
function GenderDonut() {
  const total = genderData.lakiLaki + genderData.perempuan;
  const lakiDeg = (genderData.lakiLaki / total) * 360;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/40 p-5 md:p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        Rasio Jenis Kelamin
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        Distribusi penduduk berdasarkan gender
      </p>

      <div className="flex flex-col items-center">
        {/* CSS Conic-Gradient Donut */}
        <motion.div
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          whileInView={{ rotate: -90, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-40 h-40 md:w-48 md:h-48 rounded-full"
          style={{
            background: `conic-gradient(
              #16a34a 0deg ${lakiDeg}deg,
              #0d9488 ${lakiDeg}deg 360deg
            )`,
          }}
        >
          {/* Center hole */}
          <div className="absolute inset-6 md:inset-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {((genderData.lakiLaki / genderData.perempuan) * 100).toFixed(0)}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-tight">
                Laki-laki per 100
                <br />
                Perempuan
              </p>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex gap-6 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Laki-laki
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Intl.NumberFormat("id-ID").format(genderData.lakiLaki)} (
                {((genderData.lakiLaki / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Perempuan
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Intl.NumberFormat("id-ID").format(genderData.perempuan)} (
                {((genderData.perempuan / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Age Distribution Bars ─────────────────────────────────────────
function AgeDistribution() {
  const maxPersen = Math.max(...ageDistribution.map((a) => a.persen));
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/40 p-5 md:p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        Distribusi Usia
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Komposisi penduduk berdasarkan kelompok usia
      </p>
      <div className="space-y-3">
        {ageDistribution.map((item, i) => {
          const width = (item.persen / maxPersen) * 100;
          return (
            <div key={item.range}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10">
                    {item.range}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {item.persen}%
                </span>
              </div>
              <div className="h-5 bg-gray-100 dark:bg-gray-700/50 rounded-md overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : { width: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-md ${
                    i % 2 === 0
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : "bg-gradient-to-r from-teal-500 to-teal-400"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────
export function StatistikInteraktifSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-transparent to-teal-50/40 dark:from-green-950/20 dark:via-transparent dark:to-teal-950/20" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-400/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-teal-400/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
            <BarChart3 className="h-4 w-4" />
            Statistik Interaktif
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Dashboard Kependudukan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Visualisasi data kependudukan Kabupaten Ngada secara interaktif
          </p>
        </motion.div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            value={statsData.totalPenduduk}
            label="Total Penduduk"
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={0}
          />
          <StatCard
            icon={CreditCard}
            value={statsData.ktpIssued}
            label="KTP-el Terbit"
            color="bg-gradient-to-br from-teal-500 to-teal-600"
            delay={0.1}
          />
          <StatCard
            icon={FileText}
            value={statsData.kkIssued}
            label="KK Terbit"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            delay={0.2}
          />
          <StatCard
            icon={Baby}
            value={statsData.aktaIssued}
            label="Akta Terbit"
            color="bg-gradient-to-br from-green-600 to-teal-500"
            delay={0.3}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <KecamatanBarChart />
          <div className="space-y-6">
            <GenderDonut />
            <AgeDistribution />
          </div>
        </div>

        {/* Last Updated */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 px-4 py-2 rounded-full border border-gray-200/60 dark:border-gray-700/40">
            <Clock className="h-3.5 w-3.5" />
            <span>Terakhir diperbarui: {lastUpdated}</span>
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(22, 163, 74, 0.3);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(45, 212, 191, 0.3);
        }
      `}</style>
    </section>
  );
}
