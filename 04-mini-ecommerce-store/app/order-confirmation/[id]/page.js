import Link from "next/link";

async function getOrder(id) {
  const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data.order;
}

export default async function OrderConfirmation({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/" className="mt-4 inline-block text-black underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-2 text-gray-600">
          Thank you, {order.customerName}. Your order has been received.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Order ID:</span>{" "}
            {order._id}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Payment:</span> Cash
            on Delivery
          </p>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Delivery to:</span>{" "}
            {order.address}
          </p>
        </div>

        <div className="mt-6 space-y-2 text-left">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t pt-4 font-semibold text-gray-900">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}