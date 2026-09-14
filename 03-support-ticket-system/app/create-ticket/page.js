"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreateTicketPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    // Get currently logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Insert ticket into database
    const { error } = await supabase.from("tickets").insert({
      user_id: user.id,
      subject: subject,
      description: description,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Ticket created successfully!");

    setSubject("");
    setDescription("");

    // setTimeout(() => {
    //   router.push("/dashboard");
    // }, 1000);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-600">
          Create Support Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-900">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter ticket subject"
              required
              className="w-full rounded border p-3 placeholder-gray-500 border-gray-400 outline-none focus:ring-2 text-gray-900 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-900">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your problem..."
              required
              rows="6"
              className="w-full rounded border p-3 bg-white + text-gray-900 + border-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-6 py-3 text-white disabled:opacity-50 cursor-pointer border-gray-400 hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded bg-gray-100 p-3 text-green-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}