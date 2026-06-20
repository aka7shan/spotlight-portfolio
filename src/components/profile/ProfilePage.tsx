import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileActionRail } from "./ProfileActionRail";
import { SectionNav } from "./SectionNav";
import { PROFILE_SECTIONS } from "./sectionDefinitions";
import { ExperienceTab } from "./ExperienceTab";
import { EducationTab } from "./EducationTab";
import { CertificationsTab } from "./CertificationsTab";
import { AchievementsTab } from "./AchievementsTab";
import { LanguagesTab } from "./LanguagesTab";
import {
  PersonalDetailsSection,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./ProfileSections";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import {
  validateUserForSave,
  getProfileCompleteness,
} from "../../lib/validators/user";
import type { User } from "../../types/portfolio";

interface ProfilePageProps {
  user: User;
  onNavigate: (page: string) => void;
  /**
   * Persists the full user. Resolves `true` on success, `false` on
   * failure (the parent toasts the error). The page uses the result to
   * decide whether to baseline the form as "saved".
   */
  onUpdateProfile: (user: User) => Promise<boolean>;
  onProfileChange: (sections: string[]) => void;
  /**
   * Notified when avatar/cover (or any field persisted by a dedicated
   * endpoint outside the PUT /v1/me path) finishes saving. The parent
   * uses this to refresh the shared useProfile cache so consumers like
   * the navbar see the change without a manual reload.
   */
  onUserPersisted: (user: User) => void;
  hasUnsavedChanges: boolean;
  changedSections: string[];
}

// Scroll-spy "active line" offset: a section counts as active once its
// title crosses below this point. Kept >= the sections' scroll-mt so a
// section clicked from the nav registers as active immediately.
const STICKY_OFFSET_PX = 144;

// Map a validation error tab id (from validators/user.ts) to the
// matching section id. Used by the Save handler to scroll the right
// column to the first offending field on validation failure.
const VALIDATION_TAB_TO_SECTION: Record<string, string> = {
  profile: "section-personal",
  projects: "section-projects",
  experience: "section-experience",
  education: "section-education",
  certifications: "section-certifications",
  achievements: "section-achievements",
  languages: "section-languages",
};

export function ProfilePage({
  user,
  onNavigate,
  onUpdateProfile,
  onProfileChange,
  onUserPersisted,
  hasUnsavedChanges,
  changedSections,
}: ProfilePageProps) {
  const [formData, setFormData] = useState<User>(user);
  const [originalData, setOriginalData] = useState<User>(user);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  // True while a PUT /v1/me is in flight. Drives the Save button's
  // spinner/disabled state and blocks the Ctrl+S shortcut from firing
  // a second concurrent save.
  const [isSaving, setIsSaving] = useState(false);

  // Holds the latest `handleSave` so the keyboard shortcut effect can
  // call it without re-binding the listener on every render.
  const saveRef = useRef<(() => void | Promise<boolean>) | null>(null);
  const lastSyncedUserIdRef = useRef<string | null>(null);

  // Sync from parent only when the user *identity* changes — i.e. on
  // first mount, or after logout + login as a different user. See
  // pre-refactor comments for the dirty-flag rationale.
  useEffect(() => {
    if (lastSyncedUserIdRef.current !== user.id) {
      setFormData(user);
      setOriginalData(user);
      lastSyncedUserIdRef.current = user.id;
    }
  }, [user]);

  /**
   * Called by the sidebar's `ProfileSummaryCard` (which receives it from
   * `AvatarUpload`) and the CVManager. Same surgical-merge contract as
   * before: only update the fields persisted by their own endpoints, on
   * BOTH halves of the dirty-flag check, so unrelated in-flight edits
   * survive and the form doesn't show "dirty" for an already-persisted
   * upload.
   */
  const handleUserPersisted = useCallback(
    (updatedUser: User) => {
      setFormData((prev) => ({
        ...prev,
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage,
        cv: updatedUser.cv,
      }));
      setOriginalData((prev) => ({
        ...prev,
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage,
        cv: updatedUser.cv,
      }));
      onUserPersisted(updatedUser);
    },
    [onUserPersisted],
  );

  /**
   * Merge accepted CV-parse output into the form. Touches only
   * `formData` so the change-detector flags the diff and the user
   * has to hit Save to persist.
   */
  const handleApplyExtracted = useCallback((partial: Partial<User>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const { percent: profileCompleteness, missingFields } = useMemo(
    () => getProfileCompleteness(formData),
    [formData],
  );

  // Change detection — same algorithm as before the refactor: ref-equal
  // short-circuit + per-section JSON compare. Mostly verbatim because
  // the wire fields haven't changed.
  const detectedChanges = useMemo(() => {
    const changes: string[] = [];

    const personalChanged =
      formData.name !== originalData.name ||
      formData.title !== originalData.title ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.location !== originalData.location ||
      formData.about !== originalData.about ||
      formData.avatar !== originalData.avatar ||
      formData.coverImage !== originalData.coverImage ||
      formData.salary !== originalData.salary ||
      formData.noticePeriod !== originalData.noticePeriod;
    if (personalChanged) changes.push("Personal Information");

    const sections: Array<{ key: keyof User; label: string }> = [
      { key: "skills", label: "Skills" },
      { key: "projects", label: "Projects" },
      { key: "experience", label: "Experience" },
      { key: "education", label: "Education" },
      { key: "certifications", label: "Certifications" },
      { key: "achievements", label: "Achievements" },
      { key: "languages", label: "Languages" },
      { key: "cv", label: "CV/Resume" },
      { key: "socialLinks", label: "Social Links" },
    ];
    for (const { key, label } of sections) {
      const next = formData[key];
      const prev = originalData[key];
      if (next === prev) continue; // ref-equal → unchanged
      if (JSON.stringify(next ?? null) !== JSON.stringify(prev ?? null)) {
        changes.push(label);
      }
    }

    return changes;
  }, [formData, originalData]);

  useEffect(() => {
    onProfileChange(detectedChanges);
  }, [detectedChanges, onProfileChange]);

  const handleInputChange = useCallback((field: keyof User, value: any) => {
    // Bail out when the value is unchanged. Controlled inputs (notably the
    // semi-controlled phone field) can fire onChange with the value they
    // already hold; without this guard each no-op edit still allocates a new
    // formData object, re-renders the page, and can feed an update loop.
    setFormData((prev) => (prev[field] === value ? prev : { ...prev, [field]: value }));
  }, []);

  // ---------------------------------------------------------------------
  // Scroll-spy + jump
  // ---------------------------------------------------------------------

  const sectionIds = useMemo(() => PROFILE_SECTIONS.map((s) => s.id), []);
  const spyActiveId = useScrollSpy(sectionIds, { offset: STICKY_OFFSET_PX });

  // Optimistic pill highlight. Short trailing sections can't always be
  // scrolled under the sticky nav, so the scroll-spy alone would never
  // mark them active when clicked. We light the clicked pill immediately
  // and hold it until the user scrolls again (see the effect below).
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);
  const programmaticUntilRef = useRef(0);
  const activeSectionId = manualActiveId ?? spyActiveId;

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    setManualActiveId(sectionId);
    // Ignore the scroll events this smooth-scroll emits; only a later,
    // user-initiated scroll should release the manual highlight.
    programmaticUntilRef.current = Date.now() + 800;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Hand control back to the scroll-spy once the user scrolls on their
  // own (after the programmatic smooth-scroll has settled).
  useEffect(() => {
    if (manualActiveId === null) return;
    const onScroll = () => {
      if (Date.now() > programmaticUntilRef.current) setManualActiveId(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [manualActiveId]);

  // ---------------------------------------------------------------------
  // Save (with deep-link to broken section)
  // ---------------------------------------------------------------------

  const handleSave = useCallback(async (): Promise<boolean> => {
    const { ok, errors } = validateUserForSave(formData);
    if (!ok) {
      const firstTab = errors[0]?.tab;
      const sectionId = firstTab ? VALIDATION_TAB_TO_SECTION[firstTab] : null;
      if (sectionId) scrollToSection(sectionId);

      const head = errors.slice(0, 3).map((e) => `• ${e.message}`).join("\n");
      const more = errors.length > 3 ? `\n…and ${errors.length - 3} more` : "";
      toast.error("Please fix the highlighted fields before saving.", {
        description: head + more,
        duration: 8000,
      });
      return false;
    }

    // Capture the snapshot we're persisting so a successful save baselines
    // against exactly what went over the wire — not whatever the user may
    // have typed while the request was in flight.
    const snapshot = formData;
    setIsSaving(true);
    try {
      const saved = await onUpdateProfile(snapshot);
      // CRITICAL: only baseline `originalData` on SUCCESS. The previous
      // implementation did this optimistically, so a failed save still
      // cleared the dirty flag and silently dropped the user's changes.
      if (saved) setOriginalData(snapshot);
      return saved;
    } finally {
      setIsSaving(false);
    }
  }, [formData, onUpdateProfile, scrollToSection]);

  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  // Cmd/Ctrl+S saves without leaving the keyboard. We guard on
  // `hasUnsavedChanges` so the shortcut is a no-op on a clean form, and
  // call through the ref so this listener binds once.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (hasUnsavedChanges) void saveRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasUnsavedChanges]);

  // ---------------------------------------------------------------------
  // Unsaved-changes dance (now only triggered by external page-level
  // navigation requests — section jumps are intra-page and never lose
  // form state).
  // ---------------------------------------------------------------------

  const handleNavigationRequest = useCallback(
    (destination: string) => {
      // `Tab` strings used to denote intra-Tabs navigation. The new
      // layout doesn't have tabs, so we short-circuit those: any
      // legacy " Tab"-suffixed string is now a scrollTo into the
      // matching section, no dialog needed.
      if (destination.endsWith(" Tab")) {
        const map: Record<string, string> = {
          "Profile Tab": "section-personal",
          "Experience Tab": "section-experience",
          "Education Tab": "section-education",
          "Certifications Tab": "section-certifications",
          "Achievements Tab": "section-achievements",
          "Languages Tab": "section-languages",
        };
        const sectionId = map[destination];
        if (sectionId) scrollToSection(sectionId);
        return;
      }

      if (hasUnsavedChanges) {
        setPendingNavigation(destination);
        setShowUnsavedDialog(true);
      } else {
        onNavigate(destination);
      }
    },
    [hasUnsavedChanges, onNavigate, scrollToSection],
  );

  const handleDialogSave = useCallback(async () => {
    const saved = await handleSave();
    setShowUnsavedDialog(false);
    // Only proceed with the queued navigation if the save actually
    // succeeded — otherwise keep the user on the page with their
    // changes intact so they can retry.
    if (saved && pendingNavigation) {
      onNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [handleSave, pendingNavigation, onNavigate]);

  const handleDialogDiscard = useCallback(() => {
    setFormData(originalData);
    setShowUnsavedDialog(false);

    if (pendingNavigation) {
      onNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [originalData, pendingNavigation, onNavigate]);

  const handleDialogClose = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="pt-20 pb-12">
          <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8">
            {/*
              Three-column body.
                - lg+: identity column | editable sections | action rail
                - mobile: everything stacks (see `order-last` below)
              All three tracks are fractional (1 : 2.5 : 1) so the whole
              layout scales with the viewport instead of the middle column
              absorbing every resize. The side columns floor at 300px
              (below that the cards get cramped) and then the middle keeps
              shrinking on its own.
              `items-start` on the grid is needed for `lg:sticky` to
              behave on the side columns (sticky only works when the
              element is not a stretched flex/grid item).
            */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_minmax(0,2.5fr)_minmax(300px,1fr)] gap-6 items-start">
              {/* LEFT — identity: name, contact, social links. */}
              <ProfileSidebar
                user={formData}
                onUserPersisted={handleUserPersisted}
                onJumpToSection={scrollToSection}
                handleInputChange={handleInputChange}
                className="lg:sticky lg:top-20"
              />

              {/* MIDDLE — the editable sections. `order-last` drops it
                  below the identity + action columns on mobile so the
                  Save controls stay reachable near the top there. */}
              <div className="order-last lg:order-none">
                {/* Sticky section nav. Pins just under the global navbar
                    now that the full-width action bar is gone. */}
                <SectionNav
                  activeId={activeSectionId}
                  onSelect={scrollToSection}
                  className="sticky top-20 z-30"
                />

                <div className="mt-6 space-y-10">
                  <section id="section-summary" className="scroll-mt-36">
                    <SummarySection
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-personal" className="scroll-mt-36">
                    <PersonalDetailsSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-experience" className="scroll-mt-36">
                    <ExperienceTab
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-education" className="scroll-mt-36">
                    <EducationTab
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-skills" className="scroll-mt-36">
                    <SkillsSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-projects" className="scroll-mt-36">
                    <ProjectsSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-certifications" className="scroll-mt-36">
                    <CertificationsTab
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-achievements" className="scroll-mt-36">
                    <AchievementsTab
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>

                  <section id="section-languages" className="scroll-mt-36">
                    <LanguagesTab
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </section>
                </div>
              </div>

              {/* RIGHT — action rail: everything that acts on the profile
                  (save, score, templates, share link, CV). */}
              <ProfileActionRail
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                onSave={handleSave}
                profileCompleteness={profileCompleteness}
                missingFields={missingFields}
                onJumpToSection={scrollToSection}
                shortCode={formData.shortCode}
                onShortCodeChanged={(newCode) => {
                  setFormData((prev) => ({ ...prev, shortCode: newCode }));
                  setOriginalData((prev) => ({ ...prev, shortCode: newCode }));
                }}
                onViewTemplates={() => handleNavigationRequest("portfolios")}
                currentUser={formData}
                onUserPersisted={handleUserPersisted}
                onApplyExtracted={handleApplyExtracted}
                className="lg:sticky lg:top-20"
              />
            </div>
          </div>
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        changedSections={changedSections}
        targetDestination={pendingNavigation || ""}
      />
    </>
  );
}
