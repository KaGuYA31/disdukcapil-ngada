"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, Building2 } from "lucide-react";

const quickInfoItems = [
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Sen-Kam 08:00-15:30 WITA",
    subValue: "Jum 08:00-16:00 WITA",
  },
  {
    icon: Users,
    label: "Total Penduduk",
    value: null,
    fallback: "171.027+",
    apiEndpoint: "/api/statistics/population",
  },
  {
    icon: MapPin,
    label: "Kecamatan",
    value: "12",
  },
  {
    icon: Building2,
    label: "Kelurahan/Desa",
    value: "206",
  },
];

export function QuickInfoBar() {
  const [populationData, setPopulationData] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopulation() {
      try {
        const res = await fetch("/api/statistics/population");
        if (res.ok) {
          const data = await res.json();
          if (data?.total) {
            setPopulationData(
              typeof data.total === "number"
                ? data.total.toLocaleString("id-ID") + "+"
                : data.total
            );
          }
        }
      } catch {
        // Silently fall back to default value
      }
    }
    fetchPopulation();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full bg-gradient-to-r from-teal-700 via-green-700 to-emerald-800 dark:from-teal-900 dark:via-green-900 dark:to-emerald-950 text-white overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="container mx-auto px-4 py-5 md:py-6 relative"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickInfoItems.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 bg-white/15 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 dark:group-hover:bg-white/15 transition-colors">
                <item.icon className="h-5 w-5 text-green-100 dark:text-green-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs uppercase tracking-wider text-green-200/80 dark:text-green-300/70 font-medium truncate">
                  {item.label}
                </p>
                <p className="text-sm md:text-base font-bold text-white dark:text-gray-100 truncate">
                  {item.apiEndpoint
                    ? populationData || item.fallback
                    : item.value}
                </p>
                {item.subValue && (
                  <p className="text-[11px] md:text-xs text-green-200/70 dark:text-green-300/60 hidden sm:block">
                    {item.subValue}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
