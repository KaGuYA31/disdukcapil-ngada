import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Keamanan Data",
  description:
    "Kebijakan privasi dan keamanan data Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada. Informasi tentang pengelolaan data pribadi Anda.",
  openGraph: {
    title: "Kebijakan Privasi & Keamanan Data | Disdukcapil Ngada",
    description:
      "Kebijakan privasi dan keamanan data Disdukcapil Kabupaten Ngada.",
    url: "https://disdukcapil-ngada.vercel.app/kebijakan-privasi",
    images: [
      {
        url: "/logo-kabupaten.png",
        width: 512,
        height: 512,
        alt: "Logo Disdukcapil Kabupaten Ngada",
      },
    ],
  },
  alternates: {
    canonical: "/kebijakan-privasi",
  },
};

export default function KebijakanPrivasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                name: "Kebijakan Privasi",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
