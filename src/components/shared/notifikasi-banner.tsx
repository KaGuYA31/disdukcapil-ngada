"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface Announcement {
  id: string;
  title: string;
  content?: string | null;
  type?: string;
}

// ─── Fallback Data ──────────────────────────────────────────────────
const fallbackAnnouncements: Announcement[] = [
  {
    id: "fallback-1",
    title: "Pengumuman Penting: Layanan KTP-el dan KK kini GRATIS untuk seluruh masyarakat Kabupaten Ngada",
    content: "Pastikan membawa berkas persyaratan lengkap saat datang ke kantor.",
  },
  {
    id: "fallback-2",
    title: "Perpanjangan Jadwal Pelayanan Sabtu: Layanan jemput bola tersedia untuk masyarakat di pelosok desa",
    content: "Hubungi kami via WhatsApp untuk menjadwalkan kunjungan.",
  },
  {
    id: "fallback-3",
    title: "Sistem Antrian Online kini tersedia — Daftar sekarang untuk menghindari antrian panjang",
    content: "Akses layanan antrian online melalui menu Layanan di website ini.",
  },
];

// ─── Mounted Detection ──────────────────────────────────────────────
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// ─── Component ──────────────────────────────────────────────────────
export function NotifikasiBanner() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallbackAnnouncements);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch announcements
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const res = await fetch("/api/pengumuman?limit=3", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setAnnouncements(json.data.slice(0, 3));
        }
      } catch {
        // Keep fallback
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  // Check sessionStorage for dismissed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem("notifikasi-banner-dismissed");
      if (wasDismissed === "true") {
        setDismissed(true);
      }
    }
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (dismissed || announcements.length <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dismissed, announcements.length]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      // Reset auto-rotate timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 8000);
    },
    [currentIndex, announcements.length]
  );

  const goPrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? announcements.length - 1 : currentIndex - 1;
    goTo(newIndex);
  }, [currentIndex, announcements.length, goTo]);

  const goNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % announcements.length;
    goTo(newIndex);
  }, [currentIndex, announcements.length, goTo]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("notifikasi-banner-dismissed", "true");
    }
  }, []);

  if (!mounted || dismissed || announcements.length === 0) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const current = announcements[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-teal-600 dark:from-green-900 dark:via-green-800 dark:to-teal-900">
      <div className="container mx-auto px-4">
        <div className="relative min-h-[56px] flex items-center">
          {/* Megaphone icon */}
          <div className="flex-shrink-0 mr-3 hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-yellow-300" />
            </div>
          </div>

          {/* Announcement Content */}
          <div className="flex-1 overflow-hidden min-h-[44px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center pl-0 sm:pl-0 pr-10"
              >
                <div className="flex items-start gap-2 py-2">
                  <span className="inline-flex items-center gap-1.5 bg-yellow-400/20 text-yellow-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 flex-shrink-0">
                    Pengumuman
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                      {current.title}
                    </p>
                    {current.content && (
                      <p className="text-green-100/80 text-xs mt-0.5 line-clamp-1 hidden md:block">
                        {current.content}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {announcements.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Pengumuman sebelumnya"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={goNext}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Pengumuman berikutnya"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-1"
              aria-label="Tutup pengumuman"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Dots */}
        {announcements.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {announcements.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goTo(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 h-2 bg-yellow-300"
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Pengumuman ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
