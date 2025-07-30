import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  ExternalLink,
  Sparkles,
  Heart,
  Eye,
  Star,
  Calendar,
  Building,
  User,
  Briefcase,
  Folder,
  Send,
  Home,
  Camera,
  Brush,
  Palette,
  Zap,
  Instagram,
  Dribbble,
  Globe,
  Coffee,
  Lightbulb,
  Award,
  PenTool,
  Volume2,
  VolumeX,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { creativeData } from "../../constants/portfolioData";

export function CreativePortfolio({ data, viewMode = 'desktop', isFullscreen = false }: PortfolioProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Use provided data or fallback to dummy data
  const portfolioData = data || creativeData;

  const colorThemes = [
    { name: "Sunset", primary: "from-orange-500 to-pink-500", bg: "from-orange-50 to-pink-50", accent: "orange-500" },
    { name: "Ocean", primary: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", accent: "blue-500" },
    { name: "Forest", primary: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", accent: "green-500" },
    { name: "Purple", primary: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", accent: "purple-500" },
    { name: "Golden", primary: "from-yellow-500 to-orange-500", bg: "from-yellow-50 to-orange-50", accent: "yellow-500" }
  ];

  const currentTheme = colorThemes[currentColorIndex];

  // Magazine-style navigation
  const navigationItems = [
    { id: "home", label: "Cover Story", icon: Home, page: "01" },
    { id: "about", label: "The Artist", icon: User, page: "02" },
    { id: "skills", label: "Toolkit", icon: Palette, page: "03" },
    { id: "projects", label: "Gallery", icon: Camera, page: "04" },
    { id: "experience", label: "Journey", icon: Briefcase, page: "05" },
    { id: "contact", label: "Connect", icon: Send, page: "06" }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentColorIndex((prev) => (prev + 1) % colorThemes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="relative min-h-screen overflow-hidden">
            {/* Dynamic Background */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000`}
              style={{
                backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.8) 0%, transparent 50%)`
              }}
            />
            
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -30, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                  className={`absolute w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full opacity-20`}
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + i * 10}%`
                  }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-8 py-16">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white border-0 px-6 py-2 text-lg`}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {portfolioData.personalInfo.title}
                        </Badge>
                      </motion.div>
                      
                      <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-7xl md:text-8xl font-black leading-none"
                      >
                        <span className="block">CREATIVE</span>
                        <span className={`block bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>
                          VISIONARY
                        </span>
                      </motion.h1>
                      
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className={`h-2 bg-gradient-to-r ${currentTheme.primary} rounded-full`}
                      />
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="text-2xl text-gray-700 leading-relaxed font-light"
                    >
                      {portfolioData.personalInfo.name} - {portfolioData.personalInfo.about}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex gap-6"
                    >
                      <Button 
                        onClick={() => setActiveSection("projects")}
                        size="lg"
                        className={`bg-gradient-to-r ${currentTheme.primary} hover:scale-105 text-white px-8 py-4 rounded-full shadow-xl transition-all duration-300`}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Explore My Art
                      </Button>
                      <Button 
                        onClick={() => setActiveSection("contact")}
                        size="lg" 
                        variant="outline" 
                        className={`border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full transition-all duration-300`}
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Let's Create
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Visual Content */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="relative w-full max-w-lg mx-auto">
                      {/* Main Image */}
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                          className="relative bg-white p-6 rounded-3xl shadow-2xl transform rotate-3"
                        >
                          <div className="aspect-square rounded-2xl overflow-hidden">
                            <ImageWithFallback
                              src={portfolioData.personalInfo.avatar}
                              alt={portfolioData.personalInfo.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>
                        
                        {/* Decorative Elements */}
                        <motion.div
                          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className={`absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <Brush className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <motion.div
                          animate={{ x: [-5, 5, -5], y: [5, -5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                          className={`absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>

                      {/* Stats Cards */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl"
                      >
                        <div className="text-center">
                          <div className={`text-3xl font-bold text-orange-500`}>
                            {portfolioData.projects?.length || 25}+
                          </div>
                          <div className="text-gray-600 text-sm">Projects</div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.7 }}
                        className="absolute -top-8 -left-8 bg-white rounded-2xl p-6 shadow-xl"
                      >
                        <div className="text-center">
                          <div className={`text-3xl font-bold text-orange-500`}>
                            {portfolioData.experience?.length || 8}+
                          </div>
                          <div className="text-gray-600 text-sm">Years</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Color Theme Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="flex justify-center items-center gap-4 mt-16"
                >
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="flex gap-3">
                    {colorThemes.map((theme, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentColorIndex(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.primary} ${
                          index === currentColorIndex ? 'ring-4 ring-gray-400' : ''
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-16`}>
            <div className="max-w-6xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-6xl font-black mb-4">THE ARTIST</h2>
                <div className={`w-24 h-2 bg-gradient-to-r ${currentTheme.primary} mx-auto rounded-full`} />
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">My Creative Journey</h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {portfolioData.personalInfo.about}
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-700">{portfolioData.personalInfo.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">Passionate about visual storytelling</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Coffee className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-700">Fueled by creativity and coffee</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">Creative Philosophy</h3>
                      <div className="space-y-4">
                        {[
                          "Design with purpose and passion",
                          "Every pixel tells a story",
                          "Innovation through collaboration",
                          "Beauty in simplicity"
                        ].map((philosophy, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-3 h-3 bg-gradient-to-r ${currentTheme.primary} rounded-full`} />
                            <span className="text-gray-700 text-lg">{philosophy}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">Awards & Recognition</h3>
                      <div className="space-y-6">
                        {portfolioData.achievements && portfolioData.achievements.length > 0 ? (
                          portfolioData.achievements.map((achievement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-4"
                            >
                              <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mt-1`}>
                                <Award className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                                <p className="text-gray-600 text-sm">{achievement.description}</p>
                                <span className="text-orange-500 text-sm font-medium">{achievement.date}</span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>Achievements and awards will be displayed here</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">Creative Interests</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["Photography", "Illustration", "Typography", "Motion Design", "Branding", "Art Direction"].map((interest, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className={`bg-gradient-to-r ${currentTheme.primary} rounded-xl p-4 text-center text-white shadow-lg cursor-pointer`}
                          >
                            <div className="font-semibold">{interest}</div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-16`}>
            <div className="max-w-6xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-6xl font-black mb-4">CREATIVE TOOLKIT</h2>
                <div className={`w-24 h-2 bg-gradient-to-r ${currentTheme.primary} mx-auto rounded-full`} />
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {[
                  { name: "Design", icon: Palette, skills: portfolioData.skills?.filter(s => s.includes('Design') || s.includes('Brand') || s.includes('Visual')) || [] },
                  { name: "Tools", icon: PenTool, skills: portfolioData.skills?.filter(s => s.includes('Adobe') || s.includes('Figma') || s.includes('Sketch')) || [] },
                  { name: "Creative", icon: Lightbulb, skills: portfolioData.skills?.filter(s => s.includes('Creative') || s.includes('Art') || s.includes('Illustration')) || [] }
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl h-full">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center`}>
                            <category.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{category.name}</h3>
                            <p className="text-gray-600">{category.skills.length} skills</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {category.skills.slice(0, 6).map((skill, skillIndex) => (
                            <motion.div
                              key={skillIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.2) + (skillIndex * 0.1) }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                              <span className="font-medium text-gray-800">{skill}</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < 4 ? 'text-orange-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* All Skills Display */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                  <CardContent className="p-8">
                    <h3 className="text-3xl font-bold mb-8 text-center">Complete Skill Set</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {portfolioData.skills && portfolioData.skills.length > 0 ? (
                        portfolioData.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <Badge 
                              className={`bg-gradient-to-r ${colorThemes[index % colorThemes.length].primary} text-white border-0 px-4 py-2 text-sm`}
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>Skills will be displayed here once added to your profile</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-16`}>
            <div className="max-w-7xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-6xl font-black mb-4">CREATIVE GALLERY</h2>
                <div className={`w-24 h-2 bg-gradient-to-r ${currentTheme.primary} mx-auto rounded-full`} />
              </motion.div>

              {portfolioData.projects && portfolioData.projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolioData.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ y: -15, rotate: Math.random() * 6 - 3, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="bg-white border-0 shadow-xl rounded-3xl overflow-hidden h-full">
                        {project.image && (
                          <div className="relative h-64 overflow-hidden">
                            <ImageWithFallback
                              src={project.image}
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100 duration-300">
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-white text-gray-800 hover:bg-gray-100">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Live
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags?.map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex}
                                className={`bg-gradient-to-r ${colorThemes[tagIndex % colorThemes.length].primary} text-white border-0 text-xs`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className={`w-32 h-32 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Camera className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-400 mb-4">Gallery Coming Soon</h3>
                  <p className="text-gray-500 text-lg">Add projects to your profile to showcase your creative work here.</p>
                </motion.div>
              )}
            </div>
          </div>
        );

      case "experience":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-16`}>
            <div className="max-w-6xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-6xl font-black mb-4">CREATIVE JOURNEY</h2>
                <div className={`w-24 h-2 bg-gradient-to-r ${currentTheme.primary} mx-auto rounded-full`} />
              </motion.div>

              {portfolioData.experience && portfolioData.experience.length > 0 ? (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b ${currentTheme.primary} rounded-full`} />

                  <div className="space-y-16">
                    {portfolioData.experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className={`relative flex items-center ${
                          index % 2 === 0 ? 'justify-end pr-8' : 'justify-start pl-8'
                        }`}
                      >
                        {/* Timeline Node */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r ${currentTheme.primary} rounded-full shadow-lg z-10 flex items-center justify-center`}>
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="w-full max-w-md"
                        >
                          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-8">
                              <div className="flex items-center gap-4 mb-4">
                                <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center`}>
                                  <Building className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                  <p className="text-orange-600 font-semibold">{exp.company}</p>
                                </div>
                              </div>
                              <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white border-0 mb-4`}>
                                <Calendar className="w-3 h-3 mr-1" />
                                {exp.duration}
                              </Badge>
                              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className={`w-24 h-24 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Briefcase className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">Experience Timeline</h3>
                  <p className="text-gray-500">Add your work experience to showcase your professional journey.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-16`}>
            <div className="max-w-6xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-6xl font-black mb-4">LET'S CREATE MAGIC</h2>
                <div className={`w-24 h-2 bg-gradient-to-r ${currentTheme.primary} mx-auto rounded-full`} />
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">Get In Touch</h3>
                      <div className="space-y-6">
                        {[
                          {
                            icon: Mail,
                            label: "Email",
                            value: portfolioData.personalInfo.email,
                            href: `mailto:${portfolioData.personalInfo.email}`,
                            color: "from-red-500 to-pink-500"
                          },
                          {
                            icon: Phone,
                            label: "Phone",
                            value: portfolioData.personalInfo.phone,
                            href: `tel:${portfolioData.personalInfo.phone}`,
                            color: "from-green-500 to-emerald-500"
                          },
                          {
                            icon: MapPin,
                            label: "Location",
                            value: portfolioData.personalInfo.location,
                            color: "from-blue-500 to-cyan-500"
                          }
                        ].filter(item => item.value).map((item, index) => (
                          <motion.a
                            key={index}
                            href={item.href || "#"}
                            whileHover={{ x: 10, scale: 1.02 }}
                            className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                          >
                            <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-sm">{item.label}</div>
                              <div className="text-gray-900 font-semibold group-hover:text-purple-600 transition-colors">
                                {item.value}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 ml-auto transition-colors" />
                          </motion.a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6">Follow My Creative Journey</h3>
                      <div className="flex gap-4">
                        {[
                          { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
                          { icon: Dribbble, href: "#", label: "Dribbble", color: "hover:bg-purple-600" },
                          { icon: Globe, href: "#", label: "Portfolio", color: "hover:bg-orange-600" }
                        ].map((social, index) => (
                          <motion.a
                            key={index}
                            href={social.href}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center transition-all group ${social.color}`}
                          >
                            <social.icon className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                          </motion.a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <Card className={`bg-gradient-to-br ${currentTheme.primary} text-white border-0 shadow-xl rounded-3xl overflow-hidden h-full`}>
                    <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <Heart className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-bold mb-4">
                        Ready to Create Something Amazing?
                      </h3>
                      <p className="text-white/90 mb-8 leading-relaxed text-lg">
                        Let's collaborate and bring your creative vision to life. I'm passionate about 
                        creating beautiful, meaningful designs that make a real impact.
                      </p>
                      <div className="space-y-4">
                        <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 py-4 text-lg rounded-full">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Start a Project
                        </Button>
                        <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 py-4 text-lg rounded-full">
                          <Download className="w-5 h-5 mr-2" />
                          Download Portfolio
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Magazine-Style Navigation - Now part of the template */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center`}>
                <Brush className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black">{portfolioData.personalInfo.name}</h1>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Creative Magazine</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs opacity-60">{item.page}</span>
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}