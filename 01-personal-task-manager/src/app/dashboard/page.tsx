"use client";


import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  category: string;
  due_date: string | null;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dashboard tasks:", error);
        return;
      }

      setTasks(data || []);
    }

    fetchTasks();
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium"
  ).length;

  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "low"
  ).length;

  const personalTasks = tasks.filter(
    (task) => task.category === "personal"
  ).length;

  const workTasks = tasks.filter(
    (task) => task.category === "work"
  ).length;

  const studyTasks = tasks.filter(
    (task) => task.category === "study"
  ).length;

  const shoppingTasks = tasks.filter(
    (task) => task.category === "shopping"
  ).length;

  const otherTasks = tasks.filter(
    (task) => task.category === "other"
  ).length;

const upcomingTasks = tasks
  .filter((task) => task.due_date)
  .sort(
    (a, b) =>
      new Date(a.due_date!).getTime() -
      new Date(b.due_date!).getTime()
  )
  .slice(0, 5);

  const recentTasks = [...tasks]
  .sort(
    (a, b) => b.id - a.id
  )
  .slice(0, 5);

return (
  <main className="min-h-screen bg-slate-50 px-4 py-10">
    <div className="mx-auto max-w-6xl">

        <div className="mb-6">
        <Link
            href="/"
            className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
            ← Task Manager
        </Link>
        </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900">
        Task Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Track your task progress and productivity.
      </p>

      {/* Statistics Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Tasks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Tasks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalTasks}
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {completedTasks}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {pendingTasks}
          </p>
        </div>

        {/* Completion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Completion
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {completionPercentage}%
          </p>
        </div>

      </div>

      {/* Overall Progress */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Overall Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <span className="text-lg font-bold text-blue-600">
            {completionPercentage}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Priority Breakdown
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">

          {/* High */}
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">
              High Priority
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">
              {highPriorityTasks}
            </p>
          </div>

          {/* Medium */}
          <div className="rounded-xl bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-600">
              Medium Priority
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {mediumPriorityTasks}
            </p>
          </div>

          {/* Low */}
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm font-medium text-green-600">
              Low Priority
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">
              {lowPriorityTasks}
            </p>
          </div>

        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Category Breakdown
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Personal */}
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-600">
              Personal
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {personalTasks}
            </p>
          </div>

          {/* Work */}
          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm font-medium text-purple-600">
              Work
            </p>

            <p className="mt-1 text-2xl font-bold text-purple-700">
              {workTasks}
            </p>
          </div>

          {/* Study */}
          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-600">
              Study
            </p>

            <p className="mt-1 text-2xl font-bold text-indigo-700">
              {studyTasks}
            </p>
          </div>

          {/* Shopping */}
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-600">
              Shopping
            </p>

            <p className="mt-1 text-2xl font-bold text-orange-700">
              {shoppingTasks}
            </p>
          </div>

          {/* Other */}
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-sm font-medium text-slate-600">
              Other
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-700">
              {otherTasks}
            </p>
          </div>

        </div>
      </div>

{/* Upcoming Due Dates */}
<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Upcoming Due Dates
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Your next upcoming tasks.
      </p>
    </div>
  </div>

  <div className="mt-4 space-y-3">
    {upcomingTasks.length === 0 ? (
      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        No upcoming tasks with due dates.
      </p>
    ) : (
      upcomingTasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3
              className={`font-semibold ${
                task.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                Due: {task.due_date}
              </span>

              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {task.category}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                {task.priority}
              </span>
            </div>
          </div>

          <span
            className={`text-sm font-semibold ${
              task.completed
                ? "text-emerald-600"
                : "text-orange-500"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      ))
    )}
  </div>
</div>

{/* Recent Tasks */}
<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-slate-900">
    Recent Tasks
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Your most recently created tasks.
  </p>

  <div className="mt-4 space-y-3">
    {recentTasks.length === 0 ? (
      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        No tasks available.
      </p>
    ) : (
      recentTasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3
              className={`font-semibold ${
                task.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                {task.category}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                {task.priority}
              </span>

              {task.due_date && (
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                  Due: {task.due_date}
                </span>
              )}
            </div>
          </div>

          <span
            className={`text-sm font-semibold ${
              task.completed
                ? "text-emerald-600"
                : "text-orange-500"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      ))
    )}
  </div>
</div>

    </div>
  </main>
);
}