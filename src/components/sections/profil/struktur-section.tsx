"use client";

import { User, Users, Building2, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const struktur = [
  {
    id: "1",
    name: "Drs. Nama Kepala Dinas, M.Si",
    position: "Kepala Dinas",
    level: 1,
  },
  {
    id: "2",
    name: "Ir. Nama Sekretaris, MM",
    position: "Sekretaris",
    level: 2,
  },
  {
    id: "3",
    name: "Nama Kabid, S.Sos, M.Si",
    position: "Kepala Bidang Pelayanan Penduduk",
    level: 3,
  },
  {
    id: "4",
    name: "Nama Kabid, S.AP, MM",
    position: "Kepala Bidang Pencatatan Sipil",
    level: 3,
  },
  {
    id: "5",
    name: "Nama Kabid, S.Sos",
    position: "Kepala Bidang Pengelolaan Informasi",
    level: 3,
  },
];

const bidang = [
  {
    title: "Bidang Pelayanan Penduduk",
    description: "Mengelola pelayanan KTP-el, KK, dan dokumen kependudukan lainnya",
    icon: User,
  },
  {
    title: "Bidang Pencatatan Sipil",
    description: "Mengelola pencatatan kelahiran, kematian, perkawinan, dan perceraian",
    icon: Users,
  },
  {
    title: "Bidang Pengelolaan Informasi",
    description: "Mengelola database dan sistem informasi kependudukan",
    icon: Building2,
  },
  {
    title: "Sub Bagian Umum",
    description: "Mengelola administrasi umum, kepegawaian, dan keuangan",
    icon: Briefcase,
  },
];

export function StrukturSection() {
  return (
    <section id="struktur" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Struktur Organisasi
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Jajaran Pimpinan
          </h2>
          <p className="text-gray-600 mt-4">
            Struktur organisasi Dinas Kependudukan dan Pencatatan Sipil
            Kabupaten Ngada
          </p>
        </div>

        {/* Organizational Chart */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Kepala Dinas */}
          <div className="flex justify-center mb-8">
            <Card className="bg-green-700 text-white border-0 shadow-lg w-72">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-lg">{struktur[0].name}</h3>
                <p className="text-green-100 text-sm mt-1">{struktur[0].position}</p>
              </CardContent>
            </Card>
          </div>

          {/* Connector Line */}
          <div className="flex justify-center mb-8">
            <div className="w-0.5 h-12 bg-green-300"></div>
          </div>

          {/* Sekretaris */}
          <div className="flex justify-center mb-8">
            <Card className="bg-green-600 text-white border-0 shadow-lg w-72">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold">{struktur[1].name}</h3>
                <p className="text-green-100 text-sm mt-1">{struktur[1].position}</p>
              </CardContent>
            </Card>
          </div>

          {/* Connector Lines */}
          <div className="flex justify-center mb-8">
            <div className="w-0.5 h-12 bg-green-300"></div>
          </div>

          {/* Kepala Bidang */}
          <div className="grid md:grid-cols-3 gap-4">
            {struktur.slice(2).map((person, index) => (
              <Card key={person.id} className="bg-white border-green-200 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm">{person.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">{person.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bidang Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {bidang.map((item, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
