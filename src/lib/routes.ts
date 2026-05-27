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
 *
 * Anything else falls through to home (see App.tsx <Route path="*">).
 */

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  portfolios: '/portfolios',
} as const;

export type PageId =
  | 'home'
  | 'login'
  | 'signup'
  | 'profile'
  | 'portfolios'
  | 'portfolio-viewer';

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
    case 'portfolio-viewer':
      // Shouldn't be reached — viewer routes need a templateId. Fall back
      // to the gallery so the user lands somewhere useful.
      return ROUTES.portfolios;
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
  if (/^\/portfolios\/[^/]+/.test(pathname)) return 'portfolio-viewer';
  if (pathname.startsWith(ROUTES.portfolios)) return 'portfolios';
  return 'home';
}
