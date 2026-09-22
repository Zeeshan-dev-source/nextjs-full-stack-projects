import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

async function getOrder(id) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/orders/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.order;
  } catch (error) {
    console.error("Failed to fetch order confirmation:", error);
    return null;
  }
}

export default async function OrderConfirmation({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
          <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xs">
            <h1 className="text-xl font-bold text-gray-900">Order Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">
              We couldn&apos;t locate an order with the provided identifier.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black transition"
            >
              Back to Home
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

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-xs">
          {/* Success Check Badge */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="text-center mt-6">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
              Order Confirmed
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              Thank You for Your Order!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              We have received your order, <strong className="text-gray-900">{order.customerName}</strong>. A dispatch notification will follow shortly.
            </p>
          </div>

          {/* Order Progress Tracker */}
          <div className="mt-8 rounded-2xl bg-gray-50/80 p-5 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 text-center sm:text-left">
              Delivery Timeline
            </h3>
            <div className="grid grid-cols-4 text-center gap-2 text-xs">
              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                  ✓
                </div>
                <p className="mt-1.5 font-bold text-gray-900">Received</p>
                <p className="text-[10px] text-gray-400">Just now</p>
              </div>

              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white font-bold text-[11px] animate-pulse">
                  2
                </div>
                <p className="mt-1.5 font-bold text-gray-900">Packing</p>
                <p className="text-[10px] text-gray-400">In Progress</p>
              </div>

              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-400 font-bold text-[11px]">
                  3
                </div>
                <p className="mt-1.5 font-medium text-gray-500">Shipped</p>
                <p className="text-[10px] text-gray-400">Next</p>
              </div>

              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-400 font-bold text-[11px]">
                  4
                </div>
                <p className="mt-1.5 font-medium text-gray-500">Delivered</p>
                <p className="text-[10px] text-gray-400">Pending</p>
              </div>
            </div>
          </div>

          {/* Order Meta Info */}
          <div className="mt-6 rounded-2xl bg-gray-50 p-5 border border-gray-100 text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-gray-900">{order._id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Option:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <span>💵</span> Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500">Deliver To:</span>
              <span className="max-w-[280px] text-right font-medium text-gray-900">
                {order.address}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Contact:</span>
              <span className="font-medium text-gray-900">
                {order.email} • {order.phone}
              </span>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Items Ordered
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-400">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-black text-gray-900">
              <span>Total Payable</span>
              <span className="text-xl">${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-95"
            >
              Continue Shopping
            </Link>
            <Link
              href="/#reviews"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white py-3.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
            >
              Read Customer Reviews
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}