import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormField } from "../ui/form-validation";
import { EnhancedDatePicker } from "../ui/enhanced-date-picker";
import type { Education } from "../../types/portfolio";
import { GraduationCap, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../ui/utils";

interface EducationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;
  mode: 'add' | 'edit';
  education?: Education;
}

export function EducationDialog({ open, onClose, onSave, mode, education }: EducationDialogProps) {
  const [formData, setFormData] = useState<Education>({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    gpa: '',
    isPresent: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Update form data when education prop changes (for edit mode)
  useEffect(() => {
    if (education) {
      setFormData({
        degree: education.degree || '',
        institution: education.institution || '',
        startDate: education.startDate || '',
        endDate: education.endDate || '',
        gpa: education.gpa || '',
        isPresent: education.isPresent || false
      });
    } else {
      // Reset form for add mode
      setFormData({
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
        isPresent: false
      });
    }
  }, [education, mode, open]);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.degree.trim()) {
      errors.degree = 'Degree is required';
    }
    if (!formData.institution.trim()) {
      errors.institution = 'Institution is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    // End date validation
    if (!formData.isPresent && !formData.endDate) {
      errors.endDate = 'End date is required (or mark as current)';
    }

    // Date order validation
    if (formData.startDate && formData.endDate && !formData.isPresent) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        errors.dates = 'End date must be after start date';
      }
    }

    // GPA validation (optional but if provided should be valid)
    if (formData.gpa && formData.gpa.trim()) {
      const gpaPattern = /^(\d+(\.\d+)?\/\d+(\.\d+)?|\d+(\.\d+)?%?)$/;
      if (!gpaPattern.test(formData.gpa.trim())) {
        errors.gpa = 'Please enter a valid GPA format (e.g., 3.8/4.0, 85%, or 3.7)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof Education, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePresentChange = useCallback((checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPresent: checked,
      endDate: checked ? undefined : prev.endDate
    }));
  }, []);

  const handleStartDateSelect = useCallback((date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      handleInputChange('startDate', format(date, 'yyyy-MM-dd'));
      setStartDateOpen(false);
    }
  }, [handleInputChange]);

  const handleEndDateSelect = useCallback((date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      handleInputChange('endDate', format(date, 'yyyy-MM-dd'));
      setEndDateOpen(false);
    }
  }, [handleInputChange]);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      // Reset form for next use
      setFormData({
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
        isPresent: false
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
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
        isPresent: false
      });
    }
  }, [onClose, mode]);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            {mode === 'add' ? 'Add New Education' : 'Edit Education'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Degree and Institution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={validationErrors.degree}>
              <Label htmlFor="education-degree" className="text-sm font-medium text-gray-700">
                Degree *
              </Label>
              <Input
                id="education-degree"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                error={!!validationErrors.degree}
              />
            </FormField>

            <FormField error={validationErrors.institution}>
              <Label htmlFor="education-institution" className="text-sm font-medium text-gray-700">
                Institution *
              </Label>
              <Input
                id="education-institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="e.g. Stanford University"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                error={!!validationErrors.institution}
              />
            </FormField>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField error={validationErrors.startDate}>
                <Label className="text-sm font-medium text-gray-700">Start Date *</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-green-500 focus:ring-green-500",
                        !formData.startDate && "text-muted-foreground",
                        validationErrors.startDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? formatDateDisplay(formData.startDate) : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedDatePicker
                      mode="single"
                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                      onSelect={handleStartDateSelect}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormField>

              <FormField error={validationErrors.endDate || validationErrors.dates}>
                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={formData.isPresent}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-green-500 focus:ring-green-500",
                        (!formData.endDate || formData.isPresent) && "text-muted-foreground",
                        (validationErrors.endDate || validationErrors.dates) && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.isPresent 
                        ? "Currently studying" 
                        : formData.endDate 
                          ? formatDateDisplay(formData.endDate) 
                          : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedDatePicker
                      mode="single"
                      selected={formData.endDate ? new Date(formData.endDate) : undefined}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        const startDate = formData.startDate ? new Date(formData.startDate) : null;

                        return date > today || (startDate ? date <= startDate : false);
                        }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>

            {/* Current checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-current"
                checked={formData.isPresent}
                onCheckedChange={handlePresentChange}
              />
              <Label
                htmlFor="is-current"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                I currently study here
              </Label>
            </div>
          </div>

          {/* GPA */}
          <FormField error={validationErrors.gpa}>
            <Label htmlFor="education-gpa" className="text-sm font-medium text-gray-700">
              GPA (Optional)
            </Label>
            <Input
              id="education-gpa"
              value={formData.gpa || ''}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              placeholder="e.g. 3.8/4.0 or 85%"
              className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              error={!!validationErrors.gpa}
            />
          </FormField>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700"
          >
            {mode === 'add' ? 'Add Education' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}