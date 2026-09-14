"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function AdminTicketDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdminAndLoadTicket();
  }, [id]);

  async function checkAdminAndLoadTicket() {
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
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
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
    setNewStatus(ticketData.status);

    // Get replies
    const { data: replyData, error: replyError } = await supabase
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    if (replyError) {
      console.error(replyError);
    } else {
      setReplies(replyData || []);
    }

    setLoading(false);
  }

  async function handleReply(e) {
    e.preventDefault();

    if (!reply.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

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
      console.error(error);
      setMessage("Error sending reply.");
      return;
    }

    setReplies([...replies, data]);
    setReply("");
    setMessage("Reply sent successfully.");
  }

  async function handleStatusChange() {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Error updating status.");
      return;
    }

    setTicket({
      ...ticket,
      status: newStatus,
    });

    setMessage("Status updated successfully.");
  }

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!ticket) {
    return <p className="p-8">Ticket not found.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 rounded bg-gray-600 px-4 py-2 text-white cursor-pointer border-gray-400 hover:bg-gray-700"
        >
          ← Back to Admin Dashboard
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Ticket Detail</h1>

        <div className="mb-6 border-b pb-6 text-gray-600">
          <h2 className="text-xl font-semibold text-gray-900">{ticket.subject}</h2>

          <p className="mt-2 text-gray-700">{ticket.description}</p>

          <p className="mt-3 text-sm text-gray-500">
            Ticket ID: {ticket.id}
          </p>

          <p className="text-sm text-gray-500">
            Created: {new Date(ticket.created_at).toLocaleString()}
          </p>

          <p className="mt-2">
            Current Status:{" "}
            <span className="font-semibold font-semibold text-blue-700">{ticket.status}</span>
          </p>
        </div>

        {/* Status */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Update Status</h2>

          <div className="flex gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="rounded border px-4 py-2 text-gray-900"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              onClick={handleStatusChange}
              className="rounded bg-blue-600 px-5 py-2 text-white cursor-pointer border-gray-400 hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Conversation</h2>

          {replies.length === 0 ? (
            <p className="text-gray-500">No replies yet.</p>
          ) : (
            replies.map((item) => (
              <div
                key={item.id}
                className="mb-3 rounded bg-gray-100 p-4 text-gray-900"
              >
                <p>{item.message}</p>

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Admin Reply */}
        <form onSubmit={handleReply}>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Reply to User</h2>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
            className="mb-3 w-full rounded border p-3 text-gray-900"
            rows="5"
          />

          <button
            type="submit"
            className="rounded bg-green-600 px-5 py-2 text-white cursor-pointer border-gray-400 hover:bg-green-700"
          >
            Send Reply
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded bg-green-100 p-3 font-medium text-green-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}