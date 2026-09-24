"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AllProjectsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar orgId={orgId} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Workspace", href: "/dashboard" },
            { label: "All Projects" },
          ]}
          title="All Projects"
          subtitle="Projects across all your workspaces"
        />

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-white border border-slate-200/80 p-5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-sm font-semibold text-slate-700">No projects yet</p>
              <p className="mt-1 text-xs text-slate-500">Create a project inside an organization to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/${project.organizationId}/projects/${project.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                >
                  <div>
                    <h2 className="break-words text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {project.organization.name}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {project._count.tasks} {project._count.tasks !== 1 ? "tasks" : "task"}
                    </span>
                    <span className="font-semibold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
                      View Board
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}