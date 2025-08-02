import { useState, useEffect, useCallback } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { ProfilePage } from "./components/ProfilePage";
import { PortfolioViewer } from "./components/PortfolioViewer";
import { ChatWidget } from "./components/ChatWidget";
import type { User, PortfolioData } from "./types/portfolio";
import { portfolioDataManager } from "./utils/portfolioDataManager";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedSections, setChangedSections] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
        user={user}
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigate} 
          user={user} 
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onNavigate={handleNavigate} 
          onLogin={handleLogin} 
        />
      )}
      
      {currentPage === 'signup' && (
        <SignupPage 
          onNavigate={handleNavigate} 
          onSignup={handleSignup} 
        />
      )}
      
      {currentPage === 'portfolios' && (
        <PortfolioGallery 
          onNavigate={handleNavigate} 
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
          onEditProfile={() => handleNavigate('profile')}
          isPreviewMode={isPreviewMode}
          user={user}
        />
      )}
      
      {currentPage === 'profile' && user && (
        <ProfilePage 
          user={user} 
          onNavigate={handleNavigate} 
          onUpdateProfile={handleUpdateProfile}
          onProfileChange={handleProfileChange}
          hasUnsavedChanges={hasUnsavedChanges}
          changedSections={changedSections}
        />
      )}
      
      {/* Global Chat Widget */}
      <ChatWidget />
    </div>
  );
}