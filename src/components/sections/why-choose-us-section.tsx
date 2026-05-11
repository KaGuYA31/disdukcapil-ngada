"use client";

import { useRef } from "react";
import { Award, Shield, Zap, Heart, MapPin, Quote } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface TrustCard {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  stat: string;
}

const trustCards: TrustCard[] = [
  {
    id: 1,
    icon: Shield,
    title: "Layanan Profesional",
    description:
      "Tim kami terlatih dan bersertifikat dalam pelayanan administrasi kependudukan",
    stat: "98% Tingkat Kepuasan",
  },
  {
    id: 2,
    icon: Zap,
    title: "Proses Cepat",
    description:
      "Pengurusan dokumen dalam waktu singkat tanpa mengorbankan warga",
    stat: "Estimasi 5-15 Menit",
  },
  {
    id: 3,
    icon: Heart,
    title: "Gratis Tanpa Biaya",
    description:
      "Seluruh layanan administrasi kependudukan tidak dikenakan biaya apapun",
    stat: "100% GRATIS",
  },
  {
    id: 4,
    icon: MapPin,
    title: "Akses Mudah",
    description:
      "Layanan tersedia secara online dan langsung di kantor kami",
    stat: "12 Kecamatan",
  },
];

// Animation variants
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function TrustCardItem({ card }: { card: TrustCard }) {
  const Icon = card.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="relative group"
      style={{ perspective: "800px" }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-transparent transition-all duration-300 flex flex-col items-center text-center"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3D tilt on hover */}
        <div className="absolute inset-0 rounded-2xl transition-transform duration-300 group-hover:[transform:rotateY(-2deg)_rotateX(2deg)]" />

        {/* Glowing ring effect behind icon */}
        <div className="relative mb-5">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-16 h-16 bg-green-400/20 dark:bg-green-500/15 rounded-full blur-md"
          />
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-green-400/0 via-emerald-500/0 to-teal-500/0 group-hover:from-green-400/20 group-hover:via-emerald-500/15 group-hover:to-teal-500/20 rounded-full transition-all duration-500" />

          {/* Gradient Circle Icon */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-green-500/30">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{card.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
          {card.description}
        </p>

        {/* Stat Badge with gradient animation */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="inline-flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 text-sm font-bold text-green-700 dark:text-green-400 group-hover:from-green-100 group-hover:to-emerald-100 dark:group-hover:from-green-900/50 dark:group-hover:to-emerald-900/50 transition-all duration-300 border border-green-100/50 dark:border-green-800/30"
          >
            {card.stat}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden"
    >
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-gray-950 dark:via-green-950/10 dark:to-gray-950 pointer-events-none" />

      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #059669 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with animated underline accent */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Award className="h-4 w-4" />
            Mengapa Memilih Kami?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Kepercayaan Masyarakat Adalah Prioritas Utama Kami
          </h2>

          {/* Animated underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-24 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mx-auto mt-4 origin-center"
          />

          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Disdukcapil Kabupaten Ngada berkomitmen memberikan pelayanan
            terbaik demi kepuasan dan kemudahan seluruh masyarakat Ngada
          </p>
        </motion.div>

        {/* Trust Cards Grid with connecting dotted lines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {/* Connecting dotted lines between cards (desktop only) */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-0 pointer-events-none">
            <svg className="w-full h-2 overflow-visible" preserveAspectRatio="none">
              <line x1="14%" y1="4" x2="86%" y2="4" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 8" opacity="0.15" className="dark:opacity-[0.1]" />
            </svg>
          </div>

          {trustCards.map((card) => (
            <div key={card.id} className="relative z-10">
              <TrustCardItem card={card} />
            </div>
          ))}
        </motion.div>

        {/* ─── Testimoni Singkat Quote ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="mt-16 max-w-3xl mx-auto"
        >
          {/* Decorative glow */}
          <div className="absolute -inset-2 bg-gradient-to-br from-green-100/40 via-teal-50/30 to-emerald-100/40 dark:from-green-900/15 dark:via-teal-900/10 dark:to-emerald-900/15 rounded-2xl blur-xl pointer-events-none" />

          <div className="relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-green-100/50 dark:border-green-800/20 shadow-lg shadow-green-500/5 dark:shadow-green-500/5">
            {/* Inner pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none rounded-2xl"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 16px)`,
              }}
            />

            <div className="relative z-10 flex items-start gap-4">
              {/* Quote icon */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50">
                  <Quote className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-green-400/20 dark:bg-green-600/20 rounded-xl blur-md"
                />
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed italic">
                  &ldquo;Pelayanan di Disdukcapil Ngada sangat memuaskan. Proses pembuatan KTP saya berjalan cepat dan petugasnya ramah. Terima kasih atas pelayanan yang profesional!&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Maria Kewa
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Warga Kecamatan Bajawa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
