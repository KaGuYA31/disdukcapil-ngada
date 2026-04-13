import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementTicker } from "@/components/shared/announcement-ticker";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { QuickAccessPanel } from "@/components/shared/quick-access-panel";
import { SystemStatusWidget } from "@/components/shared/system-status-widget";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ServicesSection } from "@/components/sections/services-section";
import { NewsSection } from "@/components/sections/news-section";
import { FeaturedServicesSection } from "@/components/sections/featured-services-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";
import { FAQSection } from "@/components/sections/faq-section";
import { KeunggulanSection } from "@/components/sections/keunggulan-section";
import { TestimoniSection } from "@/components/sections/testimoni-section";
import { CTASection } from "@/components/sections/cta-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { GaleriInovasiSection } from "@/components/sections/galeri-inovasi-section";
import { QuickInfoBar } from "@/components/shared/quick-info-bar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnnouncementTicker />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <StatsSection />
        <SystemStatusWidget />
        <ServicesSection />
        <FeaturedServicesSection />
        <AnnouncementsSection />
        <FAQSection />
        <KeunggulanSection />
        <TestimoniSection />
        <WhyChooseUsSection />
        <GaleriInovasiSection />
        <NewsSection />
        <CTASection />
        <QuickInfoBar />
      </main>
      <Footer />
      <WhatsAppButton />
      <QuickAccessPanel />
      <BackToTop />
    </div>
  );
}
