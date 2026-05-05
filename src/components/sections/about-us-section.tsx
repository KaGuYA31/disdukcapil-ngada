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
  Quote,
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

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
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
  { value: 171027, suffix: "+", label: "Penduduk Terlayani", icon: Users, color: "from-green-500 to-emerald-500", progress: 95 },
  { value: 12, suffix: "", label: "Kecamatan", icon: Globe, color: "from-teal-500 to-cyan-500", progress: 100 },
  { value: 206, suffix: "", label: "Kelurahan/Desa", icon: Building2, color: "from-amber-500 to-yellow-500", progress: 85 },
  { value: 26, suffix: "+", label: "Jenis Layanan", icon: FileCheck, color: "from-emerald-500 to-green-500", progress: 78 },
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

function ProgressRing({ progress, color, size = 56 }: { progress: number; color: string; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (inView) {
      const controls = animate(circumference, circumference - (progress / 100) * circumference, {
        duration: 2,
        ease: "easeOut",
      });
      const unsubscribe = controls.on("change", (v) => setOffset(v));
      return () => { controls.stop(); unsubscribe(); };
    }
  }, [inView, circumference, progress]);

  return (
    <svg ref={ref} width={size} height={size} className="absolute -right-2 -top-2 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className={`stroke-current text-transparent`} strokeWidth="3" strokeLinecap="round"
        style={{
          stroke: "url(#progressGrad)",
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: "stroke-dashoffset 0.1s linear",
        }}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
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

      {/* Animated progress ring */}
      <ProgressRing progress={stat.progress} color={stat.color} />

      {/* Background icon watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.06] transition-opacity duration-500">
        <Icon className="h-24 w-24" />
      </div>

      <div className="relative z-10">
        {/* Icon with gradient container and shadow */}
        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
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
      className="relative bg-gray-50/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group overflow-hidden"
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:via-teal-400/5 group-hover:to-emerald-400/10 dark:group-hover:from-green-500/10 dark:group-hover:via-teal-500/5 dark:group-hover:to-emerald-500/10 transition-all duration-500 -z-10 blur-sm" />

      {/* Animated bottom accent line reveal */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 dark:from-green-500 dark:via-teal-500 dark:to-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      </div>

      {/* Hover glow effect */}
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:via-emerald-500/3 group-hover:to-teal-500/5 transition-all duration-500 -z-10 blur-lg" />

      {/* Icon container with gradient and shadow */}
      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-green-500/15 group-hover:shadow-lg group-hover:shadow-green-500/25 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
        <Icon className="text-white w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
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
  index,
}: {
  value: (typeof organizationalValues)[0];
  index: number;
}) {
  const Icon = value.icon;

  return (
    <div className="relative">
      {/* Connecting gradient line between value cards (desktop) */}
      {index < 3 && (
        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-green-300/60 to-teal-300/60 dark:from-green-700/40 dark:to-teal-700/40 z-20" />
      )}
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800/60 dark:to-green-900/10 border border-green-100/50 dark:border-green-800/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
      >
        {/* Subtle floating animation */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-start gap-4"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/15 group-hover:shadow-lg group-hover:shadow-green-500/30 group-hover:scale-110 transition-all duration-300">
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
        </motion.div>
      </motion.div>
    </div>
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
      {/* ─── Hero Banner ─── */}
      <div className="relative bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 overflow-hidden">
        {/* SVG pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          variants={floatOrb}
          initial="hidden"
          animate="visible"
          className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
        />
        <motion.div
          variants={floatOrb}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center"
          >
            {/* Section label badge with Building2 in glassmorphism */}
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium border border-white/20">
                <Building2 className="h-4 w-4" />
                TENTANG KAMI
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Dinas Kependudukan dan{" "}
              <span className="text-green-200">Pencatatan Sipil</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-green-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada hadir untuk melayani masyarakat
              dengan penuh dedikasi dalam pengelolaan administrasi kependudukan
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-white dark:fill-gray-950" />
          </svg>
        </div>
      </div>

      {/* ─── Decorative geometric shapes ─── */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[calc(theme(spacing.80)+2rem)] right-[8%] w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-sm rotate-12 opacity-60 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[calc(theme(spacing.80)+12rem)] left-[5%] w-4 h-4 bg-teal-100 dark:bg-teal-900/30 rounded-full opacity-50 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-32 right-[12%] w-3 h-3 bg-emerald-200 dark:bg-emerald-800/30 rounded-full opacity-40 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[45%] left-[10%] w-5 h-5 border-2 border-green-200 dark:border-green-800 rounded-sm rotate-45 opacity-40 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-[calc(theme(spacing.80)+20rem)] right-[18%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-green-300/40 dark:border-b-green-700/30 opacity-50 hidden lg:block"
      />

      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2315803d' stroke-width='0.3' fill='none'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-[calc(theme(spacing.80)+4rem)] left-1/4 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-8 right-1/4 w-64 h-64 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative">
        {/* Stats Counter Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14 mt-4"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* ─── Tentang Disdukcapil Quote Block ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto mb-14"
        >
          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-green-100/60 via-teal-50/40 to-emerald-100/60 dark:from-green-900/20 dark:via-teal-900/10 dark:to-emerald-900/20 rounded-3xl blur-xl pointer-events-none" />

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 opacity-80" />
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-green-100/30 dark:shadow-green-900/20 overflow-hidden">
              {/* Animated gradient overlay */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(20,184,166,0.03) 50%, rgba(16,185,129,0.03) 100%)",
                    "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.03) 50%, rgba(20,184,166,0.05) 100%)",
                    "linear-gradient(135deg, rgba(20,184,166,0.03) 0%, rgba(16,185,129,0.05) 50%, rgba(5,150,105,0.03) 100%)",
                    "linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(20,184,166,0.03) 50%, rgba(16,185,129,0.03) 100%)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl pointer-events-none"
              />

              {/* Subtle inner stripe pattern */}
              <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 12px)`,
                }}
              />

              {/* Corner decorative sparkle */}
              <div className="absolute top-4 right-4 opacity-10">
                <Sparkles className="h-8 w-8 text-green-500" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <Sparkles className="h-6 h-6 text-teal-500" />
              </div>

              <div className="relative z-10">
                {/* Label + Icon */}
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Tentang Disdukcapil
                  </h3>
                </motion.div>

                {/* Quote with decorative icon */}
                <motion.div variants={fadeInUp} className="relative pl-2 md:pl-4">
                  <div className="absolute -top-3 -left-1 md:-top-4 md:-left-2">
                    <div className="relative">
                      <Quote className="h-10 w-10 md:h-14 md:w-14 text-green-200 dark:text-green-800" />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-green-200/20 dark:bg-green-700/20 rounded-full blur-md"
                      />
                    </div>
                  </div>
                  <p className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pl-8 md:pl-12 italic">
                    <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-300 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      &ldquo;Disdukcapil Kabupaten Ngada berkomitmen menyediakan layanan administrasi kependudukan yang akurat, tepat waktu, dan berorientasi pada kepuasan masyarakat, didukung oleh sumber daya manusia yang profesional dan teknologi informasi yang terintegrasi.&rdquo;
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {organizationalValues.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
