"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function getTicketData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      // Get ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (ticketError) {
        console.error(ticketError);
        setLoading(false);
        return;
      }

      setTicket(ticketData);
      setStatus(ticketData.status);

      // Get replies
      const { data: replyData, error: replyError } = await supabase
        .from("ticket_replies")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (replyError) {
        console.error(replyError);
      } else {
        setReplies(replyData);
      }

      setLoading(false);
    }

    if (id) {
      getTicketData();
    }
  }, [id, router]);

  async function handleReply(e) {
    e.preventDefault();

    if (!reply.trim()) {
      setMessage("Please write a reply.");
      return;
    }

    setSending(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id: Number(id),
        user_id: user.id,
        message: reply,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      setSending(false);
      return;
    }

    setReplies((currentReplies) => [...currentReplies, data]);
    setReply("");
    setMessage("Admin reply sent successfully!");
    setSending(false);
  }

  async function handleStatusChange(e) {
    const newStatus = e.target.value;

    setStatus(newStatus);
    setMessage("");

    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setTicket((currentTicket) => ({
      ...currentTicket,
      status: newStatus,
    }));

    setMessage("Ticket status updated successfully!");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Ticket not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => router.push("/admin")}
          className="mb-6 rounded bg-gray-700 px-5 py-2 text-white cursor-pointer border-gray-400 hover:bg-gray-800"
        >
          ← Back to Admin Dashboard
        </button>

        {/* Ticket Details */}
        <div className="rounded-lg bg-white p-8 shadow">

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-600">
              {ticket.subject}
            </h1>

            <span className="rounded bg-yellow-100 px-3 py-1 font-medium text-yellow-700">
              {ticket.status}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-gray-900">
              Description
            </h2>

            <p className="mt-2 text-gray-600">
              {ticket.description}
            </p>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-gray-500">
            <p>Ticket ID: {ticket.id}</p>

            <p className="mt-1">
              User ID: {ticket.user_id}
            </p>

            <p className="mt-1">
              Created:{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Status */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-600">
            Update Status
          </h2>

          <select
            value={status}
            onChange={handleStatusChange}
            className="mt-4 rounded border p-3 text-gray-900"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

        {/* Replies */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-600">
            Replies
          </h2>

          {replies.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No replies yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">

              {replies.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-gray-100 p-4"
                >
                  <p className="text-gray-700">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

            </div>
          )}

          {/* Admin Reply */}
          <form onSubmit={handleReply} className="mt-6">

            <label className="mb-2 block font-medium text-gray-900">
              Reply to User
            </label>

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              rows="5"
              className="w-full rounded border p-3 bg-white + text-gray-900 + border-gray-300"
            />

            <button
              type="submit"
              disabled={sending}
              className="mt-4 rounded bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Admin Reply"}
            </button>

            {message && (
              <p className="mt-4 rounded bg-gray-100 p-3 text-gray-700">
                {message}
              </p>
            )}

          </form>

        </div>

      </div>
    </main>
  );
}