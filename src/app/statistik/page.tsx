"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, FileText, Loader2, Baby, IdCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RingkasanData {
  periode: string;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  rasioJK: number;
}

interface DokumenKecamatanData {
  id: string;
  kecamatan: string;
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
}

interface RingkasanDokumenData {
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
}

interface StatistikData {
  ringkasan: RingkasanData | null;
  dokumen: DokumenKecamatanData[];
  ringkasanDokumen: RingkasanDokumenData | null;
}

export default function StatistikPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatistikData>({
    ringkasan: null,
    dokumen: [],
    ringkasanDokumen: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/statistik");
        const result = await response.json();
        if (result.success) {
          setData({
            ringkasan: result.data.ringkasan,
            dokumen: result.data.dokumen || [],
            ringkasanDokumen: result.data.ringkasanDokumen || null,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Use ringkasanDokumen if available, otherwise calculate from dokumen kecamatan
  const totalDokumen = data.ringkasanDokumen || data.dokumen.reduce(
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-700 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data statistik...</p>
        </div>
      </div>
    );
  }

  const ringkasan = data.ringkasan || {
    periode: "Data belum tersedia",
    totalPenduduk: 0,
    lakiLaki: 0,
    perempuan: 0,
    rasioJK: 0,
  };

  const totalKTP = totalDokumen.ektpCetak + totalDokumen.ektpBelum;
  const totalAkta = totalDokumen.aktaLahir + totalDokumen.aktaBelum;
  const totalKIA = totalDokumen.kiaMiliki + totalDokumen.kiaBelum;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-green-200 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-bold">Statistik Kependudukan</h1>
          <p className="text-green-200 mt-2">Kabupaten Ngada - Periode {ringkasan.periode}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Total Penduduk */}
        <div className="mb-8">
          <Card className="border-l-4 border-l-green-600 bg-gradient-to-r from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <Users className="h-8 w-8" />
                Jumlah Penduduk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-5xl font-bold text-green-700">{formatNumber(ringkasan.totalPenduduk)}</p>
                <p className="text-gray-500 mt-2">Jiwa</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribusi Jenis Kelamin */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="h-5 w-5" />
              Distribusi Jenis Kelamin
            </CardTitle>
            <CardDescription>
              Rasio: {ringkasan.rasioJK} (Laki-laki per 100 Perempuan)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-4xl font-bold text-green-700">{formatNumber(ringkasan.lakiLaki)}</div>
                <p className="text-gray-600 font-medium mt-2">Laki-laki</p>
                <p className="text-sm text-gray-500 mt-1">
                  {ringkasan.totalPenduduk > 0
                    ? ((ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100).toFixed(2)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10">
                <div className="h-full flex rounded-xl overflow-hidden shadow-inner">
                  <div
                    className="bg-green-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                    style={{
                      width: `${
                        ringkasan.totalPenduduk > 0
                          ? (ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100
                          : 50
                      }%`,
                    }}
                  >
                    L
                  </div>
                  <div
                    className="bg-pink-500 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                    style={{
                      width: `${
                        ringkasan.totalPenduduk > 0
                          ? (ringkasan.perempuan / ringkasan.totalPenduduk) * 100
                          : 50
                      }%`,
                    }}
                  >
                    P
                  </div>
                </div>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-xl">
                <div className="text-4xl font-bold text-pink-600">{formatNumber(ringkasan.perempuan)}</div>
                <p className="text-gray-600 font-medium mt-2">Perempuan</p>
                <p className="text-sm text-gray-500 mt-1">
                  {ringkasan.totalPenduduk > 0
                    ? ((ringkasan.perempuan / ringkasan.totalPenduduk) * 100).toFixed(2)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kepemilikan Dokumen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <FileText className="h-5 w-5" />
              Kepemilikan Dokumen Kependudukan
            </CardTitle>
            <CardDescription>Data kepemilikan KTP, Akta Kelahiran, dan KIA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* E-KTP */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IdCard className="h-6 w-6 text-green-600" />
                    E-KTP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sudah Cetak</span>
                      <span className="font-bold text-green-700 text-xl">
                        {formatNumber(totalDokumen.ektpCetak)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Belum Cetak</span>
                      <span className="font-bold text-red-600 text-xl">
                        {formatNumber(totalDokumen.ektpBelum)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Cakupan</span>
                        <span className="font-bold text-green-700">
                          {totalKTP > 0
                            ? ((totalDokumen.ektpCetak / totalKTP) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              totalKTP > 0
                                ? (totalDokumen.ektpCetak / totalKTP) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Akta Kelahiran */}
              <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    Akta Kelahiran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Memiliki</span>
                      <span className="font-bold text-blue-700 text-xl">
                        {formatNumber(totalDokumen.aktaLahir)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Belum Memiliki</span>
                      <span className="font-bold text-red-600 text-xl">
                        {formatNumber(totalDokumen.aktaBelum)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Cakupan</span>
                        <span className="font-bold text-blue-700">
                          {totalAkta > 0
                            ? ((totalDokumen.aktaLahir / totalAkta) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              totalAkta > 0
                                ? (totalDokumen.aktaLahir / totalAkta) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KIA */}
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Baby className="h-6 w-6 text-purple-600" />
                    KIA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Memiliki</span>
                      <span className="font-bold text-purple-700 text-xl">
                        {formatNumber(totalDokumen.kiaMiliki)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Belum Memiliki</span>
                      <span className="font-bold text-red-600 text-xl">
                        {formatNumber(totalDokumen.kiaBelum)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Cakupan</span>
                        <span className="font-bold text-purple-700">
                          {totalKIA > 0
                            ? ((totalDokumen.kiaMiliki / totalKIA) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              totalKIA > 0
                                ? (totalDokumen.kiaMiliki / totalKIA) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail per Kecamatan */}
            {data.dokumen.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Detail Per Kecamatan
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-700 text-white">
                        <th className="px-4 py-3 text-left">Kecamatan</th>
                        <th className="px-4 py-3 text-right">E-KTP Cetak</th>
                        <th className="px-4 py-3 text-right">Akta Lahir</th>
                        <th className="px-4 py-3 text-right">KIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dokumen.map((d) => (
                        <tr key={d.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{d.kecamatan}</td>
                          <td className="px-4 py-3 text-right">{formatNumber(d.ektpCetak)}</td>
                          <td className="px-4 py-3 text-right">{formatNumber(d.aktaLahir)}</td>
                          <td className="px-4 py-3 text-right">{formatNumber(d.kiaMiliki)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data diperbaharui: {ringkasan.periode}</p>
          <p>Sumber: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada</p>
        </div>
      </div>
    </div>
  );
}
