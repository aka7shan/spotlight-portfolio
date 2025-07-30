import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Palette, 
  Code, 
  Briefcase, 
  Users, 
  Building,
  Upload,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PortfolioGalleryProps {
  onNavigate: (page: string) => void;
  user?: any;
  onTemplateSelect: (templateId: string) => void;
  onTemplatePreview: (templateId: string) => void;
  isProfileComplete: boolean;
}

const portfolioTemplates = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Perfect for developers and tech professionals',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    category: 'Technology',
    bestFor: 'Developers, Engineers, Tech Leads',
    features: ['Dark mode', 'Code showcase', 'GitHub integration', 'Tech stack display'],
    price: 'Free',
    rating: 4.9,
    reviews: 234,
    preview: 'modern-tech'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Showcase your creative work with style',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    category: 'Creative',
    bestFor: 'Designers, Artists, Photographers',
    features: ['Gallery layouts', 'Animation effects', 'Portfolio showcase', 'Client testimonials'],
    price: 'Free',
    rating: 4.8,
    reviews: 189,
    preview: 'creative'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Pro',
    description: 'Clean and professional design',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
    category: 'Professional',
    bestFor: 'Consultants, Writers, Professionals',
    features: ['Clean design', 'Typography focus', 'Fast loading', 'Mobile optimized'],
    price: 'Free',
    rating: 4.7,
    reviews: 156,
    preview: 'minimalist'
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    description: 'Professional template for business',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    category: 'Business',
    bestFor: 'Executives, Managers, Business Professionals',
    features: ['Business focused', 'Team showcase', 'Service highlights', 'Contact forms'],
    price: 'Free',
    rating: 4.6,
    reviews: 198,
    preview: 'corporate'
  },
  {
    id: 'classic',
    name: 'Classic Portfolio',
    description: 'Timeless design that never goes out of style',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    category: 'Traditional',
    bestFor: 'All Professionals, Versatile Use',
    features: ['Timeless design', 'Versatile layout', 'Easy customization', 'Professional look'],
    price: 'Free',
    rating: 4.5,
    reviews: 167,
    preview: 'classic'
  }
];

const categories = ['All', 'Technology', 'Creative', 'Professional', 'Business', 'Traditional'];

export function PortfolioGallery({ onNavigate, user, onTemplateSelect, onTemplatePreview, isProfileComplete }: PortfolioGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = portfolioTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.bestFor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology': return Code;
      case 'Creative': return Palette;
      case 'Professional': return Briefcase;
      case 'Business': return Building;
      case 'Traditional': return Users;
      default: return Star;
    }
  };

  const handleTemplateAction = (templateId: string, action: 'preview' | 'upload') => {
    if (action === 'upload' && user && isProfileComplete) {
      onTemplateSelect(templateId);
    } else if (action === 'preview') {
      onTemplatePreview(templateId);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Choose Your Template</span>
          </div>
          
          <h1 className="mb-4">Beautiful Portfolio Templates</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose from our collection of professionally designed templates. 
            {user && isProfileComplete 
              ? " Upload your data instantly to any template!" 
              : user 
                ? " Complete your profile to upload your data to templates."
                : " Sign up to save your favorite templates and get started."}
          </p>
        </motion.div>

        {/* Profile Status Banner for Authenticated Users */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {isProfileComplete ? (
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                        Profile Complete! 🎉
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your profile is ready! Click "Upload Data" on any template to see your information beautifully displayed.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <Sparkles className="w-4 h-4" />
                      <span>Ready to upload</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                          Complete Your Profile
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Add your experience, education, and skills to unlock data upload functionality.
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onNavigate('profile')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates by name or best for..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => {
            const IconComponent = getCategoryIcon(template.category);
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl overflow-hidden">
                  {/* Template Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Category Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm"
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {template.category}
                    </Badge>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{template.rating}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {template.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {template.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Best For */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">BEST FOR</p>
                      <p className="text-sm text-foreground">{template.bestFor}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">FEATURES</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs py-0.5">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs py-0.5">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${
                              star <= Math.floor(template.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span>({template.reviews} reviews)</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateAction(template.id, 'preview')}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      
                      {user && isProfileComplete ? (
                        <Button
                          size="sm"
                          onClick={() => handleTemplateAction(template.id, 'upload')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Data
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => user ? onNavigate('profile') : onNavigate('signup')}
                          className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                          disabled={!user}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {user ? 'Complete Profile' : 'Sign Up First'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or category filter
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}