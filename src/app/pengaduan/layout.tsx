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
  return children;
}
