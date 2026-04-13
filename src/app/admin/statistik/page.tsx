"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Users,
  IdCard,
  Baby,
  FileText,
  AlertCircle,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

interface StatistikData {
  periode: string;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  rasioJK: number;
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
}

const initialData: StatistikData = {
  periode: "",
  totalPenduduk: 0,
  lakiLaki: 0,
  perempuan: 0,
  rasioJK: 0,
  ektpCetak: 0,
  ektpBelum: 0,
  aktaLahir: 0,
  aktaBelum: 0,
  kiaMiliki: 0,
  kiaBelum: 0,
};

type ImportStatus = "idle" | "uploading" | "success" | "error";

export default function AdminStatistikPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<StatistikData>(initialData);

  // Import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [importResult, setImportResult] = useState<{
    imported: number;
    period: string;
    errors?: string[];
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

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
      fetchData();
    }
  }, [authState.isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/statistik");
      const result = await response.json();
      if (result.success) {
        const ringkasan = result.data.ringkasan;
        const ringkasanDokumen = result.data.ringkasanDokumen;

        setData({
          periode: ringkasan?.periode || "",
          totalPenduduk: ringkasan?.totalPenduduk || 0,
          lakiLaki: ringkasan?.lakiLaki || 0,
          perempuan: ringkasan?.perempuan || 0,
          rasioJK: ringkasan?.rasioJK || 0,
          ektpCetak: ringkasanDokumen?.ektpCetak || 0,
          ektpBelum: ringkasanDokumen?.ektpBelum || 0,
          aktaLahir: ringkasanDokumen?.aktaLahir || 0,
          aktaBelum: ringkasanDokumen?.aktaBelum || 0,
          kiaMiliki: ringkasanDokumen?.kiaMiliki || 0,
          kiaBelum: ringkasanDokumen?.kiaBelum || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data kependudukan:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data kependudukan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update ringkasan
      const ringkasanResponse = await fetch("/api/admin/statistik/ringkasan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periode: data.periode,
          totalPenduduk: data.totalPenduduk,
          lakiLaki: data.lakiLaki,
          perempuan: data.perempuan,
          rasioJK: data.rasioJK,
        }),
      });

      // Update dokumen (create or update a summary record)
      const dokumenResponse = await fetch("/api/admin/statistik/dokumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ektpCetak: data.ektpCetak,
          ektpBelum: data.ektpBelum,
          aktaLahir: data.aktaLahir,
          aktaBelum: data.aktaBelum,
          kiaMiliki: data.kiaMiliki,
          kiaBelum: data.kiaBelum,
        }),
      });

      const ringkasanResult = await ringkasanResponse.json();
      const dokumenResult = await dokumenResponse.json();

      if (ringkasanResult.success && dokumenResult.success) {
        toast({
          title: "Berhasil",
          description: "Data kependudukan berhasil disimpan",
        });
        fetchData();
      } else {
        throw new Error("Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error saving data kependudukan:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data kependudukan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleNumberChange = (field: keyof StatistikData, value: string) => {
    const numValue = parseInt(value.replace(/\./g, "").replace(/,/g, "")) || 0;
    setData((prev) => ({ ...prev, [field]: numValue }));
  };

  // Auto-calculate rasioJK when lakiLaki or perempuan changes
  const calculateRasio = () => {
    if (data.perempuan > 0) {
      const rasio = (data.lakiLaki / data.perempuan) * 100;
      setData((prev) => ({ ...prev, rasioJK: parseFloat(rasio.toFixed(2)) }));
    }
  };

  // ======== EXCEL IMPORT FUNCTIONS ========

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/admin/statistik/import-excel");
      if (!response.ok) {
        throw new Error("Gagal mengunduh template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template_penduduk_kecamatan.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Template berhasil diunduh",
        description: "Isi data sesuai kolom yang tersedia, lalu unggah kembali.",
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      toast({
        title: "Gagal mengunduh template",
        description: "Terjadi kesalahan saat mengunduh template Excel",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast({
        title: "Format tidak didukung",
        description: "Harap unggah file dengan format .xlsx atau .xls",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ukuran file terlalu besar",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setImportStatus("idle");
    setImportResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setImportStatus("uploading");
      setImportResult(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "pendudukKecamatan");

      const response = await fetch("/api/admin/statistik/import-excel", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImportStatus("success");
        setImportResult(result.data);
        toast({
          title: "Import berhasil",
          description: `${result.data.imported} data kecamatan berhasil diimpor`,
        });
        // Refresh data
        fetchData();
      } else {
        setImportStatus("error");
        toast({
          title: "Import gagal",
          description: result.error || "Terjadi kesalahan saat mengimpor data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing Excel:", error);
      setImportStatus("error");
      toast({
        title: "Import gagal",
        description: "Terjadi kesalahan saat mengimpor data",
        variant: "destructive",
      });
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportStatus("idle");
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Data Kependudukan</h1>
          <p className="text-gray-500 dark:text-gray-400">Edit data kependudukan yang ditampilkan di website</p>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Petunjuk</AlertTitle>
          <AlertDescription>
            Data yang diubah di halaman ini akan langsung ditampilkan di halaman Data Kependudukan website. 
            Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
          </AlertDescription>
        </Alert>

        {/* ======== EXCEL IMPORT SECTION ======== */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Import Data Excel</CardTitle>
                  <CardDescription>
                    Unggah file Excel untuk memperbarui data penduduk per kecamatan secara massal
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                ${
                  dragOver
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                    : selectedFile
                      ? "border-green-400 bg-green-50/50 dark:bg-green-900/5"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seret & lepas file Excel di sini, atau <span className="text-green-600 dark:text-green-400 font-medium">klik untuk memilih file</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Format: .xlsx, .xls — Maks: 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Column Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Kolom yang diperlukan:</p>
              <div className="flex flex-wrap gap-1.5">
                {["kodeKec", "kecamatan", "lakiLaki", "perempuan", "total", "rasioJK", "periode"].map((col) => (
                  <Badge key={col} variant="secondary" className="text-xs font-mono">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Import Actions & Result */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {selectedFile && importStatus === "idle" && (
                <Button
                  onClick={handleImport}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              )}

              {importStatus === "uploading" && (
                <Button disabled className="bg-green-700 text-white">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengimpor...
                </Button>
              )}

              {importStatus === "success" && importResult && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium text-sm">
                      {importResult.imported} data berhasil diimpor
                      {importResult.period ? ` (Periode: ${importResult.period})` : ""}
                    </span>
                  </div>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 sm:mt-0">
                      {importResult.errors.length} baris dilewati karena error
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={resetImport} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Import lagi
                  </Button>
                </div>
              )}

              {importStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium text-sm">Import gagal. Periksa format file dan coba lagi.</span>
                  <Button variant="ghost" size="sm" onClick={resetImport} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Coba lagi
                  </Button>
                </div>
              )}

              {selectedFile && importStatus === "idle" && (
                <Button variant="ghost" size="sm" onClick={resetImport} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Hapus file
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ======== MANUAL INPUT FORM ======== */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Data Penduduk */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Data Penduduk
              </CardTitle>
              <CardDescription>Data jumlah dan distribusi penduduk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="periode">Periode Data</Label>
                <Input
                  id="periode"
                  value={data.periode}
                  onChange={(e) => setData((prev) => ({ ...prev, periode: e.target.value }))}
                  placeholder="Contoh: Februari 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPenduduk">Total Penduduk</Label>
                <Input
                  id="totalPenduduk"
                  type="text"
                  value={formatNumber(data.totalPenduduk)}
                  onChange={(e) => handleNumberChange("totalPenduduk", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lakiLaki">Laki-laki</Label>
                  <Input
                    id="lakiLaki"
                    type="text"
                    value={formatNumber(data.lakiLaki)}
                    onChange={(e) => handleNumberChange("lakiLaki", e.target.value)}
                    onBlur={calculateRasio}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perempuan">Perempuan</Label>
                  <Input
                    id="perempuan"
                    type="text"
                    value={formatNumber(data.perempuan)}
                    onChange={(e) => handleNumberChange("perempuan", e.target.value)}
                    onBlur={calculateRasio}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rasioJK">Rasio Jenis Kelamin (L per 100 P)</Label>
                <Input
                  id="rasioJK"
                  type="number"
                  step="0.01"
                  value={data.rasioJK}
                  onChange={(e) => setData((prev) => ({ ...prev, rasioJK: parseFloat(e.target.value) || 0 }))}
                />
                <p className="text-xs text-gray-500">Dihitung otomatis dari data laki-laki dan perempuan</p>
              </div>
            </CardContent>
          </Card>

          {/* Kepemilikan Dokumen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Kepemilikan Dokumen
              </CardTitle>
              <CardDescription>Data kepemilikan dokumen kependudukan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* E-KTP */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
                  <IdCard className="h-5 w-5" />
                  E-KTP
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Sudah Cetak</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.ektpCetak)}
                      onChange={(e) => handleNumberChange("ektpCetak", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Belum Cetak</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.ektpBelum)}
                      onChange={(e) => handleNumberChange("ektpBelum", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cakupan: {data.ektpCetak + data.ektpBelum > 0 
                    ? ((data.ektpCetak / (data.ektpCetak + data.ektpBelum)) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>

              {/* Akta Kelahiran */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-teal-800 dark:text-teal-300">
                  <FileText className="h-5 w-5" />
                  Akta Kelahiran
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Memiliki</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.aktaLahir)}
                      onChange={(e) => handleNumberChange("aktaLahir", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Belum Memiliki</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.aktaBelum)}
                      onChange={(e) => handleNumberChange("aktaBelum", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cakupan: {data.aktaLahir + data.aktaBelum > 0 
                    ? ((data.aktaLahir / (data.aktaLahir + data.aktaBelum)) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>

              {/* KIA */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                  <Baby className="h-5 w-5" />
                  KIA (Kartu Identitas Anak)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Memiliki</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.kiaMiliki)}
                      onChange={(e) => handleNumberChange("kiaMiliki", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Belum Memiliki</Label>
                    <Input
                      type="text"
                      value={formatNumber(data.kiaBelum)}
                      onChange={(e) => handleNumberChange("kiaBelum", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cakupan: {data.kiaMiliki + data.kiaBelum > 0 
                    ? ((data.kiaMiliki / (data.kiaMiliki + data.kiaBelum)) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => fetchData()}>
            Reset
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
                Simpan Data
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
