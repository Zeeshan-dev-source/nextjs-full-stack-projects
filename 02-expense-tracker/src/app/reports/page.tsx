"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CategoryReport = {
  category: string;
  total: string | number;
};

type MonthlyReport = {
  year: number;
  month: number;
  income: string | number;
  expenses: string | number;
};

type ReportData = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: CategoryReport[];
  monthly: MonthlyReport[];
};

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();

        setReport(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  const categoryChartData =
  report?.expensesByCategory.map((item) => ({
    category: item.category,
    total: Number(item.total),
  })) || [];

  const balanceChartData =
  report?.monthly.map((item) => ({
    month: new Date(
      item.year,
      item.month - 1
    ).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    }),
    balance: Number(item.income) - Number(item.expenses),
  })) || [];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-gray-500 dark:text-gray-400">Failed to load reports.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Reports
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          View your income, expenses, and spending breakdown.
        </p>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Rs. {report.totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Rs. {report.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Rs. {report.balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expenses by Category */}
<div className="mb-8 rounded-xl bg-white p-6 shadow dark:bg-gray-900">
  <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
    Expenses by Category
  </h2>


  {report.expensesByCategory.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">
      No expense data available.
    </p>
  ) : (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="w-48 h-64">
        
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        data={categoryChartData}
        >
      <XAxis
        dataKey="category"
        tick={{ fill: "currentColor" }}
        />

        <YAxis
        tick={{ fill: "currentColor" }}
        />
    
      <Tooltip
        cursor={false}
        formatter={(value) =>
            `Rs. ${Number(value).toLocaleString()}`
        }
        />
      <Bar dataKey="total" fill="#2563eb" />
    </BarChart>
  </ResponsiveContainer>
</div>
      
    </div>
  )}
</div>

        {/* Monthly Report */}
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
  <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
    Monthly Income & Expenses
  </h2>

  {report.monthly.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">
      No monthly data available.
    </p>
  ) : (
    <>
      <div className="w-50 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            data={report.monthly.map((item) => ({
              month: new Date(
                item.year,
                item.month - 1
              ).toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              }),
              income: Number(item.income),
              expenses: Number(item.expenses),
            }))}
          >
            <XAxis
                dataKey="month"
                tick={{ fill: "currentColor" }}
                />

                <YAxis
                tick={{ fill: "currentColor" }}
                />
             
                <Tooltip
                cursor={false}
                formatter={(value) =>
                    `Rs. ${Number(value).toLocaleString()}`
                }
                />

            <Bar
              dataKey="income"
              name="Income"
              fill="#16a34a"
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#dc2626"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {report.monthly.map((item) => (
          <div
            key={`${item.year}-${item.month}`}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <p className="mb-3 font-medium text-gray-900 dark:text-white">
              {new Date(
                item.year,
                item.month - 1
              ).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Income
              </span>

              <span className="font-medium text-gray-900 dark:text-white">
                Rs. {Number(item.income).toLocaleString()}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Expenses
              </span>

              <span className="font-medium text-gray-900 dark:text-white">
                Rs. {Number(item.expenses).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
      </div>
    </main>
  );
}