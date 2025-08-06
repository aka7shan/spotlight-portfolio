export interface User {
  id: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  avatar?: string;
  coverImage?: string; // New: Cover image for profile header
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

export interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isPresent: boolean;
  description: string;
  location?: string;
  skills?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
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
  date: string;
  credentialId?: string;
  link?: string;
  expiryDate?: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  organization?: string;
  link?: string;
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

// Portfolio generation utilities
export interface PortfolioDataManager {
  generateFromUser: (user: User) => PortfolioData;
  saveUserData: (user: User) => void;
  loadUserData: (userId: string) => User | null;
  getDummyData: (templateId: string) => PortfolioData;
  exportAsJSON: (data: PortfolioData) => string;
  importFromJSON: (json: string) => PortfolioData;
  isProfileComplete: (user: User) => boolean;
}