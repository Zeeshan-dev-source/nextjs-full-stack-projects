import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-radial-[at_top_right] from-gray-900 via-gray-950 to-black px-8 py-16 sm:px-16 sm:py-24 text-white shadow-2xl">
          {/* Subtle background glow effect */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-slate-700/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-slate-800/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-gray-200 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              New 2026 Collection • Cash on Delivery Guaranteed
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-tight">
              Curated Essentials for Everyday Excellence.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
              Explore minimalist everyday products designed with premium quality and honest pricing. Pay comfortably when your order reaches your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-gray-950 shadow-md transition hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Shop Featured Items</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <Link
                href="/cart"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/10 active:scale-[0.98]"
              >
                <span>Check Your Cart</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Mini Trust Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 text-center text-xs sm:text-sm">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">10k+</p>
                <p className="text-gray-400 mt-0.5">Orders Delivered</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-xl sm:text-2xl font-black text-white">4.9 ★</p>
                <p className="text-gray-400 mt-0.5">Customer Rating</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">100%</p>
                <p className="text-gray-400 mt-0.5">COD Payment Safety</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
