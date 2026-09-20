import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM categories ORDER BY name ASC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );

    return NextResponse.json(
      { message: "Category added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, name } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name.trim(), id]
    );

    return NextResponse.json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      { error: "Failed to update category" },
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
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      {
        error:
          "Cannot delete this category because it may be used by transactions.",
      },
      { status: 400 }
    );
  }
}