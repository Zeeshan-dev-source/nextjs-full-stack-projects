import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Total income
    const [incomeRows] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalIncome
      FROM transactions
      WHERE type = 'income'
    `);

    // Total expenses
    const [expenseRows] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalExpenses
      FROM transactions
      WHERE type = 'expense'
    `);

    // Expenses by category
    const [categoryRows] = await pool.query(`
      SELECT
        categories.name AS category,
        SUM(transactions.amount) AS total
      FROM transactions
      INNER JOIN categories
        ON transactions.category_id = categories.id
      WHERE transactions.type = 'expense'
      GROUP BY categories.id, categories.name
      ORDER BY total DESC
    `);

    // Monthly income and expenses
    const [monthlyRows] = await pool.query(`
      SELECT
        YEAR(transaction_date) AS year,
        MONTH(transaction_date) AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
        FROM transactions
        GROUP BY YEAR(transaction_date), MONTH(transaction_date)
        ORDER BY year ASC, month ASC
    `);

    const income = Number(
      (incomeRows as { totalIncome: string | number }[])[0].totalIncome
    );

    const expenses = Number(
      (expenseRows as { totalExpenses: string | number }[])[0].totalExpenses
    );

    return NextResponse.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expensesByCategory: categoryRows,
      monthly: monthlyRows,
    });
  } catch (error) {
    console.error("Reports API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}