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
  return children;
}
