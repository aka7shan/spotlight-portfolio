import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { 
  User, 
  Experience, 
  Education, 
  Project,
  Certification, 
  Achievement, 
  Language 
} from "../types/portfolio";
import { 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Languages,
  FileText,
  Eye,
  File
} from "lucide-react";

interface ProfilePageProps {
  user: User;
  onNavigate: (page: string) => void;
  onUpdateProfile: (user: User) => void;
  onProfileChange: () => void;
  hasUnsavedChanges: boolean;
}

export function ProfilePage({ 
  user, 
  onNavigate, 
  onUpdateProfile, 
  onProfileChange, 
  hasUnsavedChanges 
}: ProfilePageProps) {
  const [formData, setFormData] = useState<User>(user);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Reset form data when user changes
  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Calculate profile completeness
  useEffect(() => {
    const calculateCompleteness = () => {
      const requiredFields = [
        { key: 'name', label: 'Name' },
        { key: 'title', label: 'Title' },
        { key: 'email', label: 'Email' },
        { key: 'location', label: 'Location' },
        { key: 'about', label: 'About' },
        { key: 'skills', label: 'Skills', isArray: true },
        { key: 'experience', label: 'Experience', isArray: true },
        { key: 'education', label: 'Education', isArray: true }
      ];

      const completedFields = requiredFields.filter(field => {
        const value = formData[field.key as keyof User];
        if (field.isArray) {
          return Array.isArray(value) && value.length > 0;
        }
        return value && value !== '';
      });

      const missing = requiredFields
        .filter(field => {
          const value = formData[field.key as keyof User];
          if (field.isArray) {
            return !Array.isArray(value) || value.length === 0;
          }
          return !value || value === '';
        })
        .map(field => field.label);

      setMissingFields(missing);
      setProfileCompleteness(Math.round((completedFields.length / requiredFields.length) * 100));
    };

    calculateCompleteness();
  }, [formData]);

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onProfileChange();
  };

  const handleSave = () => {
    onUpdateProfile(formData);
  };

  // CV Upload Handler
  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Here you would typically upload the file to a server
      // For now, we'll just show a success message and potentially extract some data
      console.log('CV uploaded:', file.name);
      alert('CV uploaded successfully! AI extraction will be available in future updates.');
      
      // Simulate some basic data extraction (you could expand this)
      if (!formData.name || formData.name === '') {
        // Could potentially extract name from filename
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const extractedName = fileName.replace(/[_-]/g, ' ').replace(/cv|resume/gi, '').trim();
        if (extractedName) {
          handleInputChange('name', extractedName);
        }
      }
    }
  };

  const addProject = () => {
    const newProject: Project = {
      name: '',
      description: '',
      tags: [],
      status: 'In Progress'
    };
    handleInputChange('projects', [...(formData.projects || []), newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const projects = [...(formData.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    handleInputChange('projects', projects);
  };

  const removeProject = (index: number) => {
    const projects = formData.projects?.filter((_, i) => i !== index) || [];
    handleInputChange('projects', projects);
  };

  const addExperience = () => {
    const newExp: Experience = {
      position: '',
      company: '',
      duration: '',
      description: ''
    };
    handleInputChange('experience', [...(formData.experience || []), newExp]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const experience = [...(formData.experience || [])];
    experience[index] = { ...experience[index], [field]: value };
    handleInputChange('experience', experience);
  };

  const removeExperience = (index: number) => {
    const experience = formData.experience?.filter((_, i) => i !== index) || [];
    handleInputChange('experience', experience);
  };

  const addEducation = () => {
    const newEdu: Education = {
      degree: '',
      institution: '',
      year: ''
    };
    handleInputChange('education', [...(formData.education || []), newEdu]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const education = [...(formData.education || [])];
    education[index] = { ...education[index], [field]: value };
    handleInputChange('education', education);
  };

  const removeEducation = (index: number) => {
    const education = formData.education?.filter((_, i) => i !== index) || [];
    handleInputChange('education', education);
  };

  const addCertification = () => {
    const newCert: Certification = {
      name: '',
      issuer: '',
      date: ''
    };
    handleInputChange('certifications', [...(formData.certifications || []), newCert]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const certifications = [...(formData.certifications || [])];
    certifications[index] = { ...certifications[index], [field]: value };
    handleInputChange('certifications', certifications);
  };

  const removeCertification = (index: number) => {
    const certifications = formData.certifications?.filter((_, i) => i !== index) || [];
    handleInputChange('certifications', certifications);
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      title: '',
      description: '',
      date: ''
    };
    handleInputChange('achievements', [...(formData.achievements || []), newAchievement]);
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    const achievements = [...(formData.achievements || [])];
    achievements[index] = { ...achievements[index], [field]: value };
    handleInputChange('achievements', achievements);
  };

  const removeAchievement = (index: number) => {
    const achievements = formData.achievements?.filter((_, i) => i !== index) || [];
    handleInputChange('achievements', achievements);
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      name: '',
      level: 'Beginner'
    };
    handleInputChange('languages', [...(formData.languages || []), newLanguage]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const languages = [...(formData.languages || [])];
    languages[index] = { ...languages[index], [field]: value };
    handleInputChange('languages', languages);
  };

  const removeLanguage = (index: number) => {
    const languages = formData.languages?.filter((_, i) => i !== index) || [];
    handleInputChange('languages', languages);
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills?.includes(skill.trim())) {
      handleInputChange('skills', [...(formData.skills || []), skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const skills = formData.skills?.filter(skill => skill !== skillToRemove) || [];
    handleInputChange('skills', skills);
  };

  const addSampleProjects = () => {
    const sampleProjects = [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with React frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, and payment integration.",
        tags: ["React", "Node.js", "MongoDB", "Stripe", "TypeScript"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
        link: "https://demo-ecommerce.com",
        githubLink: "https://github.com/user/ecommerce-platform",
        status: "Completed" as const,
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
        status: "In Progress" as const,
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
        status: "Completed" as const,
        role: "Data Visualization Developer",
        technologies: ["D3.js", "React", "Python", "Flask", "PostgreSQL"],
        achievements: ["Reduced data processing time by 60%", "Improved decision making speed"]
      }
    ];
    handleInputChange('projects', [...(formData.projects || []), ...sampleProjects]);
  };

  // Function to handle navigation with unsaved changes check
  const handleNavigateWithPrompt = (page: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost."
      );
      if (!confirmed) {
        return;
      }
    }
    onNavigate(page);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Fixed Header with Save Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio information and settings</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {hasUnsavedChanges && (
            <Alert className="w-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>You have unsaved changes</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSave} className="flex items-center gap-2 whitespace-nowrap">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Profile Completeness */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Profile Completeness: {profileCompleteness}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          {missingFields.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Missing information:</p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-orange-600 border-orange-600">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {profileCompleteness === 100 && (
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white">Profile Complete!</Badge>
              <Button 
                onClick={() => handleNavigateWithPrompt('portfolios')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Templates
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Quick Start with CV Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                Upload your CV/Resume to quickly populate your profile. We'll help extract information to get you started faster.
              </p>
              <div className="flex items-center gap-4">
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    className="hidden"
                  />
                  <Button className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload CV/Resume
                  </Button>
                </label>
                <div className="text-sm text-gray-500">
                  PDF, DOC, DOCX • Max 5MB
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                <File className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">AI Extraction Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Languages
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab - Now includes Projects */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>{formData.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="about">About Me *</Label>
                <Textarea
                  id="about"
                  value={formData.about || ''}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Write a brief description about yourself, your background, and what you're passionate about..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-skill">Add Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-skill"
                      placeholder="Type a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          addSkill(target.value);
                          target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                {formData.skills && formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Projects
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={addSampleProjects} variant="outline" size="sm">
                  Add Sample Projects
                </Button>
                <Button onClick={addProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {formData.projects && formData.projects.length > 0 ? (
                <div className="space-y-6">
                  {formData.projects.map((project, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold">Project {index + 1}</h4>
                          <Button
                            onClick={() => removeProject(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Project Name</Label>
                            <Input
                              value={project.name || ''}
                              onChange={(e) => updateProject(index, 'name', e.target.value)}
                              placeholder="Enter project name"
                            />
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Select 
                              value={project.status} 
                              onValueChange={(value) => updateProject(index, 'status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Planned">Planned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Description</Label>
                          <Textarea
                            value={project.description || ''}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            placeholder="Describe the project, technologies used, and your role..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Project Link</Label>
                            <Input
                              value={project.link || ''}
                              onChange={(e) => updateProject(index, 'link', e.target.value)}
                              placeholder="https://project-demo.com"
                            />
                          </div>
                          <div>
                            <Label>GitHub Link</Label>
                            <Input
                              value={project.githubLink || ''}
                              onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                              placeholder="https://github.com/user/project"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Technologies/Tags</Label>
                          <Input
                            placeholder="React, Node.js, MongoDB (comma separated)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                const tags = target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                                updateProject(index, 'tags', tags);
                                target.value = '';
                              }
                            }}
                          />
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label>Project Image URL</Label>
                          <Input
                            value={project.image || ''}
                            onChange={(e) => updateProject(index, 'image', e.target.value)}
                            placeholder="https://example.com/project-screenshot.jpg"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No projects added yet. Click "Add Project" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience *</CardTitle>
              <Button onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent>
              {formData.experience && formData.experience.length > 0 ? (
                <div className="space-y-6">
                  {formData.experience.map((exp, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold">Experience {index + 1}</h4>
                          <Button
                            onClick={() => removeExperience(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={exp.position || ''}
                              onChange={(e) => updateExperience(index, 'position', e.target.value)}
                              placeholder="Senior Software Engineer"
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company || ''}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration || ''}
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description || ''}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education *</CardTitle>
              <Button onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent>
              {formData.education && formData.education.length > 0 ? (
                <div className="space-y-6">
                  {formData.education.map((edu, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold">Education {index + 1}</h4>
                          <Button
                            onClick={() => removeEducation(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              placeholder="Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution || ''}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={edu.year || ''}
                              onChange={(e) => updateEducation(index, 'year', e.target.value)}
                              placeholder="2018 - 2022"
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                              placeholder="3.8/4.0"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certifications</CardTitle>
              <Button onClick={addCertification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </CardHeader>
            <CardContent>
              {formData.certifications && formData.certifications.length > 0 ? (
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Certification {index + 1}</h4>
                          <Button
                            onClick={() => removeCertification(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Certification Name</Label>
                            <Input
                              value={cert.name || ''}
                              onChange={(e) => updateCertification(index, 'name', e.target.value)}
                              placeholder="AWS Certified Solutions Architect"
                            />
                          </div>
                          <div>
                            <Label>Issuer</Label>
                            <Input
                              value={cert.issuer || ''}
                              onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                              placeholder="Amazon Web Services"
                            />
                          </div>
                          <div>
                            <Label>Date</Label>
                            <Input
                              value={cert.date || ''}
                              onChange={(e) => updateCertification(index, 'date', e.target.value)}
                              placeholder="2023"
                            />
                          </div>
                          <div>
                            <Label>Credential ID</Label>
                            <Input
                              value={cert.credentialId || ''}
                              onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                              placeholder="ABC123XYZ"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No certifications added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Achievements</CardTitle>
              <Button onClick={addAchievement}>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </CardHeader>
            <CardContent>
              {formData.achievements && formData.achievements.length > 0 ? (
                <div className="space-y-4">
                  {formData.achievements.map((achievement, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Achievement {index + 1}</h4>
                          <Button
                            onClick={() => removeAchievement(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={achievement.title || ''}
                              onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                              placeholder="Employee of the Year"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={achievement.description || ''}
                              onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                              placeholder="Description of the achievement..."
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Date</Label>
                            <Input
                              value={achievement.date || ''}
                              onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                              placeholder="2023"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No achievements added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Languages</CardTitle>
              <Button onClick={addLanguage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </CardHeader>
            <CardContent>
              {formData.languages && formData.languages.length > 0 ? (
                <div className="space-y-4">
                  {formData.languages.map((language, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Language {index + 1}</h4>
                          <Button
                            onClick={() => removeLanguage(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Language</Label>
                            <Input
                              value={language.name || ''}
                              onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                              placeholder="English"
                            />
                          </div>
                          <div>
                            <Label>Proficiency Level</Label>
                            <Select 
                              value={language.level} 
                              onValueChange={(value) => updateLanguage(index, 'level', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                                <SelectItem value="Native">Native</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Languages className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No languages added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}