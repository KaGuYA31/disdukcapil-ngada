"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Bus,
  Building2,
  ExternalLink,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTACT_INFO, OPERATING_HOURS, LOCATION } from "@/lib/constants";

// ─── Animation Variants ────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.3 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.4 + i * 0.1, ease: "easeOut" as const },
  }),
};

// ─── Data ──────────────────────────────────────────────────────────────

const transportOptions = [
  {
    icon: Bus,
    title: "Kendaraan Umum",
    description: "Angkutan kota jurusan Bajawa Kota, turun di depan Kantor Bupati Ngada",
  },
  {
    icon: Navigation,
    title: "Kendaraan Pribadi",
    description: "Dari arah Bandara Bajawa (Soa) sekitar 25 menit, dari arah Ende sekitar 3 jam",
  },
  {
    icon: Building2,
    title: "Landmark Terdekat",
    description: "Berada di sebelah barat Kantor Bupati Ngada, dekat dengan Alun-Alun Bajawa",
  },
];

const nearbyLandmarks = [
  "Kantor Bupati Ngada",
  "Alun-Alun Bajawa",
  "Gereja Katedral Bajawa",
  "Pasar Tradisional Bajawa",
  "Polres Ngada",
  "RSUD Ngada",
];

// ─── Component ─────────────────────────────────────────────────────────

export function PetaLokasiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${LOCATION.coordinates.longitude - 0.008}%2C${LOCATION.coordinates.latitude - 0.005}%2C${LOCATION.coordinates.longitude + 0.008}%2C${LOCATION.coordinates.latitude + 0.005}&layer=mapnik&marker=${LOCATION.coordinates.latitude}%2C${LOCATION.coordinates.longitude}`;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      aria-labelledby="peta-lokasi-title"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            Lokasi Kantor
          </span>
          <h2
            id="peta-lokasi-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Peta Lokasi Interaktif
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Temukan lokasi kantor Disdukcapil Kabupaten Ngada dan informasi
            akses transportasi untuk memudahkan kunjungan Anda
          </p>
        </motion.div>

        {/* Main Content - Map + Info */}
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Map Column */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden border-gray-200/80 dark:border-gray-700/50 shadow-lg shadow-green-500/5 h-full">
              <CardContent className="p-0">
                {/* Map iframe */}
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-gray-100 dark:bg-gray-800">
                  <iframe
                    title="Lokasi Kantor Disdukcapil Kabupaten Ngada"
                    src={mapSrc}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Map overlay badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-green-600 text-white hover:bg-green-700 shadow-md text-xs gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {LOCATION.name}
                    </Badge>
                  </div>
                </div>

                {/* Map controls */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      asChild
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      <a
                        href={LOCATION.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-4 w-4" />
                        Buka di Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 gap-2 text-sm"
                    >
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${LOCATION.coordinates.latitude}&mlon=${LOCATION.coordinates.longitude}#map=17/${LOCATION.coordinates.latitude}/${LOCATION.coordinates.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4" />
                        Buka di OpenStreetMap
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Column */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-4"
          >
            {/* Office Info Card */}
            <Card className="border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      {LOCATION.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Dinas Kependudukan dan Pencatatan Sipil
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Alamat
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {CONTACT_INFO.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Telepon
                      </p>
                      <a
                        href={`tel:${CONTACT_INFO.phoneRaw}`}
                        className="text-xs text-green-600 dark:text-green-400 hover:underline"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-xs text-green-600 dark:text-green-400 hover:underline"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start gap-2.5">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Jam Operasional
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {OPERATING_HOURS.fullText}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport Info Card */}
            <Card className="border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Cara Menuju Kantor
                </h3>
                <div className="space-y-3">
                  {transportOptions.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        custom={i}
                        variants={staggerItem}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Landmarks */}
            <Card className="border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Landmark Terdekat
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {nearbyLandmarks.map((landmark) => (
                    <Badge
                      key={landmark}
                      variant="outline"
                      className="text-[11px] px-2 py-0.5 font-normal text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      {landmark}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
