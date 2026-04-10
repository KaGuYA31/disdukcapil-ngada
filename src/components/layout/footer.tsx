"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Clock,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  ExternalLink,
  ClipboardList,
  BookOpen,
  Star,
  ArrowUp,
  ChevronRight,
} from "lucide-react";
import { CONTACT_INFO, OPERATING_HOURS, SOCIAL_MEDIA } from "@/lib/constants";

const quickLinks = [
  { title: "Beranda", href: "/" },
  { title: "Profil Dinas", href: "/profil" },
  { title: "Layanan Publik", href: "/layanan" },
  { title: "Statistik Kependudukan", href: "/statistik" },
  { title: "Berita & Informasi", href: "/berita" },
  { title: "Pengaduan", href: "/pengaduan" },
];

const layananUnggulanLinks = [
  { title: "Layanan Online", href: "/layanan-online" },
  { title: "Cek Status Pengajuan", href: "/layanan/cek-status" },
  { title: "Info KTP-el", href: "/layanan/ktp-el" },
  { title: "Pendaftaran Online", href: "/layanan-online" },
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
  { title: "Facebook", href: SOCIAL_MEDIA.facebook, icon: Facebook },
  { title: "Instagram", href: SOCIAL_MEDIA.instagram, icon: Instagram },
  { title: "X (Twitter)", href: SOCIAL_MEDIA.twitter, icon: Twitter },
  { title: "TikTok", href: SOCIAL_MEDIA.tiktok, icon: Music2 },
  { title: "YouTube", href: SOCIAL_MEDIA.youtube, icon: Youtube },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      {/* Gradient overlay from gray-900 to gray-950 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-12">
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
            {/* Social Media Links */}
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-200"
                  aria-label={social.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Layanan Unggulan - spans 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4.5 w-4.5 text-amber-400" />
              <h4 className="font-semibold text-white text-lg">
                Layanan Unggulan
              </h4>
            </div>
            <ul className="space-y-2.5">
              {layananUnggulanLinks.map((link) => (
                <li key={`unggulan-${link.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-amber-400 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
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
                    className="text-sm hover:text-green-400 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-green-400" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pendaftaran Penduduk - spans 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-4.5 w-4.5 text-teal-400" />
              <h4 className="font-semibold text-white text-base">
                Pendaftaran Penduduk
              </h4>
            </div>
            <ul className="space-y-2.5">
              {pendaftaranPendudukLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-green-400" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pencatatan Sipil - spans 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4.5 w-4.5 text-teal-400" />
              <h4 className="font-semibold text-white text-base">
                Pencatatan Sipil
              </h4>
            </div>
            <ul className="space-y-2.5">
              {pencatatanSipilLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-green-400" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Green-600 gradient separator line */}
        <div className="mt-10 h-[2px] bg-gradient-to-r from-transparent via-green-600 to-transparent opacity-60" />

        {/* Contact Bar - full width */}
        <div className="pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Phone */}
            <div className="flex items-start gap-3 group cursor-default">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200 flex-shrink-0">
                <Phone className="h-4 w-4 text-green-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Telepon</p>
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200 flex-shrink-0">
                <MessageCircle className="h-4 w-4 text-green-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">WhatsApp</p>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-400 transition-colors inline-flex items-center gap-1"
                  aria-label="Hubungi kami via WhatsApp"
                >
                  {CONTACT_INFO.whatsappDisplay}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 group cursor-default">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200 flex-shrink-0">
                <Mail className="h-4 w-4 text-green-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 group cursor-default sm:col-span-2 lg:col-span-2">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200 flex-shrink-0">
                <MapPin className="h-4 w-4 text-green-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Alamat</p>
                <span className="text-sm">
                  {CONTACT_INFO.address}
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="mt-5 flex items-center gap-3 group cursor-default">
            <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-200 flex-shrink-0">
              <Clock className="h-4 w-4 text-amber-400 group-hover:text-white transition-colors duration-200" />
            </div>
            <span className="text-sm">
              Jam Operasional: {OPERATING_HOURS.weekdays.days}, {OPERATING_HOURS.weekdays.hours} | {OPERATING_HOURS.friday.days}: {OPERATING_HOURS.friday.hours}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Scroll to Top + Copyright */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 hover:text-green-400 transition-colors group"
                aria-label="Kembali ke atas"
              >
                <span className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
                  <ArrowUp className="h-3.5 w-3.5" />
                </span>
                <span className="hidden sm:inline">Kembali ke Atas</span>
              </button>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <p className="text-gray-400 text-center">
                © {currentYear} Dinas Kependudukan dan Pencatatan Sipil
                Kabupaten Ngada
              </p>
            </div>

            {/* Government Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="https://ngadakab.go.id"
                className="hover:text-green-400 inline-flex items-center gap-1 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pemerintah Kabupaten Ngada
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="https://nttprov.go.id"
                className="hover:text-green-400 inline-flex items-center gap-1 transition-colors"
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
