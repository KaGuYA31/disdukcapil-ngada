"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export function LokasiSection() {
  return (
    <section id="lokasi" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span variants={fadeInUp} className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Lokasi
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Lokasi Kantor
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Kunjungi kantor kami untuk mendapatkan layanan langsung
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="lg:col-span-1 space-y-4"
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Alamat</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Jl. Ahmad Yani No.1
                        <br />
                        Bajawa, Kabupaten Ngada
                        <br />
                        Nusa Tenggara Timur 86413
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Telepon</h3>
                      <p className="text-gray-600 text-sm mt-1">(0382) 21073</p>
                      <a
                        href="tel:+6238221073"
                        className="text-green-600 text-sm hover:underline mt-1 inline-block"
                      >
                        Hubungi Sekarang
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Jam Pelayanan</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Senin - Kamis: 08.00 - 15.30 WITA
                        <br />
                        Jumat: 08.00 - 16.00 WITA
                        <br />
                        <span className="text-red-500">
                          Sabtu - Minggu: Tutup
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a
                        href="mailto:disdukcapil@ngadakab.go.id"
                        className="text-green-600 text-sm hover:underline"
                      >
                        disdukcapil@ngadakab.go.id
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a
                href="https://maps.google.com/?q=Bajawa,+Ngada,+NTT"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-green-700 hover:bg-green-800">
                  <MapPin className="mr-2 h-4 w-4" />
                  Buka di Google Maps
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <Card className="border-gray-200 overflow-hidden h-full">
              <div className="w-full h-full min-h-[400px] bg-gray-200 relative">
                {/* Placeholder for map - Replace with actual Google Maps embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3905.123456789!2d120.9!3d-8.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDgnMDAuMCJTIDEyMMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Disdukcapil Ngada"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
