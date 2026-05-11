"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  FileCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ClipboardList,
  Baby,
  Home,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────

interface PanduanStep {
  nomor: number;
  judul: string;
  deskripsi: string;
  dokumen: string[];
  estimasiWaktu: string;
  gratis: boolean;
}

interface LayananData {
  id: string;
  nama: string;
  icon: React.ElementType;
  difficulty: "Mudah" | "Sedang";
  steps: PanduanStep[];
}

// ─── Hardcoded Service Data ──────────────────────────────────────────

const layananList: LayananData[] = [
  {
    id: "ktp-el",
    nama: "Pembuatan KTP-el",
    icon: CreditCard,
    difficulty: "Sedang",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Dokumen Persyaratan",
        deskripsi:
          "Kumpulkan Surat Pengantar RT/RW, Kartu Keluarga (KK) asli, Akta Kelahiran atau Ijazah, Surat Nikah (jika sudah menikah), dan Pas Foto 2x3 berlatar belakang merah.",
        dokumen: ["Surat Pengantar RT/RW", "KK Asli", "Akta Kelahiran/Ijazah", "Surat Nikah (opsional)", "Pas Foto 2x3 (2 lbr)"],
        estimasiWaktu: "1-2 hari persiapan",
        gratis: true,
      },
      {
        nomor: 2,
        judul: "Datang ke Kantor Disdukcapil",
        deskripsi:
          "Kunjungi kantor Disdukcapil Kabupaten Ngada di Jl. El Tari, Bajawa pada jam kerja (Senin-Jumat, 08:00-15:00 WITA). Ambil nomor antrian dan tunggu giliran.",
        dokumen: ["Semua dokumen persyaratan"],
        estimasiWaktu: "30-60 menit antrian",
        gratis: true,
      },
      {
        nomor: 3,
        judul: "Verifikasi Dokumen oleh Petugas",
        deskripsi:
          "Serahkan dokumen kepada petugas di loket pendaftaran. Petugas akan memeriksa kelengkapan dan keabsahan dokumen Anda, lalu mencetak formulir isian data penduduk.",
        dokumen: ["Dokumen asli + fotokopi"],
        estimasiWaktu: "15-20 menit",
        gratis: true,
      },
      {
        nomor: 4,
        judul: "Perekaman Biometrik",
        deskripsi:
          "Lakukan perekaman sidik jari (10 jari), foto wajah, dan iris mata. Pastikan tidak menggunakan kacamata, lensa kontak warna, atau aksesoris wajah.",
        dokumen: ["Surat pengantar petugas", "KTP lama (jika perpanjangan)"],
        estimasiWaktu: "10-15 menit",
        gratis: true,
      },
      {
        nomor: 5,
        judul: "Tunggu Proses Pencetakan",
        deskripsi:
          "Data Anda diverifikasi oleh Dukcapil Pusat melalui sistem SIAK. Simpan Surat Tanda Bukti Perekaman sebagai identitas sementara.",
        dokumen: ["Surat Tanda Bukti Perekaman"],
        estimasiWaktu: "5-14 hari kerja",
        gratis: true,
      },
      {
        nomor: 6,
        judul: "Pengambilan KTP-el",
        deskripsi:
          "Datang ke Disdukcapil dengan membawa Surat Tanda Bukti Perekaman. Periksa kembali data di KTP-el sebelum meninggalkan kantor.",
        dokumen: ["Surat Tanda Bukti Perekaman", "KTP lama (jika ada)"],
        estimasiWaktu: "10-15 menit",
        gratis: true,
      },
    ],
  },
  {
    id: "kk",
    nama: "Pembuatan KK",
    icon: ClipboardList,
    difficulty: "Sedang",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Dokumen Keluarga",
        deskripsi:
          "Kumpulkan KTP-el semua anggota keluarga, Akta Kelahiran masing-masing, Surat Nikah/Buku Nikah, dan Surat Pengantar RT/RW.",
        dokumen: ["KTP-el semua anggota", "Akta Kelahiran anggota", "Surat Nikah/Buku Nikah", "Surat Pengantar RT/RW"],
        estimasiWaktu: "1-3 hari persiapan",
        gratis: true,
      },
      {
        nomor: 2,
        judul: "Isi Formulir F-1.01",
        deskripsi:
          "Ambil dan isi formulir Isian Penduduk (F-1.01) di Disdukcapil dengan data lengkap seluruh anggota keluarga: NIK, nama, tempat/tanggal lahir, pekerjaan, dll.",
        dokumen: ["Formulir F-1.01", "Semua dokumen keluarga"],
        estimasiWaktu: "20-30 menit",
        gratis: true,
      },
      {
        nomor: 3,
        judul: "Verifikasi oleh Petugas",
        deskripsi:
          "Petugas memverifikasi data dan mencocokkan dengan database SIAK. Jika ada ketidaksesuaian, petugas akan memberikan petunjuk perbaikan.",
        dokumen: ["Formulir F-1.01", "Dokumen asli"],
        estimasiWaktu: "15-30 menit",
        gratis: true,
      },
      {
        nomor: 4,
        judul: "Tanda Tangan & Pencetakan KK",
        deskripsi:
          "Kepala Seksi menandatangani KK, kemudian KK dicetak oleh petugas. Periksa seluruh data yang tercantum sebelum KK diserahkan.",
        dokumen: ["Formulir F-1.01 terverifikasi"],
        estimasiWaktu: "30-60 menit",
        gratis: true,
      },
      {
        nomor: 5,
        judul: "Serah Terima KK",
        deskripsi:
          "Kartu Keluarga yang sudah jadi diserahkan. Simpan KK dengan baik dan buat fotokopi untuk keperluan administrasi mendatang.",
        dokumen: ["KK baru"],
        estimasiWaktu: "5-10 menit",
        gratis: true,
      },
    ],
  },
  {
    id: "akta-kelahiran",
    nama: "Akta Kelahiran",
    icon: Baby,
    difficulty: "Mudah",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Surat Keterangan Kelahiran",
        deskripsi:
          "Dapatkan Surat Keterangan Kelahiran dari rumah sakit, puskesmas, atau bidan yang membantu persalinan. Jika lahir di rumah, minta dari bidan desa.",
        dokumen: ["Surat Keterangan Kelahiran RS/Bidan", "Surat Pengantar RT/RW"],
        estimasiWaktu: "1 hari",
        gratis: true,
      },
      {
        nomor: 2,
        judul: "Kumpulkan Dokumen Orang Tua",
        deskripsi:
          "Siapkan KTP-el kedua orang tua asli, KK asli, Surat Nikah/Buku Nikah asli, dan Surat Pengantar RT/RW.",
        dokumen: ["KTP-el kedua orang tua", "KK asli", "Surat Nikah/Buku Nikah", "Surat Pengantar RT/RW"],
        estimasiWaktu: "1-2 hari persiapan",
        gratis: true,
      },
      {
        nomor: 3,
        judul: "Datang ke Disdukcapil",
        deskripsi:
          "Kunjungi Disdukcapil dengan membawa semua dokumen. Ambil nomor antrian di loket Pencatatan Sipil dan isi formulir permohonan akta kelahiran.",
        dokumen: ["Semua dokumen persyaratan"],
        estimasiWaktu: "30-60 menit",
        gratis: true,
      },
      {
        nomor: 4,
        judul: "Verifikasi & Penerbitan Akta",
        deskripsi:
          "Petugas memverifikasi dokumen dan data. Jika lengkap, akta bisa selesai di hari yang sama. Data dicatat dalam database SIAK.",
        dokumen: ["Formulir permohonan", "Semua dokumen asli"],
        estimasiWaktu: "1-3 hari kerja",
        gratis: true,
      },
      {
        nomor: 5,
        judul: "Ambil Akta Kelahiran",
        deskripsi:
          "Ambil Akta Kelahiran yang sudah jadi. Periksa kembali data bayi dan orang tua yang tercantum. Simpan dalam amplop plastik.",
        dokumen: ["Surat bukti permohonan"],
        estimasiWaktu: "10-15 menit",
        gratis: true,
      },
    ],
  },
  {
    id: "pindah-domisili",
    nama: "Pindah Domisili",
    icon: Home,
    difficulty: "Sedang",
    steps: [
      {
        nomor: 1,
        judul: "Minta Surat Pengantar dari RT/RW",
        deskripsi:
          "Minta surat pengantar pindah dari RT/RW kelurahan/desa asal. Sertakan alasan kepindahan (kerja, kuliah, menikah, dll).",
        dokumen: ["Surat Pengantar RT/RW", "KTP-el asli", "KK asli"],
        estimasiWaktu: "1 hari",
        gratis: true,
      },
      {
        nomor: 2,
        judul: "Urus di Disdukcapil Asal",
        deskripsi:
          "Datang ke Disdukcapil kabupaten/kota asal dengan membawa KTP-el, KK, surat pengantar RT/RW, dan pas foto 3x4 (4 lembar). Petugas menerbitkan SKP.",
        dokumen: ["KTP-el asli", "KK asli", "Surat Pengantar RT/RW", "Pas Foto 3x4 (4 lbr)"],
        estimasiWaktu: "1-3 hari kerja",
        gratis: true,
      },
      {
        nomor: 3,
        judul: "Proses Sinkronisasi Data",
        deskripsi:
          "Data kepindahan disinkronkan melalui sistem SIAK antar Disdukcapil asal dan tujuan. SKP berlaku sebagai dokumen sementara selama proses.",
        dokumen: ["Surat Keterangan Pindah (SKP)"],
        estimasiWaktu: "5-7 hari kerja",
        gratis: true,
      },
      {
        nomor: 4,
        judul: "Lapor ke Disdukcapil Tujuan",
        deskripsi:
          "Setelah sinkronisasi selesai, datang ke Disdukcapil tujuan dengan SKP dan surat pengantar RT/RW dari alamat baru. Petugas memproses pencatatan.",
        dokumen: ["SKP asli", "Surat Pengantar RT/RW baru", "KTP-el asli", "KK asli", "Pas Foto 3x4 (4 lbr)"],
        estimasiWaktu: "1-2 hari kerja",
        gratis: true,
      },
      {
        nomor: 5,
        judul: "Penerbitan KK & KTP-el Baru",
        deskripsi:
          "Disdukcapil tujuan menerbitkan KK baru dengan alamat baru. Kemudian lakukan perekaman ulang untuk KTP-el baru (sekitar 14 hari kerja).",
        dokumen: ["Dokumen pendukung"],
        estimasiWaktu: "7-14 hari kerja",
        gratis: true,
      },
    ],
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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const stepVariantsLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stepVariantsRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stepVariantsMobile = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const summaryVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const timelineLineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: "easeOut" as const, delay: 0.3 },
  },
};

// ─── Skeleton Loader ──────────────────────────────────────────────────

export function PanduanInteraktifSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Skeleton className="h-6 w-36 rounded-full mx-auto mb-4" />
          <Skeleton className="h-9 w-72 rounded-lg mx-auto mb-4" />
          <Skeleton className="h-5 w-96 rounded mx-auto" />
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-36 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Summary Card ───────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  sublabel,
  gradient,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  gradient: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={summaryVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(16, 185, 129, 0.2)" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition-all duration-300",
        "backdrop-blur-md bg-white/60 dark:bg-gray-900/60",
        "border-green-200/50 dark:border-green-800/40"
      )}
    >
      <div className={cn("absolute inset-0 opacity-[0.06] dark:opacity-[0.08]", gradient)} />
      <div className="relative z-10 flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white", gradient)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{value}</p>
          {sublabel && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  totalSteps,
  isLast,
}: {
  step: PanduanStep;
  index: number;
  totalSteps: number;
  isLast: boolean;
}) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const variant = isEven ? stepVariantsLeft : stepVariantsRight;

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0 items-start"
    >
      {/* Left content (even steps) / empty (odd steps) */}
      <div className={cn("hidden md:block", isEven ? "order-1 text-right pr-8" : "order-3 pl-8")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${step.nomor}-${isEven ? "left" : "right"}`}
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px -8px rgba(16, 185, 129, 0.15)" }}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
              "backdrop-blur-md bg-white/70 dark:bg-gray-900/60",
              "border-gray-200/60 dark:border-gray-800/60",
              "hover:border-green-300/60 dark:hover:border-green-700/50"
            )}
          >
            {/* Glow on hover */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 hover:from-green-400/20 hover:via-teal-400/10 hover:to-emerald-400/20 dark:hover:from-green-500/15 dark:hover:via-teal-500/10 dark:hover:to-emerald-500/15 transition-all duration-500 -z-10 blur-sm" />

            <div className="relative z-10">
              {/* Header row */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className={cn("flex items-center gap-2", !isEven && "order-2")}>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] px-2 py-0.5 gap-1">
                    <Clock className="h-3 w-3" />
                    {step.estimasiWaktu}
                  </Badge>
                  <Badge className={cn(
                    "border-0 text-[10px] px-2 py-0.5 gap-1",
                    step.gratis
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  )}>
                    {step.gratis ? "GRATIS" : "BERBIAYA"}
                  </Badge>
                </div>
                <h4 className={cn("font-semibold text-gray-900 dark:text-gray-100", !isEven && "order-1")}>
                  {step.judul}
                </h4>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {step.deskripsi}
              </p>

              {/* Documents */}
              <div className="flex flex-wrap gap-1.5">
                {step.dokumen.slice(0, 3).map((doc, docIdx) => (
                  <span
                    key={docIdx}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/40"
                  >
                    <FileCheck className="h-2.5 w-2.5" />
                    {doc.length > 20 ? doc.substring(0, 20) + "…" : doc}
                  </span>
                ))}
                {step.dokumen.length > 3 && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    +{step.dokumen.length - 3} lainnya
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile card (always visible) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="md:hidden order-1"
      >
        <motion.div
          whileHover={{ y: -3 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
            "backdrop-blur-md bg-white/70 dark:bg-gray-900/60",
            "border-gray-200/60 dark:border-gray-800/60",
            "hover:border-green-300/60 dark:hover:border-green-700/50"
          )}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{step.judul}</h4>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] px-2 py-0.5 gap-1">
                <Clock className="h-3 w-3" />
                {step.estimasiWaktu}
              </Badge>
              <Badge className={cn(
                "border-0 text-[10px] px-2 py-0.5 gap-1",
                step.gratis
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
              )}>
                {step.gratis ? "GRATIS" : "BERBIAYA"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {step.deskripsi}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.dokumen.slice(0, 2).map((doc, docIdx) => (
                <span
                  key={docIdx}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/40"
                >
                  <FileCheck className="h-2.5 w-2.5" />
                  {doc.length > 18 ? doc.substring(0, 18) + "…" : doc}
                </span>
              ))}
              {step.dokumen.length > 2 && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  +{step.dokumen.length - 2} lainnya
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Center timeline */}
      <div className="hidden md:flex order-2 flex-col items-center">
        {/* Step dot */}
        <div className="relative">
          {/* Pulsing ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: [0.6, 0, 0.6] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-10 h-10 rounded-full bg-green-400/30 dark:bg-green-500/20"
          />
          {/* Gradient circle with step number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative w-10 h-10 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <span className="text-white font-bold text-sm">{step.nomor}</span>
          </motion.div>
        </div>

        {/* Connector line to next step */}
        {!isLast && (
          <motion.div
            variants={timelineLineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-0.5 flex-1 min-h-[60px] bg-gradient-to-b from-green-400 via-teal-400 to-green-400/20 dark:from-green-600 dark:via-teal-700 dark:to-green-800/20 origin-top"
          />
        )}
      </div>

      {/* Mobile timeline dot */}
      <div className="md:hidden order-0 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: [0.6, 0, 0.6] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-8 h-8 rounded-full bg-green-400/30 dark:bg-green-500/20"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-green-500/30"
          >
            <span className="text-white font-bold text-xs">{step.nomor}</span>
          </motion.div>
        </div>
        {/* Vertical line for mobile */}
        {!isLast && (
          <div className="absolute left-4 top-8 bottom-0 w-0.5 -z-10 bg-gradient-to-b from-green-300 via-teal-300 to-green-100 dark:from-green-700 dark:via-teal-800 dark:to-green-900/20" />
        )}
      </div>

      {/* Right content (odd steps) / empty (even steps) */}
      <div className={cn("hidden md:block", isEven ? "order-3 pl-8" : "order-1 text-right pr-8")} />
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function PanduanInteraktifSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState("ktp-el");

  const activeLayanan = layananList.find((l) => l.id === activeTab)!;
  const ActiveIcon = activeLayanan.icon;

  // Compute summary data
  const summary = useMemo(() => {
    const totalDocs = new Set(activeLayanan.steps.flatMap((s) => s.dokumen)).size;
    const allFree = activeLayanan.steps.every((s) => s.gratis);
    // Parse rough total time from last step (sums to approximate end-to-end)
    return {
      totalSteps: activeLayanan.steps.length,
      totalDocs,
      allFree,
      difficulty: activeLayanan.difficulty,
    };
  }, [activeLayanan]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="panduan-interaktif-title"
    >
      {/* ── Background ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%2310b981'/%3E%3C/svg%3E")`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50/20 dark:bg-emerald-900/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Section Header ─────────────────────────────────── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          {/* Decorative accent */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-8 bg-green-300" />
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2" />
            <div className="h-px w-8 bg-green-300" />
          </div>

          <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <BookOpen className="h-4 w-4" />
            Panduan Layanan
          </span>

          <h2
            id="panduan-interaktif-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Panduan Langkah demi Langkah
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Ikuti langkah-langkah mudah untuk mengurus dokumen kependudukan Anda.
            Pilih layanan yang Anda butuhkan dan ikuti panduan interaktif kami.
          </p>
        </motion.div>

        {/* ── Service Selector Tabs ──────────────────────────── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center mb-8"
        >
          <div className="relative inline-flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/60">
            {layananList.map((layanan) => {
              const Icon = layanan.icon;
              const isActive = activeTab === layanan.id;
              return (
                <button
                  key={layanan.id}
                  onClick={() => setActiveTab(layanan.id)}
                  className={cn(
                    "relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap",
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                  aria-pressed={isActive}
                  aria-label={layanan.nama}
                >
                  {isActive && (
                    <motion.div
                      layoutId="panduan-tab-bg"
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{layanan.nama}</span>
                    <span className="sm:hidden">
                      {layanan.nama.split(" ").slice(-1)[0]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quick Summary Cards ────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`summary-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          >
            <SummaryCard
              icon={<Info className="h-5 w-5" />}
              label="Total Langkah"
              value={`${summary.totalSteps} Langkah`}
              sublabel="Proses terstruktur"
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              delay={0}
            />
            <SummaryCard
              icon={<FileCheck className="h-5 w-5" />}
              label="Dokumen Dibutuhkan"
              value={`${summary.totalDocs} Dokumen`}
              sublabel="Siapkan sebelumnya"
              gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
              delay={0.05}
            />
            <SummaryCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Biaya"
              value={summary.allFree ? "GRATIS" : "Berbayar"}
              sublabel={summary.allFree ? "UU No. 24/2013" : "Biaya administrasi"}
              gradient="bg-gradient-to-br from-emerald-500 to-green-600"
              delay={0.1}
            />
            <SummaryCard
              icon={<Zap className="h-5 w-5" />}
              label="Tingkat Kesulitan"
              value={summary.difficulty}
              sublabel={summary.difficulty === "Mudah" ? "Proses sederhana" : "Perlu persiapan"}
              gradient={summary.difficulty === "Mudah"
                ? "bg-gradient-to-br from-green-400 to-teal-500"
                : "bg-gradient-to-br from-amber-500 to-orange-500"
              }
              delay={0.15}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Steps Timeline ─────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          {/* Overview bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`overview-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border",
                "backdrop-blur-md bg-green-50/60 dark:bg-green-900/20",
                "border-green-200/50 dark:border-green-800/40"
              )}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20">
                  <ActiveIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                    {activeLayanan.nama}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ikuti {activeLayanan.steps.length} langkah berikut untuk menyelesaikan proses {activeLayanan.nama.toLowerCase()}
                  </p>
                </div>
                <ShieldCheck className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`steps-${activeTab}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="space-y-6 md:space-y-4"
            >
              {activeLayanan.steps.map((step, idx) => (
                <StepCard
                  key={`${activeTab}-step-${step.nomor}`}
                  step={step}
                  index={idx}
                  totalSteps={activeLayanan.steps.length}
                  isLast={idx === activeLayanan.steps.length - 1}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Footer Note ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs",
              "bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400",
              "border border-gray-200 dark:border-gray-700/60"
            )}>
              <Info className="h-3.5 w-3.5" />
              Panduan ini bersifat umum. Untuk informasi lebih detail, silakan hubungi kantor Disdukcapil Ngada.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
