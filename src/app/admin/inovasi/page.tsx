"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Lightbulb,
  X,
  Save,
  Eye,
  EyeOff,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "inovasi_categories";
const DEFAULT_CATEGORIES = [
  "Jemput Bola",
  "Sosialisasi",
  "Pelayanan Keliling",
  "Konsultasi",
  "Lainnya",
];

function loadCategories(): string[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_CATEGORIES;
}

function saveCategories(cats: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

interface Inovasi {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  photo: string | null;
  location: string | null;
  date: string | null;
  category: string;
  isPublished: boolean;
  author: string | null;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  photo: string;
  location: string;
  date: string;
  category: string;
  isPublished: boolean;
  author: string;
}

export default function AdminInovasiPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Category management state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [removeCategoryConfirm, setRemoveCategoryConfirm] = useState<string | null>(null);

  // Activity management state
  const [activities, setActivities] = useState<Inovasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    content: "",
    photo: "",
    location: "",
    date: "",
    category: DEFAULT_CATEGORIES[0],
    isPublished: true,
    author: "",
  });
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

  // Load categories from localStorage on mount
  useEffect(() => {
    const stored = loadCategories();
    setCategories(stored);
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchActivities();
    }
  }, [authState.isAuthenticated]);

  // ---- Category management ----

  const addCategory = useCallback(() => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: "Duplikat",
        description: `Kategori "${trimmed}" sudah ada.`,
        variant: "destructive",
      });
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setNewCategoryInput("");
    toast({
      title: "Berhasil",
      description: `Kategori "${trimmed}" berhasil ditambahkan.`,
    });
  }, [newCategoryInput, categories, toast]);

  const removeCategory = useCallback(
    (cat: string) => {
      const updated = categories.filter((c) => c !== cat);
      setCategories(updated);
      saveCategories(updated);
      setRemoveCategoryConfirm(null);
      // If the currently selected form category is the removed one, reset it
      setFormData((prev) => {
        if (prev.category === cat) {
          return { ...prev, category: updated[0] || "" };
        }
        return prev;
      });
      toast({
        title: "Berhasil",
        description: `Kategori "${cat}" berhasil dihapus.`,
      });
    },
    [categories, toast]
  );

  // ---- Activity CRUD ----

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inovasi?limit=100");
      const data = await response.json();
      setActivities(data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data kegiatan",
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
      const url = "/api/inovasi";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil",
          description: editingId ? "Kegiatan berhasil diperbarui" : "Kegiatan berhasil ditambahkan",
        });
        setIsDialogOpen(false);
        setFormData({
          title: "",
          description: "",
          content: "",
          photo: "",
          location: "",
          date: "",
          category: categories[0] || DEFAULT_CATEGORIES[0],
          isPublished: true,
          author: "",
        });
        setEditingId(null);
        fetchActivities();
      } else {
        toast({
          title: "Error",
          description: data.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan kegiatan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (activity: Inovasi) => {
    setEditingId(activity.id);
    setFormData({
      title: activity.title,
      description: activity.description,
      content: activity.content,
      photo: activity.photo || "",
      location: activity.location || "",
      date: activity.date ? activity.date.split("T")[0] : "",
      category: activity.category,
      isPublished: activity.isPublished,
      author: activity.author || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inovasi?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Kegiatan berhasil dihapus",
        });
        setDeleteConfirm(null);
        fetchActivities();
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal menghapus kegiatan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus kegiatan",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      photo: "",
      location: "",
      date: "",
      category: categories[0] || DEFAULT_CATEGORIES[0],
      isPublished: true,
      author: "",
    });
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Count activities per category for display
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of activities) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    }
    return counts;
  }, [activities]);

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
            <h1 className="text-2xl font-bold text-gray-900">Kegiatan Inovasi</h1>
            <p className="text-gray-500">Kelola kegiatan inovasi jemput bola</p>
          </div>
          <Button onClick={openAddDialog} className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kegiatan
          </Button>
        </div>

        {/* Category Management Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-700" />
              <CardTitle className="text-base">Kelola Kategori</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {categories.length} kategori
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new category */}
            <div className="flex gap-2">
              <Input
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="Nama kategori baru..."
                className="max-w-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCategory}
                disabled={!newCategoryInput.trim()}
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>

            {/* Category badges */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 hover:border-red-200 group"
                >
                  <span>{cat}</span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({categoryCounts[cat] || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => setRemoveCategoryConfirm(cat)}
                    className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                    aria-label={`Hapus kategori ${cat}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-gray-400">
                  Belum ada kategori. Tambahkan kategori pertama Anda.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kegiatan ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada kegiatan inovasi</p>
                <Button onClick={openAddDialog} variant="outline" className="mt-4">
                  Tambah Kegiatan Pertama
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium">Foto</th>
                      <th className="px-4 py-3 text-left font-medium">Judul</th>
                      <th className="px-4 py-3 text-left font-medium">Lokasi</th>
                      <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                      <th className="px-4 py-3 text-left font-medium">Kategori</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                            {activity.photo ? (
                              <Image
                                src={activity.photo}
                                alt={activity.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 line-clamp-1">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.slug}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location || "-"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(activity.date)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{activity.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {activity.isPublished ? (
                            <Badge className="bg-green-100 text-green-700">Terbit</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(activity)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirm(activity.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Judul Kegiatan *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul kegiatan"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Deskripsi Singkat *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat kegiatan"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="content">Konten Lengkap *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detail kegiatan (mendukung HTML)"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Foto Kegiatan</Label>
                <ImageUpload
                  value={formData.photo}
                  onChange={(url) => setFormData({ ...formData, photo: url })}
                />
                <p className="text-xs text-gray-500">Upload foto langsung dari komputer</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nama lokasi kegiatan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Kegiatan</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Lainnya" disabled>
                        Tidak ada kategori tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-600">
                    Tambahkan kategori di bagian &quot;Kelola Kategori&quot; di atas.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nama penulis"
                />
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublished: checked as boolean })
                  }
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  Terbitkan segera
                </Label>
              </div>
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

      {/* Delete Activity Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
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

      {/* Remove Category Confirmation Dialog */}
      <Dialog open={!!removeCategoryConfirm} onOpenChange={() => setRemoveCategoryConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Hapus Kategori
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori &quot;{removeCategoryConfirm}&quot;?
              {categoryCounts[removeCategoryConfirm || ""] ? (
                <span className="block mt-1 text-amber-600 font-medium">
                  Ada {categoryCounts[removeCategoryConfirm || ""]} kegiatan yang menggunakan
                  kategori ini. Kategori pada kegiatan tersebut tidak akan berubah.
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveCategoryConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeCategoryConfirm && removeCategory(removeCategoryConfirm)}
            >
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
