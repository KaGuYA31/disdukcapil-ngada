import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Dinas",
  description:
    "Profil Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada: Visi, Misi, Struktur Organisasi, dan Sejarah.",
  openGraph: {
    title: "Profil Dinas | Disdukcapil Ngada",
    description:
      "Profil Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
  },
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
