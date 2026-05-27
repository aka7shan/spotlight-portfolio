import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import {
  AuthContext,
  type AuthContextValue,
  type AuthState,
} from './auth-context';

/**
 * AuthProvider — wraps the app in Supabase auth state.
 *
 * - Subscribes to Supabase's onAuthStateChange so every component re-renders
 *   when the user signs in / out / refreshes their session.
 * - Exposes signIn/signUp/signOut helpers so pages don't import supabase
 *   directly.
 * - Status flow: 'loading' -> 'authenticated' | 'unauthenticated'.
 *
 * The context shape, types, and `useAuth` hook live in sibling files so this
 * file can keep Fast Refresh happy (component-only exports).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: config.isConfigured ? 'loading' : 'unauthenticated',
    user: null,
    session: null,
    isConfigured: config.isConfigured,
  });

  useEffect(() => {
    if (!config.isConfigured) return;

    let cancelled = false;

    // Hydrate from any persisted session
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setState({
        status: data.session ? 'authenticated' : 'unauthenticated',
        user: data.session?.user ?? null,
        session: data.session,
        isConfigured: true,
      });
    });

    // Subscribe to live changes (sign in, sign out, token refresh, etc.)
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setState({
        status: session ? 'authenticated' : 'unauthenticated',
        user: session?.user ?? null,
        session,
        isConfigured: true,
      });

      // After an OAuth/email-confirm redirect, Supabase consumes the
      // `#access_token=…` fragment and fires SIGNED_IN. The hash is now stale
      // but still in the URL bar — strip it so a reload doesn't try to
      // re-consume an already-used token and so the URL looks clean.
      if (
        event === 'SIGNED_IN' &&
        typeof window !== 'undefined' &&
        window.location.hash.includes('access_token')
      ) {
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithPassword = useCallback(
    async (email: string, password: string, metadata?: Record<string, unknown>) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: metadata ? { data: metadata } : undefined,
      });
      if (error) throw error;
      // Supabase returns a session only when email confirmation is OFF.
      return { needsEmailConfirmation: !data.session };
    },
    [],
  );

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithPassword,
      signUpWithPassword,
      signInWithOAuth,
      signOut,
    }),
    [state, signInWithPassword, signUpWithPassword, signInWithOAuth, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
