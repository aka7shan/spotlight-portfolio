import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormField } from "../ui/form-validation";
import { EnhancedDatePicker } from "../ui/enhanced-date-picker";
import type { Certification } from "../../types/portfolio";
import { Award, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../ui/utils";

interface CertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (certification: Certification) => void;
  mode: 'add' | 'edit';
  certification?: Certification;
}

export function CertificationDialog({ open, onClose, onSave, mode, certification }: CertificationDialogProps) {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    startDate: '',
    endDate: '',
    credentialId: '',
    isPresent: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Update form data when certification prop changes (for edit mode)
  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name || '',
        issuer: certification.issuer || '',
        startDate: certification.startDate || certification.date || '', // Backward compatibility
        endDate: certification.endDate || '',
        credentialId: certification.credentialId || '',
        isPresent: certification.isPresent || false
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        issuer: '',
        startDate: '',
        endDate: '',
        credentialId: '',
        isPresent: false
      });
    }
  }, [certification, mode, open]);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Certification name is required';
    }
    if (!formData.issuer.trim()) {
      errors.issuer = 'Issuer is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    // End date validation
    if (!formData.isPresent && !formData.endDate) {
      errors.endDate = 'End date is required (or mark as ongoing)';
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

  const handleInputChange = useCallback((field: keyof Certification, value: any) => {
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
        name: '',
        issuer: '',
        startDate: '',
        endDate: '',
        credentialId: '',
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
        name: '',
        issuer: '',
        startDate: '',
        endDate: '',
        credentialId: '',
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
            <Award className="w-5 h-5" />
            {mode === 'add' ? 'Add New Certification' : 'Edit Certification'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Certification Name and Issuer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={validationErrors.name}>
              <Label htmlFor="cert-name" className="text-sm font-medium text-gray-700">
                Certification Name *
              </Label>
              <Input
                id="cert-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                error={!!validationErrors.name}
              />
            </FormField>

            <FormField error={validationErrors.issuer}>
              <Label htmlFor="cert-issuer" className="text-sm font-medium text-gray-700">
                Issuer *
              </Label>
              <Input
                id="cert-issuer"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                error={!!validationErrors.issuer}
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
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-orange-500 focus:ring-orange-500",
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
                        "w-full justify-start text-left font-normal border-gray-200 focus:border-orange-500 focus:ring-orange-500",
                        (!formData.endDate || formData.isPresent) && "text-muted-foreground",
                        (validationErrors.endDate || validationErrors.dates) && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.isPresent 
                        ? "Ongoing" 
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

            {/* Ongoing checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-ongoing"
                checked={formData.isPresent}
                onCheckedChange={handlePresentChange}
              />
              <Label
                htmlFor="is-ongoing"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                This certification is ongoing
              </Label>
            </div>
          </div>

          {/* Credential ID */}
          <div>
            <Label htmlFor="cert-credential" className="text-sm font-medium text-gray-700">
              Credential ID
            </Label>
            <Input
              id="cert-credential"
              value={formData.credentialId || ''}
              onChange={(e) => handleInputChange('credentialId', e.target.value)}
              placeholder="e.g. ABC123XYZ"
              className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-orange-600 hover:bg-orange-700"
          >
            {mode === 'add' ? 'Add Certification' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}