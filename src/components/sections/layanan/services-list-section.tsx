"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

const categories = [
  "Semua",
  "Dokumen Identitas",
  "Dokumen Keluarga",
  "Pencatatan Sipil",
  "Administrasi Penduduk",
  "Layanan Umum",
];

// Default services if database is empty
const defaultServices: Layanan[] = [
  {
    id: "ktp-el",
    name: "KTP-el (Kartu Tanda Penduduk Elektronik)",
    slug: "ktp-el",
    description: "Kartu identitas elektronik untuk WNI berusia 17 tahun atau sudah menikah. Rekam baru, penggantian rusak/hilang, dan perpanjangan.",
    icon: "CreditCard",
    processingTime: "Selesai di Tempat*",
    fee: "GRATIS",
    isActive: true,
    category: "Dokumen Identitas",
  },
  {
    id: "kartu-keluarga",
    name: "Kartu Keluarga (KK)",
    slug: "kartu-keluarga",
    description: "KK Baru (Membentuk Keluarga), Tambah Anggota (Anak), KK Hilang/Rusak, dan perubahan data KK.",
    icon: "Users",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Dokumen Keluarga",
  },
  {
    id: "akta-kelahiran",
    name: "Akta Kelahiran",
    slug: "akta-kelahiran",
    description: "Pencatatan kelahiran untuk setiap peristiwa kelahiran, baik baru maupun terlambat.",
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
    description: "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian.",
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
    description: "Pencatatan peristiwa perkawinan WNI yang dilangsungkan berdasarkan hukum agama.",
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
    description: "Pencatatan perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan.",
    icon: "Gavel",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Pencatatan Sipil",
  },
  {
    id: "perubahan-data",
    name: "Perubahan Data Kependudukan",
    slug: "perubahan-data",
    description: "Perubahan atau pemutakhiran data kependudukan seperti alamat, status perkawinan, dll.",
    icon: "RefreshCw",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Administrasi Penduduk",
  },
  {
    id: "legalisasi",
    name: "Legalisasi Dokumen",
    slug: "legalisasi",
    description: "Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang untuk keperluan administrasi.",
    icon: "Stamp",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
    category: "Layanan Umum",
  },
];

export function ServicesListSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [services, setServices] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/layanan");
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
  }, []);

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

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Free Service Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">SELURUH LAYANAN GRATIS</h3>
                <p className="text-green-100">
                  Sesuai kebijakan pemerintah, seluruh layanan administrasi kependudukan{" "}
                  <strong> TIDAK DIPUNGUT BIAYA </strong> apapun. Tidak ada biaya pendaftaran,
                  biaya pencetakan, biaya legalisasi, atau biaya lainnya.
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-800">Layanan Selesai di Tempat</p>
              <p className="text-sm text-blue-700 mt-1">
                Seluruh layanan kependudukan dapat diselesaikan pada hari yang sama selama
                persyaratan sudah lengkap dan benar. Kecuali untuk rekam baru KTP-el yang
                memerlukan waktu 3-5 hari kerja untuk proses data ke pusat.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-green-700 hover:bg-green-800"
                      : "border-gray-300"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = getIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full card-hover border-gray-200 hover:border-green-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="h-7 w-7 text-green-600" />
                        </div>
                        <div className="flex flex-col gap-1">
                          {service.category && (
                            <Badge variant="secondary" className="text-xs">
                              {service.category}
                            </Badge>
                          )}
                          <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                            Selesai di Tempat
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-green-700 transition-colors mt-4">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Waktu Proses:</span>
                          <span className="font-medium text-green-600">
                            {service.processingTime || "Selesai di Tempat"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Biaya:</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold">
                            {service.fee || "GRATIS"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-green-700 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lihat Persyaratan
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Tidak ada layanan yang sesuai dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
