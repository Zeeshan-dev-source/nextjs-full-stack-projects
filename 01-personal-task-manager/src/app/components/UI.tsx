import type { ReactNode } from "react";

/** Shared card surface used across both pages. */
export const cardClass =
  "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

/** Shared form control styling (inputs & selects). */
export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border border-dashed border-slate-300 text-center dark:border-slate-700 ${
        compact ? "px-4 py-8" : "px-6 py-14"
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </span>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <p className="text-sm font-medium text-red-700 dark:text-red-300">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/15"
      >
        Try again
      </button>
    </div>
  );
}
