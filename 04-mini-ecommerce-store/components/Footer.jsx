import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      {/* Trust Highlights Strip */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Fast Shipping</h4>
                <p className="text-xs text-gray-500">Free delivery on orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Cash on Delivery</h4>
                <p className="text-xs text-gray-500">Inspect & pay at your doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">30-Day Guarantee</h4>
                <p className="text-xs text-gray-500">Hassle-free return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">24/7 Assistance</h4>
                <p className="text-xs text-gray-500">Dedicated support anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-gray-900 tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              MiniStore
            </Link>
            <p className="mt-4 max-w-sm text-sm text-gray-500 leading-relaxed">
              Curating quality essentials with simplicity, transparent pricing, and seamless Cash on Delivery convenience.
            </p>
            <div className="mt-6 flex items-center gap-4 text-gray-400">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                ● Store Status: Operational
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Navigation</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition hover:text-gray-900">Products Catalog</Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-gray-900">Shopping Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="transition hover:text-gray-900">Checkout</Link>
              </li>
              <li>
                <Link href="/admin/products" className="transition hover:text-gray-900">Admin Dashboard</Link>
              </li>
              <li>
                <Link href="/add-product" className="transition hover:text-gray-900">Add Product</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Customer Care</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <span className="cursor-pointer transition hover:text-gray-900">Shipping & Delivery</span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-gray-900">Returns & Exchanges</span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-gray-900">Cash on Delivery Guide</span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-gray-900">Terms of Service</span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-gray-900">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Payment Methods</h3>
            <p className="mt-4 text-sm text-gray-500">
              We currently offer verified <strong>Cash on Delivery (COD)</strong> across all supported regions for your safety and peace of mind.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Secure Checkout
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MiniStore Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span>Powered by Next.js & MongoDB</span>
            <span>•</span>
            <span>Cash on Delivery Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
