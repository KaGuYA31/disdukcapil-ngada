"use client";

import { useRef } from "react";
import { Award, Shield, Zap, Heart, MapPin } from "lucide-react";
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
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300 group flex flex-col items-center text-center"
    >
      {/* Gradient Circle Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-md transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {card.description}
      </p>

      {/* Stat Badge */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full">
        <span className="inline-flex items-center justify-center w-full rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700 group-hover:bg-green-100 transition-colors duration-300">
          {card.stat}
        </span>
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
      className="relative py-16 md:py-24 bg-gray-50 overflow-hidden"
    >
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <Award className="h-4 w-4" />
            Mengapa Memilih Kami?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Kepercayaan Masyarakat Adalah Prioritas Utama Kami
          </h2>
          <p className="text-gray-600 mt-4">
            Disdukcapil Kabupaten Ngada berkomitmen memberikan pelayanan
            terbaik demi kepuasan dan kemudahan seluruh masyarakat Ngada
          </p>
        </motion.div>

        {/* Trust Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustCards.map((card) => (
            <TrustCardItem key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
