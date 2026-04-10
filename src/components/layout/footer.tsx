"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  ClipboardList,
  BookOpen,
} from "lucide-react";

const quickLinks = [
  { title: "Beranda", href: "/" },
  { title: "Profil Dinas", href: "/profil" },
  { title: "Layanan Publik", href: "/layanan" },
  { title: "Berita & Informasi", href: "/berita" },
  { title: "Inovasi", href: "/inovasi" },
  { title: "Pengaduan", href: "/pengaduan" },
];

const pendaftaranPendudukLinks = [
  { title: "KTP-el", href: "/layanan/ktp-el" },
  { title: "Kartu Keluarga", href: "/layanan/kartu-keluarga" },
  { title: "Perubahan Data", href: "/layanan/perubahan-data" },
  { title: "Legalisasi", href: "/layanan/legalisasi" },
];

const pencatatanSipilLinks = [
  { title: "Akta Kelahiran", href: "/layanan/akta-kelahiran" },
  { title: "Akta Kematian", href: "/layanan/akta-kematian" },
  { title: "Akta Perkawinan", href: "/layanan/akta-perkawinan" },
  { title: "Akta Perceraian", href: "/layanan/akta-perceraian" },
  { title: "Pindah Penduduk", href: "/layanan/pindah-penduduk" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* About Section - spans 4 cols */}
          <div className="lg:col-span-4 space-y-4">
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
              Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
              berkomitmen memberikan layanan administrasi kependudukan yang
              profesional, transparan, dan mudah diakses oleh seluruh
              masyarakat.
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

          {/* Quick Links - spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white text-lg mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-2.5">
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

          {/* Pendaftaran Penduduk - spans 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-4.5 w-4.5 text-green-400" />
              <h4 className="font-semibold text-white text-lg">
                Pendaftaran Penduduk
              </h4>
            </div>
            <ul className="space-y-2.5">
              {pendaftaranPendudukLinks.map((link) => (
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

          {/* Pencatatan Sipil - spans 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4.5 w-4.5 text-green-400" />
              <h4 className="font-semibold text-white text-lg">
                Pencatatan Sipil
              </h4>
            </div>
            <ul className="space-y-2.5">
              {pencatatanSipilLinks.map((link) => (
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
        </div>

        {/* Contact Bar - full width, separated */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86413
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <a
                href="mailto:disdukcapil@ngadakab.go.id"
                className="text-sm hover:text-green-400 transition-colors"
              >
                disdukcapil@ngadakab.go.id
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                Senin - Jumat: 09.00 - 15.00 WITA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Dinas Kependudukan dan Pencatatan Sipil
              Kabupaten Ngada. Hak Cipta Dilindungi.
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
