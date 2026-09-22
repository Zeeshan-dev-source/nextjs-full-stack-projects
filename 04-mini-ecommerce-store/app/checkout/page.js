"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      toast.success("🎉 Order placed successfully!");
      clearCart();
      router.push(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Failed to place order");
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { label: "Cart", href: "/cart" },
    { label: "Checkout" },
  ];

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
          <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-500">
              You need at least one item in your cart before you can proceed to checkout.
            </p>
            <Link
              href="/#catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black transition"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Complete Your Order
          </h1>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Delivery Details Form */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Shipping & Contact Information
                </h2>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-700 flex items-center gap-2">
                  <svg className="h-4 w-4 text-rose-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    required
                    placeholder="Street name, apartment, suite, city, state and postal code"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                {/* Payment method selection */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 pb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      2
                    </span>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-xs text-gray-500">
                            Pay in cash directly to the courier upon delivery
                          </p>
                        </div>
                      </div>
                      <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                        Zero Fee
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 font-bold text-white shadow-md hover:bg-black transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • ${totalPrice.toFixed(2)}</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Review Sidebar */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-5">
              <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="py-3 flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      <ProductImage src={item.image} alt={item.name} className="h-12 w-12 rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-xl font-black">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-3.5 border border-gray-100 text-[11px] text-gray-500 space-y-1.5">
                <p className="flex items-center gap-1.5 font-medium text-gray-700">
                  <span>🛡️</span> 100% Satisfaction Guarantee
                </p>
                <p>You can check the contents of your parcel before paying the courier.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}