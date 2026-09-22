"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const breadcrumbs = [{ label: "Cart" }];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {totalItems === 0
                  ? "Your cart is currently empty"
                  : `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
              </p>
            </div>
            {cart.length > 0 && (
              <Link
                href="/#catalog"
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
              >
                ← Continue Shopping
              </Link>
            )}
          </div>

          {cart.length === 0 ? (
            /* Enhanced Empty Cart State */
            <div className="my-12 rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
                <svg
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Looks like you haven&apos;t added any products to your cart yet. Discover our curated collection and grab your favorites!
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#catalog"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Explore Catalog
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
              {/* Cart Items List */}
              <div className="space-y-4 lg:col-span-2">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition hover:border-gray-300"
                  >
                    {/* Thumbnail */}
                    <div className="h-24 w-24 flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 rounded-xl"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        <Link href={`/products/${item._id}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Price: ${Number(item.price).toFixed(2)} each
                      </p>
                      <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
                        In Stock • Cash on Delivery Eligible
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition shadow-2xs cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>

                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition shadow-2xs cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <p className="w-20 text-right text-base font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 p-3.5 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Cash on Delivery — pay upon receipt</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 font-bold text-white shadow-sm hover:bg-black transition active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <p className="mt-3 text-center text-[11px] text-gray-400">
                  🔒 Safe & encrypted checkout
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}