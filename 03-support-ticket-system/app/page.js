"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { supabase } from "@/lib/supabase";
import {
  TicketIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "./components/Icons";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 transform blur-3xl" aria-hidden="true">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 dark:from-indigo-600/10 dark:to-violet-600/10 opacity-70" />
          </div>

          <div className="mx-auto max-w-5xl text-center">
            {/* Pill announcement */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm mb-6 backdrop-blur">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Next-Generation Support & Ticket Operations</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Resolve customer requests faster,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                without the chaos.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              A streamlined, modern support ticketing system designed for high-velocity teams. Track issues, collaborate across threaded replies, and deliver rapid resolutions.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition"
                >
                  <TicketIcon className="w-5 h-5" />
                  <span>Go to My Dashboard</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition"
                  >
                    <span>Create Free Account</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 shadow-sm transition"
                  >
                    <span>Sign In to Portal</span>
                  </Link>
                </>
              )}

              <Link
                href="/create-ticket"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-5 py-3.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <PlusCircleIcon className="w-4 h-4" />
                <span>Submit a Ticket</span>
              </Link>
            </div>

            {/* Interactive Preview Card */}
            <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">ticket-preview-console</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  System Online
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="rounded-xl border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-400">
                    <span>STATUS: OPEN</span>
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">API Gateway timeout error</h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Investigating payload latency spike...</p>
                </div>

                <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <span>IN PROGRESS</span>
                    <MessageSquareIcon className="w-4 h-4" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Billing webhook reconciliation</h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Support agent assigned to case...</p>
                </div>

                <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>RESOLVED</span>
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">SSO configuration reset</h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Ticket closed with customer signoff.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Engineered for clarity and speed
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Everything required to manage customer issues cleanly without clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-slate-50/50 dark:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                  <TicketIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Lifecycle Tracking
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Instant visibility across Open, In Progress, and Resolved states with real-time timestamps and status badges.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-slate-50/50 dark:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                  <MessageSquareIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Threaded Conversations
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Seamless back-and-forth messaging between customers and support engineers without missing crucial context.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-slate-50/50 dark:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Admin Control Center
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Comprehensive triage dashboard for support staff to manage tickets, update resolution stages, and dispatch replies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4 sm:px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">ResolveHQ</span>
            <span>—</span>
            <span>Support Ticket System</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white transition">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-zinc-900 dark:hover:text-white transition">
              Create Account
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
