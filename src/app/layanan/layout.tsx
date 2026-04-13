import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan Administrasi Kependudukan",
  description:
    "Informasi lengkap persyaratan dan prosedur layanan administrasi kependudukan: KTP-el, Kartu Keluarga, Akta Kelahiran, Akta Kematian, Akta Perkawinan, dan lainnya. Seluruh layanan gratis.",
  openGraph: {
    title: "Layanan Administrasi Kependudukan | Disdukcapil Ngada",
    description:
      "Informasi lengkap persyaratan dan prosedur layanan administrasi kependudukan: KTP-el, Kartu Keluarga, Akta Kelahiran, Akta Kematian, Akta Perkawinan, dan lainnya. Seluruh layanan gratis.",
    url: "https://disdukcapil-ngada.vercel.app/layanan",
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
    title: "Layanan Administrasi Kependudukan | Disdukcapil Ngada",
    description:
      "Informasi lengkap persyaratan dan prosedur layanan administrasi kependudukan: KTP-el, Kartu Keluarga, Akta Kelahiran, Akta Kematian, Akta Perkawinan, dan lainnya. Seluruh layanan gratis.",
    images: ["/logo-kabupaten.png"],
  },
  alternates: {
    canonical: "/layanan",
  },
};

export default function LayananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
