import { createContext } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: SupabaseUser | null;
  session: Session | null;
  /** True when env vars are missing — render a setup screen instead of pages. */
  isConfigured: boolean;
}

export interface AuthContextValue extends AuthState {
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (
    email: string,
    password: string,
    metadata?: Record<string, unknown>,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
