import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function InovasiDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="relative">
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-green-700 to-green-800">
            {/* Image overlay skeleton */}
            <div className="absolute inset-0">
              <Skeleton className="w-full h-full rounded-none opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-8 space-y-3">
                {/* Back button skeleton */}
                <Skeleton className="h-4 w-44 bg-white/25 rounded" />

                {/* Title skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-9 w-full max-w-3xl bg-white/20 rounded" />
                  <Skeleton className="h-9 w-2/3 max-w-lg bg-white/15 rounded" />
                </div>

                {/* Meta info skeleton (location + date) */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-28 bg-white/20 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-36 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section Skeleton */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Meta Info Card Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Category skeleton */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded bg-green-100 dark:bg-green-900/40" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    {/* Author skeleton */}
                    <Skeleton className="h-4 w-40" />
                  </div>
                  {/* Share button skeleton */}
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>

              {/* Description Skeleton (2-3 lines) */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-11/12" />
                <Skeleton className="h-6 w-4/5" />
              </div>

              {/* Content Body Skeleton (6-8 lines of varying width) */}
              <div className="space-y-3 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-9/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Image Placeholder Skeleton */}
              <div className="pt-4">
                <Skeleton className="h-64 md:h-96 w-full rounded-xl" />
              </div>

              {/* Photo Gallery Header Skeleton */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-5 w-5 rounded bg-green-100 dark:bg-green-900/40" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="aspect-[4/3] w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
