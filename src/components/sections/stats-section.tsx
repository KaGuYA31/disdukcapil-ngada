"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, FileCheck, Clock, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

interface RingkasanData {
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  rasioJK: number;
  periode: string;
}

interface DokumenData {
  ektpCetak: number;
  ektpBelum: number;
  aktaLahir: number;
  aktaBelum: number;
  kiaMiliki: number;
  kiaBelum: number;
  cakupanAkta: number;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export function StatsSection() {
  const [loading, setLoading] = useState(true);
  const [ringkasan, setRingkasan] = useState<RingkasanData | null>(null);
  const [dokumen, setDokumen] = useState<DokumenData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beranda");
        const result = await response.json();
        if (result.success) {
          setRingkasan(result.data.ringkasan);
          setDokumen(result.data.dokumen);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPenduduk = ringkasan?.totalPenduduk || 0;
  const cakupanAkta = dokumen?.cakupanAkta || 0;
  const periode = ringkasan?.periode || "-";

  const stats = [
    {
      icon: Users,
      value: formatNumber(totalPenduduk),
      label: "Total Penduduk",
      description: `Periode ${periode}`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: FileCheck,
      value: "10",
      label: "Jenis Layanan",
      description: "Administrasi Kependudukan",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      value: "1",
      label: "Hari Kerja",
      description: "Layanan Same Day",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      icon: TrendingUp,
      value: `${cakupanAkta.toFixed(1)}%`,
      label: "Cakupan Akta",
      description: "Akta Kelahiran",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="font-semibold text-gray-700 mt-1">{stat.label}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Link to statistics page */}
        <div className="mt-8 text-center">
          <Link
            href="/statistik"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
          >
            Lihat Statistik Lengkap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
