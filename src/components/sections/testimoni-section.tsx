"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Quote, Star, ChevronDown } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Goreti",
    location: "Kecamatan Bajawa",
    text: "Pelayanan KTP-el sangat cepat dan ramah. Petugas membantu dengan sabar dan memberikan informasi yang jelas. Terima kasih Disdukcapil Ngada!",
    rating: 5,
  },
  {
    id: 2,
    name: "Yohanes Bere",
    location: "Kecamatan Aimere",
    text: "Proses pembuatan KK selesai dalam hitungan menit. Tidak perlu menunggu lama. Sangat efisien dan profesional!",
    rating: 5,
  },
  {
    id: 3,
    name: "Anastasia Moe",
    location: "Kecamatan Ngada",
    text: "Saya sangat terbantu dengan layanan jemput bola. Tidak perlu ke kantor, petugas yang datang ke desa kami. Luar biasa!",
    rating: 5,
  },
  {
    id: 4,
    name: "Fransiskus Nago",
    location: "Kecamatan Riung",
    text: "Pengurusan akta kelahiran anak saya berjalan lancar. Persyaratan jelas dan proses cepat. Sangat memuaskan.",
    rating: 4,
  },
  {
    id: 5,
    name: "Pelagia Wae",
    location: "Kecamatan Soa",
    text: "Website ini sangat membantu untuk mengetahui informasi layanan. Tidak perlu datang ke kantor hanya untuk bertanya.",
    rating: 5,
  },
  {
    id: 6,
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
        >
          <Star
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
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
}: {
  testimonial: Testimonial;
  index: number;
  animateStars: boolean;
}) {
  return (
    <motion.div
      key={testimonial.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating rating={testimonial.rating} animate={animateStars} />
          </div>

          {/* Quote */}
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mt-0.5">
              <Quote className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed text-sm flex-1">
              &ldquo;{testimonial.text}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 my-4 mt-auto" />

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {testimonial.name.charAt(0)}
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

export function TestimoniSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const clearRotationTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-rotation effect — only manages the interval, no setState in body
  useEffect(() => {
    if (!isInView || showAll || isPaused) {
      clearRotationTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % testimonials.length);
      setProgressKey((k) => k + 1);
    }, ROTATION_INTERVAL);

    return () => {
      clearRotationTimer();
    };
  }, [isInView, showAll, isPaused, clearRotationTimer]);

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
    ? testimonials
    : testimonials.slice(startIndex, startIndex + 3).concat(
        testimonials.slice(0, Math.max(0, startIndex + 3 - testimonials.length))
      );

  const showRotationUI = isInView && !showAll && !isPaused;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <Quote className="h-4 w-4" />
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
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
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">4.8</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rating Rata-rata</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {testimonials.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Testimoni</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <span className="text-2xl font-bold text-green-700">98%</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Puas dengan Layanan</p>
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div
          ref={gridRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              animateStars={isInView}
            />
          ))}
        </div>

        {/* Navigation dots (carousel mode) */}
        <AnimatePresence>
          {!showAll && isInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === startIndex
                      ? "bg-green-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More / Show Less Button + Progress Bar */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <div className="inline-flex flex-col items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (showAll) {
                  handleShowLess();
                } else {
                  handleShowAll();
                }
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
            {/* Progress bar for auto-rotation — CSS animation restarts via key */}
            {showRotationUI && (
              <div className="w-40 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  key={progressKey}
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    animation: `progressFill ${ROTATION_INTERVAL}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Inline keyframes for progress bar */}
      <style jsx global>{`
        @keyframes progressFill {
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
