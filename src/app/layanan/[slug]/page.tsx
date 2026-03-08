import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ServiceDetail } from "@/components/sections/layanan/service-detail";

export const metadata = {
  title: "Detail Layanan",
  description: "Informasi lengkap persyaratan dan prosedur layanan.",
};

export default function LayananDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <ServiceDetail slug={params} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
