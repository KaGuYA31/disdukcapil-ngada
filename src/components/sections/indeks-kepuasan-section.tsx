"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Star,
  Users,
  TrendingUp,
  Smile,
  MessageCircle,
  ThumbsUp,
  Award,
  ChevronRight,
  Send,
  Zap,
  FileCheck,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────

interface CategoryScore {
  label: string;
  score: number;
  icon: React.ReactNode;
}

interface MonthlyTrend {
  month: string;
  score: number;
}

interface SentimentData {
  label: string;
  percent: number;
  color: string;
  darkColor: string;
}

interface Testimonial {
  name: string;
  rating: number;
  quote: string;
  role: string;
}

// ─── Data ─────────────────────────────────────────────────────────────

const OVERALL_SCORE = 4.6;
const TOTAL_RESPONDENTS = 2847;

const categoryScores: CategoryScore[] = [
  { label: "Persyaratan Dokumen", score: 4.7, icon: <FileCheck className="h-4 w-4" /> },
  { label: "Waktu Pelayanan", score: 4.3, icon: <Clock className="h-4 w-4" /> },
  { label: "Kualitas Pelayanan", score: 4.8, icon: <Award className="h-4 w-4" /> },
  { label: "Kedisiplinan Petugas", score: 4.5, icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Fasilitas Pelayanan", score: 4.2, icon: <Building2 className="h-4 w-4" /> },
  { label: "Keterjangkauan Biaya", score: 5.0, icon: <Zap className="h-4 w-4" /> },
];

const monthlyTrends: MonthlyTrend[] = [
  { month: "Jan 2025", score: 4.4 },
  { month: "Feb 2025", score: 4.5 },
  { month: "Mar 2025", score: 4.3 },
  { month: "Apr 2025", score: 4.7 },
  { month: "Mei 2025", score: 4.6 },
  { month: "Jun 2025", score: 4.8 },
];

const sentimentData: SentimentData[] = [
  { label: "Sangat Puas", percent: 45, color: "#22c55e", darkColor: "#4ade80" },
  { label: "Puas", percent: 35, color: "#14b8a6", darkColor: "#2dd4bf" },
  { label: "Cukup", percent: 12, color: "#f59e0b", darkColor: "#fbbf24" },
  { label: "Kurang Puas", percent: 5, color: "#f97316", darkColor: "#fb923c" },
  { label: "Tidak Puas", percent: 3, color: "#ef4444", darkColor: "#f87171" },
];

const testimonials: Testimonial[] = [
  {
    name: "M. W***a",
    rating: 5,
    quote: "Pelayanan pembuatan KTP-el sangat cepat dan profesional. Petugas ramah dan prosesnya efisien. Sangat puas!",
    role: "Pengurus KTP-el",
  },
  {
    name: "A. T***a",
    rating: 5,
    quote: "Kantor bersih, petugas disiplin, dan proses pembuatan KK selesai kurang dari 30 menit. Luar biasa!",
    role: "Pengurus KK",
  },
  {
    name: "Y. B***e",
    rating: 4,
    quote: "Layanan pengurusan akta kelahiran anak saya berjalan lancar. Inovasi digitalnya sangat membantu.",
    role: "Pengurus Akta",
  },
];

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
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const floatOrb = {
  hidden: { opacity: 0 },
  animate: (i: number) => ({
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.2, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i,
    },
  }),
};

// ─── Animated Counter Hook ────────────────────────────────────────────

function useAnimatedCounter(target: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, isInView]);

  return count;
}

// ─── Circular Progress Component ──────────────────────────────────────

function CircularProgress({
  score,
  maxScore,
  isInView,
  size = 180,
  strokeWidth = 10,
}: {
  score: number;
  maxScore: number;
  isInView: boolean;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = score / maxScore;
  const animatedScore = useAnimatedCounter(score, 1800, isInView);
  const gradientId = "scoreGradient";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-100 dark:text-gray-800"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: circumference * (1 - percent) } : {}}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          className="drop-shadow-sm"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent tabular-nums"
        >
          {animatedScore.toFixed(1)}
        </motion.span>
        <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
          /{maxScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

// ─── Star Rating Component ────────────────────────────────────────────

function StarRating({
  rating,
  size = "sm",
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (val: number) => void;
}) {
  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hoverRating || rating);
        return (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={interactive ? { scale: 0.9 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onMouseEnter={() => interactive && setHoverRating(i + 1)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onChange && onChange(i + 1)}
            className={`focus:outline-none ${interactive ? "cursor-pointer" : "cursor-default"}`}
            aria-label={interactive ? `Bintang ${i + 1}` : undefined}
          >
            <Star
              className={`${sizeMap[size]} transition-colors duration-200 ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-600"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Sentiment Donut Chart ────────────────────────────────────────────

function SentimentDonut({ isInView }: { isInView: boolean }) {
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = sentimentData.reduce<Array<{
    label: string;
    percent: number;
    color: string;
    darkColor: string;
    offset: number;
    length: number;
  }>>((acc, item) => {
    const lastOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].length : 0;
    const segmentLength = (item.percent / 100) * circumference;
    acc.push({ ...item, offset: lastOffset, length: segmentLength });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-800"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {segments.map((seg, idx) => (
            <motion.circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={seg.length}
              strokeDashoffset={-seg.offset}
              initial={{ opacity: 0, strokeDasharray: 0, strokeDashoffset: -seg.offset }}
              animate={
                isInView
                  ? { opacity: 1, strokeDasharray: seg.length, strokeDashoffset: -seg.offset }
                  : {}
              }
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 + idx * 0.15 }}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-lg font-bold text-green-600 dark:text-green-400"
          >
            {sentimentData[0].label}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums"
          >
            {sentimentData[0].percent}%
          </motion.span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {sentimentData.map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1 + sentimentData.indexOf(item) * 0.08 }}
            className="flex items-center gap-1.5"
          >
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.label}{" "}
              <span className="font-semibold tabular-nums">{item.percent}%</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Feedback Form ──────────────────────────────────────────────

function QuickFeedbackForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (rating === 0) {
      toast.error("Silakan pilih rating terlebih dahulu");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Terima kasih atas masukan Anda!", {
        description: "Feedback Anda sangat berarti untuk meningkatkan kualitas layanan kami.",
        duration: 5000,
      });
    }, 1500);
  }, [rating]);

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/25"
          >
            <Smile className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Terima kasih!
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            Masukan Anda telah kami terima dan akan ditinjau.
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {/* Star Rating Input */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Bagaimana pengalaman Anda?
            </p>
            <div className="flex justify-center">
              <StarRating rating={rating} size="lg" interactive onChange={setRating} />
            </div>
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2"
              >
                {rating}/5 — {rating >= 4 ? "Sangat Baik!" : rating >= 3 ? "Baik" : "Perlu Perbaikan"}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 200))}
              placeholder="Tulis komentar Anda (opsional)..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-all resize-none"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 text-right tabular-nums">
              {comment.length}/200
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="h-4 w-4" />
                </motion.div>
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Kirim Feedback
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group/card"
    >
      <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-400/5 transition-all duration-300 rounded-xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-md card-accent-top">
        <CardContent className="p-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                {testimonial.name.charAt(0)}
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-teal-500 -z-[1] scale-110 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {testimonial.name}
              </h4>
              <p className="text-[11px] text-green-600 dark:text-green-400">{testimonial.role}</p>
            </div>
          </div>

          {/* Stars */}
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>

          {/* Quote */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-green-300 dark:border-green-700 pl-3">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Skeleton Component ───────────────────────────────────────────────

export function IndeksKepuasanSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Hero skeleton */}
      <div className="h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900" />

      <div className="container mx-auto px-4 relative mt-12">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="h-10 w-64 bg-gray-200/60 dark:bg-gray-700/40 rounded-lg mx-auto mb-3" />
          <div className="h-4 w-80 bg-gray-200/40 dark:bg-gray-700/30 rounded-md mx-auto" />
        </div>

        {/* Overall score skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="h-72 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
          <div className="h-72 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
        </div>

        {/* Categories skeleton */}
        <div className="h-64 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl mb-10 animate-shimmer" />

        {/* Trend + Sentiment skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="h-64 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
          <div className="h-64 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
        </div>

        {/* Testimonials skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200/60 dark:bg-gray-700/40 rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function IndeksKepuasanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const trendRef = useRef<HTMLDivElement>(null);
  const trendInView = useInView(trendRef, { once: true, margin: "-50px" });

  const sentimentRef = useRef<HTMLDivElement>(null);
  const sentimentInView = useInView(sentimentRef, { once: true, margin: "-50px" });

  const animatedScore = useAnimatedCounter(OVERALL_SCORE, 1800, isInView);
  const animatedRespondents = useAnimatedCounter(TOTAL_RESPONDENTS, 2200, isInView);

  const maxTrendScore = Math.max(...monthlyTrends.map((t) => t.score));

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="indeks-kepuasan-title"
    >
      {/* ── Gradient Hero Banner ── */}
      <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
        {/* SVG Diamond Pattern Overlay */}
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
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Indeks Kepuasan Masyarakat
              </h1>
              <p className="text-green-200/80 text-sm mt-0.5">
                Hasil survei kepuasan layanan masyarakat Disdukcapil Kabupaten Ngada
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Background ── */}
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] top-[120px] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2315803d' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 top-[120px] bg-gradient-to-b from-white/0 via-green-50/20 to-white/0 dark:via-green-950/10 pointer-events-none" />
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -right-32 w-72 h-72 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
      <div className="absolute top-2/3 right-1/4 w-56 h-56 bg-emerald-100/15 dark:bg-emerald-900/8 rounded-full blur-3xl" />

      {/* Floating decorative shapes */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-3 h-3 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-16 w-4 h-4 border-2 border-green-400/20 rounded-sm opacity-30 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-60 left-1/3 w-2 h-2 bg-teal-400/20 rounded-full hidden lg:block"
      />

      <div className="container mx-auto px-4 relative">
        {/* ── Section Header ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2
            id="indeks-kepuasan-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2 animated-underline inline-block"
          >
            Indeks Kepuasan Masyarakat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Transparansi pelayanan publik melalui data survei kepuasan masyarakat.
            Hasil ini menjadi acuan kami untuk terus meningkatkan kualitas layanan.
          </p>
        </motion.div>

        {/* ── Overall Score + Sentiment Donut ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Overall Score Card */}
          <motion.div variants={cardVariants}>
            <div className="relative rounded-xl overflow-hidden">
              {/* Animated rotating gradient border */}
              <div
                className="absolute -inset-[2px] bg-gradient-to-r from-green-500 via-teal-500 to-green-600 rounded-xl animate-rotate-gradient opacity-60 hover:opacity-100 transition-opacity duration-500"
                style={{ zIndex: 0 }}
              />
              <div className="absolute -inset-[2px] rounded-xl overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 animate-rotate-gradient" />
              </div>
              <Card className="relative bg-white dark:bg-gray-900 rounded-xl border-0 overflow-hidden" style={{ zIndex: 1 }}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/30 text-xs font-semibold mb-6 px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      Skor Keseluruhan 2025
                    </Badge>

                    {/* Circular Progress */}
                    <CircularProgress
                      score={OVERALL_SCORE}
                      maxScore={5.0}
                      isInView={isInView}
                      size={180}
                      strokeWidth={10}
                    />

                    {/* Rating Label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.8 }}
                      className="mt-4 flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-1.5 rounded-full border border-green-200/50 dark:border-green-800/30">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                          Sangat Baik
                        </span>
                      </div>
                      <StarRating rating={Math.round(OVERALL_SCORE)} size="md" />
                    </motion.div>

                    {/* Respondent Count */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 1 }}
                      className="mt-4 flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                          {Math.round(animatedRespondents).toLocaleString("id-ID")}
                        </span>{" "}
                        Responden
                      </span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Sentiment Distribution */}
          <motion.div variants={cardVariants} ref={sentimentRef}>
            <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm bg-white/70 dark:bg-gray-800/50 backdrop-blur-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center">
                    <Smile className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Distribusi Sentimen
                  </h3>
                </div>
                <SentimentDonut isInView={sentimentInView} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── Satisfaction Breakdown by Category ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12"
        >
          <motion.h3
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2"
          >
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Kepuasan per Kategori
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryScores.map((cat, idx) => (
              <motion.div
                key={cat.label}
                variants={cardVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                        {cat.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                        {cat.score.toFixed(1)}
                      </span>
                      {cat.score >= 5.0 && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/30 text-[10px] px-2 py-0.5 font-bold">
                          GRATIS
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(cat.score / 5) * 100}%` } : {}}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full shimmer-progress"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <StarRating rating={Math.round(cat.score)} />
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                      {((cat.score / 5) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Trend Chart + Quick Feedback ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12"
        >
          {/* Monthly Trend Chart */}
          <motion.div variants={cardVariants} className="lg:col-span-3" ref={trendRef}>
            <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm bg-white/70 dark:bg-gray-800/50 backdrop-blur-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tren Kepuasan Bulanan
                  </h3>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/30 text-[10px] px-2 py-0.5 ml-auto">
                    2025
                  </Badge>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="space-y-3">
                  {monthlyTrends.map((item, idx) => (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                          {item.month}
                        </span>
                        <div className="flex-1 mx-3">
                          <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative group/bar">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                trendInView
                                  ? { width: `${(item.score / maxTrendScore) * 100}%` }
                                  : {}
                              }
                              transition={{
                                delay: 0.2 + idx * 0.1,
                                duration: 0.7,
                                ease: "easeOut",
                              }}
                              className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-md relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                            </motion.div>
                            {/* Tooltip on hover */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200">
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded shadow-sm tabular-nums">
                                {item.score.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8 text-right tabular-nums flex-shrink-0">
                          {item.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trend indicator */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-[11px] font-semibold text-green-700 dark:text-green-400">
                      +0.4 dari bulan sebelumnya
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Feedback Form */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm bg-white/70 dark:bg-gray-800/50 backdrop-blur-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Feedback Cepat
                  </h3>
                </div>
                <QuickFeedbackForm />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── Testimonial Highlights ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2"
          >
            <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            Kata Mereka
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </motion.div>

        {/* ── Footer Note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-10"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            Data survei dikumpulkan periode Januari - Juni 2025 melalui formulir digital dan kotak saran di kantor.
            Hasil bersifat akumulatif dan dapat berubah setiap periode evaluasi.
          </p>
        </motion.div>
      </div>

      {/* Shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
