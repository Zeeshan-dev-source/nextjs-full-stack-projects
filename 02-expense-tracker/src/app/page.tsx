"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [transactions, setTransactions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
  async function fetchTransactions() {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }

  fetchTransactions();
}, []);

async function handleAddTransaction() {
  if (!title || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        type,
        category,
        date,
      }),
    });
    

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to add transaction");
      return;
    }

    const updatedResponse = await fetch("/api/transactions");
    const updatedTransactions = await updatedResponse.json();

    setTransactions(updatedTransactions);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");
  } catch (error) {
    console.error("Failed to add transaction:", error);
    alert("Something went wrong");
  }
}

async function handleDeleteTransaction(id: number) {
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

    const updatedResponse = await fetch("/api/transactions");
    const updatedTransactions = await updatedResponse.json();

    setTransactions(updatedTransactions);
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    alert("Something went wrong");
  }
}


function handleEditTransaction(transaction: any) {
  setEditingId(transaction.id);
  setTitle(transaction.title);
  setAmount(transaction.amount.toString());
  setType(transaction.type);
  setCategory(transaction.category);
  setDate(transaction.transaction_date.split("T")[0]);
}


async function handleUpdateTransaction() {
  if (!title || !amount || !date || editingId === null) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        title,
        amount: Number(amount),
        type,
        category,
        date,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to update transaction");
      return;
    }

    const updatedResponse = await fetch("/api/transactions");
    const updatedTransactions = await updatedResponse.json();

    setTransactions(updatedTransactions);

    setEditingId(null);
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");
  } catch (error) {
    console.error("Failed to update transaction:", error);
    alert("Something went wrong");
  }
}

  const totalIncome = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions = transactions.filter((transaction) => {
  if (filterType === "all") {
    return true;
  }

  return transaction.type === filterType;
});

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Expense Tracker
        </h1>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
               Rs. {totalIncome}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              Rs. {totalExpenses}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Balance</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-600">
              Rs. {balance}
            </h2>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Add Transaction
          </h2>

          <div className="mb-6 flex gap-2">
            
          <button
            onClick={() => setFilterType("all")}
            className="rounded-lg bg-gray-200 text-gray-900 px-4 py-2 text-sm cursor-pointer"
          >
            All
          </button>

          <button
            onClick={() => setFilterType("income")}
            className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700 cursor-pointer"
          >
            Income
          </button>

          <button
            onClick={() => setFilterType("expense")}
            className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 cursor-pointer"
          >
            Expense
          </button>
        </div>

          <form className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  editingId === null
                    ? handleAddTransaction
                    : handleUpdateTransaction
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 cursor-pointer"
              >
                {editingId === null ? "Add Transaction" : "Update Transaction"}
            </button>
            </div>
          </form>
        </div>

        {/* Transactions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-600">{transaction.title}</h3>

                    <p className="text-sm text-gray-500">
                      {transaction.category} • {transaction.transaction_date}
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
  onClick={() => handleDeleteTransaction(transaction.id)}
  className="ml-4 rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 cursor-pointer"
>
  Delete
</button>

                  <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="ml-2 rounded-lg bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600 cursor-pointer"
                    >
                      Edit
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