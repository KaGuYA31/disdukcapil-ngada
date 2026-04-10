"use client";

import { useRef, useState, useEffect } from "react";
import {
  FileText,
  Download,
  BookOpen,
  BarChart3,
  FileCheck,
  Search,
  Calendar,
  FileX,
  DownloadCloud,
  Eye,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Data ───────────────────────────────────────────────────────────────────

const peraturan = [
  {
    id: "1",
    title: "Undang-Undang No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    description: "Undang-undang yang mengatur tentang administrasi kependudukan di Indonesia.",
    fileUrl: "#",
    fileSize: "2.5 MB",
    date: "2013-12-13",
    category: "UU",
    downloads: 124,
  },
  {
    id: "2",
    title: "Peraturan Pemerintah No. 37 Tahun 2007",
    description: "PP tentang Pelaksanaan Undang-Undang Nomor 23 Tahun 2006 tentang Administrasi Kependudukan.",
    fileUrl: "#",
    fileSize: "1.8 MB",
    date: "2007-06-15",
    category: "PP",
    downloads: 89,
  },
  {
    id: "3",
    title: "Peraturan Menteri Dalam Negeri No. 9 Tahun 2018",
    description: "Permendagri tentang Pelayanan Administrasi Kependudukan.",
    fileUrl: "#",
    fileSize: "3.2 MB",
    date: "2018-03-20",
    category: "Permendagri",
    downloads: 67,
  },
];

const laporan = [
  {
    id: "1",
    title: "Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) 2023",
    description: "Laporan kinerja Disdukcapil Ngada tahun anggaran 2023.",
    fileUrl: "#",
    fileSize: "4.5 MB",
    date: "2024-01-10",
    category: "LAKIP",
    downloads: 203,
  },
  {
    id: "2",
    title: "Indeks Kepuasan Masyarakat (IKM) 2023",
    description: "Hasil survei kepuasan masyarakat terhadap pelayanan Disdukcapil Ngada.",
    fileUrl: "#",
    fileSize: "1.2 MB",
    date: "2023-12-20",
    category: "IKM",
    downloads: 156,
  },
  {
    id: "3",
    title: "Laporan Tahunan 2023",
    description: "Laporan tahunan kegiatan dan capaian Disdukcapil Ngada.",
    fileUrl: "#",
    fileSize: "8.3 MB",
    date: "2024-01-15",
    category: "Laporan Tahunan",
    downloads: 312,
  },
];

const sop = [
  {
    id: "1",
    title: "SOP Pelayanan KTP-el",
    description: "Standar Operasional Prosedur pelayanan KTP-el.",
    fileUrl: "#",
    fileSize: "500 KB",
    date: "2023-01-15",
    downloads: 445,
  },
  {
    id: "2",
    title: "SOP Pelayanan Kartu Keluarga",
    description: "Standar Operasional Prosedur pelayanan Kartu Keluarga.",
    fileUrl: "#",
    fileSize: "450 KB",
    date: "2023-01-15",
    downloads: 378,
  },
  {
    id: "3",
    title: "SOP Pencatatan Kelahiran",
    description: "Standar Operasional Prosedur pencatatan akta kelahiran.",
    fileUrl: "#",
    fileSize: "380 KB",
    date: "2023-01-15",
    downloads: 267,
  },
  {
    id: "4",
    title: "SOP Pencatatan Kematian",
    description: "Standar Operasional Prosedur pencatatan akta kematian.",
    fileUrl: "#",
    fileSize: "350 KB",
    date: "2023-01-15",
    downloads: 134,
  },
  {
    id: "5",
    title: "SOP Perpindahan Penduduk",
    description: "Standar Operasional Prosedur pelayanan perpindahan penduduk.",
    fileUrl: "#",
    fileSize: "420 KB",
    date: "2023-01-15",
    downloads: 198,
  },
];

const formulir = [
  {
    id: "1",
    title: "Formulir Permohonan KTP-el",
    description: "Formulir untuk permohonan KTP-el baru atau penggantian.",
    fileUrl: "#",
    fileSize: "250 KB",
    downloads: 521,
  },
  {
    id: "2",
    title: "Formulir Permohonan KK",
    description: "Formulir untuk permohonan Kartu Keluarga baru atau perubahan data.",
    fileUrl: "#",
    fileSize: "200 KB",
    downloads: 412,
  },
  {
    id: "3",
    title: "Formulir Permohonan Akta Kelahiran",
    description: "Formulir untuk pencatatan akta kelahiran.",
    fileUrl: "#",
    fileSize: "180 KB",
    downloads: 389,
  },
  {
    id: "4",
    title: "Formulir Permohonan Akta Kematian",
    description: "Formulir untuk pencatatan akta kematian.",
    fileUrl: "#",
    fileSize: "170 KB",
    downloads: 97,
  },
  {
    id: "5",
    title: "Formulir Perpindahan Penduduk",
    description: "Formulir untuk permohonan perpindahan penduduk.",
    fileUrl: "#",
    fileSize: "220 KB",
    downloads: 163,
  },
  {
    id: "6",
    title: "Formulir Perubahan Data",
    description: "Formulir untuk permohonan perubahan data kependudukan.",
    fileUrl: "#",
    fileSize: "190 KB",
    downloads: 245,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatDownloads = (count: number) => {
  return `${count.toLocaleString("id-ID")} unduhan`;
};

// ─── Animation variants ────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const searchVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.1 },
  },
};

const tabsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, delay: 0.2, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: 0.05 + i * 0.08,
      ease: "easeOut" as const,
    },
  }),
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────

function TransparansiLoadingSkeleton() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search skeleton */}
        <div className="max-w-xl mx-auto mb-10">
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Tabs skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-5 w-full mt-4" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────

function EmptySearchState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Dokumen Tidak Ditemukan
      </h3>
      <p className="text-gray-500 max-w-md">
        Tidak ada dokumen yang sesuai dengan pencarian{" "}
        <span className="font-medium text-gray-700">&ldquo;{query}&rdquo;</span>.
        Coba gunakan kata kunci yang berbeda.
      </p>
    </motion.div>
  );
}

// ─── Document Cards ────────────────────────────────────────────────────────

interface DocCardProps {
  doc: {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileSize: string;
    date?: string;
    category?: string;
    downloads: number;
  };
  index: number;
  iconBg: string;
  iconColor: string;
  Icon: React.ElementType;
  layout?: "full" | "compact";
}

function DocCard({ doc, index, iconBg, iconColor, Icon, layout = "full" }: DocCardProps) {
  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible">
      <Card className="border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 h-full overflow-hidden">
        {layout === "full" ? (
          <>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                {doc.category && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 font-medium">
                    {doc.category}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-4 leading-snug">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{doc.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                {doc.date ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(doc.date)}
                  </span>
                ) : (
                  <span />
                )}
                <span className="font-medium">{doc.fileSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Eye className="h-3.5 w-3.5" />
                  {formatDownloads(doc.downloads)}
                </span>
                <Button size="sm" className="bg-green-700 hover:bg-green-800 transition-colors">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 leading-snug">{doc.title}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{doc.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    {doc.date && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(doc.date)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="h-3.5 w-3.5" />
                      {formatDownloads(doc.downloads)}
                    </span>
                  </div>
                  <Button size="sm" className="bg-green-700 hover:bg-green-800 transition-colors">
                    <Download className="mr-1.5 h-4 w-4" />
                    Unduh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function TransparansiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filterDocuments = <T extends { title: string; description: string }>(docs: T[]) => {
    if (!searchQuery.trim()) return docs;
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPeraturan = filterDocuments(peraturan);
  const filteredLaporan = filterDocuments(laporan);
  const filteredSop = filterDocuments(sop);
  const filteredFormulir = filterDocuments(formulir);

  if (loading) {
    return <TransparansiLoadingSkeleton />;
  }

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wider">
            <DownloadCloud className="h-4 w-4" />
            Dokumen Publik
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Transparansi & Publikasi
          </h2>
          <p className="text-gray-600 mt-3">
            Unduh dokumen peraturan, laporan kinerja, SOP pelayanan, dan formulir resmi.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          variants={searchVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-colors"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={tabsVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Tabs defaultValue="peraturan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1 bg-gray-100">
              <TabsTrigger
                value="peraturan"
                className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-green-700 data-[state=active]:text-white transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Peraturan
                <Badge
                  variant="secondary"
                  className="ml-1 bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0 min-w-[20px] text-center data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  {filteredPeraturan.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="laporan"
                className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-green-700 data-[state=active]:text-white transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                Laporan
                <Badge
                  variant="secondary"
                  className="ml-1 bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0 min-w-[20px] text-center data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  {filteredLaporan.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="sop"
                className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-green-700 data-[state=active]:text-white transition-all"
              >
                <FileCheck className="h-4 w-4" />
                SOP
                <Badge
                  variant="secondary"
                  className="ml-1 bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0 min-w-[20px] text-center data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  {filteredSop.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="formulir"
                className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-green-700 data-[state=active]:text-white transition-all"
              >
                <FileText className="h-4 w-4" />
                Formulir
                <Badge
                  variant="secondary"
                  className="ml-1 bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0 min-w-[20px] text-center data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  {filteredFormulir.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Peraturan Tab */}
            <TabsContent value="peraturan">
              <motion.div
                key="content-peraturan"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPeraturan.length === 0 ? (
                  <EmptySearchState query={searchQuery} />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPeraturan.map((doc, index) => (
                      <DocCard
                        key={doc.id}
                        doc={doc}
                        index={index}
                        iconBg="bg-red-100"
                        iconColor="text-red-600"
                        Icon={FileText}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Laporan Tab */}
            <TabsContent value="laporan">
              <motion.div
                key="content-laporan"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredLaporan.length === 0 ? (
                  <EmptySearchState query={searchQuery} />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLaporan.map((doc, index) => (
                      <DocCard
                        key={doc.id}
                        doc={doc}
                        index={index}
                        iconBg="bg-teal-100"
                        iconColor="text-teal-600"
                        Icon={BarChart3}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* SOP Tab */}
            <TabsContent value="sop">
              <motion.div
                key="content-sop"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredSop.length === 0 ? (
                  <EmptySearchState query={searchQuery} />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredSop.map((doc, index) => (
                      <DocCard
                        key={doc.id}
                        doc={doc}
                        index={index}
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                        Icon={FileCheck}
                        layout="compact"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Formulir Tab */}
            <TabsContent value="formulir">
              <motion.div
                key="content-formulir"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredFormulir.length === 0 ? (
                  <EmptySearchState query={searchQuery} />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFormulir.map((doc, index) => (
                      <DocCard
                        key={doc.id}
                        doc={doc}
                        index={index}
                        iconBg="bg-amber-100"
                        iconColor="text-amber-600"
                        Icon={FileText}
                        layout="full"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            Butuh dokumen yang tidak tersedia? Hubungi kami melalui{" "}
            <span className="font-medium text-green-600">WhatsApp</span> untuk bantuan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
