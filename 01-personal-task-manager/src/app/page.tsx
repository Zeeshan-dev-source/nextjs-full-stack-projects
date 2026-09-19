"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  category: string;
  due_date: string | null;
};

export default function Home() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    setTasks(data || []);
  }

  async function addTask() {
    if (!task.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
  {
    title: task,
    completed: false,
    priority: priority,
    category: category,
    due_date: dueDate || null,
  },
])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      return;
    }

    setTasks((currentTasks) => [data, ...currentTasks]);
    setTask("");
  }

  function editTask(id: number) {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    setTask(selectedTask.title);
    setEditingId(id);
    setPriority(selectedTask.priority);
    setCategory(selectedTask.category);
    setDueDate(selectedTask.due_date || "");
  }

  async function updateTask() {
    if (!task.trim() || editingId === null) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: task,
        priority: priority,
        category: category,
      })
      .eq("id", editingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === editingId ? data : item
      )
    );

    setTask("");
    setEditingId(null);
  }

  async function deleteTask(id: number) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  async function toggleTask(id: number) {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !selectedTask.completed,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task status:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? data : task
      )
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks = tasks.length - completedTasks;

  const filteredTasks = tasks.filter((task) =>
  task.title.toLowerCase().includes(search.toLowerCase())
);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
            Task Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
  Personal Task Manager
</h1>

<Link
  href="/dashboard"
  className="mt-4 inline-flex cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
>
  📊 Dashboard
</Link>

          

          <p className="mt-2 text-slate-500">
            Organize your work and keep track of your daily tasks.
          </p>
        </div>

        

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {completedTasks}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Remaining
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {remainingTasks}
            </p>
          </div>

        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-7">

          {/* Add / Edit Form */}
          <div className="mb-7">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId !== null
                  ? "Edit Task"
                  : "Add New Task"}
              </h2>

              {editingId !== null && (
                <button
                  onClick={() => {
                    setTask("");
                    setEditingId(null);
                  }}
                  className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            

            <div className="flex flex-col gap-3">

              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editingId !== null
                      ? updateTask()
                      : addTask();
                  }
                }}
               
                placeholder="What do you need to accomplish?"
                className="w-full flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />


              <button
                onClick={
                  editingId !== null
                    ? updateTask
                    : addTask
                }
                className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
              >
                {editingId !== null ? "Update Task" : "Add Task"}
              </button>
              </div>



            </div>
          </div>

          <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your tasks..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

          {/* Task List */}
          <div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Your Tasks
              </h2>

              {tasks.length > 0 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {tasks.length}{" "}
                  {tasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>

           {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                ✓
              </div>

              <h3 className="font-semibold text-slate-800">
                No tasks yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first task above to get started.
              </p>

            </div>

          ) : filteredTasks.length === 0 ? (

            <p className="py-8 text-center text-gray-400">
              No tasks found for "{search}"
            </p>

          ) : (

            <div className="space-y-3">

              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                    task.completed
                      ? "border-emerald-100 bg-emerald-50/50"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  {/* Task Info */}
                    
              <div className="flex min-w-0 items-center gap-3">

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 cursor-pointer accent-blue-600"
                />

                <span
                  className={`break-words text-sm font-medium sm:text-base ${
                    task.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {task.category}
               
              </span>
               {task.due_date && (
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                  Due: {task.due_date}
                </span>
              )}

              </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-8 sm:pl-0">

                      <button
                        onClick={() =>
                          editTask(task.id)
                        }
                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Built with Next.js, Supabase & Tailwind CSS
        </p>

      </div>
    </main>
  );
}