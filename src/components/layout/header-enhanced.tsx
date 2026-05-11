"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ExternalLink } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface Announcement {
  id: number;
  emoji: string;
  text: string;
  link?: string;
  linkLabel?: string;
}

// ─── Constants ────────────────────────────────────────────────────────
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    emoji: "📅",
    text: "Pelayanan KTP-el selesai di tempat — Datang langsung!",
    link: "/layanan-online",
    linkLabel: "Layanan Online",
  },
  {
    id: 2,
    emoji: "📋",
    text: "Semua layanan GRATIS sesuai UU No. 24/2013",
  },
  {
    id: 3,
    emoji: "📱",
    text: "Cek status pengajuan layanan Anda secara online",
    link: "/layanan-online",
    linkLabel: "Cek Status",
  },
];

const ROTATION_INTERVAL = 5000; // 5 seconds
const DISMISS_KEY = "disdukcapil-announcement-dismissed";
const DISMISS_DURATION = 60 * 60 * 1000; // 1 hour

// ─── Main Component ───────────────────────────────────────────────────
export function HeaderEnhanced() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  // ─── Check dismissal status on mount ───────────
  const isDismissed = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const dismissedAt = localStorage.getItem(DISMISS_KEY);
        if (dismissedAt) {
          const elapsed = Date.now() - parseInt(dismissedAt, 10);
          if (elapsed < DISMISS_DURATION) return true;
          localStorage.removeItem(DISMISS_KEY);
        }
      } catch {
        // localStorage not available
      }
      return false;
    },
    () => false
  );

  // Show bar after a short delay (after mount, if not dismissed)
  useEffect(() => {
    if (!isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  // ─── Auto-rotation logic ─────────────────────────────────────────
  const advanceSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  }, []);

  useEffect(() => {
    if (!isVisible || isDismissed) return;

    intervalRef.current = setInterval(advanceSlide, ROTATION_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, isDismissed, advanceSlide]);

  // ─── Pause rotation on hover ─────────────────────────────────────
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    if (isVisible && !isDismissed) {
      intervalRef.current = setInterval(advanceSlide, ROTATION_INTERVAL);
    }
  };

  // ─── Swipe support for mobile ────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left → next
        advanceSlide();
      } else {
        // Swipe right → previous
        setCurrentIndex(
          (prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length
        );
      }
    }
    touchStartRef.current = null;
  };

  // ─── Dismiss handler ─────────────────────────────────────────────
  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Silently fail
    }
  };

  // Don't render if dismissed
  if (isDismissed || dismissed) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden relative z-40"
          role="banner"
        >
          {/* Bar */}
          <div
            className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-2 sm:py-2.5 min-h-[40px]">
                {/* Announcement content */}
                <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 min-w-0 px-8 sm:px-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="flex items-center gap-2 sm:gap-3 text-center sm:text-left"
                    >
                      <span className="text-base sm:text-lg flex-shrink-0" aria-hidden="true">
                        {current.emoji}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-tight">
                        {current.text}
                      </span>
                      {current.link && current.linkLabel && (
                        <Link
                          href={current.link}
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 transition-colors flex-shrink-0 border border-white/20"
                        >
                          {current.linkLabel}
                          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </Link>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/15 transition-colors flex-shrink-0"
                  aria-label="Tutup pengumuman"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/80 hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Progress indicator dots */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-1">
              {ANNOUNCEMENTS.map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-4 bg-white/70"
                      : "w-1.5 bg-white/25"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
