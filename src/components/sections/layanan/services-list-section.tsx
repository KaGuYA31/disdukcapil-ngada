"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Users,
  Baby,
  Heart,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  Search,
  ArrowRight,
  Gavel,
  MoveRight,
  CheckCircle,
  Sparkles,
  Loader2,
  ClipboardList,
  BookOpen,
  ChevronRight,
  Home,
  Inbox,
  FileSearch,
  Clock,
  Scale,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  Users,
  Baby,
  Heart,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  Gavel,
  MoveRight,
  ClipboardList,
  BookOpen,
};

interface Layanan {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  processingTime: string | null;
  fee: string | null;
  isActive: boolean;
  category?: string;
}

interface CategoryOption {
  name: string;
  icon: React.ElementType;
  description: string;
}

const categoryOptions: CategoryOption[] = [
  { name: "Semua", icon: FileText, description: "Semua layanan" },
  {
    name: "Pendaftaran Penduduk",
    icon: ClipboardList,
    description: "KTP-el, KK, dan lainnya",
  },
  {
    name: "Pencatatan Sipil",
    icon: BookOpen,
    description: "Akta, pindah, dan lainnya",
  },
];

// Default services if database is empty
const defaultServices: Layanan[] = [
  {
    id: "ktp-el",
    name: "KTP-el (Kartu Tanda Penduduk Elektronik)",
    slug: "ktp-el",
    description:
      "Kartu identitas elektronik untuk WNI berusia 17 tahun atau sudah menikah. Rekam baru, penggantian rusak/hilang, dan perpanjangan.",
    icon: "CreditCard",
    processingTime: "Selesai di Tempat*",
    fee: "GRATIS",
    isActive: true,
    category: "Pendaftaran Penduduk",
  },
  {
    id: "kartu-keluarga",
    name: "Kartu Keluarga (KK)",
    slug: "kartu-keluarga",
    description:
      "KK Baru (Membentuk Keluarga), Tambah Anggota (Anak), KK Hilang/Rusak, dan perubahan data KK.",
    icon: "Users",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pendaftaran Penduduk",
  },
  {
    id: "perubahan-data",
    name: "Perubahan Data Kependudukan",
    slug: "perubahan-data",
    description:
      "Perubahan atau pemutakhiran data kependudukan seperti alamat, status perkawinan, dll.",
    icon: "RefreshCw",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pendaftaran Penduduk",
  },
  {
    id: "legalisasi",
    name: "Legalisasi Dokumen",
    slug: "legalisasi",
    description:
      "Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang untuk keperluan administrasi.",
    icon: "Stamp",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pendaftaran Penduduk",
  },
  {
    id: "akta-kelahiran",
    name: "Akta Kelahiran",
    slug: "akta-kelahiran",
    description:
      "Pencatatan kelahiran untuk setiap peristiwa kelahiran, baik baru maupun terlambat.",
    icon: "Baby",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
  {
    id: "akta-kematian",
    name: "Akta Kematian",
    slug: "akta-kematian",
    description:
      "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian.",
    icon: "Heart",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
  {
    id: "akta-perkawinan",
    name: "Akta Perkawinan",
    slug: "akta-perkawinan",
    description:
      "Pencatatan peristiwa perkawinan WNI yang dilangsungkan berdasarkan hukum agama.",
    icon: "FileText",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
  {
    id: "akta-perceraian",
    name: "Akta Perceraian",
    slug: "akta-perceraian",
    description:
      "Pencatatan perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan.",
    icon: "Gavel",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
  {
    id: "pindah-penduduk",
    name: "Pindah (Perpindahan Penduduk)",
    slug: "pindah-penduduk",
    description:
      "Layanan administrasi perpindahan penduduk antar kelurahan/kecamatan/kabupaten/kota/provinsi.",
    icon: "MoveRight",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
];

function getCategoryIcon(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return ClipboardList;
    case "Pencatatan Sipil":
      return BookOpen;
    default:
      return FileText;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        bannerBg: "from-emerald-600 to-emerald-800",
        subtleBg: "bg-emerald-50/50",
        gradient: "from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/20",
        iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40",
        iconText: "text-emerald-600 dark:text-emerald-400",
        hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      };
    case "Pencatatan Sipil":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        bannerBg: "from-amber-600 to-amber-800",
        subtleBg: "bg-amber-50/50",
        gradient: "from-amber-50 via-white to-orange-50 dark:from-amber-950/20 dark:via-gray-900 dark:to-orange-950/20",
        iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
        iconText: "text-amber-600 dark:text-amber-400",
        hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        bannerBg: "from-green-700 to-green-900",
        subtleBg: "bg-gray-50",
        gradient: "from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900",
        iconBg: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
        iconText: "text-green-600 dark:text-green-400",
        hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
      };
  }
}

function getCategoryDescription(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return "Layanan pendaftaran dan pengelolaan data kependudukan";
    case "Pencatatan Sipil":
      return "Layanan pencatatan peristiwa kependudukan dan sipil";
    default:
      return "";
  }
}

function ServicesListContent() {
  const searchParams = useSearchParams();
  const urlCategory =
    searchParams.get("kategori") || searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "Semua");
  const [services, setServices] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync from URL params
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let apiUrl = "/api/layanan";
        if (urlCategory) {
          apiUrl += `?kategori=${encodeURIComponent(urlCategory)}`;
        }
        const response = await fetch(apiUrl);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setServices(result.data.filter((s: Layanan) => s.isActive));
        } else {
          // Use default services if no data
          setServices(defaultServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [urlCategory]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string | null) => {
    return iconMap[iconName || "FileText"] || FileText;
  };

  // Group services by category for display
  const groupedServices =
    selectedCategory === "Semua" && !searchQuery
      ? Object.entries(
          filteredServices.reduce(
            (acc, service) => {
              const cat = service.category || "Lainnya";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(service);
              return acc;
            },
            {} as Record<string, Layanan[]>
          )
        )
      : null;

  // Determine section background based on active category
  const sectionBg =
    selectedCategory === "Semua"
      ? "bg-gray-50"
      : selectedCategory === "Pendaftaran Penduduk"
        ? "bg-emerald-50/30"
        : "bg-amber-50/30";

  const activeCategoryColors = getCategoryColor(selectedCategory);
  const ActiveCatIcon = getCategoryIcon(selectedCategory);
  const hasActiveFilter = selectedCategory !== "Semua" || searchQuery.length > 0;

  // Render a single service card with enhanced styling
  const renderServiceCard = (service: Layanan, colors: ReturnType<typeof getCategoryColor>, index: number) => {
    const IconComponent = getIcon(service.icon);
    const isPendaftaran = service.category === "Pendaftaran Penduduk";
    return (
      <motion.div
        key={service.id}
        variants={fadeInUp}
        className="group block h-full"
      >
        <Link href={`/layanan/${service.slug}`} className="block h-full">
          <Card className={`h-full border-2 ${colors.hoverBorder} bg-gradient-to-br ${colors.gradient} hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 dark:hover:shadow-green-500/5 transition-all duration-300 relative overflow-hidden`}>
            {/* Subtle corner accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 ${isPendaftaran ? 'bg-emerald-100/50 dark:bg-emerald-900/20' : 'bg-amber-100/50 dark:bg-amber-900/20'} -translate-y-1/2 translate-x-1/2 rounded-bl-[40px]`} />

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${colors.iconBg}`}
                >
                  <IconComponent className={`h-7 w-7 ${colors.iconText}`} />
                </motion.div>
                <div className="flex flex-col gap-1.5 items-end">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${colors.bg} ${colors.text} border ${colors.border} font-medium`}
                  >
                    {service.category || "Layanan"}
                  </Badge>
                  {service.isActive !== false ? (
                    <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Aktif
                    </Badge>
                  ) : (
                    <Badge className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-100 border border-gray-200">
                      Tidak Aktif
                    </Badge>
                  )}
                  <Badge className="text-xs bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold">
                    GRATIS
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors mt-4 leading-snug">
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>

              {/* Processing time indicator */}
              <div className="flex items-center gap-2 text-sm mb-4">
                <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {service.processingTime || "Selesai di Tempat"}
                </span>
              </div>

              {/* Footer with sliding arrow */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-green-700 dark:text-green-400 text-sm font-medium inline-flex items-center gap-0 group-hover:gap-2 transition-all duration-300">
                  Lihat Detail
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  };

  return (
    <section className={`py-12 md:py-16 ${sectionBg} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        {/* Free Service Notice */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg shadow-green-900/10">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-8 w-8 flex-shrink-0" />
              </motion.div>
              <div>
                <h3 className="font-bold text-xl mb-2">SELURUH LAYANAN GRATIS</h3>
                <p className="text-green-100">
                  Sesuai kebijakan pemerintah, seluruh layanan administrasi
                  kependudukan <strong> TIDAK DIPUNGUT BIAYA </strong> apapun.
                  Tidak ada biaya pendaftaran, biaya pencetakan, biaya
                  legalisasi, atau biaya lainnya.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>KTP-el Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>KK Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Akta Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Legalisasi Gratis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dasar Hukum Permendagri No. 6 Tahun 2026 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Dasar Hukum: Permendagri No. 6 Tahun 2026
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                Perubahan atas Permendagri No. 109 Tahun 2019 tentang Formulir dan Buku yang Digunakan dalam Administrasi Kependudukan. Seluruh persyaratan layanan mengacu pada regulasi terbaru ini.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Same Day Service Notice */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">
                Layanan Selesai di Tempat
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Seluruh layanan kependudukan dapat diselesaikan pada hari yang
                sama selama persyaratan sudah lengkap dan benar.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Hero Banner - shows when a category filter is active */}
        {hasActiveFilter && !loading && (
          <div className="max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-gradient-to-r ${activeCategoryColors.bannerBg} rounded-xl p-6 text-white shadow-lg`}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-sm text-white/70 mb-4">
                <Link
                  href="/layanan"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <Home className="h-3.5 w-3.5" />
                  Layanan
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-white font-medium">
                  {selectedCategory === "Semua" && searchQuery
                    ? `Pencarian: "${searchQuery}"`
                    : selectedCategory}
                </span>
              </nav>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  {searchQuery && selectedCategory === "Semua" ? (
                    <FileSearch className="h-7 w-7" />
                  ) : (
                    <ActiveCatIcon className="h-7 w-7" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {searchQuery && selectedCategory === "Semua"
                      ? "Hasil Pencarian"
                      : selectedCategory}
                  </h2>
                  {selectedCategory !== "Semua" && (
                    <p className="text-white/80 text-sm">
                      {getCategoryDescription(selectedCategory)}
                    </p>
                  )}
                  {searchQuery && selectedCategory === "Semua" && (
                    <p className="text-white/80 text-sm">
                      Menampilkan hasil untuk &quot;{searchQuery}&quot;
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-600 transition-colors"
                />
              </div>
            </motion.div>

            {/* Category Filter Buttons with Icons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              {categoryOptions.map((category) => {
                const isActive = selectedCategory === category.name;
                const CatIcon = category.icon;
                return (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`
                      inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 border-2 cursor-pointer
                      ${
                        isActive
                          ? "bg-green-700 text-white border-green-700 shadow-md shadow-green-700/25"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-green-600 dark:hover:text-green-400 dark:hover:bg-green-900/30"
                      }
                    `}
                  >
                    <CatIcon
                      className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-gray-400 dark:text-gray-500"}`}
                    />
                    <span>{category.name}</span>
                    {!isActive && (
                      <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">
                        {category.description}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Result Count */}
        {!loading && (
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {filteredServices.length}
              </span>{" "}
              layanan
              {selectedCategory !== "Semua" && (
                <span>
                  {" "}
                  dalam{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {selectedCategory}
                  </span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  untuk &quot;
                  <span className="font-medium text-gray-700 dark:text-gray-200">{searchQuery}</span>
                  &quot;
                </span>
              )}
            </p>
          </div>
        )}

        {/* Services Display */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : filteredServices.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <Inbox className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `Tidak ada layanan yang sesuai dengan pencarian "${searchQuery}". Coba gunakan kata kunci yang berbeda.`
                : `Tidak ada layanan dalam kategori ${selectedCategory}. Silakan pilih kategori lain.`}
            </p>
            <div className="flex justify-center gap-3">
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Hapus Pencarian
                </Button>
              )}
              {selectedCategory !== "Semua" && (
                <Button
                  onClick={() => setSelectedCategory("Semua")}
                  className="bg-green-700 hover:bg-green-800"
                >
                  Lihat Semua Layanan
                </Button>
              )}
            </div>
          </div>
        ) : groupedServices ? (
          /* Grouped by category view */
          <div className="space-y-12">
            {groupedServices.map(([category, categoryServices]) => {
              const colors = getCategoryColor(category);
              const CatIcon = getCategoryIcon(category);
              return (
                <motion.div
                  key={category}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                >
                  {/* Category Header */}
                  <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <CatIcon className={`h-5 w-5 ${colors.iconText}`} />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${colors.text} dark:text-${colors.text.replace('text-', '')}`}
                      >
                        {category}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryServices.length} layanan tersedia
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-4" />
                  </motion.div>

                  {/* Services Grid - responsive: single col mobile, 2 col tablet, 3 col desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service, index) =>
                      renderServiceCard(service, colors, index)
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Filtered list view - responsive: single col mobile, 2 col tablet, 3 col desktop */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => {
              const colors = getCategoryColor(service.category || "");
              return renderServiceCard(service, colors, index);
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ServicesListFallback() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    </section>
  );
}

export function ServicesListSection() {
  return (
    <Suspense fallback={<ServicesListFallback />}>
      <ServicesListContent />
    </Suspense>
  );
}
