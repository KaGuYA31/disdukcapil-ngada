import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan layanan website Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  openGraph: {
    title: "Syarat & Ketentuan | Disdukcapil Ngada",
    description: "Syarat dan ketentuan penggunaan layanan website Disdukcapil Kabupaten Ngada.",
    type: "website",
  },
  alternates: {
    canonical: "/syarat-ketentuan",
  },
};

export default function SyaratKetentuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
