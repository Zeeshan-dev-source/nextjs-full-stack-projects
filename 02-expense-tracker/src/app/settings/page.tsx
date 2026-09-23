"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import {
  AlertIcon,
  CoinsIcon,
  DatabaseIcon,
  DownloadIcon,
  InfoIcon,
  MonitorIcon,
  MoonIcon,
  ResetIcon,
  SunIcon,
  TrashIcon,
  type IconProps,
} from "@/components/icons";
import { cn, PageHeader, Spinner } from "@/components/ui";
import {
  CURRENCIES,
  formatMoney,
  resetPreferences,
  setCurrencyPreference,
  setThemePreference,
  useCurrency,
  useThemePreference,
  type CurrencyCode,
  type ThemePreference,
} from "@/lib/preferences";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
};

const themeOptions: {
  value: ThemePreference;
  label: string;
  icon: ComponentType<IconProps>;
  preview: string;
}[] = [
  { value: "light", label: "Light", icon: SunIcon, preview: "light" },
  { value: "dark", label: "Dark", icon: MoonIcon, preview: "dark" },
  { value: "system", label: "System", icon: MonitorIcon, preview: "system" },
];

function ThemePreview({ variant }: { variant: string }) {
  const light = (
    <div className="flex h-full w-full gap-1 bg-[#f6f7f9] p-1.5">
      <div className="w-1/4 rounded-sm bg-white" />
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-2 rounded-sm bg-white" />
        <div className="flex-1 rounded-sm bg-white" />
      </div>
    </div>
  );
  const dark = (
    <div className="flex h-full w-full gap-1 bg-[#0b0d12] p-1.5">
      <div className="w-1/4 rounded-sm bg-[#1a1f29]" />
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-2 rounded-sm bg-[#1a1f29]" />
        <div className="flex-1 rounded-sm bg-[#1a1f29]" />
      </div>
    </div>
  );

  return (
    <div className="flex h-16 w-full overflow-hidden rounded-md border border-line">
      {variant === "light" && light}
      {variant === "dark" && dark}
      {variant === "system" && (
        <>
          <div className="w-1/2 overflow-hidden">{light}</div>
          <div className="w-1/2 overflow-hidden">{dark}</div>
        </>
      )}
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:gap-8">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-fg">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function csvCell(value: unknown) {
  let text = String(value ?? "");

  // Prevent spreadsheet formula injection.
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export default function SettingsPage() {
  const theme = useThemePreference();
  const currency = useCurrency();
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  async function handleExportTransactions() {
    setExporting(true);
    setExportMessage("");

    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        alert(data?.error || "Failed to export transactions");
        return;
      }

      const header = ["ID", "Title", "Amount", "Type", "Category", "Date"];
      const rows = (data as Transaction[]).map((transaction) =>
        [
          transaction.id,
          transaction.title,
          transaction.amount,
          transaction.type,
          transaction.category,
          transaction.transaction_date,
        ]
          .map(csvCell)
          .join(",")
      );

      const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");
      const blob = new Blob(["﻿" + csv], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setExportMessage(
        `Exported ${data.length} transaction${data.length !== 1 ? "s" : ""}.`
      );
    } catch (error) {
      console.error("Failed to export transactions:", error);
      alert("Something went wrong");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your expense tracker settings."
      />

      <div className="space-y-6">
        {/* Appearance */}
        <SettingsSection
          icon={SunIcon}
          title="Appearance"
          description="Choose how the application looks. System follows your device setting."
        >
          <div
            className="grid grid-cols-3 gap-2 sm:gap-3"
            role="radiogroup"
            aria-label="Theme"
          >
            {themeOptions.map((option) => {
              const selected = theme === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setThemePreference(option.value)}
                  className={cn(
                    "flex flex-col gap-2.5 rounded-xl border p-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-2.5",
                    selected
                      ? "border-primary bg-primary-soft/50 ring-1 ring-primary"
                      : "border-line hover:border-line-strong hover:bg-surface-2/50"
                  )}
                >
                  <ThemePreview variant={option.preview} />
                  <span
                    className={cn(
                      "flex items-center gap-1.5 px-0.5 text-sm font-medium",
                      selected ? "text-primary-soft-fg" : "text-fg"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </SettingsSection>

        {/* Currency */}
        <SettingsSection
          icon={CoinsIcon}
          title="Currency"
          description="Select the currency symbol used to display amounts throughout the app."
        >
          <label htmlFor="currency" className="label">
            Display currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) =>
              setCurrencyPreference(e.target.value as CurrencyCode)
            }
            className="input sm:max-w-xs"
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} - {item.label}
              </option>
            ))}
          </select>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-surface-2 px-3 py-2.5 text-sm">
            <span className="text-muted">Preview:</span>
            <span className="font-semibold text-fg tabular-nums">
              {formatMoney(125000.5, currency)}
            </span>
          </div>
          <p className="mt-2 text-xs text-subtle">
            Changes the display symbol only — stored amounts are not converted.
          </p>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          icon={DatabaseIcon}
          title="Data Management"
          description="Export your transaction data or reset local preferences."
        >
          <div className="divide-y divide-line rounded-xl border border-line">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">
                  Export transactions
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {exportMessage || "Download all transactions as a CSV file."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportTransactions}
                disabled={exporting}
                className="btn btn-secondary"
              >
                {exporting ? (
                  <Spinner />
                ) : (
                  <DownloadIcon className="h-4 w-4" />
                )}
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">
                  Reset preferences
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Restore theme and currency to their defaults.
                </p>
              </div>
              <button
                type="button"
                onClick={resetPreferences}
                className="btn btn-secondary"
              >
                <ResetIcon className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-500/20 dark:bg-rose-500/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                    Clear all transactions
                  </p>
                  <p className="mt-0.5 text-sm text-rose-600/80 dark:text-rose-300/70">
                    Bulk deletion is disabled to protect your data. Delete
                    individual transactions from the Transactions page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="btn btn-danger"
                title="Bulk deletion is disabled"
              >
                <TrashIcon className="h-4 w-4" />
                Clear All
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* About */}
        <SettingsSection
          icon={InfoIcon}
          title="About"
          description="Application information."
        >
          <dl className="divide-y divide-line rounded-xl border border-line text-sm">
            {[
              ["Application", "Expense Tracker"],
              ["Version", "1.0"],
              ["Built with", "Next.js, React & Tailwind CSS"],
            ].map(([term, detail]) => (
              <div
                key={term}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-medium text-fg">{detail}</dd>
              </div>
            ))}
          </dl>
        </SettingsSection>
      </div>
    </div>
  );
}
