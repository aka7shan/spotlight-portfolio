import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { FormField, Validator } from "../ui/form-validation";
import type { User, Experience } from "../../types/portfolio";
import { ExperienceDialog } from "./ExperienceDialog";
import { WorkExperienceTimeline } from "./WorkExperienceTimeline";
import {
  formatExperienceDuration,
  formatExperienceRange,
} from "../../utils/experienceMath";
import {
  Plus,
  Trash2,
  Briefcase,
  Edit,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ExperienceTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

/**
 * Work-experience section, redesigned for the scrollspy profile page:
 *
 *   1. A `WorkExperienceTimeline` (hand-rolled SVG) sits at the top —
 *      a single career-arc visualisation across all roles.
 *   2. Below it, each experience renders as a detailed card with the
 *      newly-introduced fields (employment type, industry) plus the
 *      profile-level salary / notice period for context. A "Read more"
 *      affordance reveals long descriptions without ballooning the
 *      page on first paint.
 *
 * Note: this is no longer a Radix `TabsContent` child — `ProfilePage`
 * mounts it inside a stacked `<section>` block. We removed the
 * outer purple-headered `Card` so the section heading owns the
 * vertical rhythm.
 */
export function ExperienceTab({ formData, handleInputChange }: ExperienceTabProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<{
    index: number;
    experience: Experience;
  } | null>(null);

  const validateData = useCallback(() => {
    const validation = Validator.validateExperienceData(formData.experience || []);
    setValidationErrors(validation.errors);
  }, [formData.experience]);

  const openAddExperienceDialog = useCallback(() => {
    setEditingExperience(null);
    setExperienceDialogOpen(true);
  }, []);

  const openEditExperienceDialog = useCallback((index: number, experience: Experience) => {
    setEditingExperience({ index, experience });
    setExperienceDialogOpen(true);
  }, []);

  const closeExperienceDialog = useCallback(() => {
    setExperienceDialogOpen(false);
    setEditingExperience(null);
  }, []);

  const handleExperienceSave = useCallback(
    (experience: Experience) => {
      if (editingExperience) {
        const experiences = [...(formData.experience || [])];
        experiences[editingExperience.index] = experience;
        handleInputChange("experience", experiences);
      } else {
        handleInputChange("experience", [...(formData.experience || []), experience]);
      }
      setTimeout(validateData, 0);
    },
    [editingExperience, formData.experience, handleInputChange, validateData],
  );

  const removeExperience = useCallback(
    (index: number) => {
      const experiences = formData.experience?.filter((_, i) => i !== index) || [];
      handleInputChange("experience", experiences);
      setTimeout(validateData, 0);
    },
    [formData.experience, handleInputChange, validateData],
  );

  const experiences = formData.experience ?? [];
  const hasExperiences = experiences.length > 0;

  return (
    <div className="space-y-6">
      {/* Section header is intentionally separate from the cards so it
          can act as the scrollspy anchor's visual title — no more
          colored CardHeader. */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Work experience
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Career timeline and per-role details. Required for the public
            portfolio.
          </p>
        </div>
        <Button
          onClick={openAddExperienceDialog}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <FormField error={validationErrors.experience}>
        {hasExperiences ? (
          <div className="space-y-6">
            <WorkExperienceTimeline experiences={experiences} />
            <div className="space-y-4">
              {experiences.map((experience, index) => (
                <ExperienceDetailCard
                  key={index}
                  experience={experience}
                  // Profile-level salary/notice piggyback onto the
                  // CURRENT job's card only (more honest than slapping
                  // it on every past role).
                  showCurrentJobFooter={Boolean(experience.isPresent)}
                  user={formData}
                  onEdit={() => openEditExperienceDialog(index, experience)}
                  onRemove={() => removeExperience(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState onAdd={openAddExperienceDialog} />
        )}
      </FormField>

      <ExperienceDialog
        open={experienceDialogOpen}
        onClose={closeExperienceDialog}
        onSave={handleExperienceSave}
        mode={editingExperience ? "edit" : "add"}
        experience={editingExperience?.experience}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ExperienceDetailCardProps {
  experience: Experience;
  /**
   * When true, the card renders a footer with profile-level salary +
   * notice period. Surfaced only on the current job so the same numbers
   * don't repeat down the timeline.
   */
  showCurrentJobFooter: boolean;
  user: User;
  onEdit: () => void;
  onRemove: () => void;
}

const DESC_COLLAPSED_CHARS = 220;

function ExperienceDetailCard({
  experience,
  showCurrentJobFooter,
  user,
  onEdit,
  onRemove,
}: ExperienceDetailCardProps) {
  const [expanded, setExpanded] = useState(false);
  // Trim/expand the description to keep the first paint tight without
  // hiding short ones behind a useless toggle.
  const fullDesc = experience.description ?? "";
  const needsClamp = fullDesc.length > DESC_COLLAPSED_CHARS;
  const visibleDesc = expanded || !needsClamp
    ? fullDesc
    : `${fullDesc.slice(0, DESC_COLLAPSED_CHARS).trimEnd()}…`;

  // Pre-compute meta chips so the JSX stays tidy.
  const range = formatExperienceRange(experience);
  const duration = formatExperienceDuration(experience);
  const metaChips = useMemo(() => {
    const items: string[] = [];
    if (range) items.push(range);
    if (duration) items.push(duration);
    if (experience.employmentType) items.push(experience.employmentType);
    if (experience.industry) items.push(`Industry: ${experience.industry}`);
    return items;
  }, [range, duration, experience.employmentType, experience.industry]);

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="shrink-0 h-10 w-10 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">{experience.company}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-gray-900">
                  {experience.position || "Position"}
                </h3>
                {experience.isPresent && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Current
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                {metaChips.map((chip, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    {i > 0 && <span className="text-gray-300">•</span>}
                    <span>{chip}</span>
                  </span>
                ))}
                {experience.location && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <span className="text-gray-300">•</span>
                    <MapPin className="w-3 h-3" />
                    {experience.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-purple-700 hover:bg-purple-50"
              aria-label="Edit experience"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={onRemove}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              aria-label="Remove experience"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {fullDesc && (
          <div className="mt-3">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {visibleDesc}
            </p>
            {needsClamp && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-xs font-medium text-purple-700 hover:text-purple-800 inline-flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    Read less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {experience.skills && experience.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {experience.skills.slice(0, 8).map((skill, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                {skill}
              </Badge>
            ))}
            {experience.skills.length > 8 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                +{experience.skills.length - 8} more
              </Badge>
            )}
          </div>
        )}

        {showCurrentJobFooter && (user.salary || user.noticePeriod) && (
          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
            {user.salary && (
              <div>
                <p className="text-gray-500">Salary</p>
                <p className="text-gray-900 font-medium mt-0.5">{user.salary}</p>
              </div>
            )}
            {user.noticePeriod && (
              <div>
                <p className="text-gray-500">Notice period</p>
                <p className="text-gray-900 font-medium mt-0.5">
                  {user.noticePeriod}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 bg-white/50">
      <Briefcase className="w-12 h-12 mx-auto opacity-30 text-gray-400 mb-3" />
      <h3 className="text-base font-medium text-gray-900">No experience added yet</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Start building your professional history
      </p>
      <Button onClick={onAdd} className="bg-purple-600 hover:bg-purple-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Experience
      </Button>
    </div>
  );
}
