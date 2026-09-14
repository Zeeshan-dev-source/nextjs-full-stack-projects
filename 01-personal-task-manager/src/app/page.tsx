"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

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
}


async function updateTask() {
  if (!task.trim() || editingId === null) return;

  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: task,
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

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Personal Task Manager
        </h1>

        <p className="mb-6 text-gray-500">
          Manage your daily tasks
        </p>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editingId !== null ? updateTask() : addTask();
            }
            
            }}
            placeholder="Enter a new task..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
          />

          <button
            onClick={editingId !== null ? updateTask : addTask}
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            {editingId !== null ? "Update" : "Add"}
          </button>

        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
              No tasks yet. Add your first task!
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="cursor-pointer h-5 w-5"
                  />

                  <span
                    className={
                      
                      task.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => editTask(task.id)}
                    className="cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}