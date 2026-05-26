/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROFILE VALIDATION CONTRACT (FRONTEND MIRROR)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  This is the client-side twin of the backend's Zod policy in
 *  `../Spotlight-backend/src/schemas/profile.ts`. The Save button calls
 *  `validateUserForSave(user)` and refuses to PUT if any required field is
 *  empty/missing.
 *
 *  **If you change required-ness on the backend, change it here too.**
 *
 *  We deliberately don't import Zod here — keeping this as plain TS:
 *    - keeps the frontend bundle small
 *    - decouples UI message wording from the API's structural validator
 *    - lets the UI produce field-keyed errors that map straight to inputs
 *
 *  Policy (same as the backend):
 *    Profile-level required        → name, title
 *    Skills                        → each string non-empty
 *    Experience (per entry)        → position, company, startDate
 *    Education (per entry)         → degree, institution, startDate
 *    Project (per entry)           → name
 *    Certification (per entry)     → name, issuer, startDate
 *    Achievement (per entry)       → title, startDate
 *    Language (per entry)          → name, level
 */
import type { User } from "../../types/portfolio";

/** A short, user-friendly error tied to a UI section. */
export interface FieldError {
  /** Which top-level tab to focus when the user clicks the error. */
  tab: "profile" | "experience" | "education" | "projects" | "certifications" | "achievements" | "languages";
  /** Optional index into the section's array, when relevant. */
  index?: number;
  /** Human-readable explanation. */
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: FieldError[];
}

const isBlank = (s: string | null | undefined): boolean =>
  s === null || s === undefined || s.trim().length === 0;

/**
 * Validate a User object against the same required-fields policy as the
 * backend. Returns `ok: true` when the object is ready to save, otherwise
 * a flat list of field errors with enough info for the UI to deep-link.
 */
export function validateUserForSave(user: User): ValidationResult {
  const errors: FieldError[] = [];

  // ─── Profile (top-level required fields) ─────────────────────────────────
  if (isBlank(user.name)) {
    errors.push({ tab: "profile", message: "Name is required." });
  }
  if (isBlank(user.title)) {
    errors.push({ tab: "profile", message: "Title is required (e.g. 'Senior Engineer')." });
  }

  // ─── Skills (when provided) ──────────────────────────────────────────────
  user.skills?.forEach((skill, i) => {
    if (isBlank(skill)) {
      errors.push({ tab: "profile", index: i, message: `Skill #${i + 1} is empty — remove it or add a name.` });
    }
  });

  // ─── Experience entries ──────────────────────────────────────────────────
  user.experience?.forEach((exp, i) => {
    if (isBlank(exp.position)) {
      errors.push({ tab: "experience", index: i, message: `Experience #${i + 1}: Position is required.` });
    }
    if (isBlank(exp.company)) {
      errors.push({ tab: "experience", index: i, message: `Experience #${i + 1}: Company is required.` });
    }
    if (isBlank(exp.startDate)) {
      errors.push({ tab: "experience", index: i, message: `Experience #${i + 1}: Start date is required.` });
    }
    if (!exp.isPresent && isBlank(exp.endDate)) {
      errors.push({
        tab: "experience",
        index: i,
        message: `Experience #${i + 1}: End date is required (or tick "I currently work here").`,
      });
    }
  });

  // ─── Education entries ───────────────────────────────────────────────────
  user.education?.forEach((edu, i) => {
    if (isBlank(edu.degree)) {
      errors.push({ tab: "education", index: i, message: `Education #${i + 1}: Degree is required.` });
    }
    if (isBlank(edu.institution)) {
      errors.push({ tab: "education", index: i, message: `Education #${i + 1}: Institution is required.` });
    }
    if (isBlank(edu.startDate)) {
      errors.push({ tab: "education", index: i, message: `Education #${i + 1}: Start date is required.` });
    }
    if (!edu.isPresent && isBlank(edu.endDate)) {
      errors.push({
        tab: "education",
        index: i,
        message: `Education #${i + 1}: End date is required (or tick "Currently studying").`,
      });
    }
  });

  // ─── Projects ────────────────────────────────────────────────────────────
  user.projects?.forEach((proj, i) => {
    if (isBlank(proj.name)) {
      errors.push({ tab: "projects", index: i, message: `Project #${i + 1}: Name is required.` });
    }
  });

  // ─── Certifications ──────────────────────────────────────────────────────
  user.certifications?.forEach((cert, i) => {
    if (isBlank(cert.name)) {
      errors.push({ tab: "certifications", index: i, message: `Certification #${i + 1}: Name is required.` });
    }
    if (isBlank(cert.issuer)) {
      errors.push({ tab: "certifications", index: i, message: `Certification #${i + 1}: Issuer is required.` });
    }
    if (isBlank(cert.startDate)) {
      errors.push({ tab: "certifications", index: i, message: `Certification #${i + 1}: Issued date is required.` });
    }
  });

  // ─── Achievements ────────────────────────────────────────────────────────
  user.achievements?.forEach((ach, i) => {
    if (isBlank(ach.title)) {
      errors.push({ tab: "achievements", index: i, message: `Achievement #${i + 1}: Title is required.` });
    }
    if (isBlank(ach.startDate)) {
      errors.push({ tab: "achievements", index: i, message: `Achievement #${i + 1}: Date is required.` });
    }
  });

  // ─── Languages ───────────────────────────────────────────────────────────
  user.languages?.forEach((lang, i) => {
    if (isBlank(lang.name)) {
      errors.push({ tab: "languages", index: i, message: `Language #${i + 1}: Name is required.` });
    }
    // `level` is an enum; the UI's Select widget guarantees one of the valid
    // values. But guard against an empty string slipping through.
    if (isBlank(lang.level as unknown as string)) {
      errors.push({ tab: "languages", index: i, message: `Language #${i + 1}: Proficiency level is required.` });
    }
  });

  return { ok: errors.length === 0, errors };
}
