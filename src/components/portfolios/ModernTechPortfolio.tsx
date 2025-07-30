import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Download,
  ExternalLink,
  Code,
  Terminal,
  Zap,
  Database,
  Server,
  Monitor,
  Star,
  Calendar,
  Building,
  User,
  Briefcase,
  Folder,
  Send,
  Home,
  ChevronRight,
  GitBranch,
  Coffee,
  Cpu,
  Eye,
  Play,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  FileCode,
  Layers
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { modernTechData } from "../../constants/portfolioData";

export function ModernTechPortfolio({ data = modernTechData, viewMode = 'desktop' }: PortfolioProps) {
  const portfolioData = data || modernTechData;
  const [activeSection, setActiveSection] = useState("home");
  const [isTyping, setIsTyping] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [stats, setStats] = useState({
    commits: 0,
    repos: 0,
    stars: 0,
    contributions: 0
  });

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Stack", icon: Code },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send }
  ];

  const codeSnippets = [
    {
      language: "javascript",
      code: `const developer = {
  name: "${portfolioData.personalInfo.name}",
  role: "${portfolioData.personalInfo.title}",
  skills: [${portfolioData.skills.slice(0, 3).map(s => `"${s}"`).join(", ")}],
  
  getExperience() {
    return this.skills.map(skill => ({
      technology: skill,
      yearsOfExperience: Math.floor(Math.random() * 5) + 2,
      projectsCompleted: Math.floor(Math.random() * 20) + 5
    }));
  },
  
  buildAmazingThings() {
    return "Let's create something incredible together! 🚀";
  }
};

console.log(developer.buildAmazingThings());`
    },
    {
      language: "python",
      code: `class Developer:
    def __init__(self):
        self.name = "${portfolioData.personalInfo.name}"
        self.role = "${portfolioData.personalInfo.title}"
        self.skills = [${portfolioData.skills.slice(0, 4).map(s => `"${s}"`).join(", ")}]
        self.coffee_consumed = float('inf')
    
    def code(self):
        return "Building the future, one commit at a time ⚡"
    
    def collaborate(self):
        return "Always ready for new challenges!"

dev = Developer()
print(dev.code())`
    }
  ];

  useEffect(() => {
    let currentSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    let index = 0;
    
    const typeCode = () => {
      if (index < currentSnippet.code.length) {
        setCodeSnippet(currentSnippet.code.substring(0, index + 1));
        index++;
        setTimeout(typeCode, 30);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setCodeSnippet("");
          setIsTyping(true);
          index = 0;
          currentSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          typeCode();
        }, 5000);
      }
    };

    typeCode();
  }, []);

  useEffect(() => {
    // Animate stats
    const animateStats = () => {
      const targetStats = {
        commits: 1247,
        repos: 42,
        stars: 156,
        contributions: 365
      };
      
      let current = { commits: 0, repos: 0, stars: 0, contributions: 0 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      const timer = setInterval(() => {
        current.commits = Math.min(current.commits + (targetStats.commits / steps), targetStats.commits);
        current.repos = Math.min(current.repos + (targetStats.repos / steps), targetStats.repos);
        current.stars = Math.min(current.stars + (targetStats.stars / steps), targetStats.stars);
        current.contributions = Math.min(current.contributions + (targetStats.contributions / steps), targetStats.contributions);
        
        setStats({
          commits: Math.floor(current.commits),
          repos: Math.floor(current.repos),
          stars: Math.floor(current.stars),
          contributions: Math.floor(current.contributions)
        });
        
        if (current.commits >= targetStats.commits) {
          clearInterval(timer);
        }
      }, increment);
    };

    animateStats();
  }, []);

  const skillCategories = [
    {
      name: "Frontend",
      skills: portfolioData.skills.filter(skill => 
        ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Angular'].some(tech => skill.includes(tech))
      ),
      icon: Monitor,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      name: "Backend",
      skills: portfolioData.skills.filter(skill => 
        ['Node.js', 'Python', 'API', 'Server', 'Java', 'PHP'].some(tech => skill.includes(tech))
      ),
      icon: Server,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      name: "Database",
      skills: portfolioData.skills.filter(skill => 
        ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Database'].some(tech => skill.includes(tech))
      ),
      icon: Database,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      name: "DevOps",
      skills: portfolioData.skills.filter(skill => 
        ['Docker', 'AWS', 'Git', 'CI/CD', 'Linux', 'DevOps'].some(tech => skill.includes(tech))
      ),
      icon: Activity,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20"
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="relative mx-auto w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-75 blur-md" />
                <ImageWithFallback
                  src={portfolioData.personalInfo.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
                  alt={portfolioData.personalInfo.name}
                  className="relative w-full h-full rounded-full object-cover border-4 border-gray-800 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {portfolioData.personalInfo.name}
              </h1>
              <p className="text-xl text-blue-400 font-medium">{portfolioData.personalInfo.title}</p>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">{portfolioData.personalInfo.about}</p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setActiveSection("projects")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection("contact")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Get In Touch
                </Button>
              </div>
            </motion.div>

            {/* GitHub-style Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Commits", value: stats.commits, icon: GitBranch, color: "text-green-400" },
                { label: "Repositories", value: stats.repos, icon: Folder, color: "text-blue-400" },
                { label: "Stars Earned", value: stats.stars, icon: Star, color: "text-yellow-400" },
                { label: "Contributions", value: stats.contributions, icon: Activity, color: "text-purple-400" }
              ].map((stat, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Live Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="border-b border-gray-700 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-gray-400 text-sm">developer.js</span>
                    </div>
                    <Terminal className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="text-gray-300 font-mono">
                      {codeSnippet}
                      {isTyping && <span className="animate-pulse bg-blue-400 text-blue-400">█</span>}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );

      case "about":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {portfolioData.personalInfo.about}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Quick Facts</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{portfolioData.personalInfo.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-orange-400" />
                          <span className="text-gray-300">Coffee Enthusiast</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">Continuous Learner</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {["AI/ML", "Web3", "DevOps", "Open Source", "Mobile Dev"].map((interest) => (
                          <Badge key={interest} variant="outline" className="border-gray-600 text-gray-300">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Experience Level</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Frontend Development</span>
                            <span className="text-blue-400">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Backend Development</span>
                            <span className="text-green-400">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">DevOps & Cloud</span>
                            <span className="text-purple-400">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "skills":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Tech Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {skillCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className={`bg-gray-800/50 border-gray-700 hover:${category.borderColor} transition-all duration-300`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                            <category.icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{category.name}</h3>
                            <p className="text-sm text-gray-400">{category.skills.length} technologies</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {category.skills.map((skill, skillIndex) => (
                            <motion.div
                              key={skillIndex}
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors"
                            >
                              <span className="text-gray-300 text-sm font-medium">{skill}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'
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

              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-4">All Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {portfolioData.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-300 transition-colors text-sm py-1 px-3"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "projects":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Featured Projects</h2>
              {portfolioData.projects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {portfolioData.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden h-full">
                        {project.image && (
                          <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative">
                            <ImageWithFallback
                              src={project.image}
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                  <Play className="w-3 h-3 mr-1" />
                                  Demo
                                </Button>
                                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                  <Github className="w-3 h-3 mr-1" />
                                  Code
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                              {project.name}
                            </h3>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex}
                                variant="secondary"
                                className="bg-gray-700/50 text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-xs"
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
                <div className="text-center py-16">
                  <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h3>
                  <p className="text-gray-500">Projects will appear here once added to your profile.</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "experience":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Work Experience</h2>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-purple-500" />
                <div className="space-y-8">
                  {portfolioData.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative flex items-start gap-6"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex-1"
                      >
                        <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">{exp.position}</h3>
                                <p className="text-blue-400 font-medium">{exp.company}</p>
                              </div>
                              <Badge className="w-fit bg-blue-500/20 text-blue-300 border-blue-500/30">
                                <Calendar className="w-3 h-3 mr-1" />
                                {exp.duration}
                              </Badge>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                            <div className="mt-4 flex gap-2">
                              <div className="flex items-center gap-1 text-xs text-green-400">
                                <TrendingUp className="w-3 h-3" />
                                <span>Growth</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-blue-400">
                                <Award className="w-3 h-3" />
                                <span>Achievement</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Ready to bring your ideas to life? I'm always excited to discuss new projects 
                    and collaborate on innovative solutions.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: Mail,
                        label: "Email",
                        value: portfolioData.personalInfo.email,
                        href: `mailto:${portfolioData.personalInfo.email}`,
                        color: "text-red-400",
                        bgColor: "bg-red-400/10"
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: portfolioData.personalInfo.phone,
                        href: `tel:${portfolioData.personalInfo.phone}`,
                        color: "text-green-400",
                        bgColor: "bg-green-400/10"
                      },
                      {
                        icon: MapPin,
                        label: "Location",
                        value: portfolioData.personalInfo.location,
                        color: "text-blue-400",
                        bgColor: "bg-blue-400/10"
                      }
                    ].filter(item => item.value).map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.href || "#"}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group"
                      >
                        <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">{item.label}</div>
                          <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {item.value}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 ml-auto transition-colors" />
                      </motion.a>
                    ))}
                  </div>

                  <div className="flex gap-4">
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
                        className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors group"
                      >
                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/30">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                        <Coffee className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Ready to Start Something Great?
                        </h3>
                        <p className="text-gray-300">
                          Let's grab a virtual coffee and discuss your next big idea!
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 flex flex-col">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">{portfolioData.personalInfo.name.split(' ')[0]}</h2>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Developer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Status</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Available</span>
            </div>
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