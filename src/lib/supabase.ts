import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_ variables are inlined at build time, so they must be read
// with these exact names (no dynamic lookups).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** The shared Supabase client. Only call it when isSupabaseConfigured. */
export function supabase(): SupabaseClient {
  if (!client) {
    if (!url || !key) {
      throw new Error('Supabase não está configurado.');
    }
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
