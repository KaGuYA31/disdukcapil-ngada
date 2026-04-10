"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const news = [
  {
    id: "1",
    title: "Pelayanan Online Disdukcapil Ngada Kini Lebih Mudah",
    excerpt:
      "Masyarakat kini dapat mengakses informasi layanan kependudukan secara online melalui portal resmi Disdukcapil Kabupaten Ngada.",
    thumbnail: null,
    category: "Informasi",
    date: "2024-01-15",
    views: 245,
    slug: "pelayanan-online-disdukcapil",
  },
  {
    id: "2",
    title: "Jadwal Pelayanan Bulan Januari 2024",
    excerpt:
      "Informasi jadwal pelayanan Disdukcapil Ngada untuk bulan Januari 2024. Pastikan Anda datang pada jam kerja yang telah ditentukan.",
    thumbnail: null,
    category: "Pengumuman",
    date: "2024-01-10",
    views: 189,
    slug: "jadwal-pelayanan-januari-2024",
  },
  {
    id: "3",
    title: "Sosialisasi Pentingnya Mempunyai Dokumen Kependudukan",
    excerpt:
      "Tim Disdukcapil Ngada melakukan sosialisasi ke berbagai kecamatan tentang pentingnya memiliki dokumen kependudukan yang lengkap.",
    thumbnail: null,
    category: "Kegiatan",
    date: "2024-01-08",
    views: 156,
    slug: "sosialisasi-dokumen-kependudukan",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "bg-blue-100 text-blue-700";
    case "pengumuman":
      return "bg-yellow-100 text-yellow-700";
    case "kegiatan":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function NewsSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Berita Terbaru
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Informasi & Kegiatan
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Dapatkan informasi terbaru seputar layanan kependudukan dan
              kegiatan Disdukcapil Kabupaten Ngada.
            </p>
          </div>
          <Link href="/berita">
            <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/berita/${item.slug}`} className="group">
              <Card className="h-full card-hover overflow-hidden border-gray-200">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-bold">
                    D
                  </div>
                  <Badge
                    className={`absolute top-3 left-3 ${getCategoryColor(item.category)}`}
                  >
                    {item.category}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {item.views} dilihat
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
