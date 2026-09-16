import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id) {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data.product;
}

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-black underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-600 hover:text-black">
          ← Back to Products
        </Link>

        <div className="mt-6 grid gap-8 rounded-xl bg-white p-8 shadow-sm sm:grid-cols-2">
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200">
            <span className="text-gray-500">Product Image</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-4 text-gray-600">
              {product.description || "No description available."}
            </p>

            <AddToCartButton product={product} />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/products/${product._id}/edit`}
                className="rounded-lg border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit Product
              </Link>

              <DeleteButton id={product._id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}