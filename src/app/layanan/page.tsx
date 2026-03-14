import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ServicesListSection } from "@/components/sections/layanan/services-list-section";

export const metadata = {
  title: "Layanan Publik - Disdukcapil Kabupaten Ngada",
  description:
    "Informasi lengkap tentang layanan administrasi kependudukan GRATIS - KTP-el, KK, Akta Kelahiran, Akta Kematian, dan layanan lainnya. Tidak dipungut biaya apapun.",
};

export default function LayananPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Layanan Publik
              </h1>
              <p className="text-green-100 text-lg">
                Informasi lengkap tentang persyaratan dan prosedur layanan
                administrasi kependudukan sesuai UU No. 24 Tahun 2013.
              </p>
              
              {/* Free Service Banner */}
              <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">SELURUH LAYANAN GRATIS</h2>
                    <p className="text-green-100">
                      Sesuai kebijakan pemerintah, seluruh layanan administrasi kependudukan 
                      <strong> TIDAK DIPUNGUT BIAYA </strong> apapun. Termasuk pembuatan KTP-el, 
                      KK, Akta, legalisasi dokumen, dan seluruh layanan lainnya.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Key Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                    Dasar Hukum
                  </h3>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>• UU No. 24 Tahun 2013 tentang Administrasi Kependudukan</li>
                    <li>• Permendagri No. 3 Tahun 2024</li>
                    <li>• SE Menpan RB Tahun 2024 - Pelayanan Publik Gratis</li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                    Informasi Penting
                  </h3>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>• Layanan selesai di tempat (kecuali rekam baru KTP-el)</li>
                    <li>• Bawa dokumen asli dan fotokopi</li>
                    <li>• Datang langsung ke kantor Disdukcapil</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                <p className="text-blue-100 text-sm">
                  <strong>Catatan:</strong> Seluruh layanan dapat diselesaikan pada hari yang sama 
                  selama semua persyaratan terpenuhi. Untuk rekam baru KTP-el, diperlukan waktu 
                  3-5 hari kerja karena proses perekaman biometrik dan sinkronisasi data ke pusat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ServicesListSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
