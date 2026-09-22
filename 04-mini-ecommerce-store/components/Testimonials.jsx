export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      location: "San Francisco, CA",
      role: "Verified Buyer",
      rating: 5,
      date: "2 days ago",
      comment:
        "The build quality exceeded my expectations. Being able to inspect upon delivery before paying gave me total confidence in my purchase!",
      initial: "S",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Marcus Sterling",
      location: "Austin, TX",
      role: "Verified Buyer",
      rating: 5,
      date: "1 week ago",
      comment:
        "Super fast shipping, clean aesthetic, and the product arrived in pristine condition. MiniStore is my new go-to for essentials.",
      initial: "M",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      name: "Elena Rostova",
      location: "Seattle, WA",
      role: "Verified Buyer",
      rating: 5,
      date: "3 weeks ago",
      comment:
        "Simple, sleek, and high utility. Customer support answered my sizing questions immediately. 10/10 experience!",
      initial: "E",
      badgeColor: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/60">
          <span>★★★★★</span>
          <span>4.9 / 5 Overall Score</span>
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Trusted by Happy Shoppers
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          See how our customers experience our transparent pricing and doorstep cash on delivery service.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="mt-4 text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Author Info */}
            <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${review.badgeColor}`}>
                {review.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {review.name}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-xs text-gray-400">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
