"use client";

import { useEffect, useState } from "react";


type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
  e.preventDefault();

  if (!name.trim()) {
    alert("Please enter a category name");
    return;
  }

  setAdding(true);

  try {
    const response = await fetch("/api/categories", {
      method: editingId !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        editingId !== null
            ? {
                id: editingId,
                name: name.trim(),
            }
            : {
                name: name.trim(),
            }
        ),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to add category");
      return;
    }

    setName("");

    const refreshResponse = await fetch("/api/categories");
    const refreshedCategories = await refreshResponse.json();

    setCategories(refreshedCategories);
  } catch (error) {
    console.error("Failed to add category:", error);
    alert("Something went wrong");
  } finally {
    setAdding(false);
  }
}

function handleEditCategory(category: Category) {
  setEditingId(category.id);
  setName(category.name);

  setTimeout(() => {
    document
      .getElementById("category-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, 0);
}

async function handleDeleteCategory(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to delete category");
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category.id !== id
      )
    );
  } catch (error) {
    console.error("Failed to delete category:", error);
    alert("Something went wrong");
  }
}

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <form
            id="category-form"
            onSubmit={handleAddCategory}
            className="mb-8 flex gap-3"
>
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded-lg border border-gray-400 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <button
            type="submit"
            disabled={adding}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
             {adding
                ? "Saving..."
                : editingId !== null
                ? "Update Category"
                : "Add Category"}
        </button>
        {editingId !== null && (
        <button
            type="button"
            onClick={() => {
            setEditingId(null);
            setName("");
            }}
            className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
            Cancel Edit
        </button>
        )}
        </form>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Manage your expense and income categories.
        </p>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            All Categories
          </h2>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No categories yet.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                    <p className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                    </p>

                    <div className="flex gap-2">
                        <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="ml-4 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                  
                        Edit
                        </button>

                    <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="ml-4 rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        >
                        Delete
                    </button>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}