export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="h-16 border-b border-gray-200 bg-white" />

      <main className="mx-auto max-w-6xl px-6 py-10 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-44 rounded bg-gray-200 mb-6" />

        {/* 2-Column Product Showcase skeleton */}
        <div className="grid gap-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="h-80 sm:h-[450px] w-full rounded-2xl bg-gray-200" />

          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-36 rounded-full bg-gray-200" />
            <div className="h-10 w-3/4 rounded-xl bg-gray-200" />
            <div className="h-8 w-28 rounded-lg bg-gray-200" />
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
            <div className="h-28 rounded-2xl bg-gray-100" />
            <div className="h-12 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </main>
    </div>
  );
}
