"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  List,
  GripVertical,
  Upload,
  Download,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Layanan {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  requirements: string;
  procedures: string;
  forms: string | null;
  faq: string | null;
  processingTime: string | null;
  fee: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Requirement {
  label: string;
  description?: string;
}

interface Procedure {
  step: number;
  title: string;
  description?: string;
}

interface FormFile {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

const iconOptions = [
  { value: "CreditCard", label: "Kartu" },
  { value: "Users", label: "Keluarga" },
  { value: "Baby", label: "Bayi" },
  { value: "Heart", label: "Jantung" },
  { value: "MapPin", label: "Lokasi" },
  { value: "FileText", label: "Dokumen" },
  { value: "RefreshCw", label: "Perubahan" },
  { value: "Stamp", label: "Stempel" },
  { value: "Gavel", label: "Pengadilan" },
  { value: "MoveRight", label: "Perpindahan" },
];

function SortableItem({
  layanan,
  onEdit,
  onDelete,
}: {
  layanan: Layanan;
  onEdit: (layanan: Layanan) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layanan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{layanan.name}</h3>
          {layanan.isActive ? (
            <Badge className="bg-green-100 text-green-700">Aktif</Badge>
          ) : (
            <Badge variant="secondary">Nonaktif</Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{layanan.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(layanan)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={() => onDelete(layanan.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayananPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState<Layanan | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "FileText",
    requirements: [] as Requirement[],
    procedures: [] as Procedure[],
    forms: "",
    formFiles: [] as FormFile[],
    faq: "",
    processingTime: "Selesai di Tempat",
    fee: "GRATIS",
    isActive: true,
  });
  const [uploadingForm, setUploadingForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      fetchLayanan();
    }
  }, [authState.isAuthenticated]);

  const fetchLayanan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/layanan");
      const result = await response.json();
      if (result.success) {
        setLayananList(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching layanan:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data layanan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingLayanan(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "FileText",
      requirements: [],
      procedures: [],
      forms: "",
      formFiles: [],
      faq: "",
      processingTime: "Selesai di Tempat",
      fee: "GRATIS",
      isActive: true,
    });
    setShowDialog(true);
  };

  const openEditDialog = (layanan: Layanan) => {
    setEditingLayanan(layanan);
    setFormData({
      name: layanan.name,
      slug: layanan.slug,
      description: layanan.description,
      icon: layanan.icon || "FileText",
      requirements: JSON.parse(layanan.requirements || "[]"),
      procedures: JSON.parse(layanan.procedures || "[]"),
      forms: layanan.forms || "",
      formFiles: layanan.forms ? JSON.parse(layanan.forms) : [],
      faq: layanan.faq || "",
      processingTime: layanan.processingTime || "Selesai di Tempat",
      fee: layanan.fee || "GRATIS",
      isActive: layanan.isActive,
    });
    setShowDialog(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { label: "", description: "" }],
    }));
  };

  const updateRequirement = (index: number, field: keyof Requirement, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.requirements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, requirements: updated };
    });
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addProcedure = () => {
    setFormData((prev) => ({
      ...prev,
      procedures: [...prev.procedures, { step: prev.procedures.length + 1, title: "", description: "" }],
    }));
  };

  const updateProcedure = (index: number, field: keyof Procedure, value: string | number) => {
    setFormData((prev) => {
      const updated = [...prev.procedures];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, procedures: updated };
    });
  };

  const removeProcedure = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      procedures: prev.procedures
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, step: i + 1 })),
    }));
  };

  // File upload handlers
  const handleFormUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingForm(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "forms");

        const response = await fetch("/api/upload-document", {
          method: "POST",
          body: formDataUpload,
        });

        const result = await response.json();
        if (result.success) {
          return {
            name: result.originalName || file.name,
            url: result.url,
            size: result.size,
            type: result.type,
          } as FormFile;
        } else {
          throw new Error(result.error);
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      setFormData((prev) => ({
        ...prev,
        formFiles: [...prev.formFiles, ...uploadedFiles],
      }));

      toast({
        title: "Berhasil",
        description: `${uploadedFiles.length} file berhasil diunggah`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengunggah file",
        variant: "destructive",
      });
    } finally {
      setUploadingForm(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeFormFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      formFiles: prev.formFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.description) {
      toast({
        title: "Error",
        description: "Nama, slug, dan deskripsi harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...(editingLayanan ? { id: editingLayanan.id } : {}),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        icon: formData.icon,
        requirements: JSON.stringify(formData.requirements),
        procedures: JSON.stringify(formData.procedures),
        forms: formData.formFiles.length > 0 ? JSON.stringify(formData.formFiles) : null,
        faq: formData.faq || null,
        processingTime: formData.processingTime,
        fee: formData.fee,
        isActive: formData.isActive,
        order: editingLayanan?.order ?? layananList.length,
      };

      const response = await fetch("/api/layanan", {
        method: editingLayanan ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Berhasil",
          description: editingLayanan ? "Layanan berhasil diperbarui" : "Layanan berhasil ditambahkan",
        });
        setShowDialog(false);
        fetchLayanan();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving layanan:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan layanan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/layanan?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Layanan berhasil dihapus",
        });
        setDeleteDialog(null);
        fetchLayanan();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting layanan:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus layanan",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLayananList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Save new order to backend
      // This could be optimized to batch update
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Layanan</h1>
            <p className="text-gray-500">Kelola daftar layanan yang ditampilkan di website</p>
          </div>
          <Button onClick={openNewDialog} className="bg-green-700 hover:bg-green-800">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Layanan
          </Button>
        </div>

        {/* Layanan List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Layanan</CardTitle>
            <CardDescription>
              Drag dan drop untuk mengubah urutan. Klik edit untuk mengubah detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {layananList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada layanan. Klik tombol "Tambah Layanan" untuk menambahkan.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={layananList.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {layananList.map((layanan) => (
                      <SortableItem
                        key={layanan.id}
                        layanan={layanan}
                        onEdit={openEditDialog}
                        onDelete={(id) => setDeleteDialog(id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLayanan ? "Edit Layanan" : "Tambah Layanan Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi detail layanan di bawah ini. Semua field bertanda * wajib diisi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Layanan *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: KTP-el"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="ktp-el"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang layanan ini"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingTime">Waktu Proses</Label>
                <Input
                  id="processingTime"
                  value={formData.processingTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, processingTime: e.target.value }))
                  }
                  placeholder="Selesai di Tempat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Biaya</Label>
                <Input
                  id="fee"
                  value={formData.fee}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fee: e.target.value }))}
                  placeholder="GRATIS"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="isActive">Layanan aktif (ditampilkan di website)</Label>
            </div>

            {/* Requirements */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Persyaratan
                    </CardTitle>
                    <CardDescription>Daftar persyaratan untuk layanan ini</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addRequirement}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.requirements.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada persyaratan</p>
                ) : (
                  formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={req.label}
                          onChange={(e) => updateRequirement(index, "label", e.target.value)}
                          placeholder="Nama persyaratan"
                        />
                        <Input
                          value={req.description || ""}
                          onChange={(e) => updateRequirement(index, "description", e.target.value)}
                          placeholder="Keterangan (opsional)"
                          className="text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Procedures */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Prosedur
                    </CardTitle>
                    <CardDescription>Langkah-langkah prosedur layanan</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addProcedure}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.procedures.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada prosedur</p>
                ) : (
                  formData.procedures.map((proc, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {proc.step}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={proc.title}
                          onChange={(e) => updateProcedure(index, "title", e.target.value)}
                          placeholder="Judul langkah"
                        />
                        <Input
                          value={proc.description || ""}
                          onChange={(e) => updateProcedure(index, "description", e.target.value)}
                          placeholder="Keterangan (opsional)"
                          className="text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => removeProcedure(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Form Upload Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Formulir Layanan
                    </CardTitle>
                    <CardDescription>Upload formulir yang dapat diunduh oleh masyarakat</CardDescription>
                  </div>
                  <Label 
                    htmlFor="form-upload" 
                    className={`cursor-pointer ${uploadingForm ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <input
                      id="form-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      multiple
                      className="hidden"
                      onChange={handleFormUpload}
                      disabled={uploadingForm}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        {uploadingForm ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload File
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 mb-3">
                  Format: PDF, Word, Excel. Maksimal 10MB per file.
                </p>
                {formData.formFiles.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <File className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">
                      Belum ada formulir. Klik tombol "Upload File" untuk menambahkan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.formFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <File className="h-5 w-5 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.size || "Unknown size"}
                          </p>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <Download className="h-4 w-4 text-gray-600" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => removeFormFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <div className="space-y-2">
              <Label htmlFor="faq">FAQ / Catatan (opsional)</Label>
              <Textarea
                id="faq"
                value={formData.faq}
                onChange={(e) => setFormData((prev) => ({ ...prev, faq: e.target.value }))}
                placeholder="Pertanyaan yang sering diajukan atau catatan penting"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-green-700 hover:bg-green-800">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
