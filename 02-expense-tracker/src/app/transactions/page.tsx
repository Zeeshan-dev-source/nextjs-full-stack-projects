"use client";

import { useEffect, useState } from "react";
import {
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TransactionsIcon,
  TrashIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "@/components/icons";
import {
  CardHeader,
  cn,
  EmptyState,
  formatDate,
  IconButton,
  ListSkeleton,
  PageHeader,
  Spinner,
  TypeBadge,
} from "@/components/ui";
import { useFormatMoney } from "@/lib/preferences";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
};

type Category = {
  id: number;
  name: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const formatMoney = useFormatMoney();

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

  function handleEditTransaction(transaction: Transaction) {
    setEditingId(transaction.id);

    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.transaction_date);

    setTimeout(() => {
      document
        .getElementById("transaction-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate("");
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
        currentTransactions.filter((transaction) => transaction.id !== id)
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

        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    // Category names are only used as suggestions for the category field.
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchTransactions();
    fetchCategories();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = `${transaction.title} ${transaction.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ] as const;

  const isEditing = editingId !== null;

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Manage your income and expenses."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* Add / Edit form */}
        <section
          id="transaction-form"
          className={cn(
            "card scroll-mt-24 overflow-hidden lg:sticky lg:top-24",
            isEditing && "ring-2 ring-primary/30"
          )}
        >
          <CardHeader
            title={isEditing ? "Edit Transaction" : "Add Transaction"}
            description={
              isEditing
                ? "Update the details and save your changes."
                : "Record a new income or expense."
            }
            icon={isEditing ? PencilIcon : PlusIcon}
          />

          <form
            onSubmit={handleAddTransaction}
            className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-1"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <span className="label">Type</span>
              <div
                className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1"
                role="radiogroup"
                aria-label="Transaction type"
              >
                {(["expense", "income"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={type === option}
                    onClick={() => setType(option)}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1.5 rounded-md text-sm font-medium capitalize transition-colors",
                      type === option
                        ? option === "income"
                          ? "bg-surface text-emerald-600 shadow-xs dark:text-emerald-400"
                          : "bg-surface text-rose-600 shadow-xs dark:text-rose-400"
                        : "text-muted hover:text-fg"
                    )}
                  >
                    {option === "income" ? (
                      <TrendingUpIcon className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDownIcon className="h-3.5 w-3.5" />
                    )}
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="tx-title" className="label">
                Title
              </label>
              <input
                id="tx-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Salary"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="tx-amount" className="label">
                Amount
              </label>
              <input
                id="tx-amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="input tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="tx-date" className="label">
                Date
              </label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="tx-category" className="label">
                Category
              </label>
              <input
                id="tx-category"
                type="text"
                list="tx-category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Food"
                className="input"
              />
              <datalist id="tx-category-options">
                {categories.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:col-span-2 sm:flex-row lg:col-span-1 lg:flex-col-reverse">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary w-full sm:flex-1 lg:flex-none"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={adding}
                className="btn btn-primary w-full sm:flex-1 lg:flex-none"
              >
                {adding && <Spinner />}
                {adding
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Transaction"
                    : "Add Transaction"}
              </button>
            </div>
          </form>
        </section>

        {/* Transactions list */}
        <section className="card min-w-0 overflow-hidden">
          <CardHeader
            title="All Transactions"
            description={
              loading
                ? "Loading…"
                : `Showing ${filteredTransactions.length} transaction${
                    filteredTransactions.length !== 1 ? "s" : ""
                  }`
            }
          />

          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                aria-label="Search transactions"
                className="input pl-9"
              />
            </div>

            <div
              className="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1 sm:inline-grid"
              role="group"
              aria-label="Filter by type"
            >
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilterType(option.value)}
                  aria-pressed={filterType === option.value}
                  className={cn(
                    "h-8 rounded-md px-3 text-sm font-medium transition-colors",
                    filterType === option.value
                      ? "bg-surface text-fg shadow-xs"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ListSkeleton rows={6} />
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={TransactionsIcon}
              title="No transactions yet"
              description="Use the form to add your first income or expense."
            />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matching transactions"
              description="No transactions found for your search or filter."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              {/* Table — tablet & desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-surface-2/50 text-xs font-medium tracking-wide text-muted uppercase">
                      <th className="px-6 py-3 font-medium">Transaction</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right font-medium">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={cn(
                          "transition-colors hover:bg-surface-2/60",
                          editingId === transaction.id && "bg-primary-soft/60"
                        )}
                      >
                        <td className="max-w-0 px-6 py-3.5">
                          <p className="truncate font-medium text-fg">
                            {transaction.title}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {transaction.category}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <TypeBadge type={transaction.type} />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-muted">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3.5 text-right font-semibold whitespace-nowrap tabular-nums",
                            transaction.type === "income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatMoney(transaction.amount)}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-end gap-1">
                            <IconButton
                              label="Edit transaction"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              label="Delete transaction"
                              variant="danger"
                              onClick={() =>
                                handleDeleteTransaction(transaction.id)
                              }
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
                {filteredTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className={cn(
                      "flex items-start gap-3 px-5 py-4",
                      editingId === transaction.id && "bg-primary-soft/60"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-medium text-fg">
                          {transaction.title}
                        </p>
                        <p
                          className={cn(
                            "shrink-0 text-sm font-semibold tabular-nums",
                            transaction.type === "income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatMoney(transaction.amount)}
                        </p>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        <TypeBadge type={transaction.type} />
                        <span className="truncate">{transaction.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(transaction.transaction_date)}</span>
                      </div>
                    </div>
                    <div className="-mr-1 flex shrink-0 gap-0.5">
                      <IconButton
                        label="Edit transaction"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        label="Delete transaction"
                        variant="danger"
                        onClick={() => handleDeleteTransaction(transaction.id)}
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
      </div>
    </>
  );
}
