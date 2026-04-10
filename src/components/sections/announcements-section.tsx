"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, Info, Wrench, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// TypeScript interface for announcement items
interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
}

// Hardcoded fallback data
const fallbackAnnouncements: AnnouncementItem[] = [
  {
    id: "1",
    title: "Jadwal Pelayanan Bulan Ini",
    content:
      "Pelayanan Disdukcapil Ngada beroperasi sesuai jadwal: Senin-Kamis 08.00-15.30 WITA, Jumat 08.00-16.00 WITA.",
    type: "Info",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Pembaharuan Sistem Database",
    content:
      "Akan dilakukan pemeliharaan sistem pada tanggal 20 Januari 2024 pukul 22.00-06.00 WITA. Mohon pengertiannya.",
    type: "Maintenance",
    date: "2024-01-12",
  },
  {
    id: "3",
    title: "Pendaftaran KTP-el Gratis",
    content:
      "Pendaftaran KTP-el untuk pertama kali GRATIS. Pastikan membawa berkas lengkap untuk mempercepat proses.",
    type: "Info",
    date: "2024-01-10",
  },
];

// Map database type to display type
const mapType = (dbType: string): string => {
  const lower = dbType.toLowerCase();
  if (lower === "urgent") return "Urgent";
  if (lower === "maintenance") return "Maintenance";
  return "Info";
};

// Map database record to AnnouncementItem
const mapApiToAnnouncement = (record: {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}): AnnouncementItem => ({
  id: record.id,
  title: record.title,
  content: record.content,
  type: mapType(record.type),
  date: new Date(record.createdAt).toISOString(),
});

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return AlertTriangle;
    case "maintenance":
      return Wrench;
    default:
      return Info;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return {
        badge: "bg-red-100 text-red-700",
        icon: "text-red-600",
        iconBg: "bg-red-50",
        border: "border-l-red-500",
        borderHover: "hover:border-l-red-600",
      };
    case "maintenance":
      return {
        badge: "bg-amber-100 text-amber-700",
        icon: "text-amber-600",
        iconBg: "bg-amber-50",
        border: "border-l-amber-500",
        borderHover: "hover:border-l-amber-600",
      };
    default:
      return {
        badge: "bg-green-100 text-green-700",
        icon: "text-green-600",
        iconBg: "bg-green-50",
        border: "border-l-green-500",
        borderHover: "hover:border-l-green-600",
      };
  }
};

// Animation variants
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2 + i * 0.1,
      ease: "easeOut",
    },
  }),
};

function AnnouncementsLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="border-l-4 border-l-gray-300 overflow-hidden"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnnouncementsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  const fetchAnnouncements = useCallback(async () => {
    // Abort previous request if any
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await fetch("/api/pengumuman?limit=5", {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map(mapApiToAnnouncement);
        setAnnouncements(mapped);
      } else {
        // Empty or unsuccessful — use fallback
        setAnnouncements(fallbackAnnouncements);
      }
    } catch (err) {
      // AbortError or network error — silently use fallback
      if (err instanceof DOMException && err.name === "AbortError") return;
      setAnnouncements(fallbackAnnouncements);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchAnnouncements]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <Bell className="h-4 w-4" />
            Pengumuman
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Informasi Penting
          </h2>
          <p className="text-gray-600 mt-4">
            Pengumuman dan informasi penting seputar layanan Disdukcapil
            Kabupaten Ngada.
          </p>
        </motion.div>

        {/* Announcements List */}
        {loading ? (
          <AnnouncementsLoadingSkeleton />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {announcements.map((announcement, index) => {
              const colors = getTypeColor(announcement.type);
              const Icon = getTypeIcon(announcement.type);

              return (
                <motion.div
                  key={announcement.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <Card
                    className={`border-l-4 ${colors.border} ${colors.borderHover} 
                      shadow-sm hover:shadow-md hover:-translate-y-0.5
                      transition-all duration-300
                      bg-gradient-to-r from-white to-gray-50/50
                      hover:from-white hover:to-green-50/40
                      overflow-hidden`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}
                          >
                            <Icon
                              className={`h-5 w-5 ${colors.icon}`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {announcement.title}
                            </CardTitle>
                            <CardDescription>
                              {new Date(
                                announcement.date
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={colors.badge}>
                          {announcement.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* See All Link */}
        {loading ? (
          <div className="flex justify-center mt-8">
            <Skeleton className="h-10 w-56 rounded-lg" />
          </div>
        ) : (
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex justify-center mt-8"
          >
            <Link href="/pengaduan">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 font-medium"
              >
                Lihat Semua Pengumuman
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
