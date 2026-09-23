"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastContext";
import {
  TicketIcon,
  ChevronLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "../components/Icons";

const PRIORITIES = ["Low", "Medium", "High"];

export default function CreateTicketPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return; // guard against double-submit (double-click / double Enter)
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        router.push("/login");
        return;
      }

      let { data, error } = await supabase
        .from("tickets")
        .insert({
          user_id: user.id,
          subject: subject.trim(),
          description: description.trim(),
          priority,
        })
        .select()
        .single();

      // The `priority` column may not exist yet on older schemas — fall
      // back to inserting without it rather than blocking ticket creation.
      if (error?.code === "PGRST204") {
        ({ data, error } = await supabase
          .from("tickets")
          .insert({
            user_id: user.id,
            subject: subject.trim(),
            description: description.trim(),
          })
          .select()
          .single());
      }

      if (error) {
        showToast(error.message, "error");
        setLoading(false);
        return;
      }

      // Store created ticket id for success banner
      setCreatedTicketId(data?.id || true);
      setSubject("");
      setDescription("");
      setPriority("Medium");
    } catch (err) {
      showToast("An unexpected error occurred while creating your ticket.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <TicketIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Submit a Support Request
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Our technical support engineering team will review and respond.
                  </p>
                </div>
              </div>

              {/* Success Notification */}
              {createdTicketId && (
                <div className="mb-6 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-5 text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Ticket created successfully!</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                    Your issue has been logged and assigned to the support queue.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    {typeof createdTicketId === "number" && (
                      <Link
                        href={`/tickets/${createdTicketId}`}
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm transition"
                      >
                        View Ticket #{createdTicketId}
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="rounded-lg border border-emerald-300 dark:border-emerald-800 px-3.5 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/50 transition"
                    >
                      Return to Dashboard
                    </Link>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Subject
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      {subject.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue (e.g., Cannot access billing invoice)"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Description & Details
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      {description.length} characters
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please explain the issue in detail, including steps to reproduce, error codes, and what you've already attempted..."
                    required
                    rows={7}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 p-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                          priority === p
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                            : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading || !subject.trim() || !description.trim()}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <span>Submit Ticket</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Tips & Guidelines */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3 font-semibold text-sm">
                <SparklesIcon className="w-4 h-4" />
                <span>Tips for Rapid Resolution</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                  <span><strong>Be Specific:</strong> Mention error messages or status codes if applicable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                  <span><strong>Reproduction Steps:</strong> Briefly describe the exact steps that caused the issue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                  <span><strong>Environment:</strong> Note your browser, device, or operating system if relevant.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 text-xs text-indigo-900 dark:text-indigo-300">
              <p className="font-semibold mb-1">Estimated Response Time</p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Support engineers typically reply within 2–4 hours during standard operational hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}