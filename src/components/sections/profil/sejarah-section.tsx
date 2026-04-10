"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

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
    <section id="sejarah" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
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
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Perjalanan Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Sejarah perkembangan Dinas Kependudukan dan Pencatatan Sipil
            Kabupaten Ngada dari waktu ke waktu
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-200 transform md:-translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Year Badge */}
                  <div
                    className={`absolute left-4 md:left-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center transform md:-translate-x-1/2 z-10`}
                  >
                    <Calendar className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                      <span className="text-green-600 font-bold text-lg">
                        {item.year}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
