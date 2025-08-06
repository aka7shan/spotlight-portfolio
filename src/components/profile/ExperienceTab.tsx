import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { FormField, Validator } from "../ui/form-validation";
import type { User, Experience } from "../../types/portfolio";
import { ExperienceDialog } from "./ExperienceDialog";
import { Plus, Trash2, Briefcase, Edit, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface ExperienceTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function ExperienceTab({ formData, handleInputChange }: ExperienceTabProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<{ index: number; experience: Experience } | null>(null);

  // Validate data when form changes
  const validateData = useCallback(() => {
    const validation = Validator.validateExperienceData(formData.experience || []);
    setValidationErrors(validation.errors);
  }, [formData.experience]);

  // Experience handlers
  const openAddExperienceDialog = useCallback(() => {
    setEditingExperience(null);
    setExperienceDialogOpen(true);
  }, []);

  const openEditExperienceDialog = useCallback((index: number, experience: Experience) => {
    setEditingExperience({ index, experience });
    setExperienceDialogOpen(true);
  }, []);

  const closeExperienceDialog = useCallback(() => {
    setExperienceDialogOpen(false);
    setEditingExperience(null);
  }, []);

  const handleExperienceSave = useCallback((experience: Experience) => {
    if (editingExperience) {
      // Edit existing experience
      const experiences = [...(formData.experience || [])];
      experiences[editingExperience.index] = experience;
      handleInputChange('experience', experiences);
    } else {
      // Add new experience
      handleInputChange('experience', [...(formData.experience || []), experience]);
    }
    setTimeout(validateData, 0);
  }, [editingExperience, formData.experience, handleInputChange, validateData]);

  const removeExperience = useCallback((index: number) => {
    const experiences = formData.experience?.filter((_, i) => i !== index) || [];
    handleInputChange('experience', experiences);
    setTimeout(validateData, 0);
  }, [formData.experience, handleInputChange, validateData]);

  const addSampleExperience = useCallback(() => {
    const sampleExperiences = [
      {
        position: "Senior Software Engineer",
        company: "TechFlow Solutions",
        startDate: "2022-03-01",
        endDate: undefined,
        isPresent: true,
        description: "Led development of microservices architecture serving 100K+ users. Built React dashboards, optimized database queries, and mentored 3 junior developers. Implemented CI/CD pipelines reducing deployment time by 60%.",
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"]
      },
      {
        position: "Full Stack Developer",
        company: "StartupHub Inc",
        startDate: "2020-06-15",
        endDate: "2022-02-28",
        isPresent: false,
        description: "Developed and maintained 5+ web applications using React and Node.js. Collaborated with design team to implement responsive UI components. Reduced page load times by 40% through code optimization.",
        location: "Remote",
        skills: ["React", "Vue.js", "JavaScript", "MongoDB", "Express.js"]
      }
    ];
    handleInputChange('experience', [...(formData.experience || []), ...sampleExperiences]);
  }, [formData.experience, handleInputChange]);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDuration = (experience: Experience) => {
    const startDisplay = formatDateDisplay(experience.startDate);
    const endDisplay = experience.isPresent ? 'Present' : formatDateDisplay(experience.endDate || '');
    return `${startDisplay} - ${endDisplay}`;
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Briefcase className="w-5 h-5" />
              Work Experience *
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={addSampleExperience} variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Add Sample Experience
              </Button>
              <Button onClick={openAddExperienceDialog} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <FormField error={validationErrors.experience}>
            {formData.experience && formData.experience.length > 0 ? (
              <div className="space-y-4">
                {formData.experience.map((experience, index) => (
                  <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {experience.position || `Position ${index + 1}`}
                          </h4>
                          <h5 className="text-md font-medium text-blue-600 mb-2">
                            {experience.company}
                          </h5>
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDuration(experience)}
                            </div>
                            {experience.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {experience.location}
                              </div>
                            )}
                            {experience.isPresent && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {experience.description}
                          </p>
                          {experience.skills && experience.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {experience.skills.slice(0, 6).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                              {experience.skills.length > 6 && (
                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                  +{experience.skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => openEditExperienceDialog(index, experience)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 border-blue-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => removeExperience(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <Briefcase className="w-16 h-16 mx-auto opacity-30" />
                </div>
                <h3 className="text-lg font-medium mb-2">No experience added yet</h3>
                <p className="text-sm mb-4">Start building your professional history</p>
                <Button onClick={openAddExperienceDialog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Experience
                </Button>
              </div>
            )}
          </FormField>
        </CardContent>
      </Card>

      {/* Experience Dialog */}
      <ExperienceDialog
        open={experienceDialogOpen}
        onClose={closeExperienceDialog}
        onSave={handleExperienceSave}
        mode={editingExperience ? 'edit' : 'add'}
        experience={editingExperience?.experience}
      />
    </div>
  );
}