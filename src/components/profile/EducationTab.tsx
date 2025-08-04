import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { User, Education } from "../../types/portfolio";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface EducationTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function EducationTab({ formData, handleInputChange }: EducationTabProps) {
  const addEducation = useCallback(() => {
    const newEdu: Education = {
      degree: '',
      institution: '',
      year: ''
    };
    handleInputChange('education', [...(formData.education || []), newEdu]);
  }, [formData.education, handleInputChange]);

  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    const education = [...(formData.education || [])];
    education[index] = { ...education[index], [field]: value };
    handleInputChange('education', education);
  }, [formData.education, handleInputChange]);

  const removeEducation = useCallback((index: number) => {
    const education = formData.education?.filter((_, i) => i !== index) || [];
    handleInputChange('education', education);
  }, [formData.education, handleInputChange]);

  return (
    <div className="space-y-6">
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
    </div>
  );
}