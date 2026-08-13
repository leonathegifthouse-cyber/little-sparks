import { createClient } from "@supabase/supabase-js";

// Public client — safe to use in browser components, only ever reads public data
// (RLS policies restrict it to active products; orders have no public policy at all).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-only client using the service role key — only import this inside app/api routes.
// It bypasses RLS, so it must never be exposed to the browser.
export function supabaseAdmin() {
  const { createClient: createServerClient } = require("@supabase/supabase-js");
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
