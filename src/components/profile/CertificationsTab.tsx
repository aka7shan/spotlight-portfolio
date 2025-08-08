import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User, Certification } from "../../types/portfolio";
import { Plus, Trash2, Award, Edit, Calendar } from "lucide-react";
import { CertificationDialog } from "./CertificationDialog";
import { format } from "date-fns";
interface CertificationsTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function CertificationsTab({ formData, handleInputChange }: CertificationsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCertification, setSelectedCertification] = useState<Certification | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openAddDialog = useCallback(() => {
    setSelectedCertification(undefined);
    setDialogMode('add');
    setEditIndex(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((certification: Certification, index: number) => {
    setSelectedCertification(certification);
    setDialogMode('edit');
    setEditIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSaveCertification = useCallback((certification: Certification) => {
    if (dialogMode === 'add') {
      handleInputChange('certifications', [...(formData.certifications || []), certification]);
    } else if (dialogMode === 'edit' && editIndex !== null) {
      const certifications = [...(formData.certifications || [])];
      certifications[editIndex] = certification;
      handleInputChange('certifications', certifications);
    }
  }, [dialogMode, editIndex, formData.certifications, handleInputChange]);

  const removeCertification = useCallback((index: number) => {
    const certifications = formData.certifications?.filter((_, i) => i !== index) || [];
    handleInputChange('certifications', certifications);
  }, [formData.certifications, handleInputChange]);

      const formatDateDisplay = (dateString: string) => {
        if (!dateString) return '';
        try {
          return format(new Date(dateString), 'MMM yyyy');
        } catch {
          return dateString;
        }
      };
  
    const formatDuration = (certs: Certification) => {
      const startDisplay = formatDateDisplay(certs.startDate);
      const endDisplay = certs.isPresent ? 'Present' : formatDateDisplay(certs.endDate || '');
      return `${startDisplay} - ${endDisplay}`;
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent>
          {formData.certifications && formData.certifications.length > 0 ? (
            <div className="space-y-4">
              {formData.certifications.map((cert, index) => (
                <Card key={index} className="border border-gray-200 hover:border-orange-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{cert.name || 'Unnamed Certification'}</h4>
                        <div className="flex items-center gap-4 text-md font-medium">
                          <span className="text-blue-600">{cert.issuer} </span>
                          <div className="flex items-center gap-1 text-gray-600">
                            •
                            <Calendar className="w-4 h-4" />
                            {formatDuration(cert)}
                          </div>
                        </div>
                        {cert.credentialId && (
                          <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(cert, index)}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 hover:bg-orange-50 border-orange-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeCertification(index)}
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
              <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No certifications added yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CertificationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCertification}
        mode={dialogMode}
        certification={selectedCertification}
      />
    </div>
  );
}