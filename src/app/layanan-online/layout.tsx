import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan Online",
  description:
    "Ajukan permohonan layanan kependudukan secara online: KTP-el, Kartu Keluarga, Akta Kelahiran, dan lainnya. Disdukcapil Kabupaten Ngada.",
  openGraph: {
    title: "Layanan Online | Disdukcapil Ngada",
    description:
      "Ajukan permohonan layanan kependudukan secara online di Disdukcapil Kabupaten Ngada.",
  },
};

export default function LayananOnlineLayout({
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
                "name": "Layanan Online"
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
