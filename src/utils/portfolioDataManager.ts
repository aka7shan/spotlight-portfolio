import type { User, PortfolioData } from '../types/portfolio';
import {
  classicData,
  modernTechData,
  creativeData,
  minimalistData,
  corporateData,
} from '../constants/portfolioData';
import { isProfileComplete as checkProfileComplete } from '../lib/validators/user';

/**
 * Portfolio data manager — small pure helpers used by App.tsx + components.
 *
 * Used to be a stateless class; now plain functions:
 *   - tree-shakes better
 *   - removes `new` indirection
 *   - no hidden module-level state
 *
 * Persistence lives in `lib/api.ts` and `hooks/useProfile.ts`.
 */

const TEMPLATE_DATA: Readonly<Record<string, PortfolioData>> = Object.freeze({
  'modern-tech': modernTechData,
  creative: creativeData,
  minimalist: minimalistData,
  corporate: corporateData,
  classic: classicData,
});

/** Pure transform: User -> PortfolioData (no I/O). */
export function generateFromUser(user: User): PortfolioData {
  return {
    personalInfo: {
      name: user.name || '',
      title: user.title || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      about: user.about || '',
      avatar: user.avatar || '',
      coverImage: user.coverImage || '',
      socialLinks: user.socialLinks,
    },
    skills: user.skills || [],
    experience: user.experience || [],
    education: user.education || [],
    projects: user.projects || [],
    certifications: user.certifications || [],
    achievements: user.achievements || [],
    languages: user.languages || [],
    cv: user.cv,
    salary: user.salary,
    noticePeriod: user.noticePeriod,
  };
}

export function getDummyData(templateId: string): PortfolioData {
  return TEMPLATE_DATA[templateId.toLowerCase()] ?? classicData;
}

/**
 * Re-export of the shared completeness predicate so existing call sites
 * (`portfolioDataManager.isProfileComplete(user)`) keep working unchanged.
 */
export const isProfileComplete = checkProfileComplete;

/**
 * Back-compat alias: existing code uses `portfolioDataManager.foo(...)`.
 * New code should import the named functions directly.
 */
export const portfolioDataManager = {
  generateFromUser,
  getDummyData,
  isProfileComplete,
};
