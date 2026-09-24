"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  PRIORITIES,
  fetchAllTasks,
  isOverdue,
  parseDueDate,
  relativeDue,
  sortTasks,
  type Task,
  type TasksResult,
} from "../lib/tasks";
import {
  CategoryBadge,
  DueBadge,
  PRIORITY_STYLES,
  PriorityBadge,
} from "../components/TaskBadges";
import { EmptyState, ErrorState, Skeleton, cardClass } from "../components/UI";
import {
  AlertIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
  ListIcon,
  PlusIcon,
  TagIcon,
} from "../components/Icons";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  function applyFetchResult({ data, error }: TasksResult) {
    setLoading(false);

    if (error) {
      console.error("Error fetching dashboard tasks:", error);
      setLoadError("We couldn't load your dashboard. Check your connection and try again.");
      return;
    }

    setTasks(data || []);
  }

  useEffect(() => {
    fetchAllTasks().then(applyFetchResult);
  }, []);

  function retryFetch() {
    setLoading(true);
    setLoadError(null);
    fetchAllTasks().then(applyFetchResult);
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(isOverdue).length;
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const priorityBreakdown = PRIORITIES.map((option) => {
    const matching = tasks.filter((task) => task.priority === option.value);
    return {
      ...option,
      count: matching.length,
      done: matching.filter((task) => task.completed).length,
    };
  });

  const categoryBreakdown = CATEGORIES.map((option) => {
    const matching = tasks.filter((task) => task.category === option.value);
    return {
      ...option,
      count: matching.length,
      done: matching.filter((task) => task.completed).length,
    };
  });

  // Pending tasks with a due date, soonest first (overdue ones surface at the top).
  const upcomingTasks = tasks
    .filter((task) => task.due_date && !task.completed)
    .sort(
      (a, b) =>
        parseDueDate(a.due_date!).getTime() - parseDueDate(b.due_date!).getTime()
    )
    .slice(0, 5);

  const recentTasks = sortTasks(tasks, "newest").slice(0, 5);

  const stats = [
    {
      label: "Total tasks",
      value: totalTasks,
      hint: `${pendingTasks} still open`,
      Icon: ListIcon,
      tone: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
    },
    {
      label: "Completed",
      value: completedTasks,
      hint: `${completionPercentage}% of all tasks`,
      Icon: CheckCircleIcon,
      tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: pendingTasks,
      hint: `${totalTasks === 0 ? 0 : 100 - completionPercentage}% of all tasks`,
      Icon: ClockIcon,
      tone: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      hint: overdueTasks === 0 ? "You're on track" : "Need attention",
      Icon: AlertIcon,
      tone: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
            Track your task progress and productivity.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          Manage tasks
        </Link>
      </div>

      {loadError ? (
        <ErrorState message={loadError} onRetry={retryFetch} />
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, hint, Icon, tone }) => (
              <div key={label} className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                    {label}
                  </p>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                {loading ? (
                  <>
                    <Skeleton className="mt-2 h-8 w-12" />
                    <Skeleton className="mt-2 h-3 w-20" />
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums sm:text-3xl dark:text-white">
                      {value}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {hint}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Overall progress */}
            <Card title="Overall progress" Icon={CheckCircleIcon}>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900 tabular-nums dark:text-white">
                      {completionPercentage}%
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">complete</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={completionPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Overall completion"
                    className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700 dark:bg-blue-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <dt className="text-xs text-slate-500 dark:text-slate-400">Completed</dt>
                      <dd className="text-lg font-semibold text-slate-900 tabular-nums dark:text-white">{completedTasks}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 dark:text-slate-400">Remaining</dt>
                      <dd className="text-lg font-semibold text-slate-900 tabular-nums dark:text-white">{pendingTasks}</dd>
                    </div>
                  </dl>
                </>
              )}
            </Card>

            {/* Priority breakdown */}
            <Card title="Priority breakdown" Icon={FlagIcon}>
              <BreakdownList
                loading={loading}
                total={totalTasks}
                rows={priorityBreakdown.map((row) => ({
                  ...row,
                  marker: PRIORITY_STYLES[row.value].dot,
                  bar: PRIORITY_STYLES[row.value].dot,
                }))}
              />
            </Card>

            {/* Category breakdown */}
            <Card title="Category breakdown" Icon={TagIcon}>
              <BreakdownList
                loading={loading}
                total={totalTasks}
                rows={categoryBreakdown.map((row) => ({
                  ...row,
                  bar: "bg-blue-600 dark:bg-blue-500",
                }))}
              />
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming due dates */}
            <Card
              title="Upcoming due dates"
              subtitle="Open tasks with a due date, soonest first."
              Icon={CalendarIcon}
            >
              {loading ? (
                <ListSkeleton />
              ) : upcomingTasks.length === 0 ? (
                <EmptyState
                  compact
                  icon={<CalendarIcon className="h-5 w-5" />}
                  title="No upcoming due dates"
                  description={
                    totalTasks === 0
                      ? "Create a task and give it a due date to see it here."
                      : "None of your open tasks have a due date. Edit a task to add one."
                  }
                  action={<GoToTasks label={totalTasks === 0 ? "Create a task" : "Go to tasks"} />}
                />
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {upcomingTasks.map((task) => {
                    const overdue = isOverdue(task);
                    return (
                      <li key={task.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            overdue
                              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {overdue ? <AlertIcon className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium break-words text-slate-900 dark:text-slate-100">
                            {task.title}
                          </p>
                          <p
                            className={`mt-0.5 text-xs ${
                              overdue ? "font-medium text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {relativeDue(task.due_date!)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <DueBadge task={task} />
                            <PriorityBadge priority={task.priority} />
                            <CategoryBadge category={task.category} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* Recent tasks */}
            <Card
              title="Recent tasks"
              subtitle="Your most recently created tasks."
              Icon={ClockIcon}
            >
              {loading ? (
                <ListSkeleton />
              ) : recentTasks.length === 0 ? (
                <EmptyState
                  compact
                  icon={<ListIcon className="h-5 w-5" />}
                  title="No recent tasks"
                  description="Tasks you create will show up here. Add your first one to get started."
                  action={<GoToTasks label="Create a task" />}
                />
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentTasks.map((task) => (
                    <li key={task.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                        aria-label={task.completed ? "Completed" : "Pending"}
                        role="img"
                      >
                        {task.completed && <CheckIcon className="h-3 w-3" strokeWidth={3.5} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium break-words ${
                              task.completed
                                ? "text-slate-400 line-through dark:text-slate-500"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {task.title}
                          </p>
                          <span
                            className={`shrink-0 text-xs font-medium ${
                              task.completed
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                        <div className={`mt-2 flex flex-wrap gap-1.5 ${task.completed ? "opacity-70" : ""}`}>
                          <PriorityBadge priority={task.priority} />
                          <CategoryBadge category={task.category} />
                          <DueBadge task={task} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({
  title,
  subtitle,
  Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  Icon: typeof ListIcon;
  children: ReactNode;
}) {
  return (
    <section className={`${cardClass} min-w-0 p-5 sm:p-6`}>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function BreakdownList({
  rows,
  total,
  loading,
}: {
  rows: { value: string; label: string; count: number; done: number; bar: string; marker?: string }[];
  total: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.value} className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const share = total === 0 ? 0 : Math.round((row.count / total) * 100);
        return (
          <li key={row.value} title={`${row.label}: ${row.count} tasks (${share}%), ${row.done} completed`}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                {row.marker && <span className={`h-2 w-2 shrink-0 rounded-full ${row.marker}`} />}
                <span className="truncate">{row.label}</span>
              </span>
              <span className="shrink-0 text-slate-500 tabular-nums dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{row.count}</span>
                {row.count > 0 && <span className="text-xs"> · {row.done} done</span>}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${row.bar}`}
                style={{ width: `${share}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GoToTasks({ label }: { label: string }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      <PlusIcon className="h-4 w-4" />
      {label}
    </Link>
  );
}
