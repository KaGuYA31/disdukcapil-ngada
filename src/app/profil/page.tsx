import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { VisiMisiSection } from "@/components/sections/profil/visi-misi-section";
import { StrukturSection } from "@/components/sections/profil/struktur-section";
import { SejarahSection } from "@/components/sections/profil/sejarah-section";
import { LokasiSection } from "@/components/sections/profil/lokasi-section";

export const metadata = {
  title: "Profil Dinas",
  description:
    "Profil Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada - Visi, Misi, Struktur Organisasi, Sejarah, dan Lokasi Kantor.",
};

export default function ProfilPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Profil Dinas
              </h1>
              <p className="text-green-100 text-lg">
                Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
              </p>
              <p className="text-green-200 mt-2">
                Melayani dengan sepenuh hati untuk kemudahan akses layanan
                administrasi kependudukan
              </p>
            </div>
          </div>
        </section>

        <VisiMisiSection />
        <StrukturSection />
        <SejarahSection />
        <LokasiSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
