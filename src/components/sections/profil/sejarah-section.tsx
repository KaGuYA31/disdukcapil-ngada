"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const timelineItemLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const timelineItemRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const timeline = [
  {
    year: "1958",
    title: "Pembentukan Kabupaten Ngada",
    description:
      "Kabupaten Ngada dibentuk sebagai salah satu kabupaten di Provinsi Nusa Tenggara Timur berdasarkan Undang-Undang Nomor 69 Tahun 1958.",
  },
  {
    year: "1966",
    title: "Pembentukan Kantor Catatan Sipil",
    description:
      "Kantor Catatan Sipil didirikan untuk mengelola pencatatan kelahiran, kematian, dan perkawinan masyarakat.",
  },
  {
    year: "1985",
    title: "Pembentukan Kantor Kependudukan",
    description:
      "Kantor Kependudukan dibentuk untuk mengelola administrasi penduduk termasuk KTP dan Kartu Keluarga.",
  },
  {
    year: "2011",
    title: "Penggabungan Dinas",
    description:
      "Kantor Catatan Sipil dan Kantor Kependudukan digabung menjadi Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) sesuai Permendagri.",
  },
  {
    year: "2015",
    title: "Implementasi KTP-el",
    description:
      "Mulai mengimplementasikan Kartu Tanda Penduduk Elektronik (KTP-el) untuk seluruh warga Kabupaten Ngada.",
  },
  {
    year: "2020",
    title: "Digitalisasi Pelayanan",
    description:
      "Memperkenalkan sistem pelayanan online dan integrasi database kependudukan secara nasional.",
  },
  {
    year: "2024",
    title: "Portal Digital",
    description:
      "Meluncurkan portal informasi online untuk meningkatkan aksesibilitas layanan bagi masyarakat.",
  },
];

export function SejarahSection() {
  return (
    <section id="sejarah" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span variants={fadeInUp} className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Sejarah
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Perjalanan Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-400 mt-4">
            Sejarah perkembangan Dinas Kependudukan dan Pencatatan Sipil
            Kabupaten Ngada dari waktu ke waktu
          </motion.p>
        </motion.div>

        {/* Scroll to explore indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
            <span>Gulir untuk menjelajahi</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Animated gradient vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 origin-top"
              style={{
                background: "linear-gradient(to bottom, #059669, #14b8a6, #10b981, #0d9488, #059669)",
              }}
            />

            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-10">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={index % 2 === 0 ? timelineItemLeft : timelineItemRight}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Pulsing dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      {/* Pulse ring */}
                      <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                        className="absolute inset-0 w-8 h-8 rounded-full bg-green-400"
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:pr-4 md:text-right" : "md:pl-4"
                    }`}
                  >
                    <motion.div
                      whileHover={{
                        y: -4,
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                      }}
                      transition={{ duration: 0.25 }}
                      className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 cursor-default"
                    >
                      {/* Year badge */}
                      <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        {item.year}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
