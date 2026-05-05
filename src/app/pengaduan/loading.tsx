import { Skeleton } from "@/components/ui/skeleton";

export default function PengaduanLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner Skeleton */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb skeleton */}
            <Skeleton className="h-4 w-48 mb-4 bg-white/20" />

            {/* Badge skeleton */}
            <Skeleton className="h-7 w-40 rounded-full bg-white/15 mb-3" />

            {/* Title skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-11 w-11 rounded-full bg-white/20" />
              <Skeleton className="h-11 w-72 bg-white/20" />
            </div>

            {/* Description skeleton */}
            <Skeleton className="h-5 w-full max-w-lg bg-white/15" />
            <Skeleton className="h-5 w-80 max-w-full bg-white/15 mt-1" />

            {/* Steps indicator skeleton */}
            <div className="mt-8 flex items-center gap-2 sm:gap-0">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-w-fit">
                    <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-16 bg-white/15" />
                  </div>
                  {step < 4 && (
                    <div className="px-1 sm:px-2">
                      <Skeleton className="w-4 sm:w-8 h-px bg-white/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Response time skeleton */}
            <div className="mt-6 flex items-center gap-3 bg-green-600/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-white/20" />
                <Skeleton className="h-3 w-56 bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Area Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions Column */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="rounded-xl border p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-28 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <Skeleton className="h-11 w-40 rounded-md bg-green-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
