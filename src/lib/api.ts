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
 *  - parses JSON
 *  - turns non-2xx into a thrown ApiError
 *
 * Retries
 * -------
 *  Retry behavior is opt-in per call. The default (retry: false) is best for
 *  interactive paths like `/v1/me` where a doubled wait on a cold start is
 *  worse for UX than just surfacing the error and letting React's error UI
 *  expose a "Retry" button (which the user controls). For idempotent
 *  background calls you can pass `retry: true` to get one retry on
 *  502/503/504 + network errors with jittered backoff.
 */

// 8s gives Vercel's Node function plenty of room for a real cold start
// (typically 1-3s) without making a hung backend feel hopeless.
const REQUEST_TIMEOUT_MS = 8_000;
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
  /**
   * Retry once on transient failures (5xx / network errors). Off by default
   * to keep interactive paths snappy. Turn on for background sync etc.
   */
  retry?: boolean;
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
  const { method = 'GET', body, signal, anonymous = false, retry = false } = options;
  const maxAttempts = retry ? 2 : 1;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // Body handling has two paths:
  //   - FormData      → let fetch set the multipart Content-Type with the
  //                     boundary string. If we set it ourselves the upload
  //                     becomes unparseable on the server.
  //   - anything else → JSON.stringify and declare Content-Type.
  let serializedBody: BodyInit | undefined;
  if (body instanceof FormData) {
    serializedBody = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    serializedBody = JSON.stringify(body);
  }

  if (!anonymous) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = `${config.apiUrl}${path}`;

  let lastError: unknown = null;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const isFinalAttempt = attempt === maxAttempts - 1;
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
      if (!isFinalAttempt && !isOffline()) {
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

    // Retry transient server errors only when the caller opted in.
    if (isRetriableStatus(res.status) && !isFinalAttempt) {
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

export interface AvatarUploadResponse extends MeResponse {
  avatarUrl: string;
}

// ---------------------------------------------------------------------------
// Phase 1.1 — share / public-username contract
// ---------------------------------------------------------------------------

/**
 * Reasons a candidate username could fail. Maps 1:1 to backend `kind` codes
 * from src/lib/slug.ts so the frontend can show field-specific messages
 * without parsing free-text errors.
 */
export type UsernameRejectionKind =
  | 'too_short'
  | 'too_long'
  | 'invalid_format'
  | 'reserved'
  | 'taken';

/**
 * Result of GET /v1/me/share/check?username=foo.
 *
 *   - available: true                       → free to claim
 *   - available: false, kind: 'taken_by_self' → it's already yours (no-op)
 *   - available: false, kind: <other>       → can't be claimed, see `message`
 */
export interface ShareCheckResponse {
  available: boolean;
  kind: UsernameRejectionKind | 'available' | 'taken_by_self';
  message?: string;
}

export interface ShareSuggestResponse {
  username: string;
}

export interface ShareUpdateResponse extends MeResponse {
  username: string;
}

/**
 * Public portfolio response. Everything from MeResponse EXCEPT the internal
 * user UUID (stripped server-side for visitor privacy).
 */
export interface PublicProfileResponse {
  user: Omit<MeResponse['user'], 'id'>;
}

export const api = {
  health: () => request<{ status: string }>('/health', { anonymous: true }),

  me: {
    get: () => request<MeResponse>('/v1/me'),
    update: (payload: Partial<User>) =>
      request<MeResponse>('/v1/me', { method: 'PUT', body: payload }),

    /**
     * Upload a new avatar. The backend writes it to Supabase Storage and
     * atomically updates profiles.avatar_url. The resolved response carries
     * the full assembled User (so callers can swap their local copy in one
     * shot) plus the standalone avatarUrl for components that only want
     * that.
     */
    uploadAvatar: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<AvatarUploadResponse>('/v1/me/avatar', {
        method: 'POST',
        body: form,
      });
    },

    /** Remove the current avatar from Storage AND clear the DB field. */
    removeAvatar: () =>
      request<MeResponse>('/v1/me/avatar', { method: 'DELETE' }),
  },

  /**
   * Phase 1.1 — share/public-URL management for the signed-in user.
   *
   * The four endpoints map 1:1 to the backend's /v1/me/share/* routes;
   * keeping them in their own namespace (`api.share.*`) signals at the
   * call site that these touch a *separate* concern from the rest of the
   * profile (no form-dirty interaction, no PUT-coupling).
   */
  share: {
    /**
     * Cheap availability probe. Used by the rename UI's debounced
     * autocomplete. Format errors come back as `available: false` with a
     * `kind` you can show inline.
     */
    check: (username: string) =>
      request<ShareCheckResponse>(
        `/v1/me/share/check?username=${encodeURIComponent(username)}`,
      ),

    /**
     * Ask the server for a random base62 candidate that's currently free.
     * Always returns a username; throws ApiError(503) if it somehow can't
     * find one in 5 tries (extremely unlikely).
     */
    suggest: () => request<ShareSuggestResponse>('/v1/me/share/suggest'),

    /**
     * Commit a username rename. Server validates format + uniqueness, then
     * updates profiles.username atomically. On success the response carries
     * the full assembled user so the caller can refresh local state in one
     * shot.
     *
     * Common error shapes:
     *   400 + kind: 'invalid_format' / 'too_short' / 'too_long' / 'reserved'
     *   409 + kind: 'taken'  (someone else owns it)
     */
    update: (username: string) =>
      request<ShareUpdateResponse>('/v1/me/share', {
        method: 'PATCH',
        body: { username },
      }),
  },

  /**
   * Phase 1.1 — anonymous public lookup. Used by the /spotlight/:username
   * page. Skips the auth header so we don't accidentally use the visitor's
   * session for someone else's URL.
   */
  public: {
    get: (username: string) =>
      request<PublicProfileResponse>(
        `/v1/public/${encodeURIComponent(username)}`,
        { anonymous: true },
      ),
  },
};
