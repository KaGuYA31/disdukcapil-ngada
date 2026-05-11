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
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
