"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Building2,
  Users,
  FileCheck,
  Shield,
  Award,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  Globe,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const infoCards = [
  {
    icon: Building2,
    title: "Kantor Pusat",
    description: "Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT",
  },
  {
    icon: Users,
    title: "Melayani 171.000+ Penduduk",
    description: "Seluruh masyarakat Kabupaten Ngada dengan profesional",
  },
  {
    icon: FileCheck,
    title: "26+ Layanan",
    description: "Layanan administrasi kependudukan dari KTP hingga KK",
  },
  {
    icon: Shield,
    title: "Data Terjamin",
    description: "Keamanan dan kerahasiaan data penduduk terjaga",
  },
  {
    icon: Award,
    title: "Bersertifikat",
    description: "Standar pelayanan publik yang berkualitas dan terukur",
  },
  {
    icon: Target,
    title: "Visi Misi Jelas",
    description: "Melayani masyarakat dengan cepat, tepat, dan transparan",
  },
];

const stats = [
  { value: 171027, suffix: "+", label: "Penduduk Terlayani", icon: Users, color: "from-green-500 to-emerald-500" },
  { value: 12, suffix: "", label: "Kecamatan", icon: Globe, color: "from-teal-500 to-cyan-500" },
  { value: 206, suffix: "", label: "Kelurahan/Desa", icon: Building2, color: "from-amber-500 to-yellow-500" },
  { value: 26, suffix: "+", label: "Jenis Layanan", icon: FileCheck, color: "from-emerald-500 to-green-500" },
];

const organizationalValues = [
  {
    icon: Heart,
    title: "Integritas",
    description: "Menjunjung tinggi kejujuran dan profesionalisme dalam setiap pelayanan",
  },
  {
    icon: TrendingUp,
    title: "Inovasi",
    description: "Terus berinovasi untuk memberikan pelayanan yang lebih baik dan modern",
  },
  {
    icon: CheckCircle2,
    title: "Akuntabilitas",
    description: "Bertanggung jawab atas setiap proses dan hasil pelayanan kepada masyarakat",
  },
  {
    icon: Sparkles,
    title: "Kualitas",
    description: "Mengutamakan kualitas dan ketepatan dalam pengelolaan data kependudukan",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: "easeOut",
      });
      const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [inView, motionValue, rounded, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat("id-ID").format(display)}{suffix}
    </span>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 group overflow-hidden"
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Background icon watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.06] transition-opacity duration-500">
        <Icon className="h-24 w-24" />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Counter */}
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </p>

        {/* Label */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

function InfoCard({
  card,
}: {
  card: (typeof infoCards)[0];
}) {
  const Icon = card.icon;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3 }}
      className="relative bg-gray-50/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 group overflow-hidden"
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:via-teal-400/5 group-hover:to-emerald-400/10 dark:group-hover:from-green-500/10 dark:group-hover:via-teal-500/5 dark:group-hover:to-emerald-500/10 transition-all duration-500 -z-10 blur-sm" />

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-green-400/0 to-transparent group-hover:via-green-400/30 dark:group-hover:via-green-500/20 transition-all duration-500 rounded-full" />

      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-xl flex items-center justify-center mb-4 ring-1 ring-inset ring-black/5 dark:ring-white/5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
        <Icon className="text-green-600 dark:text-green-400 w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {card.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {card.description}
      </p>
    </motion.div>
  );
}

function ValueCard({
  value,
}: {
  value: (typeof organizationalValues)[0];
}) {
  const Icon = value.icon;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3 }}
      className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800/60 dark:to-green-900/10 border border-green-100/50 dark:border-green-800/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            {value.title}
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
            {value.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function AboutUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-gray-950 py-16 md:py-24 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2315803d' stroke-width='0.3' fill='none'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider mb-2">
            <Building2 className="h-4 w-4" />
            Tentang Kami
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
          >
            Dinas Kependudukan dan Pencatatan Sipil
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4"
          >
            Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada hadir untuk melayani masyarakat
            dengan penuh dedikasi dalam pengelolaan administrasi kependudukan
          </motion.p>
        </motion.div>

        {/* Stats Counter Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Info Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-14"
        >
          {infoCards.map((card) => (
            <InfoCard key={card.title} card={card} />
          ))}
        </motion.div>

        {/* Organizational Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
              <Award className="h-4 w-4" />
              Nilai Organisasi
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Empat pilar yang menjadi fondasi pelayanan kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {organizationalValues.map((value) => (
              <ValueCard key={value.title} value={value} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
