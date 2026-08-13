"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      disabled={product.stock <= 0}
      className="rounded-full bg-coral px-6 py-3 font-body font-bold text-white shadow-[3px_3px_0_0_#2B2250] transition hover:-translate-y-0.5 hover:bg-coral-dark disabled:cursor-not-allowed disabled:bg-ink/20 disabled:shadow-none"
    >
      {product.stock <= 0 ? "Sold out" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
