"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error(error);
      } else {
        setTickets(data);
      }

      setLoading(false);
    }

    getDashboardData();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">

        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-600">
            Support Ticket Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome, {user.email}
          </p>

          <div className="mt-6">
            <button
              onClick={() => router.push("/create-ticket")}
              className="mr-3 rounded bg-blue-600 px-5 py-2 text-white"
            >
              Create Ticket
            </button>

            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-5 py-2 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-600">
            My Tickets
          </h2>

          {tickets.length === 0 ? (
            <p className="mt-4 text-gray-600">
              You have no tickets yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {tickets.map((ticket) => (
                 <div
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    className="cursor-pointer rounded-lg border p-5 transition hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-600">
                      {ticket.subject}
                    </h3>

                    <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                      {ticket.status}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600">
                    {ticket.description}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    Created:{" "}
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}