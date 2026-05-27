import { config } from './config';
import { getAccessToken } from './supabase';
import type { User } from '../types/portfolio';

/**
 * Tiny typed client around the backend API.
 *
 * Every request:
 *  - prepends config.apiUrl
 *  - attaches the Supabase access token (if signed in)
 *  - times out after REQUEST_TIMEOUT_MS so a hung backend doesn't stall the UI
 *  - retries once on transient 5xx / network errors with jittered backoff
 *  - parses JSON
 *  - turns non-2xx into a thrown ApiError
 *
 * For Phase 0 we expose just enough endpoints to wire the frontend off
 * localStorage. More endpoints will come in later phases.
 */

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_BASE_MS = 250;

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

/**
 * Combine an external AbortSignal (from the caller, e.g. React unmount) with
 * our own timeout-driven AbortController. Whichever fires first cancels the
 * fetch. Returns the controller so the timeout can be cleared on success.
 */
function withTimeout(external?: AbortSignal): {
  controller: AbortController;
  cancel: () => void;
} {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), REQUEST_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort(external?.reason);
  if (external) {
    if (external.aborted) controller.abort(external.reason);
    else external.addEventListener('abort', onExternalAbort, { once: true });
  }
  return {
    controller,
    cancel: () => {
      clearTimeout(timeout);
      if (external) external.removeEventListener('abort', onExternalAbort);
    },
  };
}

const isRetriableStatus = (status: number): boolean =>
  status === 502 || status === 503 || status === 504;

const isOffline = (): boolean =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

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

  const serializedBody = body !== undefined ? JSON.stringify(body) : undefined;
  const url = `${config.apiUrl}${path}`;

  let lastError: unknown = null;
  // Two attempts total: original + one retry on transient failures.
  for (let attempt = 0; attempt < 2; attempt++) {
    const { controller, cancel } = withTimeout(signal);

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: serializedBody,
        signal: controller.signal,
      });
    } catch (cause) {
      cancel();
      lastError = cause;
      // Caller-initiated abort: never retry, surface immediately.
      if (signal?.aborted) {
        throw new ApiError(0, 'Request cancelled', cause);
      }
      const isTimeout =
        cause instanceof DOMException && cause.name === 'TimeoutError';
      if (attempt === 0 && !isOffline()) {
        await sleep(RETRY_BASE_MS + Math.random() * RETRY_BASE_MS);
        continue;
      }
      if (isOffline()) {
        throw new ApiError(0, 'You appear to be offline.', cause);
      }
      throw new ApiError(
        0,
        isTimeout ? 'Request timed out. Please try again.' : 'Network error — is the backend running?',
        cause,
      );
    }

    cancel();

    // Retry transient server errors once.
    if (isRetriableStatus(res.status) && attempt === 0) {
      lastError = res;
      await sleep(RETRY_BASE_MS + Math.random() * RETRY_BASE_MS);
      continue;
    }

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

  // Loop exited without returning — both attempts failed in retriable ways.
  throw new ApiError(0, 'Request failed after retry', lastError);
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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
