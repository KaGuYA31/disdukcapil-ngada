"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  Globe,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  ScanLine,
  Heart,
  Baby,
  Users,
  BadgeCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface LayananOnline {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  requirements: Array<{ label: string; description?: string }>;
  procedures: Array<{ step: number; title: string; description?: string }>;
  forms: Array<{ name: string; url: string }>;
  processingTime: string | null;
}

interface UploadedDoc {
  namaDokumen: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

export default function LayananOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [layananList, setLayananList] = useState<LayananOnline[]>([]);
  const [selectedLayanan, setSelectedLayanan] = useState<LayananOnline | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [nomorPengajuan, setNomorPengajuan] = useState("");
  const [totalSubmissions, setTotalSubmissions] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    noTelepon: "",
    email: "",
    keterangan: "",
    dokumen: [] as UploadedDoc[],
  });

  const [uploadingDocs, setUploadingDocs] = useState(false);

  useEffect(() => {
    fetchLayanan();
    fetchSubmissionsCount();
  }, []);

  const fetchLayanan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/layanan-online");
      const result = await response.json();
      if (result.success) {
        setLayananList(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching layanan:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data layanan online",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsCount = async () => {
    try {
      const response = await fetch("/api/layanan-online?type=submissions");
      const result = await response.json();
      if (result.success) {
        setTotalSubmissions(result.data?.length ?? 0);
      }
    } catch {
      // Silent fail - not critical
    }
  };

  const openSubmissionForm = (layanan: LayananOnline) => {
    setSelectedLayanan(layanan);
    setFormData({
      namaLengkap: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      alamat: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
      noTelepon: "",
      email: "",
      keterangan: "",
      dokumen: [],
    });
    setShowFormDialog(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocs(true);
    try {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "pengajuan");

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          dokumen: [
            ...prev.dokumen.filter((d) => d.namaDokumen !== docName),
            {
              namaDokumen: docName,
              fileName: result.originalName || file.name,
              fileUrl: result.url,
              fileSize: result.size,
              fileType: result.type,
            },
          ],
        }));
        toast({
          title: "Berhasil",
          description: `Dokumen ${docName} berhasil diunggah`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengunggah dokumen",
        variant: "destructive",
      });
    } finally {
      setUploadingDocs(false);
      e.target.value = "";
    }
  };

  const removeDocument = (docName: string) => {
    setFormData((prev) => ({
      ...prev,
      dokumen: prev.dokumen.filter((d) => d.namaDokumen !== docName),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.namaLengkap || !formData.nik || !formData.noTelepon) {
      toast({
        title: "Data Belum Lengkap",
        description: "Nama lengkap, NIK, dan nomor telepon wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (formData.namaLengkap.length < 3) {
      toast({
        title: "Data Tidak Valid",
        description: "Nama lengkap minimal 3 karakter",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{16}$/.test(formData.nik)) {
      toast({
        title: "NIK Tidak Valid",
        description: "NIK harus terdiri dari 16 digit angka",
        variant: "destructive",
      });
      return;
    }

    const phoneClean = formData.noTelepon.replace(/[\s\-()]/g, "");
    const phoneRegex = /^(\+62|62|0)?8[1-9][0-9]{6,11}$/;
    if (!phoneRegex.test(phoneClean)) {
      toast({
        title: "Nomor Telepon Tidak Valid",
        description: "Gunakan format 08xx atau +62xx (contoh: 081234567890)",
        variant: "destructive",
      });
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Format email tidak benar",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLayanan) {
      toast({
        title: "Error",
        description: "Pilih layanan terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/layanan-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layananId: selectedLayanan.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        toast({
          title: "Terlalu Banyak Permintaan",
          description: result.error || `Silakan tunggu ${result.retryAfter || 60} detik sebelum mencoba lagi`,
          variant: "destructive",
        });
        return;
      }

      if (result.success) {
        setNomorPengajuan(result.data.nomorPengajuan);
        setShowFormDialog(false);
        setSuccessDialog(true);
      } else {
        throw new Error(result.error || "Gagal mengirim pengajuan");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Pengajuan Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    const icons: { [key: string]: any } = {
      CreditCard: FileText,
      Users: Users,
      Baby: Baby,
      Heart: Heart,
      MapPin: MapPin,
      FileText: FileText,
      RefreshCw: FileText,
      Stamp: FileText,
      Gavel: FileText,
      MoveRight: ArrowRight,
      Shield: Shield,
      ScanLine: ScanLine,
    };
    return icons[iconName || "FileText"] || FileText;
  };

  const heroSteps = [
    { step: 1, label: "Pilih", icon: Globe },
    { step: 2, label: "Isi Form", icon: FileText },
    { step: 3, label: "Upload", icon: Upload },
    { step: 4, label: "Selesai", icon: CheckCircle },
  ];

  const steps = [
    {
      step: 1,
      title: "Pilih Layanan",
      desc: "Pilih layanan yang ingin diajukan",
      icon: FileText,
    },
    {
      step: 2,
      title: "Isi Formulir",
      desc: "Lengkapi data diri dan informasi pengajuan",
      icon: User,
    },
    {
      step: 3,
      title: "Upload Dokumen",
      desc: "Unggah dokumen persyaratan yang diperlukan",
      icon: Upload,
    },
    {
      step: 4,
      title: "Pantau Status",
      desc: "Cek status pengajuan kapan saja",
      icon: Clock,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        {/* Hero Banner */}
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

          {/* Decorative floating gradient orbs */}
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
            className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9 }}
            className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-br from-green-300/15 to-teal-400/10 rounded-full blur-lg"
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              {/* Breadcrumb */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.4, ease: "easeOut" as const }}>
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Layanan Online" }]} />
              </motion.div>

              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex items-center gap-2 mb-3 mt-4">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <Globe className="h-5 w-5" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  Layanan Jarak Jauh
                </Badge>
                {/* Terpercaya Badge */}
                <Badge className="bg-emerald-500/30 text-emerald-100 border-emerald-400/30 flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Terpercaya
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Layanan Online
              </motion.h1>

              <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-green-100 text-lg">
                Ajukan layanan kependudukan dari mana saja tanpa harus datang ke kantor.
                Untuk masyarakat yang lokasinya jauh dari pusat pelayanan.
              </motion.p>

              {/* Animated Step Indicators in Hero */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="mt-8 flex items-center gap-2 sm:gap-0 overflow-x-auto pb-2"
              >
                {heroSteps.map((item, idx) => {
                  const StepIcon = item.icon;
                  return (
                    <div key={item.step} className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.15, duration: 0.4 }}
                        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-w-fit"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + idx * 0.15, type: "spring", stiffness: 200, damping: 15 }}
                          className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <StepIcon className="h-4 w-4 text-green-200" />
                        </motion.div>
                        <span className="text-sm font-medium text-green-100 whitespace-nowrap">
                          {item.label}
                        </span>
                      </motion.div>
                      {idx < heroSteps.length - 1 && (
                        <div className="px-1 sm:px-2 flex-shrink-0">
                          <div className="w-4 sm:w-8 h-px bg-green-400/40" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>

              {/* Keunggulan Layanan Online */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="mt-6 bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/30"
              >
                <h2 className="text-xl font-bold mb-3">Keunggulan Layanan Online</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Tidak perlu datang ke kantor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Upload dokumen persyaratan langsung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Pantau status pengajuan kapan saja</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>GRATIS - tidak dipungut biaya apapun</span>
                  </li>
                </ul>
              </motion.div>

              {/* Cek Status Button with Pulse Animation */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="mt-6">
                <div className="relative inline-block">
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-white/10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Button
                    onClick={() => router.push("/layanan-online/cek-status")}
                    variant="outline"
                    className="relative bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 font-semibold"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Cek Status Pengajuan
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-green-600" />
            </svg>
          </div>
        </section>

        {/* Statistics Banner */}
        <section className="py-6 bg-gradient-to-r from-green-600 via-green-700 to-teal-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-green-300 rounded-full blur-xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalSubmissions !== null ? totalSubmissions.toLocaleString("id-ID") : "—"}
                  </p>
                  <p className="text-sm text-green-200">Total Pengajuan Online</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{layananList.length}</p>
                  <p className="text-sm text-green-200">Layanan Tersedia</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="h-5 w-5 text-teal-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">GRATIS</p>
                  <p className="text-sm text-green-200">100% Bebas Biaya</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Available Online Services */}
        <section className="py-12 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                Layanan Tersedia untuk Pengajuan Online
              </motion.h2>

              {layananList.length === 0 ? (
                <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="py-12 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Saat ini belum ada layanan yang tersedia untuk pengajuan online.
                        Silakan kunjungi kantor Disdukcapil untuk layanan langsung.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {layananList.map((layanan) => {
                    const IconComponent = getIconComponent(layanan.icon);
                    return (
                      <motion.div
                        key={layanan.id}
                        variants={fadeInUp}
                        transition={{ duration: 0.4 }}
                      >
                        <Card className="h-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                          {/* Top accent line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="h-6 w-6 text-green-700 dark:text-green-400" />
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="text-lg text-gray-900 dark:text-gray-100 truncate">{layanan.name}</CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                  {layanan.processingTime || "Selesai di Tempat"}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {layanan.description}
                            </p>

                            {layanan.requirements.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Persyaratan:
                                </p>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                  {layanan.requirements.slice(0, 3).map((req, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                      <span className="line-clamp-1">{req.label}</span>
                                    </li>
                                  ))}
                                  {layanan.requirements.length > 3 && (
                                    <li className="text-green-600 dark:text-green-400">
                                      +{layanan.requirements.length - 3} persyaratan lainnya
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                            <Button
                              onClick={() => openSubmissionForm(layanan)}
                              className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                              Ajukan Sekarang
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Cara Mengajukan Layanan Online
              </motion.h2>

              <div className="relative max-w-4xl mx-auto">
                {/* Connecting line - visible on md+ */}
                <div className="hidden md:block absolute top-16 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-800 dark:via-green-600 dark:to-green-800 z-0" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 relative z-10">
                  {steps.map((item) => {
                    const StepIcon = item.icon;
                    return (
                      <motion.div
                        key={item.step}
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="group"
                      >
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 sm:p-6 text-center shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 hover:-translate-y-1 transition-all duration-300 cursor-default">
                          {/* Step number circle with gradient */}
                          <div className="relative mx-auto mb-3 sm:mb-5">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg group-hover:shadow-green-200/50 dark:group-hover:shadow-green-900/50 transition-shadow duration-300">
                              <StepIcon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white dark:ring-gray-800">
                              {item.step}
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-400 mb-1">
                            Langkah {item.step}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-lg">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed hidden sm:block">{item.desc}</p>
                        </div>

                        {/* Arrow between steps on desktop */}
                        {item.step < 4 && (
                          <div className="hidden md:flex justify-center mt-2">
                            <ArrowRight className="h-5 w-5 text-green-300 dark:text-green-700" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />

      {/* Submission Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Pengajuan: {selectedLayanan?.name}</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Lengkapi formulir di bawah ini untuk mengajukan layanan secara online
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Data Pemohon */}
            <Card className="border-gray-200 dark:border-gray-600 dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-900 dark:text-gray-100">Data Pemohon</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Data diri pemohon layanan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaLengkap" className="text-gray-700 dark:text-gray-300">Nama Lengkap *</Label>
                    <Input
                      id="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, namaLengkap: e.target.value }))
                      }
                      placeholder="Nama sesuai KTP"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nik" className="text-gray-700 dark:text-gray-300">NIK (16 digit) *</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nik: e.target.value }))
                      }
                      placeholder="3578010101990001"
                      maxLength={16}
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempatLahir" className="text-gray-700 dark:text-gray-300">Tempat Lahir</Label>
                    <Input
                      id="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tempatLahir: e.target.value }))
                      }
                      placeholder="Jakarta"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggalLahir" className="text-gray-700 dark:text-gray-300">Tanggal Lahir</Label>
                    <Input
                      id="tanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tanggalLahir: e.target.value }))
                      }
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin" className="text-gray-700 dark:text-gray-300">Jenis Kelamin</Label>
                    <select
                      id="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, jenisKelamin: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md"
                    >
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat" className="text-gray-700 dark:text-gray-300">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, alamat: e.target.value }))
                    }
                    placeholder="Alamat lengkap"
                    rows={2}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rt" className="text-gray-700 dark:text-gray-300">RT</Label>
                    <Input
                      id="rt"
                      value={formData.rt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rt: e.target.value }))
                      }
                      placeholder="001"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw" className="text-gray-700 dark:text-gray-300">RW</Label>
                    <Input
                      id="rw"
                      value={formData.rw}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rw: e.target.value }))
                      }
                      placeholder="002"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kelurahan" className="text-gray-700 dark:text-gray-300">Kelurahan</Label>
                    <Input
                      id="kelurahan"
                      value={formData.kelurahan}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, kelurahan: e.target.value }))
                      }
                      placeholder="Kelurahan"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan" className="text-gray-700 dark:text-gray-300">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      value={formData.kecamatan}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, kecamatan: e.target.value }))
                      }
                      placeholder="Kecamatan"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="noTelepon" className="text-gray-700 dark:text-gray-300">Nomor Telepon *</Label>
                    <Input
                      id="noTelepon"
                      value={formData.noTelepon}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, noTelepon: e.target.value }))
                      }
                      placeholder="08123456789"
                      type="tel"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (opsional)</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="email@contoh.com"
                      type="email"
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dokumen Persyaratan */}
            {selectedLayanan && selectedLayanan.requirements.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-600 dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-900 dark:text-gray-100">Dokumen Persyaratan</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Upload dokumen yang diperlukan untuk pengajuan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedLayanan.requirements.map((req, index) => {
                    const uploadedDoc = formData.dokumen.find(
                      (d) => d.namaDokumen === req.label
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          {uploadedDoc ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.label}</p>
                            {req.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">{req.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {uploadedDoc ? (
                            <>
                              <span className="text-xs text-green-600 dark:text-green-400 max-w-32 truncate">
                                {uploadedDoc.fileName}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 dark:text-red-400"
                                onClick={() => removeDocument(req.label)}
                              >
                                Hapus
                              </Button>
                            </>
                          ) : (
                            <Label
                              htmlFor={`doc-${index}`}
                              className={`cursor-pointer ${
                                uploadingDocs ? "pointer-events-none opacity-50" : ""
                              }`}
                            >
                              <input
                                id={`doc-${index}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, req.label)}
                                disabled={uploadingDocs}
                              />
                              <Button variant="outline" size="sm" asChild className="dark:border-gray-600 dark:text-gray-300">
                                <span>
                                  {uploadingDocs ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                </span>
                              </Button>
                            </Label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Keterangan Tambahan */}
            <div className="space-y-2">
              <Label htmlFor="keterangan" className="text-gray-700 dark:text-gray-300">Keterangan Tambahan (opsional)</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, keterangan: e.target.value }))
                }
                placeholder="Tambahkan informasi atau keterangan lain yang diperlukan"
                rows={3}
                className="dark:bg-gray-800 dark:border-gray-600"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFormDialog(false)} className="dark:border-gray-600 dark:text-gray-300">
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Kirim Pengajuan
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 dark:text-green-400">
              Pengajuan Berhasil Dikirim
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mb-4"
            >
              Pengajuan Anda telah berhasil dikirim. Silakan simpan nomor pengajuan berikut
              untuk melacak status:
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4"
            >
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{nomorPengajuan}</p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Anda akan dihubungi oleh petugas melalui nomor telepon yang terdaftar.
            </motion.p>
          </motion.div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessDialog(false);
                router.push("/layanan-online/cek-status");
              }}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Cek Status Pengajuan
            </Button>
            <Button
              onClick={() => setSuccessDialog(false)}
              className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
