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
      <section className="mb-10 rounded-[2.5rem] border-2 border-ink bg-white p-8 text-center shadow-[6px_6px_0_0_#2B2250] sm:p-14">
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Gifts that make small faces light up
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-ink/70">
          Handpicked toys, books, clothing and birthday finds for babies, toddlers
          and kids — delivered across India.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          className={`rounded-full border-2 border-ink px-4 py-2 font-body text-sm font-bold ${
            !searchParams.category ? "bg-ink text-white" : "bg-white text-ink"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/?category=${cat}`}
            className={`rounded-full border-2 border-ink px-4 py-2 font-body text-sm font-bold capitalize ${
              searchParams.category === cat ? "bg-ink text-white" : "bg-white text-ink"
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
