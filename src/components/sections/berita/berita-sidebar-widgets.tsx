"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Tag,
  Calendar,
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Archive,
  Newspaper,
  ChevronRight,
  ExternalLink,
  Rss,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_INFO } from "@/lib/constants";

// ─── Animation Variants ───────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// ─── Static Data ──────────────────────────────────────────────────
const popularNews = [
  { id: "1", title: "Pelayanan KTP-el Kini Selesai di Tempat", date: "15 Jan 2025", views: 1245, slug: "pelayanan-ktp-selesai-tempat" },
  { id: "2", title: "Jadwal Pelayanan Libur Natal dan Tahun Baru 2025", date: "20 Des 2024", views: 983, slug: "jadwal-libur-nataru" },
  { id: "3", title: "Disdukcapil Ngada Raih Penghargaan Pelayanan Publik", date: "10 Nov 2024", views: 876, slug: "penghargaan-pelayanan-publik" },
  { id: "4", title: "Inovasi Layanan Online: Cek Status Pengajuan Langsung", date: "5 Okt 2024", views: 754, slug: "inovasi-cek-status-online" },
  { id: "5", title: "Sosialisasi Program Pembuatan KTP untuk Warga Terdampak Bencana", date: "28 Sep 2024", views: 612, slug: "sosialisasi-ktp-bencana" },
];

const categories = [
  { name: "Pengumuman", count: 3, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { name: "Kegiatan", count: 5, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Informasi", count: 8, color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  { name: "Inovasi", count: 4, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { name: "Layanan Publik", count: 6, color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300" },
];

const archives = [
  { month: "Januari 2025", count: 4 },
  { month: "Desember 2024", count: 6 },
  { month: "November 2024", count: 3 },
  { month: "Oktober 2024", count: 5 },
  { month: "September 2024", count: 4 },
  { month: "Agustus 2024", count: 2 },
];

const tagCloud = [
  { name: "KTP-el", size: "text-sm", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Kartu Keluarga", size: "text-base", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  { name: "Akta Kelahiran", size: "text-sm", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { name: "Pelayanan Online", size: "text-base", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { name: "Gratis", size: "text-lg", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Ngada", size: "text-sm", color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300" },
  { name: "Bajawa", size: "text-xs", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  { name: "Rekaman Biometrik", size: "text-sm", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { name: "Pindah Domisili", size: "text-base", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { name: "Perkawinan", size: "text-xs", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Inovasi", size: "text-sm", color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300" },
  { name: "UU No. 24/2013", size: "text-base", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
];

const rankColors = [
  "bg-green-600 text-white",
  "bg-green-500 text-white",
  "bg-emerald-500 text-white",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
];

// ─── Widget: Berita Populer ───────────────────────────────────────
function BeritaPopulerWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Green accent header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Berita Populer
        </CardTitle>
      </div>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800" role="list" aria-label="Daftar berita populer">
          {popularNews.map((item, index) => (
            <li key={item.id}>
              <Link
                href={`/berita/${item.slug}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
              >
                {/* Rank Number */}
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${rankColors[index]}`}
                  aria-label={`Peringkat ${index + 1}`}
                >
                  {index + 1}
                </span>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Kategori ─────────────────────────────────────────────
function KategoriWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Kategori
        </CardTitle>
      </div>
      <CardContent className="p-3">
        <ul className="space-y-1" role="list" aria-label="Daftar kategori berita">
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group cursor-pointer text-left"
                aria-label={`${cat.name}: ${cat.count} artikel`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors font-medium">
                    {cat.name}
                  </span>
                </div>
                <Badge variant="secondary" className={`text-xs font-bold px-2 py-0.5 ${cat.color}`}>
                  {cat.count}
                </Badge>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Arsip ────────────────────────────────────────────────
function ArsipWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Archive className="h-4 w-4" />
          Arsip
        </CardTitle>
      </div>
      <CardContent className="p-3">
        <ul className="space-y-0.5" role="list" aria-label="Arsip berita bulanan">
          {archives.map((archive) => (
            <li key={archive.month}>
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {archive.month}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 font-medium">
                  {archive.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Tags ─────────────────────────────────────────────────
function TagsWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </CardTitle>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2" role="list" aria-label="Tag populer">
          {tagCloud.map((tag) => (
            <button
              key={tag.name}
              className={`inline-flex items-center ${tag.size} ${tag.color} px-3 py-1.5 rounded-full font-medium hover:shadow-sm transition-all duration-200 cursor-pointer hover:scale-105`}
              aria-label={`Tag: ${tag.name}`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Newsletter ───────────────────────────────────────────
function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Rss className="h-4 w-4" />
          Newsletter
        </CardTitle>
      </div>
      <CardContent className="p-4">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Terima kasih telah berlangganan!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Anda akan menerima info terbaru kami.
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Dapatkan berita dan informasi terbaru langsung ke email Anda.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Alamat email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  aria-label="Alamat email untuk newsletter"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button
                type="submit"
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-sm font-medium"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Berlangganan
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Widget: Kontak Cepat ─────────────────────────────────────────
function KontakCepatWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Kontak Cepat
        </CardTitle>
      </div>
      <CardContent className="p-3 space-y-2">
        {/* WhatsApp */}
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors group"
          aria-label="Hubungi via WhatsApp"
        >
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">WhatsApp</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{CONTACT_INFO.whatsappDisplay}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Email */}
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors group"
          aria-label="Kirim email"
        >
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{CONTACT_INFO.email}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Phone */}
        <a
          href={`tel:${CONTACT_INFO.phoneRaw}`}
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-teal-50 dark:bg-teal-900/10 hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-colors group"
          aria-label="Hubungi via telepon"
        >
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Telepon</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{CONTACT_INFO.phone}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </CardContent>
    </Card>
  );
}

// ─── Main Export: BeritaSidebarWidgets ────────────────────────────
export function BeritaSidebarWidgets() {
  return (
    <>
      {/* Desktop: Stacked sidebar */}
      <motion.aside
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="hidden lg:block space-y-5"
        aria-label="Sidebar berita"
      >
        <motion.div variants={fadeInUp}>
          <BeritaPopulerWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <KategoriWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <ArsipWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <TagsWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <NewsletterWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <KontakCepatWidget />
        </motion.div>
      </motion.aside>

      {/* Mobile: Horizontal scrollable section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="lg:hidden"
        aria-label="Widget berita"
      >
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <BeritaPopulerWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[260px]">
            <KategoriWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[260px]">
            <ArsipWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[260px]">
            <TagsWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[260px]">
            <NewsletterWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[260px]">
            <KontakCepatWidget />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
