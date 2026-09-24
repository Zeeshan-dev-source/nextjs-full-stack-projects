"use client";

import Link from "next/link";

export default function Header({ breadcrumbs = [], title, subtitle, actions = null }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md lg:sticky lg:top-0 z-10 px-4 py-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400 mb-2 min-w-0">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2 min-w-0">
              {idx > 0 && (
                <svg className="w-3 h-3 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-700 transition-colors truncate max-w-[10rem] sm:max-w-none"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700 font-semibold truncate max-w-[10rem] sm:max-w-none">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
