"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      };
    case "Pencatatan Sipil":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        bannerBg: "from-amber-600 to-amber-800",
        subtleBg: "bg-amber-50/50",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        bannerBg: "from-green-700 to-green-900",
        subtleBg: "bg-gray-50",
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

  // Render a single service card
  const renderServiceCard = (service: Layanan, colors: ReturnType<typeof getCategoryColor>) => {
    const IconComponent = getIcon(service.icon);
    const isPendaftaran = service.category === "Pendaftaran Penduduk";
    return (
      <Link
        key={service.id}
        href={`/layanan/${service.slug}`}
        className="group block h-full"
      >
        <Card className="h-full border border-gray-200 hover:border-green-300 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isPendaftaran ? "bg-emerald-100" : "bg-amber-100"}`}>
                <IconComponent className={`h-7 w-7 ${isPendaftaran ? "text-emerald-600" : "text-amber-600"}`} />
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <Badge
                  variant="secondary"
                  className={`text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
                >
                  {service.category || "Layanan"}
                </Badge>
                <Badge className="text-xs bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold">
                  GRATIS
                </Badge>
              </div>
            </div>
            <CardTitle className="text-lg group-hover:text-green-700 transition-colors mt-4">
              {service.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>

            {/* Processing time indicator */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium text-green-600">
                {service.processingTime || "Selesai di Tempat"}
              </span>
            </div>

            {/* Footer with sliding arrow */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-green-700 text-sm font-medium inline-flex items-center gap-0 group-hover:gap-2 transition-all duration-300">
                Lihat Detail
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <section className={`py-12 md:py-16 ${sectionBg} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        {/* Free Service Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 flex-shrink-0" />
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
        </div>

        {/* Same Day Service Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">
                Layanan Selesai di Tempat
              </p>
              <p className="text-sm text-green-700 mt-1">
                Seluruh layanan kependudukan dapat diselesaikan pada hari yang
                sama selama persyaratan sudah lengkap dan benar.
              </p>
            </div>
          </div>
        </div>

        {/* Category Hero Banner - shows when a category filter is active */}
        {hasActiveFilter && !loading && (
          <div className="max-w-4xl mx-auto mb-8">
            <div
              className={`bg-gradient-to-r ${activeCategoryColors.bannerBg} rounded-lg p-6 text-white transition-all duration-300`}
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
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter Buttons with Icons */}
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((category) => {
              const isActive = selectedCategory === category.name;
              const CatIcon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 border-2 cursor-pointer
                    ${
                      isActive
                        ? "bg-green-700 text-white border-green-700 shadow-md shadow-green-700/25"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
                    }
                  `}
                >
                  <CatIcon
                    className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  <span>{category.name}</span>
                  {!isActive && (
                    <span className="hidden sm:inline text-xs text-gray-400">
                      {category.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Count */}
        {!loading && (
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredServices.length}
              </span>{" "}
              layanan
              {selectedCategory !== "Semua" && (
                <span>
                  {" "}
                  dalam{" "}
                  <span className="font-medium text-gray-700">
                    {selectedCategory}
                  </span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  untuk &quot;
                  <span className="font-medium text-gray-700">{searchQuery}</span>
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Inbox className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `Tidak ada layanan yang sesuai dengan pencarian "${searchQuery}". Coba gunakan kata kunci yang berbeda.`
                : `Tidak ada layanan dalam kategori ${selectedCategory}. Silakan pilih kategori lain.`}
            </p>
            <div className="flex justify-center gap-3">
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="border-gray-300"
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
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
                    >
                      <CatIcon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${colors.text}`}
                      >
                        {category}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {categoryServices.length} layanan tersedia
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 ml-4" />
                  </div>

                  {/* Services Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service) =>
                      renderServiceCard(service, colors)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered list view */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const colors = getCategoryColor(service.category || "");
              return renderServiceCard(service, colors);
            })}
          </div>
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
