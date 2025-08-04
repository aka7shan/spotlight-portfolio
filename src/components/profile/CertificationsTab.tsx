import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { User, Certification } from "../../types/portfolio";
import { Plus, Trash2, Award } from "lucide-react";

interface CertificationsTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function CertificationsTab({ formData, handleInputChange }: CertificationsTabProps) {
  const addCertification = useCallback(() => {
    const newCert: Certification = {
      name: '',
      issuer: '',
      date: ''
    };
    handleInputChange('certifications', [...(formData.certifications || []), newCert]);
  }, [formData.certifications, handleInputChange]);

  const updateCertification = useCallback((index: number, field: keyof Certification, value: string) => {
    const certifications = [...(formData.certifications || [])];
    certifications[index] = { ...certifications[index], [field]: value };
    handleInputChange('certifications', certifications);
  }, [formData.certifications, handleInputChange]);

  const removeCertification = useCallback((index: number) => {
    const certifications = formData.certifications?.filter((_, i) => i !== index) || [];
    handleInputChange('certifications', certifications);
  }, [formData.certifications, handleInputChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button onClick={addCertification}>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent>
          {formData.certifications && formData.certifications.length > 0 ? (
            <div className="space-y-4">
              {formData.certifications.map((cert, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Certification {index + 1}</h4>
                      <Button
                        onClick={() => removeCertification(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name || ''}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          placeholder="AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={cert.issuer || ''}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          value={cert.date || ''}
                          onChange={(e) => updateCertification(index, 'date', e.target.value)}
                          placeholder="2023"
                        />
                      </div>
                      <div>
                        <Label>Credential ID</Label>
                        <Input
                          value={cert.credentialId || ''}
                          onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                          placeholder="ABC123XYZ"
                        />
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
    </div>
  );
}