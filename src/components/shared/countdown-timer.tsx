"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────
const WITA_TZ = "Asia/Makassar";
const OPEN_HOUR = 8;
const OPEN_MINUTE = 0;
const CLOSE_HOUR = 15;
const CLOSE_MINUTE = 0;
const CHECK_INTERVAL_MS = 1_000; // update every second

// ── Types ────────────────────────────────────────────────────────────
interface TimerState {
  status: "open" | "before" | "closed";
  /** HH:MM:SS formatted string, e.g. "07:23:45" */
  display: string;
}

// ── Helper: pad zero ────────────────────────────────────────────────
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ── Core logic ───────────────────────────────────────────────────────
/**
 * Computes the current timer state based on WITA time.
 *
 * - "open":  Mon–Fri between 08:00 and 15:00  → countdown to 15:00
 * - "before": Mon–Fri before 08:00             → time until 08:00
 * - "closed": Mon–Fri after 15:00 or weekend   → opens at 08:00 tomorrow
 */
function getTimerState(): TimerState {
  const now = new Date();

  // Get WITA components via Intl
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WITA_TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now);

  const dayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  const weekday =
    dayMap[parts.find((p) => p.type === "weekday")?.value ?? ""] ?? 0;

  const hour = parseInt(
    parts.find((p) => p.type === "hour")?.value ?? "0",
    10,
  );
  const minute = parseInt(
    parts.find((p) => p.type === "minute")?.value ?? "0",
    10,
  );
  const second = parseInt(
    parts.find((p) => p.type === "second")?.value ?? "0",
    10,
  );

  const currentSeconds = hour * 3600 + minute * 60 + second;
  const openSeconds = OPEN_HOUR * 3600 + OPEN_MINUTE * 60;
  const closeSeconds = CLOSE_HOUR * 3600 + CLOSE_MINUTE * 60;

  // ── Weekend (Sat or Sun) ─────────────────────────────────────────
  if (weekday < 1 || weekday > 5) {
    // Seconds until next Monday 08:00
    const daysUntilMon = weekday === 0 ? 1 : 8 - weekday; // Sun→1, Sat→2
    const secondsUntilMon =
      daysUntilMon * 86400 + openSeconds - currentSeconds;
    return { status: "closed", display: formatDuration(secondsUntilMon) };
  }

  // ── Weekday before open ──────────────────────────────────────────
  if (currentSeconds < openSeconds) {
    const remaining = openSeconds - currentSeconds;
    return { status: "before", display: formatDuration(remaining) };
  }

  // ── Weekday operating hours ──────────────────────────────────────
  if (currentSeconds < closeSeconds) {
    const remaining = closeSeconds - currentSeconds;
    return { status: "open", display: formatDuration(remaining) };
  }

  // ── Weekday after close ──────────────────────────────────────────
  const secondsUntilTomorrow =
    86400 - currentSeconds + openSeconds;
  return { status: "closed", display: formatDuration(secondsUntilTomorrow) };
}

/** Format a duration in seconds to HH:MM:SS */
function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
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

// Cache the snapshot to avoid creating new objects on every call
// useSyncExternalStore requires referentially stable return values
let cachedSnapshot: TimerState | null = null;

function getSnapshot(): TimerState {
  const next = getTimerState();
  if (
    cachedSnapshot &&
    cachedSnapshot.status === next.status &&
    cachedSnapshot.display === next.display
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return next;
}

const SERVER_SNAPSHOT: TimerState = Object.freeze({ status: "closed", display: "--:--:--" });

function getServerSnapshot(): TimerState {
  return SERVER_SNAPSHOT;
}

// ── Component ────────────────────────────────────────────────────────
export function CountdownTimer() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 select-none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Clock className="h-3.5 w-3.5 text-green-300 shrink-0" />

      {state.status === "open" && (
        <span className="text-sm text-green-100">
          Jam Operasional:{" "}
          <span className="font-mono font-semibold text-green-300">
            {state.display}
          </span>{" "}
          tersisa
        </span>
      )}

      {state.status === "before" && (
        <span className="text-sm text-green-100">
          Buka pukul{" "}
          <span className="font-mono font-semibold text-amber-300">
            {pad(OPEN_HOUR)}:{pad(OPEN_MINUTE)}
          </span>
        </span>
      )}

      {state.status === "closed" && (
        <span className="text-sm text-green-100">
          Tutup &mdash; Buka pukul{" "}
          <span className="font-mono font-semibold text-amber-300">
            {pad(OPEN_HOUR)}:{pad(OPEN_MINUTE)}
          </span>{" "}
          besok
        </span>
      )}
    </motion.div>
  );
}
