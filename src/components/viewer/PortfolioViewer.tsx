import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Briefcase,
  Building,
  Users,
  Download,
  Share2,
  Eye,
  Star,
  ExternalLink,
  Info,
} from "lucide-react";
import { ViewerToolbar } from "./ViewerToolbar";

// Lazy-load portfolio templates so we don't ship 5 large layouts on first paint.
const ClassicPortfolio = lazy(() =>
  import("../portfolios/ClassicPortfolio").then(m => ({ default: m.ClassicPortfolio })),
);
const ModernTechPortfolio = lazy(() =>
  import("../portfolios/ModernTechPortfolio").then(m => ({ default: m.ModernTechPortfolio })),
);
const CreativePortfolio = lazy(() =>
  import("../portfolios/CreativePortfolio").then(m => ({ default: m.CreativePortfolio })),
);
const MinimalistPortfolio = lazy(() =>
  import("../portfolios/MinimalistPortfolio").then(m => ({ default: m.MinimalistPortfolio })),
);
const CorporatePortfolio = lazy(() =>
  import("../portfolios/CorporatePortfolio").then(m => ({ default: m.CorporatePortfolio })),
);
import type { PortfolioData, User } from "../../types/portfolio";
import styles from "./PortfolioViewer.module.css";

interface PortfolioViewerProps {
  portfolioData: PortfolioData;
  selectedTemplate: string;
  onTemplateSwitch: (templateId: string) => void;
  onBackToGallery: () => void;
  onEditProfile: () => void;
  isPreviewMode?: boolean;
  user?: User | null;
}

const TemplateFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/_+/g, "_") || "portfolio";

const templates = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'Technology',
    icon: Code,
    description: 'Perfect for developers and tech professionals'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    category: 'Creative',
    icon: Palette,
    description: 'Showcase your creative work with style'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Pro',
    category: 'Professional',
    icon: Briefcase,
    description: 'Clean and professional design'
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    category: 'Business',
    icon: Building,
    description: 'Professional template for business'
  },
  {
    id: 'classic',
    name: 'Classic Portfolio',
    category: 'Traditional',
    icon: Users,
    description: 'Timeless design that never goes out of style'
  }
];

export function PortfolioViewer({
  portfolioData,
  selectedTemplate,
  onTemplateSwitch,
  onBackToGallery,
  onEditProfile,
  isPreviewMode = false,
  user
}: PortfolioViewerProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTemplate = useMemo(
    () => templates.find(t => t.id === selectedTemplate),
    [selectedTemplate],
  );

  const renderTemplate = () => {
    const commonProps = { data: portfolioData, viewMode };

    const Template = (() => {
      switch (selectedTemplate) {
        case 'modern-tech': return ModernTechPortfolio;
        case 'creative': return CreativePortfolio;
        case 'minimalist': return MinimalistPortfolio;
        case 'corporate': return CorporatePortfolio;
        case 'classic':
        default: return ClassicPortfolio;
      }
    })();

    return (
      <Suspense fallback={<TemplateFallback />}>
        <Template {...commonProps} />
      </Suspense>
    );
  };

  const handleExportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(portfolioData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const fileName = `${sanitizeFileName(portfolioData.personalInfo.name)}_portfolio_data.json`;

      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.download = fileName;
      linkElement.rel = 'noopener';
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      URL.revokeObjectURL(url);

      toast.success('Portfolio exported');
    } catch (error) {
      console.error('Failed to export portfolio data:', error);
      toast.error('Failed to export portfolio');
    }
  }, [portfolioData]);

  const handleShare = useCallback(() => {
    toast.info('Sharing is coming soon');
  }, []);

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-3xl mx-auto';
      default:
        return 'w-full';
    }
  };

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-background">
        {/* Fullscreen Exit Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setIsFullscreen(false)}
            variant="outline"
            size="sm"
            className={styles.exitFullscreenButton}
          >
            <Eye className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
        
        {/* Portfolio Content */}
        <div className={getViewModeStyles()}>
          {renderTemplate()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <ViewerToolbar
        currentTemplate={currentTemplate}
        selectedTemplate={selectedTemplate}
        isPreviewMode={isPreviewMode}
        user={user}
        viewMode={viewMode}
        portfolioData={portfolioData}
        templates={templates}
        onBackToGallery={onBackToGallery}
        onTemplateSwitch={onTemplateSwitch}
        onEditProfile={onEditProfile}
        setViewMode={setViewMode}
        setIsFullscreen={setIsFullscreen}
        handleExportData={handleExportData}
        styles={styles}
      />

      {/* Template Preview Area */}
      <div className={styles.previewArea}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`border-2 ${
              isPreviewMode 
                ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20' 
                : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                    isPreviewMode 
                      ? 'from-purple-500 to-pink-500' 
                      : 'from-blue-500 to-purple-500'
                  } flex items-center justify-center`}>
                    {isPreviewMode ? <Info className="w-5 h-5 text-white" /> : <Star className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isPreviewMode 
                        ? 'text-purple-800 dark:text-purple-200' 
                        : 'text-blue-800 dark:text-blue-200'
                    }`}>
                      {isPreviewMode ? 'Template Preview' : 'Portfolio Preview'}
                    </h3>
                    <p className={`text-sm ${
                      isPreviewMode 
                        ? 'text-purple-700 dark:text-purple-300' 
                        : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {isPreviewMode 
                        ? `This is a preview of the ${currentTemplate?.name} template with sample data. ${user ? 'Complete your profile and upload your data to see your actual information here.' : 'Sign up and create a profile to upload your own data.'}`
                        : `This is how your portfolio looks with the ${currentTemplate?.name} template. Switch templates above to see your data in different designs.`
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsFullscreen(true)}
                    className={`${
                      isPreviewMode 
                        ? 'border-purple-200 text-purple-700 hover:bg-purple-100' 
                        : 'border-blue-200 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Fullscreen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Container */}
          <motion.div
            key={selectedTemplate}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`${styles.portfolioContainer} ${getViewModeStyles()}`}
          >
            {renderTemplate()}
          </motion.div>

          {/* Template Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 mb-16"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Current Template</h4>
                    <div className="flex items-center gap-3">
                      {currentTemplate && (() => {
                        const CurrentIcon = currentTemplate.icon;
                        return <CurrentIcon className="w-5 h-5 text-primary" />;
                      })()}
                      <div>
                        <p className="font-medium">{currentTemplate?.name}</p>
                        <p className="text-sm text-muted-foreground">{currentTemplate?.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Data Source</h4>
                    <p className="text-sm text-muted-foreground">
                      {isPreviewMode 
                        ? 'Preview mode with sample data.' 
                        : 'Your profile data is automatically synced.'
                      }
                      {!isPreviewMode && user && (
                        <Button variant="link" onClick={onEditProfile} className="p-0 ml-1 h-auto">
                          Edit profile data
                        </Button>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
