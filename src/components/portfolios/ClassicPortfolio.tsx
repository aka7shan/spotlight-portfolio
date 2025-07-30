import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  ExternalLink,
  ArrowRight,
  Building,
  GraduationCap,
  Star,
  Target,
  Coffee,
  Heart,
  Github,
  Linkedin,
  User,
  Briefcase,
  Folder,
  Send,
  Home,
  ChevronRight,
  Award,
  Globe,
  Calendar,
  Crown,
  Palette
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { classicData } from "../../constants/portfolioData";
import { ClassicHero } from "./shared/ClassicHero";
import { ClassicQuoteSection } from "./shared/ClassicQuoteSection";
import { inspirationalQuotes, classicColorPalette } from "./shared/ClassicConstants";
import { getTimeOfDay, getSkillCategories, getContactItems } from "./shared/ClassicUtils";

export function ClassicPortfolio({ data = classicData, viewMode = 'desktop' }: PortfolioProps) {
  const portfolioData = data || classicData;
  const [activeSection, setActiveSection] = useState("home");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("");

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Target },
    { id: "projects", label: "Works", icon: Folder },
    { id: "experience", label: "Journey", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send }
  ];

  const skillCategories = getSkillCategories(portfolioData.skills);
  const contactItems = getContactItems(portfolioData.personalInfo);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTimeOfDay = () => {
      setTimeOfDay(getTimeOfDay());
    };
    
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            <ClassicHero
              personalInfo={portfolioData.personalInfo}
              timeOfDay={timeOfDay}
              onViewWork={() => setActiveSection("projects")}
              onContact={() => setActiveSection("contact")}
            />

            <ClassicQuoteSection
              quote={inspirationalQuotes[currentQuote].quote}
              author={inspirationalQuotes[currentQuote].author}
            />

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-amber-200"
            >
              {[
                { value: portfolioData.experience.length || 5, label: "Years Experience", suffix: "+" },
                { value: portfolioData.projects.length || 24, label: "Projects Completed", suffix: "+" },
                { value: portfolioData.skills.length || 15, label: "Skills Mastered", suffix: "+" },
                { value: 98, label: "Client Satisfaction", suffix: "%" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-serif text-amber-700 mb-2">{stat.value}{stat.suffix}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case "about":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8" />
              <h2 className="text-4xl font-serif text-gray-900 mb-6">About Me</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">The story behind the passion</p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">My Story</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {portfolioData.personalInfo.about}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-amber-600" />
                        <span className="text-gray-700">{portfolioData.personalInfo.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">Passionate about creating beautiful experiences</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-amber-600" />
                        <span className="text-gray-700">Powered by creativity and caffeine</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Values & Principles</h3>
                    <div className="space-y-4">
                      {["Quality over Quantity", "Continuous Learning", "Collaborative Spirit", "Attention to Detail"].map((value, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          <span className="text-gray-700">{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="bg-white border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Interests & Hobbies</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {["Photography", "Design", "Technology", "Travel", "Art", "Music"].map((interest, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200"
                        >
                          <div className="text-sm font-medium text-gray-700">{interest}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Fun Facts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Coffee cups per day</span>
                        <span className="font-semibold text-gray-900">4-6 ☕</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Favorite design tool</span>
                        <span className="font-semibold text-gray-900">Figma 🎨</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Years of experience</span>
                        <span className="font-semibold text-gray-900">{portfolioData.experience.length}+ years 🚀</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dream project</span>
                        <span className="font-semibold text-gray-900">Yours! ✨</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case "skills":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8" />
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Skills & Expertise</h2>
              <p className="text-gray-600 text-lg">Tools and technologies I work with</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {skillCategories.map((category, index) => {
                const IconComponent = category.icon === "Target" ? Target : 
                                   category.icon === "Palette" ? Palette :
                                   category.icon === "Crown" ? Crown : Heart;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-white border-amber-200 hover:shadow-xl transition-all duration-300 h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.skills.length} skills</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.skills.map((skill, skillIndex) => (
                            <motion.div
                              key={skillIndex}
                              whileHover={{ x: 5 }}
                              className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100"
                            >
                              <span className="text-gray-700 font-medium">{skill}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'
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
                );
              })}
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-serif text-gray-900 mb-8 text-center">All Skills</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {portfolioData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <Badge 
                      className={`bg-gradient-to-r ${classicColorPalette[index % classicColorPalette.length]} text-white border-0 px-4 py-2`}
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "projects":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8" />
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Featured Works</h2>
              <p className="text-gray-600 text-lg">A collection of my finest creations</p>
            </div>

            {portfolioData.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Card className="bg-white border-amber-200 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                      {project.image && (
                        <div className="h-48 overflow-hidden bg-amber-50">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-serif text-gray-900 group-hover:text-amber-700 transition-colors">
                            {project.name}
                          </h3>
                          <ExternalLink className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex}
                              variant="outline"
                              className="border-amber-200 text-amber-700 bg-amber-50"
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
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif text-gray-400 mb-4">Portfolio Coming Soon</h3>
                <p className="text-gray-500">Beautiful projects will be showcased here.</p>
              </div>
            )}
          </motion.div>
        );

      case "experience":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8" />
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Professional Journey</h2>
              <p className="text-gray-600 text-lg">Career milestones and achievements</p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-300 to-orange-300 rounded-full" />

              <div className="space-y-12">
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
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-amber-400 rounded-full shadow-lg z-10" />

                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="w-full max-w-md group"
                    >
                      <Card className="bg-white border-amber-200 hover:shadow-2xl transition-all duration-500">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 group-hover:text-amber-700 transition-colors">
                                {exp.position}
                              </CardTitle>
                              <p className="text-amber-600 font-medium">{exp.company}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="w-fit border-amber-300 text-amber-700 bg-amber-50"
                          >
                            {exp.duration}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 leading-relaxed">
                            {exp.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8" />
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Let's Create Together</h2>
              <p className="text-gray-600 text-lg">Ready to bring your vision to life?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Get In Touch</h3>
                    <div className="space-y-4">
                      {contactItems.filter(item => item.value).map((item, index) => {
                        const IconComponent = item.icon === "Mail" ? Mail : 
                                           item.icon === "Phone" ? Phone : MapPin;
                        
                        return (
                          <motion.a
                            key={index}
                            href={item.href || "#"}
                            whileHover={{ x: 5, scale: 1.02 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                          >
                            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-sm">{item.label}</div>
                              <div className="text-gray-800 font-medium group-hover:text-amber-700 transition-colors">
                                {item.value}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 ml-auto transition-colors" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Follow My Work</h3>
                    <div className="flex gap-4">
                      {[
                        { icon: Github, href: "#", label: "GitHub", color: "hover:bg-gray-700" },
                        { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-600" },
                        { icon: Globe, href: "#", label: "Website", color: "hover:bg-amber-600" }
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-14 h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center transition-all group ${social.color}`}
                        >
                          <social.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">
                    Let's Create Something Beautiful
                  </h3>
                  <p className="text-amber-100 mb-8 leading-relaxed">
                    Ready to bring your vision to life? I'd love to hear about your project 
                    and explore how we can work together to create something amazing.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full bg-white text-amber-600 hover:bg-amber-50 py-3">
                      <Heart className="w-4 h-4 mr-2" />
                      Start a Conversation
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 py-3">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-md border-r border-amber-200 flex flex-col shadow-xl">
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-gray-900">{portfolioData.personalInfo.name.split(' ')[0]}</h2>
              <p className="text-xs text-amber-600 uppercase tracking-wider">Creative</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">Available for projects</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-amber-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Current Time</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}