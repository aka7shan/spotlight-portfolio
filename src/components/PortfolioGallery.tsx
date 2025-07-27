import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { motion,AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Download, 
  Star, 
  Users, 
  Palette, 
  Code, 
  Building, 
  Briefcase, 
  BookOpen,
  Search,
  X,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { MinimalistPortfolio } from "./portfolios/MinimalistPortfolio";
import { CreativePortfolio } from "./portfolios/CreativePortfolio";
import { CorporatePortfolio } from "./portfolios/CorporatePortfolio";
import { ModernTechPortfolio } from "./portfolios/ModernTechPortfolio";
import { ClassicPortfolio } from "./portfolios/ClassicPortfolio";

interface PortfolioGalleryProps {
  onNavigate: (page: string) => void;
}

// Sample data for demonstration
const sampleData = {
  name: "Alex Johnson",
  title: "Senior Product Designer",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  about: "Passionate product designer with 7+ years of experience creating user-centered digital experiences. I specialize in transforming complex problems into intuitive, beautiful, and functional designs that users love and businesses value.",
  skills: ["UI/UX Design", "Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems", "React", "HTML/CSS", "JavaScript", "Product Strategy", "Agile Development"],
  experience: [
    {
      company: "TechCorp Solutions",
      position: "Senior Product Designer",
      duration: "2021 - Present",
      description: "Leading design initiatives for enterprise SaaS products, collaborating with cross-functional teams to deliver user-centered solutions that improved customer satisfaction by 40% and reduced support tickets by 30%."
    },
    {
      company: "Design Studio Inc.",
      position: "Product Designer",
      duration: "2019 - 2021",
      description: "Designed mobile and web applications for diverse clients, conducted user research and usability testing, established design systems that improved team efficiency by 50%."
    },
    {
      company: "StartupXYZ",
      position: "Junior Designer",
      duration: "2017 - 2019",
      description: "Created brand identities, marketing materials, and digital experiences for early-stage startups, gaining expertise in rapid prototyping and iterative design processes."
    }
  ],
  projects: [
    {
      name: "Healthcare Dashboard",
      description: "Comprehensive dashboard for healthcare professionals to track patient data, analytics, and treatment outcomes with intuitive data visualization.",
      tags: ["Healthcare", "Dashboard", "Data Visualization", "React"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      link: "https://example.com/healthcare-dashboard"
    },
    {
      name: "E-learning Platform",
      description: "Interactive learning platform with gamification elements, progress tracking, and collaborative features for remote education.",
      tags: ["Education", "Gamification", "Mobile", "Web"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      link: "https://example.com/elearning-platform"
    },
    {
      name: "Financial App",
      description: "Personal finance management app with budgeting tools, expense tracking, and investment portfolio management.",
      tags: ["Fintech", "Mobile App", "Data Analytics", "Security"],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
      link: "https://example.com/financial-app"
    },
    {
      name: "Smart Home Interface",
      description: "Intuitive control interface for smart home devices with voice integration and automated scheduling capabilities.",
      tags: ["IoT", "Voice UI", "Smart Home", "Mobile"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      link: "https://example.com/smart-home"
    }
  ]
};

const portfolioTemplates = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and elegant design with focus on content",
    component: MinimalistPortfolio,
    category: "Professional",
    icon: Palette,
    thumbnail: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&h=300&fit=crop&crop=center",
    features: ["Smooth scrolling", "Contact form", "Project galleries"],
    bestFor: "Designers, Architects, Writers",
    popularity: 95,
    gradient: "from-gray-500 to-gray-700",
    bgColor: "bg-gray-50"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant and artistic with dynamic animations",
    component: CreativePortfolio,
    category: "Creative",
    icon: Sparkles,
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
    features: ["Gradient backgrounds", "Interactive cards", "Animations"],
    bestFor: "Artists, Designers, Photographers",
    popularity: 88,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50"
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional structured design with sidebar navigation",
    component: CorporatePortfolio,
    category: "Business",
    icon: Building,
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center",
    features: ["Sidebar navigation", "Dark/light mode", "Professional"],
    bestFor: "Executives, Consultants, Managers",
    popularity: 92,
    gradient: "from-blue-600 to-blue-800",
    bgColor: "bg-blue-50"
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    description: "Dark theme with code-inspired elements",
    component: ModernTechPortfolio,
    category: "Technology",
    icon: Code,
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center",
    features: ["Terminal interface", "Code highlighting", "Tech design"],
    bestFor: "Developers, Engineers, Tech Leads",
    popularity: 90,
    gradient: "from-green-500 to-cyan-500",
    bgColor: "bg-green-50"
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless elegance with serif fonts",
    component: ClassicPortfolio,
    category: "Traditional",
    icon: BookOpen,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    features: ["Serif typography", "Timeline", "Elegant"],
    bestFor: "Academics, Writers, Professionals",
    popularity: 85,
    gradient: "from-amber-600 to-orange-600",
    bgColor: "bg-amber-50"
  }
];

const categories = [
  { name: "All", icon: Star, count: portfolioTemplates.length },
  { name: "Professional", icon: Briefcase, count: portfolioTemplates.filter(t => t.category === "Professional").length },
  { name: "Creative", icon: Palette, count: portfolioTemplates.filter(t => t.category === "Creative").length },
  { name: "Business", icon: Building, count: portfolioTemplates.filter(t => t.category === "Business").length },
  { name: "Technology", icon: Code, count: portfolioTemplates.filter(t => t.category === "Technology").length },
  { name: "Traditional", icon: BookOpen, count: portfolioTemplates.filter(t => t.category === "Traditional").length }
];

export function PortfolioGallery({ onNavigate }: PortfolioGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter templates based on search query and category
  const filteredTemplates = portfolioTemplates.filter(template => {
    // Category filter
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    
    // Search filter - search in name, bestFor, and description
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (selectedTemplate) {
    const template = portfolioTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      const TemplateComponent = template.component;
      return (
        <div className="relative">
          {/* Back Button */}
          <div className="fixed top-6 left-6 z-[9999]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="outline" 
                onClick={() => setSelectedTemplate(null)}
                className="bg-white/95 backdrop-blur-sm shadow-xl border-2 hover:bg-gray-50 transition-all duration-200 px-6 py-3 font-medium"
              >
                ← Back to Templates
              </Button>
            </motion.div>
          </div>
          
          {/* Use Template Button */}
          <div className="fixed top-6 right-6 z-[9999]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                className="bg-primary/95 hover:bg-primary text-primary-foreground shadow-xl px-6 py-3 font-medium transition-all duration-200"
                onClick={() => {
                  alert(`Selected ${template.name} template! This would redirect to the customization page.`);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Use This Template
              </Button>
            </motion.div>
          </div>

          {/* Template Info */}
          <div className="fixed bottom-6 left-6 z-[9999]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                  <template.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Live Preview
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Interactive
                </Badge>
              </div>
            </motion.div>
          </div>

          <TemplateComponent data={sampleData} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Star className="w-4 h-4 mr-2" />
            Premium Templates
          </Badge>
          <h1 className="mb-4">Choose Your Perfect Template</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Professional, responsive portfolio templates designed to showcase your work beautifully. 
            Each template is fully customizable and ready to use.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Search templates by name, profession, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-lg border-2 focus:border-primary/50 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            {/* Search Results Counter */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center mt-3"
                >
                  <p className="text-sm text-muted-foreground">
                    {filteredTemplates.length === 0 ? (
                      <span className="text-destructive">No templates found for "{searchQuery}"</span>
                    ) : (
                      <>
                        Found <span className="font-medium text-primary">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? 's' : ''} 
                        {searchQuery && <span> matching "{searchQuery}"</span>}
                      </>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="h-12 px-6 transition-all duration-200"
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge 
                    variant="secondary" 
                    className="ml-2 text-xs bg-white/20 text-current border-none"
                  >
                    {category.name === "All" 
                      ? filteredTemplates.length 
                      : portfolioTemplates.filter(t => t.category === category.name && 
                          (searchQuery === "" || 
                           t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase()))).length
                    }
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          {filteredTemplates.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse all categories
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Clear Search
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20 h-full">
                    {/* Template Preview */}
                    <div className="relative overflow-hidden">
                      <div className={`absolute inset-0 ${template.bgColor} opacity-60`} />
                      <img 
                        src={template.thumbnail} 
                        alt={`${template.name} template preview`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Popularity Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`bg-gradient-to-r ${template.gradient} text-white border-none shadow-lg`}>
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {template.popularity}%
                        </Badge>
                      </div>

                      {/* Category Icon */}
                      <div className="absolute top-4 left-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-lg`}>
                          <template.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedTemplate(template.id)}
                            className="bg-white/90 hover:bg-white text-gray-900"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <Button
                            size="sm"
                            onClick={() => {
                              alert(`Selected ${template.name} template!`);
                            }}
                            className={`bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white border-none`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Best For */}
                      <div className="bg-muted/50 rounded-lg p-3 mb-4">
                        <div className="text-xs font-medium text-muted-foreground mb-1">BEST FOR:</div>
                        <p className="text-sm">{template.bestFor}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTemplate(template.id)}
                          className="flex-1 group-hover:border-primary/50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            alert(`Selected ${template.name} template!`);
                          }}
                          className="flex-1"
                        >
                          Use Template
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="mb-4">Ready to Build Your Portfolio?</h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Choose any template above and start customizing with your own content, 
                colors, and personal style. Your professional portfolio is just minutes away!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={() => onNavigate('signup')} className="px-8">
                    <Users className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" onClick={() => onNavigate('home')} className="px-8">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}