import Link from "next/link";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="text-6xl">🎉</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Order placed!</h1>
      <p className="mt-3 font-body text-ink/70">
        Thank you — your gift is on its way. A confirmation has been recorded for
        order <span className="font-bold">{searchParams.order?.slice(0, 8)}</span>.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-coral px-6 py-3 font-body font-bold text-white shadow-[3px_3px_0_0_#2B2250]"
      >
        Keep browsing
      </Link>
    </div>
  );
}
