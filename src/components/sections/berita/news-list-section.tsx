"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Calendar, Eye, Loader2, X, FileX, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  category: string;
  createdAt: string;
  viewCount: number;
  thumbnail: string | null;
  content?: string;
}

const categories = ["Semua", "Informasi", "Pengumuman", "Kegiatan"];

const ITEMS_PER_PAGE = 6;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const estimateReadingTime = (content: string | null | undefined, excerpt: string | null): string => {
  // Estimate ~200 words per minute for Indonesian text
  const text = content || excerpt || "";
  // Count words: split by whitespace and filter empty strings
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 60) return "< 1 menit";
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} menit`;
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "informasi":
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300";
    case "pengumuman":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "kegiatan":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const featuredVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function NewsListSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [error, setError] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Sync URL search param to local state
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const fetchNews = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      setIsLoading(true);
      setError(false);
      // Fetch all news (high limit) for client-side pagination
      const params = new URLSearchParams();
      params.append("limit", "100");

      const response = await fetch(`/api/berita?${params.toString()}`, { signal: controller.signal });
      const result = await response.json();
      if (result.success) {
        setAllNews(result.data || []);
        setNews(result.data || []);
      } else {
        setError(true);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.error('Berita fetch timed out');
      }
      setError(true);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter news based on category and search
  const filteredNews = allNews.filter((item) => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = filteredNews.length > 0 ? filteredNews[0] : null;
  const restNews = filteredNews.slice(1);
  const visibleNews = restNews.slice(0, visibleCount - (featured ? 1 : 0));
  const hasMore = restNews.length > visibleNews.length;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    router.push("/berita");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {/* Featured skeleton */}
          <div className="mb-10">
            <div className="grid md:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden animate-pulse">
              <div className="aspect-video md:aspect-auto bg-gray-200 dark:bg-gray-700" />
              <div className="p-6 space-y-4">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
          {/* Grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Error State */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileX className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Gagal Memuat Berita
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Tidak dapat memuat berita saat ini. Periksa koneksi internet Anda.
            </p>
            <Button onClick={fetchNews} className="bg-green-700 hover:bg-green-800 text-white gap-2">
              Coba Lagi
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Search Results Message */}
            {urlQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="max-w-4xl mx-auto mb-6"
              >
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Search className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-green-800 dark:text-green-300 text-sm md:text-base">
                    Hasil pencarian untuk:{" "}
                    <span className="font-semibold">&ldquo;{urlQuery}&rdquo;</span>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="ml-auto text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/30 shrink-0"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Hapus Pencarian</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
              className="max-w-4xl mx-auto mb-10"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Cari berita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <motion.div key={category} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className={`relative overflow-hidden transition-all duration-300 ${
                            isActive
                              ? "bg-green-700 hover:bg-green-800 text-white shadow-md shadow-green-700/25"
                              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeCategory"
                              className="absolute inset-0 bg-green-700"
                              style={{ zIndex: 0 }}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{category}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Empty State */}
            {filteredNews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
                >
                  <FileX className="h-10 w-10 text-green-400 dark:text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {searchQuery ? "Tidak Ada Hasil Pencarian" : "Belum Ada Berita"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {searchQuery
                    ? `Tidak ada berita yang sesuai dengan pencarian "${searchQuery}". Coba gunakan kata kunci yang lebih umum atau periksa ejaan Anda.`
                    : selectedCategory !== "Semua"
                    ? `Belum ada berita dalam kategori "${selectedCategory}". Coba pilih kategori lain atau lihat semua berita.`
                    : "Belum ada berita yang dipublikasikan. Silakan kunjungi kembali nanti."}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {(searchQuery || selectedCategory !== "Semua") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("Semua");
                        if (urlQuery) router.push("/berita");
                      }}
                      className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Lihat Semua Berita
                    </Button>
                  )}
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      onClick={handleClearSearch}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hapus Pencarian
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Featured Article */}
                {featured && (
                  <motion.div variants={featuredVariants} initial="hidden" animate="visible" className="mb-12">
                    <Link href={`/berita/${featured.slug}`} className="group block">
                      <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 group-hover:-translate-y-0.5 relative">
                        {/* Featured ribbon */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-green-500" />
                        <div className="grid md:grid-cols-2 gap-0">
                          {/* Featured Thumbnail */}
                          <div className="aspect-video md:aspect-auto bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden min-h-[280px]">
                            {featured.thumbnail ? (
                              <img
                                src={featured.thumbnail}
                                alt={featured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-8xl font-bold">
                                D
                              </div>
                            )}
                            {/* Dark gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                            {/* Baca overlay on hover */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-xl">
                                <BookOpen className="h-4 w-4" />
                                Baca Selengkapnya
                              </span>
                            </div>
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                              <Badge className={`${getCategoryColor(featured.category)} text-xs border backdrop-blur-sm`}>
                                {featured.category}
                              </Badge>
                              <Badge className="bg-green-600 text-white text-xs border-0 shadow-sm">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Terbaru
                              </Badge>
                            </div>
                          </div>

                          {/* Featured Content */}
                          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(featured.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {estimateReadingTime(featured.content, featured.excerpt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                {featured.viewCount} dilihat
                              </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors mb-3 line-clamp-2">
                              {featured.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
                              {featured.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium text-sm group-hover:gap-3 transition-all">
                              <BookOpen className="h-4 w-4" />
                              Baca selengkapnya
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )}

                {/* News Grid */}
                {visibleNews.length > 0 && (
                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                      },
                    }}
                  >
                    {visibleNews.map((item) => (
                      <motion.div key={item.id} variants={cardVariants}>
                        <Link href={`/berita/${item.slug}`} className="group block">
                          <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-bold">
                                  D
                                </div>
                              )}
                              {/* Dark gradient overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              {/* Baca overlay text */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg shadow-lg">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  Baca
                                </span>
                              </motion.div>
                              <Badge
                                className={`absolute top-3 left-3 ${getCategoryColor(item.category)} border backdrop-blur-sm bg-opacity-90`}
                              >
                                {item.category}
                              </Badge>
                            </div>

                            <CardContent className="p-5">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2 mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                {item.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(item.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    {item.viewCount}
                                  </span>
                                </div>
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <BookOpen className="h-3 w-3" />
                                  {estimateReadingTime(item.content, item.excerpt)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Load More Button */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-10 text-center"
                  >
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 gap-2 px-8"
                      size="lg"
                    >
                      Muat Lebih Banyak
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Menampilkan {Math.min(visibleCount, filteredNews.length)} dari {filteredNews.length} berita
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
