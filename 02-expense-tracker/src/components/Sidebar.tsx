"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartIcon,
  CloseIcon,
  DashboardIcon,
  SettingsIcon,
  TagIcon,
  TargetIcon,
  TransactionsIcon,
  WalletIcon,
} from "@/components/icons";
import { cn } from "@/components/ui";

export const navLinks = [
  { name: "Dashboard", href: "/", icon: DashboardIcon },
  { name: "Transactions", href: "/transactions", icon: TransactionsIcon },
  { name: "Categories", href: "/categories", icon: TagIcon },
  { name: "Budgets", href: "/budgets", icon: TargetIcon },
  { name: "Reports", href: "/reports", icon: ChartIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
        <WalletIcon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        Expense Tracker
      </span>
    </Link>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 ease-out lg:translate-x-0",
          open ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-subtle uppercase">
            Menu
          </p>
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = isActivePath(pathname, link.href);
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-soft text-primary-soft-fg"
                        : "text-muted hover:bg-surface-2 hover:text-fg"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-y-2 -left-3 w-1 rounded-r-full bg-primary" />
                    )}
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive
                          ? "text-primary-soft-fg"
                          : "text-subtle group-hover:text-fg"
                      )}
                    />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-4">
          <p className="text-xs text-subtle">Expense Tracker · v1.0</p>
        </div>
      </aside>
    </>
  );
}
