"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [type, setType] = useState<"income" | "expense">("expense");
const [category, setCategory] = useState("");
const [date, setDate] = useState("");
const [adding, setAdding] = useState(false);
const [editingId, setEditingId] = useState<number | null>(null);
const [searchTerm, setSearchTerm] = useState("");


const [filterType, setFilterType] = useState<
  "all" | "income" | "expense"
>("all");


async function handleAddTransaction(e: React.FormEvent) {
  e.preventDefault();

  if (!title || !amount || !category || !date) {
    alert("Please fill all fields");
    return;
  }

  setAdding(true);

  try {
    const response = await fetch("/api/transactions", {
      method: editingId !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        editingId !== null
          ? {
              id: editingId,
              title,
              amount,
              type,
              category,
              date,
            }
          : {
              title,
              amount,
              type,
              category,
              date,
            }
      ),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to save transaction");
      return;
    }

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate("");
    setEditingId(null);

    const refreshResponse = await fetch("/api/transactions");
    const refreshedTransactions = await refreshResponse.json();

    setTransactions(refreshedTransactions);
  } catch (error) {
    console.error("Failed to save transaction:", error);
    alert("Something went wrong");
  } finally {
    setAdding(false);
  }
}

async function handleEditTransaction(
  transaction: Transaction
) {
  setEditingId(transaction.id);

  setTitle(transaction.title);
  setAmount(String(transaction.amount));
  setType(transaction.type);
  setCategory(transaction.category);
  setDate(transaction.transaction_date);
}

  async function handleDeleteTransaction(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete transaction");
        return;
      }

      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Something went wrong");
    }
  }

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

const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch = `${transaction.title} ${transaction.category}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesType =
    filterType === "all" || transaction.type === filterType;

  return matchesSearch && matchesType;
});

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Manage your income and expenses.
        </p>

        <div className="mb-8 rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {editingId !== null ? "Edit Transaction" : "Add Transaction"}
        </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterType("income")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filterType === "income"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Income
            </button>

            <button
              onClick={() => setFilterType("expense")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filterType === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Expense
            </button>
          </div>

          <form onSubmit={handleAddTransaction} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Salary"
                className="mb-6 mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "income" | "expense")
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Food"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={adding}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding
                ? editingId !== null
                  ? "Updating..."
                  : "Adding..."
                : editingId !== null
                ? "Update Transaction"
                : "Add Transaction"}
              </button>
              {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setAmount("");
                  setType("expense");
                  setCategory("");
                  setDate("");
                }}
                className="mt-2 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel Edit
              </button>
            )}
              
              
            </div>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            All Transactions
          </h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""}
          </p>

          {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
            ) : filteredTransactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No transactions found for your search or filter.
              </p>
            ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
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
                    {transaction.amount}
                  </p>

                  <button
                    onClick={() => handleEditTransaction(transaction)}
                    className="ml-4 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTransaction(transaction.id)
                    }
                    className="ml-4 rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    Delete
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