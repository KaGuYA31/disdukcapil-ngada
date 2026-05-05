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
  return children;
}
