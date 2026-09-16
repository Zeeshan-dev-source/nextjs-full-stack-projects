"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          MiniStore
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            Products
          </Link>

          <Link href="/cart" className="text-gray-700 hover:text-black">
            Cart ({totalItems}) 
          </Link>

          <Link
              href="/admin/products"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}