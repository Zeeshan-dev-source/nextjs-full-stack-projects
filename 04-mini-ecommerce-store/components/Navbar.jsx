"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-gray-900 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm transition group-hover:bg-black group-hover:scale-105">
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </span>
          <span className="font-black text-gray-900">
            Mini<span className="text-gray-500 font-semibold">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-600 transition hover:text-gray-900"
          >
            Catalog
          </Link>
          <Link
            href="/#reviews"
            className="text-gray-600 transition hover:text-gray-900"
          >
            Reviews
          </Link>
          <Link
            href="/admin/products"
            className="text-gray-600 transition hover:text-gray-900"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 shadow-2xs transition hover:bg-gray-50 hover:text-gray-950 active:scale-95"
            aria-label={`Cart with ${totalItems} items`}
          >
            <svg
              className="h-4 w-4 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-bold text-white transition-transform animate-pulse-subtle">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/add-product"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden shadow-lg animate-toast">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Catalog
            </Link>
            <Link
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Customer Reviews
            </Link>
            <Link
              href="/admin/products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/add-product"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              + Add Product
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900"
            >
              <span>View Cart</span>
              <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {totalItems} items
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}