"use client";

import Link from "next/link";
import { Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-700 to-green-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              Butuh Bantuan atau Informasi Lebih Lanjut?
            </h2>
            <p className="text-green-100 text-lg mt-4 max-w-xl mx-auto lg:mx-0">
              Tim kami siap membantu Anda dengan berbagai pertanyaan seputar
              layanan administrasi kependudukan. Jangan ragu untuk menghubungi
              kami.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
              <Link href="/pengaduan">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                >
                  Ajukan Pengaduan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/profil#lokasi">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 font-semibold"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Lokasi Kantor
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Contact Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            <h3 className="font-semibold text-xl mb-6">Informasi Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Alamat</p>
                  <p className="text-green-100 text-sm mt-1">
                    Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86413
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Telepon</p>
                  <p className="text-green-100 text-sm mt-1">(0382) 21073</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Jam Pelayanan</p>
                  <p className="text-green-100 text-sm mt-1">
                    Senin - Kamis: 08.00 - 15.30 WITA
                    <br />
                    Jumat: 08.00 - 16.00 WITA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
