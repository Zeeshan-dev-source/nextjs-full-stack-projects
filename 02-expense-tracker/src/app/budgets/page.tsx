"use client";

import { useEffect, useState } from "react";
import {
  CalendarIcon,
  PencilIcon,
  PlusIcon,
  TargetIcon,
  TrashIcon,
} from "@/components/icons";
import {
  CardHeader,
  cn,
  EmptyState,
  IconButton,
  ListSkeleton,
  PageHeader,
  Spinner,
} from "@/components/ui";
import { useFormatMoney } from "@/lib/preferences";

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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
  const formatMoney = useFormatMoney();

  useEffect(() => {
    async function fetchData() {
      try {
        const [budgetsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/categories"),
        ]);

        const budgetsData = await budgetsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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

    setTimeout(() => {
      document
        .getElementById("budget-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setCategoryId("");
    setAmount("");
    setMonth("");
    setYear("");
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

  const isEditing = editingId !== null;
  const currentYear = new Date().getFullYear();
  const totalBudgeted = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0
  );

  const monthLabel = (value: number) => MONTHS[value - 1] ?? String(value);

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set and manage your monthly category budgets."
      />

      <section
        id="budget-form"
        className={cn(
          "card mb-6 scroll-mt-24 overflow-hidden",
          isEditing && "ring-2 ring-primary/30"
        )}
      >
        <CardHeader
          title={isEditing ? "Edit Budget" : "New Budget"}
          description={
            isEditing
              ? "Adjust the limit or period for this budget."
              : "Set a monthly spending limit for a category."
          }
          icon={isEditing ? PencilIcon : PlusIcon}
        />

        <form
          onSubmit={handleAddBudget}
          className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"
        >
          <div>
            <label htmlFor="budget-category" className="label">
              Category
            </label>
            <select
              id="budget-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-amount" className="label">
              Monthly limit
            </label>
            <input
              id="budget-amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 20000"
              min="0"
              step="0.01"
              className="input tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="budget-month" className="label">
              Month
            </label>
            <select
              id="budget-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input"
            >
              <option value="">Select month</option>
              {MONTHS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-year" className="label">
              Year
            </label>
            <select
              id="budget-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input"
            >
              <option value="">Select year</option>
              {Array.from({ length: 11 }, (_, index) => {
                const selectedYear = currentYear - 5 + index;

                return (
                  <option key={selectedYear} value={selectedYear}>
                    {selectedYear}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end lg:col-span-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={adding}
              className="btn btn-primary sm:min-w-40"
            >
              {adding ? <Spinner /> : !isEditing && <PlusIcon className="h-4 w-4" />}
              {adding
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Update Budget"
                  : "Add Budget"}
            </button>
          </div>
        </form>
      </section>

      <section className="card overflow-hidden">
        <CardHeader
          title="All Budgets"
          description={
            loading
              ? "Loading…"
              : budgets.length > 0
                ? `${budgets.length} budget${budgets.length !== 1 ? "s" : ""} · ${formatMoney(totalBudgeted)} total`
                : "No budgets set"
          }
        />

        {loading ? (
          <ListSkeleton rows={4} />
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={TargetIcon}
            title="No budgets yet"
            description="Create a budget above to keep your monthly spending in check."
          />
        ) : (
          <>
            {/* Table — tablet & desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-2/50 text-xs font-medium tracking-wide text-muted uppercase">
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Monthly limit
                    </th>
                    <th className="px-6 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {budgets.map((budget) => (
                    <tr
                      key={budget.id}
                      className={cn(
                        "transition-colors hover:bg-surface-2/60",
                        editingId === budget.id && "bg-primary-soft/60"
                      )}
                    >
                      <td className="max-w-0 px-6 py-3.5">
                        <p className="truncate font-medium text-fg">
                          {budget.category}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted">
                        {monthLabel(budget.month)} {budget.year}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold whitespace-nowrap text-fg tabular-nums">
                        {formatMoney(budget.amount)}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-1">
                          <IconButton
                            label="Edit budget"
                            onClick={() => handleEditBudget(budget)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            label="Delete budget"
                            variant="danger"
                            onClick={() => handleDeleteBudget(budget.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stacked list — mobile */}
            <ul className="divide-y divide-line md:hidden">
              {budgets.map((budget) => (
                <li
                  key={budget.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4",
                    editingId === budget.id && "bg-primary-soft/60"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {budget.category}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {monthLabel(budget.month)} {budget.year}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-fg tabular-nums">
                    {formatMoney(budget.amount)}
                  </p>
                  <div className="-mr-1 flex shrink-0 gap-0.5">
                    <IconButton
                      label="Edit budget"
                      onClick={() => handleEditBudget(budget)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="Delete budget"
                      variant="danger"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
