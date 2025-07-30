import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";
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
  Code,
  Briefcase,
  Building,
  Users,
  Star,
  ExternalLink,
  Settings,
  FileText,
  Info
} from "lucide-react";

// Import portfolio templates
import { ClassicPortfolio } from "./portfolios/ClassicPortfolio";
import { ModernTechPortfolio } from "./portfolios/ModernTechPortfolio";
import { CreativePortfolio } from "./portfolios/CreativePortfolio";
import { MinimalistPortfolio } from "./portfolios/MinimalistPortfolio";
import { CorporatePortfolio } from "./portfolios/CorporatePortfolio";

interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    about: string;
    avatar?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;   
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    tags: string[];
    image?: string;
    link?: string;
    status?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    description?: string;
    link?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
}

interface PortfolioViewerProps {
  portfolioData: PortfolioData;
  selectedTemplate: string;
  onTemplateSwitch: (templateId: string) => void;
  onBackToGallery: () => void;
  onEditProfile: () => void;
  isPreviewMode?: boolean;
  user?: any;
}

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

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const renderTemplate = () => {
    const commonProps = {
      data: portfolioData,
      viewMode
    };

    switch (selectedTemplate) {
      case 'modern-tech':
        return <ModernTechPortfolio {...commonProps} />;
      case 'creative':
        return <CreativePortfolio {...commonProps} />;
      case 'minimalist':
        return <MinimalistPortfolio {...commonProps} />;
      case 'corporate':
        return <CorporatePortfolio {...commonProps} />;
      case 'classic':
        return <ClassicPortfolio {...commonProps} />;
      default:
        return <ClassicPortfolio {...commonProps} />;
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_portfolio_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
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
            className="bg-white/90 backdrop-blur-sm"
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
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  {currentTemplate && <currentTemplate.icon className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{currentTemplate?.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {isPreviewMode ? 'Preview Mode' : `${portfolioData.personalInfo.name}'s Portfolio`}
                  </p>
                </div>
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
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => onTemplateSwitch(template.id)}
                      className={`flex items-center gap-3 ${
                        template.id === selectedTemplate ? 'bg-primary/10' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <template.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.category}</p>
                      </div>
                      {template.id === selectedTemplate && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {(() => {
                      const IconComponent = getViewModeIcon();
                      return <IconComponent className="w-4 h-4 mr-2" />;
                    })()}
                    {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewMode('desktop')}>
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                    {viewMode === 'desktop' && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('tablet')}>
                    <Tablet className="w-4 h-4 mr-2" />
                    Tablet
                    {viewMode === 'tablet' && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('mobile')}>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                    {viewMode === 'mobile' && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
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
                  <DropdownMenuItem onClick={() => alert('Share functionality coming soon!')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Portfolio
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Area */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-8">
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
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${getViewModeStyles()}`}
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
                      {currentTemplate && <currentTemplate.icon className="w-5 h-5 text-primary" />}
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
                      <Button variant="outline" size="sm" onClick={() => alert('Coming soon!')}>
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