import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { Download, Share2, Eye, Star, ExternalLink, Info, Wand2 } from "lucide-react";
import { ViewerToolbar } from "./ViewerToolbar";
import { TEMPLATES } from "../portfolios/registry";
import { PortfolioRenderer } from "../portfolios/PortfolioRenderer";
import { PortfolioBuilder } from "../builder/PortfolioBuilder";
import { resolveConfig } from "../portfolios/config/store";
import type { PortfolioConfig } from "../portfolios/config/types";
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

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/_+/g, "_") || "portfolio";

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
  const [customizing, setCustomizing] = useState(false);
  const [config, setConfig] = useState<PortfolioConfig>(() =>
    resolveConfig(user?.id, selectedTemplate),
  );

  // Reload the saved/preset config whenever the template (or user) changes, and
  // drop out of customize mode so we don't edit a stale layout.
  useEffect(() => {
    setConfig(resolveConfig(user?.id, selectedTemplate));
    setCustomizing(false);
  }, [selectedTemplate, user?.id]);

  const currentTemplate = useMemo(
    () => TEMPLATES.find(t => t.id === selectedTemplate),
    [selectedTemplate],
  );

  const renderTemplate = () => <PortfolioRenderer data={portfolioData} config={config} />;

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
        templates={TEMPLATES}
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
          {customizing ? (
            <PortfolioBuilder
              data={portfolioData}
              config={config}
              onChange={setConfig}
              user={user}
              onClose={() => setCustomizing(false)}
            />
          ) : (
          <>
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
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => setCustomizing(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
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
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Container — bounded scroll box so the portfolio's own
              sticky nav pins correctly. A clipping/transform card (the old
              setup) silently breaks `position: sticky`. */}
          <motion.div
            key={selectedTemplate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`rounded-lg border border-border shadow-sm overflow-hidden bg-card ${getViewModeStyles()}`}
          >
            <div className="h-[calc(100vh-13rem)] overflow-y-auto">
              {renderTemplate()}
            </div>
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
          </>
          )}
        </div>
      </div>
    </div>
  );
}
