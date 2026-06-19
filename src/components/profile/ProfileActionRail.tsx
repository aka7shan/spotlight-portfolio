import { Eye, Save, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import type { User } from "../../types/portfolio";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ProfileScoreCard } from "./ProfileScoreCard";
import { ShortLinkCard } from "./ShortLinkCard";
import { CVManager } from "./CVManager";

interface ProfileActionRailProps {
  /** Dirty flag — gates the save button and the "Unsaved" badge. */
  hasUnsavedChanges: boolean;
  /** True while a PUT /v1/me is in flight; shows the spinner. */
  isSaving: boolean;
  /** Triggers the save. May resolve async; we don't await here. */
  onSave: () => void;
  /** From `getProfileCompleteness`. Drives the score ring. */
  profileCompleteness: number;
  /** From `getProfileCompleteness`. Drives the pending-action list. */
  missingFields: readonly string[];
  /** Pill-jump callback shared with the other columns. */
  onJumpToSection: (sectionId: string) => void;
  /**
   * Current short code (from GET /v1/me). When present we render the
   * shareable-link card. Optional so the rail still works for users
   * whose payload predates short codes.
   */
  shortCode?: string;
  /** Patches the parent's snapshot after a regenerate. */
  onShortCodeChanged: (newCode: string) => void;
  /**
   * Navigate to the templates gallery. Gated behind a 100% profile —
   * templates need the full data set to render well.
   */
  onViewTemplates: () => void;
  /** Current form-state user — fed to the CV card for upload/parse. */
  currentUser: User;
  /** Bubbled from CVManager after an upload/remove persists. */
  onUserPersisted: (user: User) => void;
  /** Merges accepted CV-parse output into the parent form state. */
  onApplyExtracted: (partial: Partial<User>) => void;
  className?: string;
}

/**
 * Right-hand "action rail" for the profile page.
 *
 * Groups everything that acts *on* the profile rather than describing
 * it: the Portfolio Builder save controls, completeness score, the
 * View Templates jump, and the shareable link. Mirrors `ProfileSidebar`
 * (the left identity column) so the parent can flank the editable
 * sections with a sticky column on each side.
 */
export function ProfileActionRail({
  hasUnsavedChanges,
  isSaving,
  onSave,
  profileCompleteness,
  missingFields,
  onJumpToSection,
  shortCode,
  onShortCodeChanged,
  onViewTemplates,
  currentUser,
  onUserPersisted,
  onApplyExtracted,
  className,
}: ProfileActionRailProps) {
  return (
    <aside className={cn("space-y-4", className)}>
      <div className="bg-white/85 backdrop-blur-lg border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Portfolio Builder
            </h2>
          </div>
          {hasUnsavedChanges && (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved
            </Badge>
          )}
        </div>
        <Button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          title={hasUnsavedChanges ? undefined : "No changes to save"}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <ProfileScoreCard
        percent={profileCompleteness}
        missingFields={missingFields}
        onJumpToSection={onJumpToSection}
      />

      {profileCompleteness === 100 && (
        <Button
          onClick={onViewTemplates}
          variant="outline"
          className="w-full flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Eye className="w-4 h-4" />
          View Templates
        </Button>
      )}

      {shortCode && (
        <ShortLinkCard shortCode={shortCode} onShortCodeChanged={onShortCodeChanged} />
      )}

      <CVManager
        currentUser={currentUser}
        onUserPersisted={onUserPersisted}
        onApplyExtracted={onApplyExtracted}
        className="border-0 shadow-sm"
      />
    </aside>
  );
}
