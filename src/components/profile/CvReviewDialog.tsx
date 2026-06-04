import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  AlertTriangle,
  Briefcase,
  Code,
  GraduationCap,
  Languages as LanguagesIcon,
  ListChecks,
  Sparkles,
  Trophy,
  UserCircle2,
  Award,
} from "lucide-react";
import type { User } from "../../types/portfolio";
import type { CvParseExtracted, CvParseResponse } from "../../lib/api";

/**
 * CV → profile diff/review dialog (Phase 1.2).
 *
 * Lifecycle
 * ---------
 *  1. Parent calls `api.me.parseCv()`, receives a `CvParseResponse`.
 *  2. Parent opens this dialog, passing `extracted` + `current` (the
 *     user's existing form data, NOT the saved server data — we want
 *     to merge against whatever they're already typing).
 *  3. Each section appears as a row with current vs extracted. The
 *     user toggles which sections to apply.
 *  4. On confirm, `onApply` is called with a `Partial<User>` carrying
 *     only the accepted sections. The parent merges it into its own
 *     state (typically `setFormData(prev => ({...prev, ...partial}))`).
 *
 * Why section-level granularity (not field-level)?
 *  - Per-field accept on an experience array means choosing between
 *    "the 2 entries I have" and "the 3 entries the CV says I have" on
 *    a row-by-row basis, then re-ordering. Too complex for v1.
 *  - Section-level is what users actually want: "skip Skills because
 *    mine are better; replace Experience because the CV has the full
 *    list".
 *  - The user can always hand-edit individual entries after apply via
 *    the existing tabs — the diff dialog is for bulk import only.
 *
 * Replacement semantics
 * ---------------------
 *  Arrays REPLACE in full. We don't merge experience-by-experience
 *  because:
 *    - It opens a duplicate-row problem (same job listed differently).
 *    - The CV is usually the canonical source for any section it
 *      covers; replace-on-accept matches user intent better.
 *  Scalars only replace when the extracted value is non-empty.
 *
 * Display caveats shown to the user
 * ---------------------------------
 *  - "Input truncated" warning if the CV was longer than the LLM's
 *    input window (so they know why a trailing section might be
 *    missing).
 *  - A model + token-usage line so technical users can see what they're
 *    spending.
 */

interface CvReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Parsed payload — `extracted` + `meta` from POST /v1/me/cv/parse. */
  result: CvParseResponse | null;
  /** Current form state for diff display — typically `formData` from the parent. */
  current: User;
  /** User confirms; receives only the sections they accepted. */
  onApply: (partial: Partial<User>) => void;
}

type SectionId =
  | "basics"
  | "socialLinks"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "achievements"
  | "languages";

interface SectionDef {
  id: SectionId;
  label: string;
  // We declare icon as React.ElementType so any lucide-react icon component
  // (FunctionComponent or ForwardRef) is assignable without complaints.
  icon: React.ElementType;
  /**
   * Does the *extracted* payload actually contain meaningful data for
   * this section? Used to gray out sections the LLM didn't extract.
   */
  hasExtracted: (e: CvParseExtracted) => boolean;
  /** Short summary string for display in the row. */
  describeCurrent: (u: User) => string;
  describeExtracted: (e: CvParseExtracted) => string;
}

/**
 * Section metadata table. Co-locating this keeps the dialog body's JSX
 * loop short and means adding a new section to the parse payload is a
 * single-row change here.
 */
const SECTIONS: readonly SectionDef[] = [
  {
    id: "basics",
    label: "Basic info",
    icon: UserCircle2,
    hasExtracted: (e) =>
      Boolean(
        e.name || e.title || e.email || e.phone || e.location || e.about,
      ),
    describeCurrent: (u) =>
      [u.name, u.title].filter(Boolean).join(" · ") ||
      "No name or title yet",
    describeExtracted: (e) =>
      [e.name, e.title].filter(Boolean).join(" · ") ||
      "No name or title extracted",
  },
  {
    id: "socialLinks",
    label: "Social links",
    icon: Sparkles,
    hasExtracted: (e) => Object.values(e.socialLinks ?? {}).some(Boolean),
    describeCurrent: (u) => {
      const n = Object.values(u.socialLinks ?? {}).filter(Boolean).length;
      return n === 0 ? "None" : `${n} link${n === 1 ? "" : "s"}`;
    },
    describeExtracted: (e) => {
      const n = Object.values(e.socialLinks ?? {}).filter(Boolean).length;
      return n === 0 ? "None extracted" : `${n} link${n === 1 ? "" : "s"} from CV`;
    },
  },
  {
    id: "skills",
    label: "Skills",
    icon: Code,
    hasExtracted: (e) => (e.skills?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.skills, "skill"),
    describeExtracted: (e) => describeCount(e.skills, "skill"),
  },
  {
    id: "experience",
    label: "Work experience",
    icon: Briefcase,
    hasExtracted: (e) => (e.experience?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.experience, "role"),
    describeExtracted: (e) => describeCount(e.experience, "role"),
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    hasExtracted: (e) => (e.education?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.education, "entry"),
    describeExtracted: (e) => describeCount(e.education, "entry"),
  },
  {
    id: "projects",
    label: "Projects",
    icon: ListChecks,
    hasExtracted: (e) => (e.projects?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.projects, "project"),
    describeExtracted: (e) => describeCount(e.projects, "project"),
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: Award,
    hasExtracted: (e) => (e.certifications?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.certifications, "cert"),
    describeExtracted: (e) => describeCount(e.certifications, "cert"),
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    hasExtracted: (e) => (e.achievements?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.achievements, "achievement"),
    describeExtracted: (e) => describeCount(e.achievements, "achievement"),
  },
  {
    id: "languages",
    label: "Languages",
    icon: LanguagesIcon,
    hasExtracted: (e) => (e.languages?.length ?? 0) > 0,
    describeCurrent: (u) => describeCount(u.languages, "language"),
    describeExtracted: (e) => describeCount(e.languages, "language"),
  },
];

function describeCount<T>(arr: T[] | undefined | null, singular: string): string {
  const n = arr?.length ?? 0;
  if (n === 0) return `No ${singular}s yet`;
  return `${n} ${singular}${n === 1 ? "" : "s"}`;
}

export function CvReviewDialog({
  open,
  onOpenChange,
  result,
  current,
  onApply,
}: CvReviewDialogProps) {
  // Selection state. Default: every section that has extracted content
  // is checked. Sections with no extracted content are unchecked AND
  // disabled.
  const defaultSelection = useMemo<Record<SectionId, boolean>>(() => {
    // Initialize all to false so TS knows every section id is covered
    // (otherwise the indexed access below would be `boolean | undefined`).
    const base: Record<SectionId, boolean> = {
      basics: false,
      socialLinks: false,
      skills: false,
      experience: false,
      education: false,
      projects: false,
      certifications: false,
      achievements: false,
      languages: false,
    };
    if (!result?.extracted) return base;
    for (const s of SECTIONS) {
      base[s.id] = s.hasExtracted(result.extracted);
    }
    return base;
  }, [result]);

  const [selection, setSelection] = useState<Record<SectionId, boolean>>(
    defaultSelection,
  );

  // Reset selection whenever a fresh parse arrives. Without this the
  // dialog would carry the last user's selections across opens, which
  // is surprising UX.
  useEffect(() => {
    setSelection(defaultSelection);
  }, [defaultSelection]);

  const anySelected = useMemo(
    () => Object.values(selection).some(Boolean),
    [selection],
  );

  // Quick-apply helpers. "All" picks every section that has content;
  // "None" clears everything. The buttons live in the dialog header
  // so they're discoverable but out of the main interaction path.
  const handleSelectAll = () => {
    if (!result) return;
    const next: Record<SectionId, boolean> = { ...selection };
    for (const s of SECTIONS) next[s.id] = s.hasExtracted(result.extracted);
    setSelection(next);
  };
  const handleSelectNone = () => {
    const next: Record<SectionId, boolean> = { ...selection };
    for (const s of SECTIONS) next[s.id] = false;
    setSelection(next);
  };

  const handleApply = () => {
    if (!result) return;
    const partial = buildPartial(result.extracted, selection);
    onApply(partial);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Review extracted info
          </DialogTitle>
          <DialogDescription>
            Pick which sections from your CV should be applied to your
            profile. Nothing is saved until you click <strong>Save
            Changes</strong> on the profile page.
          </DialogDescription>

          {result?.meta.inputTruncated && (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Your CV was long — we trimmed it to fit the AI input limit.
                Some trailing sections may not appear below.
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              Model:{" "}
              <span className="font-mono">{result?.meta.modelUsed ?? "—"}</span>
              {result && (
                <>
                  {" "}· {result.meta.usage.inputTokens.toLocaleString()} in /{" "}
                  {result.meta.usage.outputTokens.toLocaleString()} out
                </>
              )}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-purple-700 hover:underline"
              >
                Select all
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={handleSelectNone}
                className="text-xs text-gray-600 hover:underline"
              >
                Select none
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Inline scroll container — we don't have the shadcn ScrollArea
            primitive in this codebase yet, but a plain `overflow-y-auto`
            div gives us the same UX with no dependency. */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-6 space-y-3">
            {result &&
              SECTIONS.map((section) => {
                const enabled = section.hasExtracted(result.extracted);
                const checked = selection[section.id];
                const Icon = section.icon;
                return (
                  <label
                    key={section.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      enabled
                        ? "border-gray-200 hover:bg-purple-50/40 cursor-pointer"
                        : "border-gray-100 bg-gray-50/60 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) =>
                        setSelection((prev) => ({
                          ...prev,
                          [section.id]: v === true,
                        }))
                      }
                      disabled={!enabled}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-700" />
                        <span className="font-medium text-gray-900">
                          {section.label}
                        </span>
                        {!enabled && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            nothing extracted
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">
                          <span className="text-xs uppercase tracking-wide text-gray-400">
                            Current
                          </span>
                          <div className="truncate">
                            {section.describeCurrent(current)}
                          </div>
                        </div>
                        <div className="text-gray-700">
                          <span className="text-xs uppercase tracking-wide text-gray-400">
                            From CV
                          </span>
                          <div className="truncate">
                            {section.describeExtracted(result.extracted)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
          </div>
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4 bg-gray-50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!anySelected}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Apply selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Partial-User builder
// ---------------------------------------------------------------------------
//
// Maps the user's per-section accept toggles to a `Partial<User>` shape
// the parent can merge into form state with a single setFormData spread.
//
// Why this is a separate pure function (not inlined in handleApply):
//   - Testable in isolation.
//   - The "what counts as 'has content'" logic is centralized — adding
//     a guard like "skip empty extracted arrays" stays in one place.

function buildPartial(
  extracted: CvParseExtracted,
  selection: Record<SectionId, boolean>,
): Partial<User> {
  const out: Partial<User> = {};

  if (selection.basics) {
    // Scalars only overwrite when extracted has a non-empty value. We
    // intentionally do NOT clear fields the user already filled in —
    // "apply CV" should be additive in spirit.
    if (extracted.name) out.name = extracted.name;
    if (extracted.title) out.title = extracted.title;
    if (extracted.email) out.email = extracted.email;
    if (extracted.phone) out.phone = extracted.phone;
    if (extracted.location) out.location = extracted.location;
    if (extracted.about) out.about = extracted.about;
  }

  if (selection.socialLinks && extracted.socialLinks) {
    // Merge — keep any links the user already had, override with CV ones.
    out.socialLinks = {
      ...(extracted.socialLinks as Record<string, string | undefined>),
    };
  }

  if (selection.skills && extracted.skills) {
    out.skills = extracted.skills;
  }

  if (selection.experience && extracted.experience) {
    // Coerce optional fields to the shape `User.Experience` expects
    // (description default '', isPresent default false).
    out.experience = extracted.experience.map((e) => ({
      position: e.position,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      isPresent: e.isPresent ?? false,
      description: e.description ?? "",
      location: e.location,
      skills: e.skills,
    }));
  }

  if (selection.education && extracted.education) {
    out.education = extracted.education.map((e) => ({
      degree: e.degree,
      institution: e.institution,
      startDate: e.startDate,
      endDate: e.endDate,
      isPresent: e.isPresent,
      gpa: e.gpa,
      description: e.description,
      achievements: e.achievements,
    }));
  }

  if (selection.projects && extracted.projects) {
    out.projects = extracted.projects.map((p) => ({
      name: p.name,
      description: p.description,
      tags: p.tags ?? [],
      link: p.link,
      githubLink: p.githubLink,
      status: p.status,
      startDate: p.startDate,
      endDate: p.endDate,
      role: p.role,
      technologies: p.technologies,
      achievements: p.achievements,
    }));
  }

  if (selection.certifications && extracted.certifications) {
    out.certifications = extracted.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      startDate: c.startDate,
      endDate: c.endDate,
      isPresent: c.isPresent,
      credentialId: c.credentialId,
      link: c.link,
      expiryDate: c.expiryDate,
    }));
  }

  if (selection.achievements && extracted.achievements) {
    out.achievements = extracted.achievements.map((a) => ({
      title: a.title,
      description: a.description ?? "",
      startDate: a.startDate,
      organization: a.organization,
      link: a.link,
    }));
  }

  if (selection.languages && extracted.languages) {
    out.languages = extracted.languages.map((l) => ({
      name: l.name,
      level: l.level,
      certification: l.certification,
    }));
  }

  return out;
}
