"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  Building2,
  FileText,
  Globe,
  BarChart3,
  Newspaper,
  Lightbulb,
  MessageSquareWarning,
  Shield,
  FileCheck,
  Sparkles,
  Loader2,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Static search data ────────────────────────────────────────────────

interface StaticPage {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: "Halaman" | "Layanan" | "Berita";
}

const staticPages: StaticPage[] = [
  {
    id: "beranda",
    title: "Beranda",
    description: "Halaman utama portal Disdukcapil Ngada",
    href: "/",
    icon: Home,
    category: "Halaman",
  },
  {
    id: "profil",
    title: "Profil",
    description: "Visi, misi, struktur organisasi, dan sejarah",
    href: "/profil",
    icon: Building2,
    category: "Halaman",
  },
  {
    id: "layanan",
    title: "Layanan",
    description: "Daftar layanan kependudukan dan pencatatan sipil",
    href: "/layanan",
    icon: FileText,
    category: "Layanan",
  },
  {
    id: "layanan-online",
    title: "Layanan Online",
    description: "Ajukan layanan secara daring dari rumah",
    href: "/layanan-online",
    icon: Globe,
    category: "Layanan",
  },
  {
    id: "data-kependudukan",
    title: "Data Kependudukan",
    description: "Data kependudukan Kabupaten Ngada",
    href: "/statistik",
    icon: BarChart3,
    category: "Halaman",
  },
  {
    id: "berita",
    title: "Berita",
    description: "Informasi dan berita terkini Disdukcapil",
    href: "/berita",
    icon: Newspaper,
    category: "Berita",
  },
  {
    id: "inovasi",
    title: "Inovasi",
    description: "Program inovasi dan modernisasi layanan",
    href: "/inovasi",
    icon: Lightbulb,
    category: "Halaman",
  },
  {
    id: "pengaduan",
    title: "Pengaduan",
    description: "Sampaikan keluhan atau saran Anda",
    href: "/pengaduan",
    icon: MessageSquareWarning,
    category: "Layanan",
  },
  {
    id: "transparansi",
    title: "Transparansi",
    description: "Informasi keterbukaan dan transparansi publik",
    href: "/transparansi",
    icon: Shield,
    category: "Halaman",
  },
  {
    id: "cek-nik",
    title: "Cek Status NIK",
    description: "Periksa status pembuatan KTP Elektronik Anda",
    href: "/cek-nik",
    icon: FileCheck,
    category: "Layanan",
  },
];

// ─── Berita API result type ────────────────────────────────────────────

interface BeritaResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
}

// ─── Animation variants ────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.15 },
  },
};

// ─── Category icons ────────────────────────────────────────────────────

const categoryIcons: Record<string, React.ElementType> = {
  Halaman: Home,
  Layanan: FileText,
  Berita: Newspaper,
};

// ─── Main component ────────────────────────────────────────────────────

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [beritaResults, setBeritaResults] = useState<BeritaResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();

  // Portal mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Open / Close handlers ──

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(-1);
    setBeritaResults([]);
    // Focus input after render
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
    setBeritaResults([]);
    setIsSearching(false);
  }, []);

  // ── Keyboard shortcut: Cmd+K / Ctrl+K ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette, closePalette]);

  // ── Custom event listener ──
  useEffect(() => {
    const handleOpenEvent = () => openPalette();
    window.addEventListener("open-search-command", handleOpenEvent);
    return () => window.removeEventListener("open-search-command", handleOpenEvent);
  }, [openPalette]);

  // ── Lock body scroll when open ──
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Fetch berita with debounce ──
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 2) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/berita?q=${encodeURIComponent(query)}&limit=5`);
          const json = await res.json();
          if (json.success) {
            setBeritaResults(json.data.slice(0, 5));
          }
        } catch {
          setBeritaResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setBeritaResults([]);
      setIsSearching(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // ── Filter static pages ──
  const filteredStaticPages = query.length >= 1
    ? staticPages.filter(
        (page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description.toLowerCase().includes(query.toLowerCase())
      )
    : staticPages;

  // ── Group static pages by category ──
  const groupedPages: Record<string, StaticPage[]> = {};
  for (const page of filteredStaticPages) {
    if (!groupedPages[page.category]) {
      groupedPages[page.category] = [];
    }
    groupedPages[page.category].push(page);
  }

  // ── Flatten all visible items for keyboard navigation ──
  interface FlatItem {
    type: "static" | "berita";
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    category: string;
  }

  const flatItems: FlatItem[] = [];
  for (const [category, pages] of Object.entries(groupedPages)) {
    for (const page of pages.slice(0, 5)) {
      flatItems.push({
        type: "static",
        id: page.id,
        title: page.title,
        description: page.description,
        href: page.href,
        icon: page.icon,
        category,
      });
    }
  }
  // Add berita results
  for (const berita of beritaResults) {
    flatItems.push({
      type: "berita",
      id: berita.slug,
      title: berita.title,
      description: berita.excerpt || "Berita Disdukcapil Ngada",
      href: `/berita/${berita.slug}`,
      icon: Sparkles,
      category: "Berita",
    });
  }

  // ── Keyboard navigation within the palette ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flatItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : flatItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < flatItems.length) {
          router.push(flatItems[activeIndex].href);
          closePalette();
        }
        break;
      case "Escape":
        e.preventDefault();
        closePalette();
        break;
    }
  };

  // ── Scroll active item into view ──
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-result-item]");
      const activeItem = items[activeIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // ── Click outside to close ──
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePalette();
    }
  };

  // ── Navigate on click ──
  const handleItemClick = (href: string) => {
    router.push(href);
    closePalette();
  };

  // ── Don't render on server ──
  if (!isMounted) return null;

  const totalResults = flatItems.length;
  const hasQuery = query.length >= 1;
  const showNoResults = hasQuery && totalResults === 0 && !isSearching;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

          {/* Dialog container */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
          >
            {/* Search input area */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base outline-none"
                placeholder="Cari halaman, layanan, atau berita..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                aria-label="Kata kunci pencarian"
                role="combobox"
                aria-expanded={open}
                aria-controls="search-results-list"
                aria-activedescendant={
                  activeIndex >= 0 ? `result-${activeIndex}` : undefined
                }
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 pointer-events-none select-none rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-1 font-mono text-[11px] font-medium text-gray-400 dark:text-gray-500">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div
              id="search-results-list"
              ref={listRef}
              className="max-h-[50vh] overflow-y-auto"
              role="listbox"
            >
              {/* Show default suggestions when no query */}
              {!hasQuery && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
                    Pintasan
                  </p>
                  <div className="space-y-1">
                    {staticPages.slice(0, 6).map((page, idx) => (
                      <button
                        key={page.id}
                        data-result-item
                        id={`result-${idx}`}
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={() => handleItemClick(page.href)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 border-l-2 border-transparent",
                          activeIndex === idx
                            ? "bg-green-50 dark:bg-green-900/30 border-l-2 border-green-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/60"
                        )}
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                            activeIndex === idx
                              ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          )}
                        >
                          <page.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              activeIndex === idx
                                ? "text-green-700 dark:text-green-400"
                                : "text-gray-800 dark:text-gray-200"
                            )}
                          >
                            {page.title}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {page.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            activeIndex === idx
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-300 dark:text-gray-600"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show filtered results when there's a query */}
              {hasQuery && (
                <div className="p-3">
                  {/* Static pages by category */}
                  {Object.entries(groupedPages).map(
                    ([category, pages]) => {
                      const CatIcon = categoryIcons[category] || FileText;
                      return (
                        <div key={category} className="mb-3 last:mb-0">
                          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                            <CatIcon className="h-3 w-3" />
                            {category}
                          </p>
                          {pages.slice(0, 5).map((page) => {
                            const idx = flatItems.findIndex(
                              (f) =>
                                f.type === "static" && f.id === page.id
                            );
                            return (
                              <button
                                key={page.id}
                                data-result-item
                                id={`result-${idx}`}
                                role="option"
                                aria-selected={activeIndex === idx}
                                onClick={() => handleItemClick(page.href)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 border-l-2 border-transparent mb-0.5",
                                  activeIndex === idx
                                    ? "bg-green-50 dark:bg-green-900/30 border-l-2 border-green-500"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/60"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                    activeIndex === idx
                                      ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                  )}
                                >
                                  <page.icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={cn(
                                      "text-sm font-medium truncate",
                                      activeIndex === idx
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-gray-800 dark:text-gray-200"
                                    )}
                                  >
                                    {page.title}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                    {page.description}
                                  </p>
                                </div>
                                <ArrowRight
                                  className={cn(
                                    "h-4 w-4 flex-shrink-0 transition-colors",
                                    activeIndex === idx
                                      ? "text-green-500 dark:text-green-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  )}
                                />
                              </button>
                            );
                          })}
                        </div>
                      );
                    }
                  )}

                  {/* Berita results */}
                  {(isSearching || beritaResults.length > 0) && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                        <Newspaper className="h-3 w-3" />
                        Berita
                      </p>
                      {isSearching && (
                        <div className="flex items-center gap-2 px-3 py-4 text-sm text-gray-400 dark:text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Mencari berita...
                        </div>
                      )}
                      {!isSearching &&
                        beritaResults.map((berita) => {
                          const idx = flatItems.findIndex(
                            (f) =>
                              f.type === "berita" && f.id === berita.slug
                          );
                          return (
                            <button
                              key={berita.slug}
                              data-result-item
                              id={`result-${idx}`}
                              role="option"
                              aria-selected={activeIndex === idx}
                              onClick={() =>
                                handleItemClick(`/berita/${berita.slug}`)
                              }
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 border-l-2 border-transparent mb-0.5",
                                activeIndex === idx
                                  ? "bg-green-50 dark:bg-green-900/30 border-l-2 border-green-500"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/60"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                  activeIndex === idx
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    "text-sm font-medium truncate",
                                    activeIndex === idx
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-800 dark:text-gray-200"
                                  )}
                                >
                                  {berita.title}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                  {berita.category} &middot;{" "}
                                  {new Date(berita.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <ArrowRight
                                className={cn(
                                  "h-4 w-4 flex-shrink-0 transition-colors",
                                  activeIndex === idx
                                    ? "text-green-500 dark:text-green-400"
                                    : "text-gray-300 dark:text-gray-600"
                                )}
                              />
                            </button>
                          );
                        })}
                    </div>
                  )}

                  {/* Empty state */}
                  {showNoResults && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                        <Search className="h-5 w-5 text-gray-300 dark:text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tidak ada hasil
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Tidak ditemukan halaman atau berita untuk &quot;
                        <span className="text-gray-500 dark:text-gray-300">{query}</span>&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with hints */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-2.5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 font-mono text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 font-mono text-[10px]">
                    ↓
                  </kbd>
                  <span className="ml-1">navigasi</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[10px]">
                    ↵
                  </kbd>
                  <span className="ml-1">buka</span>
                </span>
              </div>
              <span className="hidden sm:inline">
                <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[10px]">
                  esc
                </kbd>{" "}
                untuk menutup
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
