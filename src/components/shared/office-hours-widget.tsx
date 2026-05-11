"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Phone,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react";

const WITA_TZ = "Asia/Makassar";
const OPEN_HOUR = 8;
const OPEN_MINUTE = 0;
const CLOSE_HOUR = 15;
const CLOSE_MINUTE = 0;
const CHECK_INTERVAL_MS = 30_000;

interface OfficeStatus {
  isOpen: boolean;
  currentTime: string;
  currentDate: string;
  dayName: string;
  countdown: string;
  progress: number;
}

function getOfficeStatus(): OfficeStatus {
  const now = new Date();

  // Format current time
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: WITA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: WITA_TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dayShortFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: WITA_TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const currentTime = timeFormatter.format(now);
  const currentDate = dateFormatter.format(now);

  const parts = dayShortFormatter.formatToParts(now);
  const dayName = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);

  const currentMinutes = hour * 60 + minute;
  const openMinutes = OPEN_HOUR * 60 + OPEN_MINUTE;
  const closeMinutes = CLOSE_HOUR * 60 + CLOSE_MINUTE;

  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(dayName);
  const isOpen = isWeekday && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  // Calculate countdown
  let countdown = "";
  let progress = 0;

  if (isWeekday) {
    if (isOpen) {
      const remaining = closeMinutes - currentMinutes;
      const rh = Math.floor(remaining / 60);
      const rm = remaining % 60;
      countdown = `${rh} jam ${rm} menit lagi`;
      progress = ((currentMinutes - openMinutes) / (closeMinutes - openMinutes)) * 100;
    } else if (currentMinutes < openMinutes) {
      const untilOpen = openMinutes - currentMinutes;
      const uh = Math.floor(untilOpen / 60);
      const um = untilOpen % 60;
      countdown = `Buka dalam ${uh} jam ${um} menit`;
    } else {
      // After hours on weekday
      countdown = "Buka besok pukul 08.00";
    }
  } else {
    countdown = "Buka Senin pukul 08.00";
  }

  return { isOpen, currentTime, currentDate, dayName, countdown, progress };
}

// External store
let officeListeners: Array<() => void> = [];
let officeIntervalId: ReturnType<typeof setInterval> | null = null;

function subscribeOffice(listener: () => void): () => void {
  officeListeners.push(listener);
  if (!officeIntervalId) {
    officeIntervalId = setInterval(() => {
      for (const fn of officeListeners) fn();
    }, CHECK_INTERVAL_MS);
  }
  return () => {
    officeListeners = officeListeners.filter((l) => l !== listener);
    if (officeListeners.length === 0 && officeIntervalId) {
      clearInterval(officeIntervalId);
      officeIntervalId = null;
    }
  };
}

function getSnapshotOffice(): OfficeStatus {
  return getOfficeStatus();
}

function getServerSnapshotOffice(): OfficeStatus {
  return {
    isOpen: false,
    currentTime: "--:--:--",
    currentDate: "Memuat...",
    dayName: "",
    countdown: "",
    progress: 0,
  };
}

const weeklySchedule = [
  { day: "Senin", hours: "08.00 – 15.00", isOpen: true },
  { day: "Selasa", hours: "08.00 – 15.00", isOpen: true },
  { day: "Rabu", hours: "08.00 – 15.00", isOpen: true },
  { day: "Kamis", hours: "08.00 – 15.00", isOpen: true },
  { day: "Jumat", hours: "08.00 – 15.00", isOpen: true },
  { day: "Sabtu", hours: "Tutup", isOpen: false },
  { day: "Minggu", hours: "Tutup", isOpen: false },
];

/**
 * Enhanced office hours widget with:
 * - Real-time clock (WITA)
 * - Open/closed status with countdown
 * - Progress bar during office hours
 * - Weekly schedule expandable
 * - Contact info
 */
export function OfficeHoursWidget() {
  const status = useSyncExternalStore(
    subscribeOffice,
    getSnapshotOffice,
    getServerSnapshotOffice
  );
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Status header */}
      <div
        className={`p-4 ${
          status.isOpen
            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10"
            : "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/40 dark:to-slate-800/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                status.isOpen
                  ? "bg-green-100 dark:bg-green-900/50"
                  : "bg-gray-100 dark:bg-gray-700/50"
              }`}
            >
              <Building2
                className={`h-5 w-5 ${
                  status.isOpen
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Jam Operasional
                </h3>
                <motion.span
                  key={status.isOpen ? "open" : "closed"}
                  className="relative flex h-2.5 w-2.5"
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      status.isOpen ? "bg-green-500 animate-ping" : ""
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      status.isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </motion.span>
              </div>
              <p
                className={`text-xs font-semibold ${
                  status.isOpen
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {status.isOpen ? "Sedang Buka" : "Sedang Tutup"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums tracking-tight">
              {status.currentTime}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">WITA</p>
          </div>
        </div>

        {/* Progress bar during office hours */}
        <AnimatePresence>
          {status.isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress hari ini</span>
                <span>{Math.round(status.progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown */}
        {status.countdown && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            <Clock className="h-3 w-3 inline mr-1" />
            {status.countdown}
          </p>
        )}
      </div>

      {/* Current date and toggle */}
      <button
        onClick={() => setShowSchedule(!showSchedule)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors border-t border-gray-100 dark:border-gray-700/40"
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">{status.currentDate}</span>
        </div>
        {showSchedule ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* Weekly schedule (expandable) */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-700/40"
          >
            <div className="p-3 space-y-1">
              {weeklySchedule.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.day}</span>
                  <span
                    className={`font-medium ${
                      item.isOpen
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact info footer */}
      <div className="p-3 bg-gray-50/50 dark:bg-gray-800/20 space-y-2 border-t border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span>Jl. Ahmad Yani No.1, Bajawa</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span>(0382) 21073</span>
        </div>
      </div>
    </div>
  );
}
