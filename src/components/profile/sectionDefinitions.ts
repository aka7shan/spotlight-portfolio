/**
 * Section metadata for the Profile page.
 *
 * Split out of `SectionNav.tsx` because react-refresh wants component
 * files to export components only — constants alongside a component
 * break fast-refresh.
 *
 * This is the SINGLE SOURCE OF TRUTH for both:
 *   - The pill list rendered by `SectionNav`
 *   - The `<section id="...">` blocks rendered by `ProfilePage`
 *
 * Renaming or reordering a pill is a one-file change; adding a new
 * section just means pushing here, adding a matching `<section>`, and
 * (if relevant) extending the change-detector / completeness fields.
 */
export interface NavSection {
  id: string;
  label: string;
  hasWarning?: boolean;
}

export const PROFILE_SECTIONS: ReadonlyArray<NavSection> = [
  { id: "section-summary", label: "Profile summary" },
  { id: "section-personal", label: "Personal details" },
  { id: "section-experience", label: "Work experience" },
  { id: "section-education", label: "Education" },
  { id: "section-skills", label: "Skills" },
  { id: "section-projects", label: "Projects" },
  { id: "section-certifications", label: "Courses & certifications" },
  { id: "section-achievements", label: "Awards" },
  { id: "section-languages", label: "Language" },
];
