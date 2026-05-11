import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulir & Dokumen",
  description:
    "Unduh formulir resmi administrasi kependudukan sesuai Permendagri No. 6/2026. Disdukcapil Kabupaten Ngada.",
  openGraph: {
    title: "Formulir & Dokumen | Disdukcapil Ngada",
    description:
      "Unduh formulir resmi administrasi kependudukan sesuai Permendagri No. 6/2026.",
  },
};

export default function FormulirLayout({
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
                "name": "Formulir & Dokumen"
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
