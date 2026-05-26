import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Palette,
  Code,
  Briefcase,
  Users,
  Building,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import styles from "./PortfolioGallery.module.css";

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
          <div className={styles.badgePill}>
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
              <Card className={styles.profileCompleteCard}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={styles.greenGradientIcon}>
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
              <Card className={styles.profileIncompleteCard}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={styles.orangeGradientIcon}>
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
                      className={styles.orangeGradientButton}
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
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              categoryIcon={getCategoryIcon(template.category)}
              styles={styles}
              user={user}
              isProfileComplete={isProfileComplete}
              onTemplateAction={handleTemplateAction}
              onNavigate={onNavigate}
            />
          ))}
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
