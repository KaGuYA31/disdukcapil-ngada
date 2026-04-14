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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const FETCH_TIMEOUT_MS = 15_000;

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
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
      };
    case "Maintenance":
      return {
        label: "Maintenance",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
        dotColor: "bg-amber-500",
        icon: <Wrench className="h-3 w-3 mr-1" />,
      };
    default:
      return {
        label: "Info",
        className:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
        dotColor: "bg-teal-500",
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
      {/* Timeline line */}
      <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Timeline dot */}
      <div
        className={`absolute left-1.5 md:left-2.5 top-6 w-3 h-3 rounded-full ${badgeConfig.dotColor} ring-4 ring-white dark:ring-gray-900`}
      />

      {/* Card */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded-xl"
        aria-expanded={isExpanded}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all duration-200 overflow-hidden">
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
        </div>
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
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

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
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3"
                >
                  <ShieldCheck className="h-9 w-9 md:h-10 md:w-10 text-green-200" />
                  Transparansi & Publikasi
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg">
                  Akses dokumen peraturan, laporan kinerja, dan publikasi resmi
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.
                </motion.p>
              </motion.div>
            </div>
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
