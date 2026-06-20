import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface ProfileScoreCardProps {
  /** 0-100. Drives both the ring fill and the centre label. */
  percent: number;
  /** Labels of fields the user hasn't filled in yet. */
  missingFields: readonly string[];
  /**
   * Fired when the user clicks a pending-action row. Maps the missing
   * label (e.g. "About", "Skills") to a section id the parent owns.
   * If the parent returns null/undefined, we silently do nothing.
   */
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Maps the labels surfaced by `getProfileCompleteness` to the section ids
 * declared in `SectionNav.PROFILE_SECTIONS`. Adding a new completeness
 * field? Mirror it here so the row stays clickable. Unmapped labels
 * still render — they just don't navigate anywhere.
 *
 * Keep this map adjacent to the component that consumes it (rather than
 * in validators) so a frontend-only nav change doesn't force a shared-
 * code edit.
 */
const MISSING_FIELD_TO_SECTION: Record<string, string> = {
  Name: "section-personal",
  Title: "section-personal",
  About: "section-summary",
  Skills: "section-skills",
  Experience: "section-experience",
};

/**
 * Pure-SVG circular progress ring used in the profile sidebar.
 *
 * Why hand-rolled vs. a charting lib? We render exactly one value with
 * no axes/legends/tooltips — recharts would be 30 KB for a single
 * stroke-dasharray trick. The svg below is < 40 lines and renders
 * identically on every browser we care about.
 */
function ScoreRing({ percent }: { percent: number }) {
  // Clamp + round defensively — callers occasionally pass a float or
  // out-of-range value while the data is still loading.
  const safe = Math.max(0, Math.min(100, Math.round(percent)));
  const SIZE = 64;
  const STROKE = 6;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  // stroke-dasharray + stroke-dashoffset is the canonical pure-SVG
  // approach for a progress ring. We compose two circles: a faint
  // background ring + the colored progress ring on top, rotated -90deg
  // so the start of the stroke is at 12 o'clock.
  const dashOffset = CIRCUMFERENCE * (1 - safe / 100);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="-rotate-90"
      role="img"
      aria-label={`${safe}% complete`}
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        stroke="currentColor"
        strokeWidth={STROKE}
        fill="none"
        className="text-gray-200"
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        className={
          safe >= 80
            ? "text-emerald-500"
            : safe >= 50
              ? "text-amber-500"
              : "text-rose-500"
        }
        style={{ transition: "stroke-dashoffset 600ms ease-out" }}
      />
    </svg>
  );
}

export function ProfileScoreContent({
  percent,
  missingFields,
  onJumpToSection,
}: ProfileScoreCardProps) {
  const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
  // Each missing field is roughly worth `100 / completenessFieldCount`
  // percentage points. We don't have direct access to the source array
  // here, so we infer the per-field weight from missingFields.length
  // and the current percent gap — close enough for the "+9%" hint.
  const remainingGap = 100 - safePercent;
  const perFieldGain =
    missingFields.length > 0
      ? Math.max(1, Math.round(remainingGap / missingFields.length))
      : 0;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <ScoreRing percent={safePercent} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900">
              {safePercent}%
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">Profile score</p>
          <p className="text-xs text-gray-500 leading-snug mt-0.5">
            Recruiters seek 100% profiles — complete yours to stand out!
          </p>
        </div>
      </div>

      {missingFields.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            Pending action
          </p>
          <ul className="space-y-1.5">
            {missingFields.map((label) => {
              const sectionId = MISSING_FIELD_TO_SECTION[label];
              const clickable = Boolean(sectionId && onJumpToSection);
              return (
                <li key={label}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => sectionId && onJumpToSection?.(sectionId)}
                    className={
                      "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm " +
                      (clickable
                        ? "hover:bg-amber-50 cursor-pointer"
                        : "cursor-default")
                    }
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-gray-700 truncate">{label}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Badge
                        variant="outline"
                        className="text-emerald-700 border-emerald-200 bg-emerald-50"
                      >
                        +{perFieldGain}%
                      </Badge>
                      {clickable && (
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

/**
 * Standalone card wrapper around `ProfileScoreContent`. Kept for any
 * caller that wants the score on its own; the action rail embeds the
 * bare content inside the combined Portfolio Builder card instead.
 */
export function ProfileScoreCard(props: ProfileScoreCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <ProfileScoreContent {...props} />
      </CardContent>
    </Card>
  );
}
