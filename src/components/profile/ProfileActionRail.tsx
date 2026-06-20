import { Eye, Save, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import type { User } from "../../types/portfolio";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ProfileScoreContent } from "./ProfileScoreCard";
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
  // Defined once so the two layouts below (full-width at <100%, half-
  // width beside View Templates at 100%) share identical markup. The
  // `w-full` works in both: it fills the row when alone and the grid
  // cell when paired.
  const saveButton = (
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
  );

  return (
    <aside className={cn("space-y-4", className)}>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
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

          <div className="pt-4 border-t border-gray-100">
            <ProfileScoreContent
              percent={profileCompleteness}
              missingFields={missingFields}
              onJumpToSection={onJumpToSection}
            />
          </div>

          {profileCompleteness === 100 ? (
            // flex-wrap (not a rigid 2-col grid) so the buttons sit side by
            // side on a wide rail but stack once the column narrows — the
            // labels would otherwise overflow as the layout scales down.
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[140px]">{saveButton}</div>
              <div className="flex-1 min-w-[140px]">
                <Button
                  onClick={onViewTemplates}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Eye className="w-4 h-4" />
                  View Templates
                </Button>
              </div>
            </div>
          ) : (
            saveButton
          )}
        </CardContent>
      </Card>

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
