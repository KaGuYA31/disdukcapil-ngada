"use client";

import { useState, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Clock,
  Coffee,
  Users,
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

/* ── ClientOnly: useSyncExternalStore for mount detection ── */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function ClientOnly({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();
  if (!mounted) return <section className="py-16 md:py-24 bg-white dark:bg-gray-950"><div className="container mx-auto px-4"><div className="max-w-2xl mx-auto h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" /></div></section>;
  return <>{children}</>;
}

const WITA_TZ = "Asia/Makassar";

interface DaySchedule {
  id: number;
  name: string;
  nameShort: string;
  isClosed: boolean;
  slots: {
    label: string;
    time: string;
    type: "operasional" | "istirahat";
  }[];
  services: string[];
  estimatedWait: string;
  busyLevel: "low" | "medium" | "high";
}

const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    id: 1,
    name: "Senin",
    nameShort: "Sen",
    isClosed: false,
    slots: [
      { label: "Sesi Pagi", time: "08:00 - 12:00 WITA", type: "operasional" },
      { label: "Istirahat", time: "12:00 - 13:00 WITA", type: "istirahat" },
      { label: "Sesi Siang", time: "13:00 - 15:00 WITA", type: "operasional" },
    ],
    services: ["KTP-el", "KK", "Akta Lahir", "Akta Nikah", "Pindah Domisili"],
    estimatedWait: "~30-45 menit",
    busyLevel: "medium",
  },
  {
    id: 2,
    name: "Selasa",
    nameShort: "Sel",
    isClosed: false,
    slots: [
      { label: "Sesi Pagi", time: "08:00 - 12:00 WITA", type: "operasional" },
      { label: "Istirahat", time: "12:00 - 13:00 WITA", type: "istirahat" },
      { label: "Sesi Siang", time: "13:00 - 15:00 WITA", type: "operasional" },
    ],
    services: ["KTP-el", "KK", "Akta Lahir", "Akta Kematian", "Surat Pindah"],
    estimatedWait: "~25-40 menit",
    busyLevel: "low",
  },
  {
    id: 3,
    name: "Rabu",
    nameShort: "Rab",
    isClosed: false,
    slots: [
      { label: "Sesi Pagi", time: "08:00 - 12:00 WITA", type: "operasional" },
      { label: "Istirahat", time: "12:00 - 13:00 WITA", type: "istirahat" },
      { label: "Sesi Siang", time: "13:00 - 15:00 WITA", type: "operasional" },
    ],
    services: ["KTP-el", "KK", "Akta Lahir", "Akta Cerai", "Legalisir"],
    estimatedWait: "~20-35 menit",
    busyLevel: "low",
  },
  {
    id: 4,
    name: "Kamis",
    nameShort: "Kam",
    isClosed: false,
    slots: [
      { label: "Sesi Pagi", time: "08:00 - 12:00 WITA", type: "operasional" },
      { label: "Istirahat", time: "12:00 - 13:00 WITA", type: "istirahat" },
      { label: "Sesi Siang", time: "13:00 - 15:00 WITA", type: "operasional" },
    ],
    services: ["KTP-el", "KK", "Akta Lahir", "Pengaduan", "KIA"],
    estimatedWait: "~25-40 menit",
    busyLevel: "medium",
  },
  {
    id: 5,
    name: "Jumat",
    nameShort: "Jum",
    isClosed: false,
    slots: [
      { label: "Sesi Pagi", time: "08:00 - 12:00 WITA", type: "operasional" },
      { label: "Istirahat", time: "12:00 - 13:00 WITA", type: "istirahat" },
      { label: "Sesi Siang", time: "13:00 - 15:00 WITA", type: "operasional" },
    ],
    services: ["KTP-el", "KK", "Akta Lahir", "Surat Keterangan"],
    estimatedWait: "~30-50 menit",
    busyLevel: "high",
  },
  {
    id: 6,
    name: "Sabtu",
    nameShort: "Sab",
    isClosed: true,
    slots: [],
    services: [],
    estimatedWait: "-",
    busyLevel: "low",
  },
  {
    id: 7,
    name: "Minggu",
    nameShort: "Min",
    isClosed: true,
    slots: [],
    services: [],
    estimatedWait: "-",
    busyLevel: "low",
  },
];

function getWITADay(): number {
  const now = new Date();
  const dayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: WITA_TZ,
    weekday: "short",
  }).format(now);
  const dayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  };
  return dayMap[dayStr] ?? 1;
}

function getWITATime(): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: WITA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function getWITADate(): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: WITA_TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getWITAHour(): number {
  const now = new Date();
  const rawHour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: WITA_TZ,
      hour: "numeric",
      hour12: false,
    }).format(now),
    10
  );
  return rawHour === 24 ? 0 : rawHour;
}

function getWITAMinute(): number {
  const now = new Date();
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: WITA_TZ,
      minute: "numeric",
      hour12: false,
    }).format(now),
    10
  );
}

function getOfficeStatus(): { isOpen: boolean; status: string; isBreak: boolean } {
  const day = getWITADay();
  if (day >= 6) return { isOpen: false, status: "Tutup - Hari Libur", isBreak: false };

  const hour = getWITAHour();
  const minute = getWITAMinute();
  const currentMinutes = hour * 60 + minute;

  if (currentMinutes < 8 * 60) return { isOpen: false, status: "Belum Buka", isBreak: false };
  if (currentMinutes >= 8 * 60 && currentMinutes < 12 * 60) return { isOpen: true, status: "Sedang Melayani", isBreak: false };
  if (currentMinutes >= 12 * 60 && currentMinutes < 13 * 60) return { isOpen: false, status: "Istirahat", isBreak: true };
  if (currentMinutes >= 13 * 60 && currentMinutes < 15 * 60) return { isOpen: true, status: "Sedang Melayani", isBreak: false };
  return { isOpen: false, status: "Sudah Tutup", isBreak: false };
}

function BusyLevelBadge({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { label: "Sepi", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dots: 1 },
    medium: { label: "Sedang", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", dots: 2 },
    high: { label: "Ramai", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", dots: 3 },
  };
  const c = config[level];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      <span className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i < c.dots ? (level === "high" ? "bg-red-500 dark:bg-red-400" : level === "medium" ? "bg-amber-500 dark:bg-amber-400" : "bg-emerald-500 dark:bg-emerald-400") : "bg-gray-200 dark:bg-gray-600"}`}
          />
        ))}
      </span>
      {c.label}
    </span>
  );
}

function AnalogClock() {
  const [time, setTime] = useState({ hour: getWITAHour(), minute: getWITAMinute(), second: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("en-US", {
        timeZone: WITA_TZ,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).format(now);
      const parts = timeStr.split(":");
      setTime({
        hour: parseInt(parts[0], 10) === 24 ? 0 : parseInt(parts[0], 10),
        minute: parseInt(parts[1], 10),
        second: parseInt(parts[2], 10),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const hourDeg = (time.hour % 12) * 30 + time.minute * 0.5;
  const minuteDeg = time.minute * 6 + time.second * 0.1;
  const secondDeg = time.second * 6;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700/50 shadow-inner">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className={`rounded-full ${i % 3 === 0 ? "w-1 h-3 bg-green-600 dark:bg-green-400" : "w-0.5 h-2 bg-green-300 dark:bg-green-600"}`}
              style={{
                transform: `rotate(${i * 30}deg) translateY(-${i % 3 === 0 ? 34 : 36}px)`,
                transformOrigin: "center center",
              }}
            />
          </div>
        ))}
      </div>
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-green-600 dark:bg-green-400 z-10" />
      {/* Hour hand */}
      <div
        className="absolute left-1/2 top-1/2 w-1 h-6 sm:h-7 bg-green-700 dark:bg-green-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full z-20"
        style={{ transform: `translateX(-50%) rotate(${hourDeg}deg) translateY(-100%)` }}
      />
      {/* Minute hand */}
      <div
        className="absolute left-1/2 top-1/2 w-0.5 h-8 sm:h-10 bg-green-600 dark:bg-green-300 rounded-full origin-bottom -translate-x-1/2 -translate-y-full z-30"
        style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg) translateY(-100%)` }}
      />
      {/* Second hand */}
      <div
        className="absolute left-1/2 top-1/2 w-px h-9 sm:h-11 bg-yellow-500 dark:bg-yellow-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full z-40"
        style={{ transform: `translateX(-50%) rotate(${secondDeg}deg) translateY(-100%)` }}
      />
    </div>
  );
}

// Animation variants
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function JadwalPelayananSection() {
  const [selectedDay, setSelectedDay] = useState<number>(getWITADay());
  const [currentTime, setCurrentTime] = useState(getWITATime());
  const [currentDate, setCurrentDate] = useState(getWITADate());
  const [officeStatus, setOfficeStatus] = useState(getOfficeStatus());
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const currentDay = getWITADay();
  const selectedSchedule = WEEKLY_SCHEDULE.find((d) => d.id === selectedDay)!;

  useEffect(() => {
    const update = () => {
      setCurrentTime(getWITATime());
      setCurrentDate(getWITADate());
      setOfficeStatus(getOfficeStatus());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to current day tab on mobile
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(`[data-day="${currentDay}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [currentDay]);

  return (
    <ClientOnly>
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2315803d' stroke-width='0.5' fill='none'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3Ccircle cx='0' cy='0' r='20'/%3E%3Ccircle cx='80' cy='0' r='20'/%3E%3Ccircle cx='0' cy='80' r='20'/%3E%3Ccircle cx='80' cy='80' r='20'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-32 w-64 h-64 bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Clock className="h-4 w-4" />
            Jadwal Pelayanan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2">
            Jam Operasional Kantor
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Informasi lengkap jadwal pelayanan Disdukcapil Kabupaten Ngada berdasarkan Waktu Indonesia Tengah (WITA)
          </p>
        </motion.div>

        {/* Live Clock + Status Bar */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30 overflow-hidden">
            {/* Glassmorphism shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300/50 dark:via-green-500/30 to-transparent" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Analog Clock */}
              <div className="flex-shrink-0">
                <AnalogClock />
              </div>

              {/* Time Info */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  Waktu Saat Ini (WITA)
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1 tabular-nums tracking-tight" suppressHydrationWarning>
                  {currentTime}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1" suppressHydrationWarning>{currentDate}</p>

                {/* Office Status Badge */}
                <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      officeStatus.isOpen
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : officeStatus.isBreak
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      {officeStatus.isOpen && (
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          officeStatus.isOpen ? "bg-emerald-500" : officeStatus.isBreak ? "bg-amber-500" : "bg-red-500"
                        }`}
                      />
                    </span>
                    {officeStatus.status}
                  </span>
                  {officeStatus.isBreak && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Coffee className="h-3 w-3" />
                      Kembali pukul 13:00
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Reference */}
              <div className="hidden md:flex flex-col gap-1.5 text-right flex-shrink-0">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Buka</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">08:00</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Coffee className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">12:00-13:00</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tutup</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">15:00</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Day Tabs */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-8"
        >
          <div
            ref={tabsContainerRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin justify-start sm:justify-center"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#15803d transparent" }}
          >
            {WEEKLY_SCHEDULE.map((day) => {
              const isToday = day.id === currentDay;
              const isSelected = day.id === selectedDay;
              return (
                <button
                  key={day.id}
                  data-day={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[80px] ${
                    isSelected
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/25 dark:bg-green-500 dark:shadow-green-500/20"
                      : isToday
                        ? "bg-green-50 text-green-700 border-2 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {isToday && !isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-950" />
                  )}
                  <span className="block">{day.nameShort}</span>
                  {day.isClosed && (
                    <span className={`block text-[10px] mt-0.5 ${isSelected ? "text-green-200" : "text-gray-400 dark:text-gray-500"}`}>
                      Tutup
                    </span>
                  )}
                  {isToday && !day.isClosed && (
                    <span className="block text-[10px] mt-0.5 text-yellow-300 dark:text-yellow-400">
                      Hari ini
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Day Detail Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative"
            >
              {selectedSchedule.isClosed ? (
                /* Closed Day Card */
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700/50 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedSchedule.name} — Hari Libur
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">
                    Kantor Disdukcapil Kabupaten Ngada <strong>tutup</strong> pada hari {selectedSchedule.name.toLowerCase()}. Silakan kembali pada hari kerja Senin – Jumat.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30 inline-block">
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      Untuk layanan darurat, silakan hubungi kami melalui WhatsApp
                    </p>
                  </div>
                </div>
              ) : (
                /* Active Day Card */
                <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800/60 dark:to-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 shadow-lg shadow-green-500/5 dark:shadow-green-500/5 overflow-hidden">
                  {/* Top accent gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500" />

                  {/* Glassmorphism shine */}
                  <div className="absolute top-0 right-0 w-1/3 h-32 bg-gradient-to-bl from-white/40 dark:from-white/5 to-transparent pointer-events-none" />

                  <div className="p-6 md:p-8">
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {selectedSchedule.name}
                          </h3>
                          {selectedSchedule.id === currentDay && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold">
                              <CheckCircle2 className="h-3 w-3" />
                              Hari Ini
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Jam operasional pelayanan administrasi kependudukan
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <BusyLevelBadge level={selectedSchedule.busyLevel} />
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Estimasi Tunggu</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {selectedSchedule.estimatedWait}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {selectedSchedule.slots.map((slot, idx) => (
                        <motion.div
                          key={idx}
                          variants={cardVariants}
                          whileHover={{ y: -2 }}
                          className={`relative rounded-xl p-4 border transition-all duration-300 ${
                            slot.type === "operasional"
                              ? "bg-white dark:bg-gray-800/50 border-green-100 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md"
                              : "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/20"
                          }`}
                        >
                          {slot.type === "operasional" && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-t-xl" />
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            {slot.type === "operasional" ? (
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                                <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                            )}
                            <span className={`text-sm font-semibold ${slot.type === "operasional" ? "text-gray-900 dark:text-gray-100" : "text-amber-700 dark:text-amber-300"}`}>
                              {slot.label}
                            </span>
                          </div>
                          <p className={`text-sm font-mono ${slot.type === "operasional" ? "text-gray-600 dark:text-gray-300" : "text-amber-600 dark:text-amber-400"}`}>
                            {slot.time}
                          </p>
                          {/* Active slot indicator */}
                          {selectedSchedule.id === currentDay && slot.type === "operasional" && !officeStatus.isBreak && officeStatus.isOpen && (
                            (() => {
                              const nowMinutes = getWITAHour() * 60 + getWITAMinute();
                              const startH = idx === 0 ? 8 : 13;
                              const endH = idx === 0 ? 12 : 15;
                              const isActive = nowMinutes >= startH * 60 && nowMinutes < endH * 60;
                              if (!isActive) return null;
                              return (
                                <div className="flex items-center gap-1 mt-2">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                  </span>
                                  <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">Sedang berlangsung</span>
                                </div>
                              );
                            })()
                          )}
                          {selectedSchedule.id === currentDay && officeStatus.isBreak && slot.type === "istirahat" && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                              </span>
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Sedang berlangsung</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Available Services */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Layanan yang Tersedia
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSchedule.services.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium border border-green-100 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-default"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>Pelayanan berlaku untuk seluruh masyarakat Kabupaten Ngada</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <FileText className="h-4 w-4" />
                          <span>Harap membawa dokumen persyaratan yang lengkap</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Legend / Info */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>Buka / Sedang Melayani</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Istirahat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Tutup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white dark:border-gray-950 shadow-sm" />
              <span>Hari Ini</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
              <ChevronRight className="h-3 w-3" />
              <span>Jadwal dapat berubah pada hari libur nasional</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </ClientOnly>
  );
}
