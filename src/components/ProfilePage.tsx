import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Alert, AlertDescription } from "./ui/alert";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileTab } from "./profile/ProfileTab";
import { ExperienceTab } from "./profile/ExperienceTab";
import { EducationTab } from "./profile/EducationTab";
import { CertificationsTab } from "./profile/CertificationsTab";
import { AchievementsTab } from "./profile/AchievementsTab";
import { LanguagesTab } from "./profile/LanguagesTab";
import type { User } from "../types/portfolio";
import { 
  Save, 
  AlertTriangle,
  CheckCircle,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Languages,
  Eye,
  Sparkles
} from "lucide-react";

interface ProfilePageProps {
  user: User;
  onNavigate: (page: string) => void;
  onUpdateProfile: (user: User) => void;
  onProfileChange: (sections: string[]) => void;
  hasUnsavedChanges: boolean;
  changedSections: string[];
}

export function ProfilePage({ 
  user, 
  onNavigate, 
  onUpdateProfile, 
  onProfileChange, 
  hasUnsavedChanges,
  changedSections
}: ProfilePageProps) {
  const [formData, setFormData] = useState<User>(user);
  const [activeTab, setActiveTab] = useState("profile");
  const [originalData, setOriginalData] = useState<User>(user);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  
  // Ref to expose save function to parent
  const saveRef = useRef<(() => void) | null>(null);

  // Reset form data when user changes
  useEffect(() => {
    setFormData(user);
    setOriginalData(user);
  }, [user]);

  // Calculate profile completeness using useMemo to prevent unnecessary recalculations
  const { profileCompleteness, missingFields } = useMemo(() => {
    const requiredFields = [
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'email', label: 'Email' },
      { key: 'location', label: 'Location' },
      { key: 'about', label: 'About' },
      { key: 'skills', label: 'Skills', isArray: true },
      { key: 'experience', label: 'Experience', isArray: true },
      { key: 'education', label: 'Education', isArray: true }
    ];

    const completedFields = requiredFields.filter(field => {
      const value = formData[field.key as keyof User];
      if (field.isArray) {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value !== '';
    });

    const missing = requiredFields
      .filter(field => {
        const value = formData[field.key as keyof User];
        if (field.isArray) {
          return !Array.isArray(value) || value.length === 0;
        }
        return !value || value === '';
      })
      .map(field => field.label);

    const completeness = Math.round((completedFields.length / requiredFields.length) * 100);

    return { profileCompleteness: completeness, missingFields: missing };
  }, [formData]);

  // Optimized change detection using useMemo
  const detectedChanges = useMemo(() => {
    const changes: string[] = [];
    
    // Check Personal Info changes
    if (
      formData.name !== originalData.name ||
      formData.title !== originalData.title ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.location !== originalData.location ||
      formData.about !== originalData.about ||
      formData.avatar !== originalData.avatar ||
      formData.coverImage !== originalData.coverImage
    ) {
      changes.push('Personal Information');
    }

    // Check Skills changes
    if (JSON.stringify(formData.skills || []) !== JSON.stringify(originalData.skills || [])) {
      changes.push('Skills');
    }

    // Check Projects changes
    if (JSON.stringify(formData.projects || []) !== JSON.stringify(originalData.projects || [])) {
      changes.push('Projects');
    }

    // Check Experience changes
    if (JSON.stringify(formData.experience || []) !== JSON.stringify(originalData.experience || [])) {
      changes.push('Experience');
    }

    // Check Education changes
    if (JSON.stringify(formData.education || []) !== JSON.stringify(originalData.education || [])) {
      changes.push('Education');
    }

    // Check Certifications changes
    if (JSON.stringify(formData.certifications || []) !== JSON.stringify(originalData.certifications || [])) {
      changes.push('Certifications');
    }

    // Check Achievements changes
    if (JSON.stringify(formData.achievements || []) !== JSON.stringify(originalData.achievements || [])) {
      changes.push('Achievements');
    }

    // Check Languages changes
    if (JSON.stringify(formData.languages || []) !== JSON.stringify(originalData.languages || [])) {
      changes.push('Languages');
    }

    // Check CV changes
    if (JSON.stringify(formData.cv || {}) !== JSON.stringify(originalData.cv || {})) {
      changes.push('CV/Resume');
    }

    return changes;
  }, [formData, originalData]);

  // Only call onProfileChange when changes actually occur
  useEffect(() => {
    onProfileChange(detectedChanges);
  }, [detectedChanges, onProfileChange]);

  const handleInputChange = useCallback((field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdateProfile(formData);
    setOriginalData(formData);
  }, [formData, onUpdateProfile]);

  // Expose save function via ref
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  const handleNavigationRequest = useCallback((destination: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(destination);
      setShowUnsavedDialog(true);
    } else {
      if (destination.includes('Tab')) {
        // Handle tab navigation
        const tabMap: Record<string, string> = {
          'Profile Tab': 'profile',
          'Experience Tab': 'experience', 
          'Education Tab': 'education',
          'Certifications Tab': 'certifications',
          'Achievements Tab': 'achievements',
          'Languages Tab': 'languages'
        };
        setActiveTab(tabMap[destination] || destination);
      } else {
        // Handle page navigation
        onNavigate(destination);
      }
    }
  }, [hasUnsavedChanges, onNavigate]);

  const handleTabChange = useCallback((newTab: string) => {
    const tabLabels: Record<string, string> = {
      profile: 'Profile Tab',
      experience: 'Experience Tab',
      education: 'Education Tab', 
      certifications: 'Certifications Tab',
      achievements: 'Achievements Tab',
      languages: 'Languages Tab'
    };
    
    handleNavigationRequest(tabLabels[newTab] || newTab);
  }, [handleNavigationRequest]);

  const handleDialogSave = useCallback(() => {
    handleSave();
    setShowUnsavedDialog(false);
    
    if (pendingNavigation) {
      if (pendingNavigation.includes('Tab')) {
        const tabMap: Record<string, string> = {
          'Profile Tab': 'profile',
          'Experience Tab': 'experience',
          'Education Tab': 'education', 
          'Certifications Tab': 'certifications',
          'Achievements Tab': 'achievements',
          'Languages Tab': 'languages'
        };
        setActiveTab(tabMap[pendingNavigation] || pendingNavigation);
      } else {
        onNavigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  }, [handleSave, pendingNavigation, onNavigate]);

  const handleDialogDiscard = useCallback(() => {
    setFormData(originalData);
    setShowUnsavedDialog(false);
    
    if (pendingNavigation) {
      if (pendingNavigation.includes('Tab')) {
        const tabMap: Record<string, string> = {
          'Profile Tab': 'profile', 
          'Experience Tab': 'experience',
          'Education Tab': 'education',
          'Certifications Tab': 'certifications', 
          'Achievements Tab': 'achievements',
          'Languages Tab': 'languages'
        };
        setActiveTab(tabMap[pendingNavigation] || pendingNavigation);
      } else {
        onNavigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  }, [originalData, pendingNavigation, onNavigate]);

  const handleDialogClose = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  }, []);

  return (
    <>
      {/* Fixed spacing container to prevent header overlap */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"> 
        <div className="pt-16 pb-8">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Profile Header with Hero Design */}
            <ProfileHeader
              user={formData}
              profileCompleteness={profileCompleteness}
              onUpdateUser={handleInputChange}
              className="mb-8"
            />

            {/* Action Bar */}
            <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-lg mb-8 p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Portfolio Builder</h2>
                  </div>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {profileCompleteness === 100 && (
                    <Button 
                      onClick={() => handleNavigationRequest('portfolios')} 
                      variant="outline"
                      className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Eye className="w-4 h-4" />
                      View Templates
                    </Button>
                  )}
                  <Button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            {missingFields.length > 0 && (
              <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    <CheckCircle className="w-5 h-5" />
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-orange-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompleteness}%` }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-orange-800 mb-2">Missing information to unlock all features:</p>
                      <div className="flex flex-wrap gap-2">
                        {missingFields.map((field, index) => (
                          <Badge key={index} variant="outline" className="text-orange-700 border-orange-300 bg-orange-100">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content Tabs */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <div className="border-b border-gray-200 bg-white/50 rounded-t-lg">
                  <TabsList className="grid w-full grid-cols-6 bg-transparent p-1">
                    <TabsTrigger 
                      value="profile" 
                      className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="experience" 
                      className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span className="hidden sm:inline">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="education" 
                      className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="hidden sm:inline">Education</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="certifications" 
                      className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                    >
                      <Award className="w-4 h-4" />
                      <span className="hidden sm:inline">Certs</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="achievements" 
                      className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <Trophy className="w-4 h-4" />
                      <span className="hidden sm:inline">Awards</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="languages" 
                      className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                    >
                      <Languages className="w-4 h-4" />
                      <span className="hidden sm:inline">Languages</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  {/* Profile Tab - Using modular component */}
                  <TabsContent value="profile" className="mt-0">
                    <ProfileTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>

                  {/* Experience Tab - Using modular component */}
                  <TabsContent value="experience" className="mt-0">
                    <ExperienceTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>

                  {/* Education Tab - Using modular component */}
                  <TabsContent value="education" className="mt-0">
                    <EducationTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>

                  {/* Certifications Tab - Using modular component */}
                  <TabsContent value="certifications" className="mt-0">
                    <CertificationsTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>

                  {/* Achievements Tab - Using modular component */}
                  <TabsContent value="achievements" className="mt-0">
                    <AchievementsTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>

                  {/* Languages Tab - Using modular component */}
                  <TabsContent value="languages" className="mt-0">
                    <LanguagesTab 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Local Unsaved Changes Dialog for tab navigation */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        changedSections={changedSections}
        targetDestination={pendingNavigation || ''}
      />
    </>
  );
}