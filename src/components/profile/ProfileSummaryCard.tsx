import { Sparkles, MapPin, Pencil } from "lucide-react";
import type { User } from "../../types/portfolio";
import { Card, CardContent } from "../ui/card";
import { AvatarUpload } from "./AvatarUpload";
import { CoverUpload } from "./CoverUpload";
import {
  computeTotalExperience,
  currentJob,
  formatExperienceDuration,
  formatExperienceRange,
} from "../../utils/experienceMath";

interface ProfileSummaryCardProps {
  user: User;
  /**
   * Fired from the embedded `AvatarUpload`. Forwarded straight to the
   * `ProfilePage`'s `handleUserPersisted` which surgically updates the
   * cached user without flagging the form as dirty.
   */
  onUserPersisted: (user: User) => void;
  /**
   * Jump to a specific section. The "edit" pencil next to the name
   * scrolls the right column to Personal Details and ideally focuses
   * the first input there. Defaults to a no-op so this card is safe
   * to use outside the new layout.
   */
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Top-left card on the redesigned profile page. Renders:
 *
 *   - Avatar (live `AvatarUpload`, no `coverImage` here — that lived on
 *     the old `ProfileHeader` and we deliberately drop it from the new
 *     layout to make the sidebar feel like a focused identity card).
 *   - Name + Title + current company + current role's date range + duration
 *   - Location
 *   - Stats row: Total exp / Salary / Notice period (mirrors image 4)
 *   - "Profile last updated on: <date>" footer
 *
 * Most of the data is derived from `user.experience` via the
 * `experienceMath` helpers — there's no separate `currentCompany` field
 * on `User` and we don't want one (it'd drift the moment the user
 * changes jobs). The helpers fall back gracefully on empty/unparseable
 * data so this card never throws.
 */
export function ProfileSummaryCard({
  user,
  onUserPersisted,
  onJumpToSection,
}: ProfileSummaryCardProps) {
  const current = currentJob(user.experience);
  const totalExp = computeTotalExperience(user.experience);

  // Last-updated as a short month-day-year. We avoid date-fns here for
  // the same reasons as experienceMath: trivial format, no need to ship
  // locale code for one helper.
  const lastUpdatedLabel = user.updatedAt
    ? new Date(user.updatedAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {/*
        Cover image banner behind the avatar. Uploads/removes through the
        dedicated POST /v1/me/cover endpoint (no dirty-flag involvement)
        via CoverUpload's compact mode. Falls back to a pastel gradient
        when no cover is set.
      */}
      <div className="relative">
        <CoverUpload
          currentCover={user.coverImage}
          onCoverPersisted={onUserPersisted}
          compact
          heightClassName="aspect-[5/2]"
        />
        {/* Avatar is seated inside the cover's bottom-left so the banner
            fills the whole header (no empty band beside the avatar). */}
        <div className="absolute bottom-4 left-5 z-10">
          <AvatarUpload
            currentAvatar={user.avatar}
            userName={user.name}
            onAvatarPersisted={onUserPersisted}
          />
        </div>
      </div>

      <CardContent className="px-5 pb-5 pt-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {user.name || "Your Name"}
            </h2>
            <button
              type="button"
              aria-label="Edit personal details"
              onClick={() => onJumpToSection?.("section-personal")}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {user.title && (
            <p className="text-sm text-gray-700 mt-0.5">{user.title}</p>
          )}
          {current?.company && (
            <p className="text-sm text-gray-500">{current.company}</p>
          )}

          {current && (
            <p className="mt-2 text-sm text-purple-700">
              {formatExperienceRange(current)}
              {(() => {
                const dur = formatExperienceDuration(current);
                return dur ? <> · {dur}</> : null;
              })()}
            </p>
          )}

          {user.location && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {/*
          Stats grid. Each cell renders an em-dash when the underlying
          value is missing so the layout stays stable for empty profiles
          (avoids a "ragged" look when only some stats are filled).
        */}
        <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <Stat label="Total exp" value={totalExp} />
          <Stat label="Salary" value={user.salary || "—"} />
          <Stat label="Notice period" value={user.noticePeriod || "—"} />
        </div>

        {lastUpdatedLabel && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Profile last updated on: {lastUpdatedLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1 truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
