"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { HelpCircle, MessageCircle, Search, SearchX, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Apakah seluruh layanan Disdukcapil gratis?",
    answer:
      "Ya, sesuai UU No. 24 Tahun 2013 dan kebijakan pemerintah, seluruh layanan administrasi kependudukan TIDAK dipungut biaya apapun. Termasuk pembuatan KTP-el, Kartu Keluarga, Akta Kelahiran, dan layanan lainnya.",
  },
  {
    question: "Dokumen apa saja yang perlu dibawa?",
    answer:
      "Untuk umumnya, Anda perlu membawa: KTP asli, Kartu Keluarga asli, dan fotokopi masing-masing. Untuk layanan tertentu mungkin diperlukan dokumen tambahan. Silakan cek halaman detail layanan untuk informasi lengkap.",
  },
  {
    question: "Berapa lama proses pembuatan KTP-el?",
    answer:
      "Untuk KTP-el yang sudah pernah direkam (perpanjangan/perbaikan), proses selesai di tempat. Untuk rekam baru KTP-el, memerlukan waktu 3-5 hari kerja karena proses perekaman biometrik dan sinkronisasi data ke pusat.",
  },
  {
    question: "Bagaimana cara mengurus akta kelahiran?",
    answer:
      "Bawa surat keterangan kelahiran dari rumah sakit/bidan, KTP kedua orang tua, dan Kartu Keluarga asli beserta fotokopi ke kantor Disdukcapil. Proses selesai di hari yang sama jika persyaratan lengkap.",
  },
  {
    question: "Apakah bisa diwakilkan?",
    answer:
      "Untuk beberapa layanan bisa diwakilkan dengan membawa surat kuasa bermaterai, KTP dan KK asil pemohon, serta identitas penerima kuasa. Namun untuk perekaman biometrik KTP-el, pemohon harus hadir langsung.",
  },
  {
    question: "Jam operasional kantor Disdukcapil?",
    answer:
      "Senin - Jumat: 08.00 - 15.00 WITA. Kantor berlokasi di Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada.",
  },
  {
    question: "Apakah bisa mengurus KTP dari luar kota?",
    answer:
      "Ya, melalui layanan Disdukcapil Online Anda bisa mengajukan permohonan KTP-el dari luar kota. Kunjungi website resmi Disdukcapil Online (disdukcapil-online.kemendagri.go.id) atau gunakan aplikasi Mobile Population Administration (M-Pop). Setelah permohonan disetujui, Anda dapat melakukan perekaman biometrik di Disdukcapil terdekat di kota Anda.",
  },
  {
    question: "Bagaimana jika data KTP saya tidak sesuai?",
    answer:
      "Jika terdapat kesalahan data pada KTP-el Anda, segera laporkan ke kantor Disdukcapil Kabupaten Ngada dengan membawa KTP-el asli, Kartu Keluarga, dan dokumen pendukung (ijazah, akta kelahiran, atau surat nikah) sebagai bukti data yang benar. Proses koreksi data biasanya memerlukan 1-3 hari kerja setelah verifikasi.",
  },
  {
    question: "Berapa lama proses pembuatan Kartu Keluarga?",
    answer:
      "Proses pembuatan Kartu Keluarga (KK) baru atau perubahan data KK memerlukan waktu 1-3 hari kerja. Pastikan membawa dokumen persyaratan lengkap: KTP-el anggota keluarga, akta kelahiran, akta nikah/cerai (jika ada perubahan status), dan surat pengantar RT/RW.",
  },
  {
    question: "Apakah ada layanan jemput bola?",
    answer:
      "Ya, Disdukcapil Kabupaten Ngada menyediakan layanan jemput bola (keliling) untuk wilayah-wilayah yang jauh dari pusat kota, terutama kecamatan-kecamatan terpencil. Jadwal jemput bola diinformasikan melalui pengumuman resmi dan media sosial Disdukcapil. Anda juga bisa mengajukan permintaan layanan keliling melalui WhatsApp untuk wilayah yang membutuhkan.",
  },
];

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
    transition: {
      duration: 0.5,
      delay: 0.2 + i * 0.08,
      ease: "easeOut" as const,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const floatOrb = {
  hidden: { opacity: 0 },
  animate: (i: number) => ({
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.2, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: i,
    },
  }),
};

export function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <section ref={sectionRef} className="bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* ── Gradient Hero Banner ── */}
      <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
        {/* SVG Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0L26 14L14 26L2 14Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Animated gradient orbs */}
        <motion.div
          custom={0}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute top-2 left-1/4 w-44 h-44 bg-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          custom={1.5}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute bottom-0 right-1/4 w-52 h-52 bg-teal-400/15 rounded-full blur-3xl"
        />
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                FAQ
              </h1>
              <p className="text-green-200/80 text-sm mt-0.5">
                Pertanyaan yang sering diajukan masyarakat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative py-16 md:py-24">
        {/* Decorative dot pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='1.5' fill='%23059669'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/40 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-16 w-4 h-4 border-2 border-green-400/15 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-20 w-3 h-3 bg-teal-400/15 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-1/2 right-12 w-5 h-5 border border-green-400/10 rounded-md hidden lg:block"
        />

        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2 animated-underline inline-block">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Temukan jawaban untuk pertanyaan umum seputar layanan administrasi
              kependudukan
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative bg-gray-50/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-700/60 transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500 dark:focus-within:border-green-600 focus-within:shadow-lg focus-within:shadow-green-500/10 shadow-sm">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus-visible:border-0"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                <AnimatePresence>
                  {filteredFaqs.map((faq, index) => {
                    const originalIndex = faqs.indexOf(faq);
                    return (
                      <motion.div
                        key={originalIndex}
                        layout
                        layoutId={`faq-item-${originalIndex}`}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        exit="exit"
                        className="group"
                      >
                        <AccordionItem
                          value={`faq-${originalIndex}`}
                          className="border border-gray-200/80 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 dark:hover:shadow-green-400/5 hover:border-green-200 dark:hover:border-green-800/60 bg-white/80 dark:bg-gray-800/40 backdrop-blur-md relative"
                        >
                          {/* Gradient left border accent on hover */}
                          <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-gradient-to-b from-green-500 to-teal-500 transition-all duration-300 rounded-l-xl" />
                          <AccordionTrigger className="px-5 py-5 md:px-6 md:py-5 hover:bg-green-50/50 dark:hover:bg-green-900/20 hover:no-underline transition-all duration-300 [&[data-state=open]]:bg-green-50/70 dark:[&[data-state=open]]:bg-green-900/30 [&>svg]:text-green-600 dark:[&>svg]:text-green-400">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-400 dark:to-teal-500 text-white text-xs font-bold shadow-sm ring-1 ring-inset ring-green-600/10 dark:ring-green-400/10 group-hover:shadow-md group-hover:shadow-green-500/25 transition-shadow duration-300">
                                {originalIndex + 1}
                              </span>
                              <span className="text-left text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-5 pb-5 md:px-6 md:pb-6">
                            <div className="pl-10 text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </Accordion>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <SearchX className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                  Tidak ada pertanyaan yang cocok
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Coba kata kunci lain
                </p>
              </motion.div>
            )}
          </div>

          {/* Bottom CTA Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" as const }}
            className="max-w-3xl mx-auto mt-10"
          >
            <Card className="bg-gradient-to-br from-green-50 to-teal-50/80 dark:from-green-950/30 dark:to-teal-950/20 border-green-200/80 dark:border-green-800/50 overflow-hidden shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50 flex items-center justify-center ring-1 ring-green-200/50 dark:ring-green-800/30 shadow-sm">
                    <MessageCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Masih Punya Pertanyaan?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                      Hubungi kami melalui WhatsApp untuk konsultasi langsung
                    </p>
                  </div>
                  <Link
                    href="https://wa.me/6238221073?text=Halo%20Disdukcapil%20Ngada%2C%20saya%20ingin%20bertanya%20tentang%20layanan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat WhatsApp
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
