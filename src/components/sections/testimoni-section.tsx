"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Quote, Star, ChevronDown, PenLine, Loader2, Users, Award, Sparkles } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { openTestimoniDialog } from "@/components/shared/add-testimoni-widget";

interface Testimonial {
  id: number | string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

interface DBTestimonial {
  id: string;
  nama: string;
  pekerjaan: string | null;
  kecamatan: string | null;
  rating: number;
  isi: string;
  createdAt: string;
}

const hardcodedTestimonials: Testimonial[] = [
  {
    id: "h1",
    name: "Maria Goreti",
    location: "Kecamatan Bajawa",
    text: "Pelayanan KTP-el sangat cepat dan ramah. Petugas membantu dengan sabar dan memberikan informasi yang jelas. Terima kasih Disdukcapil Ngada!",
    rating: 5,
  },
  {
    id: "h2",
    name: "Yohanes Bere",
    location: "Kecamatan Aimere",
    text: "Proses pembuatan KK selesai dalam hitungan menit. Tidak perlu menunggu lama. Sangat efisien dan profesional!",
    rating: 5,
  },
  {
    id: "h3",
    name: "Anastasia Moe",
    location: "Kecamatan Ngada",
    text: "Saya sangat terbantu dengan layanan jemput bola. Tidak perlu ke kantor, petugas yang datang ke desa kami. Luar biasa!",
    rating: 5,
  },
  {
    id: "h4",
    name: "Fransiskus Nago",
    location: "Kecamatan Riung",
    text: "Pengurusan akta kelahiran anak saya berjalan lancar. Persyaratan jelas dan proses cepat. Sangat memuaskan.",
    rating: 4,
  },
  {
    id: "h5",
    name: "Pelagia Wae",
    location: "Kecamatan Soa",
    text: "Website ini sangat membantu untuk mengetahui informasi layanan. Tidak perlu datang ke kantor hanya untuk bertanya.",
    rating: 5,
  },
  {
    id: "h6",
    name: "Dominikus Reo",
    location: "Kecamatan Golewa",
    text: "Legalisasi dokumen kependudukan gratis dan cepat. Sangat mengapresiasi pelayanan Disdukcapil Ngada yang memuaskan.",
    rating: 5,
  },
];

const ROTATION_INTERVAL = 5000;

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15 + i * 0.1,
      ease: "easeOut" as const,
    },
  }),
};

const starVariants = {
  hidden: { scale: 0 },
  visible: (i: number) => ({
    scale: 1,
    transition: {
      duration: 0.3,
      delay: i * 0.1,
      ease: "easeOut" as const,
    },
  }),
};

const floatOrb = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    x: [0, i % 2 === 0 ? 8 : -8, 0],
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 6 + i * 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: i * 0.5,
    },
  }),
};

function StarRating({ rating, animate }: { rating: number; animate?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={animate ? starVariants : undefined}
          initial={animate ? "hidden" : undefined}
          animate={animate ? "visible" : undefined}
          whileHover={{ scale: 1.2, rotate: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="cursor-default"
        >
          <Star
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-600"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  animateStars,
  isTopRated,
}: {
  testimonial: Testimonial;
  index: number;
  animateStars: boolean;
  isTopRated?: boolean;
}) {
  return (
    <motion.div
      key={testimonial.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="group h-full border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-xl overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 card-accent-top relative">
        {/* Rating Terbaik badge */}
        {isTopRated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 300 }}
            className="absolute top-3 right-3 z-10"
          >
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[10px] font-bold rounded-full shadow-md shadow-amber-500/25">
              <Award className="h-3 w-3" />
              Rating Terbaik
            </span>
          </motion.div>
        )}
        <CardContent className="p-6 flex flex-col h-full">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating rating={testimonial.rating} animate={animateStars} />
          </div>

          {/* Quote */}
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mt-0.5">
              <Quote className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed text-sm flex-1 border-l-2 border-green-300 dark:border-green-700 pl-3">
              &ldquo;{testimonial.text}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 my-4 mt-auto" />

          {/* Author Info */}
          <div className="flex items-center gap-3">
            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-green-400 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                {testimonial.name.charAt(0)}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {testimonial.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-full animate-pulse">
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function mapDBToTestimonial(db: DBTestimonial): Testimonial {
  return {
    id: db.id,
    name: db.nama,
    location: db.kecamatan ? `Kecamatan ${db.kecamatan}` : (db.pekerjaan || "Masyarakat"),
    text: db.isi,
    rating: db.rating,
  };
}

export function TestimoniSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  // DB testimonials state
  const [dbTestimonials, setDbTestimonials] = useState<DBTestimonial[]>([]);
  const [loadingDB, setLoadingDB] = useState(true);
  const [showHardcoded, setShowHardcoded] = useState(false);

  // Fetch DB testimonials on mount
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimoni?limit=10");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setDbTestimonials(result.data);
          }
        }
      } catch {
        // Silently fail - we use hardcoded fallback
      } finally {
        setLoadingDB(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Combined testimonials: DB first, then hardcoded
  const allTestimonials: Testimonial[] = [
    ...dbTestimonials.map(mapDBToTestimonial),
    ...hardcodedTestimonials,
  ];

  const hasDBTestimonials = dbTestimonials.length > 0;
  const displayTestimonials = hasDBTestimonials
    ? showHardcoded
      ? allTestimonials
      : dbTestimonials.slice(0, 3).map(mapDBToTestimonial)
    : allTestimonials;

  // Find the max rating for top-rated badge
  const maxRating = Math.max(...displayTestimonials.map((t) => t.rating));

  const clearRotationTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    const rotationList = displayTestimonials;
    if (!isInView || showAll || isPaused || rotationList.length <= 3) {
      clearRotationTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % rotationList.length);
      setProgressKey((k) => k + 1);
    }, ROTATION_INTERVAL);

    return () => {
      clearRotationTimer();
    };
  }, [isInView, showAll, isPaused, clearRotationTimer, displayTestimonials.length]);

  const handleDotClick = useCallback(
    (i: number) => {
      setStartIndex(i);
      setProgressKey((k) => k + 1);
      clearRotationTimer();
    },
    [clearRotationTimer]
  );

  const handleShowAll = useCallback(() => {
    setShowAll(true);
  }, []);

  const handleShowLess = useCallback(() => {
    setShowAll(false);
    setStartIndex(0);
    setProgressKey((k) => k + 1);
  }, []);

  const displayedTestimonials = showAll
    ? displayTestimonials
    : displayTestimonials.slice(startIndex, startIndex + 3).concat(
        displayTestimonials.slice(0, Math.max(0, startIndex + 3 - displayTestimonials.length))
      );

  const showRotationUI = isInView && !showAll && !isPaused && displayedTestimonials.length > 3;

  // Calculate stats
  const avgRating =
    allTestimonials.length > 0
      ? (
          allTestimonials.reduce((sum, t) => sum + t.rating, 0) /
          allTestimonials.length
        ).toFixed(1)
      : "4.8";

  const showTulisButton = useCallback(() => {
    openTestimoniDialog();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Gradient Hero Banner */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-br from-green-700 via-green-800 to-teal-900" />
      {/* SVG Cross Pattern Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[120px] hero-banner-pattern opacity-[0.04]" />
      {/* Animated Gradient Orbs */}
      <motion.div
        custom={0}
        variants={floatOrb}
        initial="animate"
        animate="animate"
        className="absolute top-4 left-[15%] w-24 h-24 bg-green-400/20 rounded-full blur-2xl pointer-events-none"
      />
      <motion.div
        custom={1}
        variants={floatOrb}
        initial="animate"
        animate="animate"
        className="absolute top-8 right-[20%] w-20 h-20 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"
      />
      {/* Glassmorphism Icon Container */}
      <div className="absolute top-0 left-0 right-0 h-[120px] flex items-center justify-center pointer-events-none">
        <div className="bg-white/15 backdrop-blur-sm rounded-full border border-white/20 p-3 shadow-lg">
          <Users className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* Floating Decorative Shapes */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[5%] w-3 h-3 rounded-sm bg-green-300/30 dark:bg-green-500/15 rotate-12"
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[60%] right-[8%] w-4 h-4 rounded-full bg-teal-300/25 dark:bg-teal-500/10"
      />
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[12%] w-2.5 h-2.5 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[45%] right-[15%] w-3 h-3 rounded-sm bg-green-200/25 dark:bg-green-600/10 rotate-45"
      />
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-48 right-[25%] w-2 h-2 rounded-full bg-teal-200/20 dark:bg-teal-600/10"
      />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12 mt-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Quote className="h-4 w-4" />
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 animated-underline">
            Testimoni Masyarakat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Apa kata masyarakat tentang pelayanan Disdukcapil Kabupaten Ngada.
            Kepuasan Anda adalah prioritas kami.
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-8 mb-10"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgRating}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rating Rata-rata</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {allTestimonials.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Testimoni</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">98%</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Puas dengan Layanan</p>
          </div>
        </motion.div>

        {/* "Testimoni Terbaru" label when DB has data */}
        <AnimatePresence>
          {hasDBTestimonials && !showAll && !showHardcoded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium px-3 py-1.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-green-500 text-green-500" />
                Testimoni Terbaru dari Masyarakat
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonial Cards */}
        <div
          ref={gridRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loadingDB ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  animateStars={isInView}
                  isTopRated={testimonial.rating === maxRating}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation dots (carousel mode) */}
        <AnimatePresence>
          {!showAll && isInView && displayedTestimonials.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === startIndex
                      ? "bg-green-600 w-6"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Tulis Testimoni Button */}
              <Button
                onClick={showTulisButton}
                className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Tulis Testimoni
              </Button>

              {/* Show More / Show Less or Lainnya toggle */}
              {hasDBTestimonials && !showAll && (
                <Button
                  variant="outline"
                  onClick={() => setShowHardcoded(true)}
                  className="border-green-700 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 font-medium"
                >
                  Lihat Semua ({allTestimonials.length})
                </Button>
              )}

              {!hasDBTestimonials && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (showAll) handleShowLess();
                    else handleShowAll();
                  }}
                  className="border-green-700 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 font-medium"
                >
                  {showAll ? "Tampilkan Sedikit" : "Lihat Semua Testimoni"}
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                      showAll ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              )}

              {hasDBTestimonials && showAll && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowHardcoded(false);
                    handleShowLess();
                  }}
                  className="border-green-700 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 font-medium"
                >
                  <ChevronDown className="mr-2 h-4 w-4 rotate-180 transition-transform duration-300" />
                  Tampilkan Sedikit
                </Button>
              )}
            </div>

            {/* Progress bar for auto-rotation */}
            {showRotationUI && (
              <div className="w-40 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  key={progressKey}
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    animation: `testimoniProgressFill ${ROTATION_INTERVAL}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Inline keyframes for progress bar */}
      <style jsx global>{`
        @keyframes testimoniProgressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
