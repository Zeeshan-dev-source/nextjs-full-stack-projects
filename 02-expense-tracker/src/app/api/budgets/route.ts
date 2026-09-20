import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        budgets.id,
        budgets.category_id,
        categories.name AS category,
        budgets.amount,
        budgets.month,
        budgets.year
      FROM budgets
      INNER JOIN categories
        ON budgets.category_id = categories.id
      ORDER BY budgets.year DESC, budgets.month DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Budgets API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { categoryId, amount, month, year } = body;

    if (!categoryId || !amount || !month || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO budgets
      (category_id, amount, month, year)
      VALUES (?, ?, ?, ?)
      `,
      [
        Number(categoryId),
        Number(amount),
        Number(month),
        Number(year),
      ]
    );

    return NextResponse.json(
      { message: "Budget added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Budgets API error:", error);

    return NextResponse.json(
      { error: "Failed to add budget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, categoryId, amount, month, year } = body;

    if (!id || !categoryId || !amount || !month || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE budgets
      SET
        category_id = ?,
        amount = ?,
        month = ?,
        year = ?
      WHERE id = ?
      `,
      [
        Number(categoryId),
        Number(amount),
        Number(month),
        Number(year),
        Number(id),
      ]
    );

    return NextResponse.json({
      message: "Budget updated successfully",
    });
  } catch (error) {
    console.error("Budgets API error:", error);

    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM budgets WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Budgets API error:", error);

    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}