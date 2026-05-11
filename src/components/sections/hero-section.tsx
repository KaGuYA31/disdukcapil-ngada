"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, FileText, Users, Building2, Loader2, Globe, ChevronDown, IdCard, FileCheck, Sun, Sunset, Moon, Shield, Star, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountdownTimer } from "@/components/shared/countdown-timer";

interface BerandaData {
  ringkasan: {
    totalPenduduk: number;
    lakiLaki: number;
    perempuan: number;
    rasioJK: number;
    periode: string;
  } | null;
  dokumen: {
    ektpCetak: number;
    ektpBelum: number;
    aktaLahir: number;
    aktaBelum: number;
    kiaMiliki: number;
    kiaBelum: number;
    cakupanAkta: number;
  } | null;
  kepalaDinas: {
    name: string;
    position: string;
    photo: string | null;
    description: string | null;
  } | null;
  blankoEKTP: {
    jumlahTersedia: number;
    keterangan: string | null;
  } | null;
  bupati: {
    name: string;
    photo: string | null;
    periode: string | null;
  } | null;
  wakilBupati: {
    name: string;
    photo: string | null;
    periode: string | null;
  } | null;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: "easeOut" as const,
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function getTimeGreeting() {
  const now = new Date();
  const rawHour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Makassar",
    }).format(now),
    10
  );
  // Some Intl implementations return 24 for midnight — normalize to 0
  const hour = rawHour === 24 ? 0 : rawHour;

  if (hour >= 5 && hour < 11) {
    return { text: "Selamat Pagi", Icon: Sun, colorClass: "text-amber-300" };
  }
  if (hour >= 11 && hour < 15) {
    return { text: "Selamat Siang", Icon: Sun, colorClass: "text-amber-400" };
  }
  if (hour >= 15 && hour < 18) {
    return { text: "Selamat Sore", Icon: Sunset, colorClass: "text-orange-400" };
  }
  return { text: "Selamat Malam", Icon: Moon, colorClass: "text-teal-200" };
}

// Leader Photo Component with gradient border + glass card
function LeaderCard({
  name,
  role,
  periode,
  photo,
  isLoading,
  fallbackGradient,
  FallbackIcon,
  ringColor,
}: {
  name: string;
  role: string;
  periode: string | null;
  photo: string | null;
  isLoading: boolean;
  fallbackGradient: string;
  FallbackIcon: React.ElementType;
  ringColor: string;
}) {
  return (
    <div className="bg-white/[0.08] backdrop-blur-lg rounded-2xl p-5 border border-white/[0.15] shadow-lg shadow-black/10 hover:bg-white/[0.12] transition-all duration-500 group text-center">
      {/* Photo */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
        <div className="relative w-full h-full">
          {/* Green gradient border ring */}
          <div className={`absolute -inset-[3px] rounded-full bg-gradient-to-br ${ringColor} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="absolute -inset-[1px] rounded-full bg-gradient-to-br from-green-400 via-teal-400 to-emerald-500 animate-[spin_8s_linear_infinite]" style={{ mask: "radial-gradient(transparent 65%, black 66%)", WebkitMask: "radial-gradient(transparent 65%, black 66%)" }} />

          {/* Inner background */}
          <div className="absolute inset-[2px] rounded-full bg-green-800" />

          {/* Photo or fallback */}
          {isLoading ? (
            <div className="relative w-full h-full rounded-full bg-green-700/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : photo ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={photo}
                alt={name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}>
              <FallbackIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h4 className="font-bold text-base sm:text-lg leading-tight text-white">{name}</h4>

      {/* Role */}
      <p className="text-green-200/80 text-xs sm:text-sm mt-1 font-medium">{role}</p>

      {/* Period */}
      {periode && (
        <div className="inline-flex items-center gap-1 mt-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          <Star className="h-3 w-3 text-yellow-400/80" />
          <span className="text-[11px] sm:text-xs text-green-100/80 font-medium">{periode}</span>
        </div>
      )}
    </div>
  );
}

// Decorative separator between leaders
function LeaderSeparator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      {/* Vertical line */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-white/30" />
      {/* Emblem badge */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400/30 to-teal-400/30 backdrop-blur-md border border-white/20 flex items-center justify-center">
        <Shield className="h-5 w-5 text-yellow-400/80" />
      </div>
      {/* Vertical line */}
      <div className="w-px h-8 bg-gradient-to-b from-white/30 via-white/30 to-transparent" />
    </div>
  );
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(getTimeGreeting);
  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setGreeting(getTimeGreeting());
  }, []);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY * 0.3);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beranda");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching beranda data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Open the global search command palette and pre-fill the query
      window.dispatchEvent(new CustomEvent("open-search-command", { detail: { query: searchQuery } }));
      setSearchQuery("");
    }
  };

  // Also allow clicking the search input directly to open global search
  const handleSearchInputFocus = () => {
    window.dispatchEvent(new CustomEvent("open-search-command"));
  };

  // Data dari database
  const totalPenduduk = data?.ringkasan?.totalPenduduk || 0;
  const cakupanAkta = data?.dokumen?.cakupanAkta || 0;
  const periode = data?.ringkasan?.periode || "-";

  const blankoTersedia = data?.blankoEKTP?.jumlahTersedia || 0;

  // Stats with gradient accent colors and icons
  const heroStats = [
    {
      label: "Total Penduduk",
      value: formatNumber(totalPenduduk),
      gradient: "from-green-400 to-emerald-500",
      iconColor: "text-green-400",
      Icon: Users,
    },
    {
      label: "Blanko E-KTP",
      value: formatNumber(blankoTersedia),
      gradient: "from-teal-400 to-cyan-500",
      iconColor: "text-teal-400",
      Icon: IdCard,
    },
    {
      label: "Cakupan Akta",
      value: `${cakupanAkta.toFixed(1)}%`,
      gradient: "from-amber-400 to-yellow-500",
      iconColor: "text-amber-400",
      Icon: FileCheck,
    },
  ];

  const kepalaDinas = data?.kepalaDinas;
  const bupati = data?.bupati;
  const wakilBupati = data?.wakilBupati;

  return (
    <section ref={heroRef} className="relative overflow-hidden text-white">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900 animate-hero-gradient" />

      {/* Secondary moving gradient mesh layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-800/40 via-transparent to-yellow-700/20 animate-hero-gradient" style={{ backgroundSize: "300% 300%", animationDuration: "20s", animationDirection: "reverse" }} />

      {/* Gradient Mesh Blobs — 4 complex moving blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-green-400/15 to-teal-500/10 blur-3xl animate-mesh-blob-1" />
        <div className="absolute top-[20%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-br from-teal-400/12 to-emerald-400/8 blur-3xl animate-mesh-blob-2" />
        <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full bg-gradient-to-br from-yellow-400/8 to-green-400/10 blur-3xl animate-mesh-blob-3" />
        <div className="absolute top-[50%] left-[50%] w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-400/8 blur-3xl animate-mesh-blob-4" />
      </div>

      {/* Floating Particles — existing large blur orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-green-400/[0.07] animate-float-1 blur-xl" />
        <div className="absolute top-[60%] left-[70%] w-40 h-40 rounded-full bg-teal-400/[0.06] animate-float-2 blur-xl" />
        <div className="absolute top-[30%] left-[80%] w-24 h-24 rounded-full bg-yellow-400/[0.05] animate-float-3 blur-xl" />
        <div className="absolute top-[75%] left-[25%] w-28 h-28 rounded-full bg-green-300/[0.06] animate-float-4 blur-xl" />
      </div>

      {/* Small Floating Particles — 18 subtle dots with varied sizes, opacity, speed */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Desktop particles */}
        <div className="hidden md:block absolute top-[8%] left-[12%] w-1.5 h-1.5 rounded-full bg-green-300/50" style={{ animation: 'particle-float-1 14s ease-in-out infinite' }} />
        <div className="hidden md:block absolute top-[22%] left-[85%] w-1 h-1 rounded-full bg-teal-300/60" style={{ animation: 'particle-float-2 18s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className="hidden md:block absolute top-[45%] left-[6%] w-2 h-2 rounded-full bg-green-200/40" style={{ animation: 'particle-float-3 16s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="hidden md:block absolute top-[65%] left-[90%] w-1 h-1 rounded-full bg-emerald-300/50" style={{ animation: 'particle-float-4 20s ease-in-out infinite', animationDelay: '-2s' }} />
        <div className="hidden md:block absolute top-[35%] left-[55%] w-1.5 h-1.5 rounded-full bg-teal-200/35" style={{ animation: 'particle-float-5 17s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="hidden md:block absolute top-[80%] left-[40%] w-1 h-1 rounded-full bg-green-300/45" style={{ animation: 'particle-float-1 22s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className="hidden md:block absolute top-[12%] left-[65%] w-2 h-2 rounded-full bg-yellow-200/30" style={{ animation: 'particle-float-2 19s ease-in-out infinite', animationDelay: '-10s' }} />
        <div className="hidden md:block absolute top-[55%] left-[20%] w-1.5 h-1.5 rounded-full bg-emerald-200/40" style={{ animation: 'particle-float-3 15s ease-in-out infinite', animationDelay: '-7s' }} />
        <div className="hidden md:block absolute top-[28%] left-[35%] w-1 h-1 rounded-full bg-green-400/35" style={{ animation: 'particle-float-4 21s ease-in-out infinite', animationDelay: '-12s' }} />
        <div className="hidden md:block absolute top-[72%] left-[60%] w-1.5 h-1.5 rounded-full bg-teal-300/30" style={{ animation: 'particle-float-5 18s ease-in-out infinite', animationDelay: '-4s' }} />
        <div className="hidden md:block absolute top-[90%] left-[15%] w-1 h-1 rounded-full bg-green-200/50" style={{ animation: 'particle-float-1 16s ease-in-out infinite', animationDelay: '-9s' }} />
        <div className="hidden md:block absolute top-[5%] left-[45%] w-2 h-2 rounded-full bg-teal-200/25" style={{ animation: 'particle-float-2 23s ease-in-out infinite', animationDelay: '-1s' }} />
        <div className="hidden md:block absolute top-[48%] left-[78%] w-1 h-1 rounded-full bg-emerald-300/40" style={{ animation: 'particle-float-3 20s ease-in-out infinite', animationDelay: '-11s' }} />
        <div className="hidden md:block absolute top-[15%] left-[30%] w-1.5 h-1.5 rounded-full bg-green-300/35" style={{ animation: 'particle-float-4 17s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="hidden md:block absolute top-[60%] left-[50%] w-1 h-1 rounded-full bg-yellow-300/30" style={{ animation: 'particle-float-5 24s ease-in-out infinite', animationDelay: '-13s' }} />
        {/* Mobile: reduced particles (6) */}
        <div className="md:hidden absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-green-300/40" style={{ animation: 'particle-float-1 18s ease-in-out infinite' }} />
        <div className="md:hidden absolute top-[50%] left-[80%] w-1 h-1 rounded-full bg-teal-300/50" style={{ animation: 'particle-float-3 20s ease-in-out infinite', animationDelay: '-4s' }} />
        <div className="md:hidden absolute top-[75%] left-[30%] w-1.5 h-1.5 rounded-full bg-green-200/35" style={{ animation: 'particle-float-5 16s ease-in-out infinite', animationDelay: '-8s' }} />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Hexagon — top right area */}
        <div className="absolute top-[12%] right-[8%] w-16 h-16 animate-geo-spin-slow opacity-[0.08]" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Triangle — left area */}
        <div className="absolute top-[40%] left-[4%] w-12 h-12 animate-geo-float opacity-[0.07]" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 95,90 5,90" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Diamond — bottom left */}
        <div className="absolute bottom-[25%] left-[15%] w-10 h-10 animate-geo-rotate opacity-[0.06]">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" stroke="white" strokeWidth="2" fill="none" transform="rotate(45 50 50)" />
          </svg>
        </div>
        {/* Small circle outline — top center */}
        <div className="absolute top-[8%] left-[45%] w-8 h-8 animate-geo-float opacity-[0.05]" style={{ animationDelay: "-4s", transform: `translateY(${scrollY * 0.2}px)` }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Pentagon — right center */}
        <div className="absolute top-[55%] right-[5%] w-14 h-14 animate-geo-spin-slow opacity-[0.06]" style={{ animationDelay: "-8s" }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,3 97,37 79,91 21,91 3,37" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Dark mode: additional subtle shapes */}
        <div className="dark:block hidden absolute top-[70%] right-[25%] w-20 h-20 animate-geo-float opacity-[0.03]" style={{ animationDelay: "-6s" }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" stroke="#22c55e" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* Subtle Dot Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.07,
        }}
      />

      {/* Decorative Globe Element — parallax */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.06] hidden xl:block parallax-slow" style={{ transform: `translateY(${-scrollY * 0.05}px)` }}>
        <Globe className="h-[500px] w-[500px] text-white" strokeWidth={0.5} />
      </div>

      {/* Visitor Counter Badge */}
      <motion.div
        className="hidden lg:flex absolute top-6 right-6 z-10 items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <motion.span
          className="relative flex h-2.5 w-2.5"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
        </motion.span>
        <span className="text-sm font-medium text-green-100">Data Kependudukan</span>
      </motion.div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Time-based greeting */}
            <motion.div
              variants={fadeIn}
              className="flex items-center justify-center lg:justify-start gap-2 text-sm text-green-100/80"
            >
              <greeting.Icon className={`h-4 w-4 ${greeting.colorClass}`} />
              <span>{greeting.text}</span>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm"
            >
              <Building2 className="h-4 w-4" />
              <span>Pemerintah Kabupaten Ngada</span>
              <Sparkles className="h-3 w-3 text-yellow-300/70" />
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight hero-text-shadow"
            >
              Portal Layanan{" "}
              <span className="text-yellow-400">Kependudukan</span> dan
              Pencatatan Sipil
            </motion.h1>

            {/* Live Data Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm text-green-100/90 border border-white/15">
                <motion.span
                  className="relative flex h-2 w-2"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </motion.span>
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Memuat data...
                  </span>
                ) : (
                  <span>
                    melayani <strong className="text-yellow-300">{formatNumber(totalPenduduk)}+</strong> penduduk&nbsp;&middot;&nbsp;12 kecamatan&nbsp;&middot;&nbsp;206 kelurahan
                  </span>
                )}
              </span>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-green-100 max-w-xl mx-auto lg:mx-0"
            >
              Melayani dengan sepenuh hati untuk kemudahan akses layanan
              administrasi kependudukan bagi seluruh masyarakat Kabupaten Ngada.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              variants={fadeIn}
              className="flex justify-center lg:justify-start"
            >
              <CountdownTimer />
            </motion.div>

            {/* Search Bar - opens global search command */}
            <motion.form
              variants={fadeIn}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-md mx-auto lg:mx-0"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari layanan, berita, halaman..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchInputFocus}
                  className="pl-10 bg-white text-gray-900 placeholder:text-gray-500 h-12 shadow-lg shadow-black/20 focus:ring-2 focus:ring-yellow-400/50 cursor-pointer"
                  readOnly
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-12 px-6 font-semibold shadow-lg shadow-yellow-500/20"
              >
                Cari
              </Button>
              <span className="hidden sm:inline-flex items-center self-center text-xs text-green-200/70 select-none ml-1">
                <kbd className="inline-flex items-center rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>
                <kbd className="inline-flex items-center rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] ml-0.5">K</kbd>
              </span>
            </motion.form>

            {/* Quick Actions — Enhanced CTA Buttons */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Link href="/layanan">
                  <Button
                    size="lg"
                    className="relative bg-white text-green-700 hover:bg-green-50 h-12 px-6 font-semibold shadow-lg shadow-black/10 overflow-hidden rounded-xl btn-gradient-border transition-all duration-300 animate-cta-pulse-glow"
                  >
                    {/* Subtle gradient overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white via-green-50/40 to-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <FileText className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">Lihat Layanan</span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Link href="/layanan-online">
                  <Button
                    size="lg"
                    className="bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-green-700 h-12 px-6 font-semibold shadow-lg shadow-black/10 transition-all duration-200 rounded-xl hover:shadow-xl hover:shadow-green-500/20 btn-gradient-border"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    Layanan Online
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Link href="/pengaduan">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-12 px-6 font-semibold shadow-lg shadow-yellow-500/20 hidden sm:inline-flex rounded-xl hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Ajukan Pengaduan
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Preview Row — 3 mini-stat pills with glassmorphism */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2"
            >
              {[
                { label: "171K+ Penduduk", icon: Users },
                { label: "12 Kecamatan", icon: MapPin },
                { label: "50+ Layanan", icon: FileCheck },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + idx * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  className="flex items-center gap-2 stats-preview-pill rounded-full px-4 py-2 cursor-default"
                >
                  <stat.icon className="h-3.5 w-3.5 text-green-300/80" />
                  <span className="text-xs sm:text-sm font-medium text-white/90">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>


          </motion.div>

          {/* Right Content — Leaders & Kadis */}
          <motion.div
            className="flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" as const }}
          >
            <div className="relative w-full max-w-md">
              {/* Decorative blurred orbs */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-green-400/20 rounded-full blur-3xl" />

              {/* ─── Pimpinan Daerah: Bupati & Wakil Bupati ─── */}
              <div className="relative z-10">
                {/* Label badge */}
                <motion.div
                  className="flex justify-center lg:justify-end mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-yellow-300 border border-yellow-400/30 shadow-lg shadow-yellow-400/10">
                    <Shield className="h-3.5 w-3.5" />
                    Pimpinan Daerah
                  </span>
                </motion.div>

                {/* Decorative background pattern — subtle lines behind leaders */}
                <div
                  className="absolute inset-0 -z-10 pointer-events-none rounded-3xl"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Leaders grid — side by side on md+, stacked on mobile */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-0 sm:gap-0">
                  {/* Bupati */}
                  <div className="w-full sm:w-1/2">
                    <LeaderCard
                      name={bupati?.name || "Bupati Kabupaten Ngada"}
                      role="Bupati"
                      periode={bupati?.periode || "2024-2029"}
                      photo={bupati?.photo ?? null}
                      isLoading={loading}
                      fallbackGradient="from-amber-400 to-amber-600"
                      FallbackIcon={Building2}
                      ringColor="from-green-400 via-emerald-400 to-teal-400"
                    />
                  </div>

                  {/* Separator — hidden on mobile, visible on sm+ */}
                  <div className="hidden sm:flex flex-col items-center justify-center self-center px-1">
                    <LeaderSeparator />
                  </div>

                  {/* Mobile separator — horizontal line */}
                  <div className="sm:hidden flex items-center justify-center w-full py-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/30 to-teal-400/30 backdrop-blur-md border border-white/20 flex items-center justify-center mx-3">
                      <Shield className="h-4 w-4 text-yellow-400/80" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  {/* Wakil Bupati */}
                  <div className="w-full sm:w-1/2">
                    <LeaderCard
                      name={wakilBupati?.name || "Wakil Bupati Kabupaten Ngada"}
                      role="Wakil Bupati"
                      periode={wakilBupati?.periode || "2024-2029"}
                      photo={wakilBupati?.photo ?? null}
                      isLoading={loading}
                      fallbackGradient="from-teal-400 to-teal-600"
                      FallbackIcon={Users}
                      ringColor="from-teal-400 via-cyan-400 to-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* ─── Card with glass-morphism — Kadis (Below Bupati & Wakil) ─── */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm mx-auto sm:mx-0 sm:ml-auto mt-5 shadow-xl shadow-black/10">
                <div className="text-center">
                  {loading ? (
                    <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/20">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                  ) : kepalaDinas?.photo ? (
                    <div className="w-32 h-32 mx-auto mb-4">
                      {/* Rotating border animation wrapper */}
                      <div className="relative w-full h-full">
                        <motion.div
                          className="absolute -inset-1 rounded-full"
                          style={{
                            background: "conic-gradient(from 0deg, #4ade80, #22d3ee, #facc15, #4ade80)",
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Inner ring to create border effect */}
                        <div className="absolute inset-0 rounded-full bg-green-800" />
                        {/* Photo with green ring */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-green-800 ring-green-400/30">
                          <Image
                            src={kepalaDinas.photo}
                            alt={kepalaDinas.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4">
                      {/* Rotating border animation wrapper for fallback */}
                      <div className="relative w-full h-full">
                        <motion.div
                          className="absolute -inset-1 rounded-full"
                          style={{
                            background: "conic-gradient(from 0deg, #4ade80, #22d3ee, #facc15, #4ade80)",
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 rounded-full bg-green-800" />
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-2 ring-offset-2 ring-offset-green-800 ring-green-400/30">
                          <Users className="h-16 w-16 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-1">
                    {kepalaDinas?.name || "Kepala Dinas Kependudukan"}
                  </h3>
                  <p className="text-green-200 text-sm mb-4">
                    {kepalaDinas?.position || "dan Pencatatan Sipil"}
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <p className="font-semibold">&ldquo;Melayani dengan Integritas&rdquo;</p>
                    <p className="text-green-200 mt-1">
                      Komitmen kami untuk pelayanan terbaik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Quick View - Glass-morphism Cards with Enhanced Accents */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="col-span-3 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : (
            heroStats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeInUp}
                className="relative bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 shadow-lg shadow-black/10 hover:bg-white/15 transition-colors overflow-hidden"
              >
                {/* Colored top border accent */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient}`} />
                <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {stat.value}
                </p>
                <p className="text-sm text-green-100 mt-1">{stat.label}</p>
                {/* Subtle accent icon below the text */}
                <stat.Icon className={`mx-auto mt-2 h-3.5 w-3.5 ${stat.iconColor} opacity-70`} />
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Periode Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {!loading && data?.ringkasan && (
            <p className="text-center text-green-200 text-sm mt-4">
              Periode: {periode}
            </p>
          )}
        </motion.div>
      </div>

      {/* Scroll Down Indicator — Enhanced with gradient trail */}
      <motion.button
        className="hidden md:flex absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 group cursor-pointer"
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
        aria-label="Scroll ke bawah"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:border-green-400/50 group-hover:shadow-lg group-hover:shadow-green-500/20">
          <ChevronDown className="h-5 w-5 text-white group-hover:text-green-300 transition-colors" />
        </span>
        {/* Gradient trail dots */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-green-400/60 animate-gradient-trail" style={{ animationDelay: "0s" }} />
          <div className="w-0.5 h-0.5 rounded-full bg-green-400/40 animate-gradient-trail" style={{ animationDelay: "0.3s" }} />
          <div className="w-0.5 h-0.5 rounded-full bg-teal-400/30 animate-gradient-trail" style={{ animationDelay: "0.6s" }} />
        </div>
        {/* Semi-transparent white line extending from button to wave divider */}
        <div className="w-px h-16 bg-gradient-to-b from-white/30 via-green-400/15 to-white/5" />
        {/* Animated opacity pulse text */}
        <motion.span
          className="text-xs text-white/50 mt-0"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll ke bawah
        </motion.span>
      </motion.button>

      {/* Wave Divider with dark mode support */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto dark:hidden"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto hidden dark:block"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#111827"
          />
        </svg>
      </div>
    </section>
  );
}
