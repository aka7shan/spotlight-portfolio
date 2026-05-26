import { config } from './config';
import { getAccessToken } from './supabase';
import type { User } from '../types/portfolio';

/**
 * Tiny typed client around the backend API.
 *
 * Every request:
 *  - prepends config.apiUrl
 *  - attaches the Supabase access token (if signed in)
 *  - parses JSON
 *  - turns non-2xx into a thrown ApiError
 *
 * For Phase 0 we expose just enough endpoints to wire the frontend off
 * localStorage. More endpoints will come in later phases.
 */

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
  /** Skip auth header even if a token exists (used for unauthenticated calls). */
  anonymous?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, anonymous = false } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (!anonymous) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${config.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal,
    });
  } catch (cause) {
    throw new ApiError(0, 'Network error — is the backend running?', cause);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let parsed: unknown = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    parsed = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const error = (parsed as { error?: { message?: string; details?: unknown } } | null)?.error;
    throw new ApiError(
      res.status,
      error?.message ?? `Request failed with status ${res.status}`,
      error?.details,
    );
  }

  return parsed as T;
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------

export interface MeResponse {
  user: User & {
    username: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const api = {
  health: () => request<{ status: string }>('/health', { anonymous: true }),

  me: {
    get: () => request<MeResponse>('/v1/me'),
    update: (payload: Partial<User>) =>
      request<MeResponse>('/v1/me', { method: 'PUT', body: payload }),
  },
};
