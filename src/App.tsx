import { useState, useEffect, useCallback } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { ProfilePage } from "./components/ProfilePage";
import { PortfolioViewer } from "./components/PortfolioViewer";
import { ChatWidget } from "./components/ChatWidget";
import { UnsavedChangesDialog } from "./components/UnsavedChangesDialog";
import type { User, PortfolioData } from "./types/portfolio";
import { portfolioDataManager } from "./utils/portfolioDataManager";
// import { initScrollbarFixes } from "./utils/scrollbarFix";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedSections, setChangedSections] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Unsaved changes dialog state
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // // Initialize scrollbar fixes on app mount
  // useEffect(() => {
  //   const cleanup = initScrollbarFixes();
  //   return cleanup;
  // }, []);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = portfolioDataManager.loadUserData('current-user');
    if (savedUser) {
      setUser(savedUser);
      console.log('Loaded user data from localStorage:', savedUser);
    }
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  // Handle navigation requests with unsaved changes check
  const handleNavigationRequest = useCallback((page: string) => {
    // If we're on the profile page and have unsaved changes, show dialog
    if (currentPage === 'profile' && hasUnsavedChanges) {
      setPendingNavigation(page);
      setShowUnsavedDialog(true);
    } else {
      // Navigate directly if no unsaved changes
      handleNavigate(page);
    }
  }, [currentPage, hasUnsavedChanges, handleNavigate]);

  // Handle saving changes and navigation
  const handleDialogSave = useCallback(() => {
    // The ProfilePage component should handle the actual saving
    // We'll trigger this through the ProfilePage's save function
    setShowUnsavedDialog(false);
    
    if (pendingNavigation) {
      handleNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, handleNavigate]);

  // Handle discarding changes and navigation
  const handleDialogDiscard = useCallback(() => {
    setHasUnsavedChanges(false);
    setChangedSections([]);
    setShowUnsavedDialog(false);
    
    if (pendingNavigation) {
      handleNavigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, handleNavigate]);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  }, []);

  const handleTemplateSelect = useCallback((templateId: string) => {
    if (user && portfolioDataManager.isProfileComplete(user)) {
      const data = portfolioDataManager.generateFromUser(user);
      setPortfolioData(data);
      setSelectedTemplate(templateId);
      setIsPreviewMode(false);
      setCurrentPage('portfolio-viewer');
      console.log('Generated portfolio data from user:', data);
    }
  }, [user]);

  const handleTemplatePreview = useCallback((templateId: string) => {
    const dummyData = portfolioDataManager.getDummyData(templateId);
    setPortfolioData(dummyData);
    setSelectedTemplate(templateId);
    setIsPreviewMode(true);
    setCurrentPage('portfolio-viewer');
    console.log('Using dummy data for preview:', dummyData);
  }, []);

  const handleTemplateSwitch = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    if (isPreviewMode) {
      // Update with new dummy data when in preview mode
      const dummyData = portfolioDataManager.getDummyData(templateId);
      setPortfolioData(dummyData);
    } else if (user) {
      // Update with user data when not in preview mode
      const userData = portfolioDataManager.generateFromUser(user);
      setPortfolioData(userData);
    }
  }, [isPreviewMode, user]);

  const handleBackToGallery = useCallback(() => {
    setCurrentPage('portfolios');
    setSelectedTemplate(null);
    setPortfolioData(null);
    setIsPreviewMode(false);
  }, []);

  const handleLogin = useCallback((userData: User) => {
    setUser(userData);
    portfolioDataManager.saveUserData(userData);
    setCurrentPage('profile'); // Navigate to profile after login
  }, []);

  const handleSignup = useCallback((userData: User) => {
    setUser(userData);
    portfolioDataManager.saveUserData(userData);
    setCurrentPage('profile'); // Navigate to profile after signup
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage('home');
    setHasUnsavedChanges(false);
    setChangedSections([]);
    setSelectedTemplate(null);
    setPortfolioData(null);
    setIsPreviewMode(false);
    // Clear localStorage data
    localStorage.removeItem('portfolio_user_data');
    localStorage.removeItem('portfolio_exported_data');
  }, []);

  const handleUpdateProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setHasUnsavedChanges(false);
    setChangedSections([]);
    
    // Save to localStorage using data manager
    portfolioDataManager.saveUserData(updatedUser);
    
    // Update portfolio data if we're currently viewing a portfolio and not in preview mode
    if (currentPage === 'portfolio-viewer' && !isPreviewMode && portfolioDataManager.isProfileComplete(updatedUser)) {
      const newData = portfolioDataManager.generateFromUser(updatedUser);
      setPortfolioData(newData);
    }
  }, [currentPage, isPreviewMode]);

  const handleProfileChange = useCallback((sections: string[]) => {
    setHasUnsavedChanges(sections.length > 0);
    setChangedSections(sections);
  }, []);

  // Special handler for ProfilePage that includes saving functionality
  const handleProfileNavigationRequest = useCallback((destination: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(destination);
      setShowUnsavedDialog(true);
    } else {
      if (destination.includes('Tab')) {
        // This is handled within ProfilePage for tab navigation
        return;
      } else {
        // Handle page navigation
        handleNavigate(destination);
      }
    }
  }, [hasUnsavedChanges, handleNavigate]);

  // Add beforeunload listener for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onNavigationRequest={handleNavigationRequest}
        user={user}
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigationRequest} 
          user={user} 
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onNavigate={handleNavigationRequest} 
          onLogin={handleLogin} 
        />
      )}
      
      {currentPage === 'signup' && (
        <SignupPage 
          onNavigate={handleNavigationRequest} 
          onSignup={handleSignup} 
        />
      )}
      
      {currentPage === 'portfolios' && (
        <PortfolioGallery 
          onNavigate={handleNavigationRequest} 
          user={user}
          onTemplateSelect={handleTemplateSelect}
          onTemplatePreview={handleTemplatePreview}
          isProfileComplete={user ? portfolioDataManager.isProfileComplete(user) : false}
        />
      )}
      
      {currentPage === 'portfolio-viewer' && portfolioData && selectedTemplate && (
        <PortfolioViewer
          portfolioData={portfolioData}
          selectedTemplate={selectedTemplate}
          onTemplateSwitch={handleTemplateSwitch}
          onBackToGallery={handleBackToGallery}
          onEditProfile={() => handleNavigationRequest('profile')}
          isPreviewMode={isPreviewMode}
          user={user}
        />
      )}
      
      {currentPage === 'profile' && user && (
        <ProfilePage 
          user={user} 
          onNavigate={handleProfileNavigationRequest} 
          onUpdateProfile={handleUpdateProfile}
          onProfileChange={handleProfileChange}
          hasUnsavedChanges={hasUnsavedChanges}
          changedSections={changedSections}
        />
      )}

      {/* Global Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        changedSections={changedSections}
        targetDestination={pendingNavigation || ''}
      />
      
      {/* Global Chat Widget */}
      <ChatWidget />
    </div>
  );
}
