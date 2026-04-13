"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, PenLine, CheckCircle2, Loader2, Phone, User, Briefcase, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KECAMATAN_LIST = [
  "Aimere",
  "Bajawa",
  "Bajawa Utara",
  "Golewa",
  "Golewa Barat",
  "Golewa Selatan",
  "Inerie",
  "Jerebuu",
  "Riung",
  "Riung Barat",
  "Soa",
  "Wolomeze",
];

const RATING_LABELS: Record<number, string> = {
  1: "Sangat Kurang",
  2: "Kurang",
  3: "Cukup",
  4: "Baik",
  5: "Sangat Baik",
};

interface FormData {
  nama: string;
  pekerjaan: string;
  kecamatan: string;
  rating: number;
  isi: string;
  noTelepon: string;
}

interface FormErrors {
  nama?: string;
  isi?: string;
  rating?: string;
  noTelepon?: string;
  general?: string;
}

// Global event system so TestimoniSection can trigger the dialog
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function openTestimoniDialog() {
  listeners.forEach((fn) => fn());
}

export function onTestimoniDialogOpen(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function StarRatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starVal = i + 1;
          const isFilled = starVal <= (hovered || value);
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHovered(starVal)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(starVal)}
              className="focus:outline-none p-0.5"
              aria-label={`Rating ${starVal} bintang`}
            >
              <Star
                className={`h-8 w-8 transition-colors duration-150 ${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
                }`}
              />
            </motion.button>
          );
        })}
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[20px]">
        {value > 0 && (
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {RATING_LABELS[value]}
          </motion.span>
        )}
      </p>
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
        className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Testimoni Terkirim!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
        Terima kasih atas testimoni Anda. Testimoni akan ditinjau oleh admin
        sebelum ditampilkan di website.
      </p>
      <Button
        onClick={onClose}
        className="bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        Tutup
      </Button>
    </motion.div>
  );
}

function TestimoniForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<FormData>({
    nama: "",
    pekerjaan: "",
    kecamatan: "",
    rating: 0,
    isi: "",
    noTelepon: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field as keyof FormErrors];
          return next;
        });
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    } else if (form.nama.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }

    if (!form.isi.trim()) {
      newErrors.isi = "Isi testimoni wajib diisi";
    } else if (form.isi.trim().length < 10) {
      newErrors.isi = "Isi testimoni minimal 10 karakter";
    } else if (form.isi.trim().length > 1000) {
      newErrors.isi = "Isi testimoni maksimal 1000 karakter";
    }

    if (form.rating === 0) {
      newErrors.rating = "Silakan pilih rating";
    }

    if (form.noTelepon.trim()) {
      const cleaned = form.noTelepon.trim().replace(/[\s\-()]/g, "");
      const phoneRegex = /^(\+62|62|0)?8[1-9][0-9]{6,11}$/;
      if (!phoneRegex.test(cleaned)) {
        newErrors.noTelepon = "Format nomor tidak valid. Gunakan format 08xx atau +62xx";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        onSubmit(form);
      }
    },
    [form, onSubmit, validate]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nama */}
      <div className="space-y-2">
        <Label htmlFor="testimoni-nama" className="text-sm font-medium">
          Nama Lengkap <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="testimoni-nama"
            placeholder="Masukkan nama lengkap Anda"
            value={form.nama}
            onChange={(e) => updateField("nama", e.target.value)}
            className="pl-9"
            maxLength={100}
          />
        </div>
        {errors.nama && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors.nama}
          </motion.p>
        )}
      </div>

      {/* Pekerjaan & Kecamatan - side by side on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testimoni-pekerjaan" className="text-sm font-medium">
            Pekerjaan
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="testimoni-pekerjaan"
              placeholder="Contoh: Guru, Petani"
              value={form.pekerjaan}
              onChange={(e) => updateField("pekerjaan", e.target.value)}
              className="pl-9"
              maxLength={100}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimoni-kecamatan" className="text-sm font-medium">
            Kecamatan
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            <Select
              value={form.kecamatan}
              onValueChange={(v) => updateField("kecamatan", v)}
            >
              <SelectTrigger id="testimoni-kecamatan" className="pl-9 w-full">
                <SelectValue placeholder="Pilih kecamatan" />
              </SelectTrigger>
              <SelectContent>
                {KECAMATAN_LIST.map((kec) => (
                  <SelectItem key={kec} value={kec}>
                    Kec. {kec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Nomor Telepon */}
      <div className="space-y-2">
        <Label htmlFor="testimoni-telepon" className="text-sm font-medium">
          Nomor Telepon
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="testimoni-telepon"
            type="tel"
            placeholder="Contoh: 08123456789"
            value={form.noTelepon}
            onChange={(e) => updateField("noTelepon", e.target.value)}
            className="pl-9"
            maxLength={15}
          />
        </div>
        {errors.noTelepon && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors.noTelepon}
          </motion.p>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Rating <span className="text-red-500">*</span>
        </Label>
        <StarRatingSelector
          value={form.rating}
          onChange={(v) => updateField("rating", v)}
        />
        {errors.rating && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 text-center"
          >
            {errors.rating}
          </motion.p>
        )}
      </div>

      {/* Isi Testimoni */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="testimoni-isi" className="text-sm font-medium">
            Isi Testimoni <span className="text-red-500">*</span>
          </Label>
          <span
            className={`text-xs ${
              form.isi.length > 1000
                ? "text-red-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {form.isi.length}/1000
          </span>
        </div>
        <Textarea
          id="testimoni-isi"
          placeholder="Ceritakan pengalaman Anda menggunakan layanan Disdukcapil Ngada..."
          value={form.isi}
          onChange={(e) => updateField("isi", e.target.value)}
          className="min-h-[100px] resize-none"
          maxLength={1000}
        />
        {errors.isi && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors.isi}
          </motion.p>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-11"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <PenLine className="mr-2 h-4 w-4" />
            Kirim Testimoni
          </>
        )}
      </Button>
    </form>
  );
}

export function AddTestimoniWidget() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for external open requests from TestimoniSection
  const handleOpenRequest = useCallback(() => {
    setShowSuccess(false);
    setError(null);
    setOpen(true);
  }, []);

  // Register listener with proper cleanup
  useEffect(() => {
    const unsub = onTestimoniDialogOpen(handleOpenRequest);
    return unsub;
  }, [handleOpenRequest]);

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 429) {
        setError(result.error || "Terlalu banyak permintaan. Silakan coba lagi nanti.");
        setIsSubmitting(false);
        return;
      }

      if (!response.ok || !result.success) {
        setError(result.error || "Gagal mengirim testimoni. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
    } catch {
      setError("Koneksi gagal. Periksa jaringan internet Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Delay reset so the animation plays
    setTimeout(() => {
      setShowSuccess(false);
      setError(null);
    }, 200);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenRequest}
            className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
            aria-label="Tulis Testimoni"
          >
            <PenLine className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating label */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-[5.5rem] right-6 z-40"
          >
            <div className="bg-gray-900/80 dark:bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap backdrop-blur-sm">
              Tulis Testimoni
              <div className="absolute right-3 -bottom-1 w-2 h-2 bg-gray-900/80 dark:bg-gray-800/90 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Tulis Testimoni
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Bagikan pengalaman Anda menggunakan layanan Disdukcapil Kabupaten Ngada
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <SuccessState onClose={handleClose} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TestimoniForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={error}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
