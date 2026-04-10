"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";

interface QuickLink {
  emoji: string;
  label: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  { emoji: "📋", label: "Cek NIK", href: "/layanan-online/cek-status" },
  { emoji: "📝", label: "Pengaduan", href: "/pengaduan" },
  { emoji: "📰", label: "Berita", href: "/berita" },
  { emoji: "📊", label: "Statistik", href: "/statistik" },
  { emoji: "📄", label: "Layanan", href: "/layanan" },
  { emoji: "🏛️", label: "Profil", href: "/profil" },
  { emoji: "💡", label: "Inovasi", href: "/inovasi" },
  { emoji: "📋", label: "Transparansi", href: "/transparansi" },
];

const panelVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const linkItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.03,
      duration: 0.25,
      ease: "easeOut",
    },
  }),
};

export function QuickAccessPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    close();
  }, [close]);

  return (
    <div className="hidden md:block">
      {/* Trigger FAB */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Akses Cepat"
        aria-expanded={isOpen}
      >
        <LayoutGrid className="h-5 w-5 animate-pulse" />
        <span className="sr-only">Akses Cepat</span>
      </motion.button>

      {/* Backdrop & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={close}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.nav
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 z-50 h-full w-60 bg-white rounded-r-xl shadow-xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Panel Akses Cepat"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-800">
                  Akses Cepat
                </h2>
                <button
                  onClick={close}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Tutup panel akses cepat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {quickLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={linkItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors text-sm font-medium"
                    >
                      <span className="text-lg leading-none" aria-hidden="true">
                        {link.emoji}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Disdukcapil Ngada
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
