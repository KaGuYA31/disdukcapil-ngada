"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Link2 as LinkIcon,
  Images,
  CheckCircle2,
  List,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { BeritaSidebarWidgets } from "@/components/sections/berita/berita-sidebar-widgets";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  slug: string;
  author: string | null;
  thumbnail: string | null;
  photos: string | null;
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

interface TOCItem {
  id: string;
  text: string;
  level: "h2" | "h3";
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
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    case "pengumuman":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "kegiatan":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
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

// Extract headings from HTML content for TOC
function extractTOC(content: string): TOCItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const headings = doc.querySelectorAll("h2, h3");
  const items: TOCItem[] = [];
  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim();
    if (text) {
      const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`;
      items.push({
        id,
        text,
        level: heading.tagName.toLowerCase() as "h2" | "h3",
      });
    }
  });
  return items;
}

// Inject IDs into heading elements in HTML content
function injectHeadingIds(content: string, tocItems: TOCItem[]): string {
  let modified = content;
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const headings = doc.querySelectorAll("h2, h3");

  headings.forEach((heading, index) => {
    if (tocItems[index]) {
      heading.id = tocItems[index].id;
    }
  });

  return doc.body.innerHTML;
}

export function NewsDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const abortControllerRef = useRef<AbortController | null>(null);
  const articleContentRef = useRef<HTMLDivElement>(null);

  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const tocItems = useMemo(() => {
    if (!news?.content) return [];
    return extractTOC(news.content);
  }, [news?.content]);

  const processedContent = useMemo(() => {
    if (!news?.content || tocItems.length === 0) return news?.content || "";
    return injectHeadingIds(news.content, tocItems);
  }, [news?.content, tocItems]);

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

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current) return;

      const article = articleContentRef.current;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrolled = window.scrollY - articleTop + windowHeight * 0.3;
      const progress = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [news]);

  // Active heading tracking for TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveHeading(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    // Small delay to let the DOM settle after content injection
    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [tocItems]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "Tautan disalin!",
      description: "Link berhasil disalin ke clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Parse additional photos
  let additionalPhotos: string[] = [];
  try {
    additionalPhotos = news.photos ? JSON.parse(news.photos) : [];
  } catch {
    additionalPhotos = [];
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress-bar no-print"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress membaca artikel"
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-12 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-5 right-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-[20%] w-3 h-3 bg-green-400/25 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-8 left-[15%] w-2 h-2 bg-teal-300/25 rounded-full hidden lg:block"
        />

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
                    <BreadcrumbPage className="text-white line-clamp-1 max-w-[200px] sm:max-w-none">{news.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${getCategoryColor(news.category)} border px-3 py-1 text-sm font-semibold`}>
                {news.category}
              </Badge>
              <Badge className="bg-white/15 backdrop-blur-sm text-green-100 border border-white/20 px-3 py-1 text-sm">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {readingTime} baca
              </Badge>
              <Badge className="bg-white/15 backdrop-blur-sm text-green-100 border border-white/20 px-3 py-1 text-sm">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {news.viewCount} dilihat
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-bold max-w-4xl leading-tight"
            >
              {news.title}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 mt-5 text-green-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <User className="h-4 w-4 text-green-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {news.author || "Redaksi Disdukcapil Ngada"}
                  </p>
                  <p className="text-xs text-green-200/80 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatFullDate(news.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40V15C360 35 720 0 1080 20C1260 30 1380 10 1440 15V40H0Z" className="fill-gray-50 dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-4 gap-8"
          >
            {/* Article Content */}
            <motion.div variants={fadeInUp} className="lg:col-span-3 xl:col-span-3">
              <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <CardContent className="p-6 md:p-10">
                  {/* Author Info Card */}
                  <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-full flex items-center justify-center border-2 border-green-200 dark:border-green-800">
                      <User className="h-5 w-5 text-green-700 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {news.author || "Redaksi Disdukcapil Ngada"}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Dipublikasikan {formatFullDate(news.createdAt)}
                      </p>
                    </div>
                    {/* Share Buttons (compact, in author bar) */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleWhatsAppShare}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Bagikan via WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyLink}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Salin tautan"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </motion.div>
                          ) : (
                            <motion.div key="link" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <LinkIcon className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>

                  {/* Article Body with enhanced typography */}
                  <div
                    ref={articleContentRef}
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />

                  {/* Social Share Bar */}
                  <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Share2 className="h-4 w-4" />
                        Bagikan artikel:
                      </span>
                      <div className="flex items-center gap-2">
                        {/* WhatsApp */}
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' - ' + (news.excerpt || '') + ' ' + window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp
                        </motion.a>
                        {/* Facebook */}
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          Facebook
                        </motion.a>
                        {/* Twitter/X */}
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          X
                        </motion.a>
                        {/* Copy Link */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyLink}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                Tersalin!
                              </motion.span>
                            ) : (
                              <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                                <LinkIcon className="w-4 h-4" />
                                Salin Tautan
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Gallery */}
                  {additionalPhotos.length > 0 && (
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={staggerContainer}
                      className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
                        <Images className="h-5 w-5 text-green-700 dark:text-green-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Foto Galeri</h3>
                      </motion.div>
                      <motion.div
                        variants={fadeInUp}
                        className="grid grid-cols-2 md:grid-cols-3 gap-3"
                      >
                        {additionalPhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 group"
                          >
                            <img
                              src={photo}
                              alt={`${news.title} - Foto ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Sidebar: TOC + Widgets */}
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="hidden lg:block space-y-5"
            >
              {/* Table of Contents */}
              {tocItems.length > 0 && (
                <motion.div variants={fadeInUp}>
                  <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 px-4 py-3">
                      <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Daftar Isi
                      </CardTitle>
                    </div>
                    <CardContent className="p-2">
                      <nav aria-label="Daftar isi artikel">
                        {tocItems.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`toc-item ${item.level === "h3" ? "toc-h3" : ""} ${activeHeading === item.id ? "toc-active" : ""}`}
                          >
                            {item.text}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.aside>

            {/* Mobile/Tablet Sidebar Widgets */}
            <div className="lg:hidden">
              <BeritaSidebarWidgets />
            </div>
          </motion.div>

          {/* Desktop Sidebar Widgets (placed below on smaller screens via CSS grid) */}
          <div className="hidden lg:block">
            {/* BeritaSidebarWidgets is already included in the sidebar for desktop via the main layout */}
          </div>

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
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center border border-green-200 dark:border-green-800">
                  <Newspaper className="h-5 w-5 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Berita Terkait
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Artikel lain yang mungkin menarik</p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <motion.div key={item.id} variants={fadeInUp}>
                    <Link href={`/berita/${item.slug}`}>
                      <Card className="h-full border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden bg-white dark:bg-gray-900">
                        {/* Thumbnail or placeholder */}
                        {item.thumbnail ? (
                          <div className="h-44 overflow-hidden relative">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="h-36 bg-gradient-to-br from-green-100 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 flex items-center justify-center">
                            <Newspaper className="h-8 w-8 text-green-300 dark:text-green-700" />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <Badge
                            className={`mb-2.5 text-xs ${getCategoryColor(item.category)} border`}
                          >
                            {item.category}
                          </Badge>
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
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
                    className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-800 dark:hover:text-green-300 gap-2"
                  >
                    Lihat Semua Berita
                    <ArrowRight className="h-4 w-4" />
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
