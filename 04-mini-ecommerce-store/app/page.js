import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const data = await res.json();

  return data.products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl bg-gray-900 px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-bold sm:text-5xl">
            Welcome to MiniStore
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Discover great products at simple and affordable prices.
          </p>

          <Link
            href="#products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}