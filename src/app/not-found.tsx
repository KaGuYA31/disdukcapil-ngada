"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, FileText, Newspaper, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  { label: "Beranda", href: "/", icon: Home, description: "Kembali ke halaman utama" },
  { label: "Layanan", href: "/layanan", icon: FileText, description: "Daftar layanan tersedia" },
  { label: "Berita", href: "/berita", icon: Newspaper, description: "Informasi terbaru" },
  { label: "Pengaduan", href: "/pengaduan", icon: MessageSquare, description: "Sampaikan keluhan Anda" },
];

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/layanan?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            className="max-w-2xl w-full text-center space-y-8"
          >
            {/* Large 404 Number */}
            <motion.div variants={fadeInUp}>
              <span className="text-8xl md:text-9xl font-extrabold text-green-100 select-none leading-none">
                404
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-gray-900"
            >
              Halaman Tidak Ditemukan
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 text-base md:text-lg max-w-md mx-auto"
            >
              Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari layanan atau informasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-800 flex-shrink-0"
              >
                Cari
              </Button>
            </motion.form>

            {/* Quick Links Cards */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto"
            >
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="hover:border-green-400 hover:shadow-md transition-all duration-200 group cursor-pointer bg-white h-full">
                    <CardContent className="flex flex-col items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <link.icon className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                        {link.label}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {link.description}
                      </span>
                    </CardContent>
                  </Card>
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
