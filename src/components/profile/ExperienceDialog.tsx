import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormField } from "../ui/form-validation";
import { EnhancedDatePicker } from "../ui/enhanced-date-picker";
import {
  EMPLOYMENT_TYPE_VALUES,
  type EmploymentType,
  type Experience,
} from "../../types/portfolio";
import { CalendarIcon, X, Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../ui/utils";

// Sentinel value used in the SelectItem for "no employment type chosen".
// Radix's Select rejects an empty-string value, so we render this sentinel
// in the dropdown and translate it to `undefined` on the way out (and
// back to the sentinel on the way in). Keeps the data model clean —
// `undefined` still wins on the wire and in the type.
const NO_EMPLOYMENT_TYPE = "__none__";

interface ExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => void;
  mode: 'add' | 'edit';
  experience?: Experience;
}

export function ExperienceDialog({ open, onClose, onSave, mode, experience }: ExperienceDialogProps) {
  const [formData, setFormData] = useState<Experience>({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    isPresent: false,
    description: '',
    location: '',
    skills: [],
    industry: '',
    employmentType: undefined,
  });

  // Update form data when experience prop changes (for edit mode)
  useEffect(() => {
    if (experience) {
      setFormData({
        position: experience.position || '',
        company: experience.company || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        isPresent: experience.isPresent || false,
        description: experience.description || '',
        location: experience.location || '',
        skills: experience.skills || [],
        industry: experience.industry || '',
        employmentType: experience.employmentType,
      });
    } else {
      // Reset form for add mode
      setFormData({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        description: '',
        location: '',
        skills: [],
        industry: '',
        employmentType: undefined,
      });
    }
  }, [experience, mode, open]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    }
    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    // End date validation
    if (!formData.isPresent && !formData.endDate) {
      errors.endDate = 'End date is required (or mark as current position)';
    }

    // Date order validation
    if (formData.startDate && formData.endDate && !formData.isPresent) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        errors.dates = 'End date must be after start date';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof Experience, value: any) => {
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

  const addSkill = useCallback(() => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      handleInputChange('skills', [...(formData.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  }, [newSkill, formData.skills, handleInputChange]);

  const removeSkill = useCallback((skillToRemove: string) => {
    handleInputChange('skills', formData.skills?.filter(skill => skill !== skillToRemove) || []);
  }, [formData.skills, handleInputChange]);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      // Strip empty industry on the way out — keep wire payload tidy and
      // align with "omit means keep" PUT semantics on the backend.
      const payload: Experience = {
        ...formData,
        industry: formData.industry?.trim() ? formData.industry.trim() : undefined,
      };
      onSave(payload);
      onClose();
      // Reset form for next use
      setFormData({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        description: '',
        location: '',
        skills: [],
        industry: '',
        employmentType: undefined,
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
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        description: '',
        location: '',
        skills: [],
        industry: '',
        employmentType: undefined,
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
            <Building2 className="w-5 h-5" />
            {mode === 'add' ? 'Add New Experience' : 'Edit Experience'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Position and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={validationErrors.position}>
              <Label htmlFor="experience-position" className="text-sm font-medium text-gray-700">
                Position *
              </Label>
              <Input
                id="experience-position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                error={!!validationErrors.position}
              />
            </FormField>

            <FormField error={validationErrors.company}>
              <Label htmlFor="experience-company" className="text-sm font-medium text-gray-700">
                Company *
              </Label>
              <Input
                id="experience-company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g. TechCorp Solutions"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                error={!!validationErrors.company}
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
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500",
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
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                        (!formData.endDate || formData.isPresent) && "text-muted-foreground",
                        (validationErrors.endDate || validationErrors.dates) && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.isPresent 
                        ? "Present" 
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

            {/* Present checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-present"
                checked={formData.isPresent}
                onCheckedChange={handlePresentChange}
              />
              <Label
                htmlFor="is-present"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                I currently work here
              </Label>
            </div>
          </div>

          {/* Description */}
          <FormField error={validationErrors.description}>
            <Label htmlFor="experience-description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="experience-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your role, responsibilities, and key achievements..."
              rows={4}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              error={!!validationErrors.description}
            />
          </FormField>

          {/* Location, Employment Type, Industry (all optional) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="experience-location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="experience-location"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="experience-employment-type" className="text-sm font-medium text-gray-700">
                Employment Type
              </Label>
              <Select
                value={formData.employmentType ?? NO_EMPLOYMENT_TYPE}
                onValueChange={(value) =>
                  handleInputChange(
                    'employmentType',
                    value === NO_EMPLOYMENT_TYPE ? undefined : (value as EmploymentType),
                  )
                }
              >
                <SelectTrigger
                  id="experience-employment-type"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_EMPLOYMENT_TYPE}>—</SelectItem>
                  {EMPLOYMENT_TYPE_VALUES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience-industry" className="text-sm font-medium text-gray-700">
                Industry
              </Label>
              <Input
                id="experience-industry"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="e.g. Banking, Healthcare"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Skills (Optional) */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Skills Used</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Type a skill and click Add"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addSkill}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Add
                </Button>
              </div>
              {formData.skills && formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)} 
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
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            {mode === 'add' ? 'Add Experience' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}