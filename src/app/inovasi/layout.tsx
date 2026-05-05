import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inovasi Pelayanan",
  description:
    "Program inovasi dan terobosan pelayanan kependudukan dari Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  openGraph: {
    title: "Inovasi Pelayanan | Disdukcapil Ngada",
    description:
      "Program inovasi dan terobosan pelayanan kependudukan Disdukcapil Kabupaten Ngada.",
  },
};

export default function InovasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
