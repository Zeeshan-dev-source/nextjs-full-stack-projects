"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";

// Helper to determine a badge tag without changing the database schema
function getProductBadge(product) {
  if (product.category) return product.category;
  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();

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
    return "Best Value";
  }
  return "Trending";
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const badge = getProductBadge(product);

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
      <div>
        <Link href={`/products/${product._id}`} className="block overflow-hidden rounded-xl">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-52 w-full transition-transform duration-500 group-hover:scale-105"
            badge={badge}
          />
        </Link>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {badge}
            </span>
            <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 group-hover:text-black transition">
              <Link href={`/products/${product._id}`}>
                {product.name}
              </Link>
            </h3>
          </div>
          <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-base font-bold text-gray-900 shadow-2xs">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {product.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <Link
          href={`/products/${product._id}`}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-[0.98] cursor-pointer"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}