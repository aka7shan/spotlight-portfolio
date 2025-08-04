import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { User, Achievement } from "../../types/portfolio";
import { Plus, Trash2, Trophy } from "lucide-react";

interface AchievementsTabProps {
  formData: User;
  handleInputChange: (field: keyof User, value: any) => void;
}

export function AchievementsTab({ formData, handleInputChange }: AchievementsTabProps) {
  const addAchievement = useCallback(() => {
    const newAchievement: Achievement = {
      title: '',
      description: '',
      date: ''
    };
    handleInputChange('achievements', [...(formData.achievements || []), newAchievement]);
  }, [formData.achievements, handleInputChange]);

  const updateAchievement = useCallback((index: number, field: keyof Achievement, value: string) => {
    const achievements = [...(formData.achievements || [])];
    achievements[index] = { ...achievements[index], [field]: value };
    handleInputChange('achievements', achievements);
  }, [formData.achievements, handleInputChange]);

  const removeAchievement = useCallback((index: number) => {
    const achievements = formData.achievements?.filter((_, i) => i !== index) || [];
    handleInputChange('achievements', achievements);
  }, [formData.achievements, handleInputChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Button onClick={addAchievement}>
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </CardHeader>
        <CardContent>
          {formData.achievements && formData.achievements.length > 0 ? (
            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Achievement {index + 1}</h4>
                      <Button
                        onClick={() => removeAchievement(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={achievement.title || ''}
                          onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                          placeholder="Employee of the Year"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={achievement.description || ''}
                          onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                          placeholder="Description of the achievement..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          value={achievement.date || ''}
                          onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                          placeholder="2023"
                        />
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
    </div>
  );
}