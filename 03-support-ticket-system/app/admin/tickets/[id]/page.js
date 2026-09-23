"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "../../../components/Navbar";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import { useToast } from "../../../components/ToastContext";
import {
  TicketIcon,
  ChevronLeftIcon,
  ClockIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  MessageSquareIcon,
} from "../../../components/Icons";

export default function AdminTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    async function checkAdminAndLoadTicket() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      // Check admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      // Load ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (ticketError || !ticketData) {
        console.error("Admin error loading ticket:", ticketError);
        setTicket(null);
        setLoading(false);
        return;
      }

      setTicket(ticketData);
      setStatus(ticketData.status || "Open");
      setPriority(ticketData.priority || "Medium");

      // Load replies
      const { data: replyData, error: replyError } = await supabase
        .from("ticket_replies")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (replyError) {
        console.error("Admin error loading replies:", replyError);
      } else {
        setReplies(replyData || []);
      }

      setLoading(false);
    }

    if (id) {
      checkAdminAndLoadTicket();
    }
  }, [id, router]);

  async function handleStatusChange(selectedStatus) {
    const targetStatus = selectedStatus || status;
    setUpdatingStatus(true);

    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: targetStatus })
        .eq("id", id);

      if (error) {
        showToast(error.message, "error");
        setUpdatingStatus(false);
        return;
      }

      setStatus(targetStatus);
      setTicket((prev) => ({ ...prev, status: targetStatus }));
      showToast(`Ticket status changed to "${targetStatus}".`, "success");
    } catch (err) {
      showToast("Failed to update ticket status.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handlePriorityChange(selectedPriority) {
    const targetPriority = selectedPriority || priority;
    setUpdatingPriority(true);

    try {
      const { error } = await supabase
        .from("tickets")
        .update({ priority: targetPriority })
        .eq("id", id);

      if (error) {
        const message =
          error.code === "PGRST204"
            ? "Priority isn't set up in the database yet — ask an admin to run the priority column migration."
            : error.message;
        showToast(message, "error");
        setUpdatingPriority(false);
        return;
      }

      setPriority(targetPriority);
      setTicket((prev) => ({ ...prev, priority: targetPriority }));
      showToast(`Ticket priority changed to "${targetPriority}".`, "success");
    } catch (err) {
      showToast("Failed to update ticket priority.", "error");
    } finally {
      setUpdatingPriority(false);
    }
  }

  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyMessage.trim() || sendingReply) return;

    setSendingReply(true);

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
        setSendingReply(false);
        return;
      }

      setReplies((prev) => [...prev, data]);
      setReplyMessage("");

      // A staff reply means the ticket is now being actively worked —
      // move it out of "Open" unless it's already Resolved/In Progress.
      const workingStatus = "In Progress";
      if (status !== workingStatus) {
        const { error: statusError } = await supabase
          .from("tickets")
          .update({ status: workingStatus })
          .eq("id", id);

        if (!statusError) {
          setStatus(workingStatus);
          setTicket((prev) => ({ ...prev, status: workingStatus }));
        }
      }

      showToast("Admin reply dispatched to customer.", "success");
    } catch (err) {
      showToast("Failed to send admin reply.", "error");
    } finally {
      setSendingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Loading admin management view for ticket #{id}...
          </p>
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
            The requested ticket does not exist in the database.
          </p>
          <Link
            href="/admin"
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Return to Admin Queue
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to Admin Console</span>
          </Link>

          <Link
            href={`/tickets/${ticket.id}`}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View as Customer →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Workspace Column (Conversation & Details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Subject & Original Inquiry Card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 flex-wrap pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-200/60 dark:border-indigo-900/60">
                  Ticket #{ticket.id}
                </span>
                <StatusBadge status={ticket.status} size="md" />
                <PriorityBadge priority={ticket.priority} size="md" />
                <span className="text-xs text-zinc-400 ml-auto flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {new Date(ticket.created_at).toLocaleString()}
                </span>
              </div>

              <h1 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ticket.subject}
              </h1>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                  <span>Customer Inquiry Description:</span>
                </div>
                <div className="rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-5 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </div>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquareIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Ticket Conversation History ({replies.length})</span>
              </h2>

              {replies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No replies posted yet. Use the composer below to send the first response to the user.
                </div>
              ) : (
                <div className="space-y-4">
                  {replies.map((item) => {
                    const isStaff = item.user_id === currentUser.id || item.user_id !== ticket.user_id;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-5 transition ${
                          isStaff
                            ? "border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                isStaff
                                  ? "bg-indigo-600 text-white"
                                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {isStaff ? <ShieldCheckIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                {isStaff ? "Staff / Admin Response" : "Customer Reply"}
                              </span>
                              {isStaff && (
                                <span className="ml-2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300 px-1.5 py-0.2 text-[10px] font-bold uppercase">
                                  Official
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
            </div>

            {/* Admin Response Composer */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Send Staff Response to Customer
                </h3>
              </div>

              <form onSubmit={handleSendReply}>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Provide resolution steps, explanations, or questions for the customer..."
                  rows={5}
                  required
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 p-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y leading-relaxed"
                />

                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim()}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {sendingReply ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span>Sending Staff Reply...</span>
                      </>
                    ) : (
                      <span>Dispatch Reply</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Admin Management Controls */}
          <div className="space-y-6">
            {/* Status Management Panel */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Resolution Stage
              </h3>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Update Ticket Status:
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "Open", label: "Open (Needs Attention)" },
                    { id: "In Progress", label: "In Progress (Investigating)" },
                    { id: "Resolved", label: "Resolved (Issue Closed)" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(s.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition text-left ${
                        status === s.id
                          ? "border-indigo-500 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                          : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <span>{s.label}</span>
                      {status === s.id && <CheckCircleIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Management Panel */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Priority
              </h3>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Set Ticket Priority:
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      disabled={updatingPriority}
                      onClick={() => handlePriorityChange(p)}
                      className={`flex items-center justify-center px-2 py-2.5 rounded-xl text-xs font-semibold border transition ${
                        priority === p
                          ? "border-indigo-500 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ticket Metadata Panel */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Ticket Metadata
              </h3>

              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-zinc-400">Ticket ID</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    #{ticket.id}
                  </dd>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <dt className="text-zinc-400">Requester User ID</dt>
                  <dd className="mt-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 break-all">
                    {ticket.user_id}
                  </dd>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <dt className="text-zinc-400">Created Timestamp</dt>
                  <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
                    {new Date(ticket.created_at).toLocaleString()}
                  </dd>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <dt className="text-zinc-400">Conversation Count</dt>
                  <dd className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    {replies.length} replies
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}