import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { FormField, Validator } from "../ui/form-validation";
import type { Project } from "../../types/portfolio";
import { Link, Code, Plus, X } from "lucide-react";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  mode: 'add' | 'edit';
  project?: Project;
}

export function ProjectDialog({ open, onClose, onSave, mode, project }: ProjectDialogProps) {
  const [formData, setFormData] = useState<Project>(() => ({
    name: project?.name || '',
    description: project?.description || '',
    tags: project?.tags || [],
    status: project?.status || 'In Progress',
    link: project?.link || '',
    githubLink: project?.githubLink || '',
    image: project?.image || '',
    role: project?.role || '',
    technologies: project?.technologies || [],
    achievements: project?.achievements || []
  }));

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.tags || formData.tags.length === 0) {
      errors.tags = 'At least one technology/tag is required';
    }

    // URL validation for optional fields
    if (formData.link) {
      const linkError = Validator.validateUrl(formData.link);
      if (linkError) errors.link = 'Please enter a valid project URL';
    }
    if (formData.githubLink) {
      const githubError = Validator.validateUrl(formData.githubLink);
      if (githubError) errors.githubLink = 'Please enter a valid GitHub URL';
    }
    if (formData.image) {
      const imageError = Validator.validateUrl(formData.image);
      if (imageError) errors.image = 'Please enter a valid image URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, formData.tags, handleInputChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  }, [formData.tags, handleInputChange]);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      // Reset form for next use
      setFormData({
        name: '',
        description: '',
        tags: [],
        status: 'In Progress',
        link: '',
        githubLink: '',
        image: '',
        role: '',
        technologies: [],
        achievements: []
      });
      setValidationErrors({});
    }
  }, [formData, validateForm, onSave, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
    // Reset validation errors
    setValidationErrors({});
    // Reset form if in add mode
    if (mode === 'add') {
      setFormData({
        name: '',
        description: '',
        tags: [],
        status: 'In Progress',
        link: '',
        githubLink: '',
        image: '',
        role: '',
        technologies: [],
        achievements: []
      });
    }
  }, [onClose, mode]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[70vw] max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {mode === 'add' ? 'Add New Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Name and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={validationErrors.name}>
              <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
                Project Name *
              </Label>
              <Input
                id="project-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                error={!!validationErrors.name}
              />
            </FormField>

            <FormField error={validationErrors.status}>
              <Label className="text-sm font-medium text-gray-700">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
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
            </FormField>
          </div>

          {/* Description */}
          <FormField error={validationErrors.description}>
            <Label htmlFor="project-description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the project, technologies used, and your role..."
              rows={4}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
              error={!!validationErrors.description}
            />
          </FormField>

          {/* Technologies/Tags */}
          <FormField error={validationErrors.tags}>
            <Label className="text-sm font-medium text-gray-700">Technologies/Tags *</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Type a technology and click Add"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)} 
                        className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={validationErrors.link}>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Link className="w-4 h-4" />
                Project Link
              </Label>
              <Input
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="https://project-demo.com"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                error={!!validationErrors.link}
              />
            </FormField>

            <FormField error={validationErrors.githubLink}>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Code className="w-4 h-4" />
                GitHub Link
              </Label>
              <Input
                value={formData.githubLink}
                onChange={(e) => handleInputChange('githubLink', e.target.value)}
                placeholder="https://github.com/user/project"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                error={!!validationErrors.githubLink}
              />
            </FormField>
          </div>

          {/* Project Image */}
          <FormField error={validationErrors.image}>
            <Label className="text-sm font-medium text-gray-700">Project Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/project-screenshot.jpg"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              error={!!validationErrors.image}
            />
          </FormField>

          {/* Role (Optional) */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Your Role</Label>
            <Input
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              placeholder="e.g. Full Stack Developer, Team Lead"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        
      </DialogContent>
      <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {mode === 'add' ? 'Add Project' : 'Save Changes'}
          </Button>
        </DialogFooter>
    </Dialog>
  );
}