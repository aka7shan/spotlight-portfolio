import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Navigation } from "./components/layout/Navigation";
import { HomePage } from "./components/home/HomePage";
import { ChatWidget } from "./components/common/ChatWidget";
import { UnsavedChangesDialog } from "./components/common/UnsavedChangesDialog";
import { SetupRequired } from "./components/common/SetupRequired";
import type { User, PortfolioData } from "./types/portfolio";
import { portfolioDataManager } from "./utils/portfolioDataManager";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";

// Routes that aren't visited on first paint are code-split into separate chunks
// so the home page can render with the smallest possible JS payload.
const LoginPage = lazy(() =>
  import("./components/login/LoginPage").then(m => ({ default: m.LoginPage })),
);
const SignupPage = lazy(() =>
  import("./components/signup/SignupPage").then(m => ({ default: m.SignupPage })),
);
const PortfolioGallery = lazy(() =>
  import("./components/gallery/PortfolioGallery").then(m => ({ default: m.PortfolioGallery })),
);
const ProfilePage = lazy(() =>
  import("./components/profile/ProfilePage").then(m => ({ default: m.ProfilePage })),
);
const PortfolioViewer = lazy(() =>
  import("./components/viewer/PortfolioViewer").then(m => ({ default: m.PortfolioViewer })),
);

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const { status: authStatus, user: authUser, isConfigured, signOut } = useAuth();
  const { user, status: profileStatus, error: profileError, reload, save } = useProfile();

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

  const [currentPage, setCurrentPage] = useState<string>("home");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedSections, setChangedSections] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Auth-driven routing. Two concerns:
  //   - Authed users should never sit on login / signup pages (they'd be stuck
  //     because those pages have no "you're already in" UI).
  //   - When the auth listener fires "signed out" we wipe transient UI state
  //     so a re-login doesn't inherit somebody else's selected template.
  const prevAuthRef = useRef(authStatus);
  useEffect(() => {
    const prev = prevAuthRef.current;
    prevAuthRef.current = authStatus;

    if (authStatus === "authenticated") {
      // Redirect away from auth pages whenever we're authed, even if there's no
      // status *transition* (e.g. user already had a session and just hit /login).
      setCurrentPage((page) =>
        page === "login" || page === "signup" || page === "home" ? "profile" : page,
      );
    }
    if (prev === "authenticated" && authStatus === "unauthenticated") {
      setCurrentPage("home");
      setHasUnsavedChanges(false);
      setChangedSections([]);
      setSelectedTemplate(null);
      setPortfolioData(null);
      setIsPreviewMode(false);
    }
  }, [authStatus]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const handleNavigationRequest = useCallback(
    (page: string) => {
      if (currentPage === "profile" && hasUnsavedChanges) {
        setPendingNavigation(page);
        setShowUnsavedDialog(true);
      } else {
        handleNavigate(page);
      }
    },
    [currentPage, hasUnsavedChanges, handleNavigate],
  );

  const handleDialogSave = useCallback(() => {
    // Actual save lives in ProfilePage; here we just close and continue.
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      handleNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, handleNavigate]);

  const handleDialogDiscard = useCallback(() => {
    setHasUnsavedChanges(false);
    setChangedSections([]);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      handleNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, handleNavigate]);

  const handleDialogClose = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  }, []);

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      if (user && portfolioDataManager.isProfileComplete(user)) {
        setPortfolioData(portfolioDataManager.generateFromUser(user));
        setSelectedTemplate(templateId);
        setIsPreviewMode(false);
        setCurrentPage("portfolio-viewer");
      }
    },
    [user],
  );

  const handleTemplatePreview = useCallback((templateId: string) => {
    setPortfolioData(portfolioDataManager.getDummyData(templateId));
    setSelectedTemplate(templateId);
    setIsPreviewMode(true);
    setCurrentPage("portfolio-viewer");
  }, []);

  const handleTemplateSwitch = useCallback(
    (templateId: string) => {
      setSelectedTemplate(templateId);
      if (isPreviewMode) {
        setPortfolioData(portfolioDataManager.getDummyData(templateId));
      } else if (user) {
        setPortfolioData(portfolioDataManager.generateFromUser(user));
      }
    },
    [isPreviewMode, user],
  );

  const handleBackToGallery = useCallback(() => {
    setCurrentPage("portfolios");
    setSelectedTemplate(null);
    setPortfolioData(null);
    setIsPreviewMode(false);
  }, []);

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
        const saved = await save(updatedUser);
        setHasUnsavedChanges(false);
        setChangedSections([]);
        if (
          currentPage === "portfolio-viewer" &&
          !isPreviewMode &&
          portfolioDataManager.isProfileComplete(saved)
        ) {
          setPortfolioData(portfolioDataManager.generateFromUser(saved));
        }
        toast.success("Profile saved");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save profile";
        toast.error(message);
      }
    },
    [currentPage, isPreviewMode, save],
  );

  const handleProfileChange = useCallback((sections: string[]) => {
    setHasUnsavedChanges(sections.length > 0);
    setChangedSections(sections);
  }, []);

  const handleProfileNavigationRequest = useCallback(
    (destination: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(destination);
        setShowUnsavedDialog(true);
      } else if (!destination.includes("Tab")) {
        handleNavigate(destination);
      }
    },
    [hasUnsavedChanges, handleNavigate],
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

  // ---------------------------------------------------------------------------
  // Early returns: setup screen + initial auth bootstrap
  // ---------------------------------------------------------------------------

  if (!isConfigured) return <SetupRequired />;

  if (authStatus === "loading") return <RouteFallback />;

  const isAuthed = authStatus === "authenticated";
  const isProfileLoading = isAuthed && profileStatus === "loading" && !user;

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNavigationRequest={handleNavigationRequest}
        user={navUser}
        onLogout={handleLogout}
      />

      <Suspense fallback={<RouteFallback />}>
        {currentPage === "home" && <HomePage onNavigate={handleNavigationRequest} user={user} />}

        {currentPage === "login" && <LoginPage onNavigate={handleNavigationRequest} />}

        {currentPage === "signup" && <SignupPage onNavigate={handleNavigationRequest} />}

        {currentPage === "portfolios" && (
          <PortfolioGallery
            onNavigate={handleNavigationRequest}
            user={user}
            onTemplateSelect={handleTemplateSelect}
            onTemplatePreview={handleTemplatePreview}
            isProfileComplete={user ? portfolioDataManager.isProfileComplete(user) : false}
          />
        )}

        {currentPage === "portfolio-viewer" && portfolioData && selectedTemplate && (
          <PortfolioViewer
            portfolioData={portfolioData}
            selectedTemplate={selectedTemplate}
            onTemplateSwitch={handleTemplateSwitch}
            onBackToGallery={handleBackToGallery}
            onEditProfile={() => handleNavigationRequest("profile")}
            isPreviewMode={isPreviewMode}
            user={user}
          />
        )}

        {currentPage === "profile" && (
          isProfileLoading ? (
            <RouteFallback />
          ) : user ? (
            <ProfilePage
              user={user}
              onNavigate={handleProfileNavigationRequest}
              onUpdateProfile={handleUpdateProfile}
              onProfileChange={handleProfileChange}
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
          )
        )}
      </Suspense>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        changedSections={changedSections}
        targetDestination={pendingNavigation || ""}
      />

      <ChatWidget />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
