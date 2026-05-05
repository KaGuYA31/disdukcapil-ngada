"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CreditCard,
  Users,
  Baby,
  HeartCrack,
  ArrowRightLeft,
  Stamp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Animation Variants ──────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Service Data ───────────────────────────────────────────────────
const featuredServices = [
  {
    icon: CreditCard,
    title: "KTP-el",
    description:
      "Pembuatan dan pembaruan Kartu Tanda Penduduk Elektronik untuk seluruh warga yang telah berusia 17 tahun.",
    href: "/layanan",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    icon: Users,
    title: "Kartu Keluarga (KK)",
    description:
      "Pembuatan, pembaruan, dan perubahan data Kartu Keluarga sesuai dengan kondisi terkini.",
    href: "/layanan",
    gradient: "from-teal-500 to-cyan-600",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  {
    icon: Baby,
    title: "Akta Lahir",
    description:
      "Penerbitan Akta Kelahiran untuk setiap kelahiran yang dilaporkan dalam waktu 60 hari.",
    href: "/layanan",
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    icon: HeartCrack,
    title: "Akta Kematian",
    description:
      "Penerbitan Akta Kematian yang diperlukan untuk keperluan administrasi waris dan pensiun.",
    href: "/layanan",
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    icon: ArrowRightLeft,
    title: "Pindah Domisili",
    description:
      "Layanan pemindahan penduduk antar kecamatan/kabupaten/kota dengan proses yang mudah dan cepat.",
    href: "/layanan",
    gradient: "from-teal-500 to-green-600",
    iconBg: "bg-gradient-to-br from-teal-500 to-green-600",
  },
  {
    icon: Stamp,
    title: "Legalisir Dokumen",
    description:
      "Layanan pengesahan dan legalisir dokumen kependudukan untuk berbagai keperluan administratif.",
    href: "/layanan",
    gradient: "from-green-600 to-teal-600",
    iconBg: "bg-gradient-to-br from-green-600 to-teal-600",
  },
];

// ─── Component ──────────────────────────────────────────────────────
export function PromosiLayananSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      aria-labelledby="promosi-layanan-title"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Layanan Unggulan
          </span>
          <h2
            id="promosi-layanan-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Layanan Populer Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Layanan administrasi kependudukan yang paling sering digunakan masyarakat Kabupaten Ngada — gratis dan mudah diakses
          </p>
        </motion.div>

        {/* Service Cards — Horizontal scrollable on mobile, grid on desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent"
        >
          {featuredServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardItem}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-[280px] md:w-auto snap-start"
              >
                <Card className="relative border-gray-200/80 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:shadow-green-500/10 transition-shadow duration-300 h-full overflow-hidden group bg-white dark:bg-gray-900">
                  {/* GRATIS Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-green-500 text-white hover:bg-green-600 text-[10px] font-bold tracking-wider shadow-md">
                      GRATIS
                    </Badge>
                  </div>

                  <CardContent className="p-5 pt-4">
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      {/* Glow effect on hover */}
                      <div
                        className={`absolute inset-0 rounded-2xl ${service.iconBg} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                      />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* CTA Link */}
                    <a
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group/link"
                    >
                      Lihat Detail
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile scroll hint */}
        <div className="md:hidden flex items-center justify-center mt-4 gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>Geser untuk melihat lebih banyak</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </section>
  );
}
