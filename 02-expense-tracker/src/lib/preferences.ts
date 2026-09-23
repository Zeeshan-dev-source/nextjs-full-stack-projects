import { useCallback, useSyncExternalStore } from "react";

// Client-side UI preferences (theme + display currency), stored in
// localStorage under the same keys the app has always used.

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type CurrencyCode = "PKR" | "USD" | "EUR";

export const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
}[] = [
  { code: "PKR", label: "Pakistani Rupee", symbol: "Rs." },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
];

const THEME_KEY = "theme";
const CURRENCY_KEY = "currency";
const CHANGE_EVENT = "preferences-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Storage unavailable (private mode etc.) — preference just won't persist.
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(DARK_QUERY);

  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  media.addEventListener("change", callback);

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

function getThemePreference(): ThemePreference {
  const value = readStorage(THEME_KEY);
  return value === "light" || value === "dark" ? value : "system";
}

function getResolvedTheme(): ResolvedTheme {
  const preference = getThemePreference();

  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function getCurrency(): CurrencyCode {
  const value = readStorage(CURRENCY_KEY);
  const match = CURRENCIES.find((currency) => currency.code === value);
  return match ? match.code : "PKR";
}

export function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function setThemePreference(preference: ThemePreference) {
  writeStorage(THEME_KEY, preference === "system" ? null : preference);
  applyTheme(getResolvedTheme());
}

export function setCurrencyPreference(currency: CurrencyCode) {
  writeStorage(CURRENCY_KEY, currency);
}

export function resetPreferences() {
  try {
    window.localStorage.removeItem(CURRENCY_KEY);
  } catch {
    // ignore
  }

  setThemePreference("system");
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    subscribe,
    getThemePreference,
    () => "system"
  );
}

export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(subscribe, getResolvedTheme, () => "light");
}

export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(subscribe, getCurrency, () => "PKR");
}

export function formatMoney(
  value: number | string,
  currency: CurrencyCode
): string {
  const amount = Number(value) || 0;
  const symbol =
    CURRENCIES.find((item) => item.code === currency)?.symbol ?? "Rs.";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  const separator = symbol.length > 1 ? " " : "";

  return `${amount < 0 ? "-" : ""}${symbol}${separator}${formatted}`;
}

/** Returns a formatter that renders amounts in the user's chosen currency. */
export function useFormatMoney() {
  const currency = useCurrency();

  return useCallback(
    (value: number | string) => formatMoney(value, currency),
    [currency]
  );
}
