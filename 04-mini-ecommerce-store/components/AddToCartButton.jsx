"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product, showQuantity = true }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  function handleDecrement() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }

  function handleAdd() {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  }

  return (
    <div className="space-y-3">
      {showQuantity && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Quantity
          </span>
          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>

            <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              aria-label="Increase quantity"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={isAdding}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 px-6 font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.99] disabled:opacity-75 cursor-pointer"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>{isAdding ? "Adding to Cart..." : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}</span>
      </button>
    </div>
  );
}