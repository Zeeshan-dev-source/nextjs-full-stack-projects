export default function AdminProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="h-16 border-b border-gray-200 bg-white" />

      <main className="mx-auto max-w-5xl px-6 py-10 animate-pulse space-y-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-200" />
        </div>

        <div className="flex justify-between gap-4">
          <div className="h-10 w-64 rounded-xl bg-gray-200" />
          <div className="h-10 w-36 rounded-xl bg-gray-200" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="space-y-1">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-6 w-16 rounded bg-gray-200" />
              <div className="h-6 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}