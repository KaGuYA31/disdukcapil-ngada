"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Berita",
    value: "24",
    icon: FileText,
    change: "+3 bulan ini",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Layanan",
    value: "8",
    icon: Users,
    change: "Aktif",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Pengaduan Baru",
    value: "12",
    icon: MessageSquare,
    change: "Menunggu",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Pengunjung",
    value: "1,234",
    icon: TrendingUp,
    change: "+15% dari kemarin",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

const recentNews = [
  {
    id: "1",
    title: "Pelayanan Online Disdukcapil Ngada Kini Lebih Mudah",
    status: "Published",
    date: "2024-01-15",
    views: 245,
  },
  {
    id: "2",
    title: "Jadwal Pelayanan Bulan Januari 2024",
    status: "Published",
    date: "2024-01-10",
    views: 189,
  },
  {
    id: "3",
    title: "Sosialisasi Pentingnya Mempunyai Dokumen Kependudukan",
    status: "Draft",
    date: "2024-01-08",
    views: 0,
  },
];

const recentComplaints = [
  {
    id: "1",
    name: "John Doe",
    subject: "Keluhan Pelayanan",
    status: "Baru",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    subject: "Pertanyaan Umum",
    status: "Diproses",
    date: "2024-01-14",
  },
  {
    id: "3",
    name: "Ahmad Yusuf",
    subject: "Informasi Layanan",
    status: "Selesai",
    date: "2024-01-13",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "published":
    case "selesai":
      return "bg-green-100 text-green-700";
    case "draft":
    case "baru":
      return "bg-yellow-100 text-yellow-700";
    case "diproses":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const authState = useMemo(() => {
    if (typeof document === 'undefined') return { isAuthenticated: false, isLoading: true };
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

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-green-600">Loading...</div>
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
          <p className="text-gray-500">Selamat datang di Panel Admin Disdukcapil Ngada</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent News */}
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Berita Terbaru</CardTitle>
              <Link href="/admin/berita">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(news.date)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {news.views}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(news.status)}>
                      {news.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pengaduan Terbaru</CardTitle>
              <Link href="/admin/pengaduan">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {complaint.name}
                      </p>
                      <p className="text-xs text-gray-500">{complaint.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(complaint.date)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/berita?new=true">
                <Button className="w-full bg-green-700 hover:bg-green-800">
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
              <Link href="/layanan" target="_blank">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Website
                </Button>
              </Link>
              <Link href="/admin/pengaturan">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Pengaturan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
