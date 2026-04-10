export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header spacer */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b" />
      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 py-12">
          <div className="container mx-auto px-4 space-y-4">
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
            <div className="h-3 w-32 bg-white/15 rounded animate-pulse" />
            <div className="h-8 w-96 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-64 bg-white/15 rounded animate-pulse" />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Meta card skeleton */}
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            {/* Description skeleton */}
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            {/* Content body skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            {/* Image skeleton */}
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
