"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import { useToast } from "@/context/ToastContext";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setFormData({
            name: data.product.name,
            price: data.product.price,
            description: data.product.description || "",
            image: data.product.image || "",
          });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product details");
      } finally {
        setFetching(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
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
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product details saved successfully!");
      router.push(`/products/${params.id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to update product");
      toast.error(err.message || "Failed to update product");
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { label: "Catalog", href: "/#catalog" },
    { label: formData.name || "Product", href: `/products/${params.id}` },
    { label: "Edit" },
  ];

  if (fetching) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-gray-300 border-t-gray-900" />
            <p className="text-xs font-semibold text-gray-500">Loading product information...</p>
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
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Edit Product
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Update listing pricing, description, or image URL.
              </p>
            </div>
            <Link
              href={`/products/${params.id}`}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              ← Cancel & View Product
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
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
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <Link
                    href={`/products/${params.id}`}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Live Preview */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs lg:col-span-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Preview Update
              </h3>
              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                <ProductImage
                  src={formData.image}
                  alt={formData.name}
                  className="h-44 w-full rounded-xl"
                  badge="Updating"
                />
                <h4 className="mt-3 font-semibold text-gray-900 truncate">
                  {formData.name || "Product Title"}
                </h4>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {formData.description || "Product description preview."}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    ${formData.price ? Number(formData.price).toFixed(2) : "0.00"}
                  </span>
                  <span className="rounded-lg bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                    ID: {params.id.slice(-5)}
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