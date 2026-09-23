"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "@/components/icons";
import {
  CardHeader,
  cn,
  EmptyState,
  formatDate,
  ListSkeleton,
  PageHeader,
  Skeleton,
  StatCard,
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

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const formatMoney = useFormatMoney();

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

  const savingsRate =
    totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : null;

  const recentTransactions = transactions.slice(0, 5);

  const statValue = (value: number) =>
    loading ? <Skeleton className="h-8 w-32" /> : formatMoney(value);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your income, expenses, and recent transactions."
        actions={
          <Link href="/transactions" className="btn btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Transaction
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <StatCard
          label="Total Income"
          value={statValue(totalIncome)}
          icon={TrendingUpIcon}
          tone="income"
          hint={`${transactions.filter((t) => t.type === "income").length} income entries`}
        />
        <StatCard
          label="Total Expenses"
          value={statValue(totalExpenses)}
          icon={TrendingDownIcon}
          tone="expense"
          hint={`${transactions.filter((t) => t.type === "expense").length} expense entries`}
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard
            label="Balance"
            value={statValue(balance)}
            icon={WalletIcon}
            hint={
              savingsRate !== null
                ? `${savingsRate}% of income saved`
                : "No income recorded yet"
            }
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <section className="card overflow-hidden">
        <CardHeader
          title="Recent Transactions"
          description="Your latest five transactions."
          action={
            <Link href="/transactions" className="btn btn-secondary btn-sm">
              View All
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          }
        />

        {loading ? (
          <ListSkeleton rows={5} />
        ) : recentTransactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first income or expense to start tracking."
            action={
              <Link href="/transactions" className="btn btn-primary btn-sm">
                <PlusIcon className="h-3.5 w-3.5" />
                Add Transaction
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {recentTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:gap-4 sm:px-6"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    transaction.type === "income"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  )}
                >
                  {transaction.type === "income" ? (
                    <TrendingUpIcon className="h-[18px] w-[18px]" />
                  ) : (
                    <TrendingDownIcon className="h-[18px] w-[18px]" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-fg">
                    {transaction.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {transaction.category} ·{" "}
                    {formatDate(transaction.transaction_date)}
                  </p>
                </div>

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
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
