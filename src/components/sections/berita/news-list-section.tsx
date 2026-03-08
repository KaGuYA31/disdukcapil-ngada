"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calendar, Eye, ArrowRight, Loader2 } from "lucide-react";
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
      return "bg-blue-100 text-blue-700";
    case "pengumuman":
      return "bg-yellow-100 text-yellow-700";
    case "kegiatan":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function NewsListSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchNews = async () => {
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
    };

    fetchNews();
  }, [selectedCategory, searchQuery]);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-10">
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
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/berita/${item.slug}`} className="group">
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
              ))}
            </div>

            {news.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada berita yang sesuai dengan pencarian Anda.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
