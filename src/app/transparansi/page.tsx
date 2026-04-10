import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TransparansiSection } from "@/components/sections/transparansi/transparansi-section";

export const metadata = {
  title: "Transparansi & Publikasi",
  description:
    "Dokumen peraturan, laporan, dan publikasi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
};

export default function TransparansiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Transparansi & Publikasi" }]} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Transparansi & Publikasi
              </h1>
              <p className="text-green-100 text-lg">
                Akses dokumen peraturan, laporan kinerja, dan publikasi resmi
                Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.
              </p>
            </div>
          </div>
        </section>

        <TransparansiSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
