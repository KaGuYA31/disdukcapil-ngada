"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Calculator,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Info,
  Sparkles,
  Users,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Data Layanan ──────────────────────────────────────────────────────

interface LayananData {
  id: string;
  nama: string;
  kategori: string;
  biaya: number;
  isGratis: boolean;
  estimasiHari: number;
  dokumen: string[];
  keterangan: string;
}

const layananData: LayananData[] = [
  {
    id: "ktp-baru",
    nama: "KTP-el Baru",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 14,
    dokumen: [
      "Surat Pengantar RT/RW",
      "Kartu Keluarga (KK) Asli",
      "Akta Kelahiran / Ijazah",
      "Surat Nikah (jika sudah menikah)",
      "Pas Foto 2x3 (2 lembar)",
    ],
    keterangan: "Perekaman biometrik wajib hadir langsung",
  },
  {
    id: "ktp-perpanjangan",
    nama: "KTP-el Perpanjangan",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 5,
    dokumen: [
      "KTP-el lama (masih berlaku / habis masa berlaku)",
      "Kartu Keluarga (KK) Asli",
      "Pas Foto 2x3 (2 lembar)",
    ],
    keterangan: "Selesai di tempat jika blanko tersedia",
  },
  {
    id: "ktp-perbaikan",
    nama: "KTP-el Perbaikan Data",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 7,
    dokumen: [
      "KTP-el asli",
      "Kartu Keluarga (KK) Asli",
      "Dokumen pendukung (ijazah, akta kelahiran, surat nikah)",
      "Surat keterangan kesalahan data",
    ],
    keterangan: "Bukti data yang benar harus disertakan",
  },
  {
    id: "kk-baru",
    nama: "Kartu Keluarga (KK) Baru",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 3,
    dokumen: [
      "Surat Pengantar RT/RW",
      "KTP-el semua anggota keluarga",
      "Akta Kelahiran / Akta Nikah / Akta Perkawinan",
      "Surat Keterangan Pindah (jika dari daerah lain)",
      "Buku Nikah (jika ada)",
    ],
    keterangan: "Harus melengkapi data seluruh anggota keluarga",
  },
  {
    id: "kk-perubahan",
    nama: "KK Perubahan Data",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 2,
    dokumen: [
      "KK lama asli",
      "KTP-el asli",
      "Dokumen pendukung perubahan (akta nikah, akta cerai, akta kelahiran)",
      "Surat Pengantar RT/RW",
    ],
    keterangan: "Proses lebih cepat jika dokumen lengkap",
  },
  {
    id: "akta-kelahiran",
    nama: "Akta Kelahiran",
    kategori: "Pencatatan Sipil",
    biaya: 0,
    isGratis: true,
    estimasiHari: 1,
    dokumen: [
      "Surat Keterangan Kelahiran dari RS/Bidan",
      "KTP kedua orang tua asli",
      "KK asli",
      "Surat Nikah / Buku Nikah asli",
      "Surat Pengantar RT/RW",
    ],
    keterangan: "Dibuat maksimal 60 hari setelah kelahiran",
  },
  {
    id: "akta-kematian",
    nama: "Akta Kematian",
    kategori: "Pencatatan Sipil",
    biaya: 0,
    isGratis: true,
    estimasiHari: 1,
    dokumen: [
      "Surat Keterangan Kematian dari RS/Bidan/Desa",
      "KTP-el almarhum/ahli waris",
      "KK asli",
      "Surat Nikah / Buku Nikah (jika sudah menikah)",
    ],
    keterangan: "Laporkan dalam waktu 30 hari sejak kematian",
  },
  {
    id: "akta-perkawinan",
    nama: "Akta Perkawinan",
    kategori: "Pencatatan Sipil",
    biaya: 0,
    isGratis: true,
    estimasiHari: 1,
    dokumen: [
      "Surat Nikah dari KUA",
      "KTP-el kedua mempelai",
      "KK kedua mempelai",
      "Akta Kelahiran kedua mempelai",
      "Ijazah / Surat Baptis (opsional)",
    ],
    keterangan: "Setelah pencatatan nikah di KUA",
  },
  {
    id: "akta-perceraian",
    nama: "Akta Perceraian",
    kategori: "Pencatatan Sipil",
    biaya: 0,
    isGratis: true,
    estimasiHari: 3,
    dokumen: [
      "Surat Putusan Pengadilan Agama",
      "KTP-el kedua pihak",
      "KK asli",
      "Buku Nikah asli",
      "Akta Perkawinan asli",
    ],
    keterangan: "Setelah putusan pengadilan berkekuatan hukum tetap",
  },
  {
    id: "skp",
    nama: "Surat Keterangan Pindah",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 3,
    dokumen: [
      "KTP-el asli",
      "KK asli",
      "Surat Pengantar RT/RW",
      "Pas Foto 3x4 (4 lembar)",
      "Surat keterangan kerja / kuliah di daerah tujuan (opsional)",
    ],
    keterangan: "Bisa diurus secara online melalui Disdukcapil Online",
  },
  {
    id: "skck-kependudukan",
    nama: "Surat Keterangan Domisili",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 1,
    dokumen: [
      "KTP-el asli",
      "KK asli",
      "Surat Pengantar RT/RW",
      "Pas Foto 3x4 (2 lembar)",
    ],
    keterangan: "Selesai di hari yang sama jika dokumen lengkap",
  },
  {
    id: "pindah-masuk",
    nama: "Pindah Datang (Masuk)",
    kategori: "Pendaftaran Penduduk",
    biaya: 0,
    isGratis: true,
    estimasiHari: 7,
    dokumen: [
      "KTP-el asli",
      "KK asli dari daerah asal",
      "Surat Keterangan Pindah dari daerah asal",
      "Surat Pengantar RT/RW daerah tujuan",
      "Pas Foto 3x4 (4 lembar)",
    ],
    keterangan: "Proses sinkronisasi data antar daerah",
  },
];

const jenisPermohonanOptions = [
  { value: "baru", label: "Baru / Pertama Kali" },
  { value: "perpanjangan", label: "Perpanjangan" },
  { value: "perubahan", label: "Perubahan / Koreksi" },
  { value: "pindah", label: "Pindah Masuk / Keluar" },
];

// ─── Animation Variants ────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ─────────────────────────────────────────────────────────

export function SimulasiBiayaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [jenisPermohonan, setJenisPermohonan] = useState("");
  const [jumlahTanggungan, setJumlahTanggungan] = useState("1");
  const [showResult, setShowResult] = useState(false);

  const selectedData = useMemo(
    () => layananData.find((l) => l.id === selectedLayanan),
    [selectedLayanan]
  );

  const totalSteps = 3;

  const canProceed = () => {
    if (currentStep === 1) return selectedLayanan !== "";
    if (currentStep === 2) return jenisPermohonan !== "";
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedLayanan("");
    setJenisPermohonan("");
    setJumlahTanggungan("1");
    setShowResult(false);
  };

  const formatDate = (estimasiHari: number) => {
    const days = Number(jumlahTanggungan) > 1 ? estimasiHari + 2 : estimasiHari;
    if (days <= 1) return "Hari yang sama";
    return `${days} hari kerja`;
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      aria-labelledby="simulasi-biaya-title"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%2315803d' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Calculator className="h-4 w-4" />
            Simulasi Biaya
          </span>
          <h2
            id="simulasi-biaya-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Estimasi Biaya & Waktu Pelayanan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Hitung estimasi biaya dan waktu proses untuk berbagai layanan
            administrasi kependudukan secara cepat dan mudah
          </p>
        </motion.div>

        {/* Wizard Card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-gray-200/80 dark:border-gray-700/50 shadow-lg shadow-green-500/5 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/20 border-b border-gray-200/60 dark:border-gray-700/40 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    {!showResult ? `Langkah ${currentStep} dari ${totalSteps}` : "Hasil Simulasi"}
                  </div>
                </CardTitle>
                {showResult && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                    Selesai
                  </Badge>
                )}
              </div>

              {/* Step indicator */}
              {!showResult && (
                <div className="flex items-center gap-2 mt-3">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="flex-1 flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                          i + 1 < currentStep
                            ? "bg-green-600 text-white shadow-sm"
                            : i + 1 === currentStep
                            ? "bg-green-600 text-white shadow-sm ring-4 ring-green-200 dark:ring-green-800"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {i + 1 < currentStep ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      {i < totalSteps - 1 && (
                        <div
                          className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                            i + 1 < currentStep
                              ? "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-5 md:p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Pilih Layanan */}
                {!showResult && currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Label htmlFor="layanan-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Pilih Jenis Layanan
                    </Label>
                    <Select value={selectedLayanan} onValueChange={setSelectedLayanan}>
                      <SelectTrigger className="w-full h-12 text-sm">
                        <SelectValue placeholder="-- Pilih layanan yang diinginkan --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-bold text-green-600 dark:text-green-400 px-2 pt-2">
                            Pendaftaran Penduduk
                          </SelectLabel>
                          {layananData
                            .filter((l) => l.kategori === "Pendaftaran Penduduk")
                            .map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{l.nama}</span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 flex-shrink-0 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                  >
                                    {l.isGratis ? "GRATIS" : `Rp ${l.biaya.toLocaleString("id-ID")}`}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-bold text-amber-600 dark:text-amber-400 px-2 pt-3">
                            Pencatatan Sipil
                          </SelectLabel>
                          {layananData
                            .filter((l) => l.kategori === "Pencatatan Sipil")
                            .map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{l.nama}</span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 flex-shrink-0 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                  >
                                    {l.isGratis ? "GRATIS" : `Rp ${l.biaya.toLocaleString("id-ID")}`}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {selectedData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          {selectedData.keterangan}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Jenis Permohonan */}
                {!showResult && currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Jenis Permohonan
                    </Label>
                    <div className="space-y-2">
                      {jenisPermohonanOptions.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            jenisPermohonan === opt.value
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              jenisPermohonan === opt.value
                                ? "border-green-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {jenisPermohonan === opt.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-green-600"
                              />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium transition-colors ${
                              jenisPermohonan === opt.value
                                ? "text-green-700 dark:text-green-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <input
                            type="radio"
                            name="jenis-permohonan"
                            value={opt.value}
                            checked={jenisPermohonan === opt.value}
                            onChange={(e) => setJenisPermohonan(e.target.value)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Jumlah Tanggungan */}
                {!showResult && currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Label htmlFor="jumlah-tanggungan" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Jumlah Tanggungan / Anggota Keluarga
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="jumlah-tanggungan"
                        type="number"
                        min="1"
                        max="20"
                        value={jumlahTanggungan}
                        onChange={(e) => setJumlahTanggungan(e.target.value)}
                        className="pl-10 h-12"
                        placeholder="Masukkan jumlah anggota keluarga"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Jumlah anggota keluarga yang tercatat dalam satu Kartu Keluarga
                    </p>
                  </motion.div>
                )}

                {/* Result */}
                {showResult && selectedData && (
                  <motion.div
                    key="result"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5"
                  >
                    {/* GRATIS Banner */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 via-green-600 to-teal-600 p-6 text-center shadow-lg">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full blur-xl" />
                      </div>
                      <div className="relative">
                        <Sparkles className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                          {selectedData.isGratis ? "GRATIS" : `Rp ${selectedData.biaya.toLocaleString("id-ID")}`}
                        </h3>
                        <p className="text-green-100 text-sm mt-1">
                          {selectedData.isGratis
                            ? "Gratis Berdasarkan UU No. 24 Tahun 2013"
                            : "Biaya resmi sesuai peraturan yang berlaku"}
                        </p>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">
                          <FileText className="h-3.5 w-3.5" />
                          Layanan
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {selectedData.nama}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{selectedData.kategori}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          Estimasi Waktu
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {formatDate(selectedData.estimasiHari)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Jenis: {jenisPermohonanOptions.find((j) => j.value === jenisPermohonan)?.label}
                        </p>
                      </div>
                    </div>

                    {/* Required Documents Checklist */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Dokumen yang Diperlukan
                      </h4>
                      <div className="space-y-2">
                        {selectedData.dokumen.map((doc, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              {doc}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                        <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        {selectedData.keterangan}. Hubungi kami via WhatsApp jika ada pertanyaan lebih lanjut.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1 && !showResult}
                  className="gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {showResult ? "Kembali" : "Sebelumnya"}
                </Button>

                {showResult ? (
                  <Button
                    onClick={handleReset}
                    className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Hitung Ulang
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {currentStep === totalSteps ? (
                      <>
                        Lihat Hasil
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Selanjutnya
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
