"use client";

import { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Megaphone,
  GraduationCap,
  Flag,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/* ── ClientOnly: SSR-safe mount detection ── */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function ClientOnly({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();
  if (!mounted) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }
  return <>{children}</>;
}

/* ── Types ── */
type EventCategory = "Pelayanan Publik" | "Sosialisasi" | "Pelatihan" | "Upacara" | "Rapat";

interface EventItem {
  id: string;
  title: string;
  date: Date;
  location: string;
  time: string;
  category: EventCategory;
  description: string;
}

/* ── Category Configuration ── */
const CATEGORY_CONFIG: Record<
  EventCategory,
  {
    icon: typeof Users;
    gradient: string;
    badge: string;
    dot: string;
    border: string;
    bg: string;
    text: string;
  }
> = {
  "Pelayanan Publik": {
    icon: Users,
    gradient: "from-emerald-500 to-green-600",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
    border: "border-emerald-300 dark:border-emerald-700",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  Sosialisasi: {
    icon: Megaphone,
    gradient: "from-teal-500 to-teal-700",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/50",
    dot: "bg-teal-500",
    border: "border-teal-300 dark:border-teal-700",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
  },
  Pelatihan: {
    icon: GraduationCap,
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
    dot: "bg-amber-500",
    border: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  Upacara: {
    icon: Flag,
    gradient: "from-red-500 to-red-600",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/50",
    dot: "bg-red-500",
    border: "border-red-300 dark:border-red-700",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
  },
  Rapat: {
    icon: MessageSquare,
    gradient: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
    dot: "bg-blue-500",
    border: "border-blue-300 dark:border-blue-700",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
};

const ALL_CATEGORIES: EventCategory[] = ["Pelayanan Publik", "Sosialisasi", "Pelatihan", "Upacara", "Rapat"];
const FILTER_OPTIONS = ["Semua", ...ALL_CATEGORIES] as const;

/* ── Event Data ── */
function generateEvents(): EventItem[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return [
    {
      id: "evt-1",
      title: "Pelayanan KTP-el Keliling Kecamatan Bajawa",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 3, 28)),
      location: "Kantor Kecamatan Bajawa",
      time: "08:00 - 15:00 WITA",
      category: "Pelayanan Publik",
      description: "Layanan perekaman dan penerbitan KTP-el langsung di kecamatan untuk masyarakat yang belum memiliki KTP-el.",
    },
    {
      id: "evt-2",
      title: "Sosialisasi Digitalisasi Layanan Kependudukan",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 7, 28)),
      location: "Aula Disdukcapil, Bajawa",
      time: "09:00 - 12:00 WITA",
      category: "Sosialisasi",
      description: "Sosialisasi program digitalisasi layanan kependudukan kepada masyarakat dan perangkat desa se-Kabupaten Ngada.",
    },
    {
      id: "evt-3",
      title: "Pelatihan Pengoperasian Sistem SIAK Terbaru",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 10, 28)),
      location: "Ruang IT Disdukcapil",
      time: "08:00 - 16:00 WITA",
      category: "Pelatihan",
      description: "Pelatihan bagi seluruh operator SIAK mengenai pembaruan sistem dan fitur baru yang tersedia.",
    },
    {
      id: "evt-4",
      title: "Upacara Peringatan Hari Kesaktian Pancasila",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 14, 28)),
      location: "Halaman Kantor Disdukcapil",
      time: "07:00 - 09:00 WITA",
      category: "Upacara",
      description: "Upacara peringatan Hari Kesaktian Pancasila yang diikuti seluruh pegawai Disdukcapil Kabupaten Ngada.",
    },
    {
      id: "evt-5",
      title: "Rapat Koordinasi Kinerja Semester",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 18, 28)),
      location: "Ruang Rapat Disdukcapil",
      time: "10:00 - 14:00 WITA",
      category: "Rapat",
      description: "Rapat evaluasi kinerja semester beserta perencanaan program kerja semester berikutnya.",
    },
    {
      id: "evt-6",
      title: "Jemput Bola Penerbitan Akta Lahir",
      date: new Date(currentYear, currentMonth, Math.min(now.getDate() + 22, 28)),
      location: "Kecamatan Soa",
      time: "08:30 - 14:30 WITA",
      category: "Pelayanan Publik",
      description: "Layanan jemput bola penerbitan akta kelahiran untuk masyarakat di wilayah Kecamatan Soa.",
    },
  ];
}

/* ── Helpers ── */
function getDaysUntil(targetDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDateID(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDayNumber(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
  }).format(date);
}

function getMonthName(monthIndex: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return months[monthIndex];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getWITATime(): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function getWITADate(): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

const DAY_NAMES_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/* ── Animation Variants ── */
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const floatOrb = {
  animate: (i: number) => ({
    y: [0, -12, 0],
    x: [0, i % 2 === 0 ? 6 : -6, 0],
    scale: [1, 1.04, 1],
    opacity: [0.2, 0.35, 0.2],
    transition: {
      duration: 7 + i * 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: i * 0.7,
    },
  }),
};

const countUpVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ── Countdown Badge ── */
function CountdownBadge({ days }: { days: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const label = days === 0 ? "Hari ini" : `${days} Hari lagi`;

  return (
    <motion.span
      ref={ref}
      variants={countUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        days === 0
          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
          : days <= 3
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      <Clock className="h-3 w-3" />
      {label}
    </motion.span>
  );
}

/* ── Mini Calendar Component ── */
function MiniCalendar({
  events,
  onDateSelect,
  selectedDate,
}: {
  events: EventItem[];
  onDateSelect: (day: number | null) => void;
  selectedDate: number | null;
}) {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = new Date();

  const eventDays = useMemo(() => {
    const days = new Set<number>();
    events.forEach((evt) => {
      if (evt.date.getFullYear() === viewYear && evt.date.getMonth() === viewMonth) {
        days.add(evt.date.getDate());
      }
    });
    return days;
  }, [events, viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    onDateSelect(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    onDateSelect(null);
  };

  const handleDayClick = (day: number) => {
    if (eventDays.has(day)) {
      onDateSelect(selectedDate === day ? null : day);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/50 shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="h-4 w-4 text-green-700 dark:text-green-400" />
          </button>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getMonthName(viewMonth)} {viewYear}
          </h4>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="h-4 w-4 text-green-700 dark:text-green-400" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0 px-2 pt-2">
        {DAY_NAMES_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-0 px-2 pb-3">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const hasEvent = eventDays.has(day);
          const isToday =
            day === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear();
          const isSelected = selectedDate === day;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={!hasEvent}
              className={`relative h-8 w-full flex items-center justify-center text-xs rounded-lg transition-all duration-200 ${
                isToday
                  ? "font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                  : hasEvent
                    ? "font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                    : "text-gray-300 dark:text-gray-600 cursor-default"
              } ${isSelected ? "ring-2 ring-green-500 dark:ring-green-400 bg-green-100 dark:bg-green-900/40" : ""}`}
            >
              {day}
              {hasEvent && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isToday || isSelected ? "bg-green-500" : "bg-teal-400"}`}
                >
                  {isToday && (
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="px-4 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span>Ada Event</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>Hari Ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Today's Agenda Card ── */
function TodaysAgendaCard({ events }: { events: EventItem[] }) {
  const [currentTime, setCurrentTime] = useState(getWITATime());
  const [currentDate, setCurrentDate] = useState(getWITADate());

  useEffect(() => {
    const update = () => {
      setCurrentTime(getWITATime());
      setCurrentDate(getWITADate());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayEvents = events.filter((evt) => {
    const now = new Date();
    return (
      evt.date.getDate() === now.getDate() &&
      evt.date.getMonth() === now.getMonth() &&
      evt.date.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-white/80" />
            <span className="text-sm font-semibold text-white">Agenda Hari Ini</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-xs text-green-100">Live</span>
          </div>
        </div>
      </div>

      {/* Live Clock */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium" suppressHydrationWarning>
          {currentDate}
        </p>
        <p
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums tracking-tight mt-0.5"
          suppressHydrationWarning
        >
          {currentTime}
          <span className="text-sm font-normal text-gray-400 ml-2">WITA</span>
        </p>
      </div>

      {/* Events List */}
      <div className="px-5 pb-4">
        {todayEvents.length > 0 ? (
          <div className="space-y-2.5 mt-2">
            {todayEvents.map((evt) => {
              const catConfig = CATEGORY_CONFIG[evt.category];
              const IconComp = catConfig.icon;
              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30"
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center`}
                  >
                    <IconComp className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {evt.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {evt.time}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                    Sedang Berlangsung
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 mt-2">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Tidak ada agenda hari ini
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Periksa event mendatang di bawah
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Event Card ── */
function EventCard({
  event,
  index,
}: {
  event: EventItem;
  index: number;
}) {
  const daysLeft = getDaysUntil(event.date);
  const catConfig = CATEGORY_CONFIG[event.category];
  const IconComp = catConfig.icon;
  const isAlternate = index % 2 === 1;

  return (
    <motion.div
      variants={isAlternate ? slideFromRight : slideFromLeft}
      className={`flex flex-col md:flex-row gap-4 md:gap-6 ${isAlternate ? "md:flex-row-reverse" : ""}`}
    >
      {/* Date Badge */}
      <div className="flex-shrink-0 flex justify-center md:justify-start">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 shadow-lg shadow-green-500/20 dark:shadow-green-500/10 flex flex-col items-center justify-center text-white">
          <span className="text-2xl font-bold leading-none">{formatDayNumber(event.date)}</span>
          <span className="text-[10px] font-medium opacity-80 mt-0.5">
            {formatMonthYear(event.date)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex-1 relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Gradient border reveal on hover */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-green-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-green-500/60 group-hover:via-teal-500/60 group-hover:to-emerald-500/60 rounded-2xl transition-all duration-500 -z-10 blur-sm" />

        {/* Top accent line */}
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${catConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Glassmorphism shine */}
        <div className="absolute top-0 right-0 w-1/3 h-24 bg-gradient-to-bl from-white/30 dark:from-white/5 to-transparent pointer-events-none rounded-tr-2xl" />

        <div className="p-5">
          {/* Category + Countdown row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className={`border text-xs flex items-center gap-1 ${catConfig.badge}`}
            >
              <IconComp className="h-3 w-3" />
              {event.category}
            </Badge>
            <CountdownBadge days={daysLeft} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              {formatDateID(event.date)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Category Filter Pills ── */
function CategoryFilter({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin justify-start sm:justify-center px-1">
      <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      {FILTER_OPTIONS.map((cat) => {
        const isActive = activeFilter === cat;
        return (
          <motion.button
            key={cat}
            onClick={() => onFilterChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="event-category-pill"
                className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-full shadow-md shadow-green-500/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── Main Section Component ── */
export function EventAgendaSection() {
  const [events] = useState<EventItem[]>(() => generateEvents());
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filteredEvents = useMemo(() => {
    let result = events;
    if (activeFilter !== "Semua") {
      result = result.filter((evt) => evt.category === activeFilter);
    }
    if (selectedCalendarDay !== null) {
      const now = new Date();
      result = result.filter(
        (evt) =>
          evt.date.getDate() === selectedCalendarDay &&
          evt.date.getMonth() === now.getMonth() &&
          evt.date.getFullYear() === now.getFullYear()
      );
    }
    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, activeFilter, selectedCalendarDay]);

  const handleCalendarDateSelect = (day: number | null) => {
    setSelectedCalendarDay(day);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedCalendarDay(null);
  };

  return (
    <ClientOnly>
      <section
        ref={sectionRef}
        className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      >
        {/* ── Gradient Hero Banner ── */}
        <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
          {/* SVG Diamond Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0L26 14L14 26L2 14Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Animated Gradient Orbs */}
          <motion.div
            custom={0}
            variants={floatOrb}
            initial="animate"
            animate="animate"
            className="absolute top-2 left-[20%] w-20 h-20 bg-green-400/20 rounded-full blur-2xl pointer-events-none"
          />
          <motion.div
            custom={1}
            variants={floatOrb}
            initial="animate"
            animate="animate"
            className="absolute top-6 right-[15%] w-16 h-16 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"
          />
          {/* Glassmorphism Icon Container + Title */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20 p-3 shadow-lg">
                <CalendarCheck className="h-7 w-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Event & Agenda Dinas
                </h1>
                <p className="text-green-200/80 text-sm mt-0.5">
                  Jadwal kegiatan dan acara Disdukcapil Kabupaten Ngada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Background Decoration ── */}
        <div className="absolute inset-0 pointer-events-none top-[120px]" aria-hidden="true">
          {/* Dot Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='18' y='18' fill='%2316a34a' rx='1'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-transparent to-teal-50/10 dark:from-green-900/5 dark:via-transparent dark:to-teal-900/5" />
          {/* Decorative gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-100/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />
        </div>

        {/* ── Floating Decorative Shapes (hidden on mobile) ── */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-52 right-16 w-5 h-5 border-2 border-green-400/15 rounded-full hidden lg:block pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-24 w-4 h-4 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-sm hidden lg:block pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-80 left-[15%] w-3 h-3 bg-green-400/15 rounded-full hidden lg:block pointer-events-none"
        />

        {/* ── Main Content ── */}
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 animated-underline inline-block">
              Jadwal Kegiatan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Informasi lengkap event, agenda, dan kegiatan penting Disdukcapil Kabupaten Ngada
            </p>
          </motion.div>

          {/* ── Sidebar + Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── Left Sidebar: Today's Agenda + Calendar ── */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                variants={slideFromLeft}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <TodaysAgendaCard events={events} />
              </motion.div>

              <motion.div
                variants={slideFromLeft}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="transition-all duration-300"
              >
                <MiniCalendar
                  events={events}
                  onDateSelect={handleCalendarDateSelect}
                  selectedDate={selectedCalendarDay}
                />
              </motion.div>

              {/* Category Legend */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/50 p-4 shadow-md"
              >
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Kategori Event
                </h4>
                <div className="space-y-2">
                  {ALL_CATEGORIES.map((cat) => {
                    const config = CATEGORY_CONFIG[cat];
                    const IconComp = config.icon;
                    const count = events.filter((e) => e.category === cat).length;
                    return (
                      <div key={cat} className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComp className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                          {cat}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* ── Main: Event Cards ── */}
            <div className="lg:col-span-8">
              {/* Category Filter */}
              <motion.div
                variants={headerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mb-8"
              >
                <CategoryFilter
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                />
              </motion.div>

              {/* Events List */}
              <AnimatePresence mode="wait">
                {filteredEvents.length > 0 ? (
                  <motion.div
                    key={`${activeFilter}-${selectedCalendarDay ?? "all"}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="space-y-6"
                  >
                    {filteredEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Tidak ada event ditemukan
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Coba ubah filter kategori atau pilih tanggal lain di kalender
                    </p>
                    <button
                      onClick={() => {
                        setActiveFilter("Semua");
                        setSelectedCalendarDay(null);
                      }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      Tampilkan Semua
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Note */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="text-center mt-8"
              >
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Jadwal dapat berubah sewaktu-waktu. Hubungi kantor untuk informasi terkini.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );
}

/* ── Skeleton Loader ── */
export function EventAgendaSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      {/* Hero Banner Skeleton */}
      <div className="h-[120px] bg-gray-200 dark:bg-gray-800" />

      <div className="container mx-auto px-4 mt-10">
        {/* Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
          <Skeleton className="h-5 w-96 mx-auto mt-4 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            {/* Today's Agenda Skeleton */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 space-y-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-40 rounded" />
              <Skeleton className="h-3 w-52 rounded" />
              <div className="pt-3 space-y-2">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>

            {/* Calendar Skeleton */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
              <Skeleton className="h-4 w-32 mx-auto rounded" />
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded" />
                ))}
              </div>
            </div>

            {/* Category Legend Skeleton */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-3 flex-1 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-8">
            {/* Filter Skeleton */}
            <div className="flex gap-2 mb-8 justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>

            {/* Event Cards Skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0 mx-auto md:mx-0" />
                  <Skeleton className="h-44 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
