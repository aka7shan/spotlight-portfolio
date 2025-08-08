import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormField } from "../ui/form-validation";
import { EnhancedDatePicker } from "../ui/enhanced-date-picker";
import type { Achievement } from "../../types/portfolio";
import { Trophy, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../ui/utils";

interface AchievementDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  mode: 'add' | 'edit';
  achievement?: Achievement;
}

export function AchievementDialog({ open, onClose, onSave, mode, achievement }: AchievementDialogProps) {
  const [formData, setFormData] = useState<Achievement>({
    title: '',
    description: '',
    startDate: '', // now the only date
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [dateOpen, setDateOpen] = useState(false);

  // Populate form in edit mode or reset in add mode
  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        description: achievement.description || '',
        startDate: achievement.startDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startDate: '',
      });
    }
  }, [achievement, mode, open]);

  // Validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Achievement title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Date awarded is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handlers
  const handleInputChange = useCallback((field: keyof Achievement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      handleInputChange('startDate', format(date, 'yyyy-MM-dd'));
      setDateOpen(false);
    }
  }, [handleInputChange]);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      setFormData({ title: '', description: '', startDate: '' });
      setValidationErrors({});
    }
  }, [formData, validateForm, onSave, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
    setValidationErrors({});
    if (mode === 'add') {
      setFormData({ title: '', description: '', startDate: '' });
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
      <DialogContent className="max-w-3xl  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {mode === 'add' ? 'Add New Achievement' : 'Edit Achievement'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <FormField error={validationErrors.title}>
            <Label htmlFor="achievement-title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="achievement-title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Employee of the Year"
              className="border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
              error={!!validationErrors.title}
            />
          </FormField>

          {/* Date Awarded */}
          <FormField error={validationErrors.startDate}>
            <Label className="text-sm font-medium text-gray-700">Date Awarded *</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 focus:border-yellow-500 focus:ring-yellow-500",
                    !formData.startDate && "text-muted-foreground",
                    validationErrors.startDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? formatDateDisplay(formData.startDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <EnhancedDatePicker
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormField>

          {/* Description */}
          <FormField error={validationErrors.description}>
            <Label htmlFor="achievement-description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="achievement-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your achievement, its impact, and any relevant details..."
              rows={4}
              className="border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
              error={!!validationErrors.description}
            />
          </FormField>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {mode === 'add' ? 'Add Achievement' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
