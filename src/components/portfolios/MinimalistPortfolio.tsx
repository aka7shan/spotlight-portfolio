import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  ExternalLink,
  ArrowRight,
  ArrowDown,
  Circle,
  Minus,
  Plus,
  Target,
  User,
  Briefcase,
  Folder,
  Send,
  Home,
  Calendar,
  Building,
  Globe,
  Linkedin,
  Github,
  Coffee,
  Eye,
  ChevronDown
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { minimalistData } from "../../constants/portfolioData";

export function MinimalistPortfolio({ data = minimalistData, viewMode = 'desktop' }: PortfolioProps) {
  const portfolioData = data || minimalistData;
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sections = [
    { id: "home", label: "Home", number: "01" },
    { id: "about", label: "About", number: "02" },
    { id: "skills", label: "Skills", number: "03" },
    { id: "projects", label: "Work", number: "04" },
    { id: "experience", label: "Path", number: "05" },
    { id: "contact", label: "Contact", number: "06" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrolled / maxScroll) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-4xl mx-auto px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-12"
              >
                {/* Minimalist Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative mx-auto w-48 h-48"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <ImageWithFallback
                      src={portfolioData.personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                      alt={portfolioData.personalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full"
                  />
                </motion.div>

                {/* Typography-focused content */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900">
                      {portfolioData.personalInfo.name}
                    </h1>
                    <div className="w-24 h-px bg-gray-900 mx-auto" />
                    <p className="text-xl text-gray-600 font-light tracking-wide">
                      {portfolioData.personalInfo.title}
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto font-light"
                  >
                    {portfolioData.personalInfo.about}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-center gap-8 pt-8"
                  >
                    <Button
                      onClick={() => setActiveSection("projects")}
                      variant="outline"
                      className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-none font-light"
                    >
                      View Work
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => setActiveSection("contact")}
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-none font-light"
                    >
                      Get in Touch
                    </Button>
                  </motion.div>
                </div>

                {/* Minimal stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-200"
                >
                  {[
                    { value: portfolioData.experience?.length || 5, label: "Years" },
                    { value: portfolioData.projects?.length || 24, label: "Projects" },
                    { value: portfolioData.skills?.length || 15, label: "Skills" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-light text-gray-900">{stat.value}+</div>
                      <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Section Header */}
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest">02</div>
                  <h2 className="text-4xl font-light text-gray-900">About</h2>
                  <div className="w-16 h-px bg-gray-900 mx-auto" />
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Story</h3>
                      <p className="text-gray-600 leading-relaxed font-light">
                        {portfolioData.personalInfo.about}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Principles</h3>
                      <div className="space-y-3">
                        {["Simplicity", "Clarity", "Purpose", "Impact"].map((principle, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <Circle className="w-2 h-2 text-gray-900 fill-current" />
                            <span className="text-gray-600 font-light">{principle}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500 font-light">Location</span>
                          <span className="text-gray-900 font-light">{portfolioData.personalInfo.location}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500 font-light">Experience</span>
                          <span className="text-gray-900 font-light">{portfolioData.experience?.length || 5}+ years</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500 font-light">Focus</span>
                          <span className="text-gray-900 font-light">User Experience</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-light">Status</span>
                          <span className="text-green-600 font-light">Available</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Education</h3>
                      <div className="space-y-4">
                        {portfolioData.education?.map((edu, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="text-gray-900 font-light">{edu.degree}</div>
                            <div className="text-gray-500 text-sm font-light">{edu.institution} • {edu.year}</div>
                          </motion.div>
                        )) || (
                          <div className="text-gray-400 font-light italic">Education details will appear here</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-4xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Section Header */}
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest">03</div>
                  <h2 className="text-4xl font-light text-gray-900">Skills</h2>
                  <div className="w-16 h-px bg-gray-900 mx-auto" />
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-8">Core</h3>
                      <div className="space-y-6">
                        {portfolioData.skills?.slice(0, 6).map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between py-3 border-b border-gray-200"
                          >
                            <span className="text-gray-700 font-light">{skill}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Circle
                                  key={i}
                                  className={`w-2 h-2 ${
                                    i < 4 ? 'text-gray-900 fill-current' : 'text-gray-300 fill-current'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )) || (
                          <div className="text-gray-400 font-light italic">Skills will be displayed here</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-8">Tools</h3>
                      <div className="space-y-6">
                        {portfolioData.skills?.slice(6, 12).map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between py-3 border-b border-gray-200"
                          >
                            <span className="text-gray-700 font-light">{skill}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Circle
                                  key={i}
                                  className={`w-2 h-2 ${
                                    i < 3 ? 'text-gray-900 fill-current' : 'text-gray-300 fill-current'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )) || (
                          <div className="text-gray-400 font-light italic">Additional skills will be displayed here</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Skills */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-light text-gray-900 mb-8 text-center">Complete Set</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {portfolioData.skills?.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge 
                          variant="outline"
                          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 font-light px-3 py-1 rounded-none"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    )) || (
                      <div className="text-gray-400 font-light italic">Skills will be displayed here</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="min-h-screen bg-white py-24">
            <div className="max-w-6xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Section Header */}
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest">04</div>
                  <h2 className="text-4xl font-light text-gray-900">Selected Work</h2>
                  <div className="w-16 h-px bg-gray-900 mx-auto" />
                </div>

                {portfolioData.projects && portfolioData.projects.length > 0 ? (
                  <div className="space-y-24">
                    {portfolioData.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="group"
                      >
                        <div className={`grid md:grid-cols-2 gap-16 items-center ${
                          index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
                        }`}>
                          <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400 font-light">0{index + 1}</span>
                                <div className="flex-1 h-px bg-gray-200" />
                              </div>
                              <h3 className="text-3xl font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-gray-600 leading-relaxed font-light text-lg">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {project.tags?.map((tag, tagIndex) => (
                                  <Badge 
                                    key={tagIndex}
                                    variant="outline"
                                    className="border-gray-300 text-gray-600 bg-transparent font-light px-3 py-1 rounded-none"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="pt-4">
                                <Button
                                  variant="ghost"
                                  className="text-gray-900 hover:text-gray-600 p-0 h-auto font-light"
                                >
                                  View Project
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                            {project.image ? (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="aspect-video bg-gray-100 overflow-hidden"
                              >
                                <ImageWithFallback
                                  src={project.image}
                                  alt={project.name}
                                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                />
                              </motion.div>
                            ) : (
                              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <Folder className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-light text-gray-400 mb-2">No work to display</h3>
                    <p className="text-gray-400 font-light">Projects will appear here once added</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-4xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Section Header */}
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest">05</div>
                  <h2 className="text-4xl font-light text-gray-900">Experience</h2>
                  <div className="w-16 h-px bg-gray-900 mx-auto" />
                </div>

                <div className="space-y-16">
                  {portfolioData.experience?.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="border-l-2 border-gray-200 pl-8 pb-8"
                    >
                      <div className="relative -ml-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full absolute -left-1.5 top-2" />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-xl font-light text-gray-900">{exp.position}</h3>
                            <p className="text-gray-600 font-light">{exp.company}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="w-fit border-gray-300 text-gray-600 bg-transparent font-light px-3 py-1 rounded-none mt-2 md:mt-0"
                          >
                            {exp.duration}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed font-light">
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-light text-gray-400 mb-2">No experience to display</h3>
                      <p className="text-gray-400 font-light">Experience will appear here once added</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Section Header */}
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest">06</div>
                  <h2 className="text-4xl font-light text-gray-900">Contact</h2>
                  <div className="w-16 h-px bg-gray-900 mx-auto" />
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-8">Let's Work Together</h3>
                      <p className="text-gray-600 leading-relaxed font-light text-lg">
                        I'm interested in new opportunities and meaningful collaborations. 
                        Let's discuss how we can create something exceptional together.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          icon: Mail,
                          label: "Email",
                          value: portfolioData.personalInfo.email,
                          href: `mailto:${portfolioData.personalInfo.email}`
                        },
                        {
                          icon: Phone,
                          label: "Phone",
                          value: portfolioData.personalInfo.phone,
                          href: `tel:${portfolioData.personalInfo.phone}`
                        },
                        {
                          icon: MapPin,
                          label: "Location",
                          value: portfolioData.personalInfo.location
                        }
                      ].filter(item => item.value).map((item, index) => (
                        <motion.a
                          key={index}
                          href={item.href || "#"}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition-colors group"
                        >
                          <item.icon className="w-5 h-5" />
                          <div>
                            <div className="text-sm text-gray-500 font-light">{item.label}</div>
                            <div className="font-light">{item.value}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </motion.a>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-light text-gray-900">Connect</h3>
                      <div className="flex gap-6">
                        {[
                          { icon: Github, href: "#", label: "GitHub" },
                          { icon: Linkedin, href: "#", label: "LinkedIn" },
                          { icon: Globe, href: "#", label: "Website" }
                        ].map((social, index) => (
                          <motion.a
                            key={index}
                            href={social.href}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-gray-100 hover:bg-gray-900 flex items-center justify-center transition-colors group"
                          >
                            <social.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-8">
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Coffee className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-light text-gray-900">
                          Ready to Start?
                        </h3>
                        <p className="text-gray-600 font-light">
                          I'd love to hear about your project.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-none font-light"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gray-900 origin-left"
          style={{ scaleX: scrollProgress / 100 }}
        />
      </div>

      {/* Minimal Navigation */}
      <div className="fixed top-4 left-8 z-50 space-y-4">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2">
          <div className="text-xs text-gray-500 font-light">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <nav className="space-y-2">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-gray-900 scale-125'
                  : 'bg-gray-300 hover:bg-gray-500'
              }`}
              title={section.label}
            />
          ))}
        </nav>
      </div>

      {/* Section Indicator */}
      <div className="fixed top-4 right-8 z-50">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2">
          <div className="text-xs text-gray-500 font-light uppercase tracking-wider">
            {sections.find(s => s.id === activeSection)?.number} — {sections.find(s => s.id === activeSection)?.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}