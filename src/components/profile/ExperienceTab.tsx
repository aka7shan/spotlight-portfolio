import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { User, Experience } from "../../types/portfolio";
import { Plus, Trash2, Briefcase } from "lucide-react";

interface ExperienceTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function ExperienceTab({ formData, handleInputChange }: ExperienceTabProps) {
  const addExperience = useCallback(() => {
    const newExp: Experience = {
      position: '',
      company: '',
      duration: '',
      description: ''
    };
    handleInputChange('experience', [...(formData.experience || []), newExp]);
  }, [formData.experience, handleInputChange]);

  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    const experience = [...(formData.experience || [])];
    experience[index] = { ...experience[index], [field]: value };
    handleInputChange('experience', experience);
  }, [formData.experience, handleInputChange]);

  const removeExperience = useCallback((index: number) => {
    const experience = formData.experience?.filter((_, i) => i !== index) || [];
    handleInputChange('experience', experience);
  }, [formData.experience, handleInputChange]);

  return (
    <div className="space-y-6">
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
    </div>
  );
}