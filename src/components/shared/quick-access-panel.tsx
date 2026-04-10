"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  X,
  ClipboardCheck,
  MessageSquare,
  Newspaper,
  BarChart3,
  FileText,
  Building2,
  Lightbulb,
  ShieldCheck,
  Keyboard,
  type LucideIcon,
} from "lucide-react";

interface QuickLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  { icon: ClipboardCheck, label: "Cek NIK", href: "/layanan-online/cek-status" },
  { icon: MessageSquare, label: "Pengaduan", href: "/pengaduan" },
  { icon: Newspaper, label: "Berita", href: "/berita" },
  { icon: BarChart3, label: "Statistik", href: "/statistik" },
  { icon: FileText, label: "Layanan", href: "/layanan" },
  { icon: Building2, label: "Profil", href: "/profil" },
  { icon: Lightbulb, label: "Inovasi", href: "/inovasi" },
  { icon: ShieldCheck, label: "Transparansi", href: "/transparansi" },
];

const panelVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const,
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
      ease: "easeOut" as const,
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
      {/* FAB Trigger with Animated Gradient Border */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Akses Cepat"
        aria-expanded={isOpen}
      >
        {/* Rotating conic-gradient border wrapper */}
        <span
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            animationDuration: "4s",
            background:
              "conic-gradient(from 0deg, #15803d, #0d9488, #22c55e, #fbbf24, #15803d)",
          }}
        />
        {/* Inner button background */}
        <span className="absolute inset-[3px] rounded-full bg-green-700" />
        {/* Icon layer */}
        <span className="relative z-10 flex items-center justify-center w-full h-full">
          <LayoutGrid className="h-5 w-5 text-white animate-breathing" />
        </span>
        {/* Glow shadow */}
        <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.25)] pointer-events-none" />
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

            {/* Glassmorphism Panel */}
            <motion.nav
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 z-50 h-full w-64 bg-white/80 backdrop-blur-xl rounded-r-2xl shadow-2xl flex flex-col border-r border-white/20 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Panel Akses Cepat"
            >
              {/* Top gradient accent line */}
              <div className="h-1 bg-gradient-to-r from-green-500 via-teal-400 to-emerald-500 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100/60">
                <div className="flex items-center gap-2.5">
                  {/* Green dot indicator */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-gray-800 leading-tight">
                      Akses Cepat
                    </h2>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      Navigasi cepat ke halaman utama
                    </p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-colors cursor-pointer"
                  aria-label="Tutup panel akses cepat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {quickLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
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
                        className="group flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 text-sm font-medium transition-all duration-200 border-l-2 border-transparent hover:border-l-green-500 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-transparent hover:text-green-800"
                      >
                        <Icon className="h-[18px] w-[18px] text-gray-400 group-hover:text-green-600 transition-colors duration-200 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Decorative gradient orb */}
              <div
                className="absolute bottom-12 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, #22c55e 0%, transparent 70%)",
                }}
              />

              {/* Footer */}
              <div className="relative shrink-0 px-5 py-3">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-2.5" />
                <div className="flex items-center justify-center gap-1.5 text-gray-400">
                  <Keyboard className="h-3 w-3" />
                  <p className="text-[11px]">
                    Tekan{" "}
                    <kbd className="px-1 py-0.5 rounded border border-gray-300 bg-gray-50 text-[10px] font-mono text-gray-500">
                      ESC
                    </kbd>{" "}
                    untuk menutup
                  </p>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
