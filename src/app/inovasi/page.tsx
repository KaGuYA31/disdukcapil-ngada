"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface InovasiActivity {
  id: string;
  title: string;
  description: string;
  category?: string;
  photo?: string | null;
  location?: string | null;
  date?: string | null;
}

// Framer-motion animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function InovasiLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Skeleton className="h-10 w-80 mb-4 bg-green-600/40" />
              <Skeleton className="h-6 w-full max-w-xl bg-green-600/30" />
              <Skeleton className="h-5 w-96 mt-2 bg-green-600/20" />
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48 rounded-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

export default function InovasiPage() {
  const [activities, setActivities] = useState<InovasiActivity[]>([]);
  const [allActivities, setAllActivities] = useState<InovasiActivity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const response = await fetch("/api/inovasi?limit=100");
        if (!response.ok) {
          throw new Error("Gagal memuat data kegiatan");
        }
        const data = await response.json();
        const items = data.data || [];
        const cats = data.categories || [];
        setAllActivities(items);
        setActivities(items);
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Filter activities by category
  useEffect(() => {
    if (activeCategory === "Semua") {
      setActivities(allActivities);
    } else {
      setActivities(allActivities.filter((a) => a.category === activeCategory));
    }
  }, [activeCategory, allActivities]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <InovasiLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Inovasi" }]} />
                </motion.div>

                {/* Section Label */}
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-2 mb-3"
                >
                  <Lightbulb className="h-4 w-4 text-green-200" />
                  <span className="text-xs font-semibold tracking-wider text-green-200 uppercase">
                    Kegiatan Inovasi
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold mb-3"
                >
                  Kegiatan Inovasi Jemput Bola
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-green-100 text-lg"
                >
                  Daftar kegiatan inovasi pelayanan dari Disdukcapil
                  Kabupaten Ngada. Kami mendatangi masyarakat untuk memberikan
                  pelayanan administrasi kependudukan yang lebih dekat dan mudah
                  dijangkau.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto shadow-sm">
                <Loader2 className="w-10 h-10 text-red-400 mx-auto mb-3 animate-spin" />
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-green-700 hover:bg-green-800"
                >
                  Coba Lagi
                </Button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && activities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-md mx-auto shadow-sm">
                <Lightbulb className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Belum Ada Kegiatan
                </h3>
                <p className="text-green-600">
                  Saat ini belum ada kegiatan inovasi yang tersedia. Silakan
                  kembali lagi nanti.
                </p>
              </div>
            </motion.div>
          )}

          {/* Activities Grid */}
          {!loading && !error && allActivities.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {/* Section Header */}
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Daftar Kegiatan
                </h2>
                <p className="text-gray-500 mt-1">
                  Menampilkan {activities.length} kegiatan inovasi
                </p>
              </motion.div>

              {/* Category Filter Buttons */}
              {categories.length > 1 && (
                <motion.div
                  variants={fadeInUp}
                  className="mb-8 flex flex-wrap gap-2"
                >
                  <Button
                    variant={activeCategory === "Semua" ? "default" : "outline"}
                    size="sm"
                    className={
                      activeCategory === "Semua"
                        ? "bg-green-700 hover:bg-green-800 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                    }
                    onClick={() => setActiveCategory("Semua")}
                  >
                    Semua
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${activeCategory === "Semua" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {allActivities.length}
                    </Badge>
                  </Button>
                  {categories.map((cat) => {
                    const count = allActivities.filter(
                      (a) => a.category === cat
                    ).length;
                    return (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        className={
                          activeCategory === cat
                            ? "bg-green-700 hover:bg-green-800 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        }
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                        <Badge
                          variant="secondary"
                          className={`ml-2 ${activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </motion.div>
              )}

              {/* Filtered empty state */}
              {activities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                    <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Tidak ada kegiatan untuk kategori &quot;{activeCategory}&quot;.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-green-600 text-green-700 hover:bg-green-50"
                      onClick={() => setActiveCategory("Semua")}
                    >
                      Lihat Semua Kegiatan
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Card Grid */}
              {activities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <motion.div key={activity.id} variants={cardVariant}>
                      <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                        {/* Activity Photo */}
                        <div className="relative w-full h-48 bg-gray-100">
                          {activity.photo ? (
                            <Image
                              src={activity.photo}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                              <Lightbulb className="w-14 h-14 text-green-300" />
                            </div>
                          )}
                          {/* Category badge on image */}
                          {activity.category && categories.length > 1 && (
                            <Badge className="absolute top-3 right-3 bg-green-700/90 text-white text-xs">
                              {activity.category}
                            </Badge>
                          )}
                        </div>

                        <CardHeader className="pb-3">
                          <CardTitle className="text-green-800 line-clamp-2 leading-snug">
                            {activity.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-sm">
                            {truncateText(activity.description, 120)}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow pt-0">
                          <div className="flex items-start gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">
                              {activity.location || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="text-sm">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className="w-full bg-green-700 hover:bg-green-800 text-white gap-2 transition-colors"
                            asChild
                          >
                            <Link href={`/inovasi/${activity.id}`}>
                              Baca Selengkapnya
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
