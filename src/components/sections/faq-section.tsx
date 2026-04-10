"use client";

import { useRef } from "react";
import { HelpCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      "Senin - Kamis: 08.00 - 15.30 WITA, Jumat: 08.00 - 16.00 WITA. Kantor berlokasi di Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada.",
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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
      ease: "easeOut",
    },
  }),
};

export function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-gray-600 mt-4">
            Temukan jawaban untuk pertanyaan umum seputar layanan administrasi
            kependudukan
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <AccordionItem
                  value={`faq-${index}`}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <AccordionTrigger className="px-5 py-5 md:px-6 md:py-5 hover:bg-gray-50 hover:no-underline transition-colors duration-200 [&[data-state=open]]:bg-green-50/50">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-left text-sm md:text-base font-semibold text-gray-800">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 md:px-6 md:pb-6">
                    <div className="pl-10 text-gray-600 leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
