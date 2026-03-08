"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

const quickLinks = [
  { title: "Beranda", href: "/" },
  { title: "Profil Dinas", href: "/profil" },
  { title: "Layanan Publik", href: "/layanan" },
  { title: "Berita & Informasi", href: "/berita" },
  { title: "Transparansi", href: "/transparansi" },
  { title: "Pengaduan", href: "/pengaduan" },
];

const services = [
  { title: "KTP-el", href: "/layanan/ktp-el" },
  { title: "Kartu Keluarga", href: "/layanan/kartu-keluarga" },
  { title: "Akta Kelahiran", href: "/layanan/akta-kelahiran" },
  { title: "Akta Kematian", href: "/layanan/akta-kematian" },
  { title: "Perpindahan Penduduk", href: "/layanan/perpindahan" },
];

const socialLinks = [
  { title: "Facebook", href: "#", icon: Facebook },
  { title: "Instagram", href: "#", icon: Instagram },
  { title: "Youtube", href: "#", icon: Youtube },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0">
                <Image
                  src="/logo-kabupaten.png"
                  alt="Logo Kabupaten Ngada"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Disdukcapil</h3>
                <p className="text-sm text-gray-400">Kabupaten Ngada</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada berkomitmen
              memberikan layanan administrasi kependudukan yang profesional,
              transparan, dan mudah diakses oleh seluruh masyarakat.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                  aria-label={social.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">Layanan</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm hover:text-green-400 transition-colors inline-flex items-center gap-1"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">
              Kontak Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86413
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">(0382) 21073</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a
                  href="mailto:disdukcapil@ngadakab.go.id"
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  disdukcapil@ngadakab.go.id
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Senin - Kamis: 08.00 - 15.30 WITA
                  <br />
                  Jumat: 08.00 - 16.00 WITA
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Dinas Kependudukan dan Pencatatan Sipil Kabupaten
              Ngada. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="https://ngadakab.go.id"
                className="hover:text-green-400 inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pemerintah Kabupaten Ngada
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="https://nttprov.go.id"
                className="hover:text-green-400 inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pemerintah Provinsi NTT
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
