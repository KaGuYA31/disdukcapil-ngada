"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CONTACT_INFO } from "@/lib/constants";
import {
  Search,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Download,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

/* ────────────────────────── animation variants ────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

/* ────────────────────────── types ────────────────────────── */

interface SubmissionStatus {
  id: string;
  nomorPengajuan: string;
  namaLengkap: string;
  nik: string;
  noTelepon: string;
  email: string | null;
  alamat: string | null;
  status: string;
  catatan: string | null;
  tanggalPengajuan: string;
  tanggalProses: string | null;
  tanggalSelesai: string | null;
  layanan: {
    name: string;
    slug: string;
  };
  dokumen: Array<{
    id: string;
    namaDokumen: string;
    fileName: string;
    fileUrl: string;
    fileSize: string | null;
  }>;
}

/* ────────────────────────── status config ────────────────────────── */

const statusConfig: {
  [key: string]: {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: any;
    description: string;
  };
} = {
  Baru: {
    label: "Baru",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    icon: Clock,
    description: "Pengajuan baru diterima, menunggu verifikasi",
  },
  Diverifikasi: {
    label: "Diverifikasi",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: CheckCircle,
    description: "Dokumen telah diverifikasi, menunggu proses",
  },
  Diproses: {
    label: "Diproses",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Loader2,
    description: "Pengajuan sedang diproses oleh petugas",
  },
  Selesai: {
    label: "Selesai",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
    description: "Pengajuan telah selesai",
  },
  Ditolak: {
    label: "Ditolak",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: AlertCircle,
    description: "Pengajuan ditolak",
  },
};

/* ────────────────────────── step indicators ────────────────────────── */

const searchSteps = [
  { step: 1, label: "Masukkan Nomor", icon: Search },
  { step: 2, label: "Cari Pengajuan", icon: FileText },
  { step: 3, label: "Lihat Status", icon: CheckCircle },
];

/* ────────────────────────── page component ────────────────────────── */

export default function CekStatusPage() {
  const { toast } = useToast();

  const [nomorPengajuan, setNomorPengajuan] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<SubmissionStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!nomorPengajuan.trim()) {
      toast({
        title: "Error",
        description: "Masukkan nomor pengajuan",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearching(true);
      setNotFound(false);
      setResult(null);

      const response = await fetch(
        `/api/layanan-online/${nomorPengajuan.trim()}`
      );
      const res = await response.json();

      if (res.success) {
        setResult(res.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Error",
        description: "Gagal mencari pengajuan",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status] || {
        label: status,
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: Clock,
        description: "Status tidak diketahui",
      }
    );
  };

  const currentStatusIdx = result
    ? ["Baru", "Diverifikasi", "Diproses", "Selesai"].indexOf(result.status)
    : -1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* ──── Hero Banner ──── */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Decorative gradient orbs */}
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />

          {/* Floating decorative shapes */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 right-[12%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute bottom-20 left-[15%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb
                    items={[
                      { label: "Beranda", href: "/" },
                      { label: "Layanan Online", href: "/layanan-online" },
                      { label: "Cek Status Pengajuan" },
                    ]}
                  />
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    Layanan Online
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-3"
                >
                  <Search className="h-9 w-9 md:h-11 md:w-11 text-green-200" />
                  Cek Status Pengajuan
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-green-100 text-lg md:text-xl leading-relaxed"
                >
                  Masukkan nomor pengajuan untuk melihat status pengajuan
                  layanan online Anda secara real-time.
                </motion.p>

                {/* Step indicators */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex items-center gap-2 sm:gap-0 overflow-x-auto pb-2"
                >
                  {searchSteps.map((item, idx) => {
                    const StepIcon = item.icon;
                    return (
                      <div key={item.step} className="flex items-center">
                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-w-fit">
                          <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <StepIcon className="h-4 w-4 text-green-200" />
                          </div>
                          <span className="text-sm font-medium text-green-100 whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                        {idx < searchSteps.length - 1 && (
                          <div className="px-1 sm:px-2 flex-shrink-0">
                            <div className="w-4 sm:w-8 h-px bg-green-400/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-4 flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4 text-green-300" />
                  <span className="text-sm text-green-200">
                    Data pengajuan Anda aman dan terlindungi
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
                className="fill-white dark:fill-gray-950"
              />
            </svg>
          </div>
        </section>

        {/* ──── Search Section ──── */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="max-w-xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Card className="shadow-md border-0 shadow-green-900/5">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomorPengajuan" className="text-base font-semibold">
                          Nomor Pengajuan
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="nomorPengajuan"
                            value={nomorPengajuan}
                            onChange={(e) =>
                              setNomorPengajuan(e.target.value.toUpperCase())
                            }
                            placeholder="Contoh: ONL-20250308-0001"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSearch()
                            }
                            className="text-base h-11"
                          />
                          <Button
                            onClick={handleSearch}
                            disabled={searching}
                            className="bg-green-700 hover:bg-green-800 h-11 px-5"
                          >
                            {searching ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Cari</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Nomor pengajuan diberikan setelah Anda mengirim
                        pengajuan layanan online. Format:{" "}
                        <span className="font-mono text-gray-600">
                          ONL-YYYYMMDD-XXXX
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ──── Result Section ──── */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Not Found */}
              {notFound && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-700 font-semibold text-lg">
                        Pengajuan tidak ditemukan
                      </p>
                      <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                        Pastikan nomor pengajuan yang Anda masukkan sudah
                        benar. Jika masih bermasalah, silakan hubungi kami.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Result Cards */}
              {result && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  {/* Status Card */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <CardTitle className="text-xl">
                              Detail Pengajuan
                            </CardTitle>
                            <CardDescription className="font-mono text-sm mt-0.5">
                              {result.nomorPengajuan}
                            </CardDescription>
                          </div>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                          >
                            <Badge
                              className={`${getStatusConfig(result.status).bgColor} ${
                                getStatusConfig(result.status).color
                              } ${getStatusConfig(result.status).borderColor} border text-sm px-3 py-1`}
                            >
                              {(() => {
                                const StatusIcon = getStatusConfig(
                                  result.status
                                ).icon;
                                return (
                                  <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                );
                              })()}
                              {getStatusConfig(result.status).label}
                            </Badge>
                          </motion.div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`flex items-center gap-3 p-4 rounded-lg ${getStatusConfig(result.status).bgColor} ${getStatusConfig(result.status).borderColor} border`}
                        >
                          {(() => {
                            const StatusIcon = getStatusConfig(
                              result.status
                            ).icon;
                            return (
                              <StatusIcon
                                className={`h-6 w-6 ${getStatusConfig(result.status).color} ${
                                  result.status === "Diproses"
                                    ? "animate-spin"
                                    : ""
                                }`}
                              />
                            );
                          })()}
                          <div>
                            <p className="font-medium">
                              {getStatusConfig(result.status).label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getStatusConfig(result.status).description}
                            </p>
                          </div>
                        </div>

                        {result.catatan && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800">
                              Catatan Petugas:
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              {result.catatan}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          Riwayat Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          {/* Gradient connecting line */}
                          <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-green-400 via-orange-400 to-green-500 opacity-40 rounded-full" />

                          <div className="space-y-6">
                            {/* Step: Pengajuan Dibuat */}
                            <div className="flex items-start gap-4 relative">
                              <div className="w-[30px] h-[30px] bg-teal-100 border-2 border-teal-400 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                                <FileText className="h-3.5 w-3.5 text-teal-600" />
                              </div>
                              <div className="flex-1 pb-1">
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <p className="font-semibold text-gray-800">
                                    Pengajuan Dibuat
                                  </p>
                                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {formatDate(result.tanggalPengajuan)}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  Pengajuan berhasil dikirim melalui website
                                </p>
                              </div>
                            </div>

                            {/* Step: Sedang Diproses */}
                            {result.tanggalProses && (
                              <div className="flex items-start gap-4 relative">
                                <div className="w-[30px] h-[30px] bg-orange-100 border-2 border-orange-400 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                                  <Clock className="h-3.5 w-3.5 text-orange-600" />
                                </div>
                                <div className="flex-1 pb-1">
                                  <div className="flex items-center justify-between flex-wrap gap-1">
                                    <p className="font-semibold text-gray-800">
                                      Sedang Diproses
                                    </p>
                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                      {formatDate(result.tanggalProses)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    Pengajuan sedang ditangani oleh petugas
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Step: Selesai */}
                            {result.tanggalSelesai && (
                              <div className="flex items-start gap-4 relative">
                                <div className="w-[30px] h-[30px] bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <div className="flex-1 pb-1">
                                  <div className="flex items-center justify-between flex-wrap gap-1">
                                    <p className="font-semibold text-gray-800">
                                      Selesai
                                    </p>
                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                      {formatDate(result.tanggalSelesai)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    Pengajuan telah selesai diproses
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Data Pemohon */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5 text-green-600" />
                          Data Pemohon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Nama Lengkap
                              </p>
                              <p className="font-medium text-sm">
                                {result.namaLengkap}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">NIK</p>
                              <p className="font-medium text-sm">
                                {result.nik}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Phone className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                No. Telepon
                              </p>
                              <p className="font-medium text-sm">
                                {result.noTelepon}
                              </p>
                            </div>
                          </div>
                          {result.email && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-sm">
                                  {result.email}
                                </p>
                              </div>
                            </div>
                          )}
                          {result.alamat && (
                            <div className="md:col-span-2 flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-rose-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Alamat
                                </p>
                                <p className="font-medium text-sm">
                                  {result.alamat}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Layanan */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          Layanan yang Diajukan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {result.layanan.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Diajukan pada{" "}
                              {formatDate(result.tanggalPengajuan)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Dokumen */}
                  {result.dokumen.length > 0 && (
                    <motion.div variants={fadeInUp}>
                      <Card className="border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Download className="h-5 w-5 text-green-600" />
                            Dokumen Terlampir
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.dokumen.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {doc.namaDokumen}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {doc.fileName}
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Hubungi Kami CTA */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              Butuh Bantuan?
                            </h3>
                            <p className="text-green-100 text-sm mt-1">
                              Hubungi kami melalui WhatsApp untuk informasi
                              lebih lanjut tentang pengajuan Anda.
                            </p>
                          </div>
                          <a
                            href={CONTACT_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors shadow-sm flex-shrink-0"
                          >
                            <Phone className="h-4 w-4" />
                            Hubungi Kami
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {/* Initial State */}
              {!notFound && !result && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-700 font-semibold text-lg">
                        Masukkan Nomor Pengajuan
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Masukkan nomor pengajuan di atas untuk melihat status
                        terkini dari layanan yang Anda ajukan.
                      </p>
                      <p className="text-xs text-gray-400 mt-3 font-mono">
                        Format: ONL-YYYYMMDD-XXXX
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
