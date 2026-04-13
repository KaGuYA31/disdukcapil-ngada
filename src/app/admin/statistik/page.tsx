"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Users, IdCard, Baby, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function AdminStatistikPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<StatistikData>(initialData);

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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Data Kependudukan</h1>
          <p className="text-gray-500">Edit data kependudukan yang ditampilkan di website</p>
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

        {/* Form */}
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
              <div className="p-4 bg-green-50 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-green-800">
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
                <p className="text-xs text-gray-500">
                  Cakupan: {data.ektpCetak + data.ektpBelum > 0 
                    ? ((data.ektpCetak / (data.ektpCetak + data.ektpBelum)) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>

              {/* Akta Kelahiran */}
              <div className="p-4 bg-teal-50 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-teal-800">
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
                <p className="text-xs text-gray-500">
                  Cakupan: {data.aktaLahir + data.aktaBelum > 0 
                    ? ((data.aktaLahir / (data.aktaLahir + data.aktaBelum)) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>

              {/* KIA */}
              <div className="p-4 bg-amber-50 rounded-lg space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-800">
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
                <p className="text-xs text-gray-500">
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
