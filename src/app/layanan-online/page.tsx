"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import {
  Globe,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface LayananOnline {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  requirements: Array<{ label: string; description?: string }>;
  procedures: Array<{ step: number; title: string; description?: string }>;
  forms: Array<{ name: string; url: string }>;
  processingTime: string | null;
}

interface UploadedDoc {
  namaDokumen: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
}

export default function LayananOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [layananList, setLayananList] = useState<LayananOnline[]>([]);
  const [selectedLayanan, setSelectedLayanan] = useState<LayananOnline | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [nomorPengajuan, setNomorPengajuan] = useState("");

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    noTelepon: "",
    email: "",
    keterangan: "",
    dokumen: [] as UploadedDoc[],
  });

  const [uploadingDocs, setUploadingDocs] = useState(false);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/layanan-online");
      const result = await response.json();
      if (result.success) {
        setLayananList(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching layanan:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data layanan online",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openSubmissionForm = (layanan: LayananOnline) => {
    setSelectedLayanan(layanan);
    setFormData({
      namaLengkap: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      alamat: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
      noTelepon: "",
      email: "",
      keterangan: "",
      dokumen: [],
    });
    setShowFormDialog(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocs(true);
    try {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "pengajuan");

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          dokumen: [
            ...prev.dokumen.filter((d) => d.namaDokumen !== docName),
            {
              namaDokumen: docName,
              fileName: result.originalName || file.name,
              fileUrl: result.url,
              fileSize: result.size,
              fileType: result.type,
            },
          ],
        }));
        toast({
          title: "Berhasil",
          description: `Dokumen ${docName} berhasil diunggah`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengunggah dokumen",
        variant: "destructive",
      });
    } finally {
      setUploadingDocs(false);
      e.target.value = "";
    }
  };

  const removeDocument = (docName: string) => {
    setFormData((prev) => ({
      ...prev,
      dokumen: prev.dokumen.filter((d) => d.namaDokumen !== docName),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.namaLengkap || !formData.nik || !formData.noTelepon) {
      toast({
        title: "Error",
        description: "Nama lengkap, NIK, dan nomor telepon wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{16}$/.test(formData.nik)) {
      toast({
        title: "Error",
        description: "NIK harus 16 digit angka",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLayanan) {
      toast({
        title: "Error",
        description: "Pilih layanan terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/layanan-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layananId: selectedLayanan.id,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setNomorPengajuan(result.data.nomorPengajuan);
        setShowFormDialog(false);
        setSuccessDialog(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengirim pengajuan",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    const icons: { [key: string]: any } = {
      CreditCard: FileText,
      Users: User,
      Baby: User,
      Heart: FileText,
      MapPin: MapPin,
      FileText: FileText,
      RefreshCw: FileText,
      Stamp: FileText,
      Gavel: FileText,
      MoveRight: ChevronRight,
    };
    return icons[iconName || "FileText"] || FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-8 w-8" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Layanan Jarak Jauh
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Layanan Online
              </h1>
              <p className="text-green-100 text-lg">
                Ajukan layanan kependudukan dari mana saja tanpa harus datang ke kantor.
                Untuk masyarakat yang lokasinya jauh dari pusat pelayanan.
              </p>

              <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <h2 className="text-xl font-bold mb-3">Keunggulan Layanan Online</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Tidak perlu datang ke kantor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Upload dokumen persyaratan langsung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Pantau status pengajuan kapan saja</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>GRATIS - tidak dipungut biaya apapun</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => router.push("/layanan-online/cek-status")}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Cek Status Pengajuan
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Available Online Services */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Layanan Tersedia untuk Pengajuan Online
            </h2>

            {layananList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Saat ini belum ada layanan yang tersedia untuk pengajuan online.
                    Silakan kunjungi kantor Disdukcapil untuk layanan langsung.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layananList.map((layanan) => {
                  const IconComponent = getIconComponent(layanan.icon);
                  return (
                    <Card key={layanan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{layanan.name}</CardTitle>
                            <CardDescription>
                              {layanan.processingTime || "Selesai di Tempat"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {layanan.description}
                        </p>

                        {layanan.requirements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Persyaratan:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {layanan.requirements.slice(0, 3).map((req, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">{req.label}</span>
                                </li>
                              ))}
                              {layanan.requirements.length > 3 && (
                                <li className="text-green-600">
                                  +{layanan.requirements.length - 3} persyaratan lainnya
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        <Button
                          onClick={() => openSubmissionForm(layanan)}
                          className="w-full bg-green-700 hover:bg-green-800"
                        >
                          Ajukan Sekarang
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Cara Mengajukan Layanan Online
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                {
                  step: 1,
                  title: "Pilih Layanan",
                  desc: "Pilih layanan yang ingin diajukan",
                  icon: FileText,
                },
                {
                  step: 2,
                  title: "Isi Formulir",
                  desc: "Lengkapi data diri dan informasi pengajuan",
                  icon: User,
                },
                {
                  step: 3,
                  title: "Upload Dokumen",
                  desc: "Unggah dokumen persyaratan yang diperlukan",
                  icon: Upload,
                },
                {
                  step: 4,
                  title: "Pantau Status",
                  desc: "Cek status pengajuan kapan saja",
                  icon: Clock,
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-sm font-bold text-green-600 mb-1">
                    Langkah {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Submission Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pengajuan: {selectedLayanan?.name}</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk mengajukan layanan secara online
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Data Pemohon */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Data Pemohon</CardTitle>
                <CardDescription>Data diri pemohon layanan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
                    <Input
                      id="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, namaLengkap: e.target.value }))
                      }
                      placeholder="Nama sesuai KTP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK (16 digit) *</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nik: e.target.value }))
                      }
                      placeholder="3578010101990001"
                      maxLength={16}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                    <Input
                      id="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tempatLahir: e.target.value }))
                      }
                      placeholder="Jakarta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tanggalLahir: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                    <select
                      id="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, jenisKelamin: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, alamat: e.target.value }))
                    }
                    placeholder="Alamat lengkap"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rt">RT</Label>
                    <Input
                      id="rt"
                      value={formData.rt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rt: e.target.value }))
                      }
                      placeholder="001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw">RW</Label>
                    <Input
                      id="rw"
                      value={formData.rw}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rw: e.target.value }))
                      }
                      placeholder="002"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kelurahan">Kelurahan</Label>
                    <Input
                      id="kelurahan"
                      value={formData.kelurahan}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, kelurahan: e.target.value }))
                      }
                      placeholder="Kelurahan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      value={formData.kecamatan}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, kecamatan: e.target.value }))
                      }
                      placeholder="Kecamatan"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="noTelepon">Nomor Telepon *</Label>
                    <Input
                      id="noTelepon"
                      value={formData.noTelepon}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, noTelepon: e.target.value }))
                      }
                      placeholder="08123456789"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (opsional)</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="email@contoh.com"
                      type="email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dokumen Persyaratan */}
            {selectedLayanan && selectedLayanan.requirements.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Dokumen Persyaratan</CardTitle>
                  <CardDescription>
                    Upload dokumen yang diperlukan untuk pengajuan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedLayanan.requirements.map((req, index) => {
                    const uploadedDoc = formData.dokumen.find(
                      (d) => d.namaDokumen === req.label
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          {uploadedDoc ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{req.label}</p>
                            {req.description && (
                              <p className="text-xs text-gray-500">{req.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedDoc ? (
                            <>
                              <span className="text-xs text-green-600 max-w-32 truncate">
                                {uploadedDoc.fileName}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => removeDocument(req.label)}
                              >
                                Hapus
                              </Button>
                            </>
                          ) : (
                            <Label
                              htmlFor={`doc-${index}`}
                              className={`cursor-pointer ${
                                uploadingDocs ? "pointer-events-none opacity-50" : ""
                              }`}
                            >
                              <input
                                id={`doc-${index}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, req.label)}
                                disabled={uploadingDocs}
                              />
                              <Button variant="outline" size="sm" asChild>
                                <span>
                                  {uploadingDocs ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                </span>
                              </Button>
                            </Label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Keterangan Tambahan */}
            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan Tambahan (opsional)</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, keterangan: e.target.value }))
                }
                placeholder="Tambahkan informasi atau keterangan lain yang diperlukan"
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFormDialog(false)}>
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-700 hover:bg-green-800"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Kirim Pengajuan
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Pengajuan Berhasil Dikirim
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Pengajuan Anda telah berhasil dikirim. Silakan simpan nomor pengajuan berikut
              untuk melacak status:
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-2xl font-bold text-green-700">{nomorPengajuan}</p>
            </div>
            <p className="text-sm text-gray-500">
              Anda akan dihubungi oleh petugas melalui nomor telepon yang terdaftar.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessDialog(false);
                router.push("/layanan-online/cek-status");
              }}
            >
              Cek Status Pengajuan
            </Button>
            <Button
              onClick={() => setSuccessDialog(false)}
              className="bg-green-700 hover:bg-green-800"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
