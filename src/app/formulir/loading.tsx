import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";

const CARD_ACCENT_COLORS = [
  "bg-green-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-teal-500",
];

export default function FormulirLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Banner Skeleton */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Decorative gradient orbs (static) */}
          <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              {/* Breadcrumb skeleton */}
              <Skeleton className="h-4 w-56 mb-6 bg-white/20" />

              {/* Badge skeleton */}
              <Skeleton className="h-6 w-36 rounded-full bg-white/20 mb-3" />

              {/* Title skeleton with icon */}
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-xl bg-white/20 flex-shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-80 max-w-full bg-white/20" />
                  <Skeleton className="h-10 w-56 bg-white/15 hidden sm:block" />
                </div>
              </div>

              {/* Description skeleton */}
              <Skeleton className="h-5 w-full max-w-xl bg-white/15" />
              <Skeleton className="h-5 w-80 max-w-full bg-white/15 mt-1" />

              {/* Stats grid skeleton */}
              <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Skeleton className="h-8 w-16 bg-white/20 mb-1" />
                  <Skeleton className="h-4 w-28 bg-white/15" />
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Skeleton className="h-8 w-20 bg-white/20 mb-1" />
                  <Skeleton className="h-4 w-24 bg-white/15" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
                className="fill-gray-50 dark:fill-gray-950"
              />
            </svg>
          </div>
        </section>

        {/* Search & Filter Skeleton */}
        <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search bar skeleton */}
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Category filter pills skeleton */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-9 w-32 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Card Grid Skeleton */}
        <section className="bg-gray-50 dark:bg-gray-950 py-10 md:py-14 min-h-[50vh]">
          <div className="container mx-auto px-4">
            {/* Category group skeleton */}
            <div className="space-y-10">
              {[1, 2].map((groupIdx) => (
                <div key={groupIdx}>
                  {/* Category header skeleton */}
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>

                  {/* Card grid skeleton */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2].map((cardIdx) => (
                      <div
                        key={cardIdx}
                        className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 relative overflow-hidden"
                      >
                        {/* Colored top accent line */}
                        <div
                          className={`h-0.5 ${
                            CARD_ACCENT_COLORS[groupIdx * 3 + cardIdx]
                          }`}
                        />

                        <div className="p-5 flex flex-col h-full">
                          {/* Top row: icon + badge */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                          </div>

                          {/* Title skeleton */}
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-3" />

                          {/* Description skeleton (2 lines) */}
                          <Skeleton className="h-3 w-full mb-1.5" />
                          <Skeleton className="h-3 w-5/6 mb-3" />

                          {/* File size skeleton */}
                          <Skeleton className="h-3 w-16 mb-3" />

                          {/* Bottom row */}
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
