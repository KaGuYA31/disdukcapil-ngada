"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Users, Building2, Briefcase, Loader2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

interface StrukturItem {
  id: string;
  name: string;
  position: string;
  photo: string | null;
  description: string | null;
  order: number;
}

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
  const [struktur, setStruktur] = useState<StrukturItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStruktur = async () => {
      try {
        const response = await fetch("/api/struktur");
        const data = await response.json();
        if (data.success) {
          setStruktur(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching struktur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStruktur();
  }, []);

  // Group by position level
  const kepalaDinas = struktur.find((s) => s.position === "Kepala Dinas");
  const sekretaris = struktur.find((s) => s.position === "Sekretaris");
  const kepalaBidang = struktur.filter(
    (s) => s.position.includes("Kepala Bidang") || s.position.includes("Kepala Sub Bagian")
  );

  return (
    <section id="struktur" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span variants={fadeInUp} className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Struktur Organisasi
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Jajaran Pimpinan
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Struktur organisasi Dinas Kependudukan dan Pencatatan Sipil
            Kabupaten Ngada
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {/* Organizational Chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto mb-16"
            >
              {/* Kepala Dinas */}
              <motion.div variants={fadeInUp} className="flex justify-center mb-8">
                <Card className="bg-green-700 text-white border-0 shadow-lg w-72">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {kepalaDinas?.photo ? (
                        <Image
                          src={kepalaDinas.photo}
                          alt={kepalaDinas.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-white" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg">
                      {kepalaDinas?.name || "Drs. Nama Kepala Dinas, M.Si"}
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                      {kepalaDinas?.position || "Kepala Dinas"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Connector Line */}
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-12 bg-green-300"></div>
              </div>

              {/* Sekretaris */}
              <motion.div variants={fadeInUp} className="flex justify-center mb-8">
                <Card className="bg-green-600 text-white border-0 shadow-lg w-72">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                      {sekretaris?.photo ? (
                        <Image
                          src={sekretaris.photo}
                          alt={sekretaris.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className="font-bold">
                      {sekretaris?.name || "Ir. Nama Sekretaris, MM"}
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                      {sekretaris?.position || "Sekretaris"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Connector Lines */}
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-12 bg-green-300"></div>
              </div>

              {/* Kepala Bidang */}
              <div className="grid md:grid-cols-3 gap-4">
                {kepalaBidang.length > 0 ? (
                  kepalaBidang.map((person) => (
                    <motion.div key={person.id} variants={fadeInUp}>
                      <Card className="bg-white border-green-200 shadow-sm">
                        <CardContent className="p-4 text-center">
                          <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                            {person.photo ? (
                              <Image
                                src={person.photo}
                                alt={person.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-7 w-7 text-green-600" />
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{person.name}</h3>
                          <p className="text-gray-500 text-xs mt-1">{person.position}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  // Default fallback when no data
                  <>
                    <motion.div variants={fadeInUp}>
                      <Card className="bg-white border-green-200 shadow-sm">
                        <CardContent className="p-4 text-center">
                          <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                            <User className="h-7 w-7 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Nama Kabid, S.Sos, M.Si</h3>
                          <p className="text-gray-500 text-xs mt-1">Kepala Bidang Pelayanan Penduduk</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <Card className="bg-white border-green-200 shadow-sm">
                        <CardContent className="p-4 text-center">
                          <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                            <User className="h-7 w-7 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Nama Kabid, S.AP, MM</h3>
                          <p className="text-gray-500 text-xs mt-1">Kepala Bidang Pencatatan Sipil</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <Card className="bg-white border-green-200 shadow-sm">
                        <CardContent className="p-4 text-center">
                          <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                            <User className="h-7 w-7 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Nama Kabid, S.Sos</h3>
                          <p className="text-gray-500 text-xs mt-1">Kepala Bidang Pengelolaan Informasi</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}

        {/* Bidang Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {bidang.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="border-gray-200 hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
