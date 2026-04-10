"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO, LOCATION, OPERATING_HOURS } from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const mapFadeInUp = {
  hidden: { opacity: 0, y: 20 },
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

        {/* Google Maps Embed */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={mapFadeInUp}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d121.0731!3d-8.8489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTAnNTYuMCJTIDEyMcKwMDQnMjEuMiJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Disdukcapil Ngada"
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Address Overlay Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={mapFadeInUp}
          className="max-w-6xl mx-auto w-full -mt-6 relative z-10 px-4"
        >
          <Card className="border-gray-200 shadow-lg max-w-md mx-auto">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-sm font-medium truncate">
                  {CONTACT_INFO.address}
                </p>
                <a
                  href={LOCATION.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-xs hover:underline inline-flex items-center gap-1"
                >
                  Buka di Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                        {LOCATION.address}
                        <br />
                        {LOCATION.regency}
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
                      <p className="text-gray-600 text-sm mt-1">{CONTACT_INFO.phone}</p>
                      <a
                        href={`tel:+${CONTACT_INFO.phoneRaw}`}
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
                        {OPERATING_HOURS.weekdays.days}: {OPERATING_HOURS.weekdays.hours}
                        <br />
                        {OPERATING_HOURS.friday.days}: {OPERATING_HOURS.friday.hours}
                        <br />
                        <span className="text-red-500">
                          {OPERATING_HOURS.saturday.days} - {OPERATING_HOURS.sunday.days}: {OPERATING_HOURS.saturday.hours}
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
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-green-600 text-sm hover:underline"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a
                href={LOCATION.googleMapsUrl}
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
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d${LOCATION.coordinates.longitude}!3d${LOCATION.coordinates.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTAnNTYuMCJTIDEyMcKwMDQnMjEuMiJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid`}
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
