"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const roleBadges = {
  OWNER: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
  ADMIN: "bg-sky-50 text-sky-700 ring-sky-200/80",
  MEMBER: "bg-slate-100 text-slate-700 ring-slate-200/80",
  VIEWER: "bg-amber-50 text-amber-700 ring-amber-200/80",
};

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

export default function MembersPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId;

  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/members`);

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
      setMembers(data.members || []);
      setMyRole(data.myRole);
      setMyUserId(data.myUserId);
    } catch {
      setError("Could not load members");
    } finally {
      setLoading(false);
    }
  }, [orgId, router]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not update role");
        return;
      }

      fetchMembers();
    } catch {
      setError("Could not update role");
    }
  };

  const handleRemove = async (memberId, memberName) => {
    const confirmed = confirm(`Remove ${memberName} from this organization?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not remove member");
        return;
      }

      fetchMembers();
    } catch {
      setError("Could not remove member");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar orgId={orgId} myRole={myRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumbs={[
            { label: "Organizations", href: "/dashboard" },
            { label: "Organization", href: `/dashboard/${orgId}` },
            { label: "Team Members" },
          ]}
          title="Team Members"
          subtitle={`Manage team access, assign roles, and remove members (${members.length} members)`}
          actions={
            (myRole === "OWNER" || myRole === "ADMIN") && (
              <Link
                href={`/dashboard/${orgId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Invite Member
              </Link>
            )
          }
        />

        {/* Sub-nav Tabs */}
        <div className="border-b border-slate-200/80 bg-white px-6 sm:px-10">
          <div className="flex gap-6">
            <Link
              href={`/dashboard/${orgId}`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Projects
            </Link>
            <Link
              href={`/dashboard/${orgId}/members`}
              className="border-b-2 border-indigo-600 py-3 text-sm font-semibold text-indigo-600"
            >
              Team Members ({members.length})
            </Link>
            <Link
              href={`/dashboard/${orgId}/reports`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Reports & Analytics
            </Link>
          </div>
        </div>

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

          {/* Members Table / List */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Organization Roster
              </h2>
              <span className="text-xs text-slate-400">
                {members.length} {members.length === 1 ? "collaborator" : "collaborators"}
              </span>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-500">
                No members found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {members.map((m) => {
                  const isMe = m.userId === myUserId;
                  const isOwner = m.role === "OWNER";
                  const canChangeRole = myRole === "OWNER" && !isMe && !isOwner;
                  const canRemove = ["OWNER", "ADMIN"].includes(myRole) && !isMe && !isOwner;

                  return (
                    <div
                      key={m.id}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-700 to-indigo-800 text-white font-bold text-xs shadow-xs">
                          {getInitials(m.user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 flex items-center gap-2">
                            {m.user.name}
                            {isMe && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                You
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {m.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {canChangeRole ? (
                          <div className="relative">
                            <select
                              value={m.role}
                              onChange={(e) => handleRoleChange(m.id, e.target.value)}
                              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none transition cursor-pointer"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MEMBER">Member</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${roleBadges[m.role] || roleBadges.MEMBER}`}
                          >
                            {m.role}
                          </span>
                        )}

                        {canRemove && (
                          <button
                            onClick={() => handleRemove(m.id, m.user.name)}
                            className="inline-flex items-center gap-1 rounded-xl p-1.5 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Remove member"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}