import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  Routes,
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Navigation } from "./components/layout/Navigation";
import { HomePage } from "./components/home/HomePage";
import { ChatWidget } from "./components/common/ChatWidget";
import { UnsavedChangesDialog } from "./components/common/UnsavedChangesDialog";
import { SetupRequired } from "./components/common/SetupRequired";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import type { User, PortfolioData } from "./types/portfolio";
import { portfolioDataManager } from "./utils/portfolioDataManager";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import { ApiError, api } from "./lib/api";
import {
  ROUTES,
  pageIdToPath,
  pathToPageId,
  portfolioViewerPath,
  type PageId,
} from "./lib/routes";

// Routes that aren't visited on first paint are code-split into separate chunks
// so the home page can render with the smallest possible JS payload.
//
// The dynamic-import factories are pulled out into named consts (instead of
// being inlined into `lazy(...)`) so we can call them eagerly for prefetch —
// see the auth-driven effect below.
const importLoginPage = () => import("./components/login/LoginPage");
const importSignupPage = () => import("./components/signup/SignupPage");
const importPortfolioGallery = () => import("./components/gallery/PortfolioGallery");
const importProfilePage = () => import("./components/profile/ProfilePage");
const importPortfolioViewer = () => import("./components/viewer/PortfolioViewer");
const importPublicPortfolioPage = () => import("./components/public/PublicPortfolioPage");

const LoginPage = lazy(() => importLoginPage().then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => importSignupPage().then((m) => ({ default: m.SignupPage })));
const PortfolioGallery = lazy(() =>
  importPortfolioGallery().then((m) => ({ default: m.PortfolioGallery })),
);
const ProfilePage = lazy(() => importProfilePage().then((m) => ({ default: m.ProfilePage })));
const PortfolioViewer = lazy(() =>
  importPortfolioViewer().then((m) => ({ default: m.PortfolioViewer })),
);
const PublicPortfolioPage = lazy(() =>
  importPublicPortfolioPage().then((m) => ({ default: m.PublicPortfolioPage })),
);

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Valid pageIds that can be passed through the legacy `onNavigate(pageId)` API.
const VALID_PAGE_IDS: ReadonlySet<PageId> = new Set([
  'home',
  'login',
  'signup',
  'profile',
  'portfolios',
  'portfolio-viewer',
  'short-link',
]);

export default function App() {
  const { status: authStatus, user: authUser, isConfigured, signOut } = useAuth();
  const { user, status: profileStatus, error: profileError, reload, save, applyPersisted } = useProfile();

  const location = useLocation();
  const navigate = useNavigate();

  // Derive the "active page id" from the URL so all the child components
  // that already expect a pageId-shaped callback keep working unchanged.
  const currentPage = useMemo(() => pathToPageId(location.pathname), [location.pathname]);

  // What the Navigation should show. If we're authenticated but the profile
  // call hasn't returned yet (or failed), still show "signed-in" UI using the
  // auth user as a fallback — otherwise the user sees Login/Signup buttons
  // while they're actually signed in, which is super confusing.
  const navUser: User | null = user ?? (
    authStatus === "authenticated" && authUser
      ? {
          id: authUser.id,
          email: authUser.email ?? "",
          name:
            (authUser.user_metadata?.name as string | undefined) ||
            authUser.email?.split("@")[0] ||
            "You",
          avatar: (authUser.user_metadata?.avatar_url as string | undefined) ?? "",
        }
      : null
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedSections, setChangedSections] = useState<string[]>([]);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Bridge: child components still call `onNavigate('signup')` with the legacy
  // pageId. Translate to a real URL + navigate. Unknown ids are routed to home
  // so a typo / dead string can't blank the page. Strings ending in " Tab" are
  // ProfilePage's internal subnav and should never leave /profile.
  const handleNavigate = useCallback(
    (page: string) => {
      if (page.endsWith(' Tab')) return;
      if (!VALID_PAGE_IDS.has(page as PageId)) {
        navigate(ROUTES.home);
        return;
      }
      navigate(pageIdToPath(page as PageId));
    },
    [navigate],
  );

  // Page-level navigation requests. The unsaved-changes dance is now driven by
  // react-router's <useBlocker>; this stays as an alias for compatibility with
  // child components that already accept it.
  const handleNavigationRequest = useCallback(
    (page: string) => {
      handleNavigate(page);
    },
    [handleNavigate],
  );

  // Profile-page subnav requests. Tab switches (strings ending in " Tab") are
  // handled internally by ProfilePage — we just don't navigate away.
  const handleProfileNavigationRequest = useCallback(
    (destination: string) => {
      if (destination.endsWith(' Tab')) return;
      handleNavigate(destination);
    },
    [handleNavigate],
  );

  // -------------------------------------------------------------------------
  // Auth-driven routing
  // -------------------------------------------------------------------------
  // Two concerns:
  //   - Authed users who land on login/signup get bounced to /profile (those
  //     pages have no "you're already signed in" UI).
  //   - When we transition to "signed out" we wipe transient form state so a
  //     re-login doesn't inherit somebody else's unsaved-changes flag.
  const prevAuthRef = useRef(authStatus);
  useEffect(() => {
    const prev = prevAuthRef.current;
    prevAuthRef.current = authStatus;

    if (authStatus === "authenticated" && prev !== "authenticated") {
      // Just signed in. Honor `?next=` if present so we resume where they were
      // forced to log in from; otherwise default to /profile from the auth
      // pages, and leave the home page alone (signed-in users still get a
      // useful "complete your profile" pitch there).
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      const isAuthScreen =
        location.pathname === ROUTES.login || location.pathname === ROUTES.signup;
      if (next) {
        navigate(next, { replace: true });
      } else if (isAuthScreen) {
        navigate(ROUTES.profile, { replace: true });
      }

      // Authenticated users will almost certainly hit /profile and /portfolios
      // next. Kick off chunk downloads in the background NOW so they're in
      // the cache by the time the user navigates. The promises are
      // intentionally floated — failures are caught and ignored because
      // these are speculative prefetches; the real <Suspense> boundary
      // around <Routes> will retry the import if the user actually navigates.
      void importProfilePage().catch(() => undefined);
      void importPortfolioGallery().catch(() => undefined);
      void importPortfolioViewer().catch(() => undefined);
    }

    if (prev === "authenticated" && authStatus === "unauthenticated") {
      setHasUnsavedChanges(false);
      setChangedSections([]);
      navigate(ROUTES.home, { replace: true });
    }
  // location is intentionally not in deps — this effect should only fire on
  // auth transitions, not on every URL change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, navigate]);

  // -------------------------------------------------------------------------
  // Unsaved-changes guard for /profile
  // -------------------------------------------------------------------------
  // react-router's useBlocker intercepts both in-app navigations AND browser
  // back/forward when `shouldBlock` is true. We surface the dialog and let
  // the user choose: Save (close dialog, user manually clicks Save in
  // ProfilePage), Discard (drop changes + proceed), Cancel (stay).
  const isOnProfilePage = currentPage === 'profile';
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      isOnProfilePage &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setPendingNavigation(blocker.location.pathname);
      setShowUnsavedDialog(true);
    }
  }, [blocker]);

  // "Save & Continue": closes the dialog and cancels the navigation so the
  // user can press the in-page Save button. We deliberately don't navigate
  // away here — the original implementation did, but it lost the user's
  // changes silently. Surfacing this as "you need to save first" is safer.
  const handleDialogSave = useCallback(() => {
    setShowUnsavedDialog(false);
    if (blocker.state === 'blocked') blocker.reset();
    setPendingNavigation(null);
  }, [blocker]);

  const handleDialogDiscard = useCallback(() => {
    setHasUnsavedChanges(false);
    setChangedSections([]);
    setShowUnsavedDialog(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
    setPendingNavigation(null);
  }, [blocker]);

  const handleDialogClose = useCallback(() => {
    setShowUnsavedDialog(false);
    if (blocker.state === 'blocked') blocker.reset();
    setPendingNavigation(null);
  }, [blocker]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign out";
      toast.error(message);
    }
  }, [signOut]);

  const handleUpdateProfile = useCallback(
    async (updatedUser: User) => {
      try {
        await save(updatedUser);
        setHasUnsavedChanges(false);
        setChangedSections([]);
        toast.success("Profile saved");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save profile";
        toast.error(message);
      }
    },
    [save],
  );

  const handleProfileChange = useCallback((sections: string[]) => {
    setHasUnsavedChanges(sections.length > 0);
    setChangedSections(sections);
  }, []);

  /**
   * Bridge for child components that persist a user-shaped payload through
   * a dedicated endpoint (POST /v1/me/avatar, POST /v1/me/cover, …) and
   * need the global useProfile cache to reflect the new value immediately
   * — without a follow-up GET /v1/me.
   *
   * Today this is wired from ProfilePage > ProfileHeader > AvatarUpload /
   * CoverUpload. The handler just hands the assembled user the backend
   * returned straight into useProfile.applyPersisted, which atomically
   * swaps the cached user. Any consumer of `user` (navbar avatar, gallery
   * page, etc.) sees the fresh value on its next render.
   */
  const handleUserPersisted = useCallback(
    (updatedUser: User) => {
      applyPersisted(updatedUser);
    },
    [applyPersisted],
  );

  /**
   * Persist a new active template choice from the gallery.
   *
   * Fire-and-forget from the card's POV: we hit PUT /v1/me/portfolio,
   * then refresh the user payload via `reload()` so the gallery's
   * "Live" badge swaps onto the newly-selected card. We toast on both
   * success and failure so the user always knows what happened.
   *
   * Errors thrown propagate to the card's catch path (which is a
   * no-op besides resetting its local spinner) so we don't double-
   * toast.
   */
  const handleSetActiveTemplate = useCallback(
    async (templateId: string) => {
      try {
        await api.me.setTemplate(templateId);
        await reload();
        toast.success(`This template is now live at your public URL.`);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Couldn't update template";
        toast.error(message);
        throw err;
      }
    },
    [reload],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // The dialog's `getDestinationLabel` expects pageId-style strings ("home",
  // "portfolios", …). Convert the blocker's path back so the message still
  // reads as "you have unsaved changes that will be lost if you continue to
  // Home Page" rather than "/home".
  const dialogDestination = pendingNavigation ? pathToPageId(pendingNavigation) : '';

  // -------------------------------------------------------------------------
  // Early returns: setup screen + initial auth bootstrap
  // -------------------------------------------------------------------------

  if (!isConfigured) return <SetupRequired />;
  if (authStatus === "loading") return <RouteFallback />;

  const isAuthed = authStatus === "authenticated";
  const isProfileLoading = isAuthed && profileStatus === "loading" && !user;

  // Public portfolio pages render without the app chrome (no Navigation, no
  // ChatWidget). Visitors should see the portfolio fullscreen, not our
  // editor's UI. We still mount <Toaster> so any future public-page actions
  // (e.g. "copy contact email") can surface feedback.
  const isPublicPage = currentPage === 'short-link';

  return (
    <div className="min-h-screen bg-background">
      {!isPublicPage && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onNavigationRequest={handleNavigationRequest}
          user={navUser}
          onLogout={handleLogout}
        />
      )}

      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path={ROUTES.home}
              element={<HomePage onNavigate={handleNavigationRequest} user={user} />}
            />

            <Route
              path={ROUTES.login}
              element={<LoginPage onNavigate={handleNavigationRequest} />}
            />

            <Route
              path={ROUTES.signup}
              element={<SignupPage onNavigate={handleNavigationRequest} />}
            />

            <Route
              path={ROUTES.portfolios}
              element={
                <PortfolioGallery
                  onNavigate={handleNavigationRequest}
                  user={user}
                  onTemplateSelect={(id) => navigate(portfolioViewerPath(id, 'use'))}
                  onTemplatePreview={(id) => navigate(portfolioViewerPath(id, 'preview'))}
                  isProfileComplete={user ? portfolioDataManager.isProfileComplete(user) : false}
                  activeTemplateId={user?.activeTemplate}
                  onSetActiveTemplate={handleSetActiveTemplate}
                />
              }
            />

            {/* Preview a template with dummy data — public. */}
            <Route
              path="/portfolios/:templateId"
              element={
                <PortfolioViewerRoute
                  mode="preview"
                  user={user}
                  onEditProfile={() => navigate(ROUTES.profile)}
                />
              }
            />

            {/* Render the current user's data with this template — auth-gated. */}
            <Route
              path="/portfolios/:templateId/use"
              element={
                <RequireAuth isAuthed={isAuthed}>
                  <PortfolioViewerRoute
                    mode="use"
                    user={user}
                    onEditProfile={() => navigate(ROUTES.profile)}
                  />
                </RequireAuth>
              }
            />

            <Route
              path={ROUTES.profile}
              element={
                <RequireAuth isAuthed={isAuthed}>
                  {isProfileLoading ? (
                    <RouteFallback />
                  ) : user ? (
                    <ProfilePage
                      user={user}
                      onNavigate={handleProfileNavigationRequest}
                      onUpdateProfile={handleUpdateProfile}
                      onProfileChange={handleProfileChange}
                      onUserPersisted={handleUserPersisted}
                      hasUnsavedChanges={hasUnsavedChanges}
                      changedSections={changedSections}
                    />
                  ) : profileStatus === "error" ? (
                    <div className="max-w-md mx-auto mt-24 p-6 border border-destructive/30 bg-destructive/5 rounded-lg text-center space-y-4">
                      <h2 className="font-semibold text-lg">Couldn't load your profile</h2>
                      <p className="text-sm text-muted-foreground break-words">
                        {profileError?.message ?? "Unknown error"}
                      </p>
                      <button
                        type="button"
                        onClick={() => { void reload(); }}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <RouteFallback />
                  )}
                </RequireAuth>
              }
            />

            {/* Phase 1.2: anonymous public portfolio page by short code. */}
            <Route
              path={`${ROUTES.shortLink}/:code`}
              element={<PublicPortfolioPage />}
            />

            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        changedSections={changedSections}
        targetDestination={dialogDestination}
      />

      {/* ChatWidget is purely a logged-in-user feature; hide on auth and
          public-portfolio screens. */}
      {!isPublicPage &&
        currentPage !== "login" &&
        currentPage !== "signup" && <ChatWidget />}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route helpers
// ---------------------------------------------------------------------------

/**
 * Gate for auth-only routes. If the user isn't signed in we send them to
 * /login with `?next=` set to the URL they were trying to reach, so the
 * post-login redirect (see App's auth-driven effect) can bounce them back.
 */
function RequireAuth({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: ReactNode;
}) {
  const location = useLocation();
  if (!isAuthed) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?next=${next}`} replace />;
  }
  return <>{children}</>;
}

/**
 * URL-driven portfolio viewer:
 *   /portfolios/:templateId        → preview with dummy data (mode="preview")
 *   /portfolios/:templateId/use    → render the live user (mode="use")
 *
 * In "use" mode without a complete profile we silently fall back to preview
 * data — the alternative would be a 404-style "fill out your profile" panel,
 * but the existing ViewerToolbar already explains what to do.
 */
function PortfolioViewerRoute({
  mode,
  user,
  onEditProfile,
}: {
  mode: 'preview' | 'use';
  user: User | null;
  onEditProfile: () => void;
}) {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const safeTemplateId = templateId ?? 'classic';

  const canRenderLive =
    mode === 'use' && user != null && portfolioDataManager.isProfileComplete(user);

  const portfolioData: PortfolioData = useMemo(() => {
    return canRenderLive
      ? portfolioDataManager.generateFromUser(user as User)
      : portfolioDataManager.getDummyData(safeTemplateId);
  }, [canRenderLive, user, safeTemplateId]);

  return (
    <PortfolioViewer
      portfolioData={portfolioData}
      selectedTemplate={safeTemplateId}
      onTemplateSwitch={(id) => navigate(portfolioViewerPath(id, mode), { replace: true })}
      onBackToGallery={() => navigate(ROUTES.portfolios)}
      onEditProfile={onEditProfile}
      isPreviewMode={!canRenderLive}
      user={user}
    />
  );
}
