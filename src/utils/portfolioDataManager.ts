import type { User, PortfolioData, PortfolioDataManager } from '../types/portfolio';
import { 
  classicData, 
  modernTechData, 
  creativeData, 
  minimalistData, 
  corporateData 
} from '../constants/portfolioData';

class PortfolioDataManagerImpl implements PortfolioDataManager {
  private readonly STORAGE_KEY = 'portfolio_user_data';
  private readonly EXPORT_KEY = 'portfolio_exported_data';

  // Generate portfolio data from user profile
  generateFromUser(user: User): PortfolioData {
    return {
      personalInfo: {
        name: user.name || '',
        title: user.title || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        about: user.about || '',
        avatar: user.avatar || ''
      },
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      projects: user.projects || [], // Now properly using user projects
      certifications: user.certifications || [],
      achievements: user.achievements || [],
      languages: user.languages || []
    };
  }

  // Save user data to localStorage as JSON
  saveUserData(user: User): void {
    try {
      const userData = {
        ...user,
        updatedAt: new Date().toISOString()
      };
      const jsonData = JSON.stringify(userData, null, 2);
      localStorage.setItem(this.STORAGE_KEY, jsonData);
      
      // Also save as easily readable export
      const portfolioData = this.generateFromUser(user);
      const exportData = JSON.stringify(portfolioData, null, 2);
      localStorage.setItem(this.EXPORT_KEY, exportData);
      
      console.log('User data saved to localStorage:', userData);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  // Load user data from localStorage
  loadUserData(userId: string): User | null {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const userData = JSON.parse(storedData) as User;
        console.log('User data loaded from localStorage:', userData);
        return userData;
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
    return null;
  }

  // Get dummy data for templates
  getDummyData(templateId: string): PortfolioData {
    switch (templateId.toLowerCase()) {
      case 'modern-tech':
        return modernTechData;
      case 'creative':
        return creativeData;
      case 'minimalist':
        return minimalistData;
      case 'corporate':
        return corporateData;
      case 'classic':
      default:
        return classicData;
    }
  }

  // Export portfolio data as JSON string
  exportAsJSON(data: PortfolioData): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data as JSON:', error);
      return '{}';
    }
  }

  // Import portfolio data from JSON string
  importFromJSON(json: string): PortfolioData {
    try {
      const data = JSON.parse(json) as PortfolioData;
      // Validate the structure
      if (!data.personalInfo || !data.personalInfo.name) {
        throw new Error('Invalid portfolio data structure');
      }
      return data;
    } catch (error) {
      console.error('Failed to import data from JSON:', error);
      // Return default empty structure
      return {
        personalInfo: {
          name: '',
          title: '',
          email: '',
          about: ''
        },
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: []
      };
    }
  }

  // Get current exported data from localStorage
  getCurrentExportedData(): PortfolioData | null {
    try {
      const exportedData = localStorage.getItem(this.EXPORT_KEY);
      if (exportedData) {
        return JSON.parse(exportedData) as PortfolioData;
      }
    } catch (error) {
      console.error('Failed to get current exported data:', error);
    }
    return null;
  }

  // Check if user profile is complete
  isProfileComplete(user: User): boolean {
    return !!(
      user.name &&
      user.title &&
      user.about &&
      user.skills && user.skills.length > 0 &&
      user.experience && user.experience.length > 0
      // Projects are optional for profile completion
    );
  }

  // Generate sample projects for demo
  generateSampleProjects(): any[] {
    return [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with React frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, and payment integration.",
        tags: ["React", "Node.js", "MongoDB", "Stripe", "TypeScript"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
        link: "https://demo-ecommerce.com",
        githubLink: "https://github.com/user/ecommerce-platform",
        status: "Completed",
        role: "Full Stack Developer",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
        achievements: ["Increased conversion rate by 25%", "Handled 10k+ concurrent users"]
      },
      {
        name: "Task Management App",
        description: "Collaborative task management application with real-time updates, team collaboration features, and advanced filtering options.",
        tags: ["Vue.js", "Firebase", "PWA", "Real-time"],
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
        link: "https://taskmaster-app.com",
        githubLink: "https://github.com/user/task-manager",
        status: "In Progress",
        role: "Frontend Lead",
        technologies: ["Vue.js", "Firebase", "PWA", "Socket.io"],
        achievements: ["500+ active users", "Featured in Vue.js newsletter"]
      },
      {
        name: "Data Visualization Dashboard",
        description: "Interactive dashboard for displaying complex data analytics with customizable charts, filters, and real-time data streaming.",
        tags: ["D3.js", "Python", "Flask", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        link: "https://analytics-dashboard.com",
        status: "Completed",
        role: "Data Visualization Developer",
        technologies: ["D3.js", "React", "Python", "Flask", "PostgreSQL"],
        achievements: ["Reduced data processing time by 60%", "Improved decision making speed"]
      }
    ];
  }
}

// Export singleton instance
export const portfolioDataManager = new PortfolioDataManagerImpl();