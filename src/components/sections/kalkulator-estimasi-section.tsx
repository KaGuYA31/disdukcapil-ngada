"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Clock,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Calendar,
  DollarSign,
  Lightbulb,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────

interface LayananData {
  id: string;
  nama: string;
  estimasiNormal: [number, number]; // [min, max] hari kerja
  estimasiExpress: [number, number];
  persyaratan: string[];
  biaya: string;
  biayaDetail: string;
  isGratis: boolean;
  tips: string[];
  waktuTerbaik: string;
}

interface KondisiKhusus {
  id: string;
  label: string;
  perubahanHari: number;
  icon: "plus" | "minus";
}

// ─── Data ─────────────────────────────────────────────────────────────

const LAYANAN_LIST: LayananData[] = [
  {
    id: "ktp-baru",
    nama: "KTP-el Baru",
    estimasiNormal: [3, 5],
    estimasiExpress: [1, 2],
    persyaratan: [
      "Surat Pengantar RT/RW",
      "Kartu Keluarga (KK) Asli",
      "Akta Kelahiran",
      "Pas Foto 3x4 (2 lembar)",
      "Surat Pindah (jika dari luar daerah)",
      "Formulir Isian F-1.01",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Datang pada hari Selasa-Kamis untuk antrian lebih singkat",
      "Bawa fotokopi semua dokumen sebagai cadangan",
      "Pastikan data di KK sudah sesuai",
      "Gunakan pakaian rapi untuk perekaman biometrik",
    ],
    waktuTerbaik: "Selasa - Kamis, 08:00 - 10:00 WITA",
  },
  {
    id: "ktp-perpanjangan",
    nama: "Perpanjangan KTP-el",
    estimasiNormal: [2, 4],
    estimasiExpress: [1, 2],
    persyaratan: [
      "KTP-el lama (masih berlaku/kedaluwarsa)",
      "Kartu Keluarga (KK) Asli",
      "Pas Foto 3x4 (2 lembar)",
      "Formulir Isian F-1.08",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Lakukan perpanjangan sebelum KTP kedaluwarsa",
      "Datang pagi hari untuk proses lebih cepat",
      "Bawa KTP lama sebagai bukti identitas",
    ],
    waktuTerbaik: "Senin - Rabu, 08:00 - 09:30 WITA",
  },
  {
    id: "kk-baru",
    nama: "KK Baru",
    estimasiNormal: [5, 7],
    estimasiExpress: [3, 4],
    persyaratan: [
      "Surat Pengantar RT/RW",
      "KTP-el Kepala Keluarga",
      "Akta Kelahiran seluruh anggota",
      "Surat Nikah/Cerai (jika ada)",
      "Surat Pindah (jika dari luar daerah)",
      "Ijazah/Surat Keterangan Pendidikan",
      "Formulir Isian F-1.01",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Siapkan semua akta kelahiran anggota keluarga",
      "Verifikasi data di kantor kelurahan terlebih dahulu",
      "Datang lengkap dengan seluruh anggota keluarga yang tercatat",
    ],
    waktuTerbaik: "Selasa - Kamis, 08:00 - 10:00 WITA",
  },
  {
    id: "kk-perubahan",
    nama: "Perubahan KK",
    estimasiNormal: [3, 5],
    estimasiExpress: [1, 3],
    persyaratan: [
      "KK Asli yang akan diubah",
      "KTP-el Kepala Keluarga",
      "Dokumen pendukung perubahan (akta kelahiran/surat nikah/surat pindah)",
      "Surat Pengantar RT/RW",
      "Formulir Isian F-1.15/F-1.16",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Tentukan jenis perubahan terlebih dahulu",
      "Bawa dokumen asli yang menjadi dasar perubahan",
      "Minta surat pengantar dari RT/RW sebelumnya",
    ],
    waktuTerbaik: "Senin - Rabu, 08:00 - 10:00 WITA",
  },
  {
    id: "akta-lahir",
    nama: "Akta Kelahiran",
    estimasiNormal: [3, 5],
    estimasiExpress: [1, 2],
    persyaratan: [
      "Surat Keterangan Kelahiran dari RS/Bidan",
      "KTP-el kedua orang tua",
      "KK kedua orang tua",
      "Surat Nikah/Catatan SIPIL",
      "Surat Pengantar RT/RW",
      "Dua orang saksi dengan KTP-el",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Urus paling lambat 60 hari setelah kelahiran",
      "Siapkan surat keterangan dari rumah sakit/bidan",
      "Bawa buku nikah asli kedua orang tua",
    ],
    waktuTerbaik: "Selasa - Kamis, 08:00 - 10:00 WITA",
  },
  {
    id: "akta-mati",
    nama: "Akta Kematian",
    estimasiNormal: [2, 3],
    estimasiExpress: [1, 1],
    persyaratan: [
      "Surat Keterangan Kematian dari RS/Dokter",
      "KTP-el almarhum/almarhumah",
      "KK Asli",
      "Surat Pengantar RT/RW",
      "KTP-el pelapor (keluarga)",
      "Dua orang saksi dengan KTP-el",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Urus sesegera mungkin setelah kematian",
      "Bawa surat keterangan dari rumah sakit/dokter",
      "Siapkan KK asli untuk pembaruan",
    ],
    waktuTerbaik: "Senin - Jumat, 08:00 - 10:00 WITA",
  },
  {
    id: "akta-nikah",
    nama: "Akta Perkawinan",
    estimasiNormal: [3, 5],
    estimasiExpress: [2, 3],
    persyaratan: [
      "Surat Nikah dari KUA",
      "KTP-el kedua pasangan",
      "KK kedua pasangan",
      "Pas Foto 3x4 (4 lembar)",
      "Surat Pengantar RT/RW",
      "Akta Kelahiran kedua pasangan",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Urus setelah mendapat surat nikah dari KUA",
      "Bawa pas foto berwarna latar belakang merah",
      "Kedua pasangan sebaiknya hadir bersama",
    ],
    waktuTerbaik: "Selasa - Kamis, 08:00 - 10:00 WITA",
  },
  {
    id: "pindah-domisili",
    nama: "Pindah Domisili",
    estimasiNormal: [7, 14],
    estimasiExpress: [4, 7],
    persyaratan: [
      "Surat Pengantar RT/RW asal dan tujuan",
      "KTP-el dan KK Asli",
      "Surat Keterangan Pindah dari Disdukcapil asal",
      "Surat Keterangan Domisili dari kelurahan tujuan",
      "Pas Foto 3x4 (4 lembar)",
      "Ijazah terakhir",
      "Surat Keterangan Kerja (jika bekerja)",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Urus surat pindah di Disdukcapil asal terlebih dahulu",
      "Siapkan semua dokumen asli dan fotokopi",
      "Proses sinkronisasi antar daerah membutuhkan waktu",
      "Pastikan sudah punya alamat tujuan yang jelas",
    ],
    waktuTerbaik: "Senin - Rabu, 08:00 - 09:30 WITA",
  },
  {
    id: "skck",
    nama: "SKCK",
    estimasiNormal: [1, 3],
    estimasiExpress: [1, 1],
    persyaratan: [
      "KTP-el Asli dan Fotokopi",
      "Pas Foto 4x6 latar belakang merah (6 lembar)",
      "Surat Pengantar RT/RW",
      "Fotokopi Akta Kelahiran",
      "Fotokopi KK",
      "Sidik Jari (diambil di kantor polisi)",
    ],
    biaya: "Rp 30.000",
    biayaDetail: "Biaya resmi kepolisian sesuai Perkap No. 4 Tahun 2010",
    isGratis: false,
    tips: [
      "Datang pagi hari untuk proses lebih cepat",
      "Siapkan pas foto latar belakang merah",
      "SKCK berlaku 6 bulan sejak diterbitkan",
    ],
    waktuTerbaik: "Selasa - Kamis, 08:00 - 09:00 WITA",
  },
  {
    id: "legalisir",
    nama: "Legalisir Dokumen",
    estimasiNormal: [1, 2],
    estimasiExpress: [1, 1],
    persyaratan: [
      "Dokumen asli yang akan dilegalisir",
      "KTP-el Pemohon",
      "Fotokopi dokumen (minimal 2 rangkap)",
      "Surat Pengantar RT/RW (untuk keperluan tertentu)",
    ],
    biaya: "GRATIS",
    biayaDetail: "Sesuai UU No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    isGratis: true,
    tips: [
      "Siapkan fotokopi dokumen yang cukup",
      "Pastikan dokumen asli dalam kondisi baik",
      "Legalisir dapat selesai dalam satu hari jika datang pagi",
    ],
    waktuTerbaik: "Senin - Jumat, 08:00 - 10:00 WITA",
  },
];

const KONDISI_KHUSUS: KondisiKhusus[] = [
  {
    id: "pindah-luar",
    label: "Pindah dari luar daerah",
    perubahanHari: 3,
    icon: "plus",
  },
  {
    id: "dok-tidak-lengkap",
    label: "Dokumen tidak lengkap",
    perubahanHari: 5,
    icon: "plus",
  },
  {
    id: "dok-lengkap",
    label: "Membawa dokumen pendukung lengkap",
    perubahanHari: -1,
    icon: "minus",
  },
  {
    id: "pagi",
    label: "Datang pagi hari (sebelum 10:00)",
    perubahanHari: -0.5,
    icon: "minus",
  },
];

const TIPS_GLOBAL: string[] = [
  "Bawa dokumen asli beserta fotokopi untuk setiap persyaratan",
  "Datang pada hari kerja Selasa-Kamis untuk menghindari kepadatan",
  "Gunakan pakaian rapi dan sopan saat ke kantor Disdukcapil",
  "Verifikasi kelengkapan dokumen melalui WhatsApp atau telepon sebelum datang",
  "Simpan tanda terima sebagai bukti pengurusan dokumen Anda",
  "Minta informasi estimasi selesai saat pendaftaran di loket",
];

// ─── Animation Variants ───────────────────────────────────────────────

const floatOrb = {
  animate: (delay: number) => ({
    y: [0, -18, 0],
    x: [0, 12, 0],
    scale: [1, 1.08, 1],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  }),
};

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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const stepSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  }),
};

const checklistItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.08,
      ease: "easeOut" as const,
    },
  }),
};

// ─── Animated Counter ─────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200) {
  const [display, setDisplay] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else prevTarget.current = target;
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return display;
}

// ─── Step Progress Indicator ──────────────────────────────────────────

function StepIndicator({
  currentStep,
  totalSteps = 3,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  const steps = [
    { label: "Pilih Layanan", icon: Calculator },
    { label: "Kondisi Khusus", icon: FileCheck },
    { label: "Hasil Estimasi", icon: Sparkles },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const StepIcon = step.icon;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isActive
                    ? "#059669"
                    : isCompleted
                      ? "#10b981"
                      : "transparent",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive
                    ? "border-green-600 shadow-lg shadow-green-500/30"
                    : isCompleted
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <StepIcon
                    className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400 dark:text-gray-500"}`}
                  />
                )}
              </motion.div>
              <span
                className={`text-[11px] mt-1.5 font-medium text-center max-w-[80px] leading-tight ${
                  isActive
                    ? "text-green-700 dark:text-green-400"
                    : isCompleted
                      ? "text-green-600 dark:text-green-500"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className="relative w-16 sm:w-24 h-0.5 mx-2 mb-5">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                    backgroundColor: isCompleted ? "#10b981" : "#e5e7eb",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tips Carousel ────────────────────────────────────────────────────

function TipsCarousel({ tips }: { tips: string[] }) {
  const [activeTip, setActiveTip] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tips.length]);

  return (
    <div className="relative min-h-[80px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30"
        >
          <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {tips[activeTip]}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTip(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === activeTip
                ? "bg-green-500 w-4"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label={`Tips ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function KalkulatorEstimasiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [kondisiAktif, setKondisiAktif] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());
  const [animCounterKey, setAnimCounterKey] = useState(0);

  // Derived data
  const layananData = LAYANAN_LIST.find((l) => l.id === selectedLayanan);

  const calculatedResult = layananData
    ? (() => {
        const [minBase, maxBase] = layananData.estimasiNormal;
        let additional = 0;
        kondisiAktif.forEach((kId) => {
          const kondisi = KONDISI_KHUSUS.find((k) => k.id === kId);
          if (kondisi) additional += kondisi.perubahanHari;
        });
        const minDays = Math.max(1, minBase + additional);
        const maxDays = Math.max(minDays, maxBase + additional);
        return { minDays, maxDays, additional };
      })()
    : null;

  const animatedMin = useAnimatedCounter(
    showResult && calculatedResult ? calculatedResult.minDays : 0,
    1400
  );
  const animatedMax = useAnimatedCounter(
    showResult && calculatedResult ? calculatedResult.maxDays : 0,
    1400
  );

  const goNext = () => {
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
      if (currentStep === 1) {
        setShowResult(true);
        setAnimCounterKey((k) => k + 1);
        setCheckedDocs(new Set());
      }
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      if (currentStep === 2) setShowResult(false);
    }
  };

  const toggleKondisi = useCallback((id: string) => {
    setKondisiAktif((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleDoc = useCallback((index: number) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const resetCalculator = () => {
    setCurrentStep(0);
    setDirection(0);
    setSelectedLayanan("");
    setKondisiAktif(new Set());
    setShowResult(false);
    setCheckedDocs(new Set());
    setAnimCounterKey((k) => k + 1);
  };

  // Floating shapes
  const floatingShapes = [
    { size: "w-16 h-16", className: "rounded-full border-2 border-green-300/20 dark:border-green-700/20 top-[15%] right-[5%]", duration: 6 },
    { size: "w-10 h-10", className: "rounded-lg border-2 border-teal-300/20 dark:border-teal-700/20 top-[45%] left-[3%] rotate-45", duration: 8 },
    { size: "w-6 h-6", className: "rounded-full bg-emerald-300/15 dark:bg-emerald-700/15 bottom-[25%] right-[8%]", duration: 10 },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      aria-labelledby="kalkulator-estimasi-title"
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
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h2
                id="kalkulator-estimasi-title"
                className="text-2xl md:text-3xl font-bold text-white"
              >
                Kalkulator Estimasi Layanan
              </h2>
              <p className="text-green-200/80 text-sm mt-0.5">
                Estimasi waktu dan persyaratan untuk setiap layanan kependudukan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Background Pattern & Decorations ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #059669 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/15 dark:bg-emerald-900/5 rounded-full blur-3xl" />

      {/* Floating shapes (hidden on mobile) */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, index % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 1.2,
          }}
          className={`absolute hidden md:block ${shape.size} ${shape.className}`}
        />
      ))}

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 relative py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Step Progress Indicator */}
          <motion.div variants={headerVariants}>
            <StepIndicator currentStep={currentStep} />
          </motion.div>

          {/* Wizard Steps */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* ── Step 1: Pilih Layanan ── */}
              {currentStep === 0 && (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md shadow-green-500/20">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Pilih Jenis Layanan
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pilih dokumen yang ingin Anda urus
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
                    {LAYANAN_LIST.map((layanan) => {
                      const isSelected = selectedLayanan === layanan.id;
                      return (
                        <motion.button
                          key={layanan.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedLayanan(layanan.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-green-500 bg-green-50/50 dark:bg-green-900/20 shadow-md shadow-green-500/10"
                              : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/30 dark:hover:bg-green-900/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                }`}
                              >
                                {isSelected ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <FileCheck className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-sm ${
                                    isSelected
                                      ? "text-green-800 dark:text-green-300"
                                      : "text-gray-800 dark:text-gray-200"
                                  }`}
                                >
                                  {layanan.nama}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  Estimasi{" "}
                                  {layanan.estimasiNormal[0]}-{layanan.estimasiNormal[1]} hari kerja
                                  {layanan.isGratis && (
                                    <Badge className="ml-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/40 text-[9px] px-1.5 py-0">
                                      GRATIS
                                    </Badge>
                                  )}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              className={`h-4 w-4 transition-colors ${
                                isSelected
                                  ? "text-green-500"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={goNext}
                      disabled={!selectedLayanan}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/25 disabled:opacity-40 disabled:shadow-none transition-all duration-300"
                    >
                      Lanjut
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Kondisi Khusus ── */}
              {currentStep === 1 && (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Kondisi Khusus
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pilih kondisi yang sesuai (opsional)
                      </p>
                    </div>
                  </div>

                  {/* Selected layanan summary */}
                  {layananData && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                          {layananData.nama}
                        </p>
                      </div>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70 ml-6">
                        Estimasi normal: {layananData.estimasiNormal[0]}-{layananData.estimasiNormal[1]} hari kerja
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {KONDISI_KHUSUS.map((kondisi) => {
                      const isActive = kondisiAktif.has(kondisi.id);
                      const isPositive = kondisi.perubahanHari > 0;

                      return (
                        <motion.button
                          key={kondisi.id}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleKondisi(kondisi.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                            isActive
                              ? isPositive
                                ? "border-amber-400 bg-amber-50/50 dark:bg-amber-900/15"
                                : "border-green-400 bg-green-50/50 dark:bg-green-900/15"
                              : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  isActive
                                    ? isPositive
                                      ? "bg-amber-500 border-amber-500"
                                      : "bg-green-500 border-green-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isActive && (
                                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                                )}
                              </div>
                              <p
                                className={`text-sm font-medium ${
                                  isActive
                                    ? isPositive
                                      ? "text-amber-800 dark:text-amber-300"
                                      : "text-green-800 dark:text-green-300"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {kondisi.label}
                              </p>
                            </div>
                            <Badge
                              className={`text-[10px] font-bold px-2 py-0.5 ${
                                isPositive
                                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                                  : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {kondisi.perubahanHari} hari
                            </Badge>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 mb-6">
                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Kondisi khusus akan mempengaruhi estimasi waktu pengerjaan. Pilih
                      sesuai keadaan Anda untuk mendapatkan estimasi yang lebih akurat.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={goPrev}
                      className="gap-1 text-gray-600 dark:text-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Kembali
                    </Button>
                    <Button
                      onClick={goNext}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/25 transition-all duration-300"
                    >
                      Lihat Hasil
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Hasil Estimasi ── */}
              {currentStep === 2 && layananData && calculatedResult && (
                <div className="space-y-6">
                  {/* Result Header */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {layananData.nama}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Berikut estimasi pengurusan Anda
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetCalculator}
                        className="text-xs gap-1 text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        Hitung Ulang
                      </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Progres Estimasi
                        </p>
                        <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                          Selesai
                        </span>
                      </div>
                      <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 rounded-full"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Main Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Waktu Estimasi Card */}
                      <div className="rounded-xl p-5 border border-green-200 dark:border-green-800/40 bg-gradient-to-br from-green-50/50 to-teal-50/30 dark:from-green-900/15 dark:to-teal-900/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500" />
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Waktu Estimasi
                          </p>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span
                            key={`min-${animCounterKey}`}
                            className="text-3xl font-extrabold bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent tabular-nums"
                          >
                            {animatedMin.toFixed(animatedMin % 1 === 0 ? 0 : 1)}
                          </span>
                          <span className="text-lg text-gray-400 mx-1">-</span>
                          <span
                            key={`max-${animCounterKey}`}
                            className="text-3xl font-extrabold bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent tabular-nums"
                          >
                            {animatedMax.toFixed(animatedMax % 1 === 0 ? 0 : 1)}
                          </span>
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                            Hari Kerja
                          </span>
                        </div>
                        {kondisiAktif.size > 0 && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Termasuk penyesuaian kondisi khusus
                            ({calculatedResult.additional > 0 ? "+" : ""}
                            {calculatedResult.additional} hari)
                          </p>
                        )}
                      </div>

                      {/* Biaya Card */}
                      <div className="rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Biaya
                          </p>
                          {layananData.isGratis && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none text-[10px] px-2 py-0 shadow-sm">
                              <Sparkles className="h-3 w-3 mr-0.5" />
                              GRATIS
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                          {layananData.biaya}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                          {layananData.biayaDetail}
                        </p>
                      </div>
                    </div>

                    {/* Comparison Bar */}
                    <div className="rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Perbandingan Waktu Proses
                      </p>
                      <div className="space-y-4">
                        {/* Normal */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Normal
                            </span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                              {layananData.estimasiNormal[0]}-{layananData.estimasiNormal[1]} hari
                            </span>
                          </div>
                          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "60%" }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                              className="absolute inset-y-0 left-0 bg-gray-400 dark:bg-gray-500 rounded-full"
                            />
                          </div>
                        </div>
                        {/* Express (kondisi baik) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              Express (Dokumen Lengkap + Pagi)
                            </span>
                            <span className="text-xs font-bold text-green-700 dark:text-green-300">
                              {Math.max(1, layananData.estimasiNormal[0] - 1.5).toFixed(0)}-
                              {Math.max(1, layananData.estimasiNormal[1] - 1.5).toFixed(0)} hari
                            </span>
                          </div>
                          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "35%" }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                            </motion.div>
                          </div>
                        </div>
                        {/* Hasil Anda */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" />
                              Estimasi Anda
                            </span>
                            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                              {calculatedResult.minDays.toFixed(calculatedResult.minDays % 1 === 0 ? 0 : 1)}-
                              {calculatedResult.maxDays.toFixed(calculatedResult.maxDays % 1 === 0 ? 0 : 1)} hari
                            </span>
                          </div>
                          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{
                                width: `${Math.min(100, (calculatedResult.maxDays / layananData.estimasiNormal[1]) * 60)}%`,
                              }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Persyaratan Dokumen Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 md:p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20">
                        <FileCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Persyaratan Dokumen
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Checklist dokumen yang perlu disiapkan
                        </p>
                      </div>
                      <Badge className="ml-auto bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40 text-xs">
                        {layananData.persyaratan.length} item
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-5">
                      {layananData.persyaratan.map((doc, index) => {
                        const isChecked = checkedDocs.has(index);
                        return (
                          <motion.button
                            key={doc}
                            custom={index}
                            variants={checklistItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ x: 3 }}
                            onClick={() => toggleDoc(index)}
                            className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                              isChecked
                                ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10"
                                : "border-gray-100 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/20 hover:border-green-200 dark:hover:border-green-800/40"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isChecked
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isChecked && (
                                <CheckCircle className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm transition-colors ${
                                isChecked
                                  ? "text-green-700 dark:text-green-300 line-through"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {doc}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Doc progress */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Dokumen Siap
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            animate={{
                              width: `${(checkedDocs.size / layananData.persyaratan.length) * 100}%`,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                          {checkedDocs.size}/{layananData.persyaratan.length}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tips & Waktu Terbaik Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tips */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Tips untuk Proses Lebih Cepat
                        </h4>
                      </div>
                      <TipsCarousel tips={layananData.tips} />
                    </motion.div>

                    {/* Waktu Terbaik */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Waktu Terbaik Berkunjung
                        </h4>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-teal-50/50 dark:from-green-900/15 dark:to-teal-900/10 border border-green-200/50 dark:border-green-800/30">
                        <p className="text-lg font-bold text-green-800 dark:text-green-300">
                          {layananData.waktuTerbaik}
                        </p>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1.5">
                          Datang pada waktu tersebut untuk mendapatkan pelayanan
                          terbaik dengan waktu tunggu minimal
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {TIPS_GLOBAL.slice(0, 3).map((tip, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={goPrev}
                      className="gap-1 text-gray-600 dark:text-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Kembali
                    </Button>
                    <Button
                      onClick={resetCalculator}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/25 transition-all duration-300"
                    >
                      <Calculator className="mr-1 h-4 w-4" />
                      Hitung Layanan Lain
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Quick Reference Table ── */}
          <motion.div variants={cardVariants} className="mt-10">
            <Card className="border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md overflow-hidden">
              <button
                onClick={() => setTableOpen((v) => !v)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Tabel Referensi Cepat
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Estimasi seluruh layanan kependudukan
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: tableOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {tableOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Layanan
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Normal
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Express
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Biaya
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {LAYANAN_LIST.map((layanan) => (
                              <tr
                                key={layanan.id}
                                className="hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                  {layanan.nama}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 tabular-nums">
                                  {layanan.estimasiNormal[0]}-{layanan.estimasiNormal[1]} hari
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 tabular-nums">
                                  {layanan.estimasiExpress[0]}-{layanan.estimasiExpress[1]} hari
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {layanan.isGratis ? (
                                    <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40 text-[10px]">
                                      GRATIS
                                    </Badge>
                                  ) : (
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                      {layanan.biaya}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        * Estimasi waktu dapat berubah sesuai kondisi dan kepadatan
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            variants={cardVariants}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
              <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Estimasi ini bersifat perkiraan. Waktu pengerjaan sebenarnya dapat bervariasi
                sesuai kondisi di lapangan.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────

export function KalkulatorEstimasiSectionSkeleton() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Hero Banner Skeleton */}
      <div className="h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900" />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Step indicator skeleton */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-16 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                {i < 3 && <div className="w-16 sm:w-24 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />}
              </div>
            ))}
          </div>

          {/* Main card skeleton */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="space-y-2">
                <div className="w-40 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-56 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>

            {/* List items skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="w-28 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className="w-20 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Button skeleton */}
            <div className="flex justify-end mt-6">
              <div className="w-24 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/40 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="space-y-1.5">
                <div className="w-36 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-48 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30"
                >
                  <div className="w-24 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-16 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-12 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-14 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
