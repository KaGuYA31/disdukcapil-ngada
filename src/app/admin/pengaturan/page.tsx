"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Lock, Building2, IdCard, Loader2, RefreshCw } from "lucide-react";

interface BlankoData {
  jumlahTersedia: number;
  keterangan: string | null;
  updatedAt: string | null;
}

export default function PengaturanPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Blanko E-KTP state
  const [blankoJumlah, setBlankoJumlah] = useState<string>("");
  const [blankoKeterangan, setBlankoKeterangan] = useState<string>("");
  const [blankoLoading, setBlankoLoading] = useState(true);
  const [blankoSaving, setBlankoSaving] = useState(false);
  const [blankoLastUpdated, setBlankoLastUpdated] = useState<string>("-");

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

  // Fetch blanko E-KTP data
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBlankoData();
    }
  }, [authState.isAuthenticated]);

  const fetchBlankoData = async () => {
    try {
      const response = await fetch("/api/blanko-ektp");
      const result = await response.json();
      if (result.success && result.data) {
        setBlankoJumlah(String(result.data.jumlahTersedia));
        setBlankoKeterangan(result.data.keterangan || "");
        if (result.data.updatedAt) {
          setBlankoLastUpdated(
            new Date(result.data.updatedAt).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching blanko data:", error);
    } finally {
      setBlankoLoading(false);
    }
  };

  const handleSaveBlanko = async () => {
    const jumlah = parseInt(blankoJumlah, 10);
    if (isNaN(jumlah) || jumlah < 0) {
      toast({
        title: "Error",
        description: "Jumlah blanko harus berupa angka positif",
        variant: "destructive",
      });
      return;
    }

    setBlankoSaving(true);
    try {
      const response = await fetch("/api/blanko-ektp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jumlahTersedia: jumlah,
          keterangan: blankoKeterangan.trim() || null,
          updatedBy: "Admin",
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Data ketersediaan blanko E-KTP berhasil diperbarui",
        });
        await fetchBlankoData();
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan saat menyimpan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving blanko data:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan koneksi",
        variant: "destructive",
      });
    } finally {
      setBlankoSaving(false);
    }
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

  const handleSave = () => {
    toast({
      title: "Berhasil",
      description: "Pengaturan berhasil disimpan",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-500">Kelola pengaturan website dan akun admin</p>
        </div>

        {/* Blanko E-KTP Management - Top Priority */}
        <Card className="border-gray-200 border-l-4 border-l-teal-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-5 w-5 text-teal-600" />
              Ketersediaan Blanko E-KTP
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Atur jumlah ketersediaan blanko E-KTP. Data ini akan ditampilkan di halaman utama website.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {blankoLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                <span className="text-gray-500">Memuat data blanko...</span>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blanko-jumlah">
                      Jumlah Blanko Tersedia
                    </Label>
                    <div className="relative">
                      <Input
                        id="blanko-jumlah"
                        type="number"
                        min="0"
                        value={blankoJumlah}
                        onChange={(e) => setBlankoJumlah(e.target.value)}
                        placeholder="Masukkan jumlah blanko"
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        lembar
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blanko-last-updated">
                      Terakhir Diperbarui
                    </Label>
                    <Input
                      id="blanko-last-updated"
                      value={blankoLastUpdated}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blanko-keterangan">
                    Keterangan (Opsional)
                  </Label>
                  <Textarea
                    id="blanko-keterangan"
                    value={blankoKeterangan}
                    onChange={(e) => setBlankoKeterangan(e.target.value)}
                    placeholder="Contoh: Blanko habis, menunggu pengiriman dari Kemendagri"
                    rows={2}
                  />
                  <p className="text-xs text-gray-400">
                    Keterangan tambahan yang akan ditampilkan di halaman utama
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Preview di Halaman Utama
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${parseInt(blankoJumlah, 10) > 0 ? "bg-teal-100" : "bg-red-100"}`}>
                      <IdCard className={`h-6 w-6 ${parseInt(blankoJumlah, 10) > 0 ? "text-teal-600" : "text-red-600"}`} />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${parseInt(blankoJumlah, 10) > 0 ? "text-teal-700" : "text-red-600"}`}>
                        {blankoJumlah || "0"}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">Blanko E-KTP</p>
                      <p className="text-xs text-gray-500">
                        {blankoKeterangan.trim() || (parseInt(blankoJumlah, 10) > 0 ? "Tersedia saat ini" : "Kosong")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveBlanko}
                    disabled={blankoSaving}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {blankoSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Simpan Blanko E-KTP
                  </Button>
                  <Button
                    onClick={fetchBlankoData}
                    variant="outline"
                    disabled={blankoLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Profil Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nama</Label>
                <Input id="admin-name" defaultValue="Administrator" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@ngadakab.go.id"
                />
              </div>
              <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800">
                <Save className="mr-2 h-4 w-4" />
                Simpan Profil
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Ubah Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800">
                <Save className="mr-2 h-4 w-4" />
                Ubah Password
              </Button>
            </CardContent>
          </Card>

          {/* Site Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Informasi Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nama Instansi</Label>
                <Input
                  id="site-name"
                  defaultValue="Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-address">Alamat</Label>
                <Input
                  id="site-address"
                  defaultValue="Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86413"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-phone">Telepon</Label>
                <Input id="site-phone" defaultValue="(0382) 21073" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-email">Email</Label>
                <Input
                  id="site-email"
                  type="email"
                  defaultValue="disdukcapil@ngadakab.go.id"
                />
              </div>
              <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800">
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-teal-800 mb-2">Informasi</h3>
              <p className="text-sm text-teal-700">
                Halaman ini berisi pengaturan dasar untuk website dan akun
                administrator. Data blanko E-KTP yang disimpan akan langsung
                ditampilkan di halaman utama website publik.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
