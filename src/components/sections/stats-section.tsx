"use client";

import Link from "next/link";
import { Users, FileCheck, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { statistikUtama } from "@/data/statistik";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: formatNumber(statistikUtama.totalPenduduk),
      label: "Total Penduduk",
      description: `Periode ${statistikUtama.periode}`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: FileCheck,
      value: "10",
      label: "Jenis Layanan",
      description: "GRATIS - Tanpa Biaya",
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
      value: `${statistikUtama.cakupanAktaKelahiran}%`,
      label: "Cakupan Akta",
      description: "Akta Kelahiran",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
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
