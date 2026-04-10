import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { NewsListSection } from "@/components/sections/berita/news-list-section";

export const metadata = {
  title: "Berita & Informasi",
  description:
    "Berita terbaru dan informasi seputar layanan kependudukan Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.",
};

export default function BeritaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4">
                <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Berita & Informasi" }]} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Berita & Informasi
              </h1>
              <p className="text-green-100 text-lg">
                Dapatkan informasi terbaru seputar layanan kependudukan dan
                kegiatan Disdukcapil Kabupaten Ngada.
              </p>
            </div>
          </div>
        </section>

        <NewsListSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
