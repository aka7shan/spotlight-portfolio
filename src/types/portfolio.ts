export interface User {
    id: string;
    name: string;
    title?: string;
    email: string;
    phone?: string;
    location?: string;
    about?: string;
    avatar?: string;
    skills?: string[];
    experience?: Experience[];
    education?: Education[];
    projects?: Project[]; // Added projects to User type
    certifications?: Certification[];
    achievements?: Achievement[];
    languages?: Language[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Experience {
    position: string;
    company: string;
    duration: string;
    description: string;
    location?: string;
    skills?: string[];
  }
  
  export interface Education {
    degree: string;
    institution: string;
    year?: string;
    gpa?: string;
  }
  
  export interface Project {
    name: string;
    description: string;
    tags: string[];
    image?: string;
    link?: string;
    githubLink?: string;
    // status?: 'Completed' | 'In Progress' | 'Planned';
    status?: string;
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
    // level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native' | 'Expert';
    level: string;
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
    viewMode?: 'desktop' | 'mobile' | 'tablet';
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
  }