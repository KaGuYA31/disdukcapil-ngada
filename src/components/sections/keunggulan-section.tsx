"use client";

import { useRef } from "react";
import { BadgeCheck, Zap, Truck, Eye, Award, Smartphone, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface KeunggulanItem {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const features: KeunggulanItem[] = [
  {
    id: 1,
    icon: BadgeCheck,
    title: "Pelayanan Gratis",
    description:
      "Seluruh layanan administrasi kependudukan diberikan secara gratis tanpa biaya apapun",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  {
    id: 2,
    icon: Zap,
    title: "Proses Cepat",
    description:
      "Pengurusan dokumen kependudukan selesai di tempat dalam hitungan menit",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
  {
    id: 3,
    icon: Truck,
    title: "Jemput Bola",
    description:
      "Layanan jemput bola ke desa-desa terpencil untuk kemudahan masyarakat",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  {
    id: 4,
    icon: Eye,
    title: "Transparan",
    description:
      "Proses pelayanan yang transparan dan dapat dipantau secara real-time",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
  {
    id: 5,
    icon: Award,
    title: "Profesional",
    description:
      "Petugas terlatih dan bersertifikat yang siap melayani dengan sepenuh hati",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  {
    id: 6,
    icon: Smartphone,
    title: "Digital",
    description:
      "Akses layanan secara online kapan saja dan di mana saja melalui portal resmi",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
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
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function FeatureCard({
  feature,
}: {
  feature: KeunggulanItem;
}) {
  const Icon = feature.icon;
  const badgeNumber = String(feature.id).padStart(2, "0");

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2 }}
      className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group"
    >
      {/* Number Badge */}
      <span className="absolute top-4 right-4 text-5xl font-bold text-gray-100 leading-none select-none pointer-events-none">
        {badgeNumber}
      </span>

      {/* Icon */}
      <div
        className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`h-6 w-6 ${feature.iconColor}`} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export function KeunggulanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Keunggulan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Mengapa Memilih Layanan Kami
          </h2>
          <p className="text-gray-600 mt-4">
            Disdukcapil Kabupaten Ngada berkomitmen memberikan pelayanan
            terbaik dengan berbagai keunggulan untuk kemudahan masyarakat
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
