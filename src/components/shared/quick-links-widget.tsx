"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  X,
  Search,
  MessageCircle,
  FileText,
  Download,
  CreditCard,
  Phone,
  type LucideIcon,
} from "lucide-react";

interface QuickLinkItem {
  icon: LucideIcon;
  label: string;
  href: string;
  action?: "scroll" | "navigate";
}

const quickLinksData: QuickLinkItem[] = [
  {
    icon: Search,
    label: "Cek NIK",
    href: "/layanan-online/cek-status",
  },
  {
    icon: MessageCircle,
    label: "Pengaduan",
    href: "/pengaduan",
  },
  {
    icon: FileText,
    label: "Layanan Online",
    href: "/layanan-online",
  },
  {
    icon: Download,
    label: "Download Formulir",
    href: "/formulir",
  },
  {
    icon: CreditCard,
    label: "Cek Blanko E-KTP",
    href: "/statistik",
  },
  {
    icon: Phone,
    label: "Hubungi Kami",
    href: "#footer-contact",
    action: "scroll",
  },
];

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 16,
    originX: 1,
    originY: 1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    originX: 1,
    originY: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 28,
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 16,
    originX: 1,
    originY: 1,
    transition: {
      duration: 0.18,
      ease: "easeIn" as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export function QuickLinksWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  const handleLinkClick = useCallback(
    (item: QuickLinkItem) => {
      close();

      if (item.action === "scroll" && item.href.startsWith("#")) {
        // Small delay to let animation finish
        setTimeout(() => {
          const target = document.querySelector(item.href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      }
    },
    [close]
  );

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end" ref={panelRef}>
      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-18 right-0 mb-2 w-[280px] sm:w-[320px]"
          >
            {/* Backdrop card */}
            <div className="relative rounded-2xl bg-white dark:bg-gray-900 shadow-2xl shadow-green-900/10 dark:shadow-black/40 border border-gray-200/80 dark:border-gray-700/50 overflow-hidden">
              {/* Top gradient accent */}
              <div className="h-1 bg-gradient-to-r from-green-600 via-teal-500 to-emerald-400" />

              {/* Header */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <LayoutGrid className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Akses Cepat
                  </span>
                </div>
                <button
                  onClick={close}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="Tutup menu akses cepat"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quick Links Grid */}
              <div className="px-3 pb-3 grid grid-cols-3 gap-1.5">
                {quickLinksData.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="group flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-green-50 dark:hover:bg-green-900/25"
                      role="link"
                      tabIndex={0}
                      aria-label={item.label}
                      onClick={() => handleLinkClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleLinkClick(item);
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50 flex items-center justify-center group-hover:from-green-200 group-hover:to-teal-200 dark:group-hover:from-green-800/60 dark:group-hover:to-teal-800/60 transition-all duration-200">
                        <Icon className="h-5 w-5 text-green-700 dark:text-green-400" />
                      </div>
                      <span className="text-[11px] leading-tight font-medium text-gray-600 dark:text-gray-300 text-center line-clamp-2">
                        {item.label}
                      </span>
                    </motion.div>
                  );

                  if (item.action === "scroll") {
                    return (
                      <div key={item.label} onClick={() => handleLinkClick(item)}>
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href} onClick={() => handleLinkClick(item)}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={toggle}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg shadow-green-700/25 dark:shadow-green-900/40 flex items-center justify-center transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Buka menu akses cepat"
        aria-expanded={isOpen}
      >
        {/* Rotating ring */}
        <span
          className="absolute inset-0 rounded-full animate-spin opacity-30"
          style={{
            animationDuration: "6s",
            background:
              "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 flex items-center justify-center"
            >
              <X className="h-5.5 w-5.5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 flex items-center justify-center"
            >
              <LayoutGrid className="h-5.5 w-5.5 animate-breathing" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2, delay: 1 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none hidden lg:block"
          >
            Akses Cepat
            <span className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-2 h-2 bg-gray-800 dark:bg-gray-200 rotate-45 rounded-[1px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
