import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from './utils';

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ children, error, required, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validator {
  static validateRequired(value: any, fieldName: string): string | null {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validatePhone(phone: string): string | null {
    if (!phone) return null; // Phone is optional
    
    // E.164 format validation - should start with + followed by 1-15 digits
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  static validateUrl(url: string): string | null {
    if (!url) return null; // URL is optional
    
    try {
      new URL(url);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }

  static validateProfileData(formData: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      { field: 'name', name: 'Full Name' },
      { field: 'title', name: 'Professional Title' },
      { field: 'email', name: 'Email' },
      { field: 'location', name: 'Location' },
      { field: 'about', name: 'About Me' },
    ];

    requiredFields.forEach(({ field, name }) => {
      const error = this.validateRequired(formData[field], name);
      if (error) errors[field] = error;
    });

    // Email validation
    if (formData.email) {
      const emailError = this.validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }

    // Phone validation
    if (formData.phone) {
      const phoneError = this.validatePhone(formData.phone);
      if (phoneError) errors.phone = phoneError;
    }

    // Skills validation
    if (!formData.skills || formData.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateExperienceData(experience: any[]): ValidationResult {
    const errors: Record<string, string> = {};

    if (!experience || experience.length === 0) {
      errors.experience = 'At least one work experience is required';
      return { isValid: false, errors };
    }

    experience.forEach((exp, index) => {
      const requiredFields = [
        { field: 'position', name: 'Position' },
        { field: 'company', name: 'Company' },
        { field: 'description', name: 'Description' },
      ];

      requiredFields.forEach(({ field, name }) => {
        if (!exp[field] || exp[field].trim() === '') {
          errors[`experience_${index}_${field}`] = `${name} is required for experience ${index + 1}`;
        }
      });

      // Validate start date
      if (!exp.startDate) {
        errors[`experience_${index}_startDate`] = `Start date is required for experience ${index + 1}`;
      }

      // Validate end date if not present
      if (!exp.isPresent && !exp.endDate) {
        errors[`experience_${index}_endDate`] = `End date is required for experience ${index + 1} (or mark as current position)`;
      }

      // Validate date order if both dates exist
      if (exp.startDate && exp.endDate && !exp.isPresent) {
        const startDate = new Date(exp.startDate);
        const endDate = new Date(exp.endDate);
        if (startDate >= endDate) {
          errors[`experience_${index}_dates`] = `End date must be after start date for experience ${index + 1}`;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateEducationData(education: any[]): ValidationResult {
    const errors: Record<string, string> = {};

    if (!education || education.length === 0) {
      errors.education = 'At least one education entry is required';
      return { isValid: false, errors };
    }

    education.forEach((edu, index) => {
      const requiredFields = [
        { field: 'degree', name: 'Degree' },
        { field: 'institution', name: 'Institution' },
        { field: 'year', name: 'Year' },
      ];

      requiredFields.forEach(({ field, name }) => {
        if (!edu[field] || edu[field].trim() === '') {
          errors[`education_${index}_${field}`] = `${name} is required for education ${index + 1}`;
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateProjectData(projects: any[]): ValidationResult {
    const errors: Record<string, string> = {};

    // Projects are optional, but if they exist, validate them
    if (projects && projects.length > 0) {
      projects.forEach((project, index) => {
        const requiredFields = [
          { field: 'name', name: 'Project Name' },
          { field: 'description', name: 'Description' },
        ];

        requiredFields.forEach(({ field, name }) => {
          if (!project[field] || project[field].trim() === '') {
            errors[`project_${index}_${field}`] = `${name} is required for project ${index + 1}`;
          }
        });

        // Validate URLs if provided
        if (project.link) {
          const linkError = this.validateUrl(project.link);
          if (linkError) {
            errors[`project_${index}_link`] = `Invalid project link for project ${index + 1}`;
          }
        }

        if (project.githubLink) {
          const githubError = this.validateUrl(project.githubLink);
          if (githubError) {
            errors[`project_${index}_githubLink`] = `Invalid GitHub link for project ${index + 1}`;
          }
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateAllData(formData: any): ValidationResult {
    const profileValidation = this.validateProfileData(formData);
    const experienceValidation = this.validateExperienceData(formData.experience);
    const educationValidation = this.validateEducationData(formData.education);
    const projectValidation = this.validateProjectData(formData.projects);

    const allErrors = {
      ...profileValidation.errors,
      ...experienceValidation.errors,
      ...educationValidation.errors,
      ...projectValidation.errors,
    };

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors
    };
  }
}