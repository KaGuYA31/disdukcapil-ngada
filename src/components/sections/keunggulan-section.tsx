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
  iconBgDark: string;
  iconColor: string;
  iconColorDark: string;
}

const features: KeunggulanItem[] = [
  {
    id: 1,
    icon: BadgeCheck,
    title: "Pelayanan Gratis",
    description:
      "Seluruh layanan administrasi kependudukan diberikan secara gratis tanpa biaya apapun",
    iconBg: "bg-teal-100",
    iconBgDark: "dark:bg-teal-900/50",
    iconColor: "text-teal-700",
    iconColorDark: "dark:text-teal-300",
  },
  {
    id: 2,
    icon: Zap,
    title: "Proses Cepat",
    description:
      "Pengurusan dokumen kependudukan selesai di tempat dalam hitungan menit",
    iconBg: "bg-green-100",
    iconBgDark: "dark:bg-green-900/50",
    iconColor: "text-green-700",
    iconColorDark: "dark:text-green-300",
  },
  {
    id: 3,
    icon: Truck,
    title: "Jemput Bola",
    description:
      "Layanan jemput bola ke desa-desa terpencil untuk kemudahan masyarakat",
    iconBg: "bg-teal-100",
    iconBgDark: "dark:bg-teal-900/50",
    iconColor: "text-teal-700",
    iconColorDark: "dark:text-teal-300",
  },
  {
    id: 4,
    icon: Eye,
    title: "Transparan",
    description:
      "Proses pelayanan yang transparan dan dapat dipantau secara real-time",
    iconBg: "bg-green-100",
    iconBgDark: "dark:bg-green-900/50",
    iconColor: "text-green-700",
    iconColorDark: "dark:text-green-300",
  },
  {
    id: 5,
    icon: Award,
    title: "Profesional",
    description:
      "Petugas terlatih dan bersertifikat yang siap melayani dengan sepenuh hati",
    iconBg: "bg-teal-100",
    iconBgDark: "dark:bg-teal-900/50",
    iconColor: "text-teal-700",
    iconColorDark: "dark:text-teal-300",
  },
  {
    id: 6,
    icon: Smartphone,
    title: "Digital",
    description:
      "Akses layanan secara online kapan saja dan di mana saja melalui portal resmi",
    iconBg: "bg-green-100",
    iconBgDark: "dark:bg-green-900/50",
    iconColor: "text-green-700",
    iconColorDark: "dark:text-green-300",
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
      whileHover={{ y: -4 }}
      className="relative bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-green-500/5 dark:hover:shadow-green-400/5 transition-all duration-300 group"
    >
      {/* Gradient border on hover (pseudo via absolute) */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/20 group-hover:via-teal-400/10 group-hover:to-emerald-400/20 dark:group-hover:from-green-500/15 dark:group-hover:via-teal-500/10 dark:group-hover:to-emerald-500/15 transition-all duration-500 -z-10 blur-sm" />
      <div className="absolute inset-0 rounded-2xl border border-gray-100/80 dark:border-gray-700/50 group-hover:border-green-300/40 dark:group-hover:border-green-700/40 transition-colors duration-300" />

      {/* Number Badge */}
      <span className="absolute top-4 right-4 text-5xl font-bold text-gray-100/80 dark:text-gray-700/30 leading-none select-none pointer-events-none">
        {badgeNumber}
      </span>

      {/* Icon */}
      <div
        className={`w-12 h-12 ${feature.iconBg} ${feature.iconBgDark} rounded-xl flex items-center justify-center mb-5 ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
      >
        <Icon className={`h-6 w-6 ${feature.iconColor} ${feature.iconColorDark} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Bottom gradient line accent */}
      <div className="absolute bottom-0 inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-green-400/0 to-transparent group-hover:via-green-400/30 dark:group-hover:via-green-500/20 transition-all duration-500 rounded-full" />
    </motion.div>
  );
}

export function KeunggulanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle diagonal line pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%230f766e' stroke-width='0.5' fill='none'%3E%3Cpath d='M0 60L60 0'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Gradient orbs for depth */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 bg-emerald-200/30 dark:bg-emerald-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-teal-200/30 dark:bg-teal-800/10 rounded-full blur-3xl" />

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
            Keunggulan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2">
            Mengapa Memilih Layanan Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
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
