"use client";

import { useState } from "react";

export default function ProductImage({
  src,
  alt = "Product Image",
  className = "h-52 w-full",
  badge = null,
  priority = false,
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center select-none ${className}`}
    >
      {!showFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center transition-transform duration-500 group-hover:scale-105">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-xs ring-1 ring-black/5 text-gray-700">
            <svg
              className="h-7 w-7 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            MiniStore Essential
          </span>
        </div>
      )}

      {/* Optional overlay badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow-xs">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
