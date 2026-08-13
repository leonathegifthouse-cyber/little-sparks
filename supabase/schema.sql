-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists "uuid-ossp";

-- Product catalog
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_paise integer not null,          -- store price in paise (₹1 = 100 paise) to avoid decimal issues
  image_url text,
  category text default 'general',       -- e.g. 'toys', 'clothing', 'books', 'birthday'
  age_group text default 'all',          -- e.g. '0-2', '3-5', '6-8', 'all'
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Orders placed through Razorpay checkout
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  razorpay_order_id text not null,
  razorpay_payment_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  items jsonb not null,                  -- snapshot of cart: [{product_id, name, price_paise, qty}]
  total_paise integer not null,
  status text not null default 'created', -- created | paid | failed
  created_at timestamptz not null default now()
);

-- Public can read active products (storefront browsing)
alter table products enable row level security;
create policy "Public can view active products"
  on products for select
  using (is_active = true);

-- Orders are written only via the server (service role key), never directly from the browser
alter table orders enable row level security;
-- No public policies on orders: only accessible via the Supabase service role key from your API routes.

-- Called after a verified payment to reduce stock for each item purchased
create or replace function decrement_stock(product_id_input uuid, qty_input integer)
returns void as $$
begin
  update products
  set stock = greatest(stock - qty_input, 0)
  where id = product_id_input;
end;
$$ language plpgsql security definer;

-- Storage bucket for product images (run once; skip if it already exists)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
