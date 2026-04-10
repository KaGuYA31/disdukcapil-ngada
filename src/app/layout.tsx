import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { SearchCommand } from "@/components/shared/search-command";
import { ScrollProgress } from "@/components/shared/scroll-progress";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://disdukcapil-ngada.vercel.app"),
  title: {
    default: "Disdukcapil Kabupaten Ngada - Portal Layanan Kependudukan",
    template: "%s | Disdukcapil Ngada",
  },
  description: "Portal resmi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada. Layanan informasi KTP, KK, Akta Kelahiran, Akta Kematian, dan layanan kependudukan lainnya.",
  keywords: [
    "Disdukcapil Ngada",
    "KTP",
    "Kartu Keluarga",
    "Akta Kelahiran",
    "Akta Kematian",
    "Kependudukan",
    "Pencatatan Sipil",
    "Kabupaten Ngada",
    "NTT",
    "Nusa Tenggara Timur",
    "Layanan Publik",
    "Pemerintah",
  ],
  authors: [{ name: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Disdukcapil Kabupaten Ngada",
    description: "Portal Layanan Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
    type: "website",
    locale: "id_ID",
    url: "https://disdukcapil-ngada.vercel.app",
    siteName: "Disdukcapil Kabupaten Ngada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disdukcapil Kabupaten Ngada",
    description: "Portal Layanan Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Disdukcapil Kabupaten Ngada",
              "alternateName": "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada",
              "url": "https://my-project-mu-ivory-36.vercel.app",
              "logo": "https://my-project-mu-ivory-36.vercel.app/images/logo.svg",
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
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"],
                  "opens": "08:00",
                  "closes": "15:30"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Friday",
                  "opens": "08:00",
                  "closes": "16:00"
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
              "url": "https://my-project-mu-ivory-36.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://my-project-mu-ivory-36.vercel.app/berita?q={search_term_string}",
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
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
