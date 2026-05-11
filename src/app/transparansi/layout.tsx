import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparansi & Akuntabilitas",
  description:
    "Informasi transparansi dan akuntabilitas kinerja Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  openGraph: {
    title: "Transparansi & Akuntabilitas | Disdukcapil Ngada",
    description:
      "Informasi transparansi dan akuntabilitas kinerja Disdukcapil Kabupaten Ngada.",
  },
};

export default function TransparansiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
