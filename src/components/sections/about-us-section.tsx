"use client";

import { motion } from "framer-motion";
import { Building2, Users, FileCheck, Shield, Award, Target } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const infoCards = [
  {
    icon: Building2,
    title: "Kantor Pusat",
    description: "Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT",
  },
  {
    icon: Users,
    title: "Melayani 171.000+ Penduduk",
    description: "Seluruh masyarakat Kabupaten Ngada dengan profesional",
  },
  {
    icon: FileCheck,
    title: "26+ Layanan",
    description: "Layanan administrasi kependudukan dari KTP hingga KK",
  },
  {
    icon: Shield,
    title: "Data Terjamin",
    description: "Keamanan dan kerahasiaan data penduduk terjaga",
  },
  {
    icon: Award,
    title: "Bersertifikat",
    description: "Standar pelayanan publik yang berkualitas dan terukur",
  },
  {
    icon: Target,
    title: "Visi Misi Jelas",
    description: "Melayani masyarakat dengan cepat, tepat, dan transparan",
  },
];

export function AboutUsSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3"
          >
            Tentang Kami
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-xl flex items-center justify-center">
                  <Icon className="text-green-600 dark:text-green-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
