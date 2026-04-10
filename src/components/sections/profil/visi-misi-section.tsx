"use client";

import { motion } from "framer-motion";
import { Target, Eye, CheckCircle } from "lucide-react";

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

const visi = "Mewujudkan tata kelola administrasi kependudukan yang akurat, tepat waktu, dan berorientasi pada kepuasan masyarakat dalam rangka mendukung pembangunan daerah Kabupaten Ngada.";

const misi = [
  "Meningkatkan kualitas pelayanan administrasi kependudukan yang cepat, tepat, dan akurat",
  "Mengoptimalkan pengelolaan database kependudukan yang terintegrasi dan terkini",
  "Meningkatkan kompetensi dan profesionalisme sumber daya manusia",
  "Mengembangkan sistem pelayanan berbasis teknologi informasi",
  "Meningkatkan jangkauan dan aksesibilitas layanan ke seluruh masyarakat",
  "Membangun koordinasi dan kemitraan dengan instansi terkait",
];

export function VisiMisiSection() {
  return (
    <section id="visi-misi" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span variants={fadeInUp} className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Visi & Misi
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Arah dan Tujuan Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Landasan dan pedoman dalam menjalankan tugas pelayanan
            kependudukan
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Visi */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">Visi</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{visi}</p>
          </motion.div>

          {/* Misi */}
          <motion.div variants={fadeInUp} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Misi</h3>
            <ul className="space-y-3">
              {misi.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
