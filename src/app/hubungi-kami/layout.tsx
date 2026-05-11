import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { QuickAccessPanel } from "@/components/shared/quick-access-panel";
import { SearchCommand } from "@/components/shared/search-command";
import { CookieConsent } from "@/components/shared/cookie-consent";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Hubungi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada melalui telepon, WhatsApp, email, atau kunjungi langsung kantor kami di Bajawa.",
  openGraph: {
    title: "Hubungi Kami | Disdukcapil Ngada",
    description:
      "Hubungi Disdukcapil Kabupaten Ngada melalui telepon, WhatsApp, email, atau kunjungi langsung kantor kami.",
  },
};

export default function HubungiKamiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Beranda",
                item: "https://disdukcapil-ngada.vercel.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Hubungi Kami",
              },
            ],
          }),
        }}
      />
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <QuickAccessPanel />
      <CookieConsent />
      <SearchCommand />
    </>
  );
}
