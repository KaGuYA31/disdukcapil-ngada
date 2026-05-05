"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import {
  Search,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SubmissionStatus {
  id: string;
  nomorPengajuan: string;
  namaLengkap: string;
  nik: string;
  noTelepon: string;
  email: string | null;
  alamat: string | null;
  status: string;
  catatan: string | null;
  tanggalPengajuan: string;
  tanggalProses: string | null;
  tanggalSelesai: string | null;
  layanan: {
    name: string;
    slug: string;
  };
  dokumen: Array<{
    id: string;
    namaDokumen: string;
    fileName: string;
    fileUrl: string;
    fileSize: string | null;
  }>;
}

const statusConfig: {
  [key: string]: {
    label: string;
    color: string;
    bgColor: string;
    icon: any;
    description: string;
  };
} = {
  Baru: {
    label: "Baru",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    icon: Clock,
    description: "Pengajuan baru diterima, menunggu verifikasi",
  },
  Diverifikasi: {
    label: "Diverifikasi",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: CheckCircle,
    description: "Dokumen telah diverifikasi, menunggu proses",
  },
  Diproses: {
    label: "Diproses",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: Loader2,
    description: "Pengajuan sedang diproses oleh petugas",
  },
  Selesai: {
    label: "Selesai",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle,
    description: "Pengajuan telah selesai",
  },
  Ditolak: {
    label: "Ditolak",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: AlertCircle,
    description: "Pengajuan ditolak",
  },
};

export default function CekStatusPage() {
  const { toast } = useToast();

  const [nomorPengajuan, setNomorPengajuan] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<SubmissionStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!nomorPengajuan.trim()) {
      toast({
        title: "Error",
        description: "Masukkan nomor pengajuan",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearching(true);
      setNotFound(false);
      setResult(null);

      const response = await fetch(`/api/layanan-online/${nomorPengajuan.trim()}`);
      const res = await response.json();

      if (res.success) {
        setResult(res.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Error",
        description: "Gagal mencari pengajuan",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status] || {
        label: status,
        color: "text-gray-700",
        bgColor: "bg-gray-100",
        icon: Clock,
        description: "Status tidak diketahui",
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Cek Status Pengajuan</h1>
              <p className="text-green-100">
                Masukkan nomor pengajuan untuk melihat status pengajuan layanan online Anda
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomorPengajuan">Nomor Pengajuan</Label>
                    <div className="flex gap-2">
                      <Input
                        id="nomorPengajuan"
                        value={nomorPengajuan}
                        onChange={(e) => setNomorPengajuan(e.target.value.toUpperCase())}
                        placeholder="Contoh: ONL-20250308-0001"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={searching}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        {searching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Nomor pengajuan diberikan setelah Anda mengirim pengajuan layanan online
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Result Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {notFound && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 font-medium">Pengajuan tidak ditemukan</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Pastikan nomor pengajuan yang Anda masukkan sudah benar
                    </p>
                  </CardContent>
                </Card>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Status Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Detail Pengajuan</CardTitle>
                          <CardDescription>{result.nomorPengajuan}</CardDescription>
                        </div>
                        <Badge
                          className={`${getStatusConfig(result.status).bgColor} ${
                            getStatusConfig(result.status).color
                          }`}
                        >
                          {getStatusConfig(result.status).label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                        {(() => {
                          const StatusIcon = getStatusConfig(result.status).icon;
                          return (
                            <StatusIcon
                              className={`h-6 w-6 ${
                                getStatusConfig(result.status).color
                              } ${result.status === "Diproses" ? "animate-spin" : ""}`}
                            />
                          );
                        })()}
                        <div>
                          <p className="font-medium">{getStatusConfig(result.status).label}</p>
                          <p className="text-sm text-gray-600">
                            {getStatusConfig(result.status).description}
                          </p>
                        </div>
                      </div>

                      {result.catatan && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">Catatan Petugas:</p>
                          <p className="text-sm text-yellow-700 mt-1">{result.catatan}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Riwayat Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Pengajuan Dibuat</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(result.tanggalPengajuan)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              Pengajuan berhasil dikirim melalui website
                            </p>
                          </div>
                        </div>

                        {result.tanggalProses && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Sedang Diproses</p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(result.tanggalProses)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                Pengajuan sedang ditangani oleh petugas
                              </p>
                            </div>
                          </div>
                        )}

                        {result.tanggalSelesai && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Selesai</p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(result.tanggalSelesai)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                Pengajuan telah selesai diproses
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Pemohon */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Pemohon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                            <p className="font-medium">{result.namaLengkap}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NIK</p>
                          <p className="font-medium">{result.nik}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">No. Telepon</p>
                            <p className="font-medium">{result.noTelepon}</p>
                          </div>
                        </div>
                        {result.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{result.email}</p>
                            </div>
                          </div>
                        )}
                        {result.alamat && (
                          <div className="md:col-span-2 flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Alamat</p>
                              <p className="font-medium">{result.alamat}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Layanan */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Layanan yang Diajukan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{result.layanan.name}</p>
                          <p className="text-sm text-gray-500">
                            Diajukan pada {formatDate(result.tanggalPengajuan)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dokumen */}
                  {result.dokumen.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Dokumen Terlampir</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {result.dokumen.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">{doc.namaDokumen}</p>
                                  <p className="text-xs text-gray-500">{doc.fileName}</p>
                                </div>
                              </div>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-200 rounded"
                              >
                                <Download className="h-4 w-4 text-gray-600" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Contact Info */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-green-800">
                        <strong>Butuh bantuan?</strong> Hubungi kami di nomor telepon yang tertera
                        di website atau kunjungi kantor Disdukcapil Kabupaten Ngada.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Initial State */}
              {!notFound && !result && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600">
                      Masukkan nomor pengajuan untuk melihat status
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Format: ONL-YYYYMMDD-XXXX
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
