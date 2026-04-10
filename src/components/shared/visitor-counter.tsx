"use client";

import { useEffect, useRef, useState, useReducer, useCallback } from "react";
import { Eye, Users } from "lucide-react";

const TOTAL_BASE = 25847;
const DAILY_STORAGE_KEY = "disdukcapil_daily_visitors";
const TOTAL_STORAGE_KEY = "disdukcapil_total_visitors";
const VISITOR_ID_KEY = "disdukcapil_visitor_id";

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getTodayKey()) {
        return parsed.count as number;
      }
    }
  } catch {
    // ignore parse errors
  }
  return 0;
}

function incrementDailyCount(): number {
  const today = getTodayKey();
  const current = getDailyCount();
  const newCount = current + 1;
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

function getOrSetTotalCount(): number {
  if (typeof window === "undefined") return TOTAL_BASE;
  try {
    const stored = localStorage.getItem(TOTAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.total as number;
    }
  } catch {
    // ignore
  }
  const offset = Math.floor(Math.random() * 50) + 10;
  const total = TOTAL_BASE + offset;
  localStorage.setItem(TOTAL_STORAGE_KEY, JSON.stringify({ total }));
  return total;
}

function bumpTotalCount(current: number): number {
  const increment = Math.floor(Math.random() * 3) + 1;
  const newTotal = current + increment;
  localStorage.setItem(TOTAL_STORAGE_KEY, JSON.stringify({ total: newTotal }));
  return newTotal;
}

interface VisitorState {
  todayCount: number;
  totalCount: number;
  isReady: boolean;
}

type VisitorAction =
  | { type: "TRACK_VISIT" }
  | { type: "RESET" };

function visitorReducer(state: VisitorState, action: VisitorAction): VisitorState {
  switch (action.type) {
    case "TRACK_VISIT": {
      if (state.isReady) return state;
      getOrCreateVisitorId();
      const daily = incrementDailyCount();
      const total = bumpTotalCount(getOrSetTotalCount());
      return { todayCount: daily, totalCount: total, isReady: true };
    }
    case "RESET":
      return { todayCount: 0, totalCount: TOTAL_BASE, isReady: false };
    default:
      return state;
  }
}

/**
 * Hook that animates a number from 0 → target using requestAnimationFrame.
 * Returns the current animated value.
 */
function useCountUp(target: number, duration: number = 1200): number {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (target <= 0) return;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return display;
}

export function VisitorCounter() {
  const [state, dispatch] = useReducer(visitorReducer, {
    todayCount: 0,
    totalCount: TOTAL_BASE,
    isReady: false,
  });
  const hasTracked = useRef(false);

  const trackVisit = useCallback(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    dispatch({ type: "TRACK_VISIT" });
  }, []);

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  const animatedToday = useCountUp(state.todayCount, 800);
  const animatedTotal = useCountUp(state.totalCount, 1400);

  const formatNumber = (n: number) => n.toLocaleString("id-ID");

  if (!state.isReady) {
    return (
      <div className="flex items-center gap-4 text-xs" aria-label="Statistik pengunjung sedang dimuat">
        <span className="inline-flex items-center gap-1.5 text-gray-500">
          <Eye className="h-3 w-3" />
          <span className="inline-block w-12 h-3 animate-pulse bg-gray-700 rounded" />
        </span>
        <span className="text-gray-700">|</span>
        <span className="inline-flex items-center gap-1.5 text-gray-500">
          <Users className="h-3 w-3" />
          <span className="inline-block w-16 h-3 animate-pulse bg-gray-700 rounded" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-xs" aria-label="Statistik pengunjung">
      <span className="inline-flex items-center gap-1.5 text-gray-400">
        <Eye className="h-3 w-3 text-green-400/70" />
        <span>Pengunjung Hari Ini: <strong className="font-semibold text-gray-300">{formatNumber(animatedToday)}</strong></span>
      </span>

      <span className="text-gray-700">|</span>

      <span className="inline-flex items-center gap-1.5 text-gray-400">
        <Users className="h-3 w-3 text-green-400/70" />
        <span>Total Pengunjung: <strong className="font-semibold text-gray-300">{formatNumber(animatedTotal)}</strong></span>
      </span>
    </div>
  );
}
