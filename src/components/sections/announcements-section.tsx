"use client";

import { Bell, AlertTriangle, Info, Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const announcements = [
  {
    id: "1",
    title: "Jadwal Pelayanan Bulan Ini",
    content:
      "Pelayanan Disdukcapil Ngada beroperasi sesuai jadwal: Senin-Kamis 08.00-15.30 WITA, Jumat 08.00-16.00 WITA.",
    type: "Info",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Pembaharuan Sistem Database",
    content:
      "Akan dilakukan pemeliharaan sistem pada tanggal 20 Januari 2024 pukul 22.00-06.00 WITA. Mohon pengertiannya.",
    type: "Maintenance",
    date: "2024-01-12",
  },
  {
    id: "3",
    title: "Pendaftaran KTP-el Gratis",
    content:
      "Pendaftaran KTP-el untuk pertama kali GRATIS. Pastikan membawa berkas lengkap untuk mempercepat proses.",
    type: "Info",
    date: "2024-01-10",
  },
];

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return AlertTriangle;
    case "maintenance":
      return Wrench;
    default:
      return Info;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return {
        badge: "bg-red-100 text-red-700",
        icon: "text-red-600",
        border: "border-l-red-500",
      };
    case "maintenance":
      return {
        badge: "bg-yellow-100 text-yellow-700",
        icon: "text-yellow-600",
        border: "border-l-yellow-500",
      };
    default:
      return {
        badge: "bg-blue-100 text-blue-700",
        icon: "text-blue-600",
        border: "border-l-blue-500",
      };
  }
};

export function AnnouncementsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Pengumuman
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Informasi Penting
          </h2>
          <p className="text-gray-600 mt-4">
            Pengumuman dan informasi penting seputar layanan Disdukcapil
            Kabupaten Ngada.
          </p>
        </div>

        {/* Announcements List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {announcements.map((announcement) => {
            const colors = getTypeColor(announcement.type);
            const Icon = getTypeIcon(announcement.type);

            return (
              <Card
                key={announcement.id}
                className={`border-l-4 ${colors.border} hover:shadow-md transition-shadow`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${colors.icon}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {announcement.title}
                        </CardTitle>
                        <CardDescription>
                          {new Date(announcement.date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={colors.badge}>{announcement.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{announcement.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
