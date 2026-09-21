"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ orgId = null, orgName = null, myRole = null }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm shadow-indigo-200 text-white font-bold text-base">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
              TeamFlow
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Workspace Suite
            </span>
          </div>
        </div>

        {/* Org Banner if in Org Context */}
        {orgId && orgName && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/60">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs">
                {orgName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {orgName}
                </p>
                {myRole && (
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    {myRole}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-5">
          {/* Main Workspace Navigation */}
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Workspace
            </div>
            <nav className="space-y-0.5">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${pathname === "/dashboard" ? "text-indigo-600" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Organizations
              </Link>

              <Link
                href="/dashboard/tasks"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/dashboard/tasks"
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${pathname === "/dashboard/tasks" ? "text-indigo-600" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                My Tasks
              </Link>
            </nav>
          </div>

          {/* Org-Specific Navigation (Shown when inside an organization) */}
          {orgId && (
            <div>
              <div className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Organization Menu
              </div>
              <nav className="space-y-0.5">
                <Link
                  href={`/dashboard/${orgId}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === `/dashboard/${orgId}` || (pathname.startsWith(`/dashboard/${orgId}/projects/`) && !pathname.includes("/members") && !pathname.includes("/reports"))
                      ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      pathname === `/dashboard/${orgId}` ? "text-indigo-600" : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Projects
                </Link>

                <Link
                  href={`/dashboard/${orgId}/members`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === `/dashboard/${orgId}/members`
                      ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      pathname === `/dashboard/${orgId}/members` ? "text-indigo-600" : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Team Members
                </Link>

                <Link
                  href={`/dashboard/${orgId}/reports`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === `/dashboard/${orgId}/reports`
                      ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      pathname === `/dashboard/${orgId}/reports` ? "text-indigo-600" : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics & Reports
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Account Link */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200">
              TF
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">
                Active Session
              </span>
              <span className="text-[11px] text-slate-400">
                Workspace
              </span>
            </div>
          </div>
          <Link
            href="/login"
            title="Sign out / Switch account"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
