"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, MapPin, Calendar, ArrowRight, ImagePlus, Maximize2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types ---
interface GalleryItem {
  id: string;
  title: string;
  location: string;
  date: string;
  category: string;
  gradient: string;
}

// --- Data ---
const galleryItems: GalleryItem[] = [
  {
    id: "gi-1",
    title: "Peluncuran Layanan KTP-el Digital",
    location: "Aula Disdukcapil, Bajawa",
    date: "2024-12-15",
    category: "Inovasi Layanan",
    gradient: "from-green-600 to-emerald-700",
  },
  {
    id: "gi-2",
    title: "Sosialisasi Kartu Keluarga Digital di Kecamatan Bajawa",
    location: "Kecamatan Bajawa",
    date: "2024-11-28",
    category: "Sosialisasi",
    gradient: "from-teal-600 to-teal-800",
  },
  {
    id: "gi-3",
    title: "Pendampingan Perekaman KTP-el Keliling",
    location: "Kecamatan Aimere",
    date: "2024-11-10",
    category: "Pelayanan Keliling",
    gradient: "from-amber-500 to-amber-700",
  },
  {
    id: "gi-4",
    title: "Workshop Inovasi Pelayanan Publik",
    location: "Hotel Sapphire, Bajawa",
    date: "2024-10-22",
    category: "Workshop",
    gradient: "from-rose-500 to-rose-700",
  },
  {
    id: "gi-5",
    title: "Jemput Bola Penerbitan Akta Lahir",
    location: "Kecamatan Golewa",
    date: "2024-10-05",
    category: "Pelayanan Keliling",
    gradient: "from-green-700 to-teal-700",
  },
  {
    id: "gi-6",
    title: "Penandatanganan MoU dengan Desa Adat",
    location: "Kantor Desa Bena",
    date: "2024-09-18",
    category: "Kerjasama",
    gradient: "from-teal-700 to-emerald-800",
  },
];

const categories = ["Semua", ...new Set(galleryItems.map((item) => item.category))];

// --- Helpers ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// --- Animation Variants ---
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const floatOrb = {
  hidden: { opacity: 0 },
  animate: (i: number) => ({
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.2, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i,
    },
  }),
};

// --- Skeleton ---
function GalleryLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-36" />
        </div>
      ))}
    </div>
  );
}

// --- Gallery Card ---
function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <motion.div variants={cardVariants} className="group">
      <Link href="/inovasi" className="block">
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-500/15 dark:hover:shadow-green-400/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
          {/* Gradient border glow on hover */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-green-500/0 via-teal-500/0 to-green-500/0 group-hover:from-green-500/60 group-hover:via-teal-500/60 group-hover:to-green-500/60 rounded-xl transition-all duration-500 -z-10 blur-sm" />

          {/* Image placeholder with gradient */}
          <div
            className={`aspect-[4/3] bg-gradient-to-br ${item.gradient} relative`}
          >
            {/* Camera icon placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Camera className="h-8 w-8 text-white/60" />
              </div>
            </div>

            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='white'/%3E%3C/svg%3E\")",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Hover overlay with darkening */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center">
              {/* Expand icon indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Maximize2 className="h-4 w-4 text-white" />
                </div>
              </div>
              {/* Lihat Detail button with slide-up */}
              <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-center px-4">
                <p className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {item.title}
                </p>
                <span className="inline-flex items-center gap-1.5 text-white text-sm bg-gradient-to-r from-green-600/80 to-teal-600/80 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 shadow-lg">
                  Lihat Detail
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Location badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/10">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1 max-w-[150px]">{item.location}</span>
            </div>
          </div>

          {/* Card info */}
          <div className="p-4 bg-white dark:bg-gray-900 border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-xl group-hover:bg-green-50/50 dark:group-hover:bg-green-900/10 transition-colors duration-300">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/40 dark:to-teal-900/40 text-green-700 dark:text-green-300 border-green-200/80 dark:border-green-800/50 text-xs mb-2"
            >
              {item.category}
            </Badge>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-1.5 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
              {item.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(item.date)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// --- Main Component ---
export function GaleriInovasiSection() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = activeCategory === "Semua"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      {/* ── Gradient Hero Banner ── */}
      <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
        {/* SVG Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0L26 14L14 26L2 14Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Animated gradient orbs */}
        <motion.div
          custom={0}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute top-2 left-1/4 w-44 h-44 bg-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          custom={1.5}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute bottom-0 right-1/4 w-52 h-52 bg-teal-400/15 rounded-full blur-3xl"
        />
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Galeri Inovasi
              </h1>
              <p className="text-green-200/80 text-sm mt-0.5">
                Dokumentasi kegiatan inovasi dan pelayanan kami
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none top-[120px]" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='18' y='18' fill='%2316a34a' rx='1'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-100/30 dark:bg-green-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-100/30 dark:bg-teal-900/20 rounded-full blur-3xl" />
      </div>

      {/* Floating decorative shapes */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-48 right-12 w-5 h-5 border-2 border-green-400/15 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-48 left-20 w-4 h-4 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-sm hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-72 left-1/4 w-3 h-3 bg-green-400/15 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-60 right-1/3 w-6 h-6 border border-teal-400/10 rounded-md hidden lg:block"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 animated-underline inline-block">
            Dokumentasi Kegiatan Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Momen-momen penting dari berbagai kegiatan inovasi dan pelayanan
            Disdukcapil Kabupaten Ngada
          </p>
        </motion.div>

        {/* Category Filter Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white border-green-500/50 shadow-md shadow-green-500/20"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:text-green-700 dark:hover:text-green-400"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <GalleryLoadingSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView && !loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" as const }}
          className="text-center mt-10"
        >
          <Link href="/inovasi">
            <Button
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 dark:border-green-600 dark:text-green-400 hover:shadow-md hover:shadow-green-500/10 transition-all duration-300"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Lihat Semua Foto
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
