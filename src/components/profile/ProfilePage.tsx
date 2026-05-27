import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTab } from "./ProfileTab";
import { ExperienceTab } from "./ExperienceTab";
import { EducationTab } from "./EducationTab";
import { CertificationsTab } from "./CertificationsTab";
import { AchievementsTab } from "./AchievementsTab";
import { LanguagesTab } from "./LanguagesTab";
import {
  validateUserForSave,
  getProfileCompleteness,
} from "../../lib/validators/user";
import type { User } from "../../types/portfolio";
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

  // Profile completeness is computed from a single source of truth so the
  // progress bar here, the "View Templates" gate, and PortfolioGallery's
  // "Use This Template" button can never disagree. See validators/user.ts.
  const { percent: profileCompleteness, missingFields } = useMemo(
    () => getProfileCompleteness(formData),
    [formData],
  );

  // Change detection. Short-circuits on referential identity first (very
  // common: formData and originalData share array references until something
  // is edited), then falls back to a single JSON serialization per section.
  //
  // Old impl ran 7 × `JSON.stringify` on every keystroke — for users with 30+
  // experience entries that was real CPU. The referential check makes the
  // common "haven't touched section X yet" path near-free.
  const detectedChanges = useMemo(() => {
    const changes: string[] = [];

    const personalChanged =
      formData.name !== originalData.name ||
      formData.title !== originalData.title ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.location !== originalData.location ||
      formData.about !== originalData.about ||
      formData.avatar !== originalData.avatar ||
      formData.coverImage !== originalData.coverImage;
    if (personalChanged) changes.push('Personal Information');

    const sections: Array<{ key: keyof User; label: string }> = [
      { key: 'skills', label: 'Skills' },
      { key: 'projects', label: 'Projects' },
      { key: 'experience', label: 'Experience' },
      { key: 'education', label: 'Education' },
      { key: 'certifications', label: 'Certifications' },
      { key: 'achievements', label: 'Achievements' },
      { key: 'languages', label: 'Languages' },
      { key: 'cv', label: 'CV/Resume' },
    ];
    for (const { key, label } of sections) {
      const next = formData[key];
      const prev = originalData[key];
      if (next === prev) continue; // ref-equal → unchanged
      // Different refs but possibly equal content (e.g. user typed then
      // reverted): fall back to structural compare. Stringify is fine here
      // because we know the values differ by reference.
      if (JSON.stringify(next ?? null) !== JSON.stringify(prev ?? null)) {
        changes.push(label);
      }
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

  /**
   * Try to persist the current form. Required-fields are checked against the
   * same policy the backend enforces (see `src/lib/validators/user.ts`). If
   * anything is missing we:
   *   1. Switch to the first offending tab so the user sees the relevant inputs.
   *   2. Surface every error as a toast.
   *   3. Return `false` and skip the network call.
   *
   * Returns `true` when the save was actually dispatched.
   */
  const handleSave = useCallback((): boolean => {
    const { ok, errors } = validateUserForSave(formData);
    if (!ok) {
      const firstTab = errors[0]?.tab;
      // `projects` lives inside the Profile tab in this UI — fall back there.
      const tabMap: Record<string, string> = {
        profile: "profile",
        projects: "profile",
        experience: "experience",
        education: "education",
        certifications: "certifications",
        achievements: "achievements",
        languages: "languages",
      };
      if (firstTab && tabMap[firstTab]) {
        setActiveTab(tabMap[firstTab]);
      }

      // Show the first few errors prominently; collapse the rest into a count
      // so the toast doesn't become a wall of text.
      const head = errors.slice(0, 3).map((e) => `• ${e.message}`).join("\n");
      const more = errors.length > 3 ? `\n…and ${errors.length - 3} more` : "";
      toast.error("Please fix the highlighted fields before saving.", {
        description: head + more,
        duration: 8000,
      });
      return false;
    }

    onUpdateProfile(formData);
    setOriginalData(formData);
    return true;
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
    // If validation fails inside `handleSave`, keep the user on the profile
    // page so they can fix the errors instead of silently navigating away.
    const saved = handleSave();
    if (!saved) {
      setShowUnsavedDialog(false);
      return;
    }
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
