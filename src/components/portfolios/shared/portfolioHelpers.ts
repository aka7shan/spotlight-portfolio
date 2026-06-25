import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Dribbble,
  Palette,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioData, SocialLinks } from "../../../types/portfolio";

/**
 * Pure, presentation-agnostic helpers shared by every portfolio template.
 *
 * The single most important rule here: NEVER fabricate data. Templates used
 * to invent stats ("98% client satisfaction", "1247 commits", random progress
 * bars) and fall back to fake numbers (`projects.length || 24`). Everything in
 * this module is derived strictly from the user's real `PortfolioData`, and
 * returns empty collections when there's nothing to show so templates can
 * render an honest empty state instead of a lie.
 */

export interface PortfolioStat {
  value: number;
  label: string;
  suffix?: string;
}

/** Years of experience derived from the earliest experience start date. */
export function yearsOfExperience(experience: PortfolioData["experience"]): number {
  if (!experience?.length) return 0;
  const startYears = experience
    .map((e) => (e.startDate ? new Date(e.startDate).getFullYear() : NaN))
    .filter((y) => Number.isFinite(y));
  if (!startYears.length) return 0;
  const earliest = Math.min(...startYears);
  const now = new Date().getFullYear();
  return Math.max(0, now - earliest);
}

/**
 * Real headline stats only. A stat is omitted entirely when its underlying
 * data is empty, so a brand-new profile doesn't show "0 Projects" or invented
 * numbers. Templates decide how many to render (typically the first 3-4).
 */
export function computeStats(data: PortfolioData): PortfolioStat[] {
  const stats: PortfolioStat[] = [];
  const years = yearsOfExperience(data.experience);
  if (years > 0) stats.push({ value: years, label: "Years Experience", suffix: "+" });
  if (data.projects?.length) stats.push({ value: data.projects.length, label: "Projects", suffix: "+" });
  if (data.skills?.length) stats.push({ value: data.skills.length, label: "Skills" });
  if (data.certifications?.length) stats.push({ value: data.certifications.length, label: "Certifications" });
  if (data.experience?.length) stats.push({ value: data.experience.length, label: "Roles" });
  return stats;
}

export interface ContactLinkItem {
  key: string;
  label: string;
  value: string;
  href?: string;
  Icon: LucideIcon;
}

/** Contact rows for the fields that are actually present. */
export function getContactItems(info: PortfolioData["personalInfo"]): ContactLinkItem[] {
  const items: ContactLinkItem[] = [];
  if (info.email) {
    items.push({ key: "email", label: "Email", value: info.email, href: `mailto:${info.email}`, Icon: Mail });
  }
  if (info.phone) {
    items.push({ key: "phone", label: "Phone", value: info.phone, href: `tel:${info.phone}`, Icon: Phone });
  }
  if (info.location) {
    items.push({ key: "location", label: "Location", value: info.location, Icon: MapPin });
  }
  return items;
}

export interface SocialLinkItem {
  key: string;
  label: string;
  href: string;
  Icon: LucideIcon;
}

const SOCIAL_DEFS: { key: keyof SocialLinks; label: string; Icon: LucideIcon }[] = [
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "twitter", label: "Twitter", Icon: Twitter },
  { key: "dribbble", label: "Dribbble", Icon: Dribbble },
  { key: "behance", label: "Behance", Icon: Palette },
  { key: "website", label: "Website", Icon: Globe },
];

/** Social links that have a non-empty URL, in a stable, sensible order. */
export function getSocialLinks(links?: SocialLinks): SocialLinkItem[] {
  if (!links) return [];
  return SOCIAL_DEFS.flatMap((def) => {
    const href = links[def.key];
    if (typeof href !== "string" || href.trim() === "") return [];
    return [{ key: def.key, label: def.label, href: href.trim(), Icon: def.Icon }];
  });
}

/** Public URL to the user's CV, or undefined when none is uploaded. */
export function getResumeHref(data: PortfolioData): string | undefined {
  const url = data.cv?.fileUrl;
  return url && url.trim() ? url.trim() : undefined;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

const SKILL_BUCKETS: { name: string; match: string[] }[] = [
  { name: "Frontend", match: ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Next", "UI", "Responsive", "Material"] },
  { name: "Backend", match: ["Node", "Python", "Java", "PHP", "Ruby", "Go", "API", "Server", "Express", "GraphQL", "REST", "Microservices"] },
  { name: "Data & Cloud", match: ["SQL", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Database", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "DevOps", "CI/CD", "Cloud", "Data", "Machine Learning", "ML", "Analytics"] },
  { name: "Design", match: ["Design", "Figma", "Sketch", "Adobe", "Photoshop", "Illustrator", "InDesign", "Brand", "Typography", "Visual", "Motion", "Art", "Illustration", "UX", "Creative", "Color"] },
  { name: "Leadership", match: ["Leadership", "Management", "Strategy", "Planning", "Team", "Agile", "Scrum", "Stakeholder", "Business", "Operations", "Vision", "Mentor"] },
  { name: "Communication", match: ["Writing", "Editing", "Content", "Communication", "Public Speaking", "Storytelling", "SEO", "Marketing", "Research"] },
];

/**
 * Group skills into non-empty buckets, with a trailing "Other" bucket for
 * anything uncategorized. Returns [] when there are no skills. Each skill lands
 * in exactly one bucket (first match wins) so totals always add up.
 */
export function categorizeSkills(skills: string[]): SkillGroup[] {
  if (!skills?.length) return [];
  const used = new Set<number>();
  const groups: SkillGroup[] = [];

  for (const bucket of SKILL_BUCKETS) {
    const matched = skills.filter((skill, i) => {
      if (used.has(i)) return false;
      const hit = bucket.match.some((m) => skill.toLowerCase().includes(m.toLowerCase()));
      if (hit) used.add(i);
      return hit;
    });
    if (matched.length) groups.push({ name: bucket.name, skills: matched });
  }

  const other = skills.filter((_, i) => !used.has(i));
  if (other.length) groups.push({ name: "Other", skills: other });

  return groups;
}
