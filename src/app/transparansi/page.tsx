"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Megaphone,
  ChevronDown,
  AlertTriangle,
  WifiOff,
  RefreshCw,
  Info,
  Wrench,
  Calendar,
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
  Shield,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TransparansiSection } from "@/components/sections/transparansi/transparansi-section";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// =============================================
// Animation variants
// =============================================
const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

const counterPulse = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// =============================================
// Types
// =============================================
interface Pengumuman {
  id: string;
  title: string;
  content: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
}

const FETCH_TIMEOUT_MS = 15_000;

// =============================================
// Performance Indicators Config
// =============================================
const kpiCards = [
  {
    icon: FileText,
    label: "Dokumen Dipublikasi",
    value: 24,
    suffix: " dokumen",
    color: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/20",
    progress: 80,
    borderColor: "border-green-300 dark:border-green-700",
    accentBg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: Megaphone,
    label: "Pengumuman Aktif",
    value: 5,
    suffix: " aktif",
    color: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
    progress: 50,
    borderColor: "border-amber-300 dark:border-amber-700",
    accentBg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: BarChart3,
    label: "Laporan Tahunan",
    value: 3,
    suffix: " laporan",
    color: "from-teal-500 to-cyan-600",
    shadowColor: "shadow-teal-500/20",
    progress: 60,
    borderColor: "border-teal-300 dark:border-teal-700",
    accentBg: "bg-teal-50 dark:bg-teal-900/20",
  },
  {
    icon: TrendingUp,
    label: "Respons Rate",
    value: 95,
    suffix: "%",
    color: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/20",
    progress: 95,
    borderColor: "border-violet-300 dark:border-violet-700",
    accentBg: "bg-violet-50 dark:bg-violet-900/20",
  },
];

// =============================================
// Type Badge Config
// =============================================
function getTypeBadge(type: string) {
  switch (type) {
    case "Urgent":
      return {
        label: "Urgent",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/60",
        dotColor: "bg-red-500",
        accentColor: "border-l-red-500",
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
      };
    case "Maintenance":
      return {
        label: "Maintenance",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
        dotColor: "bg-amber-500",
        accentColor: "border-l-amber-500",
        icon: <Wrench className="h-3 w-3 mr-1" />,
      };
    default:
      return {
        label: "Info",
        className:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
        dotColor: "bg-teal-500",
        accentColor: "border-l-teal-500",
        icon: <Info className="h-3 w-3 mr-1" />,
      };
  }
}

// =============================================
// Announcement Timeline Item
// =============================================
function AnnouncementItem({ item, index }: { item: Pengumuman; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const badgeConfig = getTypeBadge(item.type);

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const contentPreview =
    item.content.length > 150 ? item.content.slice(0, 150) + "..." : item.content;

  return (
    <motion.div
      variants={fadeInUp}
      className="relative pl-8 md:pl-10"
    >
      {/* Animated gradient timeline line */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" as const }}
        className="absolute left-3 md:left-4 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-green-400 via-teal-400 to-emerald-400 dark:from-green-600 dark:via-teal-600 dark:to-emerald-600"
      />

      {/* Pulsing timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: index * 0.15 }}
        className="absolute left-1.5 md:left-2.5 top-6"
      >
        <div className={`w-3 h-3 rounded-full ${badgeConfig.dotColor} ring-4 ring-white dark:ring-gray-900 relative`}>
          {/* Pulsing ring */}
          <div className={`absolute inset-0 rounded-full ${badgeConfig.dotColor} opacity-40 animate-ping`} />
        </div>
      </motion.div>

      {/* Card */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded-xl"
        aria-expanded={isExpanded}
      >
        <motion.div
          whileHover={{ y: -3, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.25 }}
          className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 ${badgeConfig.accentColor} border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-lg group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all duration-300 overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Type badge + Date */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-2 py-0.5 ${badgeConfig.className}`}
                  >
                    {badgeConfig.icon}
                    {badgeConfig.label}
                  </Badge>
                  {formattedDate && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* Expand/Collapse icon */}
              <div className="flex-shrink-0 mt-1">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence initial={false}>
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Preview text (only when collapsed) */}
            {!isExpanded && item.content.length > 150 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {contentPreview}
              </p>
            )}
            {!isExpanded && item.content.length <= 150 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.content}
              </p>
            )}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

// =============================================
// Announcements Section
// =============================================
function PengumumanSection() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPengumuman = useCallback(async () => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch("/api/pengumuman?limit=5", {
        signal: controller.signal,
      });
      const result = await response.json();
      if (result.success) {
        setAnnouncements(result.data || []);
      } else {
        setError(true);
      }
    } catch (err: unknown) {
      console.error("Error fetching pengumuman:", err);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(true);
        toast({
          title: "Waktu habis",
          description: "Pengumuman tidak dapat dimuat dalam waktu 15 detik.",
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
    fetchPengumuman();
  }, [fetchPengumuman]);

  // Loading state
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-56 mb-8" />
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="pl-8 md:pl-10 relative">
                <div className="absolute left-1.5 md:left-2.5 top-6 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-5">
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center py-10">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Gagal Memuat Pengumuman
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Terjadi kesalahan saat mengambil data pengumuman. Silakan coba lagi.
          </p>
          <Button
            onClick={fetchPengumuman}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      </section>
    );
  }

  // Empty state
  if (announcements.length === 0) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl">
              <Megaphone className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            Pengumuman Terbaru
          </h2>
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Belum ada pengumuman saat ini
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Pengumuman terbaru akan ditampilkan di sini
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Normal state - with announcements
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Section Title */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl">
                <Megaphone className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
              Pengumuman Terbaru
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-14">
              Informasi dan pengumuman resmi dari Disdukcapil Ngada
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-4">
            {announcements.map((item, index) => (
              <AnnouncementItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================
// Main Page
// =============================================
export default function TransparansiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* ═══════════ Hero Banner ═══════════ */}
        <section className="bg-gradient-to-br from-green-700 via-teal-800 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Animated decorative gradient orbs */}
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />

          {/* Floating decorative shapes */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-[15%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-[20%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-[25%] w-2 h-2 bg-amber-300/20 rounded-full hidden lg:block"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Transparansi & Publikasi" }]} />
                </motion.div>

                {/* Section Label */}
                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    <Shield className="h-3.5 w-3.5 inline-block mr-1.5 -mt-0.5" />
                    TRANSPARANSI
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Transparansi & Publikasi
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Akses dokumen peraturan, laporan kinerja, dan publikasi resmi
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200/80 mt-2">
                  Komitmen kami untuk keterbukaan informasi publik
                </motion.p>

                {/* Hero stat pills */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                    <FileText className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100 font-medium">24 Dokumen</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                    <Megaphone className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100 font-medium">5 Pengumuman</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                    <BarChart3 className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100 font-medium">3 Laporan</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-white dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        {/* ═══════════ Performance Indicators Section ═══════════ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider mb-2">
                  <Eye className="h-4 w-4" />
                  Indikator Kinerja
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Kinerja Transparansi
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Capaian transparansi dan publikasi kami saat ini
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {kpiCards.map((kpi, idx) => {
                  const KpiIcon = kpi.icon;
                  return (
                    <motion.div
                      key={kpi.label}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                      transition={{ delay: idx * 0.1 }}
                      className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${kpi.borderColor} p-6 overflow-hidden group`}
                    >
                      {/* Background gradient on hover */}
                      <div className={`absolute inset-0 ${kpi.accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center mb-4 shadow-lg ${kpi.shadowColor}`}>
                          <KpiIcon className="h-6 w-6 text-white" />
                        </div>
                        {/* Value */}
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            {kpi.value}{kpi.suffix}
                          </motion.span>
                        </div>
                        {/* Label */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                          {kpi.label}
                        </p>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${kpi.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.5 + idx * 0.1, ease: "easeOut" as const }}
                            className={`h-full bg-gradient-to-r ${kpi.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Announcements Section */}
        <PengumumanSection />

        {/* Existing Transparansi Section */}
        <TransparansiSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
