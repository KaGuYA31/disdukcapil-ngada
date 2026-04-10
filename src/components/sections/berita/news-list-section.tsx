"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Calendar, Eye, Loader2, X, FileX } from "lucide-react";
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
}

const categories = ["Semua", "Informasi", "Pengumuman", "Kegiatan"];

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
      return "bg-teal-100 text-teal-700";
    case "pengumuman":
      return "bg-amber-100 text-amber-700";
    case "kegiatan":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function NewsListSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Sync URL search param to local state
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "Semua") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("q", searchQuery);
      }

      const response = await fetch(`/api/berita?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setNews(result.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleClearSearch = () => {
    setSearchQuery("");
    router.push("/berita");
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search Results Message */}
        {urlQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Search className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-green-800 text-sm md:text-base">
                Hasil pencarian untuk:{" "}
                <span className="font-semibold">&ldquo;{urlQuery}&rdquo;</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="ml-auto text-green-700 hover:text-green-900 hover:bg-green-100 shrink-0"
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
              {categories.slice(0, 4).map((category) => (
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
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {/* News Grid */}
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
              {news.map((item) => (
                <motion.div key={item.id} variants={cardVariants}>
                  <Link href={`/berita/${item.slug}`} className="group block">
                    <Card className="h-full card-hover overflow-hidden border-gray-200">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-bold">
                            D
                          </div>
                        )}
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
                            {formatDate(item.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {item.viewCount} dilihat
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {news.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="text-center py-16"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileX className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Berita Tidak Ditemukan
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery
                    ? `Tidak ada berita yang sesuai dengan pencarian "${searchQuery}". Coba gunakan kata kunci lain.`
                    : "Tidak ada berita dalam kategori ini."}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={handleClearSearch}
                    className="mt-4 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hapus Pencarian
                  </Button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
