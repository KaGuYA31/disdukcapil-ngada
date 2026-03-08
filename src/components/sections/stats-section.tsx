"use client";

import { Users, FileCheck, Clock, ThumbsUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "165.842",
    label: "Total Penduduk",
    description: "Berdasarkan data terbaru 2024",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: FileCheck,
    value: "12",
    label: "Jenis Layanan",
    description: "Layanan administrasi kependudukan",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Clock,
    value: "3-5",
    label: "Hari Kerja",
    description: "Waktu rata-rata penyelesaian",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: ThumbsUp,
    value: "96%",
    label: "Tingkat Kepuasan",
    description: "Dari survei masyarakat",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export function StatsSection() {
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
      </div>
    </section>
  );
}
