import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { QuickAccessPanel } from "@/components/shared/quick-access-panel";
import { SystemStatusWidget } from "@/components/shared/system-status-widget";
import { EmergencyInfoBar } from "@/components/shared/emergency-info-bar";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ServicesSection } from "@/components/sections/services-section";
import { NewsSection } from "@/components/sections/news-section";
import { FeaturedServicesSection } from "@/components/sections/featured-services-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";
import { FAQSection } from "@/components/sections/faq-section";
import { JadwalPelayananSection } from "@/components/sections/jadwal-pelayanan-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { KeunggulanSection } from "@/components/sections/keunggulan-section";
import { TestimoniSection } from "@/components/sections/testimoni-section";
import { CTASection } from "@/components/sections/cta-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { GaleriInovasiSection } from "@/components/sections/galeri-inovasi-section";
import { QuickInfoBar } from "@/components/shared/quick-info-bar";
import { LiveVisitorCounter } from "@/components/shared/live-visitor-counter";
import { AboutUsSection } from "@/components/sections/about-us-section";
import { AddTestimoniWidget } from "@/components/shared/add-testimoni-widget";
import { SimulasiBiayaSection } from "@/components/sections/simulasi-biaya-section";
import { BeritaTerkiniWidget } from "@/components/sections/berita-terkini-widget";
import { FAQInteraktifSection } from "@/components/sections/faq-interaktif-section";
import { PetaLokasiSection } from "@/components/sections/peta-lokasi-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EmergencyInfoBar />
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <LiveVisitorCounter />
        <StatsSection />
        <SystemStatusWidget />
        <ServicesSection />
        <FeaturedServicesSection />
        <SimulasiBiayaSection />
        <BeritaTerkiniWidget />
        <AnnouncementsSection />
        <NewsletterSection />
        <FAQInteraktifSection />
        <JadwalPelayananSection />
        <PetaLokasiSection />
        <KeunggulanSection />
        <TestimoniSection />
        <WhyChooseUsSection />
        <GaleriInovasiSection />
        <NewsSection />
        <CTASection />
        <QuickInfoBar />
        <AboutUsSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <AddTestimoniWidget />
      <QuickAccessPanel />
      <BackToTop />
    </div>
  );
}
