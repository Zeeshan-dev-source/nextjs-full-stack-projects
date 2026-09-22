"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("🎉 You're subscribed! Check your inbox soon for exclusive perks.");
    }, 400);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-900 to-black p-8 sm:p-14 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-300">
            Exclusive Deals
          </span>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl tracking-tight">
            Stay in the Loop
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Subscribe to get early access to new drops, seasonal discounts, and curated product recommendations.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-white focus:bg-white/15 focus:outline-none backdrop-blur-xs transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-950 shadow-md transition hover:bg-gray-100 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Joining..." : "Subscribe"}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400">
            🔒 We respect your privacy. No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
