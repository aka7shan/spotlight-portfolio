import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Share2, Star, ExternalLink, Info, Wand2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
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

  // True fullscreen: an overlay above the app's global (fixed) navbar so the
  // template — including its own sticky section nav — fills the screen. The
  // exit control floats bottom-right where it can't collide with that nav.
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[60] bg-background overflow-y-auto overscroll-contain">
        {renderTemplate()}
        <Button
          onClick={() => setIsFullscreen(false)}
          size="sm"
          className="fixed bottom-5 right-5 z-[61] gap-2 rounded-full px-4 shadow-lg bg-foreground text-background hover:opacity-90"
        >
          <Minimize2 className="w-4 h-4" />
          Exit fullscreen
        </Button>
      </div>
    );
  }

  const previewNote = isPreviewMode
    ? `Sample data on the ${currentTemplate?.name} template. Complete your profile to see your own.`
    : `Your data on the ${currentTemplate?.name} template. Switch templates from the top bar.`;

  return (
    // App-shell: pinned below the global navbar (h-16) so the page itself never
    // scrolls — only the preview does. This kills the old double/outer scroll.
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-muted/20">
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

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Meta panel — short strip on top (mobile), sidebar on the left (desktop) */}
        <aside className="shrink-0 w-full lg:w-80 xl:w-96 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-card p-3 sm:p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r",
                isPreviewMode ? "from-purple-500 to-pink-500" : "from-blue-500 to-purple-500",
              )}
            >
              {isPreviewMode ? <Info className="w-4 h-4 text-white" /> : <Star className="w-4 h-4 text-white" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-tight">
                {isPreviewMode ? "Template Preview" : "Portfolio Preview"}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{previewNote}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => setCustomizing(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            >
              <Wand2 className="w-4 h-4 mr-1.5" />
              Customize
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsFullscreen(true)}>
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Fullscreen
            </Button>
          </div>

          {/* Template details — hidden on the smallest screens to stay short */}
          <div className="hidden sm:block rounded-lg border border-border p-3 space-y-3">
            <div className="flex items-center gap-2.5">
              {currentTemplate && (() => {
                const CurrentIcon = currentTemplate.icon;
                return (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CurrentIcon className="w-4 h-4 text-primary" />
                  </div>
                );
              })()}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{currentTemplate?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTemplate?.category}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {isPreviewMode ? "Preview mode with sample data." : "Your profile data is synced automatically."}
              {!isPreviewMode && user && (
                <Button variant="link" onClick={onEditProfile} className="p-0 ml-1 h-auto text-xs align-baseline">
                  Edit data
                </Button>
              )}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-1.5" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </aside>

        {/* Preview — fills remaining space; only this scrolls */}
        <main className="flex-1 min-w-0 min-h-0 p-2 sm:p-3 lg:p-4">
          <motion.div
            key={selectedTemplate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "h-full mx-auto rounded-xl border border-border shadow-sm overflow-hidden bg-card",
              getViewModeStyles(),
            )}
          >
            <div className="h-full overflow-y-auto">{renderTemplate()}</div>
          </motion.div>
        </main>
      </div>

      {customizing && (
        <PortfolioBuilder
          data={portfolioData}
          config={config}
          onChange={setConfig}
          user={user}
          onClose={() => setCustomizing(false)}
        />
      )}
    </div>
  );
}
