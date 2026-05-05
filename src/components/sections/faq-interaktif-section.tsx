"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  X,
  HelpCircle,
  TrendingUp,
  FileQuestion,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Data FAQ ──────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  kategori: "KTP" | "KK" | "Akta" | "Pindah" | "Lainnya";
  pertanyaan: string;
  jawaban: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  {
    id: "ktp-1",
    kategori: "KTP",
    pertanyaan: "Berapa lama proses pembuatan KTP-el baru?",
    jawaban:
      "Untuk rekam baru KTP-el, proses memerlukan waktu 3-14 hari kerja karena proses perekaman biometrik dan sinkronisasi data ke pusat. Untuk KTP-el yang sudah pernah direkam (perpanjangan/perbaikan), proses selesai di tempat jika blanko tersedia.",
    tags: ["ktp", "waktu", "proses"],
  },
  {
    id: "ktp-2",
    kategori: "KTP",
    pertanyaan: "Dokumen apa saja yang dibutuhkan untuk pembuatan KTP-el baru?",
    jawaban:
      "Dokumen yang diperlukan: (1) Surat Pengantar RT/RW, (2) Kartu Keluarga (KK) asli, (3) Akta Kelahiran atau Ijazah, (4) Surat Nikah (jika sudah menikah), (5) Pas Foto 2x3 sebanyak 2 lembar. Pemohon harus hadir langsung untuk perekaman biometrik.",
    tags: ["ktp", "dokumen", "syarat"],
  },
  {
    id: "ktp-3",
    kategori: "KTP",
    pertanyaan: "Apakah bisa mengurus KTP dari luar kota?",
    jawaban:
      "Ya, melalui layanan Disdukcapil Online Anda bisa mengajukan permohonan KTP-el dari luar kota. Kunjungi website resmi Disdukcapil Online (disdukcapil-online.kemendagri.go.id) atau gunakan aplikasi Mobile Population Administration (M-Pop). Setelah disetujui, perekaman biometrik bisa dilakukan di Disdukcapil terdekat.",
    tags: ["ktp", "online", "luar kota"],
  },
  {
    id: "ktp-4",
    kategori: "KTP",
    pertanyaan: "Bagaimana jika data KTP saya tidak sesuai?",
    jawaban:
      "Jika terdapat kesalahan data pada KTP-el Anda, segera laporkan ke kantor Disdukcapil dengan membawa: KTP-el asli, Kartu Keluarga, dan dokumen pendukung (ijazah, akta kelahiran, atau surat nikah) sebagai bukti data yang benar. Proses koreksi data memerlukan 1-3 hari kerja setelah verifikasi.",
    tags: ["ktp", "perbaikan", "koreksi"],
  },
  {
    id: "ktp-5",
    kategori: "KTP",
    pertanyaan: "KTP-el hilang, bagaimana cara mengurusnya?",
    jawaban:
      "Untuk KTP-el yang hilang, lapor ke Disdukcapil dengan membawa: Surat Kehilangan dari Kepolisian, KK asli, dan Pas Foto 2x3 (2 lembar). Jika sudah pernah rekam biometrik, prosesnya cepat. Biaya penggantian GRATIS berdasarkan UU No. 24 Tahun 2013.",
    tags: ["ktp", "hilang", "kehilangan"],
  },
  {
    id: "kk-1",
    kategori: "KK",
    pertanyaan: "Berapa lama proses pembuatan Kartu Keluarga baru?",
    jawaban:
      "Proses pembuatan KK baru memerlukan waktu 1-3 hari kerja. Pastikan membawa dokumen persyaratan lengkap: KTP-el anggota keluarga, akta kelahiran seluruh anggota, akta nikah/cerai (jika ada perubahan status), dan surat pengantar RT/RW.",
    tags: ["kk", "waktu", "proses"],
  },
  {
    id: "kk-2",
    kategori: "KK",
    pertanyaan: "Bagaimana cara menambah anggota KK baru?",
    jawaban:
      "Untuk menambah anggota KK (kelahiran anak, menikah, dll.), bawa: KK asli, KTP-el Kepala Keluarga, dokumen pendukung (akta kelahiran untuk anak, akta nikah untuk istri), dan surat pengantar RT/RW. Proses selesai dalam 1-3 hari kerja.",
    tags: ["kk", "tambah", "anggota"],
  },
  {
    id: "kk-3",
    kategori: "KK",
    pertanyaan: "Apakah bisa membuat KK terpisah dari orang tua?",
    jawaban:
      "Ya, bisa membuat KK terpisah dengan syarat: sudah menikah (bagi yang menikah) atau sudah berusia 17 tahun ke atas dan sudah bekerja/menikah. Bawa KTP-el, KK lama, akta nikah (jika menikah), surat pengantar RT/RW, dan surat keterangan kerja.",
    tags: ["kk", "pisah", "baru"],
  },
  {
    id: "akta-1",
    kategori: "Akta",
    pertanyaan: "Bagaimana cara mengurus akta kelahiran?",
    jawaban:
      "Bawa dokumen berikut ke Disdukcapil: (1) Surat Keterangan Kelahiran dari RS/Bidan, (2) KTP kedua orang tua asli, (3) KK asli, (4) Surat Nikah/Buku Nikah asli, (5) Surat Pengantar RT/RW. Proses selesai di hari yang sama jika dokumen lengkap. Batas waktu pelaporan maksimal 60 hari setelah kelahiran.",
    tags: ["akta", "kelahiran", "proses"],
  },
  {
    id: "akta-2",
    kategori: "Akta",
    pertanyaan: "Saya sudah dewasa tapi tidak punya akta kelahiran. Apa yang harus dilakukan?",
    jawaban:
      "Untuk pembuatan akta kelahiran yang terlambat (lebih dari 1 tahun), diperlukan proses yang lebih panjang melalui Pengadilan Negeri terlebih dahulu untuk mendapatkan Penetapan Hakim. Setelah itu, bawa penetapan pengadilan ke Disdukcapil untuk pencatatan. Hubungi kami untuk panduan lebih lanjut.",
    tags: ["akta", "kelahiran", "terlambat", "dewasa"],
  },
  {
    id: "akta-3",
    kategori: "Akta",
    pertanyaan: "Berapa biaya pembuatan akta kelahiran?",
    jawaban:
      "Pembuatan akta kelahiran GRATIS berdasarkan UU No. 24 Tahun 2013 tentang Administrasi Kependudukan dan Peraturan Pemerintah No. 37 Tahun 2006. Tidak dipungut biaya apapun untuk pembuatan akta kelahiran, baik untuk kelahiran pertama maupun selanjutnya.",
    tags: ["akta", "biaya", "gratis"],
  },
  {
    id: "akta-4",
    kategori: "Akta",
    pertanyaan: "Bagaimana cara mengurus akta kematian?",
    jawaban:
      "Bawa dokumen berikut: (1) Surat Keterangan Kematian dari RS/Bidan/Desa, (2) KTP-el almarhum/ahli waris, (3) KK asli, (4) Surat Nikah/Buku Nikah (jika sudah menikah). Laporkan dalam waktu 30 hari sejak kematian. Proses GRATIS dan selesai di hari yang sama.",
    tags: ["akta", "kematian", "proses"],
  },
  {
    id: "pindah-1",
    kategori: "Pindah",
    pertanyaan: "Bagaimana cara pindah ke Kecamatan lain dalam Kabupaten Ngada?",
    jawaban:
      "Untuk pindah antar kecamatan dalam satu kabupaten: (1) Minta surat pengantar RT/RW, (2) Ajukan pindah di Disdukcapil Kecamatan asal, (3) Bawa surat keterangan pindah ke Disdukcapil Kecamatan tujuan, (4) Proses perubahan KK di kecamatan tujuan. Bisa dilakukan secara online melalui Disdukcapil Online.",
    tags: ["pindah", "kecamatan", "dalam kabupaten"],
  },
  {
    id: "pindah-2",
    kategori: "Pindah",
    pertanyaan: "Apa saja dokumen untuk pindah ke luar Kabupaten Ngada?",
    jawaban:
      "Dokumen yang diperlukan: (1) KTP-el asli, (2) KK asli, (3) Surat Pengantar RT/RW, (4) Pas Foto 3x4 (4 lembar), (5) Surat keterangan kerja/kuliah di daerah tujuan (opsional). Proses di Disdukcapil Ngada memerlukan 1-3 hari kerja. Bisa juga diurus online melalui Disdukcapil Online.",
    tags: ["pindah", "luar kota", "dokumen"],
  },
  {
    id: "lainnya-1",
    kategori: "Lainnya",
    pertanyaan: "Apakah seluruh layanan Disdukcapil gratis?",
    jawaban:
      "Ya, sesuai UU No. 24 Tahun 2013 dan kebijakan pemerintah, seluruh layanan administrasi kependudukan TIDAK dipungut biaya apapun. Termasuk pembuatan KTP-el, Kartu Keluarga, Akta Kelahiran, Akta Kematian, Akta Perkawinan, dan layanan lainnya. Jika ada yang meminta biaya, segera laporkan.",
    tags: ["biaya", "gratis", "umum"],
  },
  {
    id: "lainnya-2",
    kategori: "Lainnya",
    pertanyaan: "Apakah bisa diwakilkan pengurusannya?",
    jawaban:
      "Untuk beberapa layanan bisa diwakilkan dengan membawa: (1) Surat Kuasa bermaterai Rp 10.000, (2) KTP dan KK asli pemohon, (3) Identitas penerima kuasa (KTP). Namun untuk perekaman biometrik KTP-el, pemohon HARUS hadir langsung karena perekaman sidik jari dan iris mata.",
    tags: ["wakil", "kuasa", "umum"],
  },
  {
    id: "lainnya-3",
    kategori: "Lainnya",
    pertanyaan: "Jam operasional kantor Disdukcapil?",
    jawaban:
      "Kantor Disdukcapil Kabupaten Ngada buka Senin - Jumat pukul 08.00 - 15.00 WITA. Sabtu, Minggu, dan hari libur nasional TUTUP. Disarankan datang di pagi hari (08.00-10.00) untuk menghindari antrian. Lokasi: Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada.",
    tags: ["jam", "operasional", "waktu"],
  },
  {
    id: "lainnya-4",
    kategori: "Lainnya",
    pertanyaan: "Apakah ada layanan jemput bola?",
    jawaban:
      "Ya, Disdukcapil Kabupaten Ngada menyediakan layanan jemput bola (keliling) untuk wilayah yang jauh dari pusat kota, terutama kecamatan terpencil. Jadwal diinformasikan melalui pengumuman resmi dan media sosial. Anda juga bisa mengajukan permintaan layanan keliling melalui WhatsApp untuk wilayah yang membutuhkan.",
    tags: ["jemput bola", "keliling", "layanan"],
  },
];

const kategoriList = [
  { value: "Semua", label: "Semua", icon: HelpCircle },
  { value: "KTP", label: "KTP", icon: FileQuestion },
  { value: "KK", label: "Kartu Keluarga", icon: FileQuestion },
  { value: "Akta", label: "Akta", icon: FileQuestion },
  { value: "Pindah", label: "Pindah", icon: FileQuestion },
  { value: "Lainnya", label: "Lainnya", icon: HelpCircle },
];

const popularQuestions = [
  "Apakah seluruh layanan gratis?",
  "Berapa lama proses KTP-el baru?",
  "Dokumen untuk akta kelahiran?",
  "Cara pindah ke luar kabupaten?",
  "KTP hilang, bagaimana caranya?",
];

// ─── Animation Variants ────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.15 + i * 0.06, ease: "easeOut" as const },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Component ─────────────────────────────────────────────────────────

export function FAQInteraktifSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [activeKategori, setActiveKategori] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    let items = faqData;

    if (activeKategori !== "Semua") {
      items = items.filter((f) => f.kategori === activeKategori);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (f) =>
          f.pertanyaan.toLowerCase().includes(query) ||
          f.jawaban.toLowerCase().includes(query) ||
          f.tags.some((t) => t.includes(query))
      );
    }

    return items;
  }, [activeKategori, searchQuery]);

  const handlePopularClick = (q: string) => {
    setSearchQuery(q.toLowerCase());
    setActiveKategori("Semua");
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      aria-labelledby="faq-interaktif-title"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 2L26 14L14 26L2 14Z' fill='none' stroke='%2315803d' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" />
            Tanya Jawab
          </span>
          <h2
            id="faq-interaktif-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Tanya Jawab Interaktif
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Temukan jawaban untuk pertanyaan seputar layanan kependudukan.
            Pilih kategori atau gunakan pencarian untuk menemukan informasi yang Anda butuhkan.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="relative bg-gray-50/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-700/60 transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 dark:focus-within:border-green-600 shadow-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Ketik pertanyaan atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus-visible:border-0"
                aria-label="Cari pertanyaan"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kategori FAQ">
              {kategoriList.map((kat) => {
                const KatIcon = kat.icon;
                return (
                  <button
                    key={kat.value}
                    role="tab"
                    aria-selected={activeKategori === kat.value}
                    onClick={() => setActiveKategori(kat.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeKategori === kat.value
                        ? "bg-green-600 text-white shadow-sm shadow-green-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <KatIcon className="h-3.5 w-3.5" />
                    {kat.label}
                    {kat.value !== "Semua" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeKategori === kat.value
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {faqData.filter((f) => f.kategori === kat.value).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Accordion with animation */}
          <div>
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-2.5">
                {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      layout
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <AccordionItem
                        value={faq.id}
                        className="border border-gray-200/80 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-green-500/5 dark:hover:shadow-green-400/5 hover:border-green-200 dark:hover:border-green-800/60 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm"
                      >
                        <AccordionTrigger className="px-5 py-4 md:px-5 hover:bg-green-50/50 dark:hover:bg-green-900/20 hover:no-underline transition-colors duration-200 [&[data-state=open]]:bg-green-50/70 dark:[&[data-state=open]]:bg-green-900/30">
                          <div className="flex items-start gap-3 text-left">
                            <Badge
                              variant="outline"
                              className={`flex-shrink-0 text-[10px] px-1.5 py-0 font-medium mt-0.5 ${
                                faq.kategori === "KTP"
                                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                  : faq.kategori === "KK"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                  : faq.kategori === "Akta"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                  : faq.kategori === "Pindah"
                                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                                  : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                              }`}
                            >
                              {faq.kategori}
                            </Badge>
                            <span className="text-sm md:text-[0.9rem] font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                              {faq.pertanyaan}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4 md:px-5">
                          <div className="pl-[calc(theme(spacing.12)+0.75rem)] text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-[0.9rem]">
                            {faq.jawaban}
                          </div>
                          <div className="pl-[calc(theme(spacing.12)+0.75rem)] mt-3 flex flex-wrap gap-1.5">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
              </Accordion>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <MessageSquare className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                  Tidak ada pertanyaan yang cocok
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Coba kata kunci lain atau pilih kategori berbeda
                </p>
              </motion.div>
            )}
          </div>

          {/* Popular Questions + CTA */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {/* Popular Questions */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-gray-200/80 dark:border-gray-700/50 h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Pertanyaan Populer
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {popularQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handlePopularClick(q)}
                        className="flex items-center gap-2 text-left w-full p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors group"
                      >
                        <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
                        <span className="flex-1">{q}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* No Answer Found CTA */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-teal-50/80 dark:from-green-950/30 dark:to-teal-950/20 border-green-200/80 dark:border-green-800/50 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Tidak Menemukan Jawaban?
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3 leading-relaxed">
                        Sampaikan pertanyaan atau kendala Anda melalui formulir
                        pengaduan dan tim kami akan merespons sesegera mungkin.
                      </p>
                      <Link href="/pengaduan">
                        <Button className="gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Sampaikan Pengaduan
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
