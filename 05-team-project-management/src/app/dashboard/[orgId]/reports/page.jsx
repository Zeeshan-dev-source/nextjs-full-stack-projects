"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ReportsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/stats`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403) {
        setError("You don't have access to this organization");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch {
      setError("Could not load organization statistics");
    } finally {
      setLoading(false);
    }
  }, [orgId, router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar orgId={orgId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Organizations", href: "/dashboard" },
            { label: "Organization", href: `/dashboard/${orgId}` },
            { label: "Reports & Analytics" },
          ]}
          title="Organization Analytics"
          subtitle="Real-time performance metrics, task distribution, and project completion rates"
        />

        {/* Sub-nav Tabs */}
        <div className="border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-10">
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap">
            <Link
              href={`/dashboard/${orgId}`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Projects
            </Link>
            <Link
              href={`/dashboard/${orgId}/members`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Team Members
            </Link>
            <Link
              href={`/dashboard/${orgId}/reports`}
              className="border-b-2 border-indigo-600 py-3 text-sm font-semibold text-indigo-600"
            >
              Reports & Analytics
            </Link>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 max-w-6xl w-full">
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200/80 p-5 animate-pulse" />
                ))}
              </div>
              <div className="h-44 rounded-2xl bg-white border border-slate-200/80 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white border border-slate-200/80 animate-pulse" />
            </div>
          ) : !stats ? null : (
            <div className="space-y-8">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {/* Total Projects */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">{stats.totalProjects}</p>
                  </div>
                </div>

                {/* Team Members */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 font-bold">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">Members</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">{stats.totalMembers}</p>
                  </div>
                </div>

                {/* Total Tasks */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 font-bold">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tasks</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">{stats.totalTasks}</p>
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${stats.overdueTasks > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"} font-bold`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">Overdue</p>
                    <p className={`text-2xl font-bold tracking-tight mt-0.5 ${stats.overdueTasks > 0 ? "text-rose-600" : "text-slate-900"}`}>
                      {stats.overdueTasks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Status Breakdown Bar */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Task Status Breakdown</h2>
                    <p className="text-xs text-slate-500">Distribution of all tasks across workflow stages</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-semibold text-slate-400">Overall Progress:</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/80">
                      {stats.completionRate}% Complete
                    </span>
                  </div>
                </div>

                {stats.totalTasks === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No tasks recorded in this organization.</p>
                ) : (
                  <>
                    <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 gap-0.5">
                      {stats.statusCounts.TODO > 0 && (
                        <div
                          className="h-full rounded-l-full bg-slate-400 transition-all"
                          style={{ width: `${(stats.statusCounts.TODO / stats.totalTasks) * 100}%` }}
                          title={`To Do: ${stats.statusCounts.TODO}`}
                        />
                      )}
                      {stats.statusCounts.IN_PROGRESS > 0 && (
                        <div
                          className="h-full bg-indigo-500 transition-all"
                          style={{ width: `${(stats.statusCounts.IN_PROGRESS / stats.totalTasks) * 100}%` }}
                          title={`In Progress: ${stats.statusCounts.IN_PROGRESS}`}
                        />
                      )}
                      {stats.statusCounts.DONE > 0 && (
                        <div
                          className="h-full rounded-r-full bg-emerald-500 transition-all"
                          style={{ width: `${(stats.statusCounts.DONE / stats.totalTasks) * 100}%` }}
                          title={`Done: ${stats.statusCounts.DONE}`}
                        />
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                        <span className="text-slate-600 font-medium">To Do:</span>
                        <span className="font-bold text-slate-900">{stats.statusCounts.TODO}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                        <span className="text-slate-600 font-medium">In Progress:</span>
                        <span className="font-bold text-slate-900">{stats.statusCounts.IN_PROGRESS}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 font-medium">Done:</span>
                        <span className="font-bold text-slate-900">{stats.statusCounts.DONE}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Per-Project Progress */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
                <div className="mb-6 flex items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Project Progress Overview</h2>
                    <p className="text-xs text-slate-500">Completion rate per active project</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 font-medium">
                    {stats.projectStats.length} {stats.projectStats.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                {stats.projectStats.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No projects in this organization.</p>
                ) : (
                  <div className="space-y-5">
                    {stats.projectStats.map((p) => (
                      <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4">
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
                          <Link
                            href={`/dashboard/${orgId}/projects/${p.id}`}
                            className="min-w-0 break-words text-sm font-semibold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1.5"
                          >
                            {p.name}
                            <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-slate-500">
                              {p.doneTasks} of {p.totalTasks} tasks done
                            </span>
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200/80">
                              {p.completionRate}%
                            </span>
                          </div>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${p.completionRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}