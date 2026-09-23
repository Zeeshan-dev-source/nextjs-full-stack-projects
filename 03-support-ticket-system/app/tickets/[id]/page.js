"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import { useToast } from "../../components/ToastContext";
import {
  TicketIcon,
  ChevronLeftIcon,
  ClockIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  AlertCircleIcon,
  MessageSquareIcon,
} from "../../components/Icons";

export default function UserTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function loadTicketAndReplies() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userIsAdmin = profile?.role === "admin";
      setIsAdmin(userIsAdmin);

      // Fetch ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (ticketError || !ticketData) {
        console.error("Error loading ticket:", ticketError);
        setTicket(null);
        setLoading(false);
        return;
      }

      // Authorization check: User can view if they are the ticket owner OR if they are an admin
      if (!userIsAdmin && ticketData.user_id !== user.id) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setTicket(ticketData);

      // Fetch replies
      const { data: replyData, error: replyError } = await supabase
        .from("ticket_replies")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (replyError) {
        console.error("Error loading replies:", replyError);
      } else {
        setReplies(replyData || []);
      }

      setLoading(false);
    }

    if (id) {
      loadTicketAndReplies();
    }
  }, [id, router]);

  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyMessage.trim() || sending) return;

    setSending(true);

    try {
      const { data, error } = await supabase
        .from("ticket_replies")
        .insert({
          ticket_id: Number(id),
          user_id: currentUser.id,
          message: replyMessage.trim(),
        })
        .select()
        .single();

      if (error) {
        showToast(error.message, "error");
        setSending(false);
        return;
      }

      setReplies((prev) => [...prev, data]);
      setReplyMessage("");

      // A customer reply means the ticket needs staff attention again —
      // reopen it if it was resolved, or otherwise flag it as open.
      const reopenedStatus = "Open";
      if ((ticket.status || "").trim() !== reopenedStatus) {
        const { error: statusError } = await supabase
          .from("tickets")
          .update({ status: reopenedStatus })
          .eq("id", id);

        if (!statusError) {
          setTicket((prev) => ({ ...prev, status: reopenedStatus }));
        }
      }

      showToast("Reply posted successfully.", "success");
    } catch (err) {
      showToast("Failed to post reply. Please try again.", "error");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Loading ticket #{id}...
          </p>
        </main>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-4">
            <AlertCircleIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Access Restricted
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
            You do not have permission to view this ticket. This ticket belongs to a different account.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Back to My Dashboard
          </Link>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mb-4">
            <TicketIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Ticket Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            The requested ticket does not exist or has been removed.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumbs & Admin Switch */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {isAdmin && (
            <Link
              href={`/admin/tickets/${ticket.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
            >
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Open in Admin Console</span>
            </Link>
          )}
        </div>

        {/* Ticket Header Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-200/60 dark:border-indigo-900/60">
                  Ticket #{ticket.id}
                </span>
                <StatusBadge status={ticket.status} size="md" />
                <PriorityBadge priority={ticket.priority} size="md" />
              </div>
              <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ticket.subject}
              </h1>
            </div>

            <div className="text-xs text-zinc-400 dark:text-zinc-500 sm:text-right">
              <span className="flex items-center sm:justify-end gap-1">
                <ClockIcon className="w-3.5 h-3.5" />
                Created {new Date(ticket.created_at).toLocaleDateString()}
              </span>
              <p className="mt-0.5">
                {new Date(ticket.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Initial Ticket Description */}
          <div className="pt-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {ticket.user_id === currentUser.id ? "You (Ticket Author)" : "Customer"}
                </span>
                <span className="text-[11px] text-zinc-400 ml-2">Original Request</span>
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-5 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>
          </div>
        </div>

        {/* Conversation Thread Feed */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Conversation Thread</span>
              <span className="text-xs font-normal text-zinc-400">
                ({replies.length} {replies.length === 1 ? "reply" : "replies"})
              </span>
            </h2>
          </div>

          {replies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              No replies yet. Support staff will respond to your request here.
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((item) => {
                const isTicketOwner = item.user_id === ticket.user_id;
                const isMe = item.user_id === currentUser.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 transition ${
                      !isTicketOwner
                        ? "border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            !isTicketOwner
                              ? "bg-indigo-600 text-white"
                              : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {!isTicketOwner ? <ShieldCheckIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {!isTicketOwner ? "Support Staff" : isMe ? "You" : "Customer"}
                          </span>
                          {!isTicketOwner && (
                            <span className="ml-2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300 px-1.5 py-0.2 text-[10px] font-bold uppercase">
                              Staff
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] text-zinc-400">
                        {new Date(item.created_at).toLocaleDateString()} at{" "}
                        {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                      {item.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reply Box */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
              Add a Reply
            </h3>

            <form onSubmit={handleSendReply}>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message to support engineers..."
                rows={4}
                required
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 p-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y leading-relaxed"
              />

              <div className="mt-3 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sending ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Sending Reply...</span>
                    </>
                  ) : (
                    <span>Post Reply</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}