import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic"; // always fetch fresh catalog/stock data, never statically exported at build time

const categoryInfo: Record<
  string,
  { label: string; emoji: string; gradient: string }
> = {
  toys: { label: "Toys", emoji: "🧸", gradient: "from-turquoise to-sky" },
  clothing: { label: "Clothing", emoji: "👕", gradient: "from-bubblegum to-grape" },
  books: { label: "Books", emoji: "📚", gradient: "from-sky to-grape" },
  birthday: { label: "Birthday", emoji: "🎉", gradient: "from-coral to-sunshine" },
};

const trustPoints = [
  { icon: "🚚", label: "Pan-India delivery" },
  { icon: "🔒", label: "Secure Razorpay checkout" },
  { icon: "🧸", label: "Handpicked & safety-checked" },
  { icon: "↩️", label: "Easy 7-day returns" },
];

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
  const categories = Object.keys(categoryInfo);
  const activeCategory = searchParams.category;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-ink bg-gradient-to-br from-bubblegum via-coral to-sunshine">
        <span className="absolute -left-10 top-10 h-40 w-40 rounded-blob bg-lime/40 blur-sm" />
        <span className="absolute -right-16 top-32 h-56 w-56 rounded-blob bg-sky/40 blur-sm" />
        <span className="absolute bottom-0 left-1/3 h-24 w-24 rounded-blob bg-grape/30 blur-sm" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-white/90 px-4 py-1.5 font-display text-sm text-ink shadow-[2px_2px_0_0_#241C4A]">
              ✦ India's brightest gifting spot for little ones ✦
            </span>
            <h1 className="font-display text-5xl leading-[1.05] text-white drop-shadow-[3px_3px_0_#241C4A] sm:text-6xl lg:text-7xl">
              Gifts that make
              <br />
              small faces light up
            </h1>
            <p className="mx-auto mt-5 max-w-md font-body text-lg text-white/95 drop-shadow-[1px_1px_0_#241C4A] lg:mx-0">
              Handpicked toys, books, clothing and birthday finds for babies,
              toddlers and kids — delivered across India.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href="#shop"
                className="rounded-full bg-ink px-7 py-3.5 font-display text-lg text-white shadow-[3px_3px_0_0_#241C4A] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#241C4A]"
              >
                Start shopping →
              </a>
              <a
                href="#categories"
                className="rounded-full bg-white/90 px-7 py-3.5 font-display text-lg text-ink shadow-[3px_3px_0_0_#241C4A] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#241C4A]"
              >
                Browse categories
              </a>
            </div>
          </div>

          {/* Floating gift card composition */}
          <div className="relative mx-auto hidden h-80 w-full max-w-sm lg:block">
            <div className="absolute left-4 top-0 w-44 rotate-[-8deg] rounded-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_0_#241C4A]">
              <div className="mb-2 flex h-24 items-center justify-center rounded-2xl bg-turquoise/20 text-4xl">🧸</div>
              <p className="font-display text-sm text-ink">Wooden Rainbow</p>
              <p className="font-body text-xs text-ink/60">Ages 1–3</p>
            </div>
            <div className="absolute right-0 top-16 w-44 rotate-[7deg] rounded-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_0_#241C4A]">
              <div className="mb-2 flex h-24 items-center justify-center rounded-2xl bg-bubblegum/20 text-4xl">👕</div>
              <p className="font-display text-sm text-ink">Dino Romper</p>
              <p className="font-body text-xs text-ink/60">Ages 0–2</p>
            </div>
            <div className="absolute bottom-0 left-16 w-44 rotate-[3deg] rounded-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_0_#241C4A]">
              <div className="mb-2 flex h-24 items-center justify-center rounded-2xl bg-sunshine/25 text-4xl">🎉</div>
              <p className="font-display text-sm text-ink">Party Kit</p>
              <p className="font-body text-xs text-ink/60">All ages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b-2 border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-6 sm:grid-cols-4">
          {trustPoints.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-2xl">{t.icon}</span>
              <span className="font-body text-xs font-bold text-ink/80 sm:text-sm">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Shop by category */}
        <section id="categories" className="mb-16 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Shop by category</h2>
            {activeCategory && (
              <a href="/" className="font-body text-sm font-bold text-coral hover:underline">
                Clear filter ✕
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => {
              const info = categoryInfo[cat];
              const isActive = activeCategory === cat;
              return (
                <a
                  key={cat}
                  href={isActive ? "/" : `/?category=${cat}#shop`}
                  className={`group relative overflow-hidden rounded-3xl border-2 border-ink bg-gradient-to-br ${info.gradient} p-5 text-center shadow-[4px_4px_0_0_#241C4A] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#241C4A] ${
                    isActive ? "ring-4 ring-ink ring-offset-2 ring-offset-cream" : ""
                  }`}
                >
                  <span className="block text-4xl transition group-hover:scale-110">
                    {info.emoji}
                  </span>
                  <span className="mt-2 block font-display text-white drop-shadow-[1px_1px_0_#241C4A]">
                    {info.label}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Product grid */}
        <section id="shop" className="scroll-mt-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">
              {activeCategory ? categoryInfo[activeCategory]?.label ?? "All gifts" : "All gifts"}
            </h2>
            {products && products.length > 0 && (
              <span className="font-body text-sm text-ink/50">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            )}
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
        </section>
      </div>
    </div>
  );
}
