"use client";

import Link from "next/link";
import {
  CreditCard,
  Users,
  Baby,
  Heart,
  ArrowRight,
  MapPin,
  FileText,
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

const services = [
  {
    icon: CreditCard,
    title: "KTP-el",
    description:
      "Kartu Tanda Penduduk Elektronik untuk warga berusia 17 tahun atau sudah menikah.",
    href: "/layanan/ktp-el",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Users,
    title: "Kartu Keluarga",
    description:
      "Dokumen kependudukan yang memuat data tentang susunan, hubungan, dan jumlah anggota keluarga.",
    href: "/layanan/kartu-keluarga",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Baby,
    title: "Akta Kelahiran",
    description:
      "Akta catatan sipil yang diterbitkan untuk setiap peristiwa kelahiran.",
    href: "/layanan/akta-kelahiran",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    icon: Heart,
    title: "Akta Kematian",
    description:
      "Surat keterangan kematian yang diterbitkan untuk setiap peristiwa kematian.",
    href: "/layanan/akta-kematian",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    icon: MapPin,
    title: "Perpindahan Penduduk",
    description:
      "Layanan administrasi perpindahan penduduk antar kelurahan/kecamatan/kota.",
    href: "/layanan/perpindahan",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: FileText,
    title: "Akta Perkawinan",
    description:
      "Pencatatan peristiwa perkawinan warga negara Indonesia.",
    href: "/layanan/akta-perkawinan",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: RefreshCw,
    title: "Perubahan Data",
    description:
      "Perubahan atau pemutakhiran data kependudukan pada database.",
    href: "/layanan/perubahan-data",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: FileText,
    title: "Legalisasi Dokumen",
    description:
      "Legalisisasi fotokopi dokumen kependudukan oleh pejabat berwenang.",
    href: "/layanan/legalisasi",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Layanan Administrasi Kependudukan
          </h2>
          <p className="text-gray-600 mt-4">
            Berbagai layanan administrasi kependudukan yang dapat diakses oleh
            masyarakat Kabupaten Ngada. Silakan pilih layanan yang Anda
            butuhkan.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group block h-full"
            >
              <Card className="h-full card-hover border-gray-200 hover:border-green-300">
                <CardHeader>
                  <div
                    className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-green-700 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/layanan">
            <Button
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Lihat Semua Layanan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
