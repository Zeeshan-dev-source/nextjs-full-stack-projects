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
  PlusCircleIcon,
  ClockIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  SearchIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "../components/Icons";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function getDashboardData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
      } else {
        setTickets(data || []);
      }

      setLoading(false);
    }

    getDashboardData();
  }, [router]);

  // Client-side statistics calculations (zero DB changes)
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

    return { total, open, inProgress, resolved };
  }, [tickets]);

  // Client-side filtering & sorting
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Status filter
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

        // Priority filter
        if (priorityFilter !== "all") {
          const normPriority = (ticket.priority || "Medium").toLowerCase().trim();
          if (normPriority !== priorityFilter) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const subjectMatch = (ticket.subject || "").toLowerCase().includes(q);
          const descMatch = (ticket.description || "").toLowerCase().includes(q);
          const idMatch = String(ticket.id).includes(q);
          return subjectMatch || descMatch || idMatch;
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
            Loading your dashboard...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Customer Dashboard
              </h1>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Active Portal
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back, <span className="font-medium text-zinc-800 dark:text-zinc-200">{user?.email}</span>. Track and manage your requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create-ticket"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition shadow-indigo-600/20 active:scale-[0.99]"
            >
              <PlusCircleIcon className="w-4 h-4" />
              <span>Create New Ticket</span>
            </Link>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            subtitle="All time requests"
            icon={TicketIcon}
            variant="default"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatsCard
            title="Open Tickets"
            value={stats.open}
            subtitle="Awaiting triage"
            icon={ClockIcon}
            variant="open"
            active={statusFilter === "open"}
            onClick={() => setStatusFilter("open")}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Under review"
            icon={MessageSquareIcon}
            variant="progress"
            active={statusFilter === "in progress"}
            onClick={() => setStatusFilter("in progress")}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            subtitle="Completed"
            icon={CheckCircleIcon}
            variant="resolved"
            active={statusFilter === "resolved"}
            onClick={() => setStatusFilter("resolved")}
          />
        </div>

        {/* Main Content Area */}
        <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          
          {/* Controls / Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All", count: stats.total },
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

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
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

          {/* Tickets List View */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {tickets.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No support tickets yet"
                  description="Have an issue or inquiry? Create your first support ticket to receive assistance from our staff."
                  actionLabel="Create First Ticket"
                  actionHref="/create-ticket"
                />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  No tickets match your filter criteria.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition"
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

                    <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Created {new Date(ticket.created_at).toLocaleDateString()} at{" "}
                        {new Date(ticket.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition hidden sm:inline">
                      View Ticket
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {tickets.length > 0 && (
            <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Showing {filteredTickets.length} of {tickets.length} tickets
              </span>
              <span>Click on any ticket to open discussion</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}