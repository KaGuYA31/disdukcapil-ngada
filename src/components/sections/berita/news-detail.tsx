"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Loader2,
  Clock,
  User,
  MessageCircle,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  slug: string;
  author: string | null;
  viewCount: number;
  createdAt: string;
}

interface RelatedNewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  slug: string;
  createdAt: string;
  thumbnail: string | null;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getReadingTime = (content: string): string => {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} menit`;
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "bg-teal-100 text-teal-700";
    case "pengumuman":
      return "bg-yellow-100 text-yellow-700";
    case "kegiatan":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "teal";
    case "pengumuman":
      return "amber";
    case "kegiatan":
      return "green";
    default:
      return "gray";
  }
};

export function NewsDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const abortControllerRef = useRef<AbortController | null>(null);

  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    if (!slug) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/berita/${slug}`, {
        signal: controller.signal,
      });
      const result = await response.json();

      if (result.success) {
        setNews(result.data);
        // Fetch related news
        fetchRelatedNews(result.data.category, result.data.id, controller.signal);
      } else {
        setError(result.error || "Berita tidak ditemukan");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Error fetching news:", err);
      setError("Gagal memuat berita");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const fetchRelatedNews = useCallback(async (
    category: string,
    currentId: string,
    signal?: AbortSignal,
  ) => {
    try {
      const response = await fetch(
        `/api/berita?category=${encodeURIComponent(category)}&limit=4`,
        { signal },
      );
      const result = await response.json();
      if (result.success && result.data) {
        // Filter out current article and take 3
        const filtered = result.data
          .filter((item: NewsItem) => item.id !== currentId)
          .slice(0, 3);
        setRelatedNews(filtered);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Error fetching related news:", err);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNews]);

  const handleWhatsAppShare = () => {
    if (!news) return;
    const url = `${SITE_CONFIG.url}/berita/${news.slug}`;
    const text = `${news.title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (isLoading) {
    return (
      <>
        {/* Hero Loading Skeleton */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="h-4 w-48 bg-white/20 rounded mb-6 animate-pulse" />
            <div className="h-6 w-24 bg-white/20 rounded mb-4 animate-pulse" />
            <div className="h-8 w-96 bg-white/20 rounded mb-4 animate-pulse" />
            <div className="h-5 w-64 bg-white/15 rounded animate-pulse" />
          </div>
        </section>
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 md:p-8 animate-pulse space-y-4">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Berita Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "Berita yang Anda cari tidak tersedia."}
        </p>
        <Link href="/berita">
          <Button className="bg-green-700 hover:bg-green-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Berita
          </Button>
        </Link>
      </div>
    );
  }

  const readingTime = getReadingTime(news.content);
  const categoryColor = getCategoryIcon(news.category);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-green-700 to-green-900 text-white py-12 overflow-hidden">
        {/* Decorative Gradient Orbs */}
        <div className="absolute top-5 right-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-green-200 hover:text-white">
                      Beranda
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-green-300" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/berita" className="text-green-200 hover:text-white">
                      Berita
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-green-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">{news.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Badge className={`mb-4 ${getCategoryColor(news.category)}`}>
                {news.category}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold max-w-4xl"
            >
              {news.title}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 mt-4 text-green-100"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(news.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {news.viewCount} dilihat
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Article Content */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <Card className="border-gray-200">
                <CardContent className="p-6 md:p-8">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {news.author || "Redaksi Disdukcapil Ngada"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Dipublikasikan {formatFullDate(news.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div
                    className="prose prose-green max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />

                  {/* Share Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <p className="font-medium text-gray-900">Bagikan:</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleWhatsAppShare}
                          className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `${SITE_CONFIG.url}/berita/${news.slug}`;
                            navigator.clipboard.writeText(url);
                          }}
                          className="text-gray-600 hover:bg-gray-50"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Salin Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* CTA */}
              <Card className="bg-green-700 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Ada Pertanyaan?</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Hubungi kami untuk informasi lebih lanjut
                  </p>
                  <Link href="/pengaduan">
                    <Button className="w-full bg-white text-green-700 hover:bg-green-50">
                      Hubungi Kami
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Berita Terkait */}
          {relatedNews.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="mt-16"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                <Newspaper className="h-6 w-6 text-green-700" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Berita Terkait
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <motion.div key={item.id} variants={fadeInUp}>
                    <Link href={`/berita/${item.slug}`}>
                      <Card className="h-full border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                        {/* Thumbnail or placeholder */}
                        {item.thumbnail ? (
                          <div className="h-40 overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-32 bg-gradient-to-br from-green-100 to-teal-50 flex items-center justify-center">
                            <Newspaper className="h-8 w-8 text-green-300" />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <Badge
                            className={`mb-2 text-xs ${getCategoryColor(item.category)}`}
                          >
                            {item.category}
                          </Badge>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="mt-8 text-center">
                <Link href="/berita">
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                  >
                    Lihat Semua Berita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.section>
          )}
        </div>
      </section>
    </>
  );
}
