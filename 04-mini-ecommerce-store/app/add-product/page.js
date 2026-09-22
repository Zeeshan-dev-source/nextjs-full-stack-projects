"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import { useToast } from "@/context/ToastContext";

export default function AddProduct() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success(`Product "${formData.name}" created successfully!`);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to add product");
      toast.error(err.message || "Failed to add product");
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { label: "Admin", href: "/admin/products" },
    { label: "Add Product" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Add New Product
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Enter details to add a new item to your online catalog.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Inventory
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Form */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
              {error && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Price ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    placeholder="29.99"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Provide a compelling description of features, materials, and benefits..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Leave blank to automatically use our stylized placeholder design.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Publishing Product..." : "Publish to Store"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Card Preview */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs lg:col-span-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Card Preview
              </h3>
              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                <ProductImage
                  src={formData.image}
                  alt={formData.name || "Preview"}
                  className="h-44 w-full rounded-xl"
                  badge="Preview"
                />
                <h4 className="mt-3 font-semibold text-gray-900 truncate">
                  {formData.name || "Product Title Preview"}
                </h4>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {formData.description || "The product description will appear here as you type."}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    ${formData.price ? Number(formData.price).toFixed(2) : "0.00"}
                  </span>
                  <span className="rounded-lg bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}