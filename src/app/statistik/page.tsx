"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Baby, Heart, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  statistikUtama,
  dataKecamatan,
  dataAgama,
  dataPendidikan,
  dataPekerjaan,
  dataDisabilitas,
} from "@/data/statistik";

const COLORS = ["#166534", "#15803d", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

const genderColors = {
  lakiLaki: "#166534",
  perempuan: "#f472b6",
};

export default function StatistikPage() {
  const [activeTab, setActiveTab] = useState("ringkasan");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const kecamatanChartData = dataKecamatan.map((k) => ({
    nama: k.nama,
    "Laki-laki": k.lakiLaki,
    Perempuan: k.perempuan,
  }));

  const agamaChartData = dataAgama.map((a) => ({
    nama: a.nama,
    total: a.total,
    persentase: a.persentase,
  }));

  const pendidikanChartData = dataPendidikan.slice(0, 6).map((p) => ({
    tingkat: p.tingkat.replace("/Sederajat", "").substring(0, 15),
    total: p.total,
  }));

  const pekerjaanChartData = dataPekerjaan.slice(0, 8).map((p) => ({
    jenis: p.jenis.substring(0, 12),
    total: p.total,
  }));

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
          <p className="text-green-200 mt-2">Kabupaten Ngada - Periode {statistikUtama.periode}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Total Penduduk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">{formatNumber(statistikUtama.totalPenduduk)}</p>
              <p className="text-xs text-gray-500">Jiwa</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Baby className="h-4 w-4 text-blue-600" />
                Kelahiran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">{formatNumber(statistikUtama.jumlahKelahiran)}</p>
              <p className="text-xs text-gray-500">CBR: {statistikUtama.angkaKelahiranKasar}/1000</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                Perkawinan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">{formatNumber(statistikUtama.jumlahPerkawinan)}</p>
              <p className="text-xs text-gray-500">Pasangan</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-600">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                Cakupan Akta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-700">{statistikUtama.cakupanAktaKelahiran}%</p>
              <p className="text-xs text-gray-500">Akta Kelahiran</p>
            </CardContent>
          </Card>
        </div>

        {/* Gender Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Distribusi Jenis Kelamin</CardTitle>
            <CardDescription>Rasio: {statistikUtama.rasioJenisKelamin} (Laki-laki per 100 Perempuan)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-700">{formatNumber(statistikUtama.pendudukLakiLaki)}</div>
                <p className="text-gray-600">Laki-laki</p>
                <p className="text-sm text-gray-500">{((statistikUtama.pendudukLakiLaki / statistikUtama.totalPenduduk) * 100).toFixed(2)}%</p>
              </div>
              <div className="h-8">
                <div className="h-full flex rounded-lg overflow-hidden">
                  <div
                    className="bg-green-600 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${(statistikUtama.pendudukLakiLaki / statistikUtama.totalPenduduk) * 100}%` }}
                  >
                    L
                  </div>
                  <div
                    className="bg-pink-400 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${(statistikUtama.pendudukPerempuan / statistikUtama.totalPenduduk) * 100}%` }}
                  >
                    P
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600">{formatNumber(statistikUtama.pendudukPerempuan)}</div>
                <p className="text-gray-600">Perempuan</p>
                <p className="text-sm text-gray-500">{((statistikUtama.pendudukPerempuan / statistikUtama.totalPenduduk) * 100).toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
            <TabsTrigger value="agama">Agama</TabsTrigger>
            <TabsTrigger value="pendidikan">Pendidikan</TabsTrigger>
            <TabsTrigger value="pekerjaan">Pekerjaan</TabsTrigger>
          </TabsList>

          {/* Ringkasan */}
          <TabsContent value="ringkasan">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pertumbuhan Penduduk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span>Kelahiran</span>
                    <span className="font-bold text-green-700">{formatNumber(statistikUtama.jumlahKelahiran)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                    <span>Kematian</span>
                    <span className="font-bold text-red-700">{formatNumber(statistikUtama.jumlahKematian)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Pertumbuhan Alami</span>
                      <span className={`font-bold ${statistikUtama.pertumbuhanAlami < 0 ? "text-red-600" : "text-green-600"}`}>
                        {formatNumber(statistikUtama.pertumbuhanAlami)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perkawinan & Perceraian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between p-3 bg-pink-50 rounded-lg">
                    <span>Perkawinan</span>
                    <span className="font-bold text-pink-700">{formatNumber(statistikUtama.jumlahPerkawinan)} pasangan</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-100 rounded-lg">
                    <span>Perceraian</span>
                    <span className="font-bold">{formatNumber(statistikUtama.jumlahPerceraian)} kasus</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Penyandang Disabilitas</CardTitle>
                  <CardDescription>
                    Total: {formatNumber(statistikUtama.totalDisabilitas)} orang ({((statistikUtama.totalDisabilitas / statistikUtama.totalPenduduk) * 100).toFixed(2)}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dataDisabilitas.map((d) => (
                      <div key={d.no} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{d.jenis}</p>
                        <p className="font-bold text-green-700">{formatNumber(d.total)}</p>
                        <p className="text-xs text-gray-500">{d.persentase}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kecamatan */}
          <TabsContent value="kecamatan">
            <Card>
              <CardHeader>
                <CardTitle>Penduduk Per Kecamatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kecamatanChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="nama" type="category" width={100} fontSize={11} />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="Laki-laki" fill={genderColors.lakiLaki} />
                      <Bar dataKey="Perempuan" fill={genderColors.perempuan} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-700 text-white">
                        <th className="px-3 py-2 text-left">No</th>
                        <th className="px-3 py-2 text-left">Kecamatan</th>
                        <th className="px-3 py-2 text-right">Laki-laki</th>
                        <th className="px-3 py-2 text-right">Perempuan</th>
                        <th className="px-3 py-2 text-right">Total</th>
                        <th className="px-3 py-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataKecamatan.map((k) => (
                        <tr key={k.no} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2">{k.no}</td>
                          <td className="px-3 py-2 font-medium">{k.nama}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(k.lakiLaki)}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(k.perempuan)}</td>
                          <td className="px-3 py-2 text-right font-bold">{formatNumber(k.total)}</td>
                          <td className="px-3 py-2 text-right">{k.persentase}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agama */}
          <TabsContent value="agama">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Agama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agamaChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ nama, persentase }) => `${nama}: ${persentase}%`}
                          outerRadius={100}
                          dataKey="total"
                        >
                          {agamaChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatNumber(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    {dataAgama.map((a) => (
                      <div key={a.no} className="flex items-center justify-between p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[a.no - 1] }} />
                          <span className="font-medium">{a.nama}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{formatNumber(a.total)}</span>
                          <span className="text-sm text-gray-500 ml-2">({a.persentase}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pendidikan */}
          <TabsContent value="pendidikan">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Tingkat Pendidikan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pendidikanChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tingkat" fontSize={10} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="total" fill="#166534" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-700 text-white">
                        <th className="px-3 py-2 text-left">Tingkat Pendidikan</th>
                        <th className="px-3 py-2 text-right">Laki-laki</th>
                        <th className="px-3 py-2 text-right">Perempuan</th>
                        <th className="px-3 py-2 text-right">Total</th>
                        <th className="px-3 py-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPendidikan.map((p) => (
                        <tr key={p.no} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{p.tingkat}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(p.lakiLaki)}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(p.perempuan)}</td>
                          <td className="px-3 py-2 text-right font-bold">{formatNumber(p.total)}</td>
                          <td className="px-3 py-2 text-right">{p.persentase}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pekerjaan */}
          <TabsContent value="pekerjaan">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Jenis Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pekerjaanChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jenis" fontSize={10} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="total" fill="#166534" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-700 text-white">
                        <th className="px-3 py-2 text-left">Jenis Pekerjaan</th>
                        <th className="px-3 py-2 text-right">Laki-laki</th>
                        <th className="px-3 py-2 text-right">Perempuan</th>
                        <th className="px-3 py-2 text-right">Total</th>
                        <th className="px-3 py-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPekerjaan.map((p) => (
                        <tr key={p.no} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{p.jenis}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(p.lakiLaki)}</td>
                          <td className="px-3 py-2 text-right">{formatNumber(p.perempuan)}</td>
                          <td className="px-3 py-2 text-right font-bold">{formatNumber(p.total)}</td>
                          <td className="px-3 py-2 text-right">{p.persentase}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data diperbaharui: {statistikUtama.tanggalUpdate}</p>
          <p>Sumber: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada</p>
        </div>
      </div>
    </div>
  );
}
