export interface User {
  id: string;
  // Username is kept for display purposes (e.g. "@akarshan" greeting) but is
  // no longer part of the public URL. Public portfolios are addressed by
  // `shortCode` instead — see Phase 1.2.
  username?: string;
  /**
   * Phase 1.2: Base62 short code that addresses the user's public portfolio
   * at `/p/<shortCode>`. Optional in the type so legacy code paths that
   * build a User without the full backend payload still compile, but every
   * User loaded from GET /v1/me will carry this.
   */
  shortCode?: string;
  /**
   * Phase 1.2: which template renders the public page (e.g. 'classic',
   * 'modern-tech'). Optional for the same reason as `shortCode` above.
   */
  activeTemplate?: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  avatar?: string;
  coverImage?: string; // New: Cover image for profile header
  /**
   * Free-text current compensation (e.g. "INR 15L (Annually)").
   * Surfaced on the profile sidebar; format-agnostic so users can write
   * whatever they want ("$120k base + 20% bonus", "Negotiable", …).
   */
  salary?: string;
  /**
   * Free-text notice period (e.g. "30 days", "Immediate", "2 months").
   * Also format-agnostic.
   */
  noticePeriod?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[]; // Added projects to User type
  certifications?: Certification[];
  achievements?: Achievement[];
  languages?: Language[];
  cv?: CVData; // New: CV information
  socialLinks?: SocialLinks; // New: Social media links
  createdAt?: string;
  updatedAt?: string;
}

export interface CVData {
  fileName?: string;
  fileUrl?: string;
  uploadDate?: string;
  fileSize?: number;
  fileType?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  dribbble?: string;
  behance?: string;
}

/**
 * Constrained employment types. Wire shape uses spaces / PascalCase so
 * the value renders directly in the UI; the backend maps to a snake_case
 * Postgres enum on write. Keep in sync with `EMPLOYMENT_TYPE_VALUES` in
 * the backend's `schemas/profile.ts`.
 */
export type EmploymentType =
  | 'Full time'
  | 'Part time'
  | 'Contract'
  | 'Internship'
  | 'Freelance'
  | 'Temporary';

export const EMPLOYMENT_TYPE_VALUES: readonly EmploymentType[] = [
  'Full time',
  'Part time',
  'Contract',
  'Internship',
  'Freelance',
  'Temporary',
] as const;

export interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isPresent: boolean;
  description: string;
  location?: string;
  skills?: string[];
  /** Free-text industry/sector ("Banking", "Healthcare"). */
  industry?: string;
  /** Employment type — constrained to `EmploymentType`. */
  employmentType?: EmploymentType;
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  isPresent?: boolean;
  year?: string; // Keep for backward compatibility
  gpa?: string;
  description?: string;
  achievements?: string[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  githubLink?: string;
  status: "Completed" | "In Progress" | "Planned";
  startDate?: string;
  endDate?: string;
  role?: string;
  technologies?: string[];
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  startDate: string;
  endDate?: string;
  date?: string; // Keep for backward compatibility
  credentialId?: string;
  link?: string;
  expiryDate?: string;
  isPresent?: boolean; // For ongoing certifications
}

export interface Achievement {
  title: string;
  description: string;
  startDate: string;
  organization?: string;
  link?: string; // For ongoing achievements
}

export interface Language {
  name: string;
  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Fluent"
    | "Native"
    | "Expert";
  certification?: string;
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    about: string;
    avatar?: string;
    coverImage?: string;
    socialLinks?: SocialLinks;
  };
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
}

export interface PortfolioProps {
  data?: PortfolioData;
  viewMode?: "desktop" | "mobile" | "tablet";
  isFullscreen?: boolean;
}

// Note: the runtime portfolioDataManager lives in src/utils/portfolioDataManager.ts.
// Its public surface used to be described here, but Phase 0 moved persistence
// off of localStorage onto the backend API, which changed several methods to
// be async. We no longer maintain a hand-written interface — the singleton's
// TypeScript types are inferred from its class.
