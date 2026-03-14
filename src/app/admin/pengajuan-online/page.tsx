"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  Eye,
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
  X,
  MessageSquare,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  nomorPengajuan: string;
  namaLengkap: string;
  nik: string;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  noTelepon: string;
  email: string | null;
  keterangan: string | null;
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

const statusOptions = [
  { value: "Baru", label: "Baru", color: "bg-blue-100 text-blue-700" },
  { value: "Diverifikasi", label: "Diverifikasi", color: "bg-yellow-100 text-yellow-700" },
  { value: "Diproses", label: "Diproses", color: "bg-orange-100 text-orange-700" },
  { value: "Selesai", label: "Selesai", color: "bg-green-100 text-green-700" },
  { value: "Ditolak", label: "Ditolak", color: "bg-red-100 text-red-700" },
];

export default function AdminPengajuanOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [catatan, setCatatan] = useState("");

  // Auth check
  const authState = useMemo(() => {
    if (typeof document === "undefined") return { isAuthenticated: false, isLoading: true };
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((c) => c.trim().startsWith("admin_session="));
    const isLoggedIn = sessionCookie?.split("=")[1] === "true";
    return { isAuthenticated: isLoggedIn, isLoading: false };
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push("/admin");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchSubmissions();
    }
  }, [authState.isAuthenticated, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("type", "submissions");
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/layanan-online?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setSubmissions(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengajuan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSubmissions();
  };

  const openDetailDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setNewStatus(submission.status);
    setCatatan(submission.catatan || "");
    setShowDetailDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedSubmission || !newStatus) return;

    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/layanan-online/${selectedSubmission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          catatan: catatan || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Status pengajuan berhasil diperbarui",
        });
        setShowDetailDialog(false);
        fetchSubmissions();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    return (
      <Badge className={statusObj?.color || "bg-gray-100 text-gray-700"}>
        {statusObj?.label || status}
      </Badge>
    );
  };

  // Stats
  const stats = {
    total: submissions.length,
    baru: submissions.filter((s) => s.status === "Baru").length,
    diproses: submissions.filter((s) => s.status === "Diproses").length,
    selesai: submissions.filter((s) => s.status === "Selesai").length,
  };

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengajuan Online</h1>
            <p className="text-gray-500">Kelola pengajuan layanan online dari masyarakat</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Baru</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.baru}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Diproses</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.diproses}</p>
                </div>
                <Loader2 className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{stats.selesai}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Cari nomor pengajuan, nama, atau NIK..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan</CardTitle>
            <CardDescription>
              {submissions.length} pengajuan ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Tidak ada pengajuan ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        No. Pengajuan
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Pemohon
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Layanan
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Tanggal
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-sm">{submission.nomorPengajuan}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-sm">{submission.namaLengkap}</p>
                          <p className="text-xs text-gray-500">{submission.nik}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{submission.layanan.name}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">
                            {formatDate(submission.tanggalPengajuan)}
                          </p>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(submission.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailDialog(submission)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.nomorPengajuan}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-4">
              {/* Status Update */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Pengajuan</Label>
                      <Input value={formatDate(selectedSubmission.tanggalPengajuan)} disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan untuk Pemohon</Label>
                    <Textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Tambahkan catatan jika diperlukan..."
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="bg-green-700 hover:bg-green-800"
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Data Pemohon */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Data Pemohon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="font-medium">{selectedSubmission.namaLengkap}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NIK</p>
                      <p className="font-medium">{selectedSubmission.nik}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">No. Telepon</p>
                        <p className="font-medium">{selectedSubmission.noTelepon}</p>
                      </div>
                    </div>
                    {selectedSubmission.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedSubmission.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedSubmission.tempatLahir && (
                      <div>
                        <p className="text-sm text-gray-500">Tempat Lahir</p>
                        <p className="font-medium">{selectedSubmission.tempatLahir}</p>
                      </div>
                    )}
                    {selectedSubmission.tanggalLahir && (
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Lahir</p>
                        <p className="font-medium">
                          {new Date(selectedSubmission.tanggalLahir).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    )}
                    {selectedSubmission.jenisKelamin && (
                      <div>
                        <p className="text-sm text-gray-500">Jenis Kelamin</p>
                        <p className="font-medium">
                          {selectedSubmission.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                    )}
                    {selectedSubmission.alamat && (
                      <div className="md:col-span-2 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Alamat</p>
                          <p className="font-medium">
                            {selectedSubmission.alamat}
                            {selectedSubmission.rt && ` RT ${selectedSubmission.rt}`}
                            {selectedSubmission.rw && ` RW ${selectedSubmission.rw}`}
                            {selectedSubmission.kelurahan &&
                              `, Kel. ${selectedSubmission.kelurahan}`}
                            {selectedSubmission.kecamatan &&
                              `, Kec. ${selectedSubmission.kecamatan}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Layanan */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Layanan yang Diajukan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedSubmission.layanan.name}</p>
                    </div>
                  </div>
                  {selectedSubmission.keterangan && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Keterangan:</p>
                      <p className="text-sm">{selectedSubmission.keterangan}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dokumen */}
              {selectedSubmission.dokumen.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Dokumen Terlampir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedSubmission.dokumen.map((doc) => (
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

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Riwayat Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Pengajuan Dibuat</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(selectedSubmission.tanggalPengajuan)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedSubmission.tanggalProses && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Sedang Diproses</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(selectedSubmission.tanggalProses)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSubmission.tanggalSelesai && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Selesai</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(selectedSubmission.tanggalSelesai)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
