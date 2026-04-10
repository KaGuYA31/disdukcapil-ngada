"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, FileText, Newspaper, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const quickLinks = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Layanan", href: "/layanan", icon: FileText },
  { label: "Berita", href: "/berita", icon: Newspaper },
  { label: "Profil", href: "/profil", icon: Building2 },
];

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/berita?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Centered 404 Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl w-full text-center space-y-8"
          >
            {/* Large 404 Number */}
            <motion.div variants={fadeInUp}>
              <span className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent select-none">
                404
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              Halaman Tidak Ditemukan
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-md mx-auto"
            >
              Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-md mx-auto"
            >
              <Input
                type="search"
                placeholder="Cari berita atau informasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-800 flex-shrink-0"
              >
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </motion.form>

            {/* Quick Links Grid */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto"
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all duration-200 group"
                >
                  <link.icon className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </motion.div>

            {/* Primary CTA Button */}
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-base"
              >
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
