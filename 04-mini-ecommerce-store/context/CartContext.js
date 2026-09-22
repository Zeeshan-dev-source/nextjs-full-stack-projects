"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Asynchronously load initial cart from localStorage on mount
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          setCart(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, loaded]);

  function addToCart(product, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });

    toast.success(
      qty > 1
        ? `Added ${qty}× "${product.name}" to cart`
        : `Added "${product.name}" to cart`
    );
  }

  function removeFromCart(id, notify = true) {
    const itemToRemove = cart.find((item) => item._id === id);
    setCart((prev) => prev.filter((item) => item._id !== id));
    if (notify && itemToRemove) {
      toast.info(`Removed "${itemToRemove.name}" from cart`);
    }
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}