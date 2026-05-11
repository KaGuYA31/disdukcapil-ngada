import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { SearchCommand } from "@/components/shared/search-command";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { QuickLinksWidget } from "@/components/shared/quick-links-widget";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://disdukcapil-ngada.vercel.app";
const SITE_NAME = "Disdukcapil Kabupaten Ngada";
const SITE_DESCRIPTION =
  "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada - Portal layanan administrasi kependudukan online: KTP, KK, Akta Kelahiran, dan lainnya.";
const OG_IMAGE = `${SITE_URL}/logo-kabupaten.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Disdukcapil Kabupaten Ngada - Portal Layanan Kependudukan",
    template: "%s | Disdukcapil Ngada",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Disdukcapil Ngada",
    "Dinas Kependudukan Ngada",
    "KTP",
    "KTP-el",
    "Kartu Keluarga",
    "KK",
    "Akta Kelahiran",
    "Akta Kematian",
    "Akta Perkawinan",
    "Akta Perceraian",
    "KIA",
    "Kependudukan",
    "Pencatatan Sipil",
    "Kabupaten Ngada",
    "NTT",
    "Nusa Tenggara Timur",
    "Bajawa",
    "Layanan Publik",
    "Pemerintah",
    "Administrasi Kependudukan",
    "Layanan Online",
  ],
  authors: [{ name: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada" }],
  creator: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
  publisher: "Pemerintah Kabupaten Ngada",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo-kabupaten.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/logo-kabupaten.png",
        width: 512,
        height: 512,
        alt: "Logo Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo-kabupaten.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "government",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Disdukcapil Kabupaten Ngada",
              "alternateName": "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
              "url": "https://disdukcapil-ngada.vercel.app",
              "logo": "https://disdukcapil-ngada.vercel.app/logo-kabupaten.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Ahmad Yani No.1, Bajawa",
                "addressLocality": "Ngada",
                "addressRegion": "Nusa Tenggara Timur",
                "postalCode": "86411",
                "addressCountry": "ID"
              },
              "telephone": "(0382) 21073",
              "email": "disdukcapil@ngadakab.go.id",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                  "opens": "08:00",
                  "closes": "15:00"
                }
              ],
              "sameAs": [
                "https://facebook.com/disdukcapilngada",
                "https://instagram.com/disdukcapilngada",
                "https://youtube.com/@disdukcapilngada"
              ],
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Kabupaten Ngada"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Disdukcapil Ngada",
              "url": "https://disdukcapil-ngada.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://disdukcapil-ngada.vercel.app/berita?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        <CookieConsent />
        <ScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          Langsung ke konten utama
        </a>
        <Providers>
          {children}
          <SearchCommand />
          <QuickLinksWidget />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
