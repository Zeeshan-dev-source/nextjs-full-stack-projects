// Shared, frontend-only helpers for the `tasks` table. No schema changes here —
// this only describes the columns the app already reads and writes.

import { supabase } from "./supabase";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  category: string;
  due_date: string | null;
  created_at?: string;
};

export const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export const CATEGORIES = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "study", label: "Study" },
  { value: "shopping", label: "Shopping" },
  { value: "other", label: "Other" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priority", label: "Priority (high → low)" },
  { value: "due", label: "Due date (soonest)" },
  { value: "completed", label: "Completed first" },
  { value: "pending", label: "Pending first" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return (
    options.find((option) => option.value === value)?.label ??
    value.charAt(0).toUpperCase() + value.slice(1)
  );
}

/** Parses a `YYYY-MM-DD` due date as a local date (avoids UTC off-by-one). */
export function parseDueDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days from today until the due date (negative = overdue). */
export function daysUntil(value: string) {
  const diff = parseDueDate(value).getTime() - startOfToday().getTime();
  return Math.round(diff / 86_400_000);
}

export type DueStatus = "overdue" | "today" | "soon" | "later" | "done";

export function dueStatus(task: Task): DueStatus | null {
  if (!task.due_date) return null;
  if (task.completed) return "done";
  const days = daysUntil(task.due_date);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "soon";
  return "later";
}

export function isOverdue(task: Task) {
  return dueStatus(task) === "overdue";
}

export function formatDueDate(value: string) {
  const date = parseDueDate(value);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** Short relative description, e.g. "Due today", "2 days overdue". */
export function relativeDue(value: string) {
  const days = daysUntil(value);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days < 0) return `${-days} days overdue`;
  return `Due in ${days} days`;
}

function createdTime(task: Task) {
  return task.created_at ? new Date(task.created_at).getTime() : task.id;
}

export function sortTasks(tasks: Task[], sort: SortOption) {
  const sorted = [...tasks];
  const newest = (a: Task, b: Task) => createdTime(b) - createdTime(a);

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => createdTime(a) - createdTime(b));
    case "priority":
      return sorted.sort(
        (a, b) =>
          (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3) ||
          newest(a, b)
      );
    case "due":
      // Tasks without a due date go last.
      return sorted.sort((a, b) => {
        if (!a.due_date && !b.due_date) return newest(a, b);
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return (
          parseDueDate(a.due_date).getTime() -
            parseDueDate(b.due_date).getTime() || newest(a, b)
        );
      });
    case "completed":
      return sorted.sort(
        (a, b) => Number(b.completed) - Number(a.completed) || newest(a, b)
      );
    case "pending":
      return sorted.sort(
        (a, b) => Number(a.completed) - Number(b.completed) || newest(a, b)
      );
    default:
      return sorted.sort(newest);
  }
}

/** Loads all tasks, newest first (same query both pages used before). */
export function fetchAllTasks() {
  return supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
}

export type TasksResult = Awaited<ReturnType<typeof fetchAllTasks>>;
