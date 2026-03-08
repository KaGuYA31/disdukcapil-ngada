"use client";

import { useState } from "react";
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
  UserPlus,
  MoveRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "ktp-el",
    icon: CreditCard,
    title: "KTP-el (Kartu Tanda Penduduk Elektronik)",
    description:
      "Kartu identitas elektronik untuk WNI berusia 17 tahun atau sudah menikah. Rekam baru, penggantian rusak/hilang, dan perpanjangan.",
    category: "Dokumen Identitas",
    processingTime: "Selesai di Tempat*",
    color: "text-green-600",
    bgColor: "bg-green-100",
    sameDay: true,
  },
  {
    id: "kartu-keluarga",
    icon: Users,
    title: "Kartu Keluarga (KK)",
    description:
      "KK Baru (Membentuk Keluarga), Tambah Anggota (Anak), KK Hilang/Rusak, dan perubahan data KK.",
    category: "Dokumen Keluarga",
    processingTime: "Selesai di Tempat",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    sameDay: true,
  },
  {
    id: "pindah-datang-kk-sendiri",
    icon: MoveRight,
    title: "Pindah Datang (Buat KK Sendiri)",
    description:
      "Layanan perpindahan penduduk dari daerah lain untuk membuat Kartu Keluarga baru atas nama sendiri.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    sameDay: true,
  },
  {
    id: "pindah-datang-numpang-kk",
    icon: Users,
    title: "Pindah Datang (Numpang KK)",
    description:
      "Layanan perpindahan penduduk dari daerah lain untuk menumpang pada Kartu Keluarga yang sudah ada.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    sameDay: true,
  },
  {
    id: "akta-kelahiran",
    icon: Baby,
    title: "Akta Kelahiran",
    description:
      "Pencatatan kelahiran untuk setiap peristiwa kelahiran, baik baru maupun terlambat.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    sameDay: true,
  },
  {
    id: "akta-kematian",
    icon: Heart,
    title: "Akta Kematian",
    description:
      "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    sameDay: true,
  },
  {
    id: "akta-perkawinan",
    icon: FileText,
    title: "Akta Perkawinan",
    description:
      "Pencatatan peristiwa perkawinan WNI yang dilangsungkan berdasarkan hukum agama.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    color: "text-red-600",
    bgColor: "bg-red-100",
    sameDay: true,
  },
  {
    id: "akta-perceraian",
    icon: Gavel,
    title: "Akta Perceraian",
    description:
      "Pencatatan perceraian yang telah memiliki kekuatan hukum tetap berdasarkan putusan pengadilan.",
    category: "Pencatatan Sipil",
    processingTime: "Selesai di Tempat",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    sameDay: true,
  },
  {
    id: "perubahan-data",
    icon: RefreshCw,
    title: "Perubahan Data Kependudukan",
    description:
      "Perubahan atau pemutakhiran data kependudukan seperti alamat, status perkawinan, dll.",
    category: "Administrasi Penduduk",
    processingTime: "Selesai di Tempat",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    sameDay: true,
  },
  {
    id: "legalisasi",
    icon: Stamp,
    title: "Legalisasi Dokumen",
    description:
      "Legalisasi fotokopi dokumen kependudukan oleh pejabat berwenang untuk keperluan administrasi.",
    category: "Layanan Umum",
    processingTime: "Selesai di Tempat",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    sameDay: true,
  },
];

const categories = [
  "Semua",
  "Dokumen Identitas",
  "Dokumen Keluarga",
  "Pencatatan Sipil",
  "Administrasi Penduduk",
  "Layanan Umum",
];

export function ServicesListSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  Sesuai kebijakan pemerintah, seluruh layanan administrasi kependudukan 
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/layanan/${service.id}`}
              className="group block h-full"
            >
              <Card className="h-full card-hover border-gray-200 hover:border-green-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                      {service.sameDay && (
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                          Selesai di Tempat
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-green-700 transition-colors mt-4">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Waktu Proses:</span>
                      <span className="font-medium text-green-600">
                        {service.processingTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Biaya:</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold">
                        GRATIS
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
          ))}
        </div>

        {filteredServices.length === 0 && (
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
