"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  User,
  MapPin,
  FileText,
  MessageSquare,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// ============================================
// TYPES
// ============================================

interface TimelineStep {
  status: string;
  label: string;
  date: string | null;
  completed: boolean;
  active: boolean;
}

interface PengajuanResult {
  type: "pengajuan";
  nomorPengajuan: string;
  namaLengkap: string;
  nikMasked: string;
  kecamatan: string | null;
  status: string;
  catatan: string | null;
  layanan: string;
  tanggalPengajuan: string;
  tanggalProses: string | null;
  tanggalSelesai: string | null;
  updatedAt: string;
  timeline: TimelineStep[];
  dokumen: Array<{ namaDokumen: string; fileName: string; fileSize: string | null }>;
}

interface PengaduanResult {
  type: "pengaduan";
  id: string;
  subject: string;
  namaLengkap: string;
  status: string;
  response: string | null;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineStep[];
}

type SearchResult = PengajuanResult | PengaduanResult;

// ============================================
// STATUS CONFIG
// ============================================

const statusConfig: Record<string, {
  label: string;
  badgeClass: string;
  dotColor: string;
  icon: typeof CheckCircle2;
  description: string;
}> = {
  Baru: {
    label: "Baru",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    dotColor: "bg-blue-500",
    icon: Clock,
    description: "Pengajuan baru diterima, menunggu verifikasi",
  },
  Diverifikasi: {
    label: "Diverifikasi",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    dotColor: "bg-amber-500",
    icon: ShieldCheck,
    description: "Dokumen telah diverifikasi oleh petugas",
  },
  Diproses: {
    label: "Diproses",
    badgeClass: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    dotColor: "bg-teal-500",
    icon: Loader2,
    description: "Sedang diproses oleh petugas",
  },
  Selesai: {
    label: "Selesai",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
    dotColor: "bg-green-500",
    icon: CheckCircle2,
    description: "Pengajuan telah selesai diproses",
  },
  Ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
    dotColor: "bg-red-500",
    icon: XCircle,
    description: "Pengajuan ditolak",
  },
};

function getStatusConfig(status: string) {
  return statusConfig[status] || statusConfig.Baru;
}

// ============================================
// TIMELINE STEPPER
// ============================================

function TimelineStepper({ timeline }: { timeline: TimelineStep[] }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-green-500 dark:bg-green-400 transition-all duration-500 hidden sm:block"
          style={{
            width: timeline.length > 1
              ? `${((timeline.filter((s) => s.completed && !s.active).length) / (timeline.length - 1)) * 100}%`
              : "0%",
          }}
        />

        {timeline.map((step, idx) => {
          const cfg = getStatusConfig(step.status);
          const StepIcon = step.status === "Ditolak" ? XCircle : step.completed && !step.active ? CheckCircle2 : cfg.icon;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-1.5 relative z-10 flex-1"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 200 }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.active
                    ? "border-current bg-white dark:bg-gray-900 shadow-md"
                    : step.completed
                      ? "bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                } ${step.active ? `text-${step.status === "Ditolak" ? "red" : "green"}-500 dark:text-${step.status === "Ditolak" ? "red" : "green"}-400` : ""}`}
              >
                <StepIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 + 0.1 }}
                className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                  step.active
                    ? "text-green-700 dark:text-green-400"
                    : step.completed
                      ? "text-green-600 dark:text-green-500"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </motion.span>
              {step.date && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.15 + 0.2 }}
                  className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 text-center"
                >
                  {formatShortDate(step.date)}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// PENGAJUAN RESULT
// ============================================

function PengajuanResultCard({ data }: { data: PengajuanResult }) {
  const cfg = getStatusConfig(data.status);
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="space-y-4"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${data.status === "Diproses" ? "animate-spin" : ""}`} />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {data.layanan}
          </span>
        </div>
        <Badge className={`${cfg.badgeClass} text-xs border`}>
          {cfg.label}
        </Badge>
      </div>

      {/* Nomor Pengajuan */}
      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{data.nomorPengajuan}</p>

      {/* Applicant Info */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Nama</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{data.namaLengkap}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">NIK</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">{data.nikMasked}</p>
          </div>
        </div>
        {data.kecamatan && (
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Kecamatan</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.kecamatan}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="py-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Progress Pengajuan
        </p>
        <TimelineStepper timeline={data.timeline} />
      </div>

      {/* Catatan */}
      {data.catatan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
        >
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Catatan Petugas:</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">{data.catatan}</p>
        </motion.div>
      )}

      {/* Dates */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 pt-1">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Diajukan: {formatDate(data.tanggalPengajuan)}
        </span>
        <span>Terakhir: {formatDate(data.updatedAt)}</span>
      </div>

      {/* Dokumen */}
      {data.dokumen.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Dokumen Terlampir
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {data.dokumen.map((doc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
              >
                <FileText className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {doc.namaDokumen}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{doc.fileName}</p>
                </div>
                <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// PENGADUAN RESULT
// ============================================

function PengaduanResultCard({ data }: { data: PengaduanResult }) {
  const cfg = getStatusConfig(data.status);
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="space-y-4"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Pengaduan
          </span>
        </div>
        <Badge className={`${cfg.badgeClass} text-xs border`}>
          {cfg.label}
        </Badge>
      </div>

      {/* Subject */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Perihal</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.subject}</p>
      </div>

      {/* Applicant Info */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pelapor</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{data.namaLengkap}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${data.status === "Diproses" ? "animate-spin" : ""}`} />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{cfg.label}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Progress Pengaduan
        </p>
        <TimelineStepper timeline={data.timeline} />
      </div>

      {/* Response */}
      {data.response && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">Balasan Admin:</p>
          <p className="text-xs text-green-700 dark:text-green-400">{data.response}</p>
        </motion.div>
      )}

      {/* Dates */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 pt-1">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Diajukan: {formatDate(data.createdAt)}
        </span>
        <span>Terakhir: {formatDate(data.updatedAt)}</span>
      </div>
    </motion.div>
  );
}

// ============================================
// DATE HELPERS
// ============================================

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatShortDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

// ============================================
// MAIN WIDGET
// ============================================

export function DokumenTrackerWidget() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"pengajuan" | "pengaduan">("pengajuan");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const detectType = useCallback((input: string): "pengajuan" | "pengaduan" => {
    return input.trim().toUpperCase().startsWith("ONL-") ? "pengajuan" : "pengajuan";
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch("/api/cek-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          type: searchType,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Pencarian gagal. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [query, searchType]);

  const handleReset = useCallback(() => {
    setQuery("");
    setResult(null);
    setError(null);
    setHasSearched(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) handleSearch();
    },
    [handleSearch, loading]
  );

  const inputPlaceholder =
    searchType === "pengajuan"
      ? "NIK (16 digit) atau ONL-XXXXXXXX-XXXX"
      : "ID pengaduan atau kata kunci";

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/20 dark:to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium mb-3">
              <Search className="w-3.5 h-3.5" />
              Lacak Dokumen Anda
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Cek Status Pengajuan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Masukkan NIK atau nomor pengajuan untuk melihat status terbaru dari dokumen kependudukan Anda
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            <Card className="border-green-200/60 dark:border-green-900/40 shadow-lg shadow-green-900/5 dark:shadow-green-900/10 overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                {/* Type Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 w-fit mx-auto">
                  <button
                    onClick={() => { setSearchType("pengajuan"); handleReset(); }}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                      searchType === "pengajuan"
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Pengajuan
                  </button>
                  <button
                    onClick={() => { setSearchType("pengaduan"); handleReset(); }}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                      searchType === "pengaduan"
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Pengaduan
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={inputPlaceholder}
                      disabled={loading}
                      className="pl-9 pr-3 h-10 text-sm border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="h-10 px-4 sm:px-6 bg-green-600 hover:bg-green-700 text-white shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Cek Status</span>
                        <Search className="w-4 h-4 sm:hidden" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                  {searchType === "pengajuan"
                    ? "Otomatis mendeteksi NIK atau nomor pengajuan (ONL-XXXXXXXX-XXXX)"
                    : "Masukkan ID pengaduan yang diberikan saat submit"}
                </p>

                {/* Content Area */}
                <div className="mt-4 min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {/* Loading State */}
                    {loading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10"
                      >
                        <div className="relative">
                          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                          <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-500/20 animate-ping" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                          Mencari data...
                        </p>
                      </motion.div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-8"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                          <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                          {error}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSearch}
                          className="mt-3 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Coba Lagi
                        </Button>
                      </motion.div>
                    )}

                    {/* Result State */}
                    {!loading && result && result.type === "pengajuan" && (
                      <motion.div key="result-pengajuan" exit={{ opacity: 0 }}>
                        <PengajuanResultCard data={result} />
                        <div className="flex justify-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Cari Lagi
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {!loading && result && result.type === "pengaduan" && (
                      <motion.div key="result-pengaduan" exit={{ opacity: 0 }}>
                        <PengaduanResultCard data={result} />
                        <div className="flex justify-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Cari Lagi
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Initial / Empty State */}
                    {!loading && !result && !error && !hasSearched && (
                      <motion.div
                        key="initial"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-6"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 flex items-center justify-center mb-3">
                          <FileCheck className="w-7 h-7 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
                          Lacak status pengajuan dokumen Anda
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-xs">
                          Masukkan NIK (16 digit) atau nomor pengajuan untuk melihat progress terbaru
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[10px] sm:text-xs text-center text-gray-400 dark:text-gray-500 mt-4"
          >
            Data pribadi Anda dilindungi dan ditampilkan secara anonim
            <ShieldCheck className="w-3 h-3 inline-block ml-1 text-green-500" />
          </motion.p>
        </div>
      </div>
    </section>
  );
}
