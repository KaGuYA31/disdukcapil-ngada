import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { SearchCommand } from "@/components/shared/search-command";
import { PageTransitionIndicator } from "@/components/shared/page-transition-indicator";
import { AccessibilityEnhanced } from "@/components/shared/accessibility-enhanced";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
              "alternateName": "Disdukcapil Ngada",
              "url": "https://disdukcapil-ngada.vercel.app",
              "logo": "https://disdukcapil-ngada.vercel.app/logo-kabupaten.png",
              "description": "Website resmi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada, Nusa Tenggara Timur. Layanan administrasi kependudukan untuk masyarakat Kabupaten Ngada.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Raya Bajawa - Ende",
                "addressLocality": "Bajawa",
                "addressRegion": "Nusa Tenggara Timur",
                "postalCode": "86311",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-8.4833",
                "longitude": "121.0167"
              },
              "telephone": "+6238241222",
              "email": "disdukcapil@ngadakab.go.id",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "16:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/disdukcapilngada",
                "https://www.instagram.com/disdukcapilngada",
                "https://www.youtube.com/@disdukcapilngada",
                "https://twitter.com/disdukcapilngada"
              ],
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Kabupaten Ngada",
                "containedInPlace": {
                  "@type": "AdministrativeArea",
                  "name": "Provinsi Nusa Tenggara Timur"
                }
              },
              "parentOrganization": {
                "@type": "GovernmentOrganization",
                "name": "Pemerintah Kabupaten Ngada",
                "url": "https://ngadakab.go.id"
              }
            })
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          Langsung ke konten utama
        </a>
        <Providers>
          <PageTransitionIndicator />
          {children}
          <SearchCommand />
          <AccessibilityEnhanced />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
