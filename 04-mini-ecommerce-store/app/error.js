"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-md rounded-3xl border border-gray-200/80 bg-white p-10 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Something went wrong!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            An unexpected error occurred while loading this page. Don&apos;t worry, your cart and session data are safe.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black transition cursor-pointer"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
