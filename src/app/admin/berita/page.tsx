"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MoreHorizontal,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const dynamic = 'force-dynamic';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  slug: string;
  isPublished: boolean;
  author: string | null;
  thumbnail: string | null;
  photos: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const categories = ["Informasi", "Pengumuman", "Kegiatan"];

function AdminBeritaContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(
    searchParams.get("new") === "true"
  );
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Informasi",
    isPublished: true,
    thumbnail: "",
    photos: [] as string[],
  });

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/berita");
      const result = await response.json();
      if (result.success) {
        setNews(result.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data berita",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (item?: NewsItem) => {
    if (item) {
      setEditingNews(item);
      let parsedPhotos: string[] = [];
      try {
        parsedPhotos = item.photos ? JSON.parse(item.photos) : [];
      } catch {
        parsedPhotos = [];
      }
      setFormData({
        title: item.title,
        excerpt: item.excerpt || "",
        content: item.content,
        category: item.category,
        isPublished: item.isPublished,
        thumbnail: item.thumbnail || "",
        photos: parsedPhotos,
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Informasi",
        isPublished: true,
        thumbnail: "",
        photos: [],
      });
    }
    setIsDialogOpen(true);
  };

  const addPhotoSlot = () => {
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ""] }));
  };

  const removePhotoSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const updatePhotoSlot = (index: number, url: string) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = url;
      return { ...prev, photos: newPhotos };
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Judul dan konten harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingNews) {
        const response = await fetch(`/api/berita/${editingNews.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success) {
          toast({ title: "Berhasil", description: "Berita berhasil diperbarui" });
          fetchNews();
        } else {
          throw new Error(result.error);
        }
      } else {
        const response = await fetch("/api/berita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success) {
          toast({ title: "Berhasil", description: "Berita berhasil ditambahkan" });
          fetchNews();
        } else {
          throw new Error(result.error);
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan berita",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

    try {
      const response = await fetch(`/api/berita/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: "Berhasil", description: "Berita berhasil dihapus" });
        fetchNews();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus berita",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
            <p className="text-gray-500">Kelola berita dan informasi website</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-green-700 hover:bg-green-800">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Berita
          </Button>
        </div>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ImageIcon className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{item.excerpt}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {item.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredNews.length === 0 && (
              <div className="text-center py-8 text-gray-500">Tidak ada berita</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul berita"
              />
            </div>
            <div className="space-y-2">
              <Label>Foto Thumbnail</Label>
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
              />
              <p className="text-xs text-gray-500">Upload foto langsung dari komputer</p>
            </div>
            {/* Foto Tambahan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Foto Tambahan</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhotoSlot}
                  className="text-green-700 border-green-300 hover:bg-green-50"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Foto
                </Button>
              </div>
              {formData.photos.length > 0 && (
                <div className="space-y-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <ImageUpload
                            value={photo}
                            onChange={(url) => updatePhotoSlot(index, url)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mt-1 shrink-0"
                          onClick={() => removePhotoSlot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Foto {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
              {formData.photos.length === 0 && (
                <p className="text-xs text-gray-400 italic">Belum ada foto tambahan</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Masukkan ringkasan berita"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Masukkan konten berita lengkap"
                rows={6}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.isPublished ? "Published" : "Draft"} onValueChange={(value) => setFormData((prev) => ({ ...prev, isPublished: value === "Published" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function AdminBeritaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>}>
      <AdminBeritaContent />
    </Suspense>
  );
}
