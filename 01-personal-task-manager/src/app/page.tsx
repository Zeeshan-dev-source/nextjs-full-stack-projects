"use client";

import { useEffect, useMemo, useRef, useState, type SubmitEvent } from "react";
import { supabase } from "./lib/supabase";
import {
  CATEGORIES,
  PRIORITIES,
  SORT_OPTIONS,
  fetchAllTasks,
  isOverdue,
  labelFor,
  sortTasks,
  type SortOption,
  type TasksResult,
  type Task,
} from "./lib/tasks";
import { useToast } from "./components/Toast";
import ConfirmDialog from "./components/ConfirmDialog";
import {
  CategoryBadge,
  DueBadge,
  PRIORITY_STYLES,
  PriorityBadge,
} from "./components/TaskBadges";
import {
  EmptyState,
  ErrorState,
  Skeleton,
  cardClass,
  inputClass,
} from "./components/UI";
import {
  AlertIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ListIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SortIcon,
  TrashIcon,
  XIcon,
} from "./components/Icons";

type StatusFilter = "all" | "pending" | "completed";

const DEFAULT_PRIORITY = "medium";
const DEFAULT_CATEGORY = "personal";

export default function Home() {
  const showToast = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Filters & sorting (frontend-only, applied to loaded tasks)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  // Row-level busy state & delete confirmation
  const [togglingIds, setTogglingIds] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  function applyFetchResult({ data, error }: TasksResult) {
    setLoading(false);

    if (error) {
      console.error("Error fetching tasks:", error);
      setLoadError("We couldn't load your tasks. Check your connection and try again.");
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

  function resetForm() {
    setTask("");
    setEditingId(null);
    setPriority(DEFAULT_PRIORITY);
    setCategory(DEFAULT_CATEGORY);
    setDueDate("");
  }

  async function addTask() {
    if (!task.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: task.trim(),
          completed: false,
          priority: priority,
          category: category,
          due_date: dueDate || null,
        },
      ])
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Error adding task:", error);
      showToast("error", "Couldn't add the task. Please try again.");
      return;
    }

    setTasks((currentTasks) => [data, ...currentTasks]);
    resetForm();
    showToast("success", "Task added.");
  }

  function editTask(id: number) {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    setTask(selectedTask.title);
    setEditingId(id);
    setPriority(selectedTask.priority);
    setCategory(selectedTask.category);
    setDueDate(selectedTask.due_date || "");

    // On small screens the form is above the list — bring it into view.
    titleInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    titleInputRef.current?.focus({ preventScroll: true });
  }

  async function updateTask() {
    if (!task.trim() || editingId === null) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: task.trim(),
        priority: priority,
        category: category,
        due_date: dueDate || null,
      })
      .eq("id", editingId)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Error updating task:", error);
      showToast("error", "Couldn't save your changes. Please try again.");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) => (item.id === editingId ? data : item))
    );

    resetForm();
    showToast("success", "Task updated.");
  }

  async function deleteTask(id: number) {
    setDeleting(true);

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    setDeleting(false);

    if (error) {
      console.error("Error deleting task:", error);
      showToast("error", "Couldn't delete the task. Please try again.");
      return;
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    if (editingId === id) resetForm();
    setDeleteTarget(null);
    showToast("success", "Task deleted.");
  }

  async function toggleTask(id: number) {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask || togglingIds.includes(id)) return;
    setTogglingIds((ids) => [...ids, id]);

    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !selectedTask.completed,
      })
      .eq("id", id)
      .select()
      .single();

    setTogglingIds((ids) => ids.filter((item) => item !== id));

    if (error) {
      console.error("Error updating task status:", error);
      showToast("error", "Couldn't update the task status. Please try again.");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? data : task))
    );
    showToast(
      data.completed ? "success" : "info",
      data.completed ? "Task marked as complete." : "Task moved back to pending."
    );
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (saving) return;
    if (editingId !== null) {
      updateTask();
    } else {
      addTask();
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = tasks.length - completedTasks;
  const overdueTasks = tasks.filter(isOverdue).length;

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) &&
        (statusFilter === "all" ||
          (statusFilter === "completed" ? task.completed : !task.completed)) &&
        (priorityFilter === "all" || task.priority === priorityFilter) &&
        (categoryFilter === "all" || task.category === categoryFilter)
    );
    return sortTasks(filtered, sort);
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter, sort]);

  const activeFilters = [
    search.trim() && {
      key: "search",
      label: `“${search.trim()}”`,
      clear: () => setSearch(""),
    },
    statusFilter !== "all" && {
      key: "status",
      label: statusFilter === "completed" ? "Completed" : "Pending",
      clear: () => setStatusFilter("all"),
    },
    priorityFilter !== "all" && {
      key: "priority",
      label: `${labelFor(PRIORITIES, priorityFilter)} priority`,
      clear: () => setPriorityFilter("all"),
    },
    categoryFilter !== "all" && {
      key: "category",
      label: labelFor(CATEGORIES, categoryFilter),
      clear: () => setCategoryFilter("all"),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  }

  const isEditing = editingId !== null;

  const stats = [
    { label: "Total tasks", value: tasks.length, Icon: ListIcon, tone: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10" },
    { label: "Completed", value: completedTasks, Icon: CheckCircleIcon, tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" },
    { label: "Pending", value: remainingTasks, Icon: ClockIcon, tone: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" },
    { label: "Overdue", value: overdueTasks, Icon: AlertIcon, tone: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10" },
  ];

  const statusTabs: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: tasks.length },
    { value: "pending", label: "Pending", count: remainingTasks },
    { value: "completed", label: "Completed", count: completedTasks },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          My Tasks
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
          Organize your work and keep track of your daily tasks.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <div key={label} className={`${cardClass} flex items-center gap-3 p-4`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                {label}
              </p>
              {loading ? (
                <Skeleton className="mt-1 h-6 w-8" />
              ) : (
                <p className="text-xl font-bold text-slate-900 tabular-nums dark:text-white">
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* Add / Edit form */}
        <section
          className={`${cardClass} p-5 lg:sticky lg:top-24 ${
            isEditing ? "ring-2 ring-blue-500/40" : ""
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isEditing ? "Edit task" : "Add new task"}
            </h2>
            {isEditing && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>
              <input
                id="task-title"
                ref={titleInputRef}
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && isEditing) resetForm();
                }}
                placeholder="What do you need to accomplish?"
                className={inputClass}
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </span>
              <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-2">
                {[...PRIORITIES].reverse().map((option) => {
                  const selected = priority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPriority(option.value)}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_STYLES[option.value].dot}`} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label htmlFor="task-category" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  id="task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="task-due" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Due date <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="task-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`${inputClass} ${dueDate ? "pr-9" : ""}`}
                  />
                  {dueDate && (
                    <button
                      type="button"
                      onClick={() => setDueDate("")}
                      aria-label="Clear due date"
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving || !task.trim()}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
              >
                {isEditing ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                {saving
                  ? isEditing
                    ? "Saving…"
                    : "Adding…"
                  : isEditing
                    ? "Save changes"
                    : "Add task"}
              </button>
            </div>
          </form>
        </section>

        {/* Task list */}
        <section className={`${cardClass} min-w-0 p-4 sm:p-5`}>
          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your tasks..."
                aria-label="Search tasks"
                className={`${inputClass} pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex rounded-lg bg-slate-100 p-1 sm:self-start dark:bg-slate-800/70" role="tablist" aria-label="Filter by status">
                {statusTabs.map((tab) => {
                  const active = statusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setStatusFilter(tab.value)}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium whitespace-nowrap transition sm:flex-none sm:gap-1.5 sm:px-3 ${
                        active
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {tab.label}
                      <span className="hidden rounded bg-slate-200/70 px-1.5 text-xs min-[360px]:inline text-slate-600 tabular-nums dark:bg-slate-700 dark:text-slate-300">
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  aria-label="Filter by priority"
                  className={`${inputClass} cursor-pointer py-2 ${priorityFilter !== "all" ? "border-blue-500 dark:border-blue-400" : ""}`}
                >
                  <option value="all">All priorities</option>
                  {PRIORITIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} priority
                    </option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter by category"
                  className={`${inputClass} cursor-pointer py-2 ${categoryFilter !== "all" ? "border-blue-500 dark:border-blue-400" : ""}`}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <SortIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    aria-label="Sort tasks"
                    className={`${inputClass} cursor-pointer py-2 pl-9`}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Filters:
                </span>
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={filter.clear}
                    aria-label={`Remove filter ${filter.label}`}
                    className="inline-flex max-w-full cursor-pointer items-center gap-1 rounded-full bg-blue-50 py-1 pr-1.5 pl-2.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition ring-inset hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30 dark:hover:bg-blue-500/20"
                  >
                    <span className="truncate">{filter.label}</span>
                    <XIcon className="h-3 w-3 shrink-0" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="my-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Your tasks
            </h2>
            {!loading && tasks.length > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing {visibleTasks.length} of {tasks.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-3/5" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <ErrorState message={loadError} onRetry={retryFetch} />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={<CheckIcon className="h-5 w-5" />}
              title="No tasks yet"
              description="Add your first task with the form to start organizing your day."
              action={
                <button
                  type="button"
                  onClick={() => titleInputRef.current?.focus()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create a task
                </button>
              }
            />
          ) : visibleTasks.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-5 w-5" />}
              title="No matching tasks"
              description={
                search.trim()
                  ? `Nothing matches “${search.trim()}” with the current filters. Try a different search or clear the filters.`
                  : "No tasks match the current filters. Try adjusting or clearing them."
              }
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <ul className="space-y-2.5">
              {visibleTasks.map((task) => {
                const toggling = togglingIds.includes(task.id);
                const beingEdited = editingId === task.id;
                return (
                  <li
                    key={task.id}
                    className={`group relative flex items-start gap-3 overflow-hidden rounded-xl border p-3.5 transition sm:p-4 ${
                      beingEdited
                        ? "border-blue-400 bg-blue-50/50 dark:border-blue-500/60 dark:bg-blue-500/5"
                        : task.completed
                          ? "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Priority accent */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-1 ${
                        task.completed ? "bg-emerald-500/60" : PRIORITY_STYLES[task.priority]?.dot ?? "bg-slate-300"
                      }`}
                    />

                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={task.completed ? `Mark “${task.title}” as pending` : `Mark “${task.title}” as complete`}
                      onClick={() => toggleTask(task.id)}
                      disabled={toggling}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:focus-visible:ring-offset-slate-900 ${
                        task.completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-600"
                      }`}
                    >
                      <CheckIcon className="h-3 w-3" strokeWidth={3.5} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium break-words sm:text-[15px] ${
                          task.completed
                            ? "text-slate-400 line-through decoration-slate-400/70 dark:text-slate-500"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className={`mt-2 flex flex-wrap gap-1.5 ${task.completed ? "opacity-70" : ""}`}>
                        <PriorityBadge priority={task.priority} />
                        <CategoryBadge category={task.category} />
                        <DueBadge task={task} />
                        {task.completed && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 ring-inset dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25">
                            <CheckIcon className="h-3 w-3" />
                            Done
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 transition sm:opacity-60 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => editTask(task.id)}
                        aria-label={`Edit “${task.title}”`}
                        title="Edit"
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(task)}
                        aria-label={`Delete “${task.title}”`}
                        title="Delete"
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this task?"
        description={
          <>
            <span className="font-medium text-slate-900 dark:text-slate-200">
              “{deleteTarget?.title}”
            </span>{" "}
            will be permanently removed. This can&apos;t be undone.
          </>
        }
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteTask(deleteTarget.id)}
      />
    </main>
  );
}
