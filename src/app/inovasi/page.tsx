"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
  Zap,
  Map,
  Users,
  Clock,
} from "lucide-react";

interface InovasiActivity {
  id: string;
  title: string;
  description: string;
  category?: string;
  photo?: string | null;
  location?: string | null;
  date?: string | null;
}

// ─── Framer-motion animation variants ─────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Impact Counter Config ───────────────────────────────────────────────

const impactStats = [
  { icon: Zap, label: "Total Kegiatan", value: 12, suffix: "" },
  { icon: Map, label: "Desa Terjangkau", value: 45, suffix: "+" },
  { icon: Users, label: "Masyarakat Dilayani", value: 3200, suffix: "+" },
  { icon: Clock, label: "Tahun Aktif", value: 3, suffix: " Tahun" },
];

// ─── Loading Skeleton ────────────────────────────────────────────────────

function InovasiLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Skeleton className="h-10 w-80 mb-4 bg-green-600/40" />
              <Skeleton className="h-6 w-full max-w-xl bg-green-600/30" />
              <Skeleton className="h-5 w-96 mt-2 bg-green-600/20" />
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48 rounded-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────

export default function InovasiPage() {
  const [activities, setActivities] = useState<InovasiActivity[]>([]);
  const [allActivities, setAllActivities] = useState<InovasiActivity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const response = await fetch("/api/inovasi?limit=100");
        if (!response.ok) {
          throw new Error("Gagal memuat data kegiatan");
        }
        const data = await response.json();
        const items = data.data || [];
        const cats = data.categories || [];
        setAllActivities(items);
        setActivities(items);
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Filter activities by category
  useEffect(() => {
    if (activeCategory === "Semua") {
      setActivities(allActivities);
    } else {
      setActivities(allActivities.filter((a) => a.category === activeCategory));
    }
  }, [activeCategory, allActivities]);

  // Find most recent activity for "Terbaru" badge
  const mostRecentId = useMemo(() => {
    if (allActivities.length === 0) return null;
    const sorted = [...allActivities].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    return sorted[0].id;
  }, [allActivities]);

  // Latest year
  const latestYear = useMemo(() => {
    if (allActivities.length === 0) return "2024";
    const dates = allActivities
      .filter((a) => a.date)
      .map((a) => new Date(a.date!).getFullYear());
    return dates.length > 0 ? Math.max(...dates).toString() : "2024";
  }, [allActivities]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <InovasiLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* ═══════════ Hero Banner ═══════════ */}
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
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Inovasi" }]} />
                </motion.div>

                {/* Section Label */}
                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    <Lightbulb className="h-3.5 w-3.5 inline-block mr-1.5 -mt-0.5" />
                    KEGIATAN INOVASI
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <Lightbulb className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Kegiatan Inovasi Jemput Bola
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl"
                >
                  Daftar kegiatan inovasi pelayanan dari Disdukcapil
                  Kabupaten Ngada. Kami mendatangi masyarakat untuk memberikan
                  pelayanan administrasi kependudukan yang lebih dekat dan mudah
                  dijangkau.
                </motion.p>

                {/* Hero stat pills */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                    <Zap className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100 font-medium">{allActivities.length} Kegiatan</span>
                  </div>
                  {categories.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                      <MapPin className="h-4 w-4 text-green-200" />
                      <span className="text-sm text-green-100 font-medium">{categories.length} Kategori</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
                    <Calendar className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100 font-medium">{latestYear}</span>
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

        {/* ═══════════ Main Content ═══════════ */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto shadow-sm">
                <Loader2 className="w-10 h-10 text-red-400 mx-auto mb-3 animate-spin" />
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-green-700 hover:bg-green-800"
                >
                  Coba Lagi
                </Button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && activities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-md mx-auto shadow-sm">
                <Lightbulb className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Belum Ada Kegiatan
                </h3>
                <p className="text-green-600">
                  Saat ini belum ada kegiatan inovasi yang tersedia. Silakan
                  kembali lagi nanti.
                </p>
              </div>
            </motion.div>
          )}

          {/* Activities Grid */}
          {!loading && !error && allActivities.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {/* Section Header */}
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Daftar Kegiatan
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Menampilkan {activities.length} kegiatan inovasi
                </p>
              </motion.div>

              {/* Category Filter — Animated Pill Toggle */}
              {categories.length > 1 && (
                <motion.div
                  variants={fadeInUp}
                  className="mb-8"
                >
                  <div className="relative flex overflow-x-auto scrollbar-hide gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit max-w-full">
                    {[
                      { key: "Semua", count: allActivities.length },
                      ...categories.map((cat) => ({
                        key: cat,
                        count: allActivities.filter((a) => a.category === cat).length,
                      })),
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setActiveCategory(filter.key)}
                        className={`
                          relative flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors duration-200
                          ${
                            activeCategory === filter.key
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          }
                        `}
                      >
                        {activeCategory === filter.key && (
                          <motion.div
                            layoutId="activeFilterInovasi"
                            className="absolute inset-0 bg-green-700 rounded-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                          />
                        )}
                        <span className="relative z-10">{filter.key}</span>
                        <span
                          className={`
                            relative z-10 text-xs px-1.5 py-0.5 rounded-md font-semibold
                            ${
                              activeCategory === filter.key
                                ? "bg-white/20 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }
                          `}
                        >
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Filtered empty state */}
              {activities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                    <Lightbulb className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Tidak ada kegiatan untuk kategori &quot;{activeCategory}&quot;.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-green-600 text-green-700 hover:bg-green-50"
                      onClick={() => setActiveCategory("Semua")}
                    >
                      Lihat Semua Kegiatan
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Card Grid */}
              {activities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <motion.div key={activity.id} variants={cardVariant}>
                      <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 group">
                        {/* Activity Photo */}
                        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          {activity.photo ? (
                            <Image
                              src={activity.photo}
                              alt={activity.title}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20">
                              <Lightbulb className="w-14 h-14 text-green-300 dark:text-green-600" />
                            </div>
                          )}
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/40 group-hover:to-transparent transition-all duration-500" />

                          {/* Category badge on image */}
                          {activity.category && categories.length > 1 && (
                            <Badge className="absolute top-3 right-3 bg-green-700/90 text-white text-xs backdrop-blur-sm">
                              {activity.category}
                            </Badge>
                          )}

                          {/* "Terbaru" badge for most recent */}
                          {activity.id === mostRecentId && (
                            <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white text-xs backdrop-blur-sm font-bold flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Terbaru
                            </Badge>
                          )}
                        </div>

                        <CardHeader className="pb-3">
                          <CardTitle className="text-green-800 dark:text-green-300 line-clamp-2 leading-snug group-hover:text-green-600 dark:group-hover:text-green-200 transition-colors">
                            {activity.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-sm">
                            {truncateText(activity.description, 120)}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow pt-0">
                          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-sm">
                              {activity.location || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className="w-full bg-green-700 hover:bg-green-800 text-white gap-2 transition-all duration-200 hover:shadow-md"
                            asChild
                          >
                            <Link href={`/inovasi/${activity.id}`}>
                              Baca Selengkapnya
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ═══════════ Impact Counter Section ═══════════ */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={staggerContainer}
                className="mt-16"
              >
                <motion.div variants={fadeInUp} className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Dampak Inovasi
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Capayan nyata dari program jemput bola kami
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {impactStats.map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(5, 150, 105, 0.15)" }}
                        className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 text-center overflow-hidden group"
                      >
                        {/* Glass gradient accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-transparent to-teal-50/40 dark:from-green-900/20 dark:via-transparent dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                            <StatIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {stat.label}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
