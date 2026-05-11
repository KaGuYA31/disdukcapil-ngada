import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Kependudukan",
  description:
    "Statistik data kependudukan Kabupaten Ngada: jumlah penduduk, distribusi jenis kelamin, kepemilikan KTP, Akta Kelahiran, dan KIA per kecamatan.",
  openGraph: {
    title: "Data Kependudukan | Disdukcapil Ngada",
    description:
      "Statistik data kependudukan Kabupaten Ngada: jumlah penduduk, distribusi jenis kelamin, kepemilikan KTP, Akta Kelahiran, dan KIA per kecamatan.",
    url: "https://disdukcapil-ngada.vercel.app/statistik",
    images: [
      {
        url: "/logo-kabupaten.png",
        width: 512,
        height: 512,
        alt: "Logo Disdukcapil Kabupaten Ngada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Kependudukan | Disdukcapil Ngada",
    description:
      "Statistik data kependudukan Kabupaten Ngada: jumlah penduduk, distribusi jenis kelamin, kepemilikan KTP, Akta Kelahiran, dan KIA per kecamatan.",
    images: ["/logo-kabupaten.png"],
  },
  alternates: {
    canonical: "/statistik",
  },
};

export default function StatistikLayout({
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
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Beranda",
                "item": "https://disdukcapil-ngada.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Data Kependudukan"
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
