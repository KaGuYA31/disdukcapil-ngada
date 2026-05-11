"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

interface EventCountdownProps {
  targetDate: string | Date;
  title?: string;
  description?: string;
  onComplete?: () => void;
  variant?: "default" | "compact" | "hero";
  showSeconds?: boolean;
  className?: string;
}

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  isPast: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────

function padTwo(n: number): string {
  return String(n).padStart(2, "0");
}

function computeCountdown(target: Date): CountdownResult {
  const now = Date.now();
  const targetMs = target.getTime();
  const diff = targetMs - now;

  if (diff <= -1000) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false, isPast: true };
  }

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true, isPast: false };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isComplete: false, isPast: false };
}

// ── useCountdown Hook ────────────────────────────────────────────────

function useCountdown(
  targetDate: Date,
  onComplete?: () => void,
): CountdownResult {
  const [result, setResult] = useState<CountdownResult>(() =>
    computeCountdown(targetDate),
  );

  const onCompleteRef = useRef(onComplete);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    hasCalledRef.current = false;
  }, [onComplete, targetDate]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = computeCountdown(targetDate);
      setResult(next);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    if (result.isComplete && !hasCalledRef.current) {
      hasCalledRef.current = true;
      onCompleteRef.current?.();
    }
  }, [result.isComplete]);

  return result;
}

// ── DigitCard (animated) ─────────────────────────────────────────────

function DigitCard({
  value,
  label,
  variant,
  showPulse,
}: {
  value: number;
  label: string;
  variant: "default" | "compact" | "hero";
  showPulse?: boolean;
}) {
  const displayValue = padTwo(value);

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-mono text-lg font-bold tabular-nums text-primary dark:text-primary-foreground leading-none"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
      </div>
    );
  }

  // default & hero variants
  const sizeClasses =
    variant === "hero"
      ? "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
      : "w-16 h-16 sm:w-20 sm:h-20";

  const textSizeClasses =
    variant === "hero"
      ? "text-3xl sm:text-4xl md:text-5xl"
      : "text-xl sm:text-2xl";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-xl overflow-hidden",
          sizeClasses,
          "bg-gradient-to-br from-green-600 to-teal-600",
          "dark:from-green-700 dark:to-emerald-700",
          "shadow-lg shadow-green-600/20 dark:shadow-green-900/30",
          "border border-green-500/30 dark:border-green-600/30",
        )}
        layout
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 pointer-events-none" />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "relative z-10 font-mono font-bold tabular-nums text-white",
              textSizeClasses,
              showPulse && "animate-pulse",
            )}
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <span
        className={cn(
          "font-medium text-muted-foreground uppercase tracking-wider select-none",
          variant === "hero" ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs",
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ── Separator ────────────────────────────────────────────────────────

function Separator({ variant }: { variant: "default" | "compact" | "hero" }) {
  if (variant === "compact") {
    return (
      <span className="font-mono text-lg font-bold text-muted-foreground mx-0.5">
        :
      </span>
    );
  }

  const size = variant === "hero" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl";
  return (
    <motion.span
      className={cn(size, "font-bold text-green-600 dark:text-green-400 select-none")}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      :
    </motion.span>
  );
}

// ── Post-Countdown States ────────────────────────────────────────────

function CompleteState({ variant }: { variant: "default" | "compact" | "hero" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-3",
        variant === "compact" ? "text-sm" : "text-lg sm:text-xl",
      )}
    >
      <motion.span
        className="relative flex h-3 w-3"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
      </motion.span>
      <span className="font-semibold text-green-600 dark:text-green-400">
        Acara Sedang Berlangsung!
      </span>
    </motion.div>
  );
}

function PastState({ variant }: { variant: "default" | "compact" | "hero" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-3",
        variant === "compact" ? "text-sm" : "text-lg sm:text-xl",
      )}
    >
      <PartyPopper className={cn(variant === "compact" ? "h-4 w-4" : "h-6 w-6", "text-muted-foreground")} />
      <span className="font-medium text-muted-foreground">
        Acara Telah Selesai
      </span>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function EventCountdown({
  targetDate,
  title,
  description,
  onComplete,
  variant = "default",
  showSeconds = true,
  className,
}: EventCountdownProps) {
  const parsedDate = useMemo(
    () => (targetDate instanceof Date ? targetDate : new Date(targetDate)),
    [targetDate],
  );

  const result = useCountdown(parsedDate, onComplete);

  // ── Post-countdown renders ──
  if (result.isPast) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        {title && (
          <h3 className="font-semibold text-muted-foreground text-sm">{title}</h3>
        )}
        <PastState variant={variant} />
      </div>
    );
  }

  if (result.isComplete) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        {title && (
          <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        )}
        <CompleteState variant={variant} />
      </div>
    );
  }

  // ── Active countdown ──
  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-0", className)}>
        {title && (
          <span className="mr-2 text-xs text-muted-foreground font-medium">{title}</span>
        )}
        <DigitCard value={result.days} label="Hari" variant="compact" />
        <Separator variant="compact" />
        <DigitCard value={result.hours} label="Jam" variant="compact" />
        <Separator variant="compact" />
        <DigitCard value={result.minutes} label="Menit" variant="compact" />
        {showSeconds && (
          <>
            <Separator variant="compact" />
            <DigitCard value={result.seconds} label="Detik" variant="compact" />
          </>
        )}
      </div>
    );
  }

  // default & hero
  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-4",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title & Description */}
      {(title || description) && (
        <div className="text-center space-y-1">
          {title && (
            <motion.h3
              className={cn(
                "font-bold text-foreground flex items-center justify-center gap-2",
                variant === "hero"
                  ? "text-xl sm:text-2xl md:text-3xl"
                  : "text-base sm:text-lg",
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {variant === "hero" && <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />}
              {title}
            </motion.h3>
          )}
          {description && (
            <motion.p
              className={cn(
                "text-muted-foreground",
                variant === "hero" ? "text-sm sm:text-base" : "text-xs sm:text-sm",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      {/* Hero background decoration */}
      {variant === "hero" && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-400/10 dark:bg-green-600/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-400/10 dark:bg-teal-600/10 blur-3xl" />
        </div>
      )}

      {/* Timer Cards */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <DigitCard value={result.days} label="Hari" variant={variant} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Separator variant={variant} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <DigitCard value={result.hours} label="Jam" variant={variant} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Separator variant={variant} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <DigitCard value={result.minutes} label="Menit" variant={variant} />
        </motion.div>

        {showSeconds && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Separator variant={variant} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <DigitCard
                value={result.seconds}
                label="Detik"
                variant={variant}
                showPulse={variant === "hero"}
              />
            </motion.div>
          </>
        )}
      </div>

      {/* Date indicator */}
      <motion.div
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Clock className="h-3 w-3" />
        <span>
          {parsedDate.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </motion.div>
    </motion.div>
  );
}
