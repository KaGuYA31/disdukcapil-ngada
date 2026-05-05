"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  FileText,
  Loader2,
  Baby,
  IdCard,
  BarChart3,
  Printer,
  AlertTriangle,
  RefreshCw,
  WifiOff,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";

// =============================================
// Animated Counter Hook
// =============================================
function useAnimatedCounter(
  target: number,
  duration: number = 1500,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = startValue + (target - startValue) * eased;
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
  }, [target, duration, isInView, startOnView]);

  return { count, ref };
}

// =============================================
// Quick Stats Card Component
// =============================================
interface QuickStatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  borderColor: string;
  duration?: number;
  decimals?: number;
}

function QuickStatCard({
  icon,
  value,
  suffix,
  label,
  iconBg,
  iconColor,
  valueColor,
  borderColor,
  duration = 1500,
  decimals = 0,
}: QuickStatCardProps) {
  const { count, ref } = useAnimatedCounter(value, duration);

  const formatValue = (val: number) => {
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    return new Intl.NumberFormat("id-ID").format(Math.round(val));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[160px] flex-shrink-0"
    >
      <Card
        className={`relative overflow-hidden rounded-2xl border-2 ${borderColor} bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300`}
      >
        {/* Gradient accent at top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          borderColor.includes("green") ? "from-green-400 to-green-600"
          : borderColor.includes("teal") ? "from-teal-400 to-teal-600"
          : borderColor.includes("amber") ? "from-amber-400 to-amber-600"
          : "from-rose-400 to-rose-600"
        }`} />

        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

        <CardContent className="p-5 text-center relative z-10">
          {/* Icon with pulse ring on hover */}
          <div className="relative mx-auto mb-3">
            <div
              className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto shadow-sm transition-transform duration-300 group-hover:scale-110`}
            >
              <div className={iconColor}>{icon}</div>
            </div>
          </div>

          {/* Animated Number */}
          <span
            ref={ref}
            className={`block text-2xl md:text-3xl font-extrabold tracking-tight ${valueColor}`}
          >
            {formatValue(count)}
            {suffix && (
              <span className="text-lg md:text-xl font-bold ml-0.5">{suffix}</span>
            )}
          </span>

          {/* Label */}
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-tight">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================
// Data Types
// =============================================
interface RingkasanData {
  periode: string;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  rasioJK: number;
}

interface DokumenKecamatanData {
  id: string;
  kecamatan: string;
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
}

interface RingkasanDokumenData {
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
}

interface StatistikData {
  ringkasan: RingkasanData | null;
  dokumen: DokumenKecamatanData[];
  ringkasanDokumen: RingkasanDokumenData | null;
}

// =============================================
// Animation Variants
// =============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FETCH_TIMEOUT_MS = 10_000;

// =============================================
// Loading Skeleton
// =============================================
function StatistikLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Data Kependudukan" }]} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <BarChart3 className="h-5 w-5 text-green-200" />
                </div>
                Data Kependudukan
              </h1>
              <p className="text-green-100 text-lg">
                Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
              </p>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-gray-50 dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        {/* Quick Stats Skeleton */}
        <div className="container mx-auto px-4 pt-6">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[160px] h-36 bg-white dark:bg-gray-800 rounded-2xl shadow animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 space-y-8">
          {/* Total Penduduk Skeleton */}
          <div className="h-52 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 animate-pulse" />
          {/* Distribusi JK Skeleton */}
          <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 animate-pulse" />
          {/* 3-column cards skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 animate-pulse" />
            <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 animate-pulse" />
            <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 animate-pulse" />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

// =============================================
// Error State
// =============================================
function StatistikErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Data Kependudukan" }]} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <BarChart3 className="h-5 w-5 text-green-200" />
                </div>
                Data Kependudukan
              </h1>
              <p className="text-green-100 text-lg">
                Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
              </p>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-gray-50 dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Gagal Memuat Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              Data kependudukan tidak dapat dimuat saat ini. Hal ini mungkin disebabkan oleh koneksi internet yang lambat atau sedang terjadi gangguan pada server.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8">
              <WifiOff className="h-4 w-4" />
              <span>Periksa koneksi internet Anda dan coba lagi</span>
            </div>
            <Button
              onClick={onRetry}
              className="bg-green-700 hover:bg-green-800 text-white gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

// =============================================
// Main Page
// =============================================
export default function StatistikPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<StatistikData>({
    ringkasan: null,
    dokumen: [],
    ringkasanDokumen: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch("/api/admin/statistik", {
        signal: controller.signal,
      });
      const result = await response.json();
      if (result.success) {
        setData({
          ringkasan: result.data.ringkasan,
          dokumen: result.data.dokumen || [],
          ringkasanDokumen: result.data.ringkasanDokumen || null,
        });
      } else {
        setError(true);
      }
    } catch (err: unknown) {
      console.error("Error fetching data kependudukan:", err);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(true);
        toast({
          title: "Waktu habis",
          description: "Data tidak dapat dimuat dalam waktu 10 detik. Silakan coba lagi.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        setError(true);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Use ringkasanDokumen if available, otherwise calculate from dokumen kecamatan
  const totalDokumen = data.ringkasanDokumen || data.dokumen.reduce(
    (acc, d) => ({
      ektpCetak: acc.ektpCetak + d.ektpCetak,
      ektpBelum: acc.ektpBelum + d.ektpBelum,
      aktaLahir: acc.aktaLahir + d.aktaLahir,
      aktaBelum: acc.aktaBelum + d.aktaBelum,
      kiaMiliki: acc.kiaMiliki + d.kiaMiliki,
      kiaBelum: acc.kiaBelum + d.kiaBelum,
    }),
    { ektpCetak: 0, ektpBelum: 0, aktaLahir: 0, aktaBelum: 0, kiaMiliki: 0, kiaBelum: 0 }
  );

  if (loading) {
    return <StatistikLoadingSkeleton />;
  }

  if (error) {
    return <StatistikErrorState onRetry={fetchData} />;
  }

  const ringkasan = data.ringkasan || {
    periode: "Data belum tersedia",
    totalPenduduk: 0,
    lakiLaki: 0,
    perempuan: 0,
    rasioJK: 0,
  };

  const totalKTP = totalDokumen.ektpCetak + totalDokumen.ektpBelum;
  const totalAkta = totalDokumen.aktaLahir + totalDokumen.aktaBelum;
  const totalKIA = totalDokumen.kiaMiliki + totalDokumen.kiaBelum;

  // Quick stats calculations
  const cakupanEKTP = totalKTP > 0
    ? parseFloat(((totalDokumen.ektpCetak / totalKTP) * 100).toFixed(1))
    : 94.8; // fallback default
  const jumlahKelurahan = 206; // fixed value per project data

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Decorative gradient orbs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />

          {/* Floating shapes */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-[15%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-16 left-[20%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Data Kependudukan" }]} />
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Dashboard Data
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <BarChart3 className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Data Kependudukan
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed">
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200 mt-2">
                  Data kependudukan dan kepemilikan dokumen — Periode{" "}
                  <span className="font-semibold text-white">{ringkasan.periode}</span>
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-gray-50 dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        {/* ============================================= */}
        {/* Quick Stats Summary Cards                     */}
        {/* ============================================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 -mt-8 relative z-10"
        >
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0">
            {/* 1. Total Penduduk */}
            <motion.div variants={fadeInUp}>
              <QuickStatCard
                icon={<Users className="h-6 w-6" />}
                value={ringkasan.totalPenduduk}
                label="Total Penduduk"
                iconBg="bg-green-100 dark:bg-green-900/40"
                iconColor="text-green-600 dark:text-green-400"
                valueColor="text-green-700 dark:text-green-400"
                borderColor="border-green-200 dark:border-green-800/60"
                duration={1800}
              />
            </motion.div>

            {/* 2. Cakupan E-KTP */}
            <motion.div variants={fadeInUp}>
              <QuickStatCard
                icon={<IdCard className="h-6 w-6" />}
                value={cakupanEKTP}
                suffix="%"
                label="Cakupan E-KTP"
                iconBg="bg-teal-100 dark:bg-teal-900/40"
                iconColor="text-teal-600 dark:text-teal-400"
                valueColor="text-teal-700 dark:text-teal-400"
                borderColor="border-teal-200 dark:border-teal-800/60"
                duration={1400}
                decimals={1}
              />
            </motion.div>

            {/* 3. Rasio Jenis Kelamin */}
            <motion.div variants={fadeInUp}>
              <QuickStatCard
                icon={<TrendingUp className="h-6 w-6" />}
                value={ringkasan.rasioJK}
                label="Rasio Jenis Kelamin"
                iconBg="bg-amber-100 dark:bg-amber-900/40"
                iconColor="text-amber-600 dark:text-amber-400"
                valueColor="text-amber-700 dark:text-amber-400"
                borderColor="border-amber-200 dark:border-amber-800/60"
                duration={1200}
                decimals={2}
              />
            </motion.div>

            {/* 4. Kelurahan/Desa */}
            <motion.div variants={fadeInUp}>
              <QuickStatCard
                icon={<MapPin className="h-6 w-6" />}
                value={jumlahKelurahan}
                label="Kelurahan/Desa"
                iconBg="bg-rose-100 dark:bg-rose-900/40"
                iconColor="text-rose-600 dark:text-rose-400"
                valueColor="text-rose-700 dark:text-rose-400"
                borderColor="border-rose-200 dark:border-rose-800/60"
                duration={1000}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Print Button */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                window.print();
                toast({ title: "Mencetak...", description: "Dialog cetak akan muncul", duration: 2000 });
              }}
              variant="outline"
              className="gap-2 print:hidden"
            >
              <Printer className="h-4 w-4" />
              Cetak Halaman
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Total Penduduk */}
            <motion.div variants={fadeInUp}>
              <Card className="border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 via-white to-teal-50/30 dark:from-green-900/20 dark:via-gray-800 dark:to-teal-900/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-0.5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-300">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Users className="h-6 w-6 text-green-700 dark:text-green-400" />
                    </div>
                    Jumlah Penduduk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-5xl md:text-6xl font-bold text-green-700 dark:text-green-400 tracking-tight">
                      {formatNumber(ringkasan.totalPenduduk)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Jiwa</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Distribusi Jenis Kelamin */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <Users className="h-5 w-5" />
                    Distribusi Jenis Kelamin
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Rasio: {ringkasan.rasioJK} (Laki-laki per 100 Perempuan)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <motion.div
                      variants={scaleIn}
                      className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm"
                    >
                      <div className="text-4xl font-bold text-green-700 dark:text-green-400">
                        {formatNumber(ringkasan.lakiLaki)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mt-2">Laki-laki</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {ringkasan.totalPenduduk > 0
                          ? ((ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100).toFixed(2)
                          : 0}
                        %
                      </p>
                    </motion.div>
                    <div className="h-10">
                      <div className="h-full flex rounded-xl overflow-hidden shadow-inner">
                        <div
                          className="bg-green-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                          style={{
                            width: `${
                              ringkasan.totalPenduduk > 0
                                ? (ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100
                                : 50
                            }%`,
                          }}
                        >
                          L
                        </div>
                        <div
                          className="bg-pink-500 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                          style={{
                            width: `${
                              ringkasan.totalPenduduk > 0
                                ? (ringkasan.perempuan / ringkasan.totalPenduduk) * 100
                                : 50
                            }%`,
                          }}
                        >
                          P
                        </div>
                      </div>
                    </div>
                    <motion.div
                      variants={scaleIn}
                      className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl shadow-sm"
                    >
                      <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">
                        {formatNumber(ringkasan.perempuan)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mt-2">Perempuan</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {ringkasan.totalPenduduk > 0
                          ? ((ringkasan.perempuan / ringkasan.totalPenduduk) * 100).toFixed(2)
                          : 0}
                        %
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Kepemilikan Dokumen */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <FileText className="h-5 w-5" />
                    Kepemilikan Dokumen Kependudukan
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Data kepemilikan KTP, Akta Kelahiran, dan KIA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* E-KTP */}
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-green-200 dark:border-green-800/60 hover:border-green-400 dark:hover:border-green-600 hover:shadow-lg transition-all rounded-xl h-full bg-white dark:bg-gray-900/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                              <IdCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            E-KTP
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Sudah Cetak</span>
                              <span className="font-bold text-green-700 dark:text-green-400 text-xl">
                                {formatNumber(totalDokumen.ektpCetak)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Belum Cetak</span>
                              <span className="font-bold text-red-600 dark:text-red-400 text-xl">
                                {formatNumber(totalDokumen.ektpBelum)}
                              </span>
                            </div>
                            <div className="pt-2 border-t dark:border-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Cakupan</span>
                                <span className="font-bold text-green-700 dark:text-green-400">
                                  {totalKTP > 0
                                    ? ((totalDokumen.ektpCetak / totalKTP) * 100).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      totalKTP > 0
                                        ? (totalDokumen.ektpCetak / totalKTP) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Akta Kelahiran */}
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-amber-200 dark:border-amber-800/60 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all rounded-xl h-full bg-white dark:bg-gray-900/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            Akta Kelahiran
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Memiliki</span>
                              <span className="font-bold text-amber-700 dark:text-amber-400 text-xl">
                                {formatNumber(totalDokumen.aktaLahir)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Belum Memiliki</span>
                              <span className="font-bold text-red-600 dark:text-red-400 text-xl">
                                {formatNumber(totalDokumen.aktaBelum)}
                              </span>
                            </div>
                            <div className="pt-2 border-t dark:border-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Cakupan</span>
                                <span className="font-bold text-amber-700 dark:text-amber-400">
                                  {totalAkta > 0
                                    ? ((totalDokumen.aktaLahir / totalAkta) * 100).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      totalAkta > 0
                                        ? (totalDokumen.aktaLahir / totalAkta) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* KIA */}
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-rose-200 dark:border-rose-800/60 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-lg transition-all rounded-xl h-full bg-white dark:bg-gray-900/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                              <Baby className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            KIA
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Memiliki</span>
                              <span className="font-bold text-rose-700 dark:text-rose-400 text-xl">
                                {formatNumber(totalDokumen.kiaMiliki)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Belum Memiliki</span>
                              <span className="font-bold text-red-600 dark:text-red-400 text-xl">
                                {formatNumber(totalDokumen.kiaBelum)}
                              </span>
                            </div>
                            <div className="pt-2 border-t dark:border-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Cakupan</span>
                                <span className="font-bold text-rose-700 dark:text-rose-400">
                                  {totalKIA > 0
                                    ? ((totalDokumen.kiaMiliki / totalKIA) * 100).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      totalKIA > 0
                                        ? (totalDokumen.kiaMiliki / totalKIA) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Detail per Kecamatan */}
                  {data.dokumen.length > 0 && (
                    <motion.div
                      variants={fadeInUp}
                      className="mt-10"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-700 dark:text-green-400" />
                        Detail Per Kecamatan
                      </h3>
                      <div className="overflow-x-auto rounded-xl shadow-sm border dark:border-gray-700">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-700 text-white">
                              <th className="px-4 py-3 text-left rounded-tl-xl">Kecamatan</th>
                              <th className="px-4 py-3 text-right">E-KTP Cetak</th>
                              <th className="px-4 py-3 text-right">Akta Lahir</th>
                              <th className="px-4 py-3 text-right rounded-tr-xl">KIA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.dokumen.map((d, index) => (
                              <tr
                                key={d.id}
                                className="border-b last:border-b-0 dark:border-gray-700 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors even:bg-gray-50/50 dark:even:bg-gray-900/30"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{d.kecamatan}</td>
                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatNumber(d.ektpCetak)}</td>
                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatNumber(d.aktaLahir)}</td>
                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatNumber(d.kiaMiliki)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 space-y-1"
          >
            <p>Data diperbaharui: {ringkasan.periode}</p>
            <p>Sumber: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada</p>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
