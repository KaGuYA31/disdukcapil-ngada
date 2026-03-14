"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
  Home,
} from "lucide-react";

interface InovasiActivity {
  id: string;
  title: string;
  description: string;
  photo?: string | null;
  location?: string | null;
  date?: string | null;
}

export default function InovasiPage() {
  const [activities, setActivities] = useState<InovasiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const response = await fetch("/api/inovasi");
        if (!response.ok) {
          throw new Error("Gagal memuat data kegiatan");
        }
        const data = await response.json();
        setActivities(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-green-200" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Kegiatan Inovasi Jemput Bola
              </h1>
            </div>
            <p className="text-green-100 text-base sm:text-lg lg:text-xl max-w-3xl mt-4">
              Daftar kegiatan inovasi pelayanan Jemput Bola dari Disdukcapil Kabupaten Ngada.
              Kami mendatangi masyarakat untuk memberikan pelayanan administrasi kependudukan
              yang lebih dekat dan mudah dijangkau.
            </p>
            <Link href="/" className="mt-6">
              <Button
                className="bg-white text-green-700 hover:bg-green-100 gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48 rounded-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-green-700 hover:bg-green-800"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && activities.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
              <Lightbulb className="w-16 h-16 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Belum Ada Kegiatan
              </h3>
              <p className="text-green-600">
                Saat ini belum ada kegiatan inovasi yang tersedia.
                Silakan kembali lagi nanti.
              </p>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        {!loading && !error && activities.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Daftar Kegiatan
              </h2>
              <p className="text-gray-600 mt-1">
                Menampilkan {activities.length} kegiatan inovasi
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card
                  key={activity.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Activity Photo */}
                  <div className="relative w-full h-48 bg-gray-100">
                    {activity.photo ? (
                      <Image
                        src={activity.photo}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                        <Lightbulb className="w-16 h-16 text-green-400" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-green-800 line-clamp-2">
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {truncateText(activity.description, 120)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    {/* Location */}
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{activity.location}</span>
                    </div>
                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full bg-green-700 hover:bg-green-800 text-white gap-2"
                      asChild
                    >
                      <Link href={`/inovasi/${activity.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-100">
            &copy; {new Date().getFullYear()} Disdukcapil Kabupaten Ngada.
            Inovasi Jemput Bola untuk Pelayanan Prima.
          </p>
        </div>
      </footer>
    </div>
  );
}
