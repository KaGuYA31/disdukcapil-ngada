import { Skeleton } from "@/components/ui/skeleton";

export default function TransparansiLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner Skeleton */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb skeleton */}
            <Skeleton className="h-4 w-56 mb-4 bg-white/20" />

            {/* Title skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
              <Skeleton className="h-10 w-72 bg-white/20" />
            </div>

            {/* Description skeleton */}
            <Skeleton className="h-5 w-full max-w-lg bg-white/15" />
            <Skeleton className="h-5 w-96 max-w-full bg-white/15 mt-1" />
          </div>
        </div>
      </section>

      {/* Announcements Timeline Skeleton */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Section title skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-green-100" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Timeline items skeleton */}
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pl-8 md:pl-10 relative">
                {/* Timeline line */}
                <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                {/* Timeline dot */}
                <div className="absolute left-1.5 md:left-2.5 top-6 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                {/* Card skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparansi Content Skeleton */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Category tabs skeleton */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full flex-shrink-0" />
            ))}
          </div>

          {/* Document list skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-gray-800">
                <Skeleton className="h-10 w-10 rounded-lg bg-green-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-5 w-full max-w-[400px]" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md flex-shrink-0 bg-green-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
