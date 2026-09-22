import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-lg rounded-3xl border border-gray-200/80 bg-white p-10 sm:p-14 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-500">
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <span className="mt-6 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-600">
            Error 404
          </span>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Page Not Found
          </h1>

          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Sorry, the page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-95"
            >
              Back to Storefront
            </Link>

            <Link
              href="/#catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
