"use client";

import { useEffect, useState } from "react";

type Budget = {
  id: number;
  category_id: number;
  category: string;
  amount: number;
  month: number;
  year: number;
};

type Category = {
  id: number;
  name: string;
};

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [budgetsResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/budgets"),
            fetch("/api/categories"),
          ]);

        const budgetsData = await budgetsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setBudgets(budgetsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleAddBudget(e: React.FormEvent) {
  e.preventDefault();

  if (!categoryId || !amount || !month || !year) {
    alert("Please fill all fields");
    return;
  }

  setAdding(true);

  try {
    const response = await fetch("/api/budgets", {
      method: editingId !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        categoryId,
        amount,
        month,
        year,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to add budget");
      return;
    }

    setCategoryId("");
    setAmount("");
    setMonth("");
    setYear("");
    setEditingId(null);

    const refreshResponse = await fetch("/api/budgets");
    const refreshedBudgets = await refreshResponse.json();

    setBudgets(refreshedBudgets);
  } catch (error) {
    console.error("Failed to add budget:", error);
    alert("Something went wrong");
  } finally {
    setAdding(false);
  }
}

function handleEditBudget(budget: Budget) {
  setEditingId(budget.id);
  setCategoryId(String(budget.category_id));
  setAmount(String(budget.amount));
  setMonth(String(budget.month));
  setYear(String(budget.year));
}

async function handleDeleteBudget(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this budget?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/budgets", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to delete budget");
      return;
    }

    setBudgets((currentBudgets) =>
      currentBudgets.filter((budget) => budget.id !== id)
    );
  } catch (error) {
    console.error("Failed to delete budget:", error);
    alert("Something went wrong");
  }
}

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Budgets
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Set and manage your monthly category budgets.
        </p>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <form
  onSubmit={handleAddBudget}
  className="mb-8 grid gap-4 md:grid-cols-4"
>
  <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
  >
    <option value="">Select category</option>

    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>

  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    placeholder="Monthly limit"
    min="0"
    step="0.01"
    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
  />

  <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
>
  <option value="">Select month</option>
  <option value="1">January</option>
  <option value="2">February</option>
  <option value="3">March</option>
  <option value="4">April</option>
  <option value="5">May</option>
  <option value="6">June</option>
  <option value="7">July</option>
  <option value="8">August</option>
  <option value="9">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
</select>

  <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
>
  <option value="">Select year</option>
  {Array.from({ length: 11 }, (_, index) => {
    const currentYear = new Date().getFullYear();
    const selectedYear = currentYear - 5 + index;

    return (
      <option key={selectedYear} value={selectedYear}>
        {selectedYear}
      </option>
    );
  })}
</select>

  <button
  type="submit"
  disabled={adding}
  className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 md:col-span-4"
>
  {adding
    ? editingId !== null
      ? "Updating..."
      : "Adding..."
    : editingId !== null
    ? "Update Budget"
    : "Add Budget"}
</button>
</form>
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            All Budgets
          </h2>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No budgets yet.</p>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {budget.category}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(2000, budget.month - 1).toLocaleString("en-US", {
                        month: "long",
                    })}{" "}
                    {budget.year}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    Rs. {Number(budget.amount).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleEditBudget(budget)}
                    className="rounded-lg bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
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