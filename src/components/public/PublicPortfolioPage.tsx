import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiError, api } from "../../lib/api";
import type { User, PortfolioData } from "../../types/portfolio";
import { portfolioDataManager } from "../../utils/portfolioDataManager";
import { DEFAULT_TEMPLATE_ID, getPreset } from "../portfolios/registry";
import { PortfolioRenderer } from "../portfolios/PortfolioRenderer";
import { decodeConfigFromHash } from "../portfolios/config/share";

/**
 * Public read-only portfolio at `/p/:code`.
 *
 * Phase 1.2 replaced the username-keyed URL scheme with a Base62 short
 * code. The visitor's URL is opaque (`/p/k7j8H2p`) but the resolved
 * portfolio is the same shape we serve to the authenticated owner —
 * we just strip the internal user UUID server-side, render the
 * owner's chosen template, and skip all editor chrome.
 *
 * Template selection
 * ------------------
 * The server returns `activeTemplate` (e.g. 'classic', 'modern-tech')
 * with the public profile. We map that to one of the five template
 * components below. Unknown ids fall back to 'classic' rather than
 * breaking the render.
 *
 * Caching
 * -------
 * The backend serves an ETag + `Cache-Control: public, no-cache` on
 * this endpoint, so repeat visitors revalidate against the CDN
 * cache via `If-None-Match` and most cache hits return 304 with no
 * body. We don't need any client-side cache here — the browser/CDN
 * already handle the work.
 */

type FetchState =
  | { kind: "loading" }
  | { kind: "ok"; user: User; templateId: string }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <div className="max-w-md space-y-4">
      <p className="text-6xl font-bold tracking-tight">404</p>
      <h1 className="text-2xl font-semibold">No portfolio at this address</h1>
      <p className="text-sm text-muted-foreground">
        This short link is invalid or has been retired. Double-check the URL,
        or ask its owner for the current link.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        Go to Spotlight
      </a>
    </div>
  </div>
);

const ErrorPanel = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Couldn't load this portfolio</h1>
      <p className="text-sm text-muted-foreground break-words">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        Try again
      </button>
    </div>
  </div>
);

export function PublicPortfolioPage() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";

  const [state, setState] = useState<FetchState>({ kind: "loading" });
  // Bump to retry on demand. We don't put it in `state` because that would
  // cause a stale-state re-render when the user clicks "Try again".
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!code) {
      setState({ kind: "not_found" });
      return;
    }

    let cancelled = false;
    setState({ kind: "loading" });

    api.public
      .getByCode(code)
      .then((res) => {
        if (cancelled) return;
        // Public response omits `id`. The template components don't read
        // it anyway, but our User type requires it — fill in a placeholder
        // so TS is happy. Anything that ever rendered this `id` would be
        // a bug.
        const user: User = { id: "public", ...res.user };
        const templateId = res.user.activeTemplate ?? DEFAULT_TEMPLATE_ID;
        setState({ kind: "ok", user, templateId });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setState({ kind: "not_found" });
          return;
        }
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unknown error";
        setState({ kind: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [code, retryNonce]);

  // Update the document title + description on success so a visitor who
  // shares the URL gets a meaningful preview in the browser tab and via
  // anything that does light scraping (Slack unfurl, etc. — they'd want
  // full OG tags, which we'll add when we move to SSR; meta tags injected
  // post-load don't help most crawlers).
  useEffect(() => {
    if (state.kind !== "ok") return;
    const prevTitle = document.title;
    const owner = state.user.name || "Portfolio";
    const title = state.user.title ? `${owner} — ${state.user.title}` : owner;
    document.title = `${title} · Spotlight`;
    return () => {
      document.title = prevTitle;
    };
  }, [state]);

  const portfolioData: PortfolioData | null = useMemo(() => {
    if (state.kind !== "ok") return null;
    return portfolioDataManager.generateFromUser(state.user);
  }, [state]);

  if (state.kind === "loading") return <Spinner />;
  if (state.kind === "not_found") return <NotFound />;
  if (state.kind === "error") {
    return (
      <ErrorPanel
        message={state.message}
        onRetry={() => setRetryNonce((n) => n + 1)}
      />
    );
  }

  // A shared link can carry the owner's customizations in the URL hash
  // (`#c=...`); otherwise fall back to the template's preset. (localStorage is
  // owner-only, so it intentionally plays no role on the public page.)
  const config =
    decodeConfigFromHash(window.location.hash, state.templateId) ??
    getPreset(state.templateId);

  return portfolioData ? (
    <PortfolioRenderer data={portfolioData} config={config} />
  ) : (
    <Spinner />
  );
}
