"use client";

import Link from "next/link";
import { useRef } from "react";
import { Phone, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as const },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" as const },
  }),
};

const contactItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.4 + i * 0.1, ease: "easeOut" as const },
  }),
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

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-green-700 to-green-900 text-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.h2
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-3xl md:text-4xl font-bold"
            >
              Butuh Bantuan atau Informasi Lebih Lanjut?
            </motion.h2>
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
              className="text-green-100 dark:text-green-300 text-lg mt-4 max-w-xl mx-auto lg:mx-0"
            >
              Tim kami siap membantu Anda dengan berbagai pertanyaan seputar
              layanan administrasi kependudukan. Jangan ragu untuk menghubungi
              kami.
            </motion.p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
              <motion.div
                custom={0}
                variants={buttonVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Link href="/pengaduan">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold shadow-lg shadow-yellow-500/20 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-gray-900"
                  >
                    Ajukan Pengaduan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                custom={1}
                variants={buttonVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Link href="/profil#lokasi">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/60 text-white hover:bg-white/10 hover:border-white dark:border-green-300/40 dark:text-green-100 dark:hover:bg-green-400/10 dark:hover:border-green-300/60"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Lokasi Kantor
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                custom={2}
                variants={buttonVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg shadow-green-500/20 dark:bg-green-400 dark:hover:bg-green-500 dark:text-gray-900 dark:shadow-green-400/20"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Kami
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Content - Contact Info */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/15 shadow-xl shadow-black/10 dark:bg-gray-800/30 dark:border-gray-700/50">
              <h3 className="font-semibold text-xl mb-6 dark:text-gray-100">Informasi Kontak</h3>
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={contactItemVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-2 -m-2 rounded-xl transition-colors hover:bg-white/5 dark:hover:bg-gray-700/30 cursor-default"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-gray-700/40">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-gray-100">{item.label}</p>
                      <p className="text-green-100 dark:text-green-300 text-sm mt-1">
                        {item.value}
                        {item.value2 && <br />}
                        {item.value2}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
