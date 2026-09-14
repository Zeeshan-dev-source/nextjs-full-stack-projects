import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        transactions.id,
        transactions.title,
        transactions.amount,
        transactions.type,
        DATE_FORMAT(transactions.transaction_date, '%Y-%m-%d') AS transaction_date,
        categories.name AS category
      FROM transactions
      INNER JOIN categories
        ON transactions.category_id = categories.id
      ORDER BY transactions.transaction_date DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, amount, type, category, date } = body;

    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE name = ?",
      [category]
    );

    const categories = categoryRows as { id: number }[];

    if (categories.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    const categoryId = categories[0].id;

    await pool.query(
      `
      INSERT INTO transactions
      (title, amount, type, category_id, transaction_date)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, Number(amount), type, categoryId, date]
    );

    return NextResponse.json(
      { message: "Transaction added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to add transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, title, amount, type, category, date } = body;

    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE name = ?",
      [category]
    );

    const categories = categoryRows as { id: number }[];

    if (categories.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    const categoryId = categories[0].id;

    await pool.query(
      `
      UPDATE transactions
      SET
        title = ?,
        amount = ?,
        type = ?,
        category_id = ?,
        transaction_date = ?
      WHERE id = ?
      `,
      [title, Number(amount), type, categoryId, date, id]
    );

    return NextResponse.json({
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    await pool.query(
      "DELETE FROM transactions WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}