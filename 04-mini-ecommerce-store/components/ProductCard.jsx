"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gray-200">
        <span className="text-gray-500">Product Image</span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900">
        {product.name}
      </h3>

      <p className="mt-2 text-gray-600">
        ${product.price.toFixed(2)}
      </p>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/products/${product._id}`}
          className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Details
        </Link>

        <button
          onClick={() => addToCart(product)}
          className="flex-1 rounded-lg bg-black py-2 text-sm text-white hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}