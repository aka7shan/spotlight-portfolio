import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormField } from "../ui/form-validation";
import type { Language } from "../../types/portfolio";
import { Languages } from "lucide-react";

interface LanguageDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (language: Language) => void;
  mode: 'add' | 'edit';
  language?: Language;
}

export function LanguageDialog({ open, onClose, onSave, mode, language }: LanguageDialogProps) {
  const [formData, setFormData] = useState<Language>({
    name: '',
    level: 'Beginner'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update form data when language prop changes (for edit mode)
  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name || '',
        level: language.level || 'Beginner'
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        level: 'Beginner'
      });
    }
  }, [language, mode, open]);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Language name is required';
    }
    if (!formData.level) {
      errors.level = 'Proficiency level is required';
    }

    // Language name validation (basic check for valid characters)
    if (formData.name && !/^[a-zA-Z\s\-']+$/.test(formData.name.trim())) {
      errors.name = 'Please enter a valid language name';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof Language, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      // Reset form for next use
      setFormData({
        name: '',
        level: 'Beginner'
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
        level: 'Beginner'
      });
    }
  }, [onClose, mode]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {mode === 'add' ? 'Add New Language' : 'Edit Language'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Name */}
          <FormField error={validationErrors.name}>
            <Label htmlFor="language-name" className="text-sm font-medium text-gray-700">
              Language *
            </Label>
            <Input
              id="language-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Spanish, Mandarin, French"
              className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              error={!!validationErrors.name}
            />
          </FormField>

          {/* Proficiency Level */}
          <FormField error={validationErrors.level}>
            <Label className="text-sm font-medium text-gray-700">
              Proficiency Level *
            </Label>
            <Select 
              value={formData.level} 
              onValueChange={(value) => handleInputChange('level', value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
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
          </FormField>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {mode === 'add' ? 'Add Language' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}