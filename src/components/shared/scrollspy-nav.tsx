"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────
interface SectionDef {
  id: string;
  label: string;
}

// ─── Section Definitions ──────────────────────────────────────────────
const SECTIONS: SectionDef[] = [
  { id: "hero", label: "Beranda" },
  { id: "stats", label: "Data Kependudukan" },
  { id: "statistik-charts", label: "Statistik Penduduk" },
  { id: "layanan", label: "Layanan" },
  { id: "layanan-online", label: "Layanan Online" },
  { id: "berita", label: "Berita" },
  { id: "faq", label: "FAQ" },
  { id: "lokasi", label: "Lokasi" },
  { id: "kontak", label: "Kontak" },
];

// ─── Fade-in threshold: show after scrolling 500px ────────────────────
const SCROLL_THRESHOLD = 500;

export function ScrollspyNav() {
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isSettingRef = useRef(false);

  // ─── Intersection Observer setup ──────────────────────────────────
  const setupObserver = useCallback(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Prevent re-entry from the callback itself
        if (isSettingRef.current) return;
        isSettingRef.current = true;

        // Find the entry that is currently most visible (intersecting + ratio)
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio descending — pick the most visible
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveId(visibleEntries[0].target.id);
        }

        requestAnimationFrame(() => {
          isSettingRef.current = false;
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5],
      }
    );

    // Observe all sections that exist in the DOM
    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) {
        observerRef.current?.observe(el);
      }
    });
  }, []);

  useEffect(() => {
    // Initial setup — wait for DOM to be ready
    const timer = setTimeout(() => {
      setupObserver();
    }, 500);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  // ─── Scroll visibility ────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll(); // Check initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Smooth scroll to section ─────────────────────────────────────
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80; // Account for sticky header
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2"
            aria-label="Navigasi cepat bagian halaman"
          >
            {/* Vertical connecting line */}
            <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

            {SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              const isHovered = hoveredId === section.id;

              return (
                <Tooltip key={section.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      onMouseEnter={() => setHoveredId(section.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full"
                      aria-label={`Pergi ke bagian ${section.label}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {/* Dot */}
                      <motion.span
                        className="relative z-10 rounded-full transition-colors duration-200"
                        animate={{
                          width: isActive ? 10 : isHovered ? 8 : 6,
                          height: isActive ? 10 : isHovered ? 8 : 6,
                          backgroundColor: isActive
                            ? "#15803d"
                            : isHovered
                              ? "#4ade80"
                              : "#d1d5db",
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      />

                      {/* Active glow ring */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute w-5 h-5 rounded-full bg-green-400 -z-10"
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="text-xs font-medium bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-0 shadow-lg"
                  >
                    {section.label}
                    {isActive && (
                      <span className="ml-1.5 text-green-400 dark:text-green-600">●</span>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
