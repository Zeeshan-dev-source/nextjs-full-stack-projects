"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import EmptyState from "../components/EmptyState";
import {
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SearchIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  AlertCircleIcon,
  UserIcon,
} from "../components/Icons";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || profileData?.role !== "admin") {
        setProfile(profileData || null);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketError) {
        console.error("Admin ticket fetch error:", ticketError);
      } else {
        setTickets(ticketData || []);
      }

      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  // Admin KPI metrics computed client-side
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(
      (t) => (t.status || "").toLowerCase().trim() === "open"
    ).length;
    const inProgress = tickets.filter(
      (t) =>
        (t.status || "").toLowerCase().trim() === "in progress" ||
        (t.status || "").toLowerCase().trim() === "inprogress"
    ).length;
    const resolved = tickets.filter(
      (t) => (t.status || "").toLowerCase().trim() === "resolved"
    ).length;
    const uniqueUsers = new Set(tickets.map((t) => t.user_id)).size;

    return { total, open, inProgress, resolved, uniqueUsers };
  }, [tickets]);

  // Admin filter and search
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (statusFilter !== "all") {
          const normStatus = (ticket.status || "").toLowerCase().trim();
          if (statusFilter === "open" && normStatus !== "open") return false;
          if (
            statusFilter === "in progress" &&
            normStatus !== "in progress" &&
            normStatus !== "inprogress"
          )
            return false;
          if (statusFilter === "resolved" && normStatus !== "resolved") return false;
        }

        if (priorityFilter !== "all") {
          const normPriority = (ticket.priority || "Medium").toLowerCase().trim();
          if (normPriority !== priorityFilter) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const subjectMatch = (ticket.subject || "").toLowerCase().includes(q);
          const descMatch = (ticket.description || "").toLowerCase().includes(q);
          const idMatch = String(ticket.id).includes(q);
          const userMatch = (ticket.user_id || "").toLowerCase().includes(q);
          return subjectMatch || descMatch || idMatch || userMatch;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [tickets, statusFilter, priorityFilter, searchQuery, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Verifying admin access...
          </p>
        </main>
      </div>
    );
  }

  // Access Denied if not admin
  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-4">
            <AlertCircleIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Admin Access Required
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
            This area is restricted to support administrators. Your account does not currently hold the administrator role in the system profile.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Go to Customer Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheckIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Admin Support Console
              </h1>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Staff Only
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Logged in as <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.email}</span> (Admin). System-wide ticket triage and resolution queue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
            >
              Customer View
            </Link>
          </div>
        </div>

        {/* KPI Row */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="System Tickets"
            value={stats.total}
            subtitle={`${stats.uniqueUsers} unique clients`}
            icon={TicketIcon}
            variant="default"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatsCard
            title="Action Needed (Open)"
            value={stats.open}
            subtitle="Requires response"
            icon={ClockIcon}
            variant="open"
            active={statusFilter === "open"}
            onClick={() => setStatusFilter("open")}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Under investigation"
            icon={MessageSquareIcon}
            variant="progress"
            active={statusFilter === "in progress"}
            onClick={() => setStatusFilter("in progress")}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            subtitle="Successfully closed"
            icon={CheckCircleIcon}
            variant="resolved"
            active={statusFilter === "resolved"}
            onClick={() => setStatusFilter("resolved")}
          />
        </div>

        {/* Triage Workspace */}
        <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All Tickets", count: stats.total },
                { id: "open", label: "Open", count: stats.open },
                { id: "in progress", label: "In Progress", count: stats.inProgress },
                { id: "resolved", label: "Resolved", count: stats.resolved },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      statusFilter === tab.id
                        ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                        : "bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter by subject, ID, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 outline-none focus:border-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Tickets Table / List */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {tickets.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No support tickets exist"
                  description="No customer support tickets have been created in the system yet."
                  actionLabel=""
                  actionHref=""
                />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  No tickets match the search query or status filter.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-900/60">
                        #{ticket.id}
                      </span>
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {ticket.subject}
                      </h2>
                      <StatusBadge status={ticket.status} size="sm" />
                      <PriorityBadge priority={ticket.priority} size="sm" compact />
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {ticket.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 flex-wrap text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Created {new Date(ticket.created_at).toLocaleDateString()} at{" "}
                        {new Date(ticket.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        <UserIcon className="w-3 h-3 text-zinc-500" />
                        User: {ticket.user_id?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/tickets/${ticket.id}`);
                      }}
                      className="rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-1.5 text-xs font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition shadow-sm"
                    >
                      Manage Ticket
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer stats */}
          {tickets.length > 0 && (
            <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Showing {filteredTickets.length} of {tickets.length} total tickets
              </span>
              <span>Admin Queue Active</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}