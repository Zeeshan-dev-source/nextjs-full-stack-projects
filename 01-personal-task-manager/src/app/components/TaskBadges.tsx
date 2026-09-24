import {
  CATEGORIES,
  PRIORITIES,
  dueStatus,
  formatDueDate,
  labelFor,
  relativeDue,
  type Task,
} from "../lib/tasks";
import { CalendarIcon, TagIcon } from "./Icons";

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

export const PRIORITY_STYLES: Record<string, { badge: string; dot: string }> = {
  high: {
    badge:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/25",
    dot: "bg-red-500",
  },
  medium: {
    badge:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/25",
    dot: "bg-amber-500",
  },
  low: {
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25",
    dot: "bg-emerald-500",
  },
};

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.low;
  return (
    <span className={`${badgeBase} ${style.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {labelFor(PRIORITIES, priority)}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`${badgeBase} bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700`}
    >
      <TagIcon className="h-3 w-3" />
      {labelFor(CATEGORIES, category)}
    </span>
  );
}

const DUE_STYLES = {
  overdue:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/25",
  today:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/25",
  soon: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/25",
  later:
    "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  done: "bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
};

export function DueBadge({ task }: { task: Task }) {
  const status = dueStatus(task);
  if (!status || !task.due_date) return null;

  const label =
    status === "overdue" || status === "today"
      ? `${formatDueDate(task.due_date)} · ${relativeDue(task.due_date)}`
      : formatDueDate(task.due_date);

  return (
    <span
      className={`${badgeBase} ${DUE_STYLES[status]}`}
      title={relativeDue(task.due_date)}
    >
      <CalendarIcon className="h-3 w-3" />
      {label}
    </span>
  );
}
