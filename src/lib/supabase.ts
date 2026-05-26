import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Singleton Supabase client used by the frontend.
 *
 * When env vars are missing we still create a stub client pointed at a dummy
 * URL — this lets the app load and render the "configure Supabase" screen
 * instead of crashing on import. The stub will throw if any actual auth
 * methods are called.
 */

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder';

export const supabase: SupabaseClient = createClient(
  config.isConfigured ? config.supabaseUrl : PLACEHOLDER_URL,
  config.isConfigured ? config.supabaseAnonKey : PLACEHOLDER_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'spotlight-auth',
    },
  },
);

/**
 * Get the current access token (JWT) or null if the user is signed out.
 * Used by the API client to authorize backend calls.
 */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
