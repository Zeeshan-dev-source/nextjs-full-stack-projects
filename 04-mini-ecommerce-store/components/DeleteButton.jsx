"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id, className }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className={
        className ||
        "w-full rounded-lg border border-red-300 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      }
    >
      Delete
    </button>
  );
}