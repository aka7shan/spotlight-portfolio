/**
 * Route constants + helpers.
 *
 * The rest of the app talks about pages by id ("home", "login", "profile",
 * "portfolios", "portfolio-viewer"). React Router talks in URL paths. This
 * module is the bridge so child components don't need to know about URLs.
 *
 * Routes
 * ------
 *   /                            home
 *   /login                       login
 *   /signup                      signup
 *   /profile                     profile (auth required)
 *   /portfolios                  template gallery
 *   /portfolios/:templateId      preview a template with dummy data (public)
 *   /portfolios/:templateId/use  render the current user's data in this template (auth required)
 *   /p/:code                     public portfolio by Base62 short code (anonymous, no chrome)
 *
 * Anything else falls through to home (see App.tsx <Route path="*">).
 *
 * Phase 1.2 note: the old /spotlight/:username scheme has been removed
 * entirely in favor of `/p/:code`. There is no in-app redirect for old
 * usernames — they 404 by design, because the username column is no
 * longer the public URL identity. Users who shared old URLs need to
 * re-copy from the Profile page.
 */

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  portfolios: '/portfolios',
  styles: '/styles',
  shortLink: '/p',
} as const;

export type PageId =
  | 'home'
  | 'login'
  | 'signup'
  | 'profile'
  | 'portfolios'
  | 'portfolio-viewer'
  | 'styles'
  | 'short-link';

/**
 * Build a public portfolio URL for the given short code.
 *
 * Returns just the path (e.g. "/p/k7j8H2p"); compose with
 * `window.location.origin` at the call site when you need an
 * absolute, shareable URL.
 */
export function shortLinkPath(code: string): string {
  return `${ROUTES.shortLink}/${encodeURIComponent(code)}`;
}

/**
 * Map an internal page id to a route. For "portfolio-viewer" the caller must
 * supply a templateId via `portfolioViewerPath()` because the URL depends on
 * the specific template.
 */
export function pageIdToPath(page: PageId): string {
  switch (page) {
    case 'home':
      return ROUTES.home;
    case 'login':
      return ROUTES.login;
    case 'signup':
      return ROUTES.signup;
    case 'profile':
      return ROUTES.profile;
    case 'portfolios':
      return ROUTES.portfolios;
    case 'styles':
      return ROUTES.styles;
    case 'portfolio-viewer':
      // Shouldn't be reached — viewer routes need a templateId. Fall back
      // to the gallery so the user lands somewhere useful.
      return ROUTES.portfolios;
    case 'short-link':
      // Shouldn't be reached — short-link routes need a code. Fall back
      // to home; child components should always use shortLinkPath() directly.
      return ROUTES.home;
  }
}

export function portfolioViewerPath(
  templateId: string,
  mode: 'preview' | 'use' = 'preview',
): string {
  const base = `${ROUTES.portfolios}/${encodeURIComponent(templateId)}`;
  return mode === 'use' ? `${base}/use` : base;
}

/**
 * Derive the active page id from a URL pathname. Used by Navigation to
 * highlight the current tab and by App when keeping legacy `currentPage`
 * semantics for unchanged child components.
 */
export function pathToPageId(pathname: string): PageId {
  if (pathname === ROUTES.home) return 'home';
  if (pathname.startsWith(ROUTES.login)) return 'login';
  if (pathname.startsWith(ROUTES.signup)) return 'signup';
  if (pathname.startsWith(ROUTES.profile)) return 'profile';
  if (pathname.startsWith(ROUTES.styles)) return 'styles';
  if (pathname.startsWith(`${ROUTES.shortLink}/`)) return 'short-link';
  if (/^\/portfolios\/[^/]+/.test(pathname)) return 'portfolio-viewer';
  if (pathname.startsWith(ROUTES.portfolios)) return 'portfolios';
  return 'home';
}
