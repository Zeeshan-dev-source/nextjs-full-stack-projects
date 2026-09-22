export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header skeleton */}
      <div className="h-16 border-b border-gray-200 bg-white" />

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-12 animate-pulse">
        {/* Hero Banner skeleton */}
        <div className="h-72 w-full rounded-3xl bg-gray-200" />

        {/* Filter bar skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="h-10 w-48 rounded-xl bg-gray-200" />
          <div className="h-10 w-64 rounded-xl bg-gray-200" />
        </div>

        {/* Product Cards skeleton grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="h-48 w-full rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 rounded bg-gray-200" />
                <div className="h-8 w-24 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}