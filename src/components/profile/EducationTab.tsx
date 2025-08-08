import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User, Education } from "../../types/portfolio";
import { Plus, Trash2, GraduationCap, Edit, Calendar } from "lucide-react";
import { EducationDialog } from "./EducationDialog";
import { format } from "date-fns";

interface EducationTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function EducationTab({ formData, handleInputChange }: EducationTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openAddDialog = useCallback(() => {
    setSelectedEducation(undefined);
    setDialogMode('add');
    setEditIndex(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((education: Education, index: number) => {
    setSelectedEducation(education);
    setDialogMode('edit');
    setEditIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSaveEducation = useCallback((education: Education) => {
    if (dialogMode === 'add') {
      handleInputChange('education', [...(formData.education || []), education]);
    } else if (dialogMode === 'edit' && editIndex !== null) {
      const educationList = [...(formData.education || [])];
      educationList[editIndex] = education;
      handleInputChange('education', educationList);
    }
  }, [dialogMode, editIndex, formData.education, handleInputChange]);

  const removeEducation = useCallback((index: number) => {
    const education = formData.education?.filter((_, i) => i !== index) || [];
    handleInputChange('education', education);
  }, [formData.education, handleInputChange]);

    const formatDateDisplay = (dateString: string) => {
      if (!dateString) return '';
      try {
        return format(new Date(dateString), 'MMM yyyy');
      } catch {
        return dateString;
      }
    };

  const formatDuration = (education: Education) => {
    const startDisplay = formatDateDisplay(education.startDate);
    const endDisplay = education.isPresent ? 'Present' : formatDateDisplay(education.endDate || '');
    return `${startDisplay} - ${endDisplay}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education *</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent>
          {formData.education && formData.education.length > 0 ? (
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <Card key={index} className="border border-gray-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{edu.degree || 'Unnamed Degree'}</h4>
                        <h5 className="text-md font-medium text-blue-600 mb-2">
                            {edu.institution}
                          </h5>
                        <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDuration(edu)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{edu.year}</span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(edu, index)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:bg-green-50 border-green-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeEducation(index)}
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
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No education added yet. Click "Add Education" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EducationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveEducation}
        mode={dialogMode}
        education={selectedEducation}
      />
    </div>
  );
}