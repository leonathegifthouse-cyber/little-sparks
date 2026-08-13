"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/types";
import { useCart } from "./CartProvider";

const badgeColors: Record<string, string> = {
  toys: "bg-turquoise",
  clothing: "bg-bubblegum",
  books: "bg-sunshine",
  birthday: "bg-coral",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const badge = badgeColors[product.category] ?? "bg-turquoise";

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[4px_4px_0_0_#2B2250] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#2B2250]">
      <Link href={`/product/${product.id}`} className="relative block aspect-square bg-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🧸</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full ${badge} px-3 py-1 font-body text-xs font-bold capitalize text-white`}
        >
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
        </Link>
        <p className="font-body text-sm text-ink/60">Ages {product.age_group}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-ink">
            {formatINR(product.price_paise)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="rounded-full bg-coral px-4 py-2 font-body text-sm font-bold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            {product.stock > 0 ? "Add" : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}
