"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Users,
  FileText,
  FileX,
  ArrowRightLeft,
  MessageSquare,
  Search,
  ListOrdered,
  LayoutGrid,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface QuickServiceShortcutsProps {
  className?: string;
}

interface ServiceItem {
  name: string;
  icon: LucideIcon;
  href: string;
  color: ServiceColor;
}

type ServiceColor =
  | "emerald"
  | "green"
  | "teal"
  | "slate"
  | "blue"
  | "amber"
  | "violet"
  | "rose";

// ─── Service Data ─────────────────────────────────────────────────────
const services: ServiceItem[] = [
  { name: "KTP-el", icon: CreditCard, href: "/layanan/ktp-el", color: "emerald" },
  { name: "Kartu Keluarga", icon: Users, href: "/layanan/kartu-keluarga", color: "green" },
  { name: "Akta Lahir", icon: FileText, href: "/layanan/akta-kelahiran", color: "teal" },
  { name: "Akta Kematian", icon: FileX, href: "/layanan/akta-kematian", color: "slate" },
  { name: "Pindah", icon: ArrowRightLeft, href: "/layanan/pindah-domisili", color: "blue" },
  { name: "Pengaduan", icon: MessageSquare, href: "/pengaduan", color: "amber" },
  { name: "Cek Status", icon: Search, href: "/layanan-online/cek-status", color: "violet" },
  { name: "Antrian", icon: ListOrdered, href: "/layanan-online", color: "rose" },
];

// ─── Color Map ────────────────────────────────────────────────────────
const colorClasses: Record<ServiceColor, { bg: string; darkBg: string; ring: string }> = {
  emerald: {
    bg: "bg-emerald-500 hover:bg-emerald-600",
    darkBg: "dark:bg-emerald-600 dark:hover:bg-emerald-700",
    ring: "ring-emerald-300/50 dark:ring-emerald-400/40",
  },
  green: {
    bg: "bg-green-500 hover:bg-green-600",
    darkBg: "dark:bg-green-600 dark:hover:bg-green-700",
    ring: "ring-green-300/50 dark:ring-green-400/40",
  },
  teal: {
    bg: "bg-teal-500 hover:bg-teal-600",
    darkBg: "dark:bg-teal-600 dark:hover:bg-teal-700",
    ring: "ring-teal-300/50 dark:ring-teal-400/40",
  },
  slate: {
    bg: "bg-slate-500 hover:bg-slate-600",
    darkBg: "dark:bg-slate-600 dark:hover:bg-slate-700",
    ring: "ring-slate-300/50 dark:ring-slate-400/40",
  },
  blue: {
    bg: "bg-blue-500 hover:bg-blue-600",
    darkBg: "dark:bg-blue-600 dark:hover:bg-blue-700",
    ring: "ring-blue-300/50 dark:ring-blue-400/40",
  },
  amber: {
    bg: "bg-amber-500 hover:bg-amber-600",
    darkBg: "dark:bg-amber-600 dark:hover:bg-amber-700",
    ring: "ring-amber-300/50 dark:ring-amber-400/40",
  },
  violet: {
    bg: "bg-violet-500 hover:bg-violet-600",
    darkBg: "dark:bg-violet-600 dark:hover:bg-violet-700",
    ring: "ring-violet-300/50 dark:ring-violet-400/40",
  },
  rose: {
    bg: "bg-rose-500 hover:bg-rose-600",
    darkBg: "dark:bg-rose-600 dark:hover:bg-rose-700",
    ring: "ring-rose-300/50 dark:ring-rose-400/40",
  },
};

// ─── Radial Position Calculator ───────────────────────────────────────
const RADIAL_RADIUS = 110;
const ARC_START_DEG = 160; // upper-left in standard math coords
const ARC_SPAN_DEG = 140;  // total arc span

function getButtonPosition(index: number, total: number) {
  const angleDeg = ARC_START_DEG - (ARC_SPAN_DEG / (total - 1)) * index;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * RADIAL_RADIUS,
    y: -Math.sin(angleRad) * RADIAL_RADIUS,
  };
}

// ─── Animation Variants ───────────────────────────────────────────────
const fabVariants = {
  closed: { rotate: 0, scale: 1 },
  open: { rotate: 45, scale: 1 },
};

const serviceButtonVariants = {
  closed: {
    scale: 0,
    opacity: 0,
    x: 0,
    y: 0,
  },
  open: (pos: { x: number; y: number }) => ({
    scale: 1,
    opacity: 1,
    x: pos.x,
    y: pos.y,
  }),
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

// ─── Component ────────────────────────────────────────────────────────
export function QuickServiceShortcuts({ className = "" }: QuickServiceShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Pre-compute button positions
  const buttonPositions = useMemo(
    () => services.map((_, i) => getButtonPosition(i, services.length)),
    [],
  );

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 ${className}`}
      aria-label="Pintasan Layanan Cepat"
    >
      {/* Service Buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={close}
              aria-hidden="true"
            />

            {/* Service shortcut buttons */}
            {services.map((service, index) => {
              const pos = buttonPositions[index];
              const Icon = service.icon;
              const colors = colorClasses[service.color];
              const isCurrentPage = pathname === service.href || pathname.startsWith(service.href + "/");

              return (
                <motion.div
                  key={service.name}
                  custom={pos}
                  variants={serviceButtonVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-[6px] right-[6px] flex flex-col items-center"
                  style={{ width: 80 }}
                >
                  <Link
                    href={service.href}
                    onClick={close}
                    className={`
                      group relative flex items-center justify-center
                      w-12 h-12 sm:w-12 sm:h-12
                      rounded-full shadow-lg text-white
                      transition-all duration-200
                      ${colors.bg} ${colors.darkBg}
                      ${isCurrentPage ? `ring-2 ${colors.ring} ring-offset-2 ring-offset-background` : ""}
                      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none
                    `}
                    aria-label={service.name}
                    aria-current={isCurrentPage ? "page" : undefined}
                  >
                    {/* Active page indicator pulse */}
                    {isCurrentPage && (
                      <motion.span
                        layoutId="service-active-pulse"
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            `0 0 0 0 rgba(255,255,255,0.4)`,
                            `0 0 0 6px rgba(255,255,255,0)`,
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}

                    <Icon className="h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                  </Link>

                  {/* Label */}
                  <span className="
                    mt-1.5 text-[10px] sm:text-xs font-medium
                    text-muted-foreground dark:text-muted-foreground
                    text-center leading-tight max-w-[4.5rem]
                    truncate sm:whitespace-nowrap
                  ">
                    {service.name}
                  </span>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          relative w-14 h-14 rounded-full
          bg-gradient-to-br from-green-600 to-teal-600
          hover:from-green-500 hover:to-teal-500
          dark:from-green-700 dark:to-teal-700
          dark:hover:from-green-600 dark:hover:to-teal-600
          flex items-center justify-center
          shadow-xl shadow-green-600/25 dark:shadow-green-900/40
          text-white transition-colors duration-300
          focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none
        `}
        aria-label={isOpen ? "Tutup menu layanan" : "Buka menu layanan cepat"}
        aria-expanded={isOpen}
      >
        {/* Animated ring when open */}
        <motion.div
          animate={{
            boxShadow: isOpen
              ? "0 0 0 4px rgba(22, 163, 74, 0.2)"
              : "0 0 0 0px rgba(22, 163, 74, 0)",
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full"
        />

        {/* Icon: LayoutGrid or X with rotation */}
        <motion.div
          variants={fabVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <LayoutGrid className="h-6 w-6" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
