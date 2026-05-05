"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquarePlus,
  ThumbsUp,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────

interface Review {
  id: number;
  nama: string;
  layanan: string;
  rating: number;
  komentar: string;
  tanggal: string;
  suka: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────

const sampleReviews: Review[] = [
  {
    id: 1,
    nama: "Maria Goreti",
    layanan: "KTP-el",
    rating: 5,
    komentar: "Pelayanan sangat cepat dan profesional! Petugas sangat ramah dan membantu proses perekaman biometrik dengan sabar. KTP-el saya selesai hanya dalam 2 minggu.",
    tanggal: "12 Januari 2025",
    suka: 24,
  },
  {
    id: 2,
    nama: "Yohanes Bere",
    layanan: "Kartu Keluarga",
    rating: 5,
    komentar: "Proses pembuatan KK baru sangat efisien. Dokumen saya diperiksa dengan teliti dan prosesnya selesai dalam hitungan menit. Sangat memuaskan!",
    tanggal: "10 Januari 2025",
    suka: 18,
  },
  {
    id: 3,
    nama: "Anastasia Moe",
    layanan: "Akta Kelahiran",
    rating: 4,
    komentar: "Pengurusan akta kelahiran anak saya berjalan lancar. Petugas menjelaskan setiap langkah dengan jelas. Hanya perlu menunggu agak lama saat jam ramai.",
    tanggal: "8 Januari 2025",
    suka: 15,
  },
  {
    id: 4,
    nama: "Fransiskus Nago",
    layanan: "Pindah Penduduk",
    rating: 5,
    komentar: "Layanan pindah penduduk sangat membantu. Proses sinkronisasi data antar daerah cepat dan tidak ribet. Terima kasih Disdukcapil Ngada!",
    tanggal: "5 Januari 2025",
    suka: 12,
  },
  {
    id: 5,
    nama: "Pelagia Wae",
    layanan: "KTP-el",
    rating: 4,
    komentar: "Pelayanan online sangat memudahkan. Saya bisa cek status KTP-el saya lewat website tanpa perlu datang ke kantor. Inovasi yang bagus!",
    tanggal: "3 Januari 2025",
    suka: 20,
  },
  {
    id: 6,
    nama: "Dominikus Reo",
    layanan: "Akta Kematian",
    rating: 5,
    komentar: "Meskipun dalam situasi berduka, petugas Disdukcapil sangat empatik dan membantu proses pembuatan akta kematian dengan cepat. Terima kasih.",
    tanggal: "1 Januari 2025",
    suka: 9,
  },
  {
    id: 7,
    nama: "Katarina Dho",
    layanan: "Legalisir Dokumen",
    rating: 4,
    komentar: "Proses legalisir dokumen kependudukan gratis dan cepat. Cukup bawa dokumen asli dan fotokopi, selesai dalam waktu singkat.",
    tanggal: "28 Desember 2024",
    suka: 14,
  },
  {
    id: 8,
    nama: "Petrus Mbo",
    layanan: "Kartu Keluarga",
    rating: 5,
    komentar: "Perubahan data KK saya diproses dengan cepat. Petugas sangat cekatan dan profesional. Kantor bersih dan nyaman. Pelayanan publik yang baik!",
    tanggal: "25 Desember 2024",
    suka: 11,
  },
];

const layananOptions = [
  { value: "ktp", label: "KTP-el" },
  { value: "kk", label: "Kartu Keluarga" },
  { value: "akta-lahir", label: "Akta Kelahiran" },
  { value: "akta-kematian", label: "Akta Kematian" },
  { value: "pindah", label: "Pindah Penduduk" },
  { value: "legalisir", label: "Legalisir Dokumen" },
  { value: "skp", label: "Surat Keterangan Pindah" },
  { value: "lainnya", label: "Lainnya" },
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
            whileHover={interactive ? { scale: 1.15 } : undefined}
            whileTap={interactive ? { scale: 0.9 } : undefined}
            onMouseEnter={() => interactive && setHoverRating(i + 1)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onChange && onChange(i + 1)}
            className={`focus:outline-none ${interactive ? "cursor-pointer" : "cursor-default"}`}
            aria-label={interactive ? `Bintang ${i + 1}` : undefined}
          >
            <Star
              className={`${sizeMap[size]} transition-colors ${
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

// ─── Initials Avatar ──────────────────────────────────────────────────

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
      {initials}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      key={review.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-xl">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <InitialsAvatar name={review.nama} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {review.nama}
                </h4>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                  {review.tanggal}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">•</span>
                <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                  {review.layanan}
                </span>
              </div>
            </div>
          </div>

          {/* Comment */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            {review.komentar}
          </p>

          {/* Like button */}
          <button
            onClick={() => setLiked(!liked)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            aria-label="Suka ulasan ini"
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${liked ? "fill-green-600 text-green-600 dark:fill-green-400 dark:text-green-400" : ""}`} />
            <span className="tabular-nums">{liked ? review.suka + 1 : review.suka}</span>
            <span className="hidden sm:inline">orang merasa terbantu</span>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Review Form Dialog ───────────────────────────────────────────────

function ReviewFormDialog() {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [layanan, setLayanan] = useState("");
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!layanan || rating === 0 || !komentar.trim()) {
      toast.error("Harap lengkapi semua field yang diperlukan");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ulasan berhasil dikirim!", {
        description: "Terima kasih atas masukan Anda. Ulasan akan ditinjau oleh tim kami.",
        duration: 5000,
      });
      // Reset form
      setNama("");
      setLayanan("");
      setRating(0);
      setKomentar("");
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Tulis Ulasan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Tulis Ulasan Layanan
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Bagikan pengalaman Anda menggunakan layanan Disdukcapil Kabupaten Ngada.
            Ulasan Anda membantu kami meningkatkan kualitas pelayanan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nama (optional) */}
          <div className="space-y-2">
            <Label htmlFor="review-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama <span className="text-gray-400 dark:text-gray-500">(opsional)</span>
            </Label>
            <input
              id="review-name"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-all"
            />
          </div>

          {/* Layanan */}
          <div className="space-y-2">
            <Label htmlFor="review-layanan" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Layanan <span className="text-red-500">*</span>
            </Label>
            <Select value={layanan} onValueChange={setLayanan}>
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder="-- Pilih layanan yang digunakan --" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {layananOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} size="lg" interactive onChange={setRating} />
              {rating > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {rating}/5
                </motion.span>
              )}
            </div>
          </div>

          {/* Komentar */}
          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ulasan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review-comment"
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tulis ulasan Anda tentang layanan yang Anda gunakan..."
              rows={4}
              className="text-sm resize-none focus:ring-green-500/40 focus:border-green-500"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Ulasan akan ditinjau oleh tim kami sebelum dipublikasikan.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="h-4 w-4 mr-2" />
                </motion.div>
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Kirim Ulasan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function UlasanRatingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalReviews = sampleReviews.length;
    const avgRating = sampleReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = sampleReviews.filter((r) => r.rating === star).length;
      return { star, count, percent: (count / totalReviews) * 100 };
    });
    return { totalReviews, avgRating: avgRating.toFixed(1), breakdown };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="ulasan-rating-title"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/3 -right-32 w-72 h-72 bg-yellow-100/20 dark:bg-yellow-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Star className="h-4 w-4 fill-green-600 text-green-600" />
            Ulasan & Rating
          </span>
          <h2
            id="ulasan-rating-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Apa Kata Masyarakat?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Kepuasan Anda adalah prioritas utama kami. Baca ulasan dari masyarakat
            yang telah menggunakan layanan Disdukcapil Kabupaten Ngada.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Overall Rating + Breakdown */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {/* Overall Rating Card */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-6xl font-extrabold text-gray-900 dark:text-gray-100"
                  >
                    {stats.avgRating}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="mt-2"
                  >
                    <StarRating rating={Math.round(Number(stats.avgRating))} size="lg" />
                  </motion.div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Dari <span className="font-semibold text-gray-700 dark:text-gray-300">{stats.totalReviews}</span> ulasan
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                      <ThumbsUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">98% merekomendasikan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rating Breakdown */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Distribusi Rating
                  </h3>
                  <div className="space-y-3">
                    {stats.breakdown.map((item, idx) => (
                      <motion.div
                        key={item.star}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-1 w-12 flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                            {item.star}
                          </span>
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${item.percent}%` } : {}}
                            transition={{ delay: 0.6 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 w-16 text-right tabular-nums flex-shrink-0">
                          {item.count} ({item.percent.toFixed(0)}%)
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Recent Reviews Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.h3
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              Ulasan Terbaru
            </motion.h3>
            <ReviewFormDialog />
          </div>

          {/* Review Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {sampleReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Punya pengalaman dengan layanan kami? Bagikan ulasan Anda!
            </p>
            <ReviewFormDialog />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
