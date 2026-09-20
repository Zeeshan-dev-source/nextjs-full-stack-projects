
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();

        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const balance = totalIncome - totalExpenses;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Overview of your income, expenses, and recent transactions.
        </p>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500">Total Income</p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              Rs. {totalIncome.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500">Total Expenses</p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              Rs. {totalExpenses.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500">Balance</p>

            <h2 className="mt-2 text-2xl font-bold text-blue-600">
              Rs. {balance.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>

            <Link
              href="/transactions"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">
              Loading transactions...
            </p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {transaction.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {transaction.category} •{" "}
                      {transaction.transaction_date}
                    </p>
                  </div>

                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"} Rs.{" "}
                    {Number(transaction.amount).toLocaleString()}
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
