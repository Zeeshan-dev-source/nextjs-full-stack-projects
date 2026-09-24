"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { ChartIcon, CheckIcon, ListIcon } from "./Icons";

const NAV_ITEMS = [
  { href: "/", label: "Tasks", Icon: ListIcon },
  { href: "/dashboard", label: "Dashboard", Icon: ChartIcon },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <CheckIcon className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="hidden truncate text-sm font-semibold text-slate-900 sm:block dark:text-white">
            Personal Task Manager
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
