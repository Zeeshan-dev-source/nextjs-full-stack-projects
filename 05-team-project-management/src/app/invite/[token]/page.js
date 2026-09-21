"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [invitation, setInvitation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  const fetchInvite = useCallback(async () => {
    try {
      const res = await fetch(`/api/invitations/${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "This invitation is invalid or has expired.");
        setLoading(false);
        return;
      }

      setInvitation(data.invitation);
      setCurrentUser(data.currentUser);
      setIsAlreadyMember(data.isAlreadyMember);
    } catch {
      setError("Could not load invitation details.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInvite();
  }, [fetchInvite]);

  const handleAccept = async () => {
    setAccepting(true);
    setError("");

    try {
      const res = await fetch(`/api/invitations/${token}`, { method: "POST" });
      const data = await res.json();

      if (res.status === 401) {
        router.push(`/login?redirect=/invite/${token}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not accept invitation.");
        setAccepting(false);
        return;
      }

      router.push(`/dashboard/${data.organizationId}`);
    } catch {
      setError("An unexpected error occurred while accepting the invitation.");
      setAccepting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-200 text-white font-bold mb-3">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workspace Invitation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Join your team on TeamFlow
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm text-center">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <svg className="w-6 h-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Loading invitation details...</p>
            </div>
          ) : error ? (
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Invitation Notice</h2>
              <p className="text-sm text-slate-500 mb-6">{error}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xl mb-4">
                {invitation.organization.name.slice(0, 2).toUpperCase()}
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Join {invitation.organization.name}
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                <strong className="text-slate-800 font-semibold">{invitation.invitedBy.name}</strong> has invited you to collaborate as a{" "}
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                  {invitation.role}
                </span>
              </p>

              {/* Recipient details box */}
              <div className="mb-5 rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Invitation sent to:</span>
                  <span className="font-semibold text-slate-800">{invitation.email}</span>
                </div>
                {currentUser && (
                  <div className="flex items-center justify-between text-slate-500 pt-1.5 border-t border-slate-200/60">
                    <span>Signed in as:</span>
                    <span className="font-semibold text-indigo-600">{currentUser.email}</span>
                  </div>
                )}
              </div>

              {isAlreadyMember ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium">
                    You are already a member of {invitation.organization.name}.
                  </div>
                  <Link
                    href={`/dashboard/${invitation.organizationId}`}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    Open Workspace
                  </Link>
                </div>
              ) : currentUser ? (
                <div className="space-y-3">
                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition"
                  >
                    {accepting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Joining workspace...</span>
                      </>
                    ) : (
                      `Accept Invitation & Join`
                    )}
                  </button>

                  <div className="pt-2 text-xs text-slate-400">
                    Want to use another account?{" "}
                    <Link
                      href={`/login?redirect=/invite/${token}`}
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      Switch account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 mb-2">
                    Please sign in or create an account to accept this invitation:
                  </p>
                  <Link
                    href={`/login?redirect=/invite/${token}`}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    Sign in to Accept
                  </Link>
                  <Link
                    href={`/signup?redirect=/invite/${token}`}
                    className="w-full inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Create New Account
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}