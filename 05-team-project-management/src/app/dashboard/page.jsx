"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const roleBadges = {
  OWNER: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
  ADMIN: "bg-sky-50 text-sky-700 ring-sky-200/80",
  MEMBER: "bg-slate-100 text-slate-700 ring-slate-200/80",
  VIEWER: "bg-amber-50 text-amber-700 ring-amber-200/80",
};

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await fetch("/api/organizations");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setOrganizations(data.organizations || []);
    } catch {
      setError("Could not load organizations");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setCreating(false);
        return;
      }
      setNewOrgName("");
      setShowForm(false);
      fetchOrganizations();
    } catch {
      setError("Could not create organization");
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async (orgId, currentName) => {
    const newName = prompt("New organization name:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;

    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not rename organization");
        return;
      }

      fetchOrganizations();
    } catch {
      setError("Could not rename organization");
    }
  };

  const handleDelete = async (orgId, orgName) => {
    const confirmed = confirm(
      `Delete "${orgName}"? This will permanently delete all its projects and tasks. This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not delete organization");
        return;
      }

      fetchOrganizations();
    } catch {
      setError("Could not delete organization");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[{ label: "Workspace", href: "/dashboard" }, { label: "Organizations" }]}
          title="Organizations"
          subtitle="Manage your organizations, create new workspaces, and collaborate with your teams"
          actions={
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
              {showForm ? "Cancel" : "New Organization"}
            </button>
          }
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

          {/* Create Org Form Card */}
          {showForm && (
            <div className="mb-6 sm:mb-8 rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Create a new organization
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Organizations let you manage projects, invite team members, and track work together.
              </p>

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organization Name
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Acme Studio, Marketing Dept"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      required
                      autoFocus
                      className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={creating}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {creating ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Creating...</span>
                        </>
                      ) : (
                        "Create Organization"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 rounded-2xl border border-slate-200/80 bg-white p-5 animate-pulse" />
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">No organizations found</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Create your first organization to organize projects, invite teammates, and manage Kanban tasks.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create First Organization
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                >
                  <Link
                    href={`/dashboard/${org.id}`}
                    className="flex items-start gap-3.5 mb-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-sm font-bold text-white shadow-sm group-hover:from-indigo-600 group-hover:to-violet-600 transition-all">
                      {initials(org.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                        {org.name}
                      </h2>
                      <span
                        className={`mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${roleBadges[org.myRole] || roleBadges.MEMBER}`}
                      >
                        {org.myRole}
                      </span>
                    </div>
                  </Link>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/dashboard/${org.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                      Open Workspace
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <div className="flex items-center gap-1">
                      {(org.myRole === "OWNER" || org.myRole === "ADMIN") && (
                        <button
                          onClick={() => handleRename(org.id, org.name)}
                          title="Rename organization"
                          className="rounded-lg p-1.5 text-xs font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                      {org.myRole === "OWNER" && (
                        <button
                          onClick={() => handleDelete(org.id, org.name)}
                          title="Delete organization"
                          className="rounded-lg p-1.5 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}