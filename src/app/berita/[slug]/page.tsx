import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { NewsDetail } from "@/components/sections/berita/news-detail";

export const metadata = {
  title: "Detail Berita",
  description: "Artikel berita lengkap dari Disdukcapil Kabupaten Ngada.",
};

export default function BeritaDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <NewsDetail />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
