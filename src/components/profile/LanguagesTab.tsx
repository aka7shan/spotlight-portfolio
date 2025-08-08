import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User, Language } from "../../types/portfolio";
import { Plus, Trash2, Languages, Edit } from "lucide-react";
import { LanguageDialog } from "./LanguageDialog";

interface LanguagesTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function LanguagesTab({ formData, handleInputChange }: LanguagesTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openAddDialog = useCallback(() => {
    setSelectedLanguage(undefined);
    setDialogMode('add');
    setEditIndex(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((language: Language, index: number) => {
    setSelectedLanguage(language);
    setDialogMode('edit');
    setEditIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSaveLanguage = useCallback((language: Language) => {
    if (dialogMode === 'add') {
      handleInputChange('languages', [...(formData.languages || []), language]);
    } else if (dialogMode === 'edit' && editIndex !== null) {
      const languages = [...(formData.languages || [])];
      languages[editIndex] = language;
      handleInputChange('languages', languages);
    }
  }, [dialogMode, editIndex, formData.languages, handleInputChange]);

  const removeLanguage = useCallback((index: number) => {
    const languages = formData.languages?.filter((_, i) => i !== index) || [];
    handleInputChange('languages', languages);
  }, [formData.languages, handleInputChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Languages</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </CardHeader>
        <CardContent>
          {formData.languages && formData.languages.length > 0 ? (
            <div className="space-y-4">
              {formData.languages.map((language, index) => (
                <Card key={index} className="border border-gray-200 hover:border-indigo-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{language.name || 'Unnamed Language'}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            language.level === 'Native' || language.level === 'Expert' 
                              ? 'bg-green-100 text-green-800'
                              : language.level === 'Fluent' || language.level === 'Advanced'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {language.level}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(language, index)}
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeLanguage(index)}
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
              <Languages className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No languages added yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <LanguageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveLanguage}
        mode={dialogMode}
        language={selectedLanguage}
      />
    </div>
  );
}