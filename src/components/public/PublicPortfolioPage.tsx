import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiError, api } from "../../lib/api";
import type { User, PortfolioData } from "../../types/portfolio";
import { portfolioDataManager } from "../../utils/portfolioDataManager";

/**
 * Public read-only portfolio at /spotlight/:username.
 *
 * Renders one of the existing portfolio templates, but without the editor
 * chrome (no toolbar, no info banner, no template switcher). What a visitor
 * sees is the same component the owner sees in the "view my portfolio"
 * flow, just stripped down.
 *
 * No auth is required — the fetch is anonymous.
 *
 * Template selection
 * ------------------
 *  Phase 1.1 doesn't expose the owner's `portfolios.activeTemplate` over the
 *  wire yet, so we hard-code 'modern-tech' here. Phase 1.4 (theme
 *  customization) will return the owner's chosen template + theme overrides
 *  from the public endpoint and we'll switch on it here.
 */

const ClassicPortfolio = lazy(() =>
  import("../portfolios/ClassicPortfolio").then((m) => ({ default: m.ClassicPortfolio })),
);
const ModernTechPortfolio = lazy(() =>
  import("../portfolios/ModernTechPortfolio").then((m) => ({ default: m.ModernTechPortfolio })),
);
const CreativePortfolio = lazy(() =>
  import("../portfolios/CreativePortfolio").then((m) => ({ default: m.CreativePortfolio })),
);
const MinimalistPortfolio = lazy(() =>
  import("../portfolios/MinimalistPortfolio").then((m) => ({ default: m.MinimalistPortfolio })),
);
const CorporatePortfolio = lazy(() =>
  import("../portfolios/CorporatePortfolio").then((m) => ({ default: m.CorporatePortfolio })),
);

// Hard-coded default until we plumb the owner's chosen template through the
// public endpoint (Phase 1.4). Modern-tech is the most generally-flattering
// of the five.
const DEFAULT_TEMPLATE = "modern-tech";

type FetchState =
  | { kind: "loading" }
  | { kind: "ok"; user: User }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

function selectTemplate(templateId: string) {
  switch (templateId) {
    case "modern-tech":
      return ModernTechPortfolio;
    case "creative":
      return CreativePortfolio;
    case "minimalist":
      return MinimalistPortfolio;
    case "corporate":
      return CorporatePortfolio;
    case "classic":
    default:
      return ClassicPortfolio;
  }
}

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const NotFound = ({ username }: { username: string }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <div className="max-w-md space-y-4">
      <p className="text-6xl font-bold tracking-tight">404</p>
      <h1 className="text-2xl font-semibold">No portfolio at this address</h1>
      <p className="text-sm text-muted-foreground">
        We couldn't find anyone with the username{" "}
        <span className="font-mono text-foreground">{username}</span>.
        Double-check the spelling or ask for an updated link.
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
  const params = useParams<{ username: string }>();
  const username = params.username ?? "";

  const [state, setState] = useState<FetchState>({ kind: "loading" });
  // Bump to retry on demand. We don't put it in `state` because that would
  // cause a stale-state re-render when the user clicks "Try again".
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!username) {
      setState({ kind: "not_found" });
      return;
    }

    let cancelled = false;
    setState({ kind: "loading" });

    api.public
      .get(username)
      .then((res) => {
        if (cancelled) return;
        // Public response omits `id`. The template components don't read it
        // anyway, but our User type requires it — fill in a placeholder so
        // TS is happy. Anything that ever rendered this `id` would be a bug.
        const user: User = { id: "public", ...res.user };
        setState({ kind: "ok", user });
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
  }, [username, retryNonce]);

  // Update the document title + description on success so a visitor who
  // shares the URL gets a meaningful preview in the browser tab and via
  // anything that does light scraping (Slack unfurl, etc. — they'd want
  // full OG tags, which we'll add when we move to SSR; meta tags injected
  // post-load don't help most crawlers).
  useEffect(() => {
    if (state.kind !== "ok") return;
    const prevTitle = document.title;
    const owner = state.user.name || username;
    const title = state.user.title ? `${owner} — ${state.user.title}` : owner;
    document.title = `${title} · Spotlight`;
    return () => {
      document.title = prevTitle;
    };
  }, [state, username]);

  const portfolioData: PortfolioData | null = useMemo(() => {
    if (state.kind !== "ok") return null;
    return portfolioDataManager.generateFromUser(state.user);
  }, [state]);

  if (state.kind === "loading") return <Spinner />;
  if (state.kind === "not_found") return <NotFound username={username} />;
  if (state.kind === "error") {
    return (
      <ErrorPanel
        message={state.message}
        onRetry={() => setRetryNonce((n) => n + 1)}
      />
    );
  }

  const Template = selectTemplate(DEFAULT_TEMPLATE);
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Spinner />}>
        {portfolioData && <Template data={portfolioData} viewMode="desktop" />}
      </Suspense>
    </div>
  );
}
