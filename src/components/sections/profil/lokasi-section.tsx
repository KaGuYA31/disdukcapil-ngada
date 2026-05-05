"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, ExternalLink, MapPinned, Building2, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO, LOCATION, OPERATING_HOURS } from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface InfoItem {
  icon: typeof MapPin;
  label: string;
  value: string;
  subValue?: string;
  subValueClass?: string;
  iconBg: string;
  iconColor: string;
  href?: string;
  hrefLabel?: string;
}

const infoItems: InfoItem[] = [
  {
    icon: MapPin,
    label: "Alamat",
    value: LOCATION.address,
    subValue: `${LOCATION.regency} ${LOCATION.postalCode}`,
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: CONTACT_INFO.phone,
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    href: `tel:+${CONTACT_INFO.phoneRaw}`,
    hrefLabel: "Hubungi Sekarang",
  },
  {
    icon: Clock,
    label: "Jam Pelayanan",
    value: `${OPERATING_HOURS.weekdays.days}: ${OPERATING_HOURS.weekdays.hours}`,
    subValue: "Sabtu - Minggu: Tutup",
    subValueClass: "",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Navigation,
    label: "Arahkan di Maps",
    value: LOCATION.name,
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    href: LOCATION.googleMapsUrl,
    hrefLabel: "Buka Google Maps",
  },
];

export function LokasiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="lokasi" ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider"
          >
            <MapPin className="h-4 w-4" />
            Lokasi
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Lokasi Kantor
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-400 mt-4">
            Kunjungi kantor kami untuk mendapatkan layanan langsung dengan ramah dan cepat
          </motion.p>
        </motion.div>

        {/* Google Maps Embed */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="max-w-6xl mx-auto w-full"
        >
          {/* Animated gradient map frame */}
          <div className="relative group">
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-green-400 via-teal-500 to-green-600 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-[1px] rounded-2xl bg-white dark:bg-gray-950" />
            <div className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://maps.google.com/maps?q=-8.8489,121.0731&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kantor Disdukcapil Kabupaten Ngada"
                className="w-full h-full"
              />
            </div>

            {/* Floating info badges around the map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -top-3 -left-3 md:top-4 md:-left-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2 z-10"
            >
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <MapPinned className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Disdukcapil</p>
                <p className="text-[10px] text-gray-500">Kab. Ngada</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="absolute -bottom-3 -right-3 md:bottom-4 md:-right-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2 z-10"
            >
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Buka</p>
                <p className="text-[10px] text-gray-500">Sen-Jum</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="hidden md:flex absolute top-4 -right-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 items-center gap-2 z-10"
            >
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">WiFi</p>
                <p className="text-[10px] text-gray-500">Tersedia</p>
              </div>
            </motion.div>
          </div>

          {/* Open in Google Maps Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 flex justify-center"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg shadow-green-200/50 dark:shadow-green-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <a
                href={LOCATION.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4" />
                Buka di Google Maps
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {infoItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.div key={item.label} variants={cardVariants}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border-gray-200 dark:border-gray-700 h-full hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon Badge */}
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                          className={`w-11 h-11 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
                        </motion.div>
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {item.label}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                            {item.value}
                          </p>
                          {item.subValue && (
                            <p
                              className={`text-sm mt-0.5 ${item.subValueClass || "text-gray-500 dark:text-gray-500"}`}
                            >
                              {item.subValue}
                            </p>
                          )}
                          {item.href && item.hrefLabel && (
                            <a
                              href={item.href}
                              target={
                                item.href.startsWith("http") ? "_blank" : undefined
                              }
                              rel={
                                item.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium hover:text-green-700 dark:hover:text-green-300 hover:underline mt-2"
                            >
                              {item.hrefLabel}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Saturday/Sunday closed notice */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="mt-6 max-w-6xl mx-auto"
        >
          <p className="text-center text-sm text-red-500 dark:text-red-400">
            {OPERATING_HOURS.saturday.days} & {OPERATING_HOURS.sunday.days}:{" "}
            {OPERATING_HOURS.saturday.hours}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
