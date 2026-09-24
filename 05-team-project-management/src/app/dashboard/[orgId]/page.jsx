"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function OrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId;

  const [projects, setProjects] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/projects`);

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
      setProjects(data.projects || []);
      setOrganization(data.organization);
      setMyRole(data.myRole);
    } catch {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, [orgId, router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch(`/api/organizations/${orgId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setCreating(false);
        return;
      }

      setName("");
      setDescription("");
      setShowForm(false);
      fetchProjects();
    } catch {
      setError("Could not create project");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setInviting(true);
    setInviteLink("");
    setCopied(false);

    try {
      const res = await fetch(`/api/organizations/${orgId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not send invitation");
        setInviting(false);
        return;
      }

      setInviteLink(data.inviteLink);
      setInviteEmail("");
    } catch {
      setError("Could not send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleCopyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const canCreateProject = myRole === "OWNER" || myRole === "ADMIN";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        orgId={orgId}
        orgName={organization?.name}
        myRole={myRole}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Organizations", href: "/dashboard" },
            { label: organization?.name || "Organization" },
            { label: "Projects" },
          ]}
          title={organization?.name || "Organization"}
          subtitle="View and manage projects, invite collaborators, and track sprint tasks"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {canCreateProject && (
                <button
                  onClick={() => {
                    setShowInviteForm(!showInviteForm);
                    setShowForm(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {showInviteForm ? "Close Invite" : "Invite Member"}
                </button>
              )}
              {canCreateProject && (
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setShowInviteForm(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                  </svg>
                  {showForm ? "Cancel" : "New Project"}
                </button>
              )}
            </div>
          }
        />

        {/* Sub-nav Tabs */}
        <div className="border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-10">
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap">
            <Link
              href={`/dashboard/${orgId}`}
              className="border-b-2 border-indigo-600 py-3 text-sm font-semibold text-indigo-600"
            >
              Projects ({projects.length})
            </Link>
            <Link
              href={`/dashboard/${orgId}/members`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Team Members
            </Link>
            <Link
              href={`/dashboard/${orgId}/reports`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
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

          {/* Invite Form Card */}
          {showInviteForm && (
            <div className="mb-6 sm:mb-8 rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Invite team member
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Generate an invitation link or email for a new collaborator to join {organization?.name}.
              </p>

              <form onSubmit={handleInvite} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={inviting}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {inviting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Generating link...</span>
                    </>
                  ) : (
                    "Create Invite Link"
                  )}
                </button>

                {inviteLink && (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-700">
                        Share this invitation link:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyInviteLink}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-slate-100 transition shadow-2xs"
                      >
                        {copied ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="break-all font-mono text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      {inviteLink}
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Create Project Form Card */}
          {showForm && (
            <div className="mb-6 sm:mb-8 rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Create a new project
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Projects house your Kanban board, tasks, and sprint goals.
              </p>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website Redesign, Mobile App v2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief objective of this project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
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
                    "Create Project"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl border border-slate-200/80 bg-white p-5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">No projects yet</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {canCreateProject
                  ? "Create your first project to start organizing tasks on a Kanban board."
                  : "An owner or administrator needs to create a project first."}
              </p>
              {canCreateProject && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/${orgId}/projects/${project.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="min-w-0 break-words text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                        {project.name}
                      </h2>
                      <span className="shrink-0 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {project._count.tasks} {project._count.tasks === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
                      Open Kanban Board
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