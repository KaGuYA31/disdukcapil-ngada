import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaduan Masyarakat",
  description:
    "Sampaikan pengaduan dan aspirasi Anda terkait pelayanan administrasi kependudukan di Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  openGraph: {
    title: "Pengaduan Masyarakat | Disdukcapil Ngada",
    description:
      "Sampaikan pengaduan dan aspirasi Anda terkait pelayanan administrasi kependudukan di Disdukcapil Ngada.",
  },
};

export default function PengaduanLayout({
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
                "name": "Bantuan & Pengaduan"
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
