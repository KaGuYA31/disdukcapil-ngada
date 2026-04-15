"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Filter,
  FileDown,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormulirItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  fileName: string;
  fileSize: string | null;
  downloadCount: number;
  isActive: boolean;
  order: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const CATEGORIES = [
  { key: "all", label: "Semua Formulir", icon: BookOpen },
  { key: "Pendaftaran Penduduk", label: "Pendaftaran Penduduk", icon: FileText },
  { key: "Pencatatan Sipil", label: "Pencatatan Sipil", icon: FileText },
  { key: "Pencatatan Sipil LN", label: "Pencatatan Sipil LN", icon: FileText },
  { key: "Persyaratan", label: "Surat Pernyataan & SPTJM", icon: FileText },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Pendaftaran Penduduk": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Pencatatan Sipil": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  "Pencatatan Sipil LN": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Persyaratan": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

function trackDownload(code: string) {
  fetch("/api/formulir/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }).catch(() => {});
}

export default function FormulirPage() {
  const [formulirList, setFormulirList] = useState<FormulirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchFormulir();
  }, []);

  const fetchFormulir = async () => {
    try {
      const res = await fetch("/api/formulir");
      const result = await res.json();
      if (result.success) {
        setFormulirList(result.data);
      }
    } catch (err) {
      console.error("Error fetching formulir:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = formulirList.filter((f) => {
    const matchSearch =
      search === "" ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === "all" || f.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const groupedByCategory = CATEGORIES.filter((c) => c.key !== "all").map((cat) => ({
    ...cat,
    forms: filtered.filter((f) => f.category === cat.key),
  }));

  const totalDownloads = formulirList.reduce((sum, f) => sum + f.downloadCount, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Layanan", href: "/layanan" }, { label: "Formulir" }]} />
              </motion.div>
              <motion.div variants={fadeInUp} className="mb-3">
                <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                  Download Formulir
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3">
                <FileDown className="h-9 w-9 md:h-11 md:w-11 text-green-200" />
                Formulir Administrasi
                <br className="hidden sm:block" />
                <span className="text-green-200">Kependudukan</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed max-w-3xl">
                Unduh formulir resmi sesuai <strong>Permendagri No. 6 Tahun 2026</strong> tentang 
                Formulir dan Buku yang Digunakan dalam Administrasi Kependudukan. 
                Isi formulir sebelum datang ke kantor Disdukcapil.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }}
                className="grid grid-cols-2 gap-4 mt-8 max-w-md"
              >
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-2xl font-bold">{formulirList.length}</p>
                  <p className="text-green-100 text-sm">Formulir Tersedia</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">Total Unduhan</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari formulir (kode atau nama)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={activeCategory === cat.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`whitespace-nowrap ${
                      activeCategory === cat.key
                        ? "bg-green-600 hover:bg-green-700"
                        : "text-gray-600 hover:text-green-700"
                    }`}
                  >
                    <cat.icon className="h-3.5 w-3.5 mr-1" />
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Formulir List */}
        <section className="bg-gray-50 py-10 md:py-14 min-h-[50vh]">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Memuat formulir...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak Ada Formulir</h3>
                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            ) : activeCategory === "all" ? (
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-10">
                {groupedByCategory.map(
                  (group) =>
                    group.forms.length > 0 && (
                      <motion.div key={group.key} variants={staggerItem}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            group.key === "Pendaftaran Penduduk" ? "bg-green-500"
                            : group.key === "Pencatatan Sipil" ? "bg-teal-500"
                            : group.key === "Pencatatan Sipil LN" ? "bg-amber-500"
                            : "bg-purple-500"
                          }`} />
                          <h2 className="text-xl font-bold text-gray-900">{group.key}</h2>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            {group.forms.length} formulir
                          </Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.forms.map((form) => (
                            <FormulirCard key={form.id} form={form} onDownload={trackDownload} />
                          ))}
                        </div>
                      </motion.div>
                    )
                )}
              </motion.div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((form) => (
                  <motion.div key={form.id} variants={staggerItem}>
                    <FormulirCard form={form} onDownload={trackDownload} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white py-10 md:py-14 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Informasi Penting
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1">Isi Sebelum Datang</h3>
                        <p className="text-xs text-gray-600">Isi formulir dengan huruf cetak dan jelas sebelum datang ke kantor Disdukcapil untuk mempercepat proses pelayanan.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1">Bawa Dokumen Asli</h3>
                        <p className="text-xs text-gray-600">Selain formulir yang sudah diisi, bawa juga dokumen asli dan fotokopi sesuai persyaratan layanan.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Filter className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1">Sesuai Ketentuan</h3>
                        <p className="text-xs text-gray-600">Seluruh formulir mengacu pada Permendagri No. 6 Tahun 2026 dan Permendagri No. 109 Tahun 2019.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Download className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1">GRATIS</h3>
                        <p className="text-xs text-gray-600">Seluruh layanan administrasi kependudukan tidak dipungut biaya apapun sesuai ketentuan pemerintah.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function FormulirCard({ form, onDownload }: { form: FormulirItem; onDownload: (code: string) => void }) {
  const colors = CATEGORY_COLORS[form.category] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

  const handleDownload = () => {
    onDownload(form.code);
    const link = document.createElement("a");
    link.href = `/formulir/${form.fileName}`;
    link.download = `${form.code} - ${form.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border ${colors.border} cursor-pointer h-full`}
      onClick={handleDownload}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge className={`${colors.bg} ${colors.text} text-xs font-medium border-0`}>
            {form.code}
          </Badge>
          <Download className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 flex-1">{form.name}</h3>
        {form.fileSize && (
          <p className="text-xs text-gray-500 mb-2">{form.fileSize}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {form.downloadCount > 0 ? `${form.downloadCount} unduhan` : "Belum ada unduhan"}
          </span>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Unduh <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
