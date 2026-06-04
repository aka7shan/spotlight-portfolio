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
    /**
     * Phase 1.2: Base62 short code that addresses this user's public
     * portfolio at `/p/<shortCode>`. Always populated on responses —
     * the backend lazily backfills missing codes on first GET /v1/me.
     */
    shortCode: string;
    /** Which template id renders the public page (e.g. 'classic'). */
    activeTemplate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AvatarUploadResponse extends MeResponse {
  avatarUrl: string;
}

export interface CoverUploadResponse extends MeResponse {
  coverUrl: string;
}

// ---------------------------------------------------------------------------
// Phase 1.2 — CV upload + AI parse contract
// ---------------------------------------------------------------------------

/**
 * Response from POST /v1/me/cv. The file is stored in the private `cvs`
 * bucket; `signedUrl` is a short-lived link (~10 min) so the frontend can
 * offer an immediate "View uploaded file" action.
 */
export interface CvUploadResponse extends MeResponse {
  cv: {
    fileName: string;
    fileSize: number;
    fileType: string;
    signedUrl: string;
  };
}

/**
 * Shape returned by POST /v1/me/cv/parse. Mirrors the *frontend Zod
 * shape* (PascalCase enums, frontend-friendly field names) so the diff UI
 * can splice it directly into the existing form state without another
 * translation layer.
 *
 * Every field is optional — the LLM is instructed to omit anything it
 * can't infer, so an empty CV produces an empty object instead of
 * hallucinated data.
 */
export interface CvParseExtracted {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  about?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    dribbble?: string;
    behance?: string;
  };
  skills?: string[];
  experience?: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    isPresent?: boolean;
    description?: string;
    location?: string;
    skills?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    isPresent?: boolean;
    gpa?: string;
    description?: string;
    achievements?: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    tags?: string[];
    link?: string;
    githubLink?: string;
    status: 'Completed' | 'In Progress' | 'Planned';
    startDate?: string;
    endDate?: string;
    role?: string;
    technologies?: string[];
    achievements?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    startDate: string;
    endDate?: string;
    isPresent?: boolean;
    credentialId?: string;
    link?: string;
    expiryDate?: string;
  }>;
  achievements?: Array<{
    title: string;
    description?: string;
    startDate: string;
    organization?: string;
    link?: string;
  }>;
  languages?: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native' | 'Expert';
    certification?: string;
  }>;
}

export interface CvParseResponse {
  extracted: CvParseExtracted;
  meta: {
    modelUsed: string;
    usage: { inputTokens: number; outputTokens: number };
    inputTruncated: boolean;
    inputBytes: number;
  };
}

// ---------------------------------------------------------------------------
// Phase 1.2 — short-link & template contract
// ---------------------------------------------------------------------------

/**
 * Response from PUT /v1/me/portfolio. Carries the new template + the
 * portfolio's short code so the caller can update its local copy
 * without a follow-up GET.
 */
export interface UpdateTemplateResponse {
  portfolio: {
    templateId: string;
    shortCode: string;
    updatedAt: string;
  };
}

/**
 * Response from POST /v1/me/share-link/regenerate. The OLD code stops
 * working immediately; the caller should swap the displayed URL.
 */
export interface RegenerateShortLinkResponse {
  shortCode: string;
  updatedAt: string;
}

/**
 * Public portfolio response. Everything from MeResponse EXCEPT the
 * internal user UUID (stripped server-side for visitor privacy).
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

    /**
     * Upload a new cover image. Mirrors `uploadAvatar` — backend writes to
     * Supabase Storage and atomically updates profiles.cover_url. The
     * resolved response carries the full assembled User plus a standalone
     * `coverUrl` for callers that only need that.
     */
    uploadCover: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<CoverUploadResponse>('/v1/me/cover', {
        method: 'POST',
        body: form,
      });
    },

    /** Remove the current cover from Storage AND clear the DB field. */
    removeCover: () =>
      request<MeResponse>('/v1/me/cover', { method: 'DELETE' }),

    /**
     * Upload a new CV (PDF / DOCX). Backend stores the bytes in the
     * private `cvs` bucket and records metadata on the profile. The
     * returned `signedUrl` is short-lived (~10 min) and meant for an
     * immediate "View uploaded file" action; don't persist it.
     */
    uploadCv: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<CvUploadResponse>('/v1/me/cv', {
        method: 'POST',
        body: form,
      });
    },

    /**
     * Run AI extraction on the CV currently stored for this user.
     * Does NOT write to the profile — the caller renders a diff UI and
     * sends the accepted sections via `update`.
     *
     * Errors to anticipate (statuses are stable):
     *   - 404: no CV uploaded yet
     *   - 415: legacy .doc (we don't extract text from it)
     *   - 422: CV had no extractable text (scanned PDF)
     *   - 429: hit the per-user parse rate limit
     *   - 502: AI provider transiently unavailable
     *   - 503: AI not configured on the server
     */
    parseCv: () =>
      request<CvParseResponse>('/v1/me/cv/parse', { method: 'POST' }),

    /** Remove the CV from Storage AND clear the DB metadata. */
    removeCv: () =>
      request<MeResponse>('/v1/me/cv', { method: 'DELETE' }),

    /**
     * Set the active portfolio template. The choice is what
     * `/p/<shortCode>` will render. Fire-and-forget from the gallery
     * — the caller does not need to round-trip the user's whole
     * profile form to change the template.
     */
    setTemplate: (templateId: string) =>
      request<UpdateTemplateResponse>('/v1/me/portfolio', {
        method: 'PUT',
        body: { templateId },
      }),

    /**
     * Mint a new short code, retiring the previous one. Use case: user
     * wants to rotate a link that's been shared too widely or that
     * they want to retire.
     *
     * The previous code 404s immediately at the DB layer (no grace
     * period). The frontend should update its displayed URL with the
     * response value the moment this resolves.
     */
    regenerateShortLink: () =>
      request<RegenerateShortLinkResponse>('/v1/me/share-link/regenerate', {
        method: 'POST',
      }),
  },

  /**
   * Phase 1.2 — anonymous public lookup by short code. Used by the
   * /p/:code page. Skips the auth header so we don't accidentally use
   * the visitor's session for someone else's URL.
   */
  public: {
    getByCode: (code: string) =>
      request<PublicProfileResponse>(
        `/v1/p/${encodeURIComponent(code)}`,
        { anonymous: true },
      ),
  },
};
