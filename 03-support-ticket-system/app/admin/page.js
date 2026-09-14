"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.role !== "admin") {
        setLoading(false);
        return;
      }

      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketError) {
        console.error(ticketError);
      } else {
        setTickets(ticketData);
      }

      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!profile || profile.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-3 text-gray-600">
            You are not authorized to access the admin dashboard.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 rounded bg-blue-600 px-5 py-2 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-600">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome, {user.email}
          </p>

          <p className="mt-2 font-medium text-green-600">
            Role: {profile.role}
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded bg-gray-700 px-5 py-2 text-white cursor-pointer border-gray-400 hover:bg-gray-800"
          >
            Back to User Dashboard
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-600">
            All Support Tickets
          </h2>

          {tickets.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No tickets found.
            </p>
          ) : (
            <div className="mt-6 space-y-4">

              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border p-5 text-gray-900"
                >
                
                  <div className="flex items-center justify-between">

                    <h3 className="text-xl font-semibold">
                      {ticket.subject}
                    </h3>

                    <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                      {ticket.status}
                    </span>

                  </div>

                  <p className="mt-3 text-gray-600">
                    {ticket.description}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Ticket ID: {ticket.id}
                    </p>

                    <p>
                      User ID: {ticket.user_id}
                    </p>

                    <p>
                      Created:{" "}
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                    className="mt-4 rounded bg-blue-600 px-5 py-2 text-white cursor-pointer border-gray-400 hover:bg-blue-700"
                >
                    View Ticket
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}