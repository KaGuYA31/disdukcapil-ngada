"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const WITA_TZ = "Asia/Makassar";
const OPEN_HOUR = 8;
const OPEN_MINUTE = 0;
const CLOSE_HOUR = 15;
const CLOSE_MINUTE = 30;
const CHECK_INTERVAL_MS = 60_000;

/**
 * Returns whether the office is currently open based on WITA time.
 * Weekdays (Mon=1 .. Fri=5) 08:00–15:30 WITA.
 */
function getIsOpen(): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: WITA_TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);

  const dayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  };
  const weekday = dayMap[parts.find((p) => p.type === "weekday")?.value ?? ""] ?? 0;

  if (weekday < 1 || weekday > 5) return false;

  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);

  const currentMinutes = hour * 60 + minute;
  const openMinutes = OPEN_HOUR * 60 + OPEN_MINUTE;
  const closeMinutes = CLOSE_HOUR * 60 + CLOSE_MINUTE;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

// ── External store for useSyncExternalStore ──────────────────────────
let listeners: Array<() => void> = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void): () => void {
  listeners.push(listener);

  if (!intervalId) {
    intervalId = setInterval(() => {
      for (const fn of listeners) fn();
    }, CHECK_INTERVAL_MS);
  }

  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (listeners.length === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot(): boolean {
  return getIsOpen();
}

function getServerSnapshot(): boolean {
  return false;
}

export function OperatingHoursIndicator() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="hidden md:flex items-center gap-2 cursor-default select-none">
          <Clock className="h-3.5 w-3.5 text-white/80" />
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <motion.span
              key={isOpen ? "open" : "closed"}
              className="relative flex h-2 w-2"
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" as const }}
            >
              <span
                className={[
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  isOpen ? "bg-green-400 animate-ping" : "bg-red-400",
                ].join(" ")}
              />
              <span
                className={[
                  "relative inline-flex rounded-full h-2 w-2",
                  isOpen ? "bg-green-400" : "bg-red-400",
                ].join(" ")}
              />
            </motion.span>
            {isOpen ? "Buka Sekarang" : "Tutup Sekarang"}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        <p className="font-medium">Jam Operasional</p>
        <p className="text-white/80 mt-0.5">Senin – Jumat: 08.00 – 15.30 WITA</p>
      </TooltipContent>
    </Tooltip>
  );
}
