"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalPaise: number;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "leona-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        // ignore corrupt cart data
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  function addItem(product: Product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price_paise: product.price_paise,
          image_url: product.image_url,
          qty,
        },
      ];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, qty } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const totalPaise = items.reduce((sum, i) => sum + i.price_paise * i.qty, 0);
  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clear, totalPaise, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
