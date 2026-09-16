"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-black underline">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-xs text-gray-500">Image</span>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="h-8 w-8 rounded-lg border text-gray-700 hover:bg-gray-50"
                >
                  −
                </button>

                <span className="w-6 text-center">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="h-8 w-8 rounded-lg border text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <Link
            href="/checkout"
            className="mt-6 block w-full rounded-lg bg-black py-3 text-center font-semibold text-white hover:bg-gray-800"
            >
            Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}