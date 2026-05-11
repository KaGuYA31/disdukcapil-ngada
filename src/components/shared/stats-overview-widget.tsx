"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  MapPin,
  Building,
  Newspaper,
  Shield,
} from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ──────────────────────────────────────────────────────────
interface BerandaData {
  totalPenduduk?: number;
  totalLayanan?: number;
  totalKecamatan?: number;
  totalKelurahan?: number;
  totalBerita?: number;
  totalFormulir?: number;
  blankoEKTP?: { tersedia: number; total: number } | null;
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  iconColor: string;
  iconBg: string;
  counterColor: "green" | "amber" | "teal" | "rose" | "blue" | "emerald";
}

// ─── Fallback Values ───────────────────────────────────────────────
const FALLBACK: BerandaData = {
  totalPenduduk: 171027,
  totalLayanan: 19,
  totalKecamatan: 12,
  totalKelurahan: 206,
  totalBerita: 3,
  totalFormulir: 27,
};

// ─── Component ─────────────────────────────────────────────────────
export function StatsOverviewWidget({
  variant = "footer",
}: {
  variant?: "footer" | "sidebar";
}) {
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/beranda");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Silently fall back to defaults
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const d = data ?? FALLBACK;

  const stats: StatItem[] = [
    {
      icon: Users,
      value: d.totalPenduduk ?? FALLBACK.totalPenduduk!,
      label: "Penduduk",
      iconColor: "text-green-400",
      iconBg: "bg-green-500/15",
      counterColor: "green",
    },
    {
      icon: FileText,
      value: d.totalLayanan ?? FALLBACK.totalLayanan!,
      label: "Layanan",
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/15",
      counterColor: "teal",
    },
    {
      icon: Building,
      value: d.totalKecamatan ?? FALLBACK.totalKecamatan!,
      label: "Kecamatan",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15",
      counterColor: "amber",
    },
    {
      icon: MapPin,
      value: d.totalKelurahan ?? FALLBACK.totalKelurahan!,
      label: "Kelurahan/Desa",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15",
      counterColor: "emerald",
    },
    {
      icon: Newspaper,
      value: d.totalBerita ?? FALLBACK.totalBerita!,
      label: "Berita",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15",
      counterColor: "blue",
    },
    {
      icon: Shield,
      value: d.totalFormulir ?? FALLBACK.totalFormulir!,
      label: "Formulir",
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/15",
      counterColor: "rose",
    },
  ];

  // ─── Loading Skeleton ──────────────────────────────────────────
  if (loading) {
    if (variant === "sidebar") {
      return (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
            >
              <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30"
          >
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-700/50 flex-shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-14 bg-gray-700/50" />
              <Skeleton className="h-3 w-10 bg-gray-700/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Sidebar Variant (vertical list) ──────────────────────────
  if (variant === "sidebar") {
    return (
      <div className="space-y-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-sm transition-shadow duration-200"
            >
              <div
                className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <AnimatedCounter
                  value={stat.value}
                  size="sm"
                  color={stat.counterColor}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── Footer Variant (compact horizontal grid) ─────────────────
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors duration-200 group"
          >
            <div
              className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
            >
              <Icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <AnimatedCounter
                value={stat.value}
                size="sm"
                color={stat.counterColor}
              />
              <p className="text-[11px] text-gray-400 truncate mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
