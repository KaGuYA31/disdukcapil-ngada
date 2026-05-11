"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Landmark,
  Shield,
  Building2,
  MapPin,
  Fingerprint,
  FileSearch,
  HeartPulse,
  MonitorSmartphone,
  CreditCard,
  Link2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface LinkItem {
  title: string;
  url: string;
  icon: React.ElementType;
  color: string; // Tailwind bg color for the favicon circle
  textColor: string; // Tailwind text color for the favicon letter
}

interface LinkCategory {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string; // Gradient for accent line
  accentDark: string;
  icon: React.ElementType;
  links: LinkItem[];
}

// ─── Animation Variants ───────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const categoryHeaderVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

// ─── Link Data ────────────────────────────────────────────────────
const categories: LinkCategory[] = [
  {
    id: "government",
    title: "Tautan Pemerintah",
    subtitle: "Situs resmi pemerintah pusat dan daerah",
    accentColor: "from-green-500 to-emerald-500",
    accentDark: "dark:from-green-400 dark:to-emerald-400",
    icon: Landmark,
    links: [
      {
        title: "Pemerintah Kabupaten Ngada",
        url: "https://ngadakab.go.id",
        icon: Building2,
        color: "bg-green-500",
        textColor: "text-white",
      },
      {
        title: "Pemerintah Provinsi NTT",
        url: "https://nttprov.go.id",
        icon: MapPin,
        color: "bg-teal-500",
        textColor: "text-white",
      },
      {
        title: "Kementerian Dalam Negeri",
        url: "https://kemendagri.go.id",
        icon: Landmark,
        color: "bg-red-600",
        textColor: "text-white",
      },
      {
        title: "Dukcapil Kemendagri",
        url: "https://dukcapil.kemendagri.go.id",
        icon: Shield,
        color: "bg-amber-500",
        textColor: "text-white",
      },
      {
        title: "Presiden RI",
        url: "https://presidenri.go.id",
        icon: Globe,
        color: "bg-blue-600",
        textColor: "text-white",
      },
      {
        title: "Portal Indonesia",
        url: "https://indonesia.go.id",
        icon: Globe,
        color: "bg-rose-500",
        textColor: "text-white",
      },
    ],
  },
  {
    id: "digital",
    title: "Layanan Digital",
    subtitle: "Platform layanan publik berbasis digital",
    accentColor: "from-teal-500 to-cyan-500",
    accentDark: "dark:from-teal-400 dark:to-cyan-400",
    icon: MonitorSmartphone,
    links: [
      {
        title: "Cek NIK Secara Online",
        url: "https://ceknik.kemendagri.go.id",
        icon: Fingerprint,
        color: "bg-violet-500",
        textColor: "text-white",
      },
      {
        title: "Laporkan.gov.id",
        url: "https://lapor.go.id",
        icon: FileSearch,
        color: "bg-orange-500",
        textColor: "text-white",
      },
      {
        title: "BPJS Kesehatan",
        url: "https://bpjs-kesehatan.go.id",
        icon: HeartPulse,
        color: "bg-green-600",
        textColor: "text-white",
      },
      {
        title: "Dukcapil Online",
        url: "https://id.dukcapil.kemendagri.go.id",
        icon: MonitorSmartphone,
        color: "bg-sky-500",
        textColor: "text-white",
      },
      {
        title: "e-KTP Center",
        url: "https://dukcapil.kemendagri.go.id",
        icon: CreditCard,
        color: "bg-emerald-500",
        textColor: "text-white",
      },
    ],
  },
];

// ─── Helper: Extract domain from URL ──────────────────────────────
function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─── Link Card Component ──────────────────────────────────────────
function LinkCard({ link }: { link: LinkItem }) {
  const Icon = link.icon;
  const domain = getDomain(link.url);
  const initial = link.title.charAt(0).toUpperCase();

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-400/5 transition-all duration-300"
    >
      {/* Favicon circle placeholder */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-xl ${link.color} ${link.textColor} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
      >
        <span className="text-lg font-bold leading-none select-none">
          {initial}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
            {link.title}
          </h3>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate font-mono">
          {domain}
        </p>
      </div>

      {/* External link icon */}
      <ExternalLink className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-green-500 dark:group-hover:text-green-400 flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-green-400/0 to-transparent group-hover:via-green-400/40 dark:group-hover:via-green-500/30 transition-all duration-500 rounded-full" />

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-green-300/50 dark:group-hover:border-green-700/40 transition-colors duration-300 pointer-events-none" />
    </motion.a>
  );
}

// ─── Category Block Component ─────────────────────────────────────
function CategoryBlock({
  category,
  isInView,
}: {
  category: LinkCategory;
  isInView: boolean;
}) {
  const CatIcon = category.icon;

  return (
    <div className="space-y-5">
      {/* Category Header with accent line */}
      <motion.div
        variants={categoryHeaderVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex items-center gap-3"
      >
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.accentColor} ${category.accentDark} flex items-center justify-center shadow-md`}
        >
          <CatIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {category.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {category.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className={`h-1 w-20 rounded-full bg-gradient-to-r ${category.accentColor} ${category.accentDark} origin-left`}
      />

      {/* Links Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3"
      >
        {category.links.map((link) => (
          <LinkCard key={link.url} link={link} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Section Component ───────────────────────────────────────
export function TautanTerkaitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      aria-labelledby="tautan-terkait-title"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50/20 dark:bg-emerald-900/5 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <Link2 className="h-4 w-4" />
            Tautan Terkait
          </span>
          <h2
            id="tautan-terkait-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Tautan Terkait
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Akses cepat ke situs pemerintah dan layanan digital yang terpercaya
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12 md:space-y-16">
          {categories.map((category) => (
            <CategoryBlock
              key={category.id}
              category={category}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom info text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center gap-1.5">
            <ExternalLink className="h-3 w-3" />
            Semua tautan membuka situs eksternal di tab baru
          </p>
        </motion.div>
      </div>
    </section>
  );
}
