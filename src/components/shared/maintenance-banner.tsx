"use client";

import { useState, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────
interface MaintenanceBannerProps {
  type?: "maintenance" | "info" | "warning" | "success" | "emergency";
  title: string;
  message: string;
  startDate?: string | Date;
  endDate?: string | Date;
  autoDismiss?: boolean;
  dismissDuration?: number; // seconds
  showProgress?: boolean;
  className?: string;
}

// ─── Icon Map ─────────────────────────────────────────────────────────
const iconMap: Record<MaintenanceBannerProps["type"], LucideIcon> = {
  maintenance: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  emergency: AlertCircle,
};

// ─── Theme Config ─────────────────────────────────────────────────────
interface ThemeConfig {
  lightBg: string;
  darkBg: string;
  iconColor: string;
  textColor: string;
  subTextColor: string;
  closeHover: string;
  progressColor: string;
  label: string;
  labelClasses: string;
}

const themeMap: Record<MaintenanceBannerProps["type"], ThemeConfig> = {
  maintenance: {
    lightBg: "bg-gradient-to-r from-red-600 via-amber-600 to-red-600",
    darkBg: "dark:from-red-900/90 dark:via-amber-900/90 dark:to-red-900/90",
    iconColor: "text-yellow-200",
    textColor: "text-white",
    subTextColor: "text-red-100/85",
    closeHover: "hover:bg-white/20",
    progressColor: "bg-yellow-300",
    label: "Pemeliharaan",
    labelClasses:
      "bg-red-500/30 text-red-100 dark:bg-red-400/20 dark:text-red-200",
  },
  info: {
    lightBg: "bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600",
    darkBg: "dark:from-teal-900/90 dark:via-cyan-900/90 dark:to-teal-900/90",
    iconColor: "text-teal-100",
    textColor: "text-white",
    subTextColor: "text-teal-100/85",
    closeHover: "hover:bg-white/20",
    progressColor: "bg-teal-200",
    label: "Informasi",
    labelClasses:
      "bg-teal-500/30 text-teal-100 dark:bg-teal-400/20 dark:text-teal-200",
  },
  warning: {
    lightBg: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500",
    darkBg: "dark:from-amber-900/90 dark:via-yellow-900/90 dark:to-amber-900/90",
    iconColor: "text-amber-900 dark:text-yellow-200",
    textColor: "text-amber-950 dark:text-white",
    subTextColor: "text-amber-800/85 dark:text-amber-100/85",
    closeHover: "hover:bg-black/10 dark:hover:bg-white/20",
    progressColor: "bg-amber-900 dark:bg-yellow-200",
    label: "Peringatan",
    labelClasses:
      "bg-amber-700/30 text-amber-100 dark:bg-amber-400/20 dark:text-amber-200",
  },
  success: {
    lightBg: "bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600",
    darkBg: "dark:from-emerald-900/90 dark:via-green-900/90 dark:to-emerald-900/90",
    iconColor: "text-emerald-100",
    textColor: "text-white",
    subTextColor: "text-emerald-100/85",
    closeHover: "hover:bg-white/20",
    progressColor: "bg-emerald-200",
    label: "Pengumuman",
    labelClasses:
      "bg-emerald-500/30 text-emerald-100 dark:bg-emerald-400/20 dark:text-emerald-200",
  },
  emergency: {
    lightBg: "bg-gradient-to-r from-red-700 via-red-600 to-red-700",
    darkBg: "dark:from-red-950/95 dark:via-red-900/95 dark:to-red-950/95",
    iconColor: "text-red-100",
    textColor: "text-white",
    subTextColor: "text-red-100/85",
    closeHover: "hover:bg-white/20",
    progressColor: "bg-red-300",
    label: "Darurat",
    labelClasses:
      "bg-red-500/40 text-white dark:bg-red-400/30 dark:text-red-100",
  },
};

// ─── Default auto-dismiss durations (seconds) ────────────────────────
const defaultDurations: Record<MaintenanceBannerProps["type"], number> = {
  maintenance: 30,
  info: 30,
  warning: 45,
  success: 20,
  emergency: 0, // never auto-dismiss
};

// ─── Helpers ──────────────────────────────────────────────────────────
function parseDate(date: string | Date): Date {
  return typeof date === "string" ? new Date(date) : date;
}

function isWithinRange(start?: Date, end?: Date): boolean {
  const now = new Date();
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

const STORAGE_KEY_PREFIX = "maintenance-banner-dismissed-";
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function wasRecentlyDismissed(key: string): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    const timestamp = Number(stored);
    if (Number.isNaN(timestamp)) return false;
    return Date.now() - timestamp < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function saveDismissal(key: string): void {
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // Storage full or unavailable — ignore
  }
}

// ─── Hydration / Mount Guard ──────────────────────────────────────────
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// ─── Dismissal State Store ────────────────────────────────────────────
// Per-instance dismissal tracking so useSyncExternalStore can react
const dismissalSubscribers = new Set<() => void>();

function subscribeToDismissal(callback: () => void): () => void {
  dismissalSubscribers.add(callback);
  return () => {
    dismissalSubscribers.delete(callback);
  };
}

function notifyDismissalChange(): void {
  for (const cb of dismissalSubscribers) cb();
}

// ─── Component ────────────────────────────────────────────────────────
export function MaintenanceBanner({
  type = "maintenance",
  title,
  message,
  startDate,
  endDate,
  autoDismiss = true,
  dismissDuration,
  showProgress = true,
  className,
}: MaintenanceBannerProps) {
  const mounted = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);

  // Track dismissals with a simple counter to force re-renders
  const [dismissCount, setDismissCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(100);

  // Parse schedule dates once
  const startParsed = startDate ? parseDate(startDate) : undefined;
  const endParsed = endDate ? parseDate(endDate) : undefined;

  // Dismissal key for localStorage
  const dismissalKey = `${STORAGE_KEY_PREFIX}${type}-${title.slice(0, 32)}`;

  // Read dismissal state via useSyncExternalStore (reactive to localStorage)
  const isDismissed = useSyncExternalStore(
    subscribeToDismissal,
    () => wasRecentlyDismissed(dismissalKey) || dismissCount > 0,
    () => false
  );

  // Combined visibility check
  const isScheduled = mounted && isWithinRange(startParsed, endParsed);
  const shouldHide = !isScheduled || isDismissed;

  // ── Dismiss handler (called only from user event callbacks) ──
  const handleDismiss = useCallback(() => {
    saveDismissal(dismissalKey);
    notifyDismissalChange();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [dismissalKey]);

  // ── Auto-dismiss timer with progress bar ──
  // We use a ref to hold handleDismiss so the interval callback
  // always calls the latest version without restarting the timer.
  const handleDismissRef = useRef(handleDismiss);
  const handleDismissSync = useSyncExternalStore(noopSubscribe, () => {
    handleDismissRef.current = handleDismiss;
    return "";
  });
  void handleDismissSync;

  const shouldStartTimer = useSyncExternalStore(
    noopSubscribe,
    () => (!shouldHide && autoDismiss ? 1 : 0),
    () => 0
  );

  // When shouldStartTimer changes to 1, we start the timer
  const prevShouldStart = useRef(shouldStartTimer);
  const timerStarted = useSyncExternalStore(noopSubscribe, () => {
    const current = shouldStartTimer;
    const prev = prevShouldStart.current;
    prevShouldStart.current = current;

    if (current === 1 && prev === 0) {
      // Banner just became visible — start timer
      if (timerRef.current) clearInterval(timerRef.current);

      const duration = dismissDuration ?? defaultDurations[type];
      if (duration > 0) {
        startTimeRef.current = Date.now();
        setProgress(100);

        timerRef.current = setInterval(() => {
          if (!startTimeRef.current) return;
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const remaining = Math.max(0, 1 - elapsed / duration);
          setProgress(remaining * 100);

          if (remaining <= 0) {
            handleDismissRef.current();
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
        }, 100);
      }
    } else if (current === 0 && prev === 1) {
      // Banner just got hidden — stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return current;
  });
  void timerStarted;

  // Suppress unused variable warnings
  void dismissCount;
  void setDismissCount;

  // ── Render ──
  if (shouldHide) return null;

  // Determine whether to show the progress bar
  const duration = dismissDuration ?? defaultDurations[type];
  const shouldShowProgress = showProgress && autoDismiss && duration > 0;

  const theme = themeMap[type];
  const Icon = iconMap[type];
  const isEmergency = type === "emergency";

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live={isEmergency ? "assertive" : "polite"}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{
          y: { type: "spring", stiffness: 260, damping: 28 },
          opacity: { duration: 0.3 },
        }}
        className={cn(
          "relative w-full z-50",
          theme.lightBg,
          theme.darkBg,
          isEmergency && "animate-pulse",
          className
        )}
      >
        {/* Banner content */}
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          {/* Left: icon + text */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Icon container */}
            <div
              className={cn(
                "flex-shrink-0 mt-0.5 w-8 h-8 rounded-full",
                "bg-white/15 backdrop-blur-sm",
                "flex items-center justify-center"
              )}
            >
              <Icon className={cn("h-4 w-4", theme.iconColor)} />
            </div>

            {/* Text */}
            <div className="min-w-0 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span
                  className={cn(
                    "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                    theme.labelClasses
                  )}
                >
                  {theme.label}
                </span>
                <h3
                  className={cn(
                    "text-sm font-semibold leading-snug line-clamp-1",
                    theme.textColor
                  )}
                >
                  {title}
                </h3>
              </div>
              <p
                className={cn(
                  "mt-0.5 text-xs leading-relaxed line-clamp-2",
                  theme.subTextColor
                )}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            aria-label="Tutup notifikasi"
            className={cn(
              "flex-shrink-0 h-8 w-8 rounded-full text-white",
              "bg-white/10 focus-visible:bg-white/20",
              theme.closeHover,
              isEmergency && "animate-none"
            )}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Progress countdown bar */}
        {shouldShowProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/5 overflow-hidden">
            <motion.div
              className={cn("h-full", theme.progressColor)}
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
