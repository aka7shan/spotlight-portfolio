import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { User, Project } from "../../types/portfolio";
import { CVManager } from "./CVManager";
import { Plus, Trash2, FileText, User as UserIcon, Link, Code } from "lucide-react";

interface ProfileTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function ProfileTab({ formData, handleInputChange }: ProfileTabProps) {
  // Project handlers
  const addProject = useCallback(() => {
    const newProject: Project = {
      name: '',
      description: '',
      tags: [],
      status: 'In Progress'
    };
    handleInputChange('projects', [...(formData.projects || []), newProject]);
  }, [formData.projects, handleInputChange]);

  const updateProject = useCallback((index: number, field: keyof Project, value: any) => {
    const projects = [...(formData.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    handleInputChange('projects', projects);
  }, [formData.projects, handleInputChange]);

  const removeProject = useCallback((index: number) => {
    const projects = formData.projects?.filter((_, i) => i !== index) || [];
    handleInputChange('projects', projects);
  }, [formData.projects, handleInputChange]);

  // Skill handlers
  const addSkill = useCallback((skill: string) => {
    if (skill.trim() && !formData.skills?.includes(skill.trim())) {
      handleInputChange('skills', [...(formData.skills || []), skill.trim()]);
    }
  }, [formData.skills, handleInputChange]);

  const removeSkill = useCallback((skillToRemove: string) => {
    const skills = formData.skills?.filter(skill => skill !== skillToRemove) || [];
    handleInputChange('skills', skills);
  }, [formData.skills, handleInputChange]);

  // CV handlers
  const handleCVUpload = useCallback((cvData: any) => {
    handleInputChange('cv', cvData);
  }, [handleInputChange]);

  const handleCVRemove = useCallback(() => {
    handleInputChange('cv', undefined);
  }, [handleInputChange]);

  const addSampleProjects = useCallback(() => {
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
  }, [formData.projects, handleInputChange]);

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <UserIcon className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Professional Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about" className="text-sm font-medium text-gray-700">About Me *</Label>
            <Textarea
              id="about"
              value={formData.about || ''}
              onChange={(e) => handleInputChange('about', e.target.value)}
              placeholder="Write a brief description about yourself, your background, and what you're passionate about..."
              rows={4}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* CV/Resume Section */}
      <CVManager
        cvData={formData.cv}
        onCVUpload={handleCVUpload}
        onCVRemove={handleCVRemove}
        className="border-0 shadow-lg"
      />

      {/* Skills */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Code className="w-5 h-5" />
            Skills *
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-skill" className="text-sm font-medium text-gray-700">Add Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="new-skill"
                  placeholder="Type a skill and press Enter"
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)} 
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                    >
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
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <FileText className="w-5 h-5" />
              Projects
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={addSampleProjects} variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Add Sample Projects
              </Button>
              <Button onClick={addProject} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {formData.projects && formData.projects.length > 0 ? (
            <div className="space-y-6">
              {formData.projects.map((project, index) => (
                <Card key={index} className="border-2 border-gray-100 hover:border-purple-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Project {index + 1}</h4>
                      <Button
                        onClick={() => removeProject(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Project Name</Label>
                        <Input
                          value={project.name || ''}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          placeholder="Enter project name"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <Select 
                          value={project.status} 
                          onValueChange={(value) => updateProject(index, 'status', value)}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
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

                    <div className="mb-4 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Textarea
                        value={project.description || ''}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe the project, technologies used, and your role..."
                        rows={3}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Link className="w-4 h-4" />
                          Project Link
                        </Label>
                        <Input
                          value={project.link || ''}
                          onChange={(e) => updateProject(index, 'link', e.target.value)}
                          placeholder="https://project-demo.com"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Code className="w-4 h-4" />
                          GitHub Link
                        </Label>
                        <Input
                          value={project.githubLink || ''}
                          onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                          placeholder="https://github.com/user/project"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Technologies/Tags</Label>
                      <Input
                        placeholder="React, Node.js, MongoDB (comma separated)"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
                            <Badge key={tagIndex} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Project Image URL</Label>
                      <Input
                        value={project.image || ''}
                        onChange={(e) => updateProject(index, 'image', e.target.value)}
                        placeholder="https://example.com/project-screenshot.jpg"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <FileText className="w-16 h-16 mx-auto opacity-30" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects added yet</h3>
              <p className="text-sm mb-4">Showcase your work by adding your projects</p>
              <Button onClick={addProject} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}