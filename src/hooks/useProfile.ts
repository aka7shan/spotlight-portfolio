import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useAuth } from './useAuth';
import type { User } from '../types/portfolio';

type ProfileState =
  | { status: 'idle'; user: null; error: null }
  | { status: 'loading'; user: User | null; error: null }
  | { status: 'ready'; user: User; error: null }
  | { status: 'error'; user: User | null; error: ApiError | Error };

/**
 * Loads the current user's full profile from the backend.
 * Re-fetches when the auth status changes.
 * Exposes a `save` function that PUTs the assembled User and refreshes state.
 */
export function useProfile() {
  const { status: authStatus, user: authUser } = useAuth();
  const [state, setState] = useState<ProfileState>({ status: 'idle', user: null, error: null });

  const load = useCallback(async () => {
    if (authStatus !== 'authenticated') {
      setState({ status: 'idle', user: null, error: null });
      return;
    }
    setState((prev) => ({ status: 'loading', user: prev.user, error: null }));
    try {
      const { user } = await api.me.get();
      setState({ status: 'ready', user, error: null });
    } catch (err) {
      const error: ApiError | Error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({ status: 'error', user: prev.user, error }));
      // We deliberately do NOT toast here: App.tsx already renders an inline
      // error panel with a retry button when `profileStatus === 'error'`.
      // Surfacing the same failure twice (toast + panel) was just noise.
      console.error('[useProfile] load failed', error);
    }
  }, [authStatus]);

  useEffect(() => {
    void load();
  }, [load, authUser?.id]);

  const save = useCallback(async (patch: Partial<User>) => {
    setState((prev) => ({ status: 'loading', user: prev.user, error: null }));
    try {
      const { user } = await api.me.update(patch);
      setState({ status: 'ready', user, error: null });
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({ status: 'error', user: prev.user, error }));
      throw error;
    }
  }, []);

  /**
   * Adopt a freshly-persisted user from somewhere other than `save()` —
   * e.g. the response of POST /v1/me/avatar or POST /v1/me/cover, which
   * write to dedicated endpoints but return the full assembled user.
   *
   * This is intentionally distinct from `save()`: it never flips the
   * loading flag, never throws, and assumes the caller has already
   * confirmed the network round-trip succeeded. Use it whenever a child
   * has just received a fresh `user` payload that the rest of the app
   * (navbar, gallery, etc.) should now see.
   */
  const applyPersisted = useCallback((user: User) => {
    setState({ status: 'ready', user, error: null });
  }, []);

  return {
    ...state,
    reload: load,
    save,
    applyPersisted,
  };
}
