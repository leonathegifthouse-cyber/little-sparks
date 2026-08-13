# Little Sparks — kids' gifting storefront

A bright, low-cost e-commerce starter built with Next.js, Supabase, and Razorpay
(India-first payments — UPI, cards, netbanking, wallets). Zero platform fees:
you only pay Razorpay's per-transaction fee (~2%) and whatever you spend on
hosting, which can be ₹0 on free tiers for a small catalog.

## What's included

- **Storefront**: catalog grid with category filters, product pages, cart, checkout
- **Payments**: Razorpay Checkout, with server-side order creation + signature verification
  (prices are always recalculated server-side — never trusted from the browser)
- **Backend**: Supabase Postgres for products/orders, Supabase Storage for product images
- **Design**: a bright, playful "Little Sparks" visual identity — swap colors/name freely

## 1. Set up Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough to start).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → run it.
   This creates the `products` and `orders` tables, the storage bucket for images,
   and the security policies.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server only)

### Uploading your catalog images

Go to **Storage → product-images** in the Supabase dashboard and upload images
there directly (drag and drop works). Click an uploaded file → **Copy URL** →
paste that URL into the `image_url` column when you add a product row.

### Adding products

Easiest for now: **Table Editor → products → Insert row**. Fill in `name`,
`description`, `price_paise` (price in paise — e.g. ₹499 = `49900`), `image_url`,
`category` (`toys` / `clothing` / `books` / `birthday`), `age_group`, and `stock`.

(Once you have 15-20+ products, it's worth asking me to build a simple admin
upload page so you're not doing this row-by-row in Supabase — happy to add
that next.)

## 2. Set up Razorpay

1. Sign up at [razorpay.com](https://razorpay.com) — approval for Indian individuals/
   small businesses is generally straightforward (unlike Stripe, which is invite-only
   in India right now).
2. Start in **Test Mode** first. Go to **Settings → API Keys** → generate keys.
   - `Key Id` → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`
3. Use Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
   to test a full checkout before going live.
4. When ready for real payments, complete Razorpay's KYC (PAN, bank account, etc.),
   switch to **Live Mode**, and swap in your live keys.

## 3. Run locally

```bash
npm install
cp .env.example .env.local   # fill in your real Supabase + Razorpay values
npm run dev
```

Visit `http://localhost:3000`.

## 4. Deploy (free)

The cheapest path is [Vercel](https://vercel.com)'s free Hobby tier:

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com → it auto-detects Next.js.
3. Add the same environment variables from `.env.local` in Vercel's
   **Settings → Environment Variables**.
4. Deploy. You'll get a free `*.vercel.app` URL immediately; you can point a
   custom domain (e.g. `littlesparks.in`, ~₹700-900/yr from a registrar) at it later.

## Cost summary

| Item | Cost |
|---|---|
| Hosting (Vercel Hobby) | ₹0/month |
| Database + storage (Supabase free tier) | ₹0/month (500MB DB, 1GB storage) |
| Payments (Razorpay) | ~2% per transaction, no monthly fee |
| Domain (optional) | ~₹700-900/year |

## Making it yours

- Rename "Little Sparks" throughout (`app/layout.tsx`, `components/Navbar.tsx`, `README.md`).
- Colors and fonts live in `tailwind.config.ts` (coral/turquoise/sunshine/bubblegum palette,
  Baloo 2 + Nunito fonts) — change hex values there to reskin the whole site.
- Categories are currently hardcoded (`toys`, `clothing`, `books`, `birthday`) in
  `app/page.tsx` and `components/ProductCard.tsx` — edit that list to match your catalog.

## Security notes

- The Supabase **service role key** bypasses all database security rules — it's only
  ever used inside `app/api/*` server routes, never sent to the browser. Don't put it
  in any `NEXT_PUBLIC_*` variable.
- Order totals are always recalculated server-side from the database, not from what
  the browser sends, so a tampered cart can't be used to underpay.
- Razorpay payments are verified server-side via HMAC signature before an order is
  marked "paid" — the client alone can never fake a successful payment.
