import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Disdukcapil Ngada",
  description: "Syarat dan ketentuan penggunaan layanan website Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
};

export default function SyaratKetentuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
