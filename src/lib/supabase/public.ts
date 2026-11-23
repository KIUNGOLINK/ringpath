import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Cookie-less, anonymous client for public marketing pages. It can only read
// what Row Level Security already exposes to the world (open Spar sessions),
// and lets the page be statically generated and revalidated (ISR).
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
