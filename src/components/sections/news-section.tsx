"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Eye,
  Info,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// --- Data ---
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

const categories = ["Semua", "Informasi", "Pengumuman", "Kegiatan"] as const;

// --- Helpers ---
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
      return "bg-green-100 text-green-700";
    case "pengumuman":
      return "bg-amber-100 text-amber-700";
    case "kegiatan":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCategoryIconName = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "info";
    case "pengumuman":
      return "megaphone";
    case "kegiatan":
      return "calendarDays";
    default:
      return "info";
  }
};

const getThumbnailGradient = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "from-green-600 to-green-800";
    case "pengumuman":
      return "from-amber-500 to-amber-700";
    case "kegiatan":
      return "from-rose-500 to-rose-700";
    default:
      return "from-green-600 to-green-800";
  }
};

// --- Animation Variants ---
const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const tabsVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// --- Static Sub-components (avoid react-hooks/static-components lint issue) ---
function CategoryIconDisplay({ category }: { category: string }) {
  const iconName = getCategoryIconName(category);
  return (
    <div className="h-12 w-12 text-white/20">
      {iconName === "info" && <Info className="h-12 w-12" />}
      {iconName === "megaphone" && <Megaphone className="h-12 w-12" />}
      {iconName === "calendarDays" && <CalendarDays className="h-12 w-12" />}
    </div>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="h-full overflow-hidden border-gray-200"
        >
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-4" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Main Component ---
export function NewsSection() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredNews =
    activeCategory === "Semua"
      ? news
      : news.filter((item) => item.category === activeCategory);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Berita Terbaru
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Informasi &amp; Kegiatan
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Dapatkan informasi terbaru seputar layanan kependudukan dan
              kegiatan Disdukcapil Kabupaten Ngada.
            </p>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Link href="/berita">
              <Button
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50"
              >
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        {loading ? (
          <motion.div
            variants={tabsVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-2 mb-8"
          >
            {categories.map(() => (
              <Skeleton key={Math.random()} className="h-9 w-24 rounded-full" />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={tabsVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-green-700 text-white shadow-md shadow-green-700/25"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* News Grid */}
        {loading ? (
          <NewsLoadingSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNews.map((item, index) => (
              <motion.div key={item.id} variants={cardVariants} custom={index}>
                <Link
                  href={`/berita/${item.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Thumbnail */}
                    <div
                      className={`aspect-video bg-gradient-to-br ${getThumbnailGradient(item.category)} relative overflow-hidden`}
                    >
                      {/* Category icon placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CategoryIconDisplay category={item.category} />
                      </div>

                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Category badge */}
                      <Badge
                        className={`absolute top-3 left-3 ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>

                      {/* Date badge overlapping bottom-right */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {item.excerpt}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {item.views} dilihat
                        </span>
                      </div>

                      {/* Baca Selengkapnya link */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-green-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          Baca Selengkapnya
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
