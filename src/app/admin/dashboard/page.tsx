"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  FileText,
  Loader2,
  IdCard,
  Baby,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";

interface StatistikData {
  ringkasan: {
    totalPenduduk: number;
    lakiLaki: number;
    perempuan: number;
    rasioJK: number;
    periode: string;
  } | null;
  dokumen: Array<{
    ektpCetak: number;
    ektpBelum: number;
    aktaLahir: number;
    aktaBelum: number;
    kiaMiliki: number;
    kiaBelum: number;
  }>;
}

interface BlankoData {
  jumlahTersedia: number;
  keterangan: string | null;
  updatedAt: string | null;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statistik, setStatistik] = useState<StatistikData>({
    ringkasan: null,
    dokumen: [],
  });
  const [blanko, setBlanko] = useState<BlankoData | null>(null);

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

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push("/admin");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchStatistik();
      fetchBlanko();
    }
  }, [authState.isAuthenticated]);

  const fetchBlanko = async () => {
    try {
      const response = await fetch("/api/blanko-ektp");
      const result = await response.json();
      if (result.success && result.data) {
        setBlanko(result.data);
      }
    } catch (error) {
      console.error("Error fetching blanko:", error);
    }
  };

  const fetchStatistik = async () => {
    try {
      const response = await fetch("/api/admin/statistik");
      const result = await response.json();
      if (result.success) {
        setStatistik({
          ringkasan: result.data.ringkasan,
          dokumen: result.data.dokumen || [],
        });
      }
    } catch (error) {
      console.error("Error fetching data kependudukan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate document totals
  const totalDokumen = statistik.dokumen.reduce(
    (acc, d) => ({
      ektpCetak: acc.ektpCetak + d.ektpCetak,
      ektpBelum: acc.ektpBelum + d.ektpBelum,
      aktaLahir: acc.aktaLahir + d.aktaLahir,
      aktaBelum: acc.aktaBelum + d.aktaBelum,
      kiaMiliki: acc.kiaMiliki + d.kiaMiliki,
      kiaBelum: acc.kiaBelum + d.kiaBelum,
    }),
    { ektpCetak: 0, ektpBelum: 0, aktaLahir: 0, aktaBelum: 0, kiaMiliki: 0, kiaBelum: 0 }
  );

  const totalKTP = totalDokumen.ektpCetak + totalDokumen.ektpBelum;
  const totalAkta = totalDokumen.aktaLahir + totalDokumen.aktaBelum;
  const totalKIA = totalDokumen.kiaMiliki + totalDokumen.kiaBelum;

  const ringkasan = statistik.ringkasan || {
    totalPenduduk: 0,
    lakiLaki: 0,
    perempuan: 0,
    rasioJK: 0,
    periode: "-",
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Data Kependudukan Kabupaten Ngada - Periode {ringkasan.periode}
          </p>
        </div>

        {/* Population Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200 border-l-4 border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Penduduk</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(ringkasan.totalPenduduk)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Jiwa</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Laki-laki</p>
                  <p className="text-2xl font-bold text-teal-700 mt-1">
                    {formatNumber(ringkasan.lakiLaki)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {ringkasan.totalPenduduk > 0
                      ? ((ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-l-4 border-l-pink-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Perempuan</p>
                  <p className="text-2xl font-bold text-pink-700 mt-1">
                    {formatNumber(ringkasan.perempuan)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {ringkasan.totalPenduduk > 0
                      ? ((ringkasan.perempuan / ringkasan.totalPenduduk) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-l-4 border-l-amber-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rasio JK</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">
                    {ringkasan.rasioJK}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Laki per 100 Perempuan</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blanko E-KTP Status */}
        <Card className={`border-2 ${blanko && blanko.jumlahTersedia > 0 ? "border-teal-200 bg-gradient-to-r from-teal-50 to-white" : "border-red-200 bg-gradient-to-r from-red-50 to-white"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${blanko && blanko.jumlahTersedia > 0 ? "bg-teal-100" : "bg-red-100"}`}>
                  <IdCard className={`h-7 w-7 ${blanko && blanko.jumlahTersedia > 0 ? "text-teal-600" : "text-red-600"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ketersediaan Blanko E-KTP</h3>
                  <p className={`text-3xl font-bold mt-1 ${blanko && blanko.jumlahTersedia > 0 ? "text-teal-700" : "text-red-600"}`}>
                    {blanko ? formatNumber(blanko.jumlahTersedia) : "0"} <span className="text-base font-normal text-gray-500">lembar</span>
                  </p>
                  {blanko?.keterangan && (
                    <p className="text-sm text-gray-500 mt-1">{blanko.keterangan}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={blanko && blanko.jumlahTersedia > 0 ? "default" : "destructive"} className="text-xs">
                  {blanko && blanko.jumlahTersedia > 0 ? "Tersedia" : "Kosong"}
                </Badge>
                {blanko?.updatedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Diperbarui: {new Date(blanko.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
            {blanko && blanko.jumlahTersedia === 0 && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Blanko E-KTP habis. Segera update stok melalui halaman{" "}
                  <Link href="/admin/pengaturan" className="font-semibold underline">Pengaturan</Link>.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Ownership Stats */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Kepemilikan Dokumen Kependudukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* E-KTP */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <IdCard className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">E-KTP</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sudah Cetak</span>
                    <span className="font-bold text-green-700">
                      {formatNumber(totalDokumen.ektpCetak)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Belum Cetak</span>
                    <span className="font-bold text-red-600">
                      {formatNumber(totalDokumen.ektpBelum)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span>Cakupan</span>
                      <span className="font-bold">
                        {totalKTP > 0 ? ((totalDokumen.ektpCetak / totalKTP) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{
                          width: `${totalKTP > 0 ? (totalDokumen.ektpCetak / totalKTP) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Akta Kelahiran */}
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-teal-800">Akta Kelahiran</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Memiliki</span>
                    <span className="font-bold text-teal-700">
                      {formatNumber(totalDokumen.aktaLahir)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Belum Memiliki</span>
                    <span className="font-bold text-red-600">
                      {formatNumber(totalDokumen.aktaBelum)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-teal-200">
                    <div className="flex justify-between text-sm">
                      <span>Cakupan</span>
                      <span className="font-bold">
                        {totalAkta > 0 ? ((totalDokumen.aktaLahir / totalAkta) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{
                          width: `${totalAkta > 0 ? (totalDokumen.aktaLahir / totalAkta) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KIA */}
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Baby className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">KIA</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Memiliki</span>
                    <span className="font-bold text-amber-700">
                      {formatNumber(totalDokumen.kiaMiliki)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Belum Memiliki</span>
                    <span className="font-bold text-red-600">
                      {formatNumber(totalDokumen.kiaBelum)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-amber-200">
                    <div className="flex justify-between text-sm">
                      <span>Cakupan</span>
                      <span className="font-bold">
                        {totalKIA > 0 ? ((totalDokumen.kiaMiliki / totalKIA) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{
                          width: `${totalKIA > 0 ? (totalDokumen.kiaMiliki / totalKIA) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/statistik">
                <Button className="w-full bg-green-700 hover:bg-green-800">
                  <FileText className="mr-2 h-4 w-4" />
                  Kelola Data Kependudukan
                </Button>
              </Link>
              <Link href="/admin/pengaturan">
                <Button variant="outline" className="w-full">
                  <IdCard className="mr-2 h-4 w-4" />
                  Kelola Blanko E-KTP
                </Button>
              </Link>
              <Link href="/admin/berita?new=true">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Buat Berita Baru
                </Button>
              </Link>
              <Link href="/admin/pengaduan">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Kelola Pengaduan
                </Button>
              </Link>
              <Link href="/statistik" target="_blank">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Lihat Data Publik
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
