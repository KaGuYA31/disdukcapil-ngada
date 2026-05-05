"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { QuickAccessPanel } from "@/components/shared/quick-access-panel";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { EmergencyInfoBar } from "@/components/shared/emergency-info-bar";
import { SearchCommand } from "@/components/shared/search-command";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { AnnouncementTicker } from "@/components/shared/announcement-ticker";

// Lazy-loaded sections (below the fold) with skeleton loading
const SystemStatusWidget = dynamic(
  () => import("@/components/shared/system-status-widget").then((m) => ({ default: m.SystemStatusWidget })),
  { loading: () => <div className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800" /> }
);
const ServicesSection = dynamic(
  () => import("@/components/sections/services-section").then((m) => ({ default: m.ServicesSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" /><div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const FeaturedServicesSection = dynamic(
  () => import("@/components/sections/featured-services-section").then((m) => ({ default: m.FeaturedServicesSection })),
  { loading: () => <div className="py-8"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" /><div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const SimulasiBiayaSection = dynamic(
  () => import("@/components/sections/simulasi-biaya-section").then((m) => ({ default: m.SimulasiBiayaSection })),
  { ssr: false, loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-2xl mx-auto h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const BeritaTerkiniWidget = dynamic(
  () => import("@/components/sections/berita-terkini-widget").then((m) => ({ default: m.BeritaTerkiniWidget })),
  { loading: () => <div className="py-8"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" /><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const AnnouncementsSection = dynamic(
  () => import("@/components/sections/announcements-section").then((m) => ({ default: m.AnnouncementsSection })),
  { loading: () => <div className="py-12"><div className="container mx-auto px-4"><div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const NewsletterSection = dynamic(
  () => import("@/components/sections/newsletter-section").then((m) => ({ default: m.NewsletterSection })),
  { loading: () => <div className="py-12"><div className="container mx-auto px-4"><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const FAQInteraktifSection = dynamic(
  () => import("@/components/sections/faq-interaktif-section").then((m) => ({ default: m.FAQInteraktifSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-3xl mx-auto space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />)}</div></div></div> }
);
const JadwalPelayananSection = dynamic(
  () => import("@/components/sections/jadwal-pelayanan-section").then((m) => ({ default: m.JadwalPelayananSection })),
  { ssr: false, loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-4xl mx-auto h-72 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const PetaLokasiSection = dynamic(
  () => import("@/components/sections/peta-lokasi-section").then((m) => ({ default: m.PetaLokasiSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const KeunggulanSection = dynamic(
  () => import("@/components/sections/keunggulan-section").then((m) => ({ default: m.KeunggulanSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const TestimoniSection = dynamic(
  () => import("@/components/sections/testimoni-section").then((m) => ({ default: m.TestimoniSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const WhyChooseUsSection = dynamic(
  () => import("@/components/sections/why-choose-us-section").then((m) => ({ default: m.WhyChooseUsSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="grid md:grid-cols-2 gap-6">{[1,2].map(i=><div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const GaleriInovasiSection = dynamic(
  () => import("@/components/sections/galeri-inovasi-section").then((m) => ({ default: m.GaleriInovasiSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const NewsSection = dynamic(
  () => import("@/components/sections/news-section").then((m) => ({ default: m.NewsSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const CTASection = dynamic(
  () => import("@/components/sections/cta-section").then((m) => ({ default: m.CTASection })),
  { loading: () => <div className="py-16"><div className="h-64 bg-gradient-to-r from-green-700 to-green-900 rounded-xl animate-pulse" /></div> }
);
const QuickInfoBar = dynamic(
  () => import("@/components/shared/quick-info-bar").then((m) => ({ default: m.QuickInfoBar })),
  { loading: () => <div className="py-8"><div className="container mx-auto px-4"><div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const AboutUsSection = dynamic(
  () => import("@/components/sections/about-us-section").then((m) => ({ default: m.AboutUsSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="grid md:grid-cols-2 gap-6">{[1,2].map(i=><div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const LiveVisitorCounter = dynamic(
  () => import("@/components/shared/live-visitor-counter").then((m) => ({ default: m.LiveVisitorCounter })),
  { ssr: false }
);
const AddTestimoniWidget = dynamic(
  () => import("@/components/shared/add-testimoni-widget").then((m) => ({ default: m.AddTestimoniWidget })),
  { ssr: false }
);
const AntrianOnlineSection = dynamic(
  () => import("@/components/sections/antrian-online-section").then((m) => ({ default: m.AntrianOnlineSection })),
  { ssr: false, loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-5xl mx-auto space-y-6"><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /><div className="grid md:grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div></div> }
);
const UlasanRatingSection = dynamic(
  () => import("@/components/sections/ulasan-rating-section").then((m) => ({ default: m.UlasanRatingSection })),
  { ssr: false, loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6"><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div></div> }
);
const PanduanLayananSection = dynamic(
  () => import("@/components/sections/panduan-layanan-section").then((m) => ({ default: m.PanduanLayananSection })),
  { ssr: false, loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="max-w-4xl mx-auto space-y-6">{[1,2,3,4,5].map(i=><div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const SectionDivider = dynamic(
  () => import("@/components/shared/section-divider").then((m) => ({ default: m.SectionDivider })),
  { ssr: false }
);

// Task 5-a: New components
const NotifikasiBanner = dynamic(
  () => import("@/components/shared/notifikasi-banner").then((m) => ({ default: m.NotifikasiBanner })),
  { ssr: false }
);
const SosialMediaSection = dynamic(
  () => import("@/components/sections/sosial-media-section").then((m) => ({ default: m.SosialMediaSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="grid lg:grid-cols-3 gap-6"><div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /><div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /><div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div></div> }
);
const PromosiLayananSection = dynamic(
  () => import("@/components/sections/promosi-layanan-section").then((m) => ({ default: m.PromosiLayananSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div></div></div> }
);
const KoneksiLangsungWidget = dynamic(
  () => import("@/components/shared/koneksi-langsung-widget").then((m) => ({ default: m.KoneksiLangsungWidget })),
  { ssr: false }
);

// Task 4-a: Previous components
const LoadingScreen = dynamic(
  () => import("@/components/shared/loading-screen").then((m) => ({ default: m.LoadingScreen })),
  { ssr: false }
);
const FloatingActionMenu = dynamic(
  () => import("@/components/shared/floating-action-menu").then((m) => ({ default: m.FloatingActionMenu })),
  { ssr: false }
);
const StatistikInteraktifSection = dynamic(
  () => import("@/components/sections/statistik-interaktif-section").then((m) => ({ default: m.StatistikInteraktifSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);
const TestimoniMarqueeSection = dynamic(
  () => import("@/components/sections/testimoni-marquee-section").then((m) => ({ default: m.TestimoniMarqueeSection })),
  { loading: () => <div className="py-16"><div className="container mx-auto px-4"><div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto" /><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" /></div></div> }
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingScreen />
      <ScrollProgress />
      <EmergencyInfoBar />
      <Header />
      <AnnouncementTicker />
      <NotifikasiBanner />
      <main id="main-content" className="flex-1">
        {/* Critical: loaded eagerly (above the fold) */}
        <HeroSection />
        <SectionDivider variant="wave-1" color="green" />
        <LiveVisitorCounter />
        <StatsSection />
        <StatistikInteraktifSection />
        <SectionDivider variant="dotted" color="green" />

        {/* Below the fold: lazy-loaded with skeleton fallbacks */}
        <SystemStatusWidget />
        <ServicesSection />
        <FeaturedServicesSection />
        <SimulasiBiayaSection />
        <BeritaTerkiniWidget />
        <AnnouncementsSection />
        <NewsletterSection />
        <FAQInteraktifSection />
        <SectionDivider variant="gradient" color="green" />
        <JadwalPelayananSection />
        <PetaLokasiSection />
        <SosialMediaSection />
        <PromosiLayananSection />
        <KeunggulanSection />
        <TestimoniSection />
        <TestimoniMarqueeSection />
        <WhyChooseUsSection />
        <GaleriInovasiSection />
        <NewsSection />
        <QuickInfoBar />
        <AboutUsSection />
        <AntrianOnlineSection />
        <UlasanRatingSection />
        <SectionDivider variant="wave-2" color="teal" />
        <PanduanLayananSection />
        <SectionDivider variant="curved" color="green" />
        <CTASection />
      </main>
      <KoneksiLangsungWidget />
      <WhatsAppButton />
      <FloatingActionMenu />
      <CookieConsent />
      <SearchCommand />
      <AddTestimoniWidget />
      <QuickAccessPanel />
      <BackToTop />
    </div>
  );
}
