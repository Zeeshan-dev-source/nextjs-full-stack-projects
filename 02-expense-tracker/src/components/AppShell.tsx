"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { isActivePath, Logo, navLinks } from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { MenuIcon } from "@/components/icons";
import { applyTheme, useResolvedTheme } from "@/lib/preferences";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useResolvedTheme();

  const currentPage =
    navLinks.find((link) => isActivePath(pathname, link.href))?.name ??
    "Expense Tracker";

  // Keep the <html> class in sync with the stored/system theme.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Close the mobile drawer with Escape and lock page scroll while it's open.
  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-icon -ml-2 lg:hidden"
            aria-label="Open menu"
            aria-controls="app-sidebar"
            aria-expanded={sidebarOpen}
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <p className="hidden text-sm text-muted lg:block">
            <span className="text-subtle">Expense Tracker</span>
            <span className="mx-2 text-line-strong">/</span>
            <span className="font-medium text-fg">{currentPage}</span>
          </p>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
