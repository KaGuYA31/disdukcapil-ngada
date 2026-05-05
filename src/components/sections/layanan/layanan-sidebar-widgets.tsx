"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Users,
  Baby,
  Heart,
  FileText,
  RefreshCw,
  Stamp,
  Gavel,
  MoveRight,
  Download,
  FileDown,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  Clock,
  Mail,
  ExternalLink,
  Lightbulb,
  FileCheck,
  AlertTriangle,
  Timer,
  MapPin,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CONTACT_INFO, OPERATING_HOURS } from "@/lib/constants";

// ─── Animation Variants ───────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// ─── Static Data ──────────────────────────────────────────────────
const relatedServices = [
  { id: "ktp-el", title: "KTP-el", description: "Kartu Tanda Penduduk Elektronik", icon: CreditCard, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { id: "kartu-keluarga", title: "Kartu Keluarga", description: "Dokumen susunan keluarga", icon: Users, color: "text-teal-600 dark:text-teal-400", bgColor: "bg-teal-100 dark:bg-teal-900/30" },
  { id: "akta-kelahiran", title: "Akta Kelahiran", description: "Catatan sipil kelahiran", icon: Baby, color: "text-pink-600 dark:text-pink-400", bgColor: "bg-pink-100 dark:bg-pink-900/30" },
  { id: "perubahan-data", title: "Perubahan Data", description: "Pemutakhiran data kependudukan", icon: RefreshCw, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
];

const downloadableForms = [
  { name: "Formulir F-1.01 - Permohonan KTP-el", fileType: "PDF", size: "250 KB", icon: FileDown },
  { name: "Formulir F-1.15 - Perubahan Data", fileType: "PDF", size: "180 KB", icon: FileDown },
  { name: "Formulir F-1.29 - Pindah Datang", fileType: "PDF", size: "200 KB", icon: FileDown },
  { name: "Ceklis Persyaratan", fileType: "XLSX", size: "45 KB", icon: FileSpreadsheet },
  { name: "Surat Pernyataan", fileType: "DOCX", size: "120 KB", icon: FileText },
];

const faqItems = [
  { question: "Apakah layanan ini dikenakan biaya?", answer: "Tidak. Seluruh layanan administrasi kependudukan GRATIS sesuai UU No. 24 Tahun 2013." },
  { question: "Berapa lama proses pengerjaannya?", answer: "Sebagian besar layanan selesai di tempat pada hari yang sama. Untuk rekam biometrik baru, memerlukan waktu 3-5 hari kerja." },
  { question: "Apakah wajib datang sendiri?", answer: "Ya, untuk perekaman biometrik (sidik jari, iris mata, foto), pemohon wajib hadir secara langsung ke kantor Disdukcapil." },
  { question: "Dokumen apa saja yang harus dibawa?", answer: "Bawa dokumen asli dan fotokopi persyaratan. Pastikan fotokopi dalam kondisi jelas dan terbaca." },
];

const helpfulTips = [
  { icon: FileCheck, text: "Bawa dokumen asli dan fotokopi lengkap", color: "from-green-500 to-emerald-500" },
  { icon: Timer, text: "Datang pagi (08.00) untuk antrian cepat", color: "from-amber-500 to-yellow-500" },
  { icon: UserCheck, text: "Pemohon wajib hadir sendiri untuk perekaman", color: "from-teal-500 to-cyan-500" },
  { icon: AlertTriangle, text: "Jangan percaya calo, semua layanan GRATIS", color: "from-red-500 to-rose-500" },
];

// ─── Widget: Layanan Terkait ──────────────────────────────────────
function LayananTerkaitWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Layanan Terkait
        </CardTitle>
      </div>
      <CardContent className="p-3 space-y-2">
        {relatedServices.map((service) => {
          const ServiceIcon = service.icon;
          return (
            <Link key={service.id} href={`/layanan/${service.id}`}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group cursor-pointer"
              >
                <div className={`w-9 h-9 ${service.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <ServiceIcon className={`h-4.5 w-4.5 ${service.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {service.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {service.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Widget: Unduh Formulir ───────────────────────────────────────
function UnduhFormulirWidget() {
  const fileTypeColors: Record<string, string> = {
    PDF: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    XLSX: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    DOCX: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Download className="h-4 w-4" />
          Unduh Formulir
        </CardTitle>
      </div>
      <CardContent className="p-3">
        <ul className="space-y-1" role="list" aria-label="Daftar formulir yang dapat diunduh">
          {downloadableForms.map((form, index) => {
            const FormIcon = form.icon;
            return (
              <li key={index}>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer text-left"
                  aria-label={`Unduh ${form.name} (${form.size})`}
                >
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                    <FormIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {form.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 font-bold ${fileTypeColors[form.fileType] || "bg-gray-100 text-gray-600"}`}>
                        {form.fileType}
                      </Badge>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{form.size}</span>
                    </div>
                  </div>
                  <Download className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-all" />
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Widget: FAQ Layanan ──────────────────────────────────────────
function FaqLayananWidget() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQ Layanan
        </CardTitle>
      </div>
      <CardContent className="p-3">
        <div className="space-y-1">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-green-700 dark:text-green-400">{index + 1}</span>
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1 line-clamp-1">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                    role="region"
                  >
                    <div className="px-3 pb-2.5 pl-10">
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Bantuan ──────────────────────────────────────────────
function BantuanWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Bantuan
        </CardTitle>
      </div>
      <CardContent className="p-4 space-y-4">
        {/* Contact Info */}
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Telepon</p>
              <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-sm text-gray-800 dark:text-gray-200 font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors">
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-gray-800 dark:text-gray-200 font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors break-all">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Alamat</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Operating Hours */}
        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Jam Operasional</p>
            <div className="space-y-0.5">
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs text-gray-600 dark:text-gray-400">Senin - Jumat</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{OPERATING_HOURS.weekdays.hours}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs text-gray-600 dark:text-gray-400">Sabtu - Minggu</span>
                <span className="text-xs font-semibold text-red-500">Tutup</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* WhatsApp CTA */}
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          aria-label="Hubungi kami via WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          Chat via WhatsApp
        </a>
      </CardContent>
    </Card>
  );
}

// ─── Widget: Tips ─────────────────────────────────────────────────
function TipsWidget() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 px-4 py-3">
        <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Tips Penting
        </CardTitle>
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          {helpfulTips.map((tip, index) => {
            const TipIcon = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20"
              >
                <div className={`w-7 h-7 bg-gradient-to-br ${tip.color} rounded-md flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <TipIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {tip.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Export: LayananSidebarWidgets ───────────────────────────
export function LayananSidebarWidgets() {
  return (
    <>
      {/* Desktop: Stacked sidebar */}
      <motion.aside
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="hidden lg:block space-y-5"
        aria-label="Sidebar layanan"
      >
        <motion.div variants={fadeInUp}>
          <LayananTerkaitWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <UnduhFormulirWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <FaqLayananWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <TipsWidget />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <BantuanWidget />
        </motion.div>
      </motion.aside>

      {/* Mobile: Horizontal scrollable section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="lg:hidden"
        aria-label="Widget layanan"
      >
        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <LayananTerkaitWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <UnduhFormulirWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <FaqLayananWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <TipsWidget />
          </motion.div>
          <motion.div variants={fadeInUp} className="snap-start flex-shrink-0 w-[280px]">
            <BantuanWidget />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
