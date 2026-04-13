"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  Share2,
  Images,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

interface InovasiDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  photo: string | null;
  photos: string | null;
  location: string | null;
  date: string | null;
  category: string;
  author: string | null;
  viewCount: number;
  createdAt: string;
}

export default function InovasiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<InovasiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const response = await fetch(`/api/inovasi?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Gagal memuat data kegiatan");
        }
        const data = await response.json();
        setActivity(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchActivity();
    }
  }, [params.id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity?.title || "Kegiatan Inovasi",
          text: activity?.description || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Kegiatan Tidak Ditemukan
            </h2>
            <p className="text-gray-500 mb-4">
              {error || "Kegiatan yang Anda cari tidak tersedia."}
            </p>
            <Button
              onClick={() => router.push("/inovasi")}
              className="bg-green-700 hover:bg-green-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Kegiatan
            </Button>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero with Photo */}
        <section className="relative">
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-green-700 to-green-800">
            {activity.photo ? (
              <div className="absolute inset-0">
                <Image
                  src={activity.photo}
                  alt={activity.title}
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
              </div>
            ) : null}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-8">
                <Link
                  href="/inovasi"
                  className="inline-flex items-center text-green-200 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Daftar Kegiatan
                </Link>
                <h1 className="text-2xl md:text-4xl font-bold text-white max-w-4xl">
                  {activity.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-green-100">
                  {activity.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                  {activity.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Meta Info Card */}
              <Card className="mb-8 border-green-200">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Lightbulb className="w-5 h-5 text-green-600" />
                        <span className="font-medium">{activity.category}</span>
                      </div>
                      {activity.author && (
                        <div className="text-gray-500">
                          Oleh: {activity.author}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Main Content */}
              <div className="prose prose-green max-w-none">
                {activity.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: activity.content }}
                    className="text-gray-700 leading-relaxed"
                  />
                ) : (
                  <p className="text-gray-500">
                    Detail kegiatan tidak tersedia.
                  </p>
                )}
              </div>

              {/* Photo (if available and not shown in hero) */}
              {activity.photo && (
                <div className="mt-8">
                  <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                    <Image
                      src={activity.photo}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {(() => {
                let additionalPhotos: string[] = [];
                try {
                  additionalPhotos = activity.photos ? JSON.parse(activity.photos) : [];
                } catch {
                  additionalPhotos = [];
                }
                if (additionalPhotos.length === 0) return null;
                return (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Images className="h-5 w-5 text-green-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Foto Galeri</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {additionalPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                        >
                          <Image
                            src={photo}
                            alt={`${activity.title} - Foto ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
