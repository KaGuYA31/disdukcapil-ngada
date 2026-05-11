"use client";

import { Star, Quote } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Testimonial Data ──────────────────────────────────────────────
interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Maria Goreti",
    location: "Kec. Bajawa",
    text: "Pelayanan KTP-el sangat cepat, hanya 10 menit sudah selesai. Petugas sangat ramah dan informatif!",
    rating: 5,
  },
  {
    id: 2,
    name: "Yohanes Bere",
    location: "Kec. Aimere",
    text: "Proses pembuatan KK berjalan sangat lancar. Tidak perlu antri lama. Terima kasih Disdukcapil!",
    rating: 5,
  },
  {
    id: 3,
    name: "Anastasia Moe",
    location: "Kec. Ngada",
    text: "Layanan jemput bola ke desa sangat membantu masyarakat yang jauh dari kantor kecamatan.",
    rating: 5,
  },
  {
    id: 4,
    name: "Fransiskus Nago",
    location: "Kec. Riung",
    text: "Pengurusan akta kelahiran anak saya sangat mudah. Petugas membantu dari awal hingga selesai.",
    rating: 4,
  },
  {
    id: 5,
    name: "Pelagia Wae",
    location: "Kec. Soa",
    text: "Website ini sangat informatif. Saya bisa cek persyaratan dari rumah sebelum ke kantor.",
    rating: 5,
  },
  {
    id: 6,
    name: "Dominikus Reo",
    location: "Kec. Golewa",
    text: "Legalitas dokumen kependudukan gratis! Sangat mengapresiasi pelayanan yang transparan.",
    rating: 5,
  },
  {
    id: 7,
    name: "Katarina Djari",
    location: "Kec. Jerebuu",
    text: "Pelayanan perpindahan penduduk saya selesai dalam satu hari. Cepat dan profesional!",
    rating: 4,
  },
  {
    id: 8,
    name: "Petrus Laga",
    location: "Kec. Wolowae",
    text: "Petugas di loket sangat sabar menjelaskan prosedur. Pelayanan yang sangat manusiawi.",
    rating: 5,
  },
  {
    id: 9,
    name: "Theresia Mboe",
    location: "Kec. Mataloko",
    text: "Antrian online sangat membantu, tidak perlu datang pagi-pagi untuk ambil nomor antrian.",
    rating: 4,
  },
  {
    id: 10,
    name: "Yulianus Koka",
    location: "Kec. Bajawa Utara",
    text: "Cetak ulang KTP yang rusak bisa selesai dalam hitungan menit. Sangat efisien!",
    rating: 5,
  },
  {
    id: 11,
    name: "Hildegardis Nua",
    location: "Kec. Nangaroro",
    text: "Saya terbantu dengan adanya simulasi biaya online. Tidak perlu khawatir biaya tersembunyi.",
    rating: 5,
  },
  {
    id: 12,
    name: "Ignasius Wani",
    location: "Kec. Bajawa Selatan",
    text: "Pelayanan akta kematian dilakukan dengan cepat dan penuh empati. Terima kasih.",
    rating: 5,
  },
];

// ─── Star Rating ───────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Single Card ───────────────────────────────────────────────────
function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="flex-shrink-0 w-80 md:w-96">
      <div className="h-full bg-white dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
        {/* Top accent line */}
        <div className="h-0.5 w-12 bg-gradient-to-r from-green-500 to-teal-400 rounded-full mb-4 group-hover:w-20 transition-all duration-300" />

        {/* Stars */}
        <StarRating rating={item.rating} />

        {/* Quote */}
        <div className="flex gap-2.5 mt-3 mb-4 flex-1">
          <div className="flex-shrink-0 w-7 h-7 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mt-0.5">
            <Quote className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
            &ldquo;{item.text}&rdquo;
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {item.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {item.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Marquee Section ───────────────────────────────────────────────
export function TestimoniMarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Double the items for seamless loop
  const doubledItems = [...testimonials, ...testimonials];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900 pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
            <Quote className="h-4 w-4" />
            Kata Mereka
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Testimoni Masyarakat Ngada
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Pendapat masyarakat tentang pelayanan kami — kepuasan Anda adalah motivasi kami
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track - Row 1 (left to right) */}
        <div className="marquee-container mb-5">
          <div className="marquee-track">
            {doubledItems.map((item, i) => (
              <div key={`r1-${item.id}-${i}`} className="marquee-item">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling track - Row 2 (right to left) */}
        <div className="marquee-container marquee-reverse">
          <div className="marquee-track-reverse">
            {[...doubledItems].reverse().map((item, i) => (
              <div key={`r2-${item.id}-${i}`} className="marquee-item">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Marquee CSS animations */}
      <style jsx global>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }

        .marquee-track {
          display: flex;
          gap: 1rem;
          animation: marquee-scroll 60s linear infinite;
          width: max-content;
        }

        .marquee-track-reverse {
          display: flex;
          gap: 1rem;
          animation: marquee-scroll-reverse 60s linear infinite;
          width: max-content;
        }

        .marquee-item {
          flex-shrink: 0;
        }

        .marquee-container:hover .marquee-track,
        .marquee-container:hover .marquee-track-reverse {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .marquee-track-reverse {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
