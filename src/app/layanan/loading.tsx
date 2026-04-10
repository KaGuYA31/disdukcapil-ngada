export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header spacer */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b" />
      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl space-y-4">
              <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
              <div className="h-10 w-80 bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-96 bg-white/15 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-12 space-y-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
