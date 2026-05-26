import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Palette,
  Download,
  Share2,
  Edit3,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PortfolioData, User } from "../../types/portfolio";

export interface ViewerToolbarTemplate {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
}

export interface ViewerToolbarStyles {
  topBar?: string;
  templateIcon?: string;
  [key: string]: string | undefined;
}

export interface ViewerToolbarProps {
  currentTemplate: ViewerToolbarTemplate | undefined;
  selectedTemplate: string;
  isPreviewMode: boolean;
  user?: User | null;
  viewMode: "desktop" | "tablet" | "mobile";
  portfolioData: PortfolioData;
  templates: ViewerToolbarTemplate[];
  onBackToGallery: () => void;
  onTemplateSwitch: (templateId: string) => void;
  onEditProfile: () => void;
  setViewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setIsFullscreen: (value: boolean) => void;
  handleExportData: () => void;
  styles: ViewerToolbarStyles;
}

function getViewModeIcon(viewMode: "desktop" | "tablet" | "mobile") {
  switch (viewMode) {
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Monitor;
  }
}

export function ViewerToolbar({
  currentTemplate,
  selectedTemplate,
  isPreviewMode,
  user,
  viewMode,
  portfolioData,
  templates,
  onBackToGallery,
  onTemplateSwitch,
  onEditProfile,
  setViewMode,
  setIsFullscreen,
  handleExportData,
  styles,
}: ViewerToolbarProps) {
  const ViewModeIcon = getViewModeIcon(viewMode);

  return (
    <div className={styles.topBar}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button and template info */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBackToGallery}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>

            <div className="hidden sm:flex items-center gap-3">
              {currentTemplate && (() => {
                const CurrentTemplateIcon = currentTemplate.icon;
                return (
                  <>
                    <div className={styles.templateIcon}>
                      <CurrentTemplateIcon className="w-4 h-4 text-white" />
                    </div>
                  <div>
                    <h1 className="text-lg font-semibold">
                      {currentTemplate.name}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {isPreviewMode
                        ? "Preview Mode"
                        : `${portfolioData.personalInfo.name}'s Portfolio`}
                    </p>
                  </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Template Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Switch Template
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {templates.map((template) => {
                  const TemplateIcon = template.icon;
                  return (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => onTemplateSwitch(template.id)}
                      className={`flex items-center gap-3 ${
                        template.id === selectedTemplate ? "bg-primary/10" : ""
                      }`}
                    >
                      <div
                        className={`${styles.templateIcon} rounded`}
                      >
                        <TemplateIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.category}
                        </p>
                      </div>
                      {template.id === selectedTemplate && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ViewModeIcon className="w-4 h-4 mr-2" />
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode("desktop")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                  {viewMode === "desktop" && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("tablet")}>
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                  {viewMode === "tablet" && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("mobile")}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                  {viewMode === "mobile" && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsFullscreen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Fullscreen Preview
                </DropdownMenuItem>
                {!isPreviewMode && user && (
                  <DropdownMenuItem onClick={onEditProfile}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile Data
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Portfolio Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Sharing is coming soon")}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Portfolio
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
