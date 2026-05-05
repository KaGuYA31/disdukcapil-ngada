import { Skeleton } from "@/components/ui/skeleton";

export default function BeritaLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner Skeleton */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb skeleton */}
            <Skeleton className="h-4 w-48 mb-4 bg-white/20" />

            {/* Title skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
              <Skeleton className="h-10 w-64 bg-white/20" />
            </div>

            {/* Description skeleton */}
            <Skeleton className="h-5 w-96 max-w-full bg-white/15" />
          </div>
        </div>
      </section>

      {/* News Grid Skeleton */}
      <div className="container mx-auto px-4 py-12 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3 rounded-xl border p-0 overflow-hidden hover:shadow-lg transition-shadow">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
