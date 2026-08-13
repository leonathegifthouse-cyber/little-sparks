import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  const p = product as Product;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-[6px_6px_0_0_#2B2250]">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🧸</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-3 w-fit rounded-full bg-turquoise px-3 py-1 font-body text-xs font-bold capitalize text-white">
            {p.category} · Ages {p.age_group}
          </span>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{p.name}</h1>
          <p className="mt-4 font-body text-ink/70">{p.description}</p>
          <p className="mt-6 font-display text-3xl text-ink">{formatINR(p.price_paise)}</p>
          <div className="mt-6">
            <AddToCartButton product={p} />
          </div>
          <p className="mt-3 font-body text-sm text-ink/50">
            {p.stock > 0 ? `${p.stock} in stock` : "Currently sold out"}
          </p>
        </div>
      </div>
    </div>
  );
}
