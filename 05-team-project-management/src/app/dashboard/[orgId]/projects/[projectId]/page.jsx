"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

const statusColumns = [
  {
    key: "TODO",
    label: "To Do",
    headerBg: "bg-slate-100/90 text-slate-800",
    columnBg: "bg-slate-100/50 border-slate-200/70",
    badgeBg: "bg-slate-200 text-slate-700",
    icon: (
      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    headerBg: "bg-indigo-50/90 text-indigo-900",
    columnBg: "bg-indigo-50/20 border-indigo-100/70",
    badgeBg: "bg-indigo-100 text-indigo-700",
    icon: (
      <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "DONE",
    label: "Done",
    headerBg: "bg-emerald-50/90 text-emerald-900",
    columnBg: "bg-emerald-50/20 border-emerald-100/70",
    badgeBg: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectTasksPage() {
  const router = useRouter();
  const params = useParams();
  const { orgId, projectId } = params;

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 404) {
        setError("Project not found");
        setLoading(false);
        return;
      }
      if (res.status === 403) {
        setError("You don't have access to this project");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTasks(data.tasks || []);
      setProject(data.project);
      setMyRole(data.myRole);
      setMembers(data.members || []);
    } catch {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          assigneeId: assigneeId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setCreating(false);
        return;
      }

      setTitle("");
      setAssigneeId("");
      setPriority("MEDIUM");
      setShowForm(false);
      fetchTasks();
    } catch {
      setError("Could not create task");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not update task status");
        return;
      }

      fetchTasks();
    } catch {
      setError("Could not update task status");
    }
  };

  const handleEditTitle = async (taskId, currentTitle) => {
    const newTitle = prompt("Edit task title:", currentTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not update task");
        return;
      }

      fetchTasks();
    } catch {
      setError("Could not update task");
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    const confirmed = confirm(`Delete task "${taskTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not delete task");
        return;
      }

      fetchTasks();
    } catch {
      setError("Could not delete task");
    }
  };

  const canManageTasks = myRole === "OWNER" || myRole === "ADMIN";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        orgId={orgId}
        orgName={project?.organization?.name}
        myRole={myRole}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Organizations", href: "/dashboard" },
            { label: project?.organization?.name || "Organization", href: `/dashboard/${orgId}` },
            { label: project?.name || "Project" },
          ]}
          title={project?.name || "Project Kanban Board"}
          subtitle={`Interactive sprint board with ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/${orgId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
              </Link>
              {canManageTasks && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                  </svg>
                  {showForm ? "Cancel" : "New Task"}
                </button>
              )}
            </div>
          }
        />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 max-w-7xl w-full">
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

          {/* New Task Form Card */}
          {showForm && (
            <div className="mb-6 sm:mb-8 rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Create new task
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Add a task to the project board and assign it to a team member.
              </p>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Implement OAuth login with Google"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Assignee
                    </label>
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.user.id} value={m.user.id}>
                          {m.user.name} ({m.role.toLowerCase()})
                        </option>
                      ))}
                    </select>
                  </div>
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
                      <span>Creating task...</span>
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Kanban Columns */}
          {loading ? (
            <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl border border-slate-200/80 bg-white p-4 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-3 items-start">
              {statusColumns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.key);

                return (
                  <div
                    key={col.key}
                    className={`rounded-2xl border ${col.columnBg} p-3 flex flex-col min-w-0 min-h-[220px] md:min-h-[520px] transition`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl bg-white shadow-2xs border border-slate-200/70">
                      <div className="flex items-center gap-2">
                        {col.icon}
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          {col.label}
                        </h2>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Task Cards List */}
                    <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                      {columnTasks.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-center p-4 text-xs text-slate-400">
                          No tasks in {col.label.toLowerCase()}
                        </div>
                      ) : (
                        columnTasks.map((task) => {
                          const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

                          return (
                            <div
                              key={task.id}
                              className="group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition"
                            >
                              {/* Title & Delete Header */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3
                                  onClick={() =>
                                    canManageTasks && handleEditTitle(task.id, task.title)
                                  }
                                  title={canManageTasks ? "Click to edit title" : ""}
                                  className={`min-w-0 break-words text-sm font-semibold text-slate-900 leading-snug ${
                                    canManageTasks
                                      ? "cursor-pointer hover:text-indigo-600 transition"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </h3>

                                {canManageTasks && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTask(task.id, task.title);
                                    }}
                                    title="Delete task"
                                    className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Priority & Assignee Meta */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 mb-3 border-t border-slate-100">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${priority.badge}`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                                  {task.priority}
                                </span>

                                {task.assignee ? (
                                  <div
                                    className="flex items-center gap-1.5 text-xs text-slate-600 min-w-0"
                                    title={task.assignee.name}
                                  >
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700">
                                      {getInitials(task.assignee.name)}
                                    </div>
                                    <span className="truncate max-w-[90px]">
                                      {task.assignee.name}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">
                                    Unassigned
                                  </span>
                                )}
                              </div>

                              {/* Status Transition Dropdown */}
                              {myRole !== "VIEWER" && ( /* Status change allowed for MEMBER */
                                <div className="relative">
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
                                  >
                                    <option value="TODO">Move to: To Do</option>
                                    <option value="IN_PROGRESS">Move to: In Progress</option>
                                    <option value="DONE">Move to: Done</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}