"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Building2,
  LandPlot,
  ArrowUpRight,
  X,
  ChevronRight,
  Crown,
  Activity,
  MapPinned,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Kecamatan Data (Realistic estimates for Kabupaten Ngada, total ~171K) ──
interface KecamatanData {
  id: string;
  name: string;
  population: number;
  desaCount: number;
  area: number; // km²
  density: number; // jiwa/km²
  isCapital?: boolean;
  region: string;
}

const kecamatanList: KecamatanData[] = [
  { id: "bajawa", name: "Bajawa", population: 42350, desaCount: 12, area: 148, density: 286, isCapital: true, region: "Pusat" },
  { id: "bajawa-utara", name: "Bajawa Utara", population: 12450, desaCount: 8, area: 92, density: 135, region: "Utara" },
  { id: "bajawa-selatan", name: "Bajawa Selatan", population: 11280, desaCount: 7, area: 85, density: 133, region: "Selatan" },
  { id: "soa", name: "Soa", population: 14620, desaCount: 9, area: 108, density: 135, region: "Timur" },
  { id: "ngada", name: "Ngada", population: 10850, desaCount: 7, area: 96, density: 113, region: "Barat" },
  { id: "aimere", name: "Aimere", population: 13740, desaCount: 8, area: 102, density: 135, region: "Selatan" },
  { id: "riung", name: "Riung", population: 15890, desaCount: 11, area: 195, density: 81, region: "Utara" },
  { id: "riung-barat", name: "Riung Barat", population: 8320, desaCount: 6, area: 164, density: 51, region: "Utara" },
  { id: "wolowae", name: "Wolowae", population: 16410, desaCount: 10, area: 142, density: 116, region: "Timur" },
  { id: "jerebuu", name: "Jerebuu", population: 9560, desaCount: 6, area: 78, density: 123, region: "Barat" },
  { id: "golewa", name: "Golewa", population: 10130, desaCount: 7, area: 89, density: 114, region: "Selatan" },
  { id: "golewa-barat", name: "Golewa Barat", population: 5400, desaCount: 5, area: 112, density: 48, region: "Selatan" },
];

const totalPopulation = kecamatanList.reduce((sum, k) => sum + k.population, 0);
const mostPopulous = kecamatanList.reduce((a, b) => (a.population > b.population ? a : b));
const avgPopulation = Math.round(totalPopulation / kecamatanList.length);
const maxDensity = Math.max(...kecamatanList.map((k) => k.density));
const minDensity = Math.min(...kecamatanList.map((k) => k.density));

const formatNumber = (num: number) => new Intl.NumberFormat("id-ID").format(num);

// ─── Animated Counter Hook ──
function useAnimatedCounter(target: number, duration: number = 2000, isActive: boolean = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, target, duration]);

  return count;
}

// ─── Get color based on density ──
function getDensityColor(density: number): { bg: string; text: string; border: string; glow: string; bar: string } {
  const ratio = (density - minDensity) / (maxDensity - minDensity || 1);
  if (ratio > 0.75) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-300 dark:border-emerald-700",
      glow: "shadow-emerald-500/20",
      bar: "from-emerald-400 to-emerald-600",
    };
  }
  if (ratio > 0.5) {
    return {
      bg: "bg-teal-50 dark:bg-teal-900/30",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-300 dark:border-teal-700",
      glow: "shadow-teal-500/20",
      bar: "from-teal-400 to-teal-600",
    };
  }
  if (ratio > 0.25) {
    return {
      bg: "bg-green-50 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-700",
      glow: "shadow-green-500/20",
      bar: "from-green-400 to-green-600",
    };
  }
  return {
    bg: "bg-gray-50 dark:bg-gray-800/30",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-300 dark:border-gray-600",
    glow: "shadow-gray-400/10",
    bar: "from-gray-400 to-gray-500",
  };
}

// ─── Get size class based on population ──
function getSizeClass(population: number): string {
  const maxPop = Math.max(...kecamatanList.map((k) => k.population));
  const minPop = Math.min(...kecamatanList.map((k) => k.population));
  const ratio = (population - minPop) / (maxPop - minPop || 1);
  if (ratio > 0.75) return "md:col-span-1 md:row-span-1";
  if (ratio > 0.5) return "md:col-span-1 md:row-span-1";
  return "md:col-span-1 md:row-span-1";
}

// ─── Animation Variants ──
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
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
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const nodeItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const statsItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Glass Card Wrapper ──
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`relative border-white/60 dark:border-gray-700/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-gray-800/50 backdrop-blur-md overflow-hidden group ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-400/40 via-emerald-400/60 to-teal-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </Card>
  );
}

// ─── Kecamatan Node Card ──
function KecamatanNode({
  kec,
  index,
  inView,
  isSelected,
  onClick,
}: {
  kec: KecamatanData;
  index: number;
  inView: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const colors = getDensityColor(kec.density);
  const isMostPopulous = kec.id === mostPopulous.id;

  return (
    <motion.div
      variants={nodeItem}
      className={`${getSizeClass(kec.population)} relative`}
    >
      {/* Connecting dot above card */}
      {index > 0 && (
        <motion.div
          className="hidden md:block absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-400/40 dark:bg-green-500/30 z-10"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
        />
      )}

      {/* Vertical connecting line */}
      {index > 0 && (
        <motion.div
          className="hidden md:block absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-green-300/30 to-green-400/50 dark:from-green-500/20 dark:to-green-400/30 z-10"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
        />
      )}

      {/* Pulse ring for most populous */}
      {isMostPopulous && (
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 animate-icon-pulse-ring pointer-events-none" />
      )}

      <motion.button
        onClick={onClick}
        className={`relative w-full text-left rounded-xl p-3 md:p-4 border transition-all duration-300 cursor-pointer
          ${colors.bg} ${colors.border}
          ${isSelected
            ? `ring-2 ring-green-500 dark:ring-green-400 shadow-lg ${colors.glow} scale-[1.02]`
            : `hover:scale-[1.02] hover:shadow-md ${colors.glow}`
          }
        `}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Capital badge */}
        {kec.isCapital && (
          <div className="absolute -top-2 -right-2 z-20">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold shadow-md">
              <Crown className="h-2.5 w-2.5" />
              Ibukota
            </span>
          </div>
        )}

        {/* Region badge */}
        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider ${colors.text} mb-1.5 opacity-70`}>
          {kec.region}
        </span>

        {/* Kecamatan name */}
        <h3 className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-green-500 dark:text-green-400" />
          {kec.name}
        </h3>

        {/* Population bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              <Users className="h-3 w-3 inline mr-0.5" />
              Penduduk
            </span>
            <motion.span
              className={`text-xs font-bold ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.08 }}
            >
              {formatNumber(kec.population)}
            </motion.span>
          </div>
          <div className="h-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`}
              initial={{ width: 0 }}
              animate={inView ? { width: `${(kec.population / mostPopulous.population) * 100}%` } : {}}
              transition={{ duration: 1, delay: 0.5 + index * 0.08, ease: "easeOut" as const }}
            />
          </div>
        </div>

        {/* Mini stats row */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-0.5">
            <Building2 className="h-2.5 w-2.5" />
            {kec.desaCount} Desa
          </span>
          <span className="flex items-center gap-0.5">
            <LandPlot className="h-2.5 w-2.5" />
            {formatNumber(kec.area)} km²
          </span>
        </div>

        {/* Expand indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className={`h-3.5 w-3.5 ${colors.text}`} />
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─── Detail Card ──
function KecamatanDetailCard({
  kec,
  onClose,
}: {
  kec: KecamatanData | null;
  onClose: () => void;
}) {
  const colors = kec ? getDensityColor(kec.density) : null;
  const popPercentage = kec ? ((kec.population / totalPopulation) * 100).toFixed(1) : "0";

  if (!kec || !colors) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={kec.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="col-span-full lg:col-span-2"
      >
        <div className={`rounded-2xl p-5 md:p-6 border-2 ${colors.border} ${colors.bg} backdrop-blur-md relative overflow-hidden`}>
          {/* Gradient background decoration */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.bar.replace("from-", "from-").replace("to-", "to-")} opacity-5 rounded-full blur-3xl`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm z-10"
            aria-label="Tutup detail"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bar} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <MapPinned className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {kec.name}
                  </h3>
                  {kec.isCapital && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] border-0 gap-1">
                      <Crown className="h-3 w-3" />
                      Ibukota
                    </Badge>
                  )}
                  <Badge variant="outline" className={`${colors.border} ${colors.text} text-[10px]`}>
                    {kec.region}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Kecamatan di Kabupaten Ngada, NTT
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center border border-gray-200/40 dark:border-gray-700/40">
                <Users className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {formatNumber(kec.population)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Penduduk</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center border border-gray-200/40 dark:border-gray-700/40">
                <Building2 className="h-4 w-4 text-teal-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {kec.desaCount}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Desa/Kelurahan</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center border border-gray-200/40 dark:border-gray-700/40">
                <LandPlot className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {formatNumber(kec.area)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Luas (km²)</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center border border-gray-200/40 dark:border-gray-700/40">
                <Activity className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {kec.density}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Jiwa/km²</p>
              </div>
            </div>

            {/* Population share bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Kontribusi Penduduk
                </span>
                <span className={`text-xs font-bold ${colors.text}`}>
                  {popPercentage}% dari total
                </span>
              </div>
              <div className="h-2.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${popPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" as const }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Statistics Sidebar ──
function StatisticsSidebar({ inView }: { inView: boolean }) {
  const animTotal = useAnimatedCounter(totalPopulation, 2000, inView);
  const animAvg = useAnimatedCounter(avgPopulation, 2000, inView);

  return (
    <motion.div variants={statsItem} className="space-y-4">
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Activity className="h-4 w-4 text-white" />
            </div>
            Statistik Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Population */}
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 border border-green-200/50 dark:border-green-800/30">
            <p className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-1">
              Total Penduduk
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFeatureSettings: '"tnum"' }}>
              {inView ? formatNumber(animTotal) : "0"}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">12 Kecamatan</p>
          </div>

          {/* Most Populous */}
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Terpadat
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{mostPopulous.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {formatNumber(mostPopulous.population)} jiwa &bull; {mostPopulous.density} jiwa/km²
            </p>
          </div>

          {/* Average Population */}
          <div className="rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-3 border border-teal-200/50 dark:border-teal-800/30">
            <p className="text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold mb-1">
              Rata-rata / Kecamatan
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100" style={{ fontFeatureSettings: '"tnum"' }}>
              {inView ? formatNumber(animAvg) : "0"}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">jiwa per kecamatan</p>
          </div>

          {/* Largest Area */}
          {(() => {
            const largestArea = kecamatanList.reduce((a, b) => (a.area > b.area ? a : b));
            return (
              <div className="rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-3 border border-violet-200/50 dark:border-violet-800/30">
                <p className="text-[10px] uppercase tracking-wider text-violet-600 dark:text-violet-400 font-semibold mb-1 flex items-center gap-1">
                  <LandPlot className="h-3 w-3" />
                  Wilayah Terluas
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{largestArea.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatNumber(largestArea.area)} km² &bull; {largestArea.desaCount} desa
                </p>
              </div>
            );
          })()}

          {/* Density Legend */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Legenda Kepadatan
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Tinggi", color: "bg-emerald-400", range: `> ${Math.round(maxDensity * 0.75)} jiwa/km²` },
                { label: "Sedang-Tinggi", color: "bg-teal-400", range: `${Math.round(maxDensity * 0.5)}-${Math.round(maxDensity * 0.75)}` },
                { label: "Sedang", color: "bg-green-400", range: `${Math.round(maxDensity * 0.25)}-${Math.round(maxDensity * 0.5)}` },
                { label: "Rendah", color: "bg-gray-400", range: `< ${Math.round(maxDensity * 0.25)} jiwa/km²` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${item.color} flex-shrink-0`} />
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium flex-1">{item.label}</span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Expanded View (Full-screen overlay) ──
function ExpandedMapView({
  isOpen,
  onClose,
  inView,
  selectedKec,
  setSelectedKec,
}: {
  isOpen: boolean;
  onClose: () => void;
  inView: boolean;
  selectedKec: KecamatanData | null;
  setSelectedKec: (kec: KecamatanData | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="font-bold text-gray-800 dark:text-gray-100">Peta Kecamatan — Tampilan Penuh</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-1.5 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
              >
                <Minimize2 className="h-4 w-4" />
                Perkecil
              </Button>
            </div>
          </div>

          {/* Expanded grid - more columns */}
          <div className="container mx-auto px-4 py-8">
            {selectedKec && (
              <KecamatanDetailCard
                kec={selectedKec}
                onClose={() => setSelectedKec(null)}
              />
            )}

            <div className="mt-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {kecamatanList.map((kec, i) => (
                  <KecamatanNode
                    key={kec.id}
                    kec={kec}
                    index={i}
                    inView={inView}
                    isSelected={selectedKec?.id === kec.id}
                    onClick={() =>
                      setSelectedKec(selectedKec?.id === kec.id ? null : kec)
                    }
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Skeleton Loader ──
export function PetaKecamatanSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-teal-50/20 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800" />
      <div className="container mx-auto px-4 relative">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="h-4 w-40 bg-gray-200/60 dark:bg-gray-700/40 rounded-md mx-auto mb-3" />
          <div className="h-10 w-72 bg-gray-200/60 dark:bg-gray-700/40 rounded-lg mx-auto mb-3" />
          <div className="h-4 w-64 bg-gray-200/40 dark:bg-gray-700/30 rounded-md mx-auto" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
            ))}
          </div>
          <div className="h-80 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ──
export function PetaKecamatanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [selectedKec, setSelectedKec] = useState<KecamatanData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNodeClick = useCallback(
    (kec: KecamatanData) => {
      setSelectedKec((prev) => (prev?.id === kec.id ? null : kec));
    },
    []
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="py-16 md:py-24 relative overflow-hidden"
        aria-labelledby="peta-kecamatan-title"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-teal-50/20 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800" />

        {/* Animated background orbs */}
        <motion.div
          className="absolute top-16 left-8 w-72 h-72 bg-green-200/15 dark:bg-green-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-8 w-80 h-80 bg-teal-200/15 dark:bg-teal-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-60 h-60 bg-emerald-200/10 dark:bg-emerald-900/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%230f766e'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative">
          {/* ─── Section Header ─── */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
              <MapPin className="h-4 w-4" />
              Peta Interaktif Kecamatan
            </span>
            <h2
              id="peta-kecamatan-title"
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
            >
              Peta Interaktif Kecamatan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Jelajahi 12 kecamatan di Kabupaten Ngada dengan data kependudukan terkini
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge
                variant="outline"
                className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 text-xs font-medium gap-1.5"
              >
                <MapPinned className="h-3 w-3" />
                12 Kecamatan
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium"
              >
                Total {formatNumber(totalPopulation)} Jiwa
              </Badge>
              <Badge
                variant="outline"
                className="border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 text-xs font-medium"
              >
                Data Estimasi 2024
              </Badge>
            </div>
          </motion.div>

          {/* ─── Main Layout: Map Grid + Stats Sidebar ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Map Grid */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              {/* Expanded view button */}
              <div className="flex items-center justify-between mb-4">
                <motion.p
                  className="text-xs text-gray-500 dark:text-gray-400 font-medium"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Klik kecamatan untuk melihat detail
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="gap-1.5 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Tampilan Penuh
                  </Button>
                </motion.div>
              </div>

              {/* Detail Card (appears when a kecamatan is selected) */}
              <AnimatePresence>
                {selectedKec && (
                  <div className="mb-4">
                    <KecamatanDetailCard
                      kec={selectedKec}
                      onClose={() => setSelectedKec(null)}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Kecamatan Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
              >
                {kecamatanList.map((kec, i) => (
                  <KecamatanNode
                    key={kec.id}
                    kec={kec}
                    index={i}
                    inView={isInView}
                    isSelected={selectedKec?.id === kec.id}
                    onClick={() => handleNodeClick(kec)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Statistics Sidebar */}
            <div className="order-1 lg:order-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <StatisticsSidebar inView={isInView} />
              </motion.div>
            </div>
          </div>

          {/* ─── Footer note ─── */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Sumber: Data estimasi berdasarkan registrasi kependudukan Kabupaten Ngada, Provinsi Nusa Tenggara Timur
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expanded Map View Overlay */}
      <ExpandedMapView
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        inView={isInView}
        selectedKec={selectedKec}
        setSelectedKec={setSelectedKec}
      />
    </>
  );
}
