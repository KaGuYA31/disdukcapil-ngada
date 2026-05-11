"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle, Circle, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Document item type
interface DocumentItem {
  name: string;
  required: boolean; // true = "Wajib", false = "Jika Diperlukan"
}

// Document mapping per service slug
const serviceDocumentsMap: Record<string, DocumentItem[]> = {
  "ktp-el": [
    { name: "KTP lama", required: true },
    { name: "Kartu Keluarga", required: true },
    { name: "Surat Pengantar RT/RW", required: true },
    { name: "Akta Kelahiran", required: false },
    { name: "Pas Foto 3x4 (2 lembar)", required: false },
  ],
  "kartu-keluarga": [
    { name: "KTP-el", required: true },
    { name: "Akta Nikah/Cerai", required: true },
    { name: "Akta Kelahiran seluruh anggota", required: true },
    { name: "Surat Pengantar RT/RW", required: false },
  ],
  "akta-kelahiran": [
    { name: "Surat Keterangan Kelahiran dari RS/Bidan", required: true },
    { name: "KTP kedua orang tua", required: true },
    { name: "Kartu Keluarga", required: true },
    { name: "Surat Nikah (jika belum tercatat)", required: false },
    { name: "Pas Foto bayi", required: false },
  ],
  "akta-kematian": [
    { name: "Surat Keterangan Kematian dari RS", required: true },
    { name: "KTP almarhum", required: true },
    { name: "Kartu Keluarga", required: true },
    { name: "Surat Pengantar RT/RW", required: false },
  ],
  "akta-perkawinan": [
    { name: "KTP-el kedua calon pengantin", required: true },
    { name: "Kartu Keluarga", required: true },
    { name: "Surat N1", required: true },
    { name: "Surat Izin Orang Tua/Wali", required: false },
    { name: "Akta Kelahiran", required: true },
    { name: "Pas Foto 3x4 (5 lembar)", required: true },
  ],
  "akta-perceraian": [
    { name: "KTP-el", required: true },
    { name: "Kartu Keluarga", required: true },
    { name: "Putusan Pengadilan", required: true },
    { name: "Akta Perkawinan", required: true },
    { name: "Surat Keterangan dari Pengadilan", required: false },
  ],
};

// Service name mapping for display
const serviceNames: Record<string, string> = {
  "ktp-el": "KTP-el",
  "kartu-keluarga": "Kartu Keluarga",
  "akta-kelahiran": "Akta Kelahiran",
  "akta-kematian": "Akta Kematian",
  "akta-perkawinan": "Akta Perkawinan",
  "akta-perceraian": "Akta Perceraian",
};

interface DocumentCheckerSectionProps {
  serviceSlug: string;
}

export function DocumentCheckerSection({ serviceSlug }: DocumentCheckerSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  const documents = serviceDocumentsMap[serviceSlug];
  const serviceName = serviceNames[serviceSlug] || serviceSlug;

  // If no documents found for this slug, don't render
  if (!documents) {
    return null;
  }

  const requiredCount = documents.filter((d) => d.required).length;
  const checkedRequiredCount = documents.filter(
    (d) => d.required && checkedDocs.has(d.name)
  ).length;
  const allRequiredChecked = checkedRequiredCount === requiredCount;

  const toggleDoc = (name: string) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="border-teal-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-teal-700" />
              </div>
              Persyaratan Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {/* Toggle button */}
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="outline"
              className="w-full flex items-center justify-between px-4 py-3 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-800 font-medium rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Lihat Persyaratan Dokumen
                {serviceName && (
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-700 text-xs ml-1"
                  >
                    {serviceName}
                  </Badge>
                )}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>

            {/* Collapsible content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        Kelengkapan dokumen wajib
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          allRequiredChecked
                            ? "text-green-700"
                            : "text-amber-700"
                        }`}
                      >
                        {checkedRequiredCount}/{requiredCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <motion.div
                        className={`h-2 rounded-full transition-colors duration-300 ${
                          allRequiredChecked
                            ? "bg-green-500"
                            : "bg-teal-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${requiredCount > 0 ? (checkedRequiredCount / requiredCount) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>

                    {/* Document list */}
                    <div className="space-y-1 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                      {documents.map((doc, index) => {
                        const isChecked = checkedDocs.has(doc.name);
                        return (
                          <motion.button
                            key={doc.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            onClick={() => toggleDoc(doc.name)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left group"
                          >
                            {/* Checkbox icon */}
                            {isChecked ? (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 transition-colors" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 group-hover:text-teal-400 transition-colors" />
                            )}

                            {/* Document name */}
                            <span
                              className={`flex-1 text-sm transition-colors ${
                                isChecked
                                  ? "text-gray-400 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {doc.name}
                            </span>

                            {/* Status badge */}
                            {doc.required ? (
                              <Badge className="bg-red-100 text-red-700 text-xs border-0 font-medium">
                                Wajib
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 text-xs border-0 font-medium">
                                Jika Diperlukan
                              </Badge>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Catatan note */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: documents.length * 0.05 + 0.1 }}
                      className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-2.5"
                    >
                      <Info className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-teal-800 leading-relaxed">
                        <strong>Catatan:</strong> Dokumen asli wajib dibawa saat
                        pengambilan. Fotokopi cukup untuk pendaftaran online.
                      </p>
                    </motion.div>

                    {/* Completion message */}
                    <AnimatePresence>
                      {allRequiredChecked && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-800 font-medium">
                            Semua dokumen wajib sudah dilengkapi!
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
