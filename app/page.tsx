import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic"; // always fetch fresh catalog/stock data, never statically exported at build time

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data: products, error } = await query;

  const categories = ["toys", "clothing", "books", "birthday"];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="relative mb-10 overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gradient-to-br from-bubblegum via-coral to-sunshine p-8 text-center shadow-[6px_6px_0_0_#241C4A] sm:p-16">
        <span className="absolute -left-4 -top-4 h-20 w-20 rounded-blob bg-lime/70 sm:h-28 sm:w-28" />
        <span className="absolute -bottom-6 -right-2 h-24 w-24 rounded-blob bg-sky/70 sm:h-32 sm:w-32" />
        <span className="absolute right-8 top-6 h-10 w-10 rounded-blob bg-grape/60 sm:h-14 sm:w-14" />
        <div className="relative">
          <span className="mb-3 inline-block rounded-full bg-white/90 px-4 py-1 font-display text-sm text-ink shadow-[2px_2px_0_0_#241C4A]">
            ✦ Welcome to Leona ✦
          </span>
          <h1 className="font-display text-4xl leading-tight text-white drop-shadow-[2px_2px_0_#241C4A] sm:text-6xl">
            Gifts that make small faces light up
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-white/95 drop-shadow-[1px_1px_0_#241C4A]">
            Handpicked toys, books, clothing and birthday finds for babies, toddlers
            and kids — delivered across India.
          </p>
        </div>
      </section>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          className={`rounded-full border-2 border-ink px-4 py-2 font-body text-sm font-bold shadow-[2px_2px_0_0_#241C4A] transition hover:-translate-y-0.5 ${
            !searchParams.category ? "bg-grape text-white" : "bg-white text-ink"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/?category=${cat}`}
            className={`rounded-full border-2 border-ink px-4 py-2 font-body text-sm font-bold capitalize shadow-[2px_2px_0_0_#241C4A] transition hover:-translate-y-0.5 ${
              searchParams.category === cat ? "bg-grape text-white" : "bg-white text-ink"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {error && (
        <p className="rounded-2xl border-2 border-coral bg-white p-6 text-center font-body text-coral-dark">
          Couldn&apos;t load the catalog. Check your Supabase environment variables.
        </p>
      )}

      {!error && (!products || products.length === 0) && (
        <div className="rounded-[2rem] border-2 border-dashed border-ink/30 bg-white/50 p-12 text-center font-body text-ink/60">
          No products yet — add some rows to the <code>products</code> table in
          Supabase (or upload via the dashboard) and they&apos;ll show up here.
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {(products as Product[] | null)?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
