"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { HeroSection } from "@/components/sections/hero-section";
import { SearchCommand } from "@/components/shared/search-command";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { CookieConsent } from "@/components/shared/cookie-consent";

// ─── Essential Sections ─────────────────────────────────────────────
// These are the sections that citizens actually need

const ServicesSection = dynamic(
  () => import("@/components/sections/services-section").then((m) => ({ default: m.ServicesSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" /><div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);

const BeritaTerkiniWidget = dynamic(
  () => import("@/components/sections/berita-terkini-widget").then((m) => ({ default: m.BeritaTerkiniWidget })),
  { loading: () => <div className="py-12"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" /><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);

const FAQInteraktifSection = dynamic(
  () => import("@/components/sections/faq-interaktif-section").then((m) => ({ default: m.FAQInteraktifSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 mx-auto" /><div className="max-w-3xl mx-auto space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />)}</div></div></div> }
);

const PetaLokasiSection = dynamic(
  () => import("@/components/sections/peta-lokasi-section").then((m) => ({ default: m.PetaLokasiSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 mx-auto" /><div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);

// ─── Widgets (floating, non-blocking) ──────────────────────────────

const AccessibilitySettingsWidget = dynamic(
  () => import("@/components/shared/accessibility-settings-widget").then((m) => ({ default: m.AccessibilitySettingsWidget })),
  { ssr: false }
);

// ─── Homepage ───────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero: greeting, search, quick actions, stats */}
        <HeroSection />

        {/* Layanan Kependudukan — what citizens come for */}
        <section className="py-10 sm:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Layanan Kami
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                Pilih layanan administrasi kependudukan yang Anda butuhkan
              </p>
            </div>
            <ServicesSection />
          </div>
        </section>

        {/* Quick Service Cards — most used services */}
        <section className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Layanan Sering Digunakan
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Akses cepat ke layanan yang paling banyak diminta
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto">
              {[
                { name: "KTP-el", icon: "🪪", href: "/layanan/ktp-el", desc: "Kartu Tanda Penduduk Elektronik" },
                { name: "Kartu Keluarga", icon: "👨‍👩‍👧‍👦", href: "/layanan/kartu-keluarga", desc: "KK dan perubahan data" },
                { name: "Akta Kelahiran", icon: "👶", href: "/layanan/akta-kelahiran", desc: "Pencatatan kelahiran" },
                { name: "Cek Status", icon: "🔍", href: "/layanan-online/cek-status", desc: "Lacak pengajuan Anda" },
                { name: "Pindah Domisili", icon: "🏠", href: "/layanan/pindah-domisili", desc: "Perpindahan penduduk" },
                { name: "Pengaduan", icon: "💬", href: "/pengaduan", desc: "Sampaikan keluhan" },
                { name: "Persyaratan Layanan", icon: "📋", href: "/layanan", desc: "Cek syarat & formulir" },
                { name: "Antrian Online", icon: "🎫", href: "/layanan-online", desc: "Ambil nomor antrian" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex flex-col items-center p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center min-h-[110px] sm:min-h-[120px] justify-center"
                >
                  <span className="text-2xl sm:text-3xl mb-2 sm:mb-3">{item.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug">{item.name}</h3>
                  <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Berita Terkini */}
        <section className="py-10 sm:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Berita &amp; Pengumuman
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Informasi terbaru dari Disdukcapil Ngada
                </p>
              </div>
              <a
                href="/berita"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                Lihat Semua
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
            <BeritaTerkiniWidget />
            <div className="sm:hidden mt-6 text-center">
              <a
                href="/berita"
                className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400"
              >
                Lihat Semua Berita
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ — Pertanyaan Umum */}
        <section className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Pertanyaan Umum
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                Jawaban untuk pertanyaan yang sering diajukan
              </p>
            </div>
            <FAQInteraktifSection />
          </div>
        </section>

        {/* Peta Lokasi Kantor */}
        <section className="py-10 sm:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Lokasi Kantor
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Kunjungi kami untuk layanan tatap muka
              </p>
            </div>
            <PetaLokasiSection />
          </div>
        </section>

        {/* CTA — WhatsApp */}
        <section className="py-10 sm:py-16 bg-gradient-to-br from-green-600 to-green-800 dark:from-green-800 dark:to-green-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Butuh Bantuan?
            </h2>
            <p className="text-green-100 max-w-xl mx-auto mb-8">
              Hubungi kami melalui WhatsApp atau kunjungi langsung kantor Disdukcapil Kabupaten Ngada
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-400 transition-colors w-full sm:w-auto min-h-[48px]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Widgets */}
      <SearchCommand />
      <CookieConsent />
      <AccessibilitySettingsWidget />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
