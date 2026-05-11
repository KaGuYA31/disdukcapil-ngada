"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  ConciergeBell,
  LayoutGrid,
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

// Category filter tabs
const categoryTabs = [
  { value: "Semua", label: "Semua Layanan", icon: LayoutGrid },
  { value: "Pendaftaran Penduduk", label: "Pendaftaran Penduduk", icon: ClipboardList },
  { value: "Pencatatan Sipil", label: "Pencatatan Sipil", icon: BookOpen },
];

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
      return { bg: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", gradient: "from-emerald-600 to-emerald-800", hoverBorder: "hover:border-emerald-300" };
    case "Pencatatan Sipil":
      return { bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", gradient: "from-amber-600 to-amber-800", hoverBorder: "hover:border-amber-300" };
    default:
      return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700", gradient: "from-gray-600 to-gray-800", hoverBorder: "hover:border-gray-300" };
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

function TabIconDisplay({ value, className }: { value: string; className?: string }) {
  if (value === "Pendaftaran Penduduk") return <ClipboardList className={className} />;
  if (value === "Pencatatan Sipil") return <BookOpen className={className} />;
  return <LayoutGrid className={className} />;
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
        <p className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block max-w-md">{getCategoryDescription(category)}</p>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-4 hidden sm:block" />
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
                <Card className={`relative h-full card-hover border-gray-200 dark:border-gray-800 ${colors.hoverBorder} hover:border-green-300 hover:shadow-green-100/50 hover:shadow-lg transition-all duration-300 overflow-hidden hover-glow-green`}>
                  {/* Gradient overlay on hover with shift */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-teal-50/30 to-transparent dark:from-green-900/20 dark:via-teal-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                  {/* Gradient border glow on hover */}
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-green-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-green-400/40 group-hover:via-teal-400/20 group-hover:to-emerald-400/40 dark:group-hover:from-green-500/30 dark:group-hover:via-teal-500/15 dark:group-hover:to-emerald-500/30 transition-all duration-500 -z-10 blur-[2px]" />
                  {/* Left border accent on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-teal-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top z-10 rounded-r" />

                  <CardHeader className="relative z-[1]">
                    <div
                      className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}
                    >
                      <ServiceIconDisplay name={service.icon} className={`h-7 w-7 ${colors.text} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-700 transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-[1]">
                    <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        {service.fee || "GRATIS"}
                      </Badge>
                      {service.processingTime && (
                        <Badge className="bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-300 border border-teal-100 dark:border-teal-800 text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {service.processingTime.replace("*", "")}
                        </Badge>
                      )}
                    </div>
                    {service.processingTime?.includes("*") && (
                      <p className="text-[10px] text-gray-400 mt-1.5 italic">* Tergantung kelengkapan berkas</p>
                    )}
                    {/* Lihat Detail text - fades in on hover */}
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-green-600 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Lihat Detail
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
        ))}
      </div>

      {/* Mobile "See All" link */}
      <motion.div variants={cardVariants} className="mt-6 text-center sm:hidden">
        <Link href={`/layanan?kategori=${encodeURIComponent(category)}`}>
          <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30">
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
  const [activeTab, setActiveTab] = useState<string>("Semua");

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
  const grouped = useMemo(() => {
    return services.reduce((acc, service) => {
      const cat = service.category || "Pendaftaran Penduduk";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    }, {} as Record<string, Layanan[]>);
  }, [services]);

  const categoryOrder = ["Pendaftaran Penduduk", "Pencatatan Sipil"];

  // Filter based on active tab
  const filteredCategories = activeTab === "Semua"
    ? categoryOrder
    : categoryOrder.filter((cat) => cat === activeTab);

  const totalServices = services.length;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle background dot grid pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%2386efac'/%3E%3C/svg%3E")`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          {/* Decorative accent line above label */}
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-8 bg-green-300" />
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2" />
            <div className="h-px w-8 bg-green-300" />
          </div>

          {/* Label with green-100 pill and Service icon */}
          <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <ConciergeBell className="h-4 w-4" />
            Layanan Kami
          </span>

          {/* Service count badge */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-4"
            >
              <Badge className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-medium px-3 py-1">
                {totalServices} Layanan Tersedia
              </Badge>
            </motion.div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Layanan Administrasi Kependudukan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Berbagai layanan administrasi kependudukan yang dapat diakses oleh
            masyarakat Kabupaten Ngada. Silakan pilih layanan yang Anda
            butuhkan.
          </p>
        </motion.div>

        {/* Category Tab Pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.1 }}
        >
          {categoryTabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-green-700 text-white shadow-md shadow-green-700/25"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
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
                    <div key={cardIndex} className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
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
          filteredCategories.map((category, index) => {
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
          <Link href="/layanan" className="group inline-block">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white shadow-lg shadow-green-700/20 transition-all duration-300"
            >
              Lihat Semua Layanan
              <motion.span
                className="ml-2 inline-flex"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
