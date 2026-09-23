"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertIcon,
  ChartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "@/components/icons";
import {
  CardHeader,
  cn,
  EmptyState,
  PageHeader,
  Skeleton,
  StatCard,
} from "@/components/ui";
import { useFormatMoney, useResolvedTheme } from "@/lib/preferences";

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

const chartColors = {
  light: {
    grid: "#eaecf0",
    tick: "#667085",
    cursor: "rgba(16, 24, 40, 0.04)",
    primary: "#6366f1",
    income: "#10b981",
    expense: "#f43f5e",
  },
  dark: {
    grid: "#242a36",
    tick: "#9aa3b2",
    cursor: "rgba(255, 255, 255, 0.04)",
    primary: "#818cf8",
    income: "#34d399",
    expense: "#fb7185",
  },
};

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const formatMoney = useFormatMoney();
  const colors = chartColors[useResolvedTheme()];

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();

        setReport(response.ok ? data : null);
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

  const monthlyChartData =
    report?.monthly.map((item) => ({
      month: new Date(item.year, item.month - 1).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
      income: Number(item.income),
      expenses: Number(item.expenses),
    })) || [];

  const balanceChartData =
    report?.monthly.map((item) => {
      const balance = Number(item.income) - Number(item.expenses);

      return {
        month: new Date(item.year, item.month - 1).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        surplus: balance >= 0 ? balance : 0,
        deficit: balance < 0 ? balance : 0,
      };
    }) || [];

  const axisProps = {
    tick: { fill: colors.tick, fontSize: 12 },
    tickLine: false,
    axisLine: false,
  };

  const tooltipProps = {
    cursor: { fill: colors.cursor },
    formatter: (value: unknown) => formatMoney(Number(value)),
    contentStyle: {
      backgroundColor: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
      fontSize: 13,
    },
    labelStyle: { color: "var(--fg)", fontWeight: 600, marginBottom: 4 },
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Reports"
          description="View your income, expenses, and spending breakdown."
        />
        <div className="mb-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-[124px] rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <PageHeader
          title="Reports"
          description="View your income, expenses, and spending breakdown."
        />
        <div className="card">
          <EmptyState
            icon={AlertIcon}
            title="Failed to load reports"
            description="Something went wrong while fetching your report data."
            action={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-secondary btn-sm"
              >
                Try again
              </button>
            }
          />
        </div>
      </>
    );
  }

  const savingsRate =
    report.totalIncome > 0
      ? Math.round((report.balance / report.totalIncome) * 100)
      : null;

  return (
    <>
      <PageHeader
        title="Reports"
        description="View your income, expenses, and spending breakdown."
      />

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <StatCard
          label="Total Income"
          value={formatMoney(report.totalIncome)}
          icon={TrendingUpIcon}
          tone="income"
        />
        <StatCard
          label="Total Expenses"
          value={formatMoney(report.totalExpenses)}
          icon={TrendingDownIcon}
          tone="expense"
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard
            label="Balance"
            value={formatMoney(report.balance)}
            icon={WalletIcon}
            hint={
              savingsRate !== null
                ? `${savingsRate}% of income saved`
                : "No income recorded yet"
            }
          />
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        {/* Expenses by Category */}
        <section className="card min-w-0 overflow-hidden">
          <CardHeader
            title="Expenses by Category"
            description="Where your money goes."
          />
          <div className="p-4 sm:p-6">
            {categoryChartData.length === 0 ? (
              <EmptyState
                icon={ChartIcon}
                title="No expense data available"
                description="Add some expenses to see your spending breakdown."
              />
            ) : (
              <div
                style={{
                  height: Math.max(240, categoryChartData.length * 44),
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryChartData}
                    margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke={colors.grid}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      type="number"
                      {...axisProps}
                      tickFormatter={(value) => compactNumber.format(value)}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={96}
                      {...axisProps}
                    />
                    <Tooltip {...tooltipProps} />
                    <Bar
                      dataKey="total"
                      name="Spent"
                      fill={colors.primary}
                      radius={[0, 6, 6, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* Monthly Income & Expenses */}
        <section className="card min-w-0 overflow-hidden">
          <CardHeader
            title="Monthly Income & Expenses"
            description="Compare what comes in with what goes out."
          />
          <div className="p-4 sm:p-6">
            {monthlyChartData.length === 0 ? (
              <EmptyState
                icon={ChartIcon}
                title="No monthly data available"
                description="Monthly trends appear once you add transactions."
              />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyChartData}
                    margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke={colors.grid}
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="month" {...axisProps} />
                    <YAxis
                      width={52}
                      {...axisProps}
                      tickFormatter={(value) => compactNumber.format(value)}
                    />
                    <Tooltip {...tooltipProps} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                    />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill={colors.income}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="expenses"
                      name="Expenses"
                      fill={colors.expense}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>
      </div>

      {report.monthly.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-5">
          {/* Net balance per month */}
          <section className="card min-w-0 overflow-hidden xl:col-span-2">
            <CardHeader
              title="Net Balance"
              description="Monthly surplus or deficit."
            />
            <div className="h-72 p-4 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={balanceChartData}
                  stackOffset="sign"
                  margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke={colors.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis
                    width={52}
                    {...axisProps}
                    tickFormatter={(value) => compactNumber.format(value)}
                  />
                  <Tooltip {...tooltipProps} />
                  <Bar
                    dataKey="surplus"
                    name="Surplus"
                    stackId="net"
                    fill={colors.income}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="deficit"
                    name="Deficit"
                    stackId="net"
                    fill={colors.expense}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Monthly breakdown */}
          <section className="card min-w-0 overflow-hidden xl:col-span-3">
            <CardHeader
              title="Monthly Breakdown"
              description="Income, expenses and net result per month."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-2/50 text-xs font-medium tracking-wide text-muted uppercase">
                    <th className="px-5 py-3 font-medium sm:px-6">Month</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Income
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Expenses
                    </th>
                    <th className="px-5 py-3 text-right font-medium sm:px-6">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[...report.monthly].reverse().map((item) => {
                    const net = Number(item.income) - Number(item.expenses);

                    return (
                      <tr
                        key={`${item.year}-${item.month}`}
                        className="transition-colors hover:bg-surface-2/60"
                      >
                        <td className="px-5 py-3.5 font-medium whitespace-nowrap text-fg sm:px-6">
                          {new Date(item.year, item.month - 1).toLocaleString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap text-fg tabular-nums">
                          {formatMoney(item.income)}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap text-fg tabular-nums">
                          {formatMoney(item.expenses)}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3.5 text-right font-semibold whitespace-nowrap tabular-nums sm:px-6",
                            net >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {net >= 0 ? "+" : ""}
                          {formatMoney(net)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
