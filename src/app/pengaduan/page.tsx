import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PengaduanSection } from "@/components/sections/pengaduan/pengaduan-section";

export const metadata = {
  title: "Bantuan & Pengaduan",
  description:
    "Formulir pengaduan dan informasi kontak Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
};

export default function PengaduanPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Bantuan & Pengaduan" }]} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Bantuan & Pengaduan
              </h1>
              <p className="text-green-100 text-lg">
                Sampaikan pertanyaan, keluhan, atau saran Anda untuk membantu
                kami meningkatkan kualitas pelayanan.
              </p>
            </div>
          </div>
        </section>

        <PengaduanSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
