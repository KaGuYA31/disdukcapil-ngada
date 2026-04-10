"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CreditCard,
  Users,
  Baby,
  Heart,
  ArrowRight,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  Gavel,
  MoveRight,
  ClipboardList,
  BookOpen,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  Users,
  Baby,
  Heart,
  MapPin,
  FileText,
  RefreshCw,
  Stamp,
  Gavel,
  MoveRight,
  ClipboardList,
  BookOpen,
};

interface Layanan {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  category: string;
  processingTime: string | null;
  fee: string | null;
  isActive: boolean;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return ClipboardList;
    case "Pencatatan Sipil":
      return BookOpen;
    default:
      return FileText;
  }
}

function getCategoryDescription(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return "Layanan pembuatan dan pembaruan dokumen identitas serta data kependudukan";
    case "Pencatatan Sipil":
      return "Layanan pencatatan peristiwa penting kehidupan seperti kelahiran, kematian, dan perkawinan";
    default:
      return "";
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Pendaftaran Penduduk":
      return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", gradient: "from-emerald-600 to-emerald-800", hoverBorder: "hover:border-emerald-300" };
    case "Pencatatan Sipil":
      return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-600 to-amber-800", hoverBorder: "hover:border-amber-300" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", gradient: "from-gray-600 to-gray-800", hoverBorder: "hover:border-gray-300" };
  }
}

const defaultServices: Layanan[] = [
  { id: "ktp-el", name: "KTP-el", slug: "ktp-el", description: "Kartu Tanda Penduduk Elektronik untuk WNI.", icon: "CreditCard", category: "Pendaftaran Penduduk", processingTime: "Selesai di Tempat*", fee: "GRATIS", isActive: true },
  { id: "kartu-keluarga", name: "Kartu Keluarga", slug: "kartu-keluarga", description: "Dokumen susunan dan hubungan keluarga.", icon: "Users", category: "Pendaftaran Penduduk", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "perubahan-data", name: "Perubahan Data", slug: "perubahan-data", description: "Pemutakhiran data kependudukan.", icon: "RefreshCw", category: "Pendaftaran Penduduk", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "legalisasi", name: "Legalisasi Dokumen", slug: "legalisasi", description: "Legalisasi fotokopi dokumen kependudukan.", icon: "Stamp", category: "Pendaftaran Penduduk", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "akta-kelahiran", name: "Akta Kelahiran", slug: "akta-kelahiran", description: "Pencatatan kelahiran.", icon: "Baby", category: "Pencatatan Sipil", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "akta-kematian", name: "Akta Kematian", slug: "akta-kematian", description: "Pencatatan kematian.", icon: "Heart", category: "Pencatatan Sipil", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "akta-perkawinan", name: "Akta Perkawinan", slug: "akta-perkawinan", description: "Pencatatan perkawinan WNI.", icon: "FileText", category: "Pencatatan Sipil", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "akta-perceraian", name: "Akta Perceraian", slug: "akta-perceraian", description: "Pencatatan perceraian.", icon: "Gavel", category: "Pencatatan Sipil", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
  { id: "pindah-penduduk", name: "Pindah Penduduk", slug: "pindah-penduduk", description: "Perpindahan penduduk antar wilayah.", icon: "MoveRight", category: "Pencatatan Sipil", processingTime: "Selesai di Tempat", fee: "GRATIS", isActive: true },
];

// Animation variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Standalone icon display components to avoid creating components during render
function CategoryIconDisplay({ category, className }: { category: string; className?: string }) {
  if (category === "Pendaftaran Penduduk") return <ClipboardList className={className} />;
  if (category === "Pencatatan Sipil") return <BookOpen className={className} />;
  return <FileText className={className} />;
}

function ServiceIconDisplay({ name, className }: { name: string | null; className?: string }) {
  const iconName = name || "FileText";
  if (iconName === "CreditCard") return <CreditCard className={className} />;
  if (iconName === "Users") return <Users className={className} />;
  if (iconName === "Baby") return <Baby className={className} />;
  if (iconName === "Heart") return <Heart className={className} />;
  if (iconName === "MapPin") return <MapPin className={className} />;
  if (iconName === "RefreshCw") return <RefreshCw className={className} />;
  if (iconName === "Stamp") return <Stamp className={className} />;
  if (iconName === "Gavel") return <Gavel className={className} />;
  if (iconName === "MoveRight") return <MoveRight className={className} />;
  if (iconName === "ClipboardList") return <ClipboardList className={className} />;
  if (iconName === "BookOpen") return <BookOpen className={className} />;
  return <FileText className={className} />;
}

function CategorySection({
  category,
  services,
  index,
}: {
  category: string;
  services: Layanan[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = getCategoryColor(category);

  return (
    <motion.div
      ref={ref}
      className="mb-16 last:mb-0"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Category Header with hover underline effect */}
      <motion.div variants={headerVariants} className="flex items-center gap-3 mb-8 group">
        <div
          className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center animate-subtle-pulse transition-transform group-hover:scale-110`}
        >
          <CategoryIconDisplay category={category} className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div className="relative">
          <h3 className={`text-xl md:text-2xl font-bold ${colors.text} transition-all`}>
            {category}
          </h3>
          <div className={`absolute bottom-0 left-0 h-0.5 ${colors.bg} transition-all duration-300 group-hover:w-full`} style={{ width: "0" }} />
        </div>
        <p className="text-sm text-gray-500 hidden lg:block max-w-md">{getCategoryDescription(category)}</p>
        <div className="flex-1 h-px bg-gray-200 ml-4 hidden sm:block" />
        <Link
          href={`/layanan?kategori=${encodeURIComponent(category)}`}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          Lihat Semua
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Services Grid with stagger animation */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.slice(0, 4).map((service, i) => (
            <motion.div key={service.id} variants={cardVariants}>
              <Link
                href={`/layanan/${service.slug}`}
                className="group block h-full"
              >
                <Card className={`h-full card-hover border-gray-200 ${colors.hoverBorder} hover:border-green-300 hover:shadow-green-100/50 hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div
                      className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <ServiceIconDisplay name={service.icon} className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-700 transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        {service.fee || "GRATIS"}
                      </Badge>
                      {service.processingTime && (
                        <Badge className="bg-teal-50 text-teal-600 border border-teal-100 text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {service.processingTime.replace("*", "")}
                        </Badge>
                      )}
                    </div>
                    {service.processingTime?.includes("*") && (
                      <p className="text-[10px] text-gray-400 mt-1.5 italic">* Tergantung kelengkapan berkas</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
        ))}
      </div>

      {/* Mobile "See All" link */}
      <motion.div variants={cardVariants} className="mt-6 text-center sm:hidden">
        <Link href={`/layanan?kategori=${encodeURIComponent(category)}`}>
          <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
            Lihat Semua {category}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function ServicesSection() {
  const [services, setServices] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/layanan");
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setServices(result.data.filter((s: Layanan) => s.isActive));
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Group by category
  const grouped = services.reduce((acc, service) => {
    const cat = service.category || "Pendaftaran Penduduk";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, Layanan[]>);

  const categoryOrder = ["Pendaftaran Penduduk", "Pencatatan Sipil"];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Layanan Administrasi Kependudukan
          </h2>
          <p className="text-gray-600 mt-4">
            Berbagai layanan administrasi kependudukan yang dapat diakses oleh
            masyarakat Kabupaten Ngada. Silakan pilih layanan yang Anda
            butuhkan.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-12">
            {[0, 1].map((catIndex) => (
              <div key={catIndex} className="mb-12">
                {/* Category header skeleton */}
                <div className="flex items-center gap-3 mb-8">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-7 w-52 rounded" />
                  <Skeleton className="h-4 w-64 rounded hidden lg:block" />
                  <div className="flex-1" />
                </div>
                {/* Cards skeleton */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[0, 1, 2, 3].map((cardIndex) => (
                    <div key={cardIndex} className="rounded-xl border border-gray-200 p-6">
                      <Skeleton className="h-14 w-14 rounded-xl mb-4" />
                      <Skeleton className="h-5 w-28 rounded mb-3" />
                      <Skeleton className="h-4 w-full rounded mb-1.5" />
                      <Skeleton className="h-4 w-3/4 rounded mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-5 w-32 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          categoryOrder.map((category, index) => {
            const categoryServices = grouped[category] || [];
            if (categoryServices.length === 0) return null;

            return (
              <CategorySection
                key={category}
                category={category}
                services={categoryServices}
                index={index}
              />
            );
          })
        )}

        {/* View All Button */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          <Link href="/layanan">
            <Button
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Lihat Semua Layanan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
