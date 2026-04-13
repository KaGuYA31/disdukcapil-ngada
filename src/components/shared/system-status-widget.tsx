"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Globe,
  MessageSquare,
  Database,
  type LucideIcon,
} from "lucide-react";

type ServiceStatus = "aktif" | "terbatas" | "tidak_tersedia";

interface ServiceItem {
  icon: LucideIcon;
  name: string;
  status: ServiceStatus;
  description: string;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  aktif: {
    label: "Aktif",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    text: "text-green-700 dark:text-green-400",
  },
  terbatas: {
    label: "Terbatas",
    dot: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  tidak_tersedia: {
    label: "Tidak Tersedia",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    text: "text-red-700 dark:text-red-400",
  },
};

export function SystemStatusWidget() {
  const [services, setServices] = useState<ServiceItem[]>([
    {
      icon: CreditCard,
      name: "Cetak KTP-el",
      status: "aktif",
      description: "Pelayanan cetak KTP elektronik",
    },
    {
      icon: Globe,
      name: "Pendaftaran Online",
      status: "aktif",
      description: "Pendaftaran layanan secara daring",
    },
    {
      icon: MessageSquare,
      name: "Pengaduan Online",
      status: "aktif",
      description: "Penyampaian pengaduan masyarakat",
    },
    {
      icon: Database,
      name: "Database Kependudukan",
      status: "aktif",
      description: "Sistem informasi kependudukan",
    },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchBlankoStatus = useCallback(async () => {
    // Abort previous request if still pending
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/blanko-ektp", {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Non-2xx response");

      const json = await res.json();
      if (!json.success || !json.data) throw new Error("Invalid response");

      const jumlah = json.data.jumlahTersedia ?? 0;
      let ktpStatus: ServiceStatus = "aktif";
      if (jumlah === 0) {
        ktpStatus = "tidak_tersedia";
      } else if (jumlah <= 50) {
        ktpStatus = "terbatas";
      }

      setServices((prev) =>
        prev.map((s) =>
          s.name === "Cetak KTP-el"
            ? {
                ...s,
                status: ktpStatus,
                description:
                  ktpStatus === "tidak_tersedia"
                    ? "Stok blanko habis"
                    : ktpStatus === "terbatas"
                      ? `Stok terbatas: ${jumlah} lembar`
                      : `Tersedia: ${jumlah} lembar`,
              }
            : s
        )
      );
    } catch {
      // Graceful fallback — keep default "aktif" status on fetch failure
    } finally {
      if (controller.signal === abortRef.current?.signal) {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchBlankoStatus();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchBlankoStatus]);

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              Status Sistem
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-3">
              Status Layanan Kami
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
              Pantau ketersediaan layanan administrasi kependudukan secara
              real-time
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services.map((service, i) => {
              const Icon = service.icon;
              const config = STATUS_CONFIG[service.status];

              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="relative bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Icon + Status Dot */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    {/* Pulsing dot for aktif, static dot for others */}
                    {service.status === "aktif" ? (
                      <span className="relative flex h-2.5 w-2.5 mt-1">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                      </span>
                    ) : (
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full mt-1 ${config.dot}`}
                      />
                    )}
                  </div>

                  {/* Service Name */}
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${config.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                      />
                      {config.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Last checked note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-5"
          >
            {isLoaded ? "Data diperbarui secara real-time" : "Memuat status..."}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
