"use client";

import { useEffect, useState } from "react";
import { PencilIcon, PlusIcon, TagIcon, TrashIcon } from "@/components/icons";
import {
  CardHeader,
  cn,
  EmptyState,
  IconButton,
  PageHeader,
  Skeleton,
  Spinner,
} from "@/components/ui";

type Category = {
  id: number;
  name: string;
};

const avatarTones = [
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
  "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
  "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
];

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

        setCategories(Array.isArray(data) ? data : []);
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
      setEditingId(null);

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
      document.getElementById("category-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      document.getElementById("category-name")?.focus({ preventScroll: true });
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
        currentCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Something went wrong");
    }
  }

  const isEditing = editingId !== null;

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage your expense and income categories."
      />

      <section
        id="category-form"
        className={cn(
          "card mb-6 scroll-mt-24 overflow-hidden",
          isEditing && "ring-2 ring-primary/30"
        )}
      >
        <CardHeader
          title={isEditing ? "Edit Category" : "New Category"}
          description={
            isEditing
              ? "Rename this category."
              : "Categories group your transactions and budgets."
          }
          icon={isEditing ? PencilIcon : PlusIcon}
        />

        <form
          onSubmit={handleAddCategory}
          className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6"
        >
          <label htmlFor="category-name" className="sr-only">
            Category name
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name, e.g. Groceries"
            className="input sm:flex-1"
          />

          <div className="flex gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                }}
                className="btn btn-secondary flex-1 sm:flex-none"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={adding}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              {adding ? <Spinner /> : !isEditing && <PlusIcon className="h-4 w-4" />}
              {adding
                ? "Saving..."
                : isEditing
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </section>

      <section className="card overflow-hidden">
        <CardHeader
          title="All Categories"
          description={
            loading
              ? "Loading…"
              : `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`
          }
        />

        {loading ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={TagIcon}
            title="No categories yet"
            description="Create a category above to start organizing transactions."
          />
        ) : (
          <ul className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {categories.map((category, index) => (
              <li
                key={category.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-line p-3 pl-4 transition-colors hover:border-line-strong hover:bg-surface-2/50",
                  editingId === category.id &&
                    "border-primary/40 bg-primary-soft/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold uppercase",
                    avatarTones[index % avatarTones.length]
                  )}
                >
                  {category.name.charAt(0)}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                  {category.name}
                </p>
                <div className="flex shrink-0 gap-0.5">
                  <IconButton
                    label={`Edit ${category.name}`}
                    onClick={() => handleEditCategory(category)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={`Delete ${category.name}`}
                    variant="danger"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
