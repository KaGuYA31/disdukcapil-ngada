"use client";

import { useRef } from "react";
import { Star, CreditCard, Users, Baby, ArrowRightLeft, Clock } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeaturedService {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  processingTime: number;
}

const featuredServices: FeaturedService[] = [
  {
    id: "ktp-el",
    name: "KTP-el Baru",
    description: "Pembuatan KTP elektronik baru untuk WNI berusia 17 tahun",
    icon: CreditCard,
    processingTime: 5,
  },
  {
    id: "kartu-keluarga",
    name: "Kartu Keluarga",
    description: "Pembuatan atau perubahan Kartu Keluarga",
    icon: Users,
    processingTime: 10,
  },
  {
    id: "akta-kelahiran",
    name: "Akta Kelahiran",
    description: "Pencatatan kelahiran dan penerbitan Akta",
    icon: Baby,
    processingTime: 8,
  },
  {
    id: "surat-pindah",
    name: "Surat Pindah",
    description: "Pindah datang dan pindah domisili",
    icon: ArrowRightLeft,
    processingTime: 7,
  },
];

// Animation variants
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function FeaturedServiceCard({ service }: { service: FeaturedService }) {
  const Icon = service.icon;

  return (
    <motion.div variants={cardVariants}>
      <Card className="relative h-full border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/80 dark:from-green-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

        <CardHeader className="relative z-[1] pb-2">
          {/* Icon with green gradient background */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center mb-4 shadow-md shadow-green-600/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-700 transition-colors">
            {service.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-[1]">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {service.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Processing time */}
            <Badge className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs gap-1">
              <Clock className="h-3 w-3" />
              Estimasi: {service.processingTime} menit
            </Badge>

            {/* Free badge */}
            <Badge className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
              GRATIS
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FeaturedServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='2' fill='%2316a34a'/%3E%3C/svg%3E")`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Decorative accent line */}
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-8 bg-green-300" />
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2" />
            <div className="h-px w-8 bg-green-300" />
          </div>

          {/* Label with Star icon */}
          <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Star className="h-4 w-4" />
            Layanan Unggulan
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Layanan yang Paling Banyak Diminati
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Layanan administrasi kependudukan yang sering diakses oleh masyarakat Kabupaten Ngada
          </p>
        </motion.div>

        {/* Featured Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredServices.map((service) => (
            <FeaturedServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
