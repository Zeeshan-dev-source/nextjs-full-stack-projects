"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

// Helper to determine product badge / category tag
function getCategoryTag(product) {
  if (product.category) return product.category;
  const name = (product.name || "").toLowerCase();

  if (name.includes("headphone") || name.includes("audio") || name.includes("earphone") || name.includes("speaker")) {
    return "Audio";
  }
  if (name.includes("watch") || name.includes("smart") || name.includes("band")) {
    return "Wearables";
  }
  if (name.includes("bag") || name.includes("pack") || name.includes("wallet") || name.includes("case")) {
    return "Accessories";
  }
  if (name.includes("lamp") || name.includes("light") || name.includes("desk") || name.includes("chair")) {
    return "Living";
  }
  if (product.price < 30) {
    return "Value Deals";
  }
  return "Featured";
}

export default function ProductCatalog({ initialProducts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Extract unique category tags
  const categories = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      set.add(getCategoryTag(p));
    });
    return ["All", ...Array.from(set)];
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (product.name || "").toLowerCase().includes(q);
          const matchDesc = (product.description || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          const tag = getCategoryTag(product);
          if (tag !== selectedCategory) return false;
        }

        // Min price
        if (minPrice !== "" && !isNaN(Number(minPrice))) {
          if (product.price < Number(minPrice)) return false;
        }

        // Max price
        if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
          if (product.price > Number(maxPrice)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "newest") {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        }
        return 0; // Default order
      });
  }, [initialProducts, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "featured";

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
  }

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-6 py-12 scroll-mt-20">
      {/* Header & Controls Bar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pb-8 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            <span>Catalog</span>
            <span>•</span>
            <span>{filteredProducts.length} Items</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            Explore Collection
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Find the perfect item by searching, filtering by price, or selecting categories.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-80">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Price & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range inputs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-2xs">
            <span className="font-medium text-gray-500">Price:</span>
            <input
              type="number"
              min="0"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-gray-800 shadow-2xs transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      <div className="mt-8">
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              We couldn’t find any items matching your current filters. Try changing your search query or reset your filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-95 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
