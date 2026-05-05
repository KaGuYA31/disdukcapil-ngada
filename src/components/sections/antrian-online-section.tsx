"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  Hash,
  Ticket,
  Timer,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Coffee,
  UsersRound,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────

interface LoketStatus {
  id: number;
  nama: string;
  status: "aktif" | "istirahat" | "tutup";
  antrianSedangDilayani: string;
  jumlahDilayani: number;
}

interface QueueData {
  nomorSekarang: number;
  totalDilayani: number;
  sisaAntrian: number;
  rataRataTunggu: number;
  estimasiTungguAnda: number;
  lastUpdated: string;
}

// ─── Animation Variants ───────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const floatOrb = {
  animate: (delay: number) => ({
    y: [0, -18, 0],
    x: [0, 12, 0],
    scale: [1, 1.08, 1],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  }),
};

const pulseDot = {
  animate: {
    scale: [1, 1.6, 1],
    opacity: [0.5, 0, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ─── Helper: Generate simulated queue data ────────────────────────────

function generateQueueData(): QueueData {
  const totalDilayani = Math.floor(Math.random() * 80) + 60;
  const nomorSekarang = totalDilayani + 1;
  const sisaAntrian = Math.floor(Math.random() * 15) + 5;
  const rataRataTunggu = Math.floor(Math.random() * 10) + 15;
  const estimasiTungguAnda = sisaAntrian * rataRataTunggu;

  return {
    nomorSekarang,
    totalDilayani,
    sisaAntrian,
    rataRataTunggu,
    estimasiTungguAnda,
    lastUpdated: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

const INITIAL_LOKET: LoketStatus[] = [
  { id: 1, nama: "Loket 1 - KTP-el", status: "aktif", antrianSedangDilayani: "A-087", jumlahDilayani: 42 },
  { id: 2, nama: "Loket 2 - KK & Akta", status: "istirahat", antrianSedangDilayani: "B-056", jumlahDilayani: 38 },
  { id: 3, nama: "Loket 3 - Pindah & Lainnya", status: "tutup", antrianSedangDilayani: "-", jumlahDilayani: 0 },
];

// ─── Animated Counter ─────────────────────────────────────────────────

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(value);

  useEffect(() => {
    const diff = value - prevValue.current;
    if (diff === 0) return;

    const duration = 600;
    const startTime = Date.now();
    const startVal = prevValue.current;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

// ─── Loket Status Card ────────────────────────────────────────────────

function LoketCard({ loket }: { loket: LoketStatus }) {
  const statusConfig = {
    aktif: {
      color: "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      label: "Aktif",
      dotColor: "bg-emerald-500",
    },
    istirahat: {
      color: "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50",
      icon: <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      label: "Istirahat",
      dotColor: "bg-amber-500",
    },
    tutup: {
      color: "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30",
      badge: "bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50",
      icon: <XCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />,
      label: "Tutup",
      dotColor: "bg-gray-400",
    },
  };

  const cfg = statusConfig[loket.status];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      <div className={`rounded-xl p-4 border ${cfg.color} transition-all duration-300 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                {loket.status === "aktif" && (
                  <>
                    <motion.span
                      variants={pulseDot}
                      animate="animate"
                      className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    />
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  </>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dotColor}`} />
              </span>
              {cfg.icon}
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {loket.nama}
            </span>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Badge className={`${cfg.badge} text-[10px] px-2 py-0.5`}>
              {cfg.label}
            </Badge>
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
              Sedang Dilayani
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums mt-0.5">
              {loket.antrianSedangDilayani}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
              Total Hari Ini
            </p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400 tabular-nums mt-0.5">
              {loket.jumlahDilayani}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function AntrianOnlineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [queueData, setQueueData] = useState<QueueData>(generateQueueData);
  const [loketList, setLoketList] = useState<LoketStatus[]>(INITIAL_LOKET);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [yourQueueNumber, setYourQueueNumber] = useState<string | null>(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-refresh simulation every 30 seconds
  const simulateRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQueueData((prev) => {
        const newTotal = prev.totalDilayani + Math.floor(Math.random() * 3) + 1;
        const newSisa = Math.max(0, prev.sisaAntrian - Math.floor(Math.random() * 2));
        return {
          ...prev,
          nomorSekarang: newTotal + 1,
          totalDilayani: newTotal,
          sisaAntrian: newSisa,
          estimasiTungguAnda: newSisa * prev.rataRataTunggu,
          lastUpdated: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
      });

      // Occasionally change loket status
      setLoketList((prev) =>
        prev.map((l) => {
          if (l.status === "tutup") return l;
          if (Math.random() > 0.85) {
            const newStatus = l.status === "aktif" ? "istirahat" : "aktif";
            return { ...l, status: newStatus };
          }
          if (l.status === "aktif") {
            return { ...l, jumlahDilayani: l.jumlahDilayani + 1 };
          }
          return l;
        })
      );

      setIsRefreshing(false);
      setTimeSinceUpdate(0);
    }, 800);
  }, []);

  useEffect(() => {
    refreshTimerRef.current = setInterval(simulateRefresh, 30000);
    tickTimerRef.current = setInterval(() => {
      setTimeSinceUpdate((prev) => prev + 1);
    }, 1000);
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    };
  }, [simulateRefresh]);

  const handleAmbilNomor = useCallback(() => {
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 3)); // A, B, or C
    const number = queueData.nomorSekarang + Math.floor(Math.random() * 5) + 1;
    const nomorAntrian = `${prefix}-${String(number).padStart(3, "0")}`;
    setYourQueueNumber(nomorAntrian);
    toast.success(`Nomor antrian Anda: ${nomorAntrian}`, {
      description: "Silakan menunggu nomor antrian Anda dipanggil. Terima kasih!",
      duration: 6000,
    });
  }, [queueData.nomorSekarang]);

  const formatEstimasi = (minutes: number): string => {
    if (minutes < 60) return `~${minutes} menit`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `~${h} jam ${m} menit` : `~${h} jam`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((queueData.totalDilayani) / (queueData.totalDilayani + queueData.sisaAntrian)) * 100)
  );

  return (
    <section
      ref={sectionRef}
      className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      aria-labelledby="antrian-online-title"
    >
      {/* ── Gradient Hero Banner ── */}
      <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
        {/* SVG Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0L26 14L14 26L2 14Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Animated gradient orbs */}
        <motion.div
          custom={0}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute top-2 left-1/4 w-44 h-44 bg-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          custom={1.5}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute bottom-0 right-1/4 w-52 h-52 bg-teal-400/15 rounded-full blur-3xl"
        />
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <UsersRound className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Status Antrian Real-Time
              </h1>
              <p className="text-green-200/80 text-sm mt-0.5">
                Pantau status antrian pelayanan Disdukcapil Kabupaten Ngada secara langsung
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2315803d' stroke-width='0.5' fill='none'%3E%3Crect x='10' y='10' width='40' height='40' rx='4'/%3E%3Crect x='20' y='20' width='20' height='20' rx='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-amber-100/20 dark:bg-amber-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative py-16 md:py-24">
        {/* Section Header (below hero) */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Ambil nomor antrian tanpa perlu datang ke kantor.
          </p>
        </motion.div>

        {/* Main Queue Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Big Queue Number + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Queue Number - Big Card with animated gradient border */}
            <motion.div variants={cardVariants} className="lg:col-span-1">
              <div className="relative p-[2px] rounded-2xl overflow-hidden">
                {/* Animated rotating conic gradient border */}
                <div className="absolute inset-0 animate-[spin_4s_linear_infinite]" style={{
                  background: "conic-gradient(from 0deg, #22c55e, #14b8a6, #0d9488, #059669, #22c55e)",
                }} />
                <Card className="relative overflow-hidden h-full rounded-[14px]">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500" />
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                    {/* Live status indicator */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <motion.span
                        variants={pulseDot}
                        animate="animate"
                        className="inline-flex h-2 w-2 rounded-full bg-green-500"
                      />
                      <span className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-bold">
                        Live
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      Nomor Antrian Saat Ini
                    </p>
                    <motion.div
                      key={queueData.nomorSekarang}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-2 my-3"
                    >
                      <Hash className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <span className="text-5xl md:text-6xl font-extrabold text-green-700 dark:text-green-400 tabular-nums" suppressHydrationWarning>
                        A-{String(queueData.nomorSekarang).padStart(3, "0")}
                      </span>
                    </motion.div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1" suppressHydrationWarning>
                      Terakhir diperbarui: {queueData.lastUpdated}
                    </p>

                    {/* Auto-refresh indicator */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <motion.div
                        animate={{ rotate: isRefreshing ? 360 : 0 }}
                        transition={{ duration: 0.8, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "text-green-600 dark:text-green-400" : ""}`} />
                      </motion.div>
                      <span>
                        {isRefreshing ? "Memperbarui..." : `Auto-refresh ${30 - timeSinceUpdate}s`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Total Dilayani */}
              <motion.div variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                <div className="h-full rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-green-200 dark:hover:border-green-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 mb-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      <AnimatedCounter value={queueData.totalDilayani} />
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Dilayani Hari Ini
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Sisa Antrian */}
              <motion.div variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                <div className="h-full rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 mb-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl flex items-center justify-center shadow-sm">
                      <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      <AnimatedCounter value={queueData.sisaAntrian} />
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Sisa Antrian
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Rata-rata Tunggu */}
              <motion.div variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                <div className="h-full rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 mb-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl flex items-center justify-center shadow-sm">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ~<AnimatedCounter value={queueData.rataRataTunggu} />
                      <span className="text-sm font-medium ml-0.5">mnt</span>
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Rata-rata / Orang
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Estimasi Tunggu */}
              <motion.div variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.25 } }} className="col-span-2 sm:col-span-2">
                <div className="h-full rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-xl flex items-center justify-center shadow-sm">
                      <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        Estimasi Waktu Tunggu Anda
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                        {formatEstimasi(queueData.estimasiTungguAnda)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <Badge className="bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/40 dark:to-red-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40 text-[10px]">
                        Perkiraan
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Your Queue Number */}
              <motion.div variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                <div className="h-full rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 mb-2 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 rounded-xl flex items-center justify-center shadow-sm">
                      <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {yourQueueNumber || "---"}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Nomor Antrian Anda
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Queue Progress Bar */}
          <motion.div variants={cardVariants} className="mb-6">
            <div className="rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Progress Antrian Hari Ini
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                  {progressPercent.toFixed(0)}% selesai
                </span>
              </div>
              <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 rounded-full"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                <span>{queueData.totalDilayani} dilayani</span>
                <span>{queueData.sisaAntrian} menunggu</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  <AnimatedCounter value={queueData.totalDilayani + queueData.sisaAntrian} /> total hari ini
                </span>
              </div>
            </div>
          </motion.div>

          {/* Loket Status */}
          <motion.div variants={cardVariants} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                Status Loket Pelayanan
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={simulateRefresh}
                disabled={isRefreshing}
                className="text-xs gap-1.5 text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400"
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 0.8, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </motion.div>
                Perbarui
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {loketList.map((loket) => (
                <LoketCard key={loket.id} loket={loket} />
              ))}
            </div>
          </motion.div>

          {/* Info Penting callout */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-6"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-amber-900/10 dark:to-orange-900/5 border border-amber-200/80 dark:border-amber-800/30 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                  <AlertTriangle className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Info Penting
                  </p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-300/70 mt-1 leading-relaxed">
                    Antrian online ini bersifat simulasi untuk demo. Untuk mendapatkan nomor antrian resmi,
                    silakan datang langsung ke kantor Disdukcapil Kabupaten Ngada dengan membawa dokumen persyaratan.
                    Sistem antrian resmi tersedia di loket pendaftaran kantor.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ambil Nomor Antrian Button */}
          <motion.div variants={cardVariants} className="text-center">
            <div className="rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800/60 dark:to-green-900/10 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Ambil Nomor Antrian
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                    Dapatkan nomor antrian secara online. Anda akan menerima nomor antrian
                    yang dapat digunakan saat datang ke kantor Disdukcapil Ngada.
                  </p>
                </div>
                <Button
                  onClick={handleAmbilNomor}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-300 px-8 h-12 text-base"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Ambil Nomor Antrian Sekarang
                </Button>
                {yourQueueNumber && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="mt-2"
                    >
                      <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold border border-green-200 dark:border-green-800/40">
                        <CheckCircle2 className="h-4 w-4" />
                        Nomor Anda: <span className="text-lg font-extrabold">{yourQueueNumber}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1 justify-center">
                  <ShieldCheck className="h-3 w-3" />
                  Data Anda aman dan tidak disimpan dalam sistem
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
