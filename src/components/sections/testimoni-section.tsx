"use client";

import { useState, useRef } from "react";
import { Quote, Star, ChevronDown } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Goreti",
    location: "Kecamatan Bajawa",
    text: "Pelayanan KTP-el sangat cepat dan ramah. Petugas membantu dengan sabar dan memberikan informasi yang jelas. Terima kasih Disdukcapil Ngada!",
    rating: 5,
  },
  {
    id: 2,
    name: "Yohanes Bere",
    location: "Kecamatan Aimere",
    text: "Proses pembuatan KK selesai dalam hitungan menit. Tidak perlu menunggu lama. Sangat efisien dan profesional!",
    rating: 5,
  },
  {
    id: 3,
    name: "Anastasia Moe",
    location: "Kecamatan Ngada",
    text: "Saya sangat terbantu dengan layanan jemput bola. Tidak perlu ke kantor, petugas yang datang ke desa kami. Luar biasa!",
    rating: 5,
  },
  {
    id: 4,
    name: "Fransiskus Nago",
    location: "Kecamatan Riung",
    text: "Pengurusan akta kelahiran anak saya berjalan lancar. Persyaratan jelas dan proses cepat. Sangat memuaskan.",
    rating: 4,
  },
  {
    id: 5,
    name: "Pelagia Wae",
    location: "Kecamatan Soa",
    text: "Website ini sangat membantu untuk mengetahui informasi layanan. Tidak perlu datang ke kantor hanya untuk bertanya.",
    rating: 5,
  },
  {
    id: 6,
    name: "Dominikus Reo",
    location: "Kecamatan Golewa",
    text: "Legalisasi dokumen kependudukan gratis dan cepat. Sangat mengapresiasi pelayanan Disdukcapil Ngada yang memuaskan.",
    rating: 5,
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15 + i * 0.1,
      ease: "easeOut" as const,
    },
  }),
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <motion.div
      key={testimonial.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="h-full border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating rating={testimonial.rating} />
          </div>

          {/* Quote */}
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
              <Quote className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-gray-600 italic leading-relaxed text-sm flex-1">
              &ldquo;{testimonial.text}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4 mt-auto" />

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {testimonial.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {testimonial.name}
              </p>
              <p className="text-xs text-gray-500">{testimonial.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimoniSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);

  const displayedTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, 3);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <Quote className="h-4 w-4" />
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Testimoni Masyarakat
          </h2>
          <p className="text-gray-600 mt-4">
            Apa kata masyarakat tentang pelayanan Disdukcapil Kabupaten Ngada.
            Kepuasan Anda adalah prioritas kami.
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-8 mb-10"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">4.8</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Rating Rata-rata</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">
              {testimonials.length}
            </span>
            <p className="text-xs text-gray-500 mt-0.5">Testimoni</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <span className="text-2xl font-bold text-green-700">98%</span>
            <p className="text-xs text-gray-500 mt-0.5">Puas dengan Layanan</p>
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Show More / Show Less Button */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-green-700 text-green-700 hover:bg-green-50 hover:text-green-800 font-medium"
          >
            {showAll ? "Tampilkan Sedikit" : "Lihat Semua Testimoni"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
