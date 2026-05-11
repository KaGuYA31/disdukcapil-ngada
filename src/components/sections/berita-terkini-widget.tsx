"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Newspaper,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ─────────────────────────────────────────────────────────────

interface BeritaItem {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  category: string;
  thumbnail?: string;
  createdAt: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAYS_ID = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

function formatDateIndo(dateString: string): string {
  const date = new Date(dateString);
  const day = DAYS_ID[date.getDay()];
  const dd = date.getDate();
  const month = MONTHS_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${dd} ${month} ${year}`;
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  return `${Math.floor(diffDays / 365)} tahun yang lalu`;
}

function getCategoryColor(category: string) {
  switch (category?.toLowerCase()) {
    case "pengumuman":
      return {
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800",
        dot: "bg-red-500",
      };
    case "kegiatan":
      return {
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
      };
    case "layanan":
      return {
        badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800",
        dot: "bg-green-500",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        dot: "bg-gray-500",
      };
  }
}

// ─── Animation Variants ────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" as const },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Loading Skeleton ──────────────────────────────────────────────────

function NewsCardSkeleton() {
  return (
    <Card className="border-gray-200/80 dark:border-gray-700/50 overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="sm:w-52 h-40 sm:h-auto flex-shrink-0 rounded-none" />
        <CardContent className="p-4 md:p-5 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <div className="pt-2">
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── News Card ─────────────────────────────────────────────────────────

function NewsCard({ berita }: { berita: BeritaItem }) {
  const catColor = getCategoryColor(berita.category);

  return (
    <Card className="border-gray-200/80 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-md hover:shadow-green-500/5 dark:hover:shadow-green-400/5 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="sm:w-52 h-40 sm:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {berita.thumbnail ? (
            <img
              src={berita.thumbnail}
              alt={berita.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
              <Newspaper className="h-10 w-10 text-green-300 dark:text-green-700" />
            </div>
          )}
          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 font-medium backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 ${catColor.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${catColor.dot}`} />
              {berita.category || "Umum"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 md:p-5 flex-1">
          {/* Date */}
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateIndo(berita.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(berita.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base md:text-lg leading-snug line-clamp-2 mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            {berita.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
            {berita.excerpt ||
              berita.title.substring(0, 120) + "..."}
          </p>

          {/* Read More */}
          <Link href={`/berita/${berita.slug}`}>
            <Button
              variant="ghost"
              className="gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-0 h-auto text-sm font-medium"
            >
              Baca selengkapnya
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────

export function BeritaTerkiniWidget() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(false);

  // Fetch berita
  useEffect(() => {
    async function fetchBerita() {
      try {
        const res = await fetch("/api/berita?limit=5");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setBeritaList(json.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBerita();
  }, []);

  // Auto-play carousel
  const goToNext = useCallback(() => {
    if (isPaused || beritaList.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % beritaList.length);
  }, [isPaused, beritaList.length]);

  const goToPrev = useCallback(() => {
    if (beritaList.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + beritaList.length) % beritaList.length);
  }, [beritaList.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused || beritaList.length <= 1) return;
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [isPaused, beritaList.length, goToNext]);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="berita-terkini-title">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Skeleton className="h-5 w-28 rounded-full mx-auto mb-2" />
            <Skeleton className="h-10 w-72 rounded-lg mx-auto mb-3" />
            <Skeleton className="h-5 w-96 rounded-lg mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <NewsCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (error || beritaList.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      aria-labelledby="berita-terkini-title"
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Newspaper className="h-4 w-4" />
            Berita & Informasi
          </span>
          <h2
            id="berita-terkini-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Berita Terkini
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Ikuti informasi terbaru seputar layanan kependudukan dan kegiatan
            Disdukcapil Kabupaten Ngada
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            {/* Card with slide animation */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <NewsCard berita={beritaList[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1 md:-mx-5 pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrev}
                className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-auto border-gray-200 dark:border-gray-700"
                aria-label="Berita sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-auto border-gray-200 dark:border-gray-700"
                aria-label="Berita berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Dots + Counter */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Navigasi berita">
              {beritaList.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Berita ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? "w-6 h-2 bg-green-600 dark:bg-green-500"
                      : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
              {currentIndex + 1} / {beritaList.length}
            </span>
          </div>

          {/* View All Link */}
          <div className="text-center mt-6">
            <Link href="/berita">
              <Button
                variant="outline"
                className="gap-1.5 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-700"
              >
                Lihat Semua Berita
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
