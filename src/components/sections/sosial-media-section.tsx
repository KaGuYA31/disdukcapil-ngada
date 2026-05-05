"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Phone,
  Mail,
  MessageCircle,
  Printer,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTACT_INFO, OPERATING_HOURS, LOCATION, SOCIAL_MEDIA } from "@/lib/constants";

// ─── Animation Variants ──────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const floatOrb = {
  animate: (i: number) => ({
    y: [0, -14, 0],
    x: [0, i % 2 === 0 ? 7 : -7, 0],
    scale: [1, 1.04, 1],
    opacity: [0.25, 0.45, 0.25],
    transition: {
      duration: 6 + i * 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: i * 0.6,
    },
  }),
};

// ─── Social Media Links ─────────────────────────────────────────────
const socialLinks = [
  {
    icon: Facebook,
    label: "Facebook",
    handle: "disdukcapilngada",
    href: SOCIAL_MEDIA.facebook,
    color: "hover:bg-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@disdukcapilngada",
    href: SOCIAL_MEDIA.instagram,
    color: "hover:bg-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: Youtube,
    label: "YouTube",
    handle: "@disdukcapilngada",
    href: SOCIAL_MEDIA.youtube,
    color: "hover:bg-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    handle: "@disdukcapilngada",
    href: SOCIAL_MEDIA.twitter,
    color: "hover:bg-gray-700",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
    textColor: "text-gray-700 dark:text-gray-300",
  },
];

// ─── Contact Cards ──────────────────────────────────────────────────
const contactCards = [
  {
    icon: Phone,
    label: "Telepon",
    value: CONTACT_INFO.phone,
    href: `tel:${CONTACT_INFO.phoneRaw}`,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT_INFO.whatsappDisplay,
    href: CONTACT_INFO.whatsappUrl,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Printer,
    label: "Fax",
    value: "(0382) 21073",
    href: `tel:${CONTACT_INFO.phoneRaw}`,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

// ─── Office Hours Schedule ──────────────────────────────────────────
const scheduleDays = [
  { day: "Senin", hours: "08:00 - 15:00", isOpen: true },
  { day: "Selasa", hours: "08:00 - 15:00", isOpen: true },
  { day: "Rabu", hours: "08:00 - 15:00", isOpen: true },
  { day: "Kamis", hours: "08:00 - 15:00", isOpen: true },
  { day: "Jumat", hours: "08:00 - 15:00", isOpen: true },
  { day: "Sabtu", hours: "Tutup", isOpen: false },
  { day: "Minggu", hours: "Tutup", isOpen: false },
];

// ─── Component ──────────────────────────────────────────────────────
export function SosialMediaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="sosial-media-title"
    >
      {/* Gradient Hero Banner */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-br from-green-700 via-green-800 to-teal-900" />
      {/* SVG Cross Pattern Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[120px] hero-banner-pattern opacity-[0.04]" />
      {/* Animated Gradient Orbs */}
      <motion.div
        custom={0}
        variants={floatOrb}
        initial="animate"
        animate="animate"
        className="absolute top-3 left-[18%] w-20 h-20 bg-green-400/20 rounded-full blur-2xl pointer-events-none"
      />
      <motion.div
        custom={1}
        variants={floatOrb}
        initial="animate"
        animate="animate"
        className="absolute top-8 right-[22%] w-16 h-16 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"
      />
      {/* Glassmorphism Icon Container */}
      <div className="absolute top-0 left-0 right-0 h-[120px] flex items-center justify-center pointer-events-none">
        <div className="bg-white/15 backdrop-blur-sm rounded-full border border-white/20 p-3 shadow-lg">
          <Share2 className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* Floating Decorative Shapes */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[6%] w-3 h-3 rounded-sm bg-green-300/25 dark:bg-green-500/10 rotate-12"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[55%] right-[5%] w-4 h-4 rounded-full bg-teal-300/20 dark:bg-teal-500/10"
      />
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-28 left-[10%] w-2.5 h-2.5 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10"
      />
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-40 right-[18%] w-3 h-3 rounded-sm bg-green-200/20 dark:bg-green-600/10 rotate-45"
      />
      <motion.div
        animate={{ y: [0, -5, 0], x: [0, -4, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-[42%] left-[3%] w-2 h-2 rounded-full bg-teal-200/15 dark:bg-teal-600/8"
      />

      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-50 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-teal-50 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12 mt-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Share2 className="h-4 w-4" />
            Terhubung Dengan Kami
          </span>
          <h2
            id="sosial-media-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2 animated-underline"
          >
            Media Sosial & Kontak
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Ikuti media sosial kami untuk informasi terbaru dan hubungi kami melalui berbagai kanal komunikasi
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Social Media Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-1"
          >
            <Card className="border-gray-200/60 dark:border-gray-700/50 shadow-lg shadow-green-500/5 h-full backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Media Sosial
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                  Ikuti akun resmi kami di berbagai platform
                </p>

                <div className="space-y-3">
                  {socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        custom={i}
                        variants={cardItem}
                        whileHover={{ x: 4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-200 group relative"
                        style={{ perspective: "800px" }}
                      >
                        {/* Pulsing glow ring behind icon on hover */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={`absolute inset-0 rounded-lg ${social.bgColor} animate-ping`} style={{ animationDuration: "2s" }} />
                        </div>
                        <div
                          className={`relative w-10 h-10 rounded-lg ${social.bgColor} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                        >
                          <Icon className={`h-5 w-5 ${social.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {social.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {social.handle}
                          </p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Hours Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid sm:grid-cols-2 gap-4"
            >
              {contactCards.map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    custom={i}
                    variants={cardItem}
                    whileHover={{ y: -3, scale: 1.02, rotateY: -2, rotateX: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="block"
                    style={{ perspective: "800px" }}
                  >
                    <div className="relative h-full">
                      {/* Gradient border reveal on hover */}
                      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Card className="border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/70 hover:border-green-300 dark:hover:border-green-700 relative">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl ${contact.bgColor} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`h-5 w-5 ${contact.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              {contact.label}
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                              {contact.value}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Office Hours + Map Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Office Hours */}
              <motion.div
                variants={fadeInUp}
                custom={4}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Card className="border-gray-200/60 dark:border-gray-700/50 shadow-sm h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/70">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Jam Pelayanan Kantor
                    </h3>
                    <div className="space-y-1.5">
                      {scheduleDays.map((item) => (
                        <div
                          key={item.day}
                          className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 last:border-0"
                        >
                          <span
                            className={`font-medium ${
                              item.isOpen
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {item.day}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 ${
                              item.isOpen
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            <span
                              className={`relative flex h-2 w-2 ${
                                item.isOpen
                                  ? ""
                                  : ""
                              }`}
                            >
                              {item.isOpen ? (
                                <>
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping" style={{ animationDuration: "3s" }} />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400" />
                                </>
                              ) : (
                                <>
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 animate-ping" style={{ animationDuration: "3s" }} />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400 dark:bg-red-500" />
                                </>
                              )}
                            </span>
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Badge className="mt-3 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 text-green-700 dark:text-green-400 hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30 text-[10px] gap-1 border border-green-200/50 dark:border-green-700/30">
                      <Clock className="h-3 w-3" />
                      {OPERATING_HOURS.weekdays.hours} WITA
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Map Thumbnail */}
              <motion.div
                variants={fadeInUp}
                custom={5}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <a
                  href={LOCATION.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="relative h-full group" style={{ perspective: "800px" }}>
                    {/* Animated gradient border frame */}
                    <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-50 group-hover:animate-pulse transition-opacity duration-500" />
                    <Card className="border-gray-200/60 dark:border-gray-700/50 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 h-full relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/80">
                      <div className="relative h-full min-h-[200px] bg-gray-100 dark:bg-gray-800">
                        {/* Map thumbnail */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                              <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Lihat di Peta
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {LOCATION.name}
                            </p>
                            <Badge className="mt-2 bg-green-600 text-white hover:bg-green-700 text-[10px] gap-1">
                              <ExternalLink className="h-2.5 w-2.5" />
                              Buka Google Maps
                            </Badge>
                          </div>
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300" />
                      </div>
                    </Card>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
