"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, FileText, Users, Building2, Loader2, Globe, ClipboardList, BookOpen, ChevronDown, IdCard, FileCheck, Sun, Sunset, Moon } from "lucide-react";
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

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(getTimeGreeting);

  useEffect(() => {
    setGreeting(getTimeGreeting());
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

  return (
    <section className="relative overflow-hidden text-white">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900 animate-hero-gradient" />

      {/* Floating Particles - CSS animated for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-green-400/[0.07] animate-float-1 blur-xl" />
        <div className="absolute top-[60%] left-[70%] w-40 h-40 rounded-full bg-teal-400/[0.06] animate-float-2 blur-xl" />
        <div className="absolute top-[30%] left-[80%] w-24 h-24 rounded-full bg-yellow-400/[0.05] animate-float-3 blur-xl" />
        <div className="absolute top-[75%] left-[25%] w-28 h-28 rounded-full bg-green-300/[0.06] animate-float-4 blur-xl" />
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

      {/* Decorative Globe Element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.06] hidden xl:block">
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
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm"
            >
              <Building2 className="h-4 w-4" />
              <span>Pemerintah Kabupaten Ngada</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
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

            {/* Quick Actions */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/layanan">
                  <Button
                    size="lg"
                    className="relative bg-white text-green-700 hover:bg-green-50 h-12 px-6 font-semibold shadow-lg shadow-black/10 overflow-hidden"
                  >
                    {/* Subtle gradient overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white via-green-50/40 to-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <FileText className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">Lihat Layanan</span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/layanan-online">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-700 h-12 px-6 font-semibold shadow-lg shadow-black/10"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    Layanan Online
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/pengaduan">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-12 px-6 font-semibold shadow-lg shadow-yellow-500/20 hidden sm:inline-flex"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Ajukan Pengaduan
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Category Quick Links */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2"
            >
              <Link href="/layanan?kategori=Pendaftaran+Penduduk">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-10 px-4 bg-transparent"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Pendaftaran Penduduk
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
              <Link href="/layanan?kategori=Pencatatan+Sipil">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-10 px-4 bg-transparent"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Pencatatan Sipil
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Head of Dinas */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" as const }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-green-400/20 rounded-full blur-3xl" />

              {/* Card with glass-morphism */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm shadow-xl shadow-black/10">
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

              {/* Bupati & Wakil Bupati Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {/* Bupati Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg shadow-black/10 text-center hover:bg-white/15 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <div className="relative w-full h-full">
                      <motion.div
                        className="absolute -inset-0.5 rounded-full"
                        style={{
                          background: "conic-gradient(from 0deg, #4ade80, #22d3ee, #facc15, #4ade80)",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 rounded-full bg-green-800" />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-offset-2 ring-offset-green-800 ring-amber-400/30">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm leading-tight">Bupati Kabupaten Ngada</h4>
                  <p className="text-green-200 text-xs mt-0.5">Bupati</p>
                </div>

                {/* Wakil Bupati Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg shadow-black/10 text-center hover:bg-white/15 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <div className="relative w-full h-full">
                      <motion.div
                        className="absolute -inset-0.5 rounded-full"
                        style={{
                          background: "conic-gradient(from 0deg, #4ade80, #22d3ee, #facc15, #4ade80)",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 rounded-full bg-green-800" />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center ring-2 ring-offset-2 ring-offset-green-800 ring-teal-400/30">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm leading-tight">Wakil Bupati Kabupaten Ngada</h4>
                  <p className="text-green-200 text-xs mt-0.5">Wakil Bupati</p>
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

      {/* Scroll Down Indicator */}
      <motion.button
        className="hidden md:flex absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 group cursor-pointer"
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
        aria-label="Scroll ke bawah"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm opacity-70 group-hover:opacity-100 transition-opacity">
          <ChevronDown className="h-5 w-5 text-white" />
        </span>
        {/* Semi-transparent white line extending from button to wave divider */}
        <div className="w-px h-16 bg-gradient-to-b from-white/30 to-white/5" />
        {/* Animated opacity pulse text */}
        <motion.span
          className="text-xs text-white/50 mt-0"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll ke bawah
        </motion.span>
      </motion.button>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
