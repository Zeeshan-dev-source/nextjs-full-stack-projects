"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import DeleteButton from "@/components/DeleteButton";

export default function AdminProductList({ initialProducts = [] }) {
  const [search, setSearch] = useState("");

  const filtered = initialProducts.filter((product) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (product.name || "").toLowerCase().includes(q) ||
      (product.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products in inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 shadow-2xs focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <Link
          href="/add-product"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-black transition active:scale-95"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Table Content */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-xs">
          <p className="text-sm font-medium text-gray-900">No products found</p>
          <p className="mt-1 text-xs text-gray-400">
            {search ? "No products matched your search term." : "Your store inventory is currently empty."}
          </p>
          {!search && (
            <Link
              href="/add-product"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
            >
              + Add First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Added Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product._id} className="transition hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[180px] sm:max-w-xs">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="rounded-lg bg-gray-100 px-2 py-1 font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/products/${product._id}/edit`}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                        >
                          Edit
                        </Link>
                        <div className="w-18">
                          <DeleteButton
                            id={product._id}
                            redirectTo="/admin/products"
                            className="w-full rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
