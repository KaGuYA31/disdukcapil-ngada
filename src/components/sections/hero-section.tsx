"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Users,
  IdCard,
  MessageSquare,
  Sun,
  Sunset,
  Moon,
  Clock,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Types ────────────────────────────────────────────────────────────

interface BerandaData {
  ringkasan: {
    totalPenduduk: number;
    lakiLaki: number;
    perempuan: number;
    rasioJK: number;
    periode: string;
  } | null;
  dokumen: {
    ektpCetak: number;
    ektpBelum: number;
    aktaLahir: number;
    aktaBelum: number;
    kiaMiliki: number;
    kiaBelum: number;
    cakupanAkta: number;
  } | null;
  blankoEKTP: {
    jumlahTersedia: number;
    keterangan: string | null;
  } | null;
}

// ── Helpers ──────────────────────────────────────────────────────────

const formatNumber = (num: number): string =>
  new Intl.NumberFormat("id-ID").format(num);

function getGreeting() {
  const now = new Date();
  const rawHour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Makassar",
    }).format(now),
    10,
  );
  const hour = rawHour === 24 ? 0 : rawHour;

  if (hour >= 5 && hour < 11) {
    return { text: "Selamat Pagi", Icon: Sun };
  }
  if (hour >= 11 && hour < 15) {
    return { text: "Selamat Siang", Icon: Sun };
  }
  if (hour >= 15 && hour < 18) {
    return { text: "Selamat Sore", Icon: Sunset };
  }
  return { text: "Selamat Malam", Icon: Moon };
}

function getWITAClock(): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Makassar",
    hour12: false,
  }).format(new Date());
}

function getOfficeStatus(): { isOpen: boolean; label: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Makassar",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const dayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  };
  const weekday = dayMap[parts.find((p) => p.type === "weekday")?.value ?? ""] ?? 0;
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);

  const isOpen = weekday >= 1 && weekday <= 5 && hour >= 8 && hour < 15;
  return {
    isOpen,
    label: isOpen ? "Sedang Buka" : "Tutup",
  };
}

// ── Animation variants ───────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};

// ── Quick action links ───────────────────────────────────────────────

const quickActions = [
  {
    label: "Persyaratan Layanan",
    href: "/layanan",
    Icon: FileText,
    description: "Daftar layanan yang tersedia",
  },
  {
    label: "Cek Status",
    href: "/layanan-online/cek-status",
    Icon: Search,
    description: "Lacak permohonan Anda",
  },
  {
    label: "Pengaduan",
    href: "/pengaduan",
    Icon: MessageSquare,
    description: "Sampaikan keluhan Anda",
  },
] as const;

// ── Component ────────────────────────────────────────────────────────

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting] = useState(getGreeting);
  const [clock, setClock] = useState(getWITAClock);
  const [officeStatus, setOfficeStatus] = useState(getOfficeStatus);

  // Live WITA clock + office status — update every second
  useEffect(() => {
    const tick = () => {
      setClock(getWITAClock());
      setOfficeStatus(getOfficeStatus());
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch beranda data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beranda");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching beranda data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.dispatchEvent(
        new CustomEvent("open-search-command", {
          detail: { query: searchQuery },
        }),
      );
      setSearchQuery("");
    }
  };

  const handleSearchInputFocus = () => {
    window.dispatchEvent(new CustomEvent("open-search-command"));
  };

  // ── Computed stats ────────────────────────────────────────────────
  const totalPenduduk = data?.ringkasan?.totalPenduduk ?? 0;
  const blankoTersedia = data?.blankoEKTP?.jumlahTersedia ?? 0;
  const blankoKeterangan = data?.blankoEKTP?.keterangan ?? null;

  const stats = [
    {
      label: "Jumlah Penduduk",
      value: formatNumber(totalPenduduk),
      sublabel: data?.ringkasan?.periode ?? null,
    },
    {
      label: "Blanko KTP Tersedia",
      value: formatNumber(blankoTersedia),
      sublabel: blankoKeterangan ?? null,
    },
  ];

  return (
    <section className="relative overflow-hidden text-white">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 via-green-800 to-green-900" />

      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* 1. Greeting + Live Clock */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
          >
            <span className="inline-flex items-center gap-1.5 text-sm text-green-200">
              <greeting.Icon className="h-4 w-4 text-amber-300" />
              <span>{greeting.text}</span>
            </span>
            <span className="hidden sm:inline text-green-300/40">|</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-green-200 font-mono tabular-nums">
              <Clock className="h-3.5 w-3.5" />
              {clock} WITA
            </span>
          </motion.div>

          {/* 2. Main Heading */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
              Disdukcapil Kabupaten Ngada
            </span>
          </motion.h1>

          {/* 3. Subtitle */}
          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-green-200/80 max-w-xl"
          >
            Portal Layanan Kependudukan &amp; Pencatatan Sipil
          </motion.p>

          {/* 4. Search Bar */}
          <motion.form
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSearch}
            className="w-full max-w-lg"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Cari layanan, berita, halaman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchInputFocus}
                className="h-12 pl-12 pr-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 shadow-lg shadow-black/20 focus:ring-2 focus:ring-emerald-400/50 cursor-pointer text-base"
                readOnly
              />
            </div>
            <p className="mt-2 text-xs text-green-300/50 hidden sm:block">
              Klik atau tekan{" "}
              <kbd className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
                Ctrl+K
              </kbd>{" "}
              untuk mencari
            </p>
          </motion.form>

          {/* 5. Quick Action Cards */}
          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl"
          >
            {quickActions.map(({ label, href, Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* 6. Stats Row */}
          <motion.div
            custom={0.55}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-green-300" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-lg mx-auto">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center sm:items-center py-3 px-4 rounded-2xl bg-white/10 border border-white/15"
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-sm sm:text-base text-green-200/80 mt-1 font-medium">
                      {stat.label}
                    </span>
                    {stat.sublabel && (
                      <span className="text-[11px] text-green-300/50 mt-0.5">
                        {stat.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 7. Office Hours Badge */}
          <motion.div
            custom={0.7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                {officeStatus.isOpen && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    officeStatus.isOpen ? "bg-green-400" : "bg-red-400"
                  }`}
                />
              </span>
              <span className="text-sm text-green-100">
                <span className="font-medium">{officeStatus.label}</span>
                <span className="text-green-200/60"> &middot; </span>
                <span className="text-green-200/80">
                  Sen&ndash;Jum 08:00&ndash;15:00 WITA
                </span>
              </span>
            </div>
          </motion.div>

          {/* 8. Quick Action Buttons (below fold, for mobile scroll) */}
          <motion.div
            custom={0.8}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 justify-center pt-2"
          >
            <Link href="/layanan">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-green-50 h-11 px-5 font-semibold shadow-md rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <FileText className="mr-2 h-4 w-4" />
                Lihat Persyaratan
              </Button>
            </Link>
            <Link href="/layanan-online">
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-emerald-700 h-11 px-5 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Layanan Online
              </Button>
            </Link>
            <Link href="/pengaduan">
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-emerald-700 h-11 px-5 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hidden sm:inline-flex"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ajukan Pengaduan
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade to content below */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-background" />
    </section>
  );
}
