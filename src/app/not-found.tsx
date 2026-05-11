"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  Newspaper,
  MessageSquareWarning,
  Search,
  Building2,
  Globe,
  BarChart3,
  Shield,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { fadeInUp, fadeInScale, staggerContainer, linkCardHover } from "@/lib/animations";

// ─── Quick links data ────────────────────────────────────────────────

const quickLinks = [
  {
    label: "Beranda",
    href: "/",
    icon: Home,
    description: "Halaman utama",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/40",
    hoverBg: "group-hover:bg-green-100 dark:group-hover:bg-green-900/40",
    borderHover: "hover:border-green-300 dark:hover:border-green-700",
  },
  {
    label: "Layanan",
    href: "/layanan",
    icon: FileText,
    description: "Daftar layanan",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    hoverBg: "group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40",
    borderHover: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    label: "Berita",
    href: "/berita",
    icon: Newspaper,
    description: "Informasi terbaru",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    hoverBg: "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  {
    label: "Pengaduan",
    href: "/pengaduan",
    icon: MessageSquareWarning,
    description: "Sampaikan keluhan",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    hoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
  },
  {
    label: "Profil",
    href: "/profil",
    icon: Building2,
    description: "Tentang kami",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    hoverBg: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  {
    label: "Layanan Online",
    href: "/layanan-online",
    icon: Globe,
    description: "Ajukan daring",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    hoverBg: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/40",
    borderHover: "hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  {
    label: "Data & Statistik",
    href: "/statistik",
    icon: BarChart3,
    description: "Data kependudukan",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    hoverBg: "group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40",
    borderHover: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  {
    label: "Transparansi",
    href: "/transparansi",
    icon: Shield,
    description: "Informasi publik",
    color: "text-lime-600",
    bg: "bg-lime-50 dark:bg-lime-950/40",
    hoverBg: "group-hover:bg-lime-100 dark:group-hover:bg-lime-900/40",
    borderHover: "hover:border-lime-300 dark:hover:border-lime-700",
  },
];

// ─── Government Building SVG Illustration ────────────────────────────

function GovernmentBuildingIllustration() {
  return (
    <motion.svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm md:max-w-md mx-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#f0fdfa" />
          <linearGradient id="skyGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#052e16" />
            <stop offset="100%" stopColor="#042f2e" />
          </linearGradient>
        </linearGradient>
        <linearGradient id="roofGrad" x1="200" y1="40" x2="200" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="bldgGrad" x1="200" y1="110" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5f5f4" />
          <stop offset="100%" stopColor="#e7e5e4" />
        </linearGradient>
        <linearGradient id="bldgGradDark" x1="200" y1="110" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="240" x2="0" y2="280">
          <stop offset="0%" stopColor="#d9f99d" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </linearGradient>
        <linearGradient id="groundGradDark" x1="0" y1="240" x2="0" y2="280">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="200" y1="185" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="400" height="280" rx="16" className="fill-emerald-50 dark:fill-emerald-950/30" />

      {/* Clouds */}
      <motion.g
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <ellipse cx="70" cy="60" rx="30" ry="14" className="fill-white/80 dark:fill-white/10" />
        <ellipse cx="90" cy="55" rx="22" ry="12" className="fill-white/80 dark:fill-white/10" />
        <ellipse cx="50" cy="57" rx="18" ry="10" className="fill-white/80 dark:fill-white/10" />
      </motion.g>
      <motion.g
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        <ellipse cx="320" cy="50" rx="26" ry="12" className="fill-white/80 dark:fill-white/10" />
        <ellipse cx="340" cy="46" rx="20" ry="10" className="fill-white/80 dark:fill-white/10" />
        <ellipse cx="300" cy="48" rx="16" ry="9" className="fill-white/80 dark:fill-white/10" />
      </motion.g>

      {/* Ground */}
      <motion.ellipse
        cx="200"
        cy="252"
        rx="190"
        ry="30"
        className="fill-green-200/70 dark:fill-green-900/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "200px 252px" }}
      />

      {/* Main building body */}
      <motion.rect
        x="100"
        y="110"
        width="200"
        height="130"
        rx="4"
        className="fill-stone-100 dark:fill-stone-800"
        stroke="#d6d3d1"
        strokeWidth="1.5"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />

      {/* Roof / Triangle */}
      <motion.polygon
        points="200,42 88,110 312,110"
        fill="url(#roofGrad)"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      />

      {/* Roof edge detail */}
      <motion.line
        x1="88"
        y1="110"
        x2="312"
        y2="110"
        stroke="#047857"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {/* Pediment (triangle face) */}
      <motion.polygon
        points="200,56 115,110 285,110"
        fill="#ecfdf5"
        className="dark:fill-emerald-900/40"
        stroke="#059669"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />

      {/* Garuda / emblem circle */}
      <motion.circle
        cx="200"
        cy="85"
        r="16"
        fill="#dcfce7"
        className="dark:fill-emerald-800/60"
        stroke="#059669"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
      />
      <motion.text
        x="200"
        y="90"
        textAnchor="middle"
        className="fill-green-700 dark:fill-green-300"
        fontSize="14"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        D
      </motion.text>

      {/* Columns */}
      {[130, 170, 200, 230, 270].map((x, i) => (
        <motion.rect
          key={x}
          x={x - 5}
          y="118"
          width="10"
          height="110"
          rx="2"
          className="fill-stone-200 dark:fill-stone-700"
          stroke="#d6d3d1"
          strokeWidth="0.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
          style={{ transformOrigin: `${x}px 228px` }}
        />
      ))}

      {/* Column caps */}
      {[130, 170, 200, 230, 270].map((x, i) => (
        <motion.rect
          key={`cap-${x}`}
          x={x - 7}
          y="115"
          width="14"
          height="6"
          rx="1"
          className="fill-stone-300 dark:fill-stone-600"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 14 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
        />
      ))}

      {/* Windows row 1 */}
      {[150, 250].map((x, i) => (
        <motion.g
          key={`w1-${x}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
        >
          <rect x={x} y="128" width="20" height="24" rx="2" className="fill-sky-100 dark:fill-sky-900/40" stroke="#9ca3af" strokeWidth="0.8" />
          <line x1={x + 10} y1="128" x2={x + 10} y2="152" stroke="#9ca3af" strokeWidth="0.5" />
          <line x1={x} y1="140" x2={x + 20} y2="140" stroke="#9ca3af" strokeWidth="0.5" />
        </motion.g>
      ))}

      {/* Windows row 2 */}
      {[140, 180, 220, 260].map((x, i) => (
        <motion.g
          key={`w2-${x}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.0 + i * 0.08 }}
        >
          <rect x={x} y="165" width="18" height="20" rx="2" className="fill-sky-100 dark:fill-sky-900/40" stroke="#9ca3af" strokeWidth="0.8" />
          <line x1={x + 9} y1="165" x2={x + 9} y2="185" stroke="#9ca3af" strokeWidth="0.5" />
          <line x1={x} y1="175" x2={x + 18} y2="175" stroke="#9ca3af" strokeWidth="0.5" />
        </motion.g>
      ))}

      {/* Main door */}
      <motion.g
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ transformOrigin: "200px 240px" }}
      >
        <rect x="182" y="190" width="36" height="50" rx="18" fill="url(#doorGrad)" />
        <rect x="186" y="194" width="28" height="42" rx="14" fill="#78350f" stroke="#92400e" strokeWidth="0.8" />
        {/* Door handle */}
        <circle cx="207" cy="216" r="2" fill="#fbbf24" />
      </motion.g>

      {/* Steps */}
      {[0, 1, 2].map((step, i) => (
        <motion.rect
          key={`step-${i}`}
          x={172 - step * 6}
          y={238 + step * 4}
          width={56 + step * 12}
          height="4"
          rx="1"
          className="fill-stone-300 dark:fill-stone-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
          style={{ transformOrigin: `${200 - step * 6 + (56 + step * 12) / 2}px ${240 + step * 4}px` }}
        />
      ))}

      {/* Flag pole */}
      <motion.g
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{ transformOrigin: "340px 42px" }}
      >
        <line x1="340" y1="42" x2="340" y2="140" stroke="#78716c" strokeWidth="2" />
        {/* Flag */}
        <motion.rect
          x="342"
          y="42"
          width="28"
          height="18"
          rx="1"
          fill="#dc2626"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
          style={{ transformOrigin: "342px 51px" }}
        />
        {/* Flag pole ball */}
        <circle cx="340" cy="42" r="3" fill="#d97706" />
      </motion.g>

      {/* Small trees */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
      >
        {/* Left tree */}
        <rect x="56" y="218" width="6" height="24" rx="2" className="fill-amber-800 dark:fill-amber-900" />
        <ellipse cx="59" cy="210" rx="18" ry="20" className="fill-green-500 dark:fill-green-800" />
        <ellipse cx="52" cy="205" rx="12" ry="14" className="fill-green-400 dark:fill-green-700" />
        <ellipse cx="66" cy="207" rx="11" ry="12" className="fill-green-600 dark:fill-green-900" />
      </motion.g>

      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
      >
        {/* Right tree */}
        <rect x="334" y="222" width="5" height="20" rx="2" className="fill-amber-800 dark:fill-amber-900" />
        <ellipse cx="337" cy="215" rx="15" ry="17" className="fill-green-500 dark:fill-green-800" />
        <ellipse cx="331" cy="211" rx="10" ry="12" className="fill-green-400 dark:fill-green-700" />
        <ellipse cx="343" cy="213" rx="9" ry="10" className="fill-green-600 dark:fill-green-900" />
      </motion.g>

      {/* Decorative dotted path */}
      <motion.path
        d="M 200 250 Q 200 260 200 268"
        stroke="#059669"
        strokeWidth="1.5"
        strokeDasharray="3 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      />
    </motion.svg>
  );
}

// ─── Animated counter ────────────────────────────────────────────────

function AnimatedCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 404;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <span className="tabular-nums">{count}</span>
  );
}

// ─── Floating particles ──────────────────────────────────────────────

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: i % 2 === 0
              ? "rgba(5, 150, 105, 0.15)"
              : "rgba(20, 184, 166, 0.12)",
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 8, -5, 10, 0],
            opacity: [0.3, 0.7, 0.5, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/berita?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Floating particles */}
        <FloatingParticles />

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/8 dark:bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/8 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-400/5 dark:bg-amber-400/3 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12 md:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl w-full"
          >
            {/* Animated SVG Illustration */}
            <motion.div variants={fadeInScale} className="mb-6 md:mb-8">
              <GovernmentBuildingIllustration />
            </motion.div>

            {/* Error code */}
            <motion.div variants={fadeInUp} className="text-center mb-3">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none">
                <AnimatedCounter />
              </h1>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center mb-3"
            >
              Halaman Tidak Ditemukan
            </motion.h2>

            {/* Decorative CSS Document Icon */}
            <motion.div variants={fadeInScale} className="flex justify-center mb-4 -mt-2">
              <div className="relative" aria-hidden="true">
                {/* Document base */}
                <div className="relative w-16 h-20 rounded-lg bg-white dark:bg-gray-800 border-2 border-dashed border-green-300 dark:border-green-700 shadow-lg shadow-green-500/10">
                  {/* Folded corner */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-br-lg rounded-tl-sm border-l-2 border-b-2 border-green-300 dark:border-green-700" />
                  {/* Text lines */}
                  <div className="absolute top-4 left-2.5 right-2.5 space-y-1.5">
                    <div className="h-1 rounded-full bg-green-200 dark:bg-green-800 w-full" />
                    <div className="h-1 rounded-full bg-green-200 dark:bg-green-800 w-4/5" />
                    <div className="h-1 rounded-full bg-green-100 dark:bg-green-800/50 w-3/5" />
                  </div>
                  {/* Question mark overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-400 dark:text-green-600 text-2xl font-black opacity-40 -rotate-6">?</span>
                  </div>
                </div>
                {/* Floating accent dots */}
                <div className="absolute -bottom-1 -left-2 w-2.5 h-2.5 rounded-full bg-teal-400/60 dark:bg-teal-500/40 animate-pulse" />
                <div className="absolute -top-1 -left-3 w-1.5 h-1.5 rounded-full bg-emerald-400/50 dark:bg-emerald-500/30 animate-pulse delay-300" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg mx-auto text-center mb-8"
            >
              Maaf, halaman yang Anda cari tidak ditemukan. Kemungkinan halaman telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan salah. Silakan gunakan pencarian atau pilih salah satu tautan di bawah ini.
            </motion.p>

            {/* Search Bar - redirects to /berita?q=... */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-lg mx-auto mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Cari berita atau informasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 dark:focus:ring-green-400/30 dark:focus:border-green-400 transition-all"
                  aria-label="Kata kunci pencarian"
                />
              </div>
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 flex-shrink-0"
              >
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </motion.form>

            {/* Quick Links Grid */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
                Halaman yang mungkin Anda cari
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
                {quickLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial="rest"
                    whileHover="hover"
                    variants={linkCardHover}
                  >
                    <Link href={link.href} className="block h-full">
                      <Card
                        className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 ${link.borderHover} h-full transition-all duration-200 group cursor-pointer`}
                      >
                        <CardContent className="flex flex-col items-center gap-2.5 p-4">
                          <div
                            className={`flex items-center justify-center w-11 h-11 rounded-xl ${link.bg} ${link.hoverBg} transition-colors duration-200`}
                          >
                            <link.icon className={`h-5 w-5 ${link.color} group-hover:scale-110 transition-transform duration-200`} />
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors block">
                              {link.label}
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                              {link.description}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4 max-w-md mx-auto mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
            </motion.div>

            {/* Primary CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <Button
                asChild
                size="lg"
                className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-green-700/20 dark:shadow-green-900/30 hover:shadow-xl hover:shadow-green-700/30 dark:hover:shadow-green-900/40 transition-all duration-300"
              >
                <Link href="/">
                  <Home className="h-5 w-5 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40 px-6 py-6 text-base"
              >
                <Link href="/layanan">
                  <FileText className="h-5 w-5 mr-2" />
                  Lihat Layanan
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 px-6 py-6 text-base"
              >
                <Link href="/pengaduan">
                  <MessageSquareWarning className="h-5 w-5 mr-2" />
                  Hubungi Kami
                </Link>
              </Button>
            </motion.div>

            {/* Secondary: Back button */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Halaman Sebelumnya
              </Button>
            </motion.div>

            {/* Help info */}
            <motion.div
              variants={fadeInUp}
              className="text-center text-sm text-gray-400 dark:text-gray-500"
            >
              <p>
                Butuh bantuan? Hubungi kami{" "}
                <a
                  href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20kependudukan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Phone className="h-3.5 w-3.5" />
                  via WhatsApp
                </a>
                {" "}atau kunjungi{" "}
                <Link
                  href="/pengaduan"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  halaman pengaduan
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
