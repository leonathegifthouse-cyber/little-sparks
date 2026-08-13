import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public client — safe to use in browser components, only ever reads public data
// (RLS policies restrict it to active products; orders have no public policy at all).
//
// Built lazily via a Proxy so that importing this file never runs createClient().
// That matters because Next.js imports every route module during the build step
// (to "collect page data"), even for routes that don't touch Supabase directly —
// an eager client here would crash the build if env vars aren't present yet.
let _client: SupabaseClient | null = null;

function getPublicClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
          "Set them in your .env.local (local dev) or Vercel Project Settings > Environment Variables (production)."
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getPublicClient();
    return Reflect.get(client as object, prop, receiver);
  },
});

// Server-only client using the service role key — only import this inside app/api routes.
// It bypasses RLS, so it must never be exposed to the browser. Already lazy (called inside
// each route handler), so no build-time risk here.
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Set them in your .env.local (local dev) or Vercel Project Settings > Environment Variables (production)."
    );
  }
  return createClient(url, key);
}
