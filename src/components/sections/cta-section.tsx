"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  FileText,
  Users,
  Quote,
  Star,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO, OPERATING_HOURS } from "@/lib/constants";

// Animation variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const floatVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const contactItems = [
  {
    icon: MapPin,
    label: "Alamat",
    value: CONTACT_INFO.address,
  },
  {
    icon: Phone,
    label: "Telepon",
    value: CONTACT_INFO.phone,
  },
  {
    icon: Clock,
    label: "Jam Pelayanan",
    value: `${OPERATING_HOURS.weekdays.days}: ${OPERATING_HOURS.weekdays.hours}`,
  },
];

const actionCards = [
  {
    icon: FileText,
    title: "Cek Status Layanan",
    description: "Pantau progres pengajuan dokumen Anda secara real-time",
    href: "/layanan-online",
    gradient: "from-green-400 to-emerald-500",
    bgGlow: "group-hover:shadow-green-500/20",
  },
  {
    icon: Users,
    title: "Ajukan Pengaduan",
    description: "Sampaikan keluhan atau saran untuk pelayanan yang lebih baik",
    href: "/pengaduan",
    gradient: "from-amber-400 to-yellow-500",
    bgGlow: "group-hover:shadow-amber-500/20",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Kami",
    description: "Hubungi langsung via WhatsApp untuk respons cepat",
    href: CONTACT_INFO.whatsappUrl,
    external: true,
    gradient: "from-teal-400 to-cyan-500",
    bgGlow: "group-hover:shadow-teal-500/20",
  },
];

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900">
        {/* Mesh gradient blobs */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-green-500/30 blur-[100px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/25 blur-[100px]"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-yellow-400/15 blur-[100px]"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[30%] w-[35%] h-[35%] rounded-full bg-emerald-400/20 blur-[100px]"
          animate={{
            x: [0, -15, 20, 0],
            y: [0, 15, -25, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </div>

      {/* Cross-hatch pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative shapes */}
      <motion.div
        variants={floatVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute top-[10%] right-[8%] w-16 h-16 border border-white/10 rounded-2xl rotate-12 pointer-events-none"
      />
      <motion.div
        className="absolute bottom-[15%] left-[5%] w-12 h-12 border border-white/10 rounded-full pointer-events-none"
        animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[50%] left-[12%] w-8 h-8 bg-yellow-400/10 rounded-lg rotate-45 pointer-events-none"
        animate={{ y: [0, -12, 0], rotate: [45, 60, 45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[25%] right-[12%] w-6 h-6 bg-green-300/10 rounded-full pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Star decorations */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${15 + i * 18}%`,
            left: `${5 + i * 22}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: i * 0.7,
          }}
        >
          <Star className="h-3 w-3 text-yellow-400/30" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div
            variants={textVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6 border border-white/10"
          >
            <Phone className="h-4 w-4 text-green-300" />
            <span className="text-green-100">Siap Melayani Anda</span>
          </motion.div>

          <motion.h2
            variants={textVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            Butuh Bantuan atau{" "}
            <span className="text-yellow-400">Informasi</span>{" "}
            Lebih Lanjut?
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-green-100/80 dark:text-green-300 text-lg mt-4 max-w-2xl mx-auto"
          >
            Tim kami siap membantu Anda dengan berbagai pertanyaan seputar
            layanan administrasi kependudukan. Jangan ragu untuk menghubungi kami.
          </motion.p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
        >
          {actionCards.map((card) => {
            const Icon = card.icon;
            const content = (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative bg-white/[0.08] backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/[0.12] shadow-xl shadow-black/10 hover:bg-white/[0.12] hover:shadow-2xl ${card.bgGlow} transition-all duration-500 cursor-pointer overflow-hidden h-full`}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Glass shine */}
                <div className="absolute top-0 right-0 w-1/2 h-24 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-green-100/70 text-sm leading-relaxed mb-5">
                    {card.description}
                  </p>

                  {/* Action link */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-yellow-300 transition-colors duration-300">
                    <span>{card.external ? "Hubungi Sekarang" : "Selengkapnya"}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            );

            if (card.external) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }
            return (
              <Link key={card.title} href={card.href}>
                {content}
              </Link>
            );
          })}
        </motion.div>

        {/* Testimonial from Kepala Dinas */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={cardVariants}
            className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/[0.1] overflow-hidden"
          >
            {/* Background decorative */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/5 via-transparent to-green-400/5 pointer-events-none" />

            {/* Quote icon */}
            <div className="absolute top-6 right-8 opacity-10 pointer-events-none">
              <Quote className="h-24 w-24 text-yellow-400" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar placeholder */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center ring-4 ring-white/10 shadow-xl">
                  <Users className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
              </div>

              {/* Quote content */}
              <div className="flex-1 text-center md:text-left">
                {/* Stars */}
                <div className="flex items-center gap-1 justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-white/90 font-medium leading-relaxed italic">
                  &ldquo;Kami berkomitmen untuk melayani masyarakat Kabupaten Ngada
                  dengan penuh integritas, kecepatan, dan transparansi. Setiap dokumen
                  kependudukan yang kami kelola adalah cerminan hak asasi warga negara
                  yang harus kita jaga bersama.&rdquo;
                </blockquote>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
                  <div>
                    <p className="font-bold text-white text-lg">Kepala Disdukcapil</p>
                    <p className="text-green-200/70 text-sm">Kabupaten Ngada, NTT</p>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/20" />
                  <div>
                    <p className="text-green-200/60 text-xs uppercase tracking-wider font-medium">
                      Dinas Kependudukan
                    </p>
                    <p className="text-green-200/60 text-xs uppercase tracking-wider font-medium">
                      dan Pencatatan Sipil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Info & Quick Actions */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-8"
        >
          {/* Contact Info Card */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/[0.08] backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/[0.12] shadow-xl shadow-black/10 h-full">
              <h3 className="font-semibold text-xl mb-6 text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-300" />
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-3 -m-3 rounded-xl transition-colors hover:bg-white/5 cursor-default"
                  >
                    <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{item.label}</p>
                      <p className="text-green-100/70 text-sm mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick action buttons */}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link href="/profil#lokasi" className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Lokasi Kantor
                  </Button>
                </Link>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Office Hours Quick Reference */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/[0.08] backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/[0.12] shadow-xl shadow-black/10 h-full">
              <h3 className="font-semibold text-xl mb-6 text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                Jam Operasional
              </h3>

              {/* Weekly schedule visual */}
              <div className="space-y-3">
                {[
                  { day: "Senin – Jumat", hours: "08:00 – 15:00 WITA", isOpen: true },
                  { day: "Sabtu", hours: "Tutup", isOpen: false },
                  { day: "Minggu", hours: "Tutup", isOpen: false },
                ].map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          schedule.isOpen ? "bg-green-400" : "bg-red-400/60"
                        }`}
                      />
                      <span className="text-white text-sm font-medium">{schedule.day}</span>
                    </div>
                    <span
                      className={`text-sm font-mono ${
                        schedule.isOpen
                          ? "text-green-300"
                          : "text-red-300/60"
                      }`}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>

              {/* Break time notice */}
              <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-200 text-sm font-medium">Jam Istirahat</p>
                    <p className="text-amber-200/70 text-xs mt-0.5">
                      12:00 – 13:00 WITA (Senin – Jumat)
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <p className="text-green-200/40 text-xs mt-4">
                * Jadwal dapat berubah pada hari libur nasional atau kegiatan khusus
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
