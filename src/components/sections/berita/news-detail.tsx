"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Eye, ArrowLeft, Share2, Facebook, Twitter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function NewsDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/berita/${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setNews(result.data);
        } else {
          setError(result.error || "Berita tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Gagal memuat berita");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchNews();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
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

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
        <div className="container mx-auto px-4">
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

          <Badge className={`mb-4 ${getCategoryColor(news.category)}`}>
            {news.category}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold max-w-4xl">
            {news.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-green-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(news.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {news.viewCount} dilihat
            </span>
            {news.author && <span>Oleh: {news.author}</span>}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200">
                <CardContent className="p-6 md:p-8">
                  <div
                    className="prose prose-green max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />

                  {/* Share Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">Bagikan:</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button variant="outline" size="sm">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Salin Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
