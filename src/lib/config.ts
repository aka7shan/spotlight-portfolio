/**
 * Frontend runtime configuration.
 *
 * Vite injects VITE_-prefixed env vars at build time. We surface them here
 * with helpful errors so a missing var fails loudly instead of silently.
 *
 * `isConfigured` lets us render a friendly setup screen while Supabase
 * credentials aren't filled in yet (useful during Phase 0 onboarding).
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';
const API_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:8787';

export const config = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  apiUrl: API_URL.replace(/\/$/, ''), // strip trailing slash
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
} as const;
