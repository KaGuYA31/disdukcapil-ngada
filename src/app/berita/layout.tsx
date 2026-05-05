import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description:
    "Berita dan informasi terbaru seputar layanan kependudukan, kegiatan, dan pengumuman dari Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  openGraph: {
    title: "Berita & Informasi | Disdukcapil Ngada",
    description:
      "Berita dan informasi terbaru seputar layanan kependudukan, kegiatan, dan pengumuman dari Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
    url: "https://disdukcapil-ngada.vercel.app/berita",
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
    title: "Berita & Informasi | Disdukcapil Ngada",
    description:
      "Berita dan informasi terbaru seputar layanan kependudukan, kegiatan, dan pengumuman dari Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
    images: ["/logo-kabupaten.png"],
  },
  alternates: {
    canonical: "/berita",
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
