"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const priorityConfig = {
  LOW: {
    badge: "bg-slate-100 text-slate-700 ring-slate-200/80",
    dot: "bg-slate-400",
  },
  MEDIUM: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200/80",
    dot: "bg-amber-500",
  },
  HIGH: {
    badge: "bg-rose-50 text-rose-700 ring-rose-200/80",
    dot: "bg-rose-500",
  },
};

const statusBadges = {
  TODO: "bg-slate-100 text-slate-700 ring-slate-200/80",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
  DONE: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
};

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function AllTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      setError("Could not load assigned tasks");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Workspace", href: "/dashboard" },
            { label: "My Tasks" },
          ]}
          title="My Assigned Tasks"
          subtitle="All tasks currently assigned to you across all workspaces"
        />

        <main className="flex-1 px-6 py-8 sm:px-10 max-w-5xl w-full">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200/80 p-4 text-sm text-rose-700">
              <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white border border-slate-200/80 p-4 animate-pulse" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">No tasks assigned to you</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Tasks assigned to your profile in any project will appear here for centralized tracking.
              </p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Browse Organizations
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

                return (
                  <Link
                    key={task.id}
                    href={`/dashboard/${task.project.organizationId}/projects/${task.project.id}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                        {task.title}
                      </h2>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-600">
                          {task.project.organization.name}
                        </span>
                        <span>•</span>
                        <span>{task.project.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${priority.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                        {task.priority}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusBadges[task.status] || statusBadges.TODO}`}
                      >
                        {statusLabels[task.status] || task.status}
                      </span>
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}