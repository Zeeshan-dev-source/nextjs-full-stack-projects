"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { setThemePreference, useResolvedTheme } from "@/lib/preferences";

export default function ThemeToggle() {
  const theme = useResolvedTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setThemePreference(theme === "dark" ? "light" : "dark")
      }
      className="btn btn-secondary btn-icon"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {/* Icons swap via the .dark class so they're correct before hydration */}
      <MoonIcon className="h-[18px] w-[18px] dark:hidden" />
      <SunIcon className="hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
