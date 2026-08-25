import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client serveur uniquement (service role key).
 * Retourne `null` si les variables d'env sont absentes → mode démo,
 * le formulaire reste fonctionnel et le build ne casse pas.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
