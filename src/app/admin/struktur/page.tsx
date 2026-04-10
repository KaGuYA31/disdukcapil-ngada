"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  UserCircle,
  Save,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";

interface StrukturItem {
  id: string;
  name: string;
  position: string;
  photo: string | null;
  description: string | null;
  parentId: string | null;
  order: number;
  createdAt: string;
}

interface FormData {
  name: string;
  position: string;
  photo: string;
  description: string;
  parentId: string;
  order: number;
}

const initialFormData: FormData = {
  name: "",
  position: "",
  photo: "",
  description: "",
  parentId: "",
  order: 0,
};

const positions = [
  { value: "Kepala Dinas", label: "Kepala Dinas", level: 1 },
  { value: "Sekretaris", label: "Sekretaris", level: 2 },
  { value: "Kepala Bidang Pelayanan Penduduk", label: "Kepala Bidang Pelayanan Penduduk", level: 3 },
  { value: "Kepala Bidang Pencatatan Sipil", label: "Kepala Bidang Pencatatan Sipil", level: 3 },
  { value: "Kepala Bidang Pengelolaan Informasi", label: "Kepala Bidang Pengelolaan Informasi", level: 3 },
  { value: "Kepala Sub Bagian Umum", label: "Kepala Sub Bagian Umum", level: 3 },
  { value: "Staf", label: "Staf", level: 4 },
];

export default function AdminStrukturPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<StrukturItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      fetchItems();
    }
  }, [authState.isAuthenticated]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/struktur");
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error("Error fetching struktur:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data struktur organisasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = "/api/struktur";
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { ...formData, id: editingId, parentId: formData.parentId || null }
        : { ...formData, parentId: formData.parentId || null };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil",
          description: editingId ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
        });
        setIsDialogOpen(false);
        setFormData(initialFormData);
        setEditingId(null);
        fetchItems();
      } else {
        toast({
          title: "Error",
          description: data.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving struktur:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: StrukturItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      position: item.position,
      photo: item.photo || "",
      description: item.description || "",
      parentId: item.parentId || "",
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/struktur?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data berhasil dihapus",
        });
        setDeleteConfirm(null);
        fetchItems();
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal menghapus data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting struktur:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex((item) => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === items.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentItem = items[currentIndex];
    const swapItem = items[swapIndex];

    try {
      // Swap order values
      await Promise.all([
        fetch("/api/struktur", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentItem.id, order: swapItem.order }),
        }),
        fetch("/api/struktur", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: swapItem.id, order: currentItem.order }),
        }),
      ]);

      fetchItems();
    } catch (error) {
      console.error("Error reordering:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah urutan",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const getPositionLevel = (position: string) => {
    const pos = positions.find((p) => p.value === position);
    return pos?.level || 4;
  };

  if (authState.isLoading) {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
            <p className="text-gray-500">Kelola data pejabat dan foto struktur organisasi</p>
          </div>
          <Button onClick={openAddDialog} className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pejabat
          </Button>
        </div>

        {/* Struktur List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pejabat ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada data struktur organisasi</p>
                <Button onClick={openAddDialog} variant="outline" className="mt-4">
                  Tambah Data Pertama
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium">Foto</th>
                      <th className="px-4 py-3 text-left font-medium">Nama</th>
                      <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                      <th className="px-4 py-3 text-left font-medium">Level</th>
                      <th className="px-4 py-3 text-center font-medium">Urutan</th>
                      <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100">
                            {item.photo ? (
                              <Image
                                src={item.photo}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UserCircle className="h-8 w-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{item.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600">{item.position}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Level {getPositionLevel(item.position)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleMoveOrder(item.id, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleMoveOrder(item.id, "down")}
                              disabled={index === items.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirm(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Data Pejabat" : "Tambah Pejabat Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama lengkap dengan gelar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Jabatan *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Foto</Label>
              <ImageUpload
                value={formData.photo}
                onChange={(url) => setFormData({ ...formData, photo: url })}
              />
              <p className="text-xs text-gray-500">Upload foto langsung dari komputer</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat"
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
