"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  IdCard,
  Users,
  Baby,
  Heart,
  Truck,
  Stamp,
  ScrollText,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Building2,
  FileCheck2,
  ArrowRight,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────
type FilterMode = "semua" | "online" | "offline";

interface ServiceItem {
  icon: LucideIcon;
  name: string;
  online: boolean;
  onlineTime: string;
  offlineTime: string;
  onlineReq: string;
  slug: string;
}

// ─── Service Data ─────────────────────────────────────────────────────
const services: ServiceItem[] = [
  {
    icon: IdCard,
    name: "Pembuatan KTP-el",
    online: true,
    onlineTime: "5-7 hari kerja",
    offlineTime: "3-5 hari kerja",
    onlineReq: "KTP lama, KK, Surat Pengantar RT/RW",
    slug: "/layanan/ktp-el",
  },
  {
    icon: Users,
    name: "Pembuatan Kartu Keluarga",
    online: false,
    onlineTime: "-",
    offlineTime: "3-5 hari kerja",
    onlineReq: "-",
    slug: "/layanan/kartu-keluarga",
  },
  {
    icon: Baby,
    name: "Akta Kelahiran",
    online: true,
    onlineTime: "3-5 hari kerja",
    offlineTime: "1-3 hari kerja",
    onlineReq: "Surat Kelahiran, KTP ortu, KK",
    slug: "/layanan/akta-kelahiran",
  },
  {
    icon: Heart,
    name: "Akta Kematian",
    online: true,
    onlineTime: "3-5 hari kerja",
    offlineTime: "1-3 hari kerja",
    onlineReq: "Surat Keterangan Kematian, KTP, KK",
    slug: "/layanan/akta-kematian",
  },
  {
    icon: Truck,
    name: "Pindah Domisili",
    online: true,
    onlineTime: "7-14 hari kerja",
    offlineTime: "5-10 hari kerja",
    onlineReq: "Surat Pindah, KTP, KK, SKCK",
    slug: "/layanan/pindah-penduduk",
  },
  {
    icon: Stamp,
    name: "Legalisir Dokumen",
    online: false,
    onlineTime: "-",
    offlineTime: "1-2 hari kerja",
    onlineReq: "-",
    slug: "/layanan/legalisasi",
  },
  {
    icon: ScrollText,
    name: "Surat Pindah",
    online: true,
    onlineTime: "5-7 hari kerja",
    offlineTime: "3-5 hari kerja",
    onlineReq: "KTP, KK, Surat Pengantar",
    slug: "/layanan/perubahan-data",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const filterContainerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.2 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const exitItem = {
  opacity: 0,
  y: -10,
  scale: 0.97,
  transition: { duration: 0.2 },
};

// ─── Filter Config ────────────────────────────────────────────────────
const filters: { key: FilterMode; label: string; icon: LucideIcon }[] = [
  { key: "semua", label: "Tampilkan Semua", icon: Layers },
  { key: "online", label: "Online Saja", icon: Globe },
  { key: "offline", label: "Offline Saja", icon: Building2 },
];

// ─── Component ────────────────────────────────────────────────────────
export function PerbandinganLayananSection() {
  const [activeFilter, setActiveFilter] = useState<FilterMode>("semua");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const filteredServices = services.filter((s) => {
    if (activeFilter === "online") return s.online;
    if (activeFilter === "offline") return true; // all services available offline
    return true;
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="perbandingan-layanan-title"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50 dark:bg-green-950/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-50 dark:bg-teal-950/20 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <FileCheck2 className="h-4 w-4" />
            Perbandingan Layanan
          </span>
          <h2
            id="perbandingan-layanan-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Layanan Online vs Offline
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Pilih cara yang paling nyaman untuk Anda
          </p>
        </motion.div>

        {/* Filter Toggle */}
        <motion.div
          variants={filterContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            {filters.map((filter) => {
              const FilterIcon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`
                    relative px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium
                    transition-colors duration-200 flex items-center gap-2
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="filter-bg"
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">
                      {filter.key === "semua" ? "Semua" : filter.key === "online" ? "Online" : "Offline"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Service Comparison Cards */}
        {/* Desktop: Table layout with sticky header */}
        {/* Mobile: Stacked cards */}
        <div className="max-w-5xl mx-auto">
          {/* Column Headers — Desktop only */}
          {activeFilter !== "offline" && activeFilter !== "online" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:grid md:grid-cols-[1fr_1fr_1fr] gap-4 mb-4 px-6"
            >
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Layanan
              </div>
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Online
              </div>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Offline
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-3"
            >
              {filteredServices.map((service) => {
                const Icon = service.icon;
                const showOnline = activeFilter === "semua" || activeFilter === "online";
                const showOffline = activeFilter === "semua" || activeFilter === "offline";

                return (
                  <motion.div
                    key={service.name}
                    variants={cardItem}
                    exit={exitItem}
                    layout
                    className="group"
                  >
                    <div className="
                      bg-white dark:bg-gray-900
                      border border-gray-200/80 dark:border-gray-700/50
                      rounded-2xl shadow-sm
                      hover:shadow-lg hover:shadow-green-500/5
                      hover:border-green-200 dark:hover:border-green-800/50
                      transition-all duration-300
                      overflow-hidden
                    ">
                      {/* Desktop Layout: 3-column row */}
                      <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr] gap-0">
                        {/* Service Name Column */}
                        <div className="flex items-center gap-4 p-5 pr-4 border-r border-gray-100 dark:border-gray-800">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/15 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                              {service.name}
                            </h3>
                          </div>
                        </div>

                        {/* Online Column */}
                        {(activeFilter === "semua" || activeFilter === "online") && (
                          <div className={`
                            p-5 border-r border-gray-100 dark:border-gray-800
                          `}>
                            {service.online ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                    Tersedia
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span>{service.onlineTime}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                  {service.onlineReq}
                                </p>
                                <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white gap-1.5 shadow-sm" asChild>
                                  <a href={service.slug}>
                                    Ajukan Sekarang
                                    <ArrowRight className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                  <span className="text-sm font-medium text-red-500 dark:text-red-400">
                                    Belum Tersedia
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  Silakan kunjungi kantor untuk layanan ini
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Offline Column */}
                        {(activeFilter === "semua" || activeFilter === "offline") && (
                          <div className="p-5">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
                                  Tersedia
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{service.offlineTime}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Kantor Disdukcapil Kab. Ngada
                              </p>
                              <Button size="sm" variant="outline" className="h-7 text-xs border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 gap-1.5" asChild>
                                <a href="/kontak">
                                  Kunjungi Kantor
                                  <Building2 className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Layout: Stacked card */}
                      <div className="md:hidden p-4 space-y-4">
                        {/* Service name */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/15 flex-shrink-0">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {service.name}
                          </h3>
                        </div>

                        {/* Online & Offline side by side on mobile */}
                        <div className={`
                          grid gap-3
                          ${showOnline && showOffline ? "grid-cols-2" : "grid-cols-1"}
                        `}>
                          {/* Online Card */}
                          {showOnline && (
                            <div className="rounded-xl bg-green-50/80 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 p-3 space-y-2">
                              <div className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
                                  Online
                                </span>
                              </div>
                              {service.online ? (
                                <>
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                      Tersedia
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {service.onlineTime}
                                  </div>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {service.onlineReq}
                                  </p>
                                  <Button size="sm" className="h-7 text-[11px] bg-green-600 hover:bg-green-700 text-white gap-1 w-full shadow-sm" asChild>
                                    <a href={service.slug}>
                                      Ajukan Sekarang
                                    </a>
                                  </Button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <XCircle className="h-4 w-4 text-red-400" />
                                  <span className="text-xs font-medium text-red-500 dark:text-red-400">
                                    Belum Tersedia
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Offline Card */}
                          {showOffline && (
                            <div className="rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 p-3 space-y-2">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                  Offline
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-teal-500" />
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
                                  Tersedia
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                {service.offlineTime}
                              </div>
                              <Button size="sm" variant="outline" className="h-7 text-[11px] border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 w-full" asChild>
                                <a href="/kontak">
                                  Kunjungi Kantor
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Summary Footer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 text-xs font-medium">
                {services.filter((s) => s.online).length} layanan online
              </Badge>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-medium">
                {services.length} layanan offline
              </Badge>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Semua layanan kependudukan gratis sesuai UU No. 24 Tahun 2013
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
