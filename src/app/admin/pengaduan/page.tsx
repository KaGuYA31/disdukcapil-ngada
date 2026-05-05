"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Save,
} from "lucide-react";

const initialComplaints = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "081234567890",
    subject: "Keluhan Pelayanan",
    message: "Saya mengalami kesulitan dalam pengurusan KTP-el. Prosesnya terlalu lama.",
    status: "Baru" as const,
    date: "2024-01-15",
    response: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "081234567891",
    subject: "Pertanyaan Umum",
    message: "Apakah bisa mengurus KK secara online?",
    status: "Diproses" as const,
    date: "2024-01-14",
    response: "Saat ini layanan online masih dalam pengembangan.",
  },
  {
    id: "3",
    name: "Ahmad Yusuf",
    email: "ahmad@example.com",
    phone: "081234567892",
    subject: "Informasi Layanan",
    message: "Jam berapa kantor buka pada hari Jumat?",
    status: "Selesai" as const,
    date: "2024-01-13",
    response: "Kantor kami buka setiap hari kerja (Senin-Jumat) pukul 08.00-15.00 WITA.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Selesai":
      return "bg-green-100 text-green-700";
    case "Baru":
      return "bg-yellow-100 text-yellow-700";
    case "Diproses":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AdminPengaduanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedComplaint, setSelectedComplaint] = useState<
    (typeof initialComplaints)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState("");

  const authState = useMemo(() => {
    if (typeof document === "undefined")
      return { isAuthenticated: false, isLoading: true };
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((c) =>
      c.trim().startsWith("admin_session=")
    );
    const isLoggedIn = sessionCookie?.split("=")[1] === "true";
    return { isAuthenticated: isLoggedIn, isLoading: false };
  }, []);

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "Semua" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (complaint: (typeof initialComplaints)[0]) => {
    setSelectedComplaint(complaint);
    setResponseData(complaint.response);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, status: "Baru" | "Diproses" | "Selesai") => {
    setComplaints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    toast({ title: "Berhasil", description: `Status diubah menjadi ${status}` });
  };

  const handleSaveResponse = () => {
    if (!selectedComplaint) return;

    setComplaints((prev) =>
      prev.map((item) =>
        item.id === selectedComplaint.id
          ? { ...item, response: responseData, status: "Diproses" as const }
          : item
      )
    );
    toast({ title: "Berhasil", description: "Respons berhasil disimpan" });
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-green-600">Loading...</div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    router.push("/admin");
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Pengaduan
            </h1>
            <p className="text-gray-500">Kelola pengaduan dari masyarakat</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                <Clock className="h-3 w-3" />
                {complaints.filter((c) => c.status === "Baru").length} Baru
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded">
                <MessageSquare className="h-3 w-3" />
                {complaints.filter((c) => c.status === "Diproses").length} Diproses
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
                <CheckCircle className="h-3 w-3" />
                {complaints.filter((c) => c.status === "Selesai").length} Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pengaduan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["Semua", "Baru", "Diproses", "Selesai"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className={
                      filterStatus === status
                        ? "bg-green-700 hover:bg-green-800"
                        : ""
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Daftar Pengaduan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Subjek</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{item.subject}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(item.date)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          {item.status !== "Selesai" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(
                                  item.id,
                                  item.status === "Baru" ? "Diproses" : "Selesai"
                                )
                              }
                            >
                              {item.status === "Baru" ? (
                                <>
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Proses
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Selesai
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada pengaduan yang ditemukan
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pengaduan</DialogTitle>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{selectedComplaint.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="font-medium">{selectedComplaint.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedComplaint.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Subjek</p>
                <p className="font-medium">{selectedComplaint.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Pesan</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  {selectedComplaint.message}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Respons</Label>
                <Textarea
                  id="response"
                  value={responseData}
                  onChange={(e) => setResponseData(e.target.value)}
                  placeholder="Tulis respons untuk pengaduan ini..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Tutup
            </Button>
            <Button
              onClick={handleSaveResponse}
              className="bg-green-700 hover:bg-green-800"
            >
              <Save className="mr-2 h-4 w-4" />
              Simpan Respons
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
