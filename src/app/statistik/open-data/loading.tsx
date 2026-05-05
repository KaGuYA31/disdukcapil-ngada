import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";

export default function OpenDataLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner Skeleton */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="h-4 w-48 bg-white/20 rounded mb-6 animate-pulse" />
              <div className="h-10 w-80 bg-white/20 rounded mb-4 animate-pulse" />
              <div className="h-5 w-96 bg-white/15 rounded mb-2 animate-pulse" />
              <div className="h-5 w-72 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Prinsip Open Data Skeleton */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-4 w-72 bg-gray-100 rounded mx-auto animate-pulse" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-gray-100 p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4" />
                  <div className="h-6 w-32 bg-gray-100 rounded mx-auto mb-2" />
                  <div className="h-4 w-full bg-gray-50 rounded mb-1" />
                  <div className="h-4 w-5/6 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Tersedia Skeleton */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-8 w-44 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded mx-auto animate-pulse" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-gray-100 p-6 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-full bg-gray-100 rounded mb-1" />
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-50 rounded mb-4" />
                  <div className="h-10 w-full bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Format Data Skeleton */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-8 w-52 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
            <div className="bg-white rounded-xl border-2 border-green-200 p-6 md:p-8">
              <div className="grid sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl mx-auto mb-3" />
                    <div className="h-5 w-16 bg-gray-100 rounded mx-auto mb-1" />
                    <div className="h-4 w-full bg-gray-50 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
