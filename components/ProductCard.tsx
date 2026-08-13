"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/types";
import { useCart } from "./CartProvider";

const badgeColors: Record<string, string> = {
  toys: "bg-turquoise",
  clothing: "bg-bubblegum",
  books: "bg-sky",
  birthday: "bg-grape",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const badge = badgeColors[product.category] ?? "bg-turquoise";
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[4px_4px_0_0_#241C4A] transition duration-200 hover:-translate-y-1.5 hover:shadow-[7px_7px_0_0_#241C4A]">
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl transition duration-300 group-hover:scale-110">
            🧸
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full ${badge} px-3 py-1 font-body text-xs font-bold capitalize text-white shadow-[1px_1px_0_0_#241C4A]`}
        >
          {product.category}
        </span>
        {lowStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 font-body text-xs font-bold text-white">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display text-lg leading-tight text-ink transition group-hover:text-coral">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-sm text-ink/50">Ages {product.age_group}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xl text-ink">
            {formatINR(product.price_paise)}
          </span>
          <button
            onClick={() => {
              addItem(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 1300);
            }}
            disabled={product.stock <= 0}
            className={`rounded-full px-4 py-2 font-body text-sm font-bold text-white shadow-[2px_2px_0_0_#241C4A] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#241C4A] disabled:cursor-not-allowed disabled:bg-ink/20 disabled:shadow-none ${
              added ? "bg-lime" : "bg-coral hover:bg-coral-dark"
            }`}
          >
            {product.stock <= 0 ? "Sold out" : added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
