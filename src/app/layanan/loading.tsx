import { Skeleton } from "@/components/ui/skeleton";

export default function LayananLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      <main className="flex-1">
        {/* Hero banner skeleton */}
        <div className="relative bg-gradient-to-br from-green-700 via-green-800 to-teal-900 py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl space-y-4">
              <Skeleton className="h-4 w-32 bg-white/20 rounded" />
              <Skeleton className="h-10 w-72 bg-white/20 rounded" />
              <Skeleton className="h-5 w-96 bg-white/15 rounded" />
              <div className="flex gap-3 mt-6">
                <Skeleton className="h-8 w-28 bg-white/15 rounded-full" />
                <Skeleton className="h-8 w-32 bg-white/15 rounded-full" />
                <Skeleton className="h-8 w-24 bg-white/15 rounded-full" />
              </div>
            </div>
          </div>
          {/* Decorative wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Free service banner skeleton */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/30 py-3">
          <div className="container mx-auto px-4">
            <Skeleton className="h-5 w-64 mx-auto bg-amber-200/60 dark:bg-amber-800/30 rounded" />
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="container mx-auto px-4 py-10 space-y-10">
          {/* Section title */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <Skeleton className="h-4 w-80 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>

          {/* Document checker skeleton */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-4">
            <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex flex-wrap gap-3">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="h-10 w-36 bg-gray-100 dark:bg-gray-800 rounded-full" />
              ))}
            </div>
            <div className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-xl" />
          </div>

          {/* Legal basis skeleton */}
          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 space-y-3">
                <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <Skeleton className="h-4 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
                <Skeleton className="h-4 w-3/5 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>

          {/* Services grid skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    <Skeleton className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                  <Skeleton className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
                  <Skeleton className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <div className="h-64 bg-gray-900" />
    </div>
  );
}
