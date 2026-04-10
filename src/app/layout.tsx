import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { CookieBanner } from "@/components/shared/cookie-banner";

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
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="skip-link">
          Langsung ke konten utama
        </a>
        <Providers>
          <CookieBanner />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
