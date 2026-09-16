"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white hover:bg-gray-800"
    >
      Add to Cart
    </button>
  );
}