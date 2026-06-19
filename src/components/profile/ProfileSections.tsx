import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { PhoneInputComponent } from "../ui/phone-input";
import type { User, Project, SocialLinks } from "../../types/portfolio";
import { ProjectDialog } from "./ProjectDialog";
import {
  Plus,
  Trash2,
  User as UserIcon,
  Code,
  FileText,
  Edit,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Globe,
} from "lucide-react";

/**
 * Profile-page "section" components.
 *
 * The previous architecture bundled four heterogeneous concerns
 * (personal details, CV, skills, projects) into a single `ProfileTab`
 * because Radix Tabs forced everything into one tab content block. The
 * new scrollspy layout treats each concern as its own anchor target,
 * so we split the cards into small, single-purpose components here.
 *
 * Everything follows the same contract: `formData` + `handleInputChange`
 * from `ProfilePage`, identical to the old tabs. Validation lives on
 * the parent — these sections are presentational shells around inputs.
 */

// ---------------------------------------------------------------------------
// Reusable section header
// ---------------------------------------------------------------------------
//
// One look across all section blocks: an icon + title + (optional)
// subtitle on the left, optional actions on the right. Keeps the
// visual rhythm consistent and prevents per-section drift.

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ icon, title, subtitle, actions }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-purple-600">{icon}</span>
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Profile summary — `about`
// ---------------------------------------------------------------------------
//
// The Resume (CVManager) used to live here; it now sits in the right
// action rail so the summary section is just the hero blurb.

interface SummarySectionProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function SummarySection({
  formData,
  handleInputChange,
}: SummarySectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<UserIcon className="w-5 h-5" />}
        title="Profile summary"
        subtitle="1–3 sentences about you. Drives the hero text of the public portfolio."
      />
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
        <Label htmlFor="about" className="text-sm font-medium text-gray-700">
          About me
        </Label>
        <Textarea
          id="about"
          value={formData.about || ""}
          onChange={(e) => handleInputChange("about", e.target.value)}
          placeholder="Write a brief description about yourself, your background, and what you're passionate about…"
          rows={4}
          className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Personal details — name, title, email, phone, location, salary, notice
// ---------------------------------------------------------------------------

interface PersonalDetailsSectionProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function PersonalDetailsSection({
  formData,
  handleInputChange,
}: PersonalDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<UserIcon className="w-5 h-5" />}
        title="Personal details"
        subtitle="The core contact info on your public portfolio."
      />
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name *
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Professional title *
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            {/*
              Email is server-managed (Supabase auth owns it). Render
              read-only so the user can see what we have but can't drift
              it out of sync with their auth identity.
            */}
            <Input
              id="email"
              value={formData.email || ""}
              readOnly
              disabled
              className="mt-1 bg-gray-50 border-gray-200 text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <PhoneInputComponent
              value={formData.phone || ""}
              onChange={(value) => handleInputChange("phone", value)}
              placeholder="Enter phone number"
              className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </Label>
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, Country"
            className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
              Current salary
            </Label>
            <Input
              id="salary"
              value={formData.salary || ""}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              placeholder="e.g. INR 15L (Annually)"
              className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="notice-period" className="text-sm font-medium text-gray-700">
              Notice period
            </Label>
            <Input
              id="notice-period"
              value={formData.noticePeriod || ""}
              onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
              placeholder="e.g. 30 days"
              className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Skills
// ---------------------------------------------------------------------------

interface SkillsSectionProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function SkillsSection({ formData, handleInputChange }: SkillsSectionProps) {
  const [draft, setDraft] = useState("");

  const addSkill = useCallback(
    (skill: string) => {
      const trimmed = skill.trim();
      if (!trimmed) return;
      if (formData.skills?.includes(trimmed)) return;
      handleInputChange("skills", [...(formData.skills || []), trimmed]);
      setDraft("");
    },
    [formData.skills, handleInputChange],
  );

  const removeSkill = useCallback(
    (skillToRemove: string) => {
      const next = formData.skills?.filter((s) => s !== skillToRemove) || [];
      handleInputChange("skills", next);
    },
    [formData.skills, handleInputChange],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Code className="w-5 h-5" />}
        title="Skills"
        subtitle="Technologies, tools, and methodologies. One per pill."
      />
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
        <div>
          <Label htmlFor="new-skill" className="text-sm font-medium text-gray-700">
            Add a skill
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="new-skill"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(draft);
                }
              }}
              placeholder="Type a skill and press Enter"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              onClick={() => addSkill(draft)}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Add
            </Button>
          </div>
        </div>

        {formData.skills && formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Projects
// ---------------------------------------------------------------------------

interface ProjectsSectionProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function ProjectsSection({ formData, handleInputChange }: ProjectsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ index: number; project: Project } | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (index: number, project: Project) => {
    setEditing({ index, project });
    setDialogOpen(true);
  };

  const handleSave = (project: Project) => {
    const list = [...(formData.projects || [])];
    if (editing) {
      list[editing.index] = project;
    } else {
      list.push(project);
    }
    handleInputChange("projects", list);
  };

  const remove = (index: number) => {
    const next = formData.projects?.filter((_, i) => i !== index) || [];
    handleInputChange("projects", next);
  };

  const projects = formData.projects ?? [];

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<FileText className="w-5 h-5" />}
        title="Projects"
        subtitle="Side projects, open-source work, and notable builds."
        actions={
          <Button onClick={openAdd} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        }
      />

      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {project.name || `Project ${index + 1}`}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {project.status}
                    </Badge>
                    {project.role && (
                      <Badge variant="outline" className="border-gray-300 text-gray-600">
                        {project.role}
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tags.slice(0, 6).map((tag, ti) => (
                        <Badge
                          key={ti}
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 6 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{project.tags.length - 6}
                        </Badge>
                      )}
                    </div>
                  )}
                  {(project.link || project.githubLink) && (
                    <div className="mt-3 flex gap-2">
                      {project.link && (
                        <Button variant="outline" size="sm" className="text-xs" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.githubLink && (
                        <Button variant="outline" size="sm" className="text-xs" asChild>
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                            <Code className="w-3 h-3 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    onClick={() => openEdit(index, project)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                    aria-label="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    aria-label="Remove project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 rounded-xl border border-dashed border-gray-200 bg-white/50">
          <FileText className="w-10 h-10 mx-auto opacity-30 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No projects yet — showcase your work.</p>
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        mode={editing ? "edit" : "add"}
        project={editing?.project}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Social links
// ---------------------------------------------------------------------------
//
// First-class section now that the schema supports it. We render a row
// per supported provider with the right icon and `https://` placeholder
// — users can paste a profile URL directly. Validation is intentionally
// lenient (matches the backend's `flexibleLink` schema) so users who
// type `github.com/foo` don't get a rejected save.

const SOCIAL_PROVIDERS: ReadonlyArray<{
  key: keyof SocialLinks;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}> = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/your-handle" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/your-handle" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/your-handle" },
  { key: "website", label: "Website", icon: Globe, placeholder: "https://your-site.com" },
];

interface SocialLinksSectionProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function SocialLinksSection({
  formData,
  handleInputChange,
}: SocialLinksSectionProps) {
  const links = formData.socialLinks ?? {};

  const updateLink = (key: keyof SocialLinks, value: string) => {
    handleInputChange("socialLinks", { ...links, [key]: value });
  };

  // Compact sidebar card: a provider icon doubles as the field label
  // (with an accessible aria-label), so each link is a single tight row
  // rather than the icon + label + input stack the full section used.
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-gray-900 mb-3">
          <Globe className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold">Social links</h3>
        </div>
        <div className="space-y-2.5">
          {SOCIAL_PROVIDERS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.key} className="flex items-center gap-2">
                <span
                  title={p.label}
                  className="shrink-0 h-9 w-9 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </span>
                <Input
                  aria-label={p.label}
                  value={(links[p.key] as string | undefined) || ""}
                  onChange={(e) => updateLink(p.key, e.target.value)}
                  placeholder={p.placeholder}
                  className="h-9 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
