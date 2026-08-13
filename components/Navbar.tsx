"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-blob bg-coral text-lg font-display text-white shadow-[3px_3px_0_0_#2B2250]">
            ✦
          </span>
          <span className="font-display text-2xl tracking-tight text-ink">
            Little Sparks
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="hidden font-body text-sm font-bold text-ink hover:text-coral sm:inline"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 font-body text-sm font-bold text-ink shadow-[2px_2px_0_0_#2B2250] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#2B2250]"
          >
            🎁 Cart
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-turquoise text-xs font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
