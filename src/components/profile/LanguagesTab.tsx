import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { User, Language } from "../../types/portfolio";
import { Plus, Trash2, Languages } from "lucide-react";

interface LanguagesTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function LanguagesTab({ formData, handleInputChange }: LanguagesTabProps) {
  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      name: '',
      level: 'Beginner'
    };
    handleInputChange('languages', [...(formData.languages || []), newLanguage]);
  }, [formData.languages, handleInputChange]);

  const updateLanguage = useCallback((index: number, field: keyof Language, value: string) => {
    const languages = [...(formData.languages || [])];
    languages[index] = { ...languages[index], [field]: value };
    handleInputChange('languages', languages);
  }, [formData.languages, handleInputChange]);

  const removeLanguage = useCallback((index: number) => {
    const languages = formData.languages?.filter((_, i) => i !== index) || [];
    handleInputChange('languages', languages);
  }, [formData.languages, handleInputChange]);

  return (
    <div className="space-y-6">
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
    </div>
  );
}