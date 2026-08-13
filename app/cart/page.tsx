"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatINR } from "@/lib/types";

export default function CartPage() {
  const { items, setQty, removeItem, totalPaise } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-5xl">🎈</p>
        <h1 className="mt-4 font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 font-body text-ink/60">Let&apos;s find something fun.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-coral px-6 py-3 font-body font-bold text-white shadow-[3px_3px_0_0_#2B2250]"
        >
          Browse gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">Your cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4 shadow-[3px_3px_0_0_#2B2250]"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🧸</div>
              )}
            </div>

            <div className="flex-1">
              <p className="font-display text-ink">{item.name}</p>
              <p className="font-body text-sm text-ink/60">{formatINR(item.price_paise)} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(item.product_id, item.qty - 1)}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink font-bold text-ink"
              >
                −
              </button>
              <span className="w-6 text-center font-body font-bold">{item.qty}</span>
              <button
                onClick={() => setQty(item.product_id, item.qty + 1)}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink font-bold text-ink"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.product_id)}
              className="font-body text-sm font-bold text-coral hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border-2 border-ink bg-sunshine/40 p-5">
        <span className="font-display text-xl text-ink">Total</span>
        <span className="font-display text-2xl text-ink">{formatINR(totalPaise)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block rounded-full bg-coral py-4 text-center font-body text-lg font-bold text-white shadow-[3px_3px_0_0_#2B2250] transition hover:bg-coral-dark"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
