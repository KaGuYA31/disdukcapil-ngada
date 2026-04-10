"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  BookOpen,
  BarChart3,
  FileCheck,
  Search,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const peraturan = [
  {
    id: "1",
    title: "Undang-Undang No. 24 Tahun 2013 tentang Administrasi Kependudukan",
    description: "Undang-undang yang mengatur tentang administrasi kependudukan di Indonesia.",
    fileUrl: "#",
    fileSize: "2.5 MB",
    date: "2013-12-13",
    category: "UU",
  },
  {
    id: "2",
    title: "Peraturan Pemerintah No. 37 Tahun 2007",
    description: "PP tentang Pelaksanaan Undang-Undang Nomor 23 Tahun 2006 tentang Administrasi Kependudukan.",
    fileUrl: "#",
    fileSize: "1.8 MB",
    date: "2007-06-15",
    category: "PP",
  },
  {
    id: "3",
    title: "Peraturan Menteri Dalam Negeri No. 9 Tahun 2018",
    description: "Permendagri tentang Pelayanan Administrasi Kependudukan.",
    fileUrl: "#",
    fileSize: "3.2 MB",
    date: "2018-03-20",
    category: "Permendagri",
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
  },
  {
    id: "2",
    title: "Indeks Kepuasan Masyarakat (IKM) 2023",
    description: "Hasil survei kepuasan masyarakat terhadap pelayanan Disdukcapil Ngada.",
    fileUrl: "#",
    fileSize: "1.2 MB",
    date: "2023-12-20",
    category: "IKM",
  },
  {
    id: "3",
    title: "Laporan Tahunan 2023",
    description: "Laporan tahunan kegiatan dan capaian Disdukcapil Ngada.",
    fileUrl: "#",
    fileSize: "8.3 MB",
    date: "2024-01-15",
    category: "Laporan Tahunan",
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
  },
  {
    id: "2",
    title: "SOP Pelayanan Kartu Keluarga",
    description: "Standar Operasional Prosedur pelayanan Kartu Keluarga.",
    fileUrl: "#",
    fileSize: "450 KB",
    date: "2023-01-15",
  },
  {
    id: "3",
    title: "SOP Pencatatan Kelahiran",
    description: "Standar Operasional Prosedur pencatatan akta kelahiran.",
    fileUrl: "#",
    fileSize: "380 KB",
    date: "2023-01-15",
  },
  {
    id: "4",
    title: "SOP Pencatatan Kematian",
    description: "Standar Operasional Prosedur pencatatan akta kematian.",
    fileUrl: "#",
    fileSize: "350 KB",
    date: "2023-01-15",
  },
  {
    id: "5",
    title: "SOP Perpindahan Penduduk",
    description: "Standar Operasional Prosedur pelayanan perpindahan penduduk.",
    fileUrl: "#",
    fileSize: "420 KB",
    date: "2023-01-15",
  },
];

const formulir = [
  {
    id: "1",
    title: "Formulir Permohonan KTP-el",
    description: "Formulir untuk permohonan KTP-el baru atau penggantian.",
    fileUrl: "#",
    fileSize: "250 KB",
  },
  {
    id: "2",
    title: "Formulir Permohonan KK",
    description: "Formulir untuk permohonan Kartu Keluarga baru atau perubahan data.",
    fileUrl: "#",
    fileSize: "200 KB",
  },
  {
    id: "3",
    title: "Formulir Permohonan Akta Kelahiran",
    description: "Formulir untuk pencatatan akta kelahiran.",
    fileUrl: "#",
    fileSize: "180 KB",
  },
  {
    id: "4",
    title: "Formulir Permohonan Akta Kematian",
    description: "Formulir untuk pencatatan akta kematian.",
    fileUrl: "#",
    fileSize: "170 KB",
  },
  {
    id: "5",
    title: "Formulir Perpindahan Penduduk",
    description: "Formulir untuk permohonan perpindahan penduduk.",
    fileUrl: "#",
    fileSize: "220 KB",
  },
  {
    id: "6",
    title: "Formulir Perubahan Data",
    description: "Formulir untuk permohonan perubahan data kependudukan.",
    fileUrl: "#",
    fileSize: "190 KB",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export function TransparansiSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterDocuments = (docs: any[]) => {
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="peraturan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="peraturan" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Peraturan
            </TabsTrigger>
            <TabsTrigger value="laporan" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Laporan
            </TabsTrigger>
            <TabsTrigger value="sop" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              SOP
            </TabsTrigger>
            <TabsTrigger value="formulir" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Formulir
            </TabsTrigger>
          </TabsList>

          {/* Peraturan Tab */}
          <TabsContent value="peraturan">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDocuments(peraturan).map((doc) => (
                <Card key={doc.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <Badge variant="secondary">{doc.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doc.date)}
                      </span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Laporan Tab */}
          <TabsContent value="laporan">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDocuments(laporan).map((doc) => (
                <Card key={doc.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge variant="secondary">{doc.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doc.date)}
                      </span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SOP Tab */}
          <TabsContent value="sop">
            <div className="grid md:grid-cols-2 gap-6">
              {filterDocuments(sop).map((doc) => (
                <Card key={doc.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">{doc.fileSize}</span>
                          <Button size="sm" className="bg-green-700 hover:bg-green-800">
                            <Download className="mr-2 h-4 w-4" />
                            Unduh
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Formulir Tab */}
          <TabsContent value="formulir">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDocuments(formulir).map((doc) => (
                <Card key={doc.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-4">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{doc.fileSize}</span>
                      <Button size="sm" className="bg-green-700 hover:bg-green-800">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
