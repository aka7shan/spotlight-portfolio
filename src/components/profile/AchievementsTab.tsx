import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User, Achievement } from "../../types/portfolio";
import { Plus, Trash2, Trophy, Edit } from "lucide-react";
import { AchievementDialog } from "./AchievementDialog";

interface AchievementsTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function AchievementsTab({ formData, handleInputChange }: AchievementsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openAddDialog = useCallback(() => {
    setSelectedAchievement(undefined);
    setDialogMode('add');
    setEditIndex(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((achievement: Achievement, index: number) => {
    setSelectedAchievement(achievement);
    setDialogMode('edit');
    setEditIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSaveAchievement = useCallback((achievement: Achievement) => {
    if (dialogMode === 'add') {
      handleInputChange('achievements', [...(formData.achievements || []), achievement]);
    } else if (dialogMode === 'edit' && editIndex !== null) {
      const achievements = [...(formData.achievements || [])];
      achievements[editIndex] = achievement;
      handleInputChange('achievements', achievements);
    }
  }, [dialogMode, editIndex, formData.achievements, handleInputChange]);

  const removeAchievement = useCallback((index: number) => {
    const achievements = formData.achievements?.filter((_, i) => i !== index) || [];
    handleInputChange('achievements', achievements);
  }, [formData.achievements, handleInputChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </CardHeader>
        <CardContent>
          {formData.achievements && formData.achievements.length > 0 ? (
            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <Card key={index} className="border border-gray-200 hover:border-yellow-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{achievement.title || 'Unnamed Achievement'}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.startDate}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{achievement.description || 'No description provided'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(achievement, index)}
                          variant="outline"
                          size="sm"
                          className="text-yellow-600 hover:bg-yellow-50 border-yellow-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeAchievement(index)}
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
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No achievements added yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AchievementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveAchievement}
        mode={dialogMode}
        achievement={selectedAchievement}
      />
    </div>
  );
}