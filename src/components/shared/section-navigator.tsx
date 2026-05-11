"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, ChevronRight } from "lucide-react";

/**
 * Floating section navigator for the homepage.
 * Shows a button that expands into a list of all major sections
 * allowing quick navigation. Detects current section via IntersectionObserver.
 */

interface SectionItem {
  id: string;
  label: string;
}

const HOMEPAGE_SECTIONS: SectionItem[] = [
  { id: "hero-section", label: "Beranda" },
  { id: "stats-section", label: "Statistik" },
  { id: "services-section", label: "Layanan" },
  { id: "featured-services-section", label: "Layanan Unggulan" },
  { id: "simulasi-biaya-section", label: "Simulasi Biaya" },
  { id: "berita-terkini-widget", label: "Berita Terkini" },
  { id: "faq-interaktif-section", label: "FAQ" },
  { id: "jadwal-pelayanan-section", label: "Jadwal Pelayanan" },
  { id: "testimoni-section", label: "Testimoni" },
  { id: "news-section", label: "Berita" },
  { id: "antrian-online-section", label: "Antrian Online" },
  { id: "panduan-layanan-section", label: "Panduan Layanan" },
  { id: "peta-kecamatan-section", label: "Peta Kecamatan" },
  { id: "inovasi-section", label: "Inovasi" },
];

export function SectionNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Observe sections as they enter the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }

          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0.1 }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      HOMEPAGE_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  // Only show after scrolling past hero
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide on mobile by default (too intrusive), only show on desktop
  const isDesktop = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false // server snapshot
  );

  if (!showButton || !isDesktop) return null;

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 dark:border-gray-700/40">
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                Navigasi Cepat
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                {activeSection
                  ? `Sekarang: ${HOMEPAGE_SECTIONS.find((s) => s.id === activeSection)?.label ?? ""}`
                  : "Scroll untuk melihat bagian"}
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin-green p-1">
              {HOMEPAGE_SECTIONS.filter((s) => visibleSections.has(s.id)).map(
                (section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all duration-200 ${
                        isActive
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      {isActive ? (
                        <ChevronRight className="h-3 w-3 flex-shrink-0 text-green-600 dark:text-green-400" />
                      ) : (
                        <div className="w-3 flex-shrink-0" />
                      )}
                      {section.label}
                    </button>
                  );
                }
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${
          isOpen
            ? "bg-green-600 text-white"
            : "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-gray-200 dark:border-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20"
        }`}
        aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
      >
        {isOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
      </motion.button>

      {/* Active section indicator dot */}
      {activeSection && !isOpen && (
        <motion.div
          layoutId="section-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 w-1 h-1 rounded-full bg-green-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
