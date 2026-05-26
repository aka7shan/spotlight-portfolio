import type { User, PortfolioData } from '../types/portfolio';
import {
  classicData,
  modernTechData,
  creativeData,
  minimalistData,
  corporateData,
} from '../constants/portfolioData';
import { api } from '../lib/api';

/**
 * Portfolio data manager.
 *
 * Phase 0 split:
 *   - Authenticated state (user profile) lives in Postgres via the backend.
 *     `saveUserData` and `loadUserData` now call the API. We keep them
 *     synchronous-looking wrappers around fire-and-forget calls so existing
 *     components don't have to change immediately — but new code should
 *     prefer `useProfile()` which handles loading / error states properly.
 *   - Template dummy data and "is profile complete?" remain pure functions.
 */

const TEMPLATE_DATA: Readonly<Record<string, PortfolioData>> = Object.freeze({
  'modern-tech': modernTechData,
  creative: creativeData,
  minimalist: minimalistData,
  corporate: corporateData,
  classic: classicData,
});

const EMPTY_PORTFOLIO: PortfolioData = {
  personalInfo: { name: '', title: '', email: '', about: '' },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
};

class PortfolioDataManagerImpl {
  /** Pure transform: User -> PortfolioData (no I/O). */
  generateFromUser(user: User): PortfolioData {
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
    };
  }

  /**
   * Save the user's profile to the backend.
   * Returns the canonical server response so callers can replace local state.
   */
  async saveUserData(user: User): Promise<User> {
    const { user: saved } = await api.me.update(user);
    return saved;
  }

  /**
   * Load the user's profile from the backend.
   * Returns null if the user is not signed in or the profile doesn't exist.
   */
  async loadUserData(): Promise<User | null> {
    try {
      const { user } = await api.me.get();
      return user;
    } catch {
      return null;
    }
  }

  getDummyData(templateId: string): PortfolioData {
    return TEMPLATE_DATA[templateId.toLowerCase()] ?? classicData;
  }

  exportAsJSON(data: PortfolioData): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data as JSON:', error);
      return '{}';
    }
  }

  importFromJSON(json: string): PortfolioData {
    try {
      const data = JSON.parse(json) as PortfolioData;
      if (!data?.personalInfo?.name) {
        throw new Error('Invalid portfolio data structure');
      }
      return data;
    } catch (error) {
      console.error('Failed to import data from JSON:', error);
      return { ...EMPTY_PORTFOLIO };
    }
  }

  isProfileComplete(user: User): boolean {
    return !!(
      user.name &&
      user.title &&
      user.about &&
      user.skills?.length &&
      user.experience?.length
    );
  }
}

export const portfolioDataManager = new PortfolioDataManagerImpl();
