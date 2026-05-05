"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, ExternalLink } from "lucide-react";
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
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: CONTACT_INFO.phone,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    href: `tel:+${CONTACT_INFO.phoneRaw}`,
    hrefLabel: "Hubungi Sekarang",
  },
  {
    icon: Clock,
    label: "Jam Pelayanan",
    value: `${OPERATING_HOURS.weekdays.days}: ${OPERATING_HOURS.weekdays.hours}`,
    subValue: "Sabtu - Minggu: Tutup",
    subValueClass: "",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Navigation,
    label: "Arahkan di Maps",
    value: LOCATION.name,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    href: LOCATION.googleMapsUrl,
    hrefLabel: "Buka Google Maps",
  },
];

export function LokasiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="lokasi" ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
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
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Lokasi Kantor
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
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
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
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

          {/* Open in Google Maps Button */}
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors"
            >
              <a
                href={LOCATION.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Buka di Google Maps
              </a>
            </Button>
          </div>
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
                <Card className="border-gray-200 h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon Badge */}
                      <div
                        className={`w-11 h-11 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {item.label}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                          {item.value}
                        </p>
                        {item.subValue && (
                          <p
                            className={`text-sm mt-0.5 ${item.subValueClass || "text-gray-500"}`}
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
                            className="inline-flex items-center gap-1 text-green-600 text-xs font-medium hover:text-green-700 hover:underline mt-2"
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
          <p className="text-center text-sm text-red-500">
            {OPERATING_HOURS.saturday.days} & {OPERATING_HOURS.sunday.days}:{" "}
            {OPERATING_HOURS.saturday.hours}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
