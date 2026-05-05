"use client";

import { useSyncExternalStore, useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Wifi } from "lucide-react";

/* ── ClientOnly: useSyncExternalStore for mount detection ── */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function ClientOnly({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();
  if (!mounted) return <section aria-label="Pengunjung aktif" className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-y border-gray-200/80 dark:border-gray-700/50"><div className="container mx-auto px-4 py-3"><div className="flex justify-center gap-8"><span className="h-4 w-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded inline-block" /><span className="h-4 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded inline-block" /></div></div></section>;
  return <>{children}</>;
}

/* ── localStorage keys ── */
const DAILY_KEY = "disdukcapil_live_daily_visits";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyVisits(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) {
      const { date, count } = JSON.parse(raw) as { date: string; count: number };
      if (date === todayKey()) return count;
    }
  } catch {
    /* ignore */
  }
  return 0;
}

function bumpDailyVisits(): number {
  const count = getDailyVisits() + 1;
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: todayKey(), count }));
  return count;
}

/* ── Animated number (smooth interpolation) ── */
function useSmoothNumber(
  target: number,
  durationMs: number = 800,
): number {
  const [current, setCurrent] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<{ from: number; t0: number } | null>(null);

  useEffect(() => {
    startRef.current = null;

    const tick = (ts: number) => {
      if (!startRef.current) {
        startRef.current = { from: current, t0: ts };
      }
      const { from, t0 } = startRef.current;
      const progress = Math.min((ts - t0) / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs, current]);

  return current;
}

/* ── Generate next "online" target (natural fluctuation) ── */
function nextOnlineTarget(current: number): number {
  // Small random walk around 5-15 band
  const delta = Math.random() > 0.5 ? 1 : -1;
  const magnitude = Math.random() > 0.7 ? 2 : 1;
  let next = current + delta * magnitude;
  // Clamp to 5-15
  next = Math.max(5, Math.min(15, next));
  return next;
}

/* ── Format number with thousand separator ── */
function fmt(n: number): string {
  return n.toLocaleString("id-ID");
}

/* ── FadeSlide animation variant for the number ── */
const numVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

/* ──────────────────────────────────────────── */

export function LiveVisitorCounter() {
  /* daily visits — read + increment once on mount */
  const [dailyVisits, setDailyVisits] = useState(() => {
    if (typeof window === "undefined") return 0;
    return bumpDailyVisits();
  });

  /* online count — target changes every 5-8 s with random walk */
  const [onlineTarget, setOnlineTarget] = useState(() => {
    // Initial random value between 5-15
    return Math.floor(Math.random() * 11) + 5;
  });

  const updateOnline = useCallback(() => {
    setOnlineTarget((prev) => nextOnlineTarget(prev));
  }, []);

  useEffect(() => {
    const schedule = (): ReturnType<typeof setTimeout> => {
      const delay = 5000 + Math.random() * 3000; // 5-8 seconds
      return setTimeout(() => {
        updateOnline();
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, [updateOnline]);

  const onlineSmooth = useSmoothNumber(onlineTarget, 1200);

  /* We show a new "key" each time the target changes so AnimatePresence triggers */
  const onlineKey = useMemo(() => {
    // key changes every time onlineTarget changes, but only when the rounded smooth value changes
    return onlineSmooth;
  }, [onlineSmooth]);

  return (
    <ClientOnly>
    <section
      aria-label="Pengunjung aktif"
      className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-y border-gray-200/80 dark:border-gray-700/50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {/* Online visitors */}
          <div className="flex items-center gap-2.5 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400" />
            </span>
            <Wifi className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Pengunjung Online:&nbsp;
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-50 inline-flex items-center min-w-[2ch]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={onlineKey}
                  variants={numVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  ~{onlineSmooth}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          {/* Separator dot */}
          <span
            className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
            aria-hidden
          />

          {/* Daily total */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Total Kunjungan Hari Ini:&nbsp;
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-50 inline-flex items-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={dailyVisits}
                  variants={numVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {fmt(dailyVisits)}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
      </div>
    </section>
    </ClientOnly>
  );
}
