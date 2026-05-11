export default function SyaratKetentuanLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 dark:from-green-900 dark:to-green-950 h-48 md:h-56" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
