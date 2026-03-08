"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Lock, Building2 } from "lucide-react";

export default function PengaturanPage() {
  const router = useRouter();
  const { toast } = useToast();

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
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-2">Informasi</h3>
              <p className="text-sm text-blue-700">
                Halaman ini berisi pengaturan dasar untuk website dan akun
                administrator. Untuk perubahan data yang lebih kompleks, silakan
                hubungi developer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
