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
  CalendarDays,
  ArrowRight,
  Clock,
  TrendingUp,
  Activity,
  ClipboardList,
  Globe,
  BarChart3,
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function getTodayFormatted() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-sm text-gray-500">Memuat data dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 p-6 md:p-8 text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-green-200" />
              <span className="text-sm font-medium text-green-100">Dashboard Admin</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {getGreeting()}, Administrator! 👋
            </h1>
            <p className="text-green-100/80 text-sm md:text-base max-w-2xl">
              Selamat datang di panel admin Disdukcapil Kabupaten Ngada. Kelola data kependudukan, layanan, dan konten website dari sini.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-green-100/70">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{getTodayFormatted()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Periode Data: {ringkasan.periode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Population Stats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Data Kependudukan</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(ringkasan.totalPenduduk)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Penduduk</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-teal-700">
                  {formatNumber(ringkasan.lakiLaki)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Laki-laki
                  {ringkasan.totalPenduduk > 0 && (
                    <span className="text-teal-500 ml-1">
                      ({((ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100).toFixed(1)}%)
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-pink-700">
                  {formatNumber(ringkasan.perempuan)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Perempuan
                  {ringkasan.totalPenduduk > 0 && (
                    <span className="text-pink-500 ml-1">
                      ({((ringkasan.perempuan / ringkasan.totalPenduduk) * 100).toFixed(1)}%)
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-700">
                  {ringkasan.rasioJK}
                </p>
                <p className="text-xs text-gray-500 mt-1">Rasio JK (L:100P)</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Blanko E-KTP Status + Quick Actions Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Blanko Status - 2 cols */}
          <Card className={`lg:col-span-2 border-0 shadow-sm ${blanko && blanko.jumlahTersedia > 0 ? "border-l-4 border-l-teal-500" : "border-l-4 border-l-red-500"}`}>
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

          {/* Quick Actions - 1 col */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/statistik" className="block">
                <Button variant="outline" className="w-full justify-between text-sm h-10">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    Data Kependudukan
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/pengaturan" className="block">
                <Button variant="outline" className="w-full justify-between text-sm h-10">
                  <span className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-teal-600" />
                    Kelola Blanko E-KTP
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/berita?new=true" className="block">
                <Button variant="outline" className="w-full justify-between text-sm h-10">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    Buat Berita Baru
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/pengaduan" className="block">
                <Button variant="outline" className="w-full justify-between text-sm h-10">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-pink-600" />
                    Kelola Pengaduan
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Document Ownership Stats */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Kepemilikan Dokumen Kependudukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* E-KTP */}
              <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <IdCard className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-green-800 text-sm">E-KTP</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sudah Cetak</span>
                    <span className="font-bold text-green-700">{formatNumber(totalDokumen.ektpCetak)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Belum Cetak</span>
                    <span className="font-bold text-red-600">{formatNumber(totalDokumen.ektpBelum)}</span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Cakupan</span>
                      <span className="font-bold text-green-700">{totalKTP > 0 ? ((totalDokumen.ektpCetak / totalKTP) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                        style={{ width: `${totalKTP > 0 ? (totalDokumen.ektpCetak / totalKTP) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Akta Kelahiran */}
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="font-semibold text-teal-800 text-sm">Akta Kelahiran</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memiliki</span>
                    <span className="font-bold text-teal-700">{formatNumber(totalDokumen.aktaLahir)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Belum Memiliki</span>
                    <span className="font-bold text-red-600">{formatNumber(totalDokumen.aktaBelum)}</span>
                  </div>
                  <div className="pt-2 border-t border-teal-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Cakupan</span>
                      <span className="font-bold text-teal-700">{totalAkta > 0 ? ((totalDokumen.aktaLahir / totalAkta) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-1000"
                        style={{ width: `${totalAkta > 0 ? (totalDokumen.aktaLahir / totalAkta) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KIA */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Baby className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="font-semibold text-amber-800 text-sm">KIA</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memiliki</span>
                    <span className="font-bold text-amber-700">{formatNumber(totalDokumen.kiaMiliki)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Belum Memiliki</span>
                    <span className="font-bold text-red-600">{formatNumber(totalDokumen.kiaBelum)}</span>
                  </div>
                  <div className="pt-2 border-t border-amber-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Cakupan</span>
                      <span className="font-bold text-amber-700">{totalKIA > 0 ? ((totalDokumen.kiaMiliki / totalKIA) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000"
                        style={{ width: `${totalKIA > 0 ? (totalDokumen.kiaMiliki / totalKIA) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
