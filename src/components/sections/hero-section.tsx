"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, FileText, Users, Building2, Loader2, Globe, ClipboardList, BookOpen } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      ease: "easeOut",
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<BerandaData | null>(null);
  const [loading, setLoading] = useState(true);

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
      window.location.href = `/layanan?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Data dari database
  const totalPenduduk = data?.ringkasan?.totalPenduduk || 0;
  const cakupanAkta = data?.dokumen?.cakupanAkta || 0;
  const periode = data?.ringkasan?.periode || "-";

  const heroStats = [
    { label: "Total Penduduk", value: formatNumber(totalPenduduk) },
    { label: "Jenis Layanan", value: "10" },
    { label: "Cakupan Akta", value: `${cakupanAkta.toFixed(1)}%` },
  ];

  const kepalaDinas = data?.kepalaDinas;

  return (
    <section className="relative overflow-hidden text-white">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900 animate-hero-gradient" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative Globe Element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.06] hidden xl:block">
        <Globe className="h-[500px] w-[500px] text-white" strokeWidth={0.5} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
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

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-green-100 max-w-xl mx-auto lg:mx-0"
            >
              Melayani dengan sepenuh hati untuk kemudahan akses layanan
              administrasi kependudukan bagi seluruh masyarakat Kabupaten Ngada.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              variants={fadeIn}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-md mx-auto lg:mx-0"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-gray-900 placeholder:text-gray-500 h-12 shadow-lg shadow-black/20 focus:ring-2 focus:ring-yellow-400/50"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-12 px-6 font-semibold shadow-lg shadow-yellow-500/20"
              >
                Cari
              </Button>
            </motion.form>

            {/* Quick Actions */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link href="/layanan">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 h-12 px-6 font-semibold shadow-lg shadow-black/10"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Lihat Layanan
                </Button>
              </Link>
              <Link href="/pengaduan">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-12 px-6 font-semibold shadow-lg shadow-yellow-500/20"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Ajukan Pengaduan
                </Button>
              </Link>
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
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
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
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-white/20">
                      <Image
                        src={kepalaDinas.photo}
                        alt={kepalaDinas.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/20">
                      <Users className="h-16 w-16 text-white" />
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

        {/* Stats Quick View - Glass-morphism Cards */}
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
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 shadow-lg shadow-black/10 hover:bg-white/15 transition-colors"
              >
                <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {stat.value}
                </p>
                <p className="text-sm text-green-100 mt-1">{stat.label}</p>
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
