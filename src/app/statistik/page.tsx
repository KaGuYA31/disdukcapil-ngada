"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Loader2,
  Baby,
  IdCard,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Breadcrumb } from "@/components/shared/breadcrumb";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

function StatistikLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="h-4 w-32 bg-white/20 rounded mb-6 animate-pulse" />
              <div className="h-10 w-80 bg-white/20 rounded mb-4 animate-pulse" />
              <div className="h-5 w-96 bg-white/15 rounded mb-2 animate-pulse" />
              <div className="h-5 w-72 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 space-y-8">
          {/* Total Penduduk Skeleton */}
          <div className="h-52 bg-white rounded-xl shadow animate-pulse" />
          {/* Distribusi JK Skeleton */}
          <div className="h-64 bg-white rounded-xl shadow animate-pulse" />
          {/* 3-column cards skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-xl shadow animate-pulse" />
            <div className="h-64 bg-white rounded-xl shadow animate-pulse" />
            <div className="h-64 bg-white rounded-xl shadow animate-pulse" />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
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
    return <StatistikLoadingSkeleton />;
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Info Kependudukan", href: "/statistik" }, { label: "Statistik Kependudukan" }]} />
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3"
                >
                  <BarChart3 className="h-9 w-9 md:h-10 md:w-10 text-green-200" />
                  Statistik Kependudukan
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg">
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200 mt-2">
                  Data kependudukan dan kepemilikan dokumen — Periode{" "}
                  <span className="font-semibold text-white">{ringkasan.periode}</span>
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Total Penduduk */}
            <motion.div variants={fadeInUp}>
              <Card className="border-l-4 border-l-green-600 bg-gradient-to-r from-green-50 to-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-700" />
                    </div>
                    Jumlah Penduduk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                      {formatNumber(ringkasan.totalPenduduk)}
                    </p>
                    <p className="text-gray-500 mt-2 text-lg">Jiwa</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Distribusi Jenis Kelamin */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
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
                    <motion.div
                      variants={scaleIn}
                      className="text-center p-6 bg-green-50 rounded-xl shadow-sm"
                    >
                      <div className="text-4xl font-bold text-green-700">
                        {formatNumber(ringkasan.lakiLaki)}
                      </div>
                      <p className="text-gray-600 font-medium mt-2">Laki-laki</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {ringkasan.totalPenduduk > 0
                          ? ((ringkasan.lakiLaki / ringkasan.totalPenduduk) * 100).toFixed(2)
                          : 0}
                        %
                      </p>
                    </motion.div>
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
                    <motion.div
                      variants={scaleIn}
                      className="text-center p-6 bg-pink-50 rounded-xl shadow-sm"
                    >
                      <div className="text-4xl font-bold text-pink-600">
                        {formatNumber(ringkasan.perempuan)}
                      </div>
                      <p className="text-gray-600 font-medium mt-2">Perempuan</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {ringkasan.totalPenduduk > 0
                          ? ((ringkasan.perempuan / ringkasan.totalPenduduk) * 100).toFixed(2)
                          : 0}
                        %
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Kepemilikan Dokumen */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
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
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all rounded-xl h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                              <IdCard className="h-5 w-5 text-green-600" />
                            </div>
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
                              <div className="mt-2 h-2.5 bg-gray-200 rounded-full overflow-hidden">
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
                    </motion.div>

                    {/* Akta Kelahiran */}
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all rounded-xl h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-1.5 bg-amber-100 rounded-lg">
                              <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            Akta Kelahiran
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Memiliki</span>
                              <span className="font-bold text-amber-700 text-xl">
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
                                <span className="font-bold text-amber-700">
                                  {totalAkta > 0
                                    ? ((totalDokumen.aktaLahir / totalAkta) * 100).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
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
                    </motion.div>

                    {/* KIA */}
                    <motion.div variants={scaleIn}>
                      <Card className="border-2 border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all rounded-xl h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-1.5 bg-rose-100 rounded-lg">
                              <Baby className="h-5 w-5 text-rose-600" />
                            </div>
                            KIA
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Memiliki</span>
                              <span className="font-bold text-rose-700 text-xl">
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
                                <span className="font-bold text-rose-700">
                                  {totalKIA > 0
                                    ? ((totalDokumen.kiaMiliki / totalKIA) * 100).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
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
                    </motion.div>
                  </div>

                  {/* Detail per Kecamatan */}
                  {data.dokumen.length > 0 && (
                    <motion.div
                      variants={fadeInUp}
                      className="mt-10"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-700" />
                        Detail Per Kecamatan
                      </h3>
                      <div className="overflow-x-auto rounded-xl shadow-sm border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-700 text-white">
                              <th className="px-4 py-3 text-left rounded-tl-xl">Kecamatan</th>
                              <th className="px-4 py-3 text-right">E-KTP Cetak</th>
                              <th className="px-4 py-3 text-right">Akta Lahir</th>
                              <th className="px-4 py-3 text-right rounded-tr-xl">KIA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.dokumen.map((d, index) => (
                              <tr
                                key={d.id}
                                className="border-b last:border-b-0 hover:bg-green-50/50 transition-colors"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <td className="px-4 py-3 font-medium text-gray-800">{d.kecamatan}</td>
                                <td className="px-4 py-3 text-right text-gray-600">{formatNumber(d.ektpCetak)}</td>
                                <td className="px-4 py-3 text-right text-gray-600">{formatNumber(d.aktaLahir)}</td>
                                <td className="px-4 py-3 text-right text-gray-600">{formatNumber(d.kiaMiliki)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center text-sm text-gray-500 space-y-1"
          >
            <p>Data diperbaharui: {ringkasan.periode}</p>
            <p>Sumber: Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada</p>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
