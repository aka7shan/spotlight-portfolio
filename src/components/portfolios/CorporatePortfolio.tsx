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
  Download,
  ExternalLink,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  Target,
  Briefcase,
  Building,
  GraduationCap,
  Star,
  Calendar,
  Globe,
  Linkedin,
  MessageSquare,
  CheckCircle,
  Handshake,
  User,
  Folder,
  Send,
  Home,
  ChevronRight,
  BarChart3,
  PieChart,
  DollarSign,
  Shield,
  Zap,
  Clock,
  Network,
  FileText,
  Presentation,
  LineChart
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { corporateData } from "../../constants/portfolioData";

export function CorporatePortfolio({ data = corporateData, viewMode = 'desktop' }: PortfolioProps) {
  const portfolioData = data || corporateData;
  const [activeSection, setActiveSection] = useState("home");
  const [currentMetric, setCurrentMetric] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    revenue: 0,
    clients: 0,
    projects: 0,
    efficiency: 0
  });

  const sidebarItems = [
    { id: "home", label: "Overview", icon: Home },
    { id: "about", label: "Profile", icon: User },
    { id: "skills", label: "Expertise", icon: Target },
    { id: "projects", label: "Portfolio", icon: Folder },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send }
  ];

  const executiveMetrics = [
    { label: "Revenue Generated", value: "$50M+", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { label: "Team Members Led", value: "200+", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Projects Delivered", value: "150+", icon: Briefcase, color: "from-purple-500 to-pink-500" },
    { label: "Efficiency Improved", value: "40%", icon: TrendingUp, color: "from-orange-500 to-red-500" }
  ];

  const leadershipAreas = [
    {
      title: "Strategic Planning",
      description: "Developing long-term vision and strategic roadmaps",
      skills: portfolioData.skills.filter(skill => 
        ['Strategy', 'Planning', 'Vision', 'Leadership'].some(keyword => skill.includes(keyword))
      ),
      icon: Target,
      color: "from-blue-600 to-blue-800"
    },
    {
      title: "Team Leadership",
      description: "Building and managing high-performing teams",
      skills: portfolioData.skills.filter(skill => 
        ['Management', 'Leadership', 'Team', 'HR'].some(keyword => skill.includes(keyword))
      ),
      icon: Users,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Business Development",
      description: "Driving growth and market expansion",
      skills: portfolioData.skills.filter(skill => 
        ['Business', 'Growth', 'Sales', 'Marketing'].some(keyword => skill.includes(keyword))
      ),
      icon: TrendingUp,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Operations Excellence",
      description: "Optimizing processes and operational efficiency",
      skills: portfolioData.skills.filter(skill => 
        ['Operations', 'Process', 'Efficiency', 'Quality'].some(keyword => skill.includes(keyword))
      ),
      icon: Zap,
      color: "from-orange-600 to-red-600"
    }
  ];

  const achievements = [
    {
      title: "Digital Transformation",
      description: "Led company-wide digital transformation initiative",
      impact: "35% efficiency improvement",
      icon: Zap
    },
    {
      title: "Market Expansion",
      description: "Successfully expanded operations to 8 new markets",
      impact: "$25M+ revenue growth",
      icon: Globe
    },
    {
      title: "Team Building",
      description: "Built and scaled engineering team from 20 to 100+",
      impact: "200% productivity increase",
      icon: Users
    },
    {
      title: "Cost Optimization",
      description: "Implemented lean processes and cost reduction strategies",
      impact: "30% operational cost reduction",
      icon: Target
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % executiveMetrics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate stats on load
    const targets = { revenue: 50, clients: 200, projects: 150, efficiency: 40 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        revenue: Math.floor(targets.revenue * progress),
        clients: Math.floor(targets.clients * progress),
        projects: Math.floor(targets.projects * progress),
        efficiency: Math.floor(targets.efficiency * progress)
      });
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full px-6 py-3"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-blue-800 font-medium">Available for Executive Opportunities</span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
                  >
                    {portfolioData.personalInfo.name}
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative"
                  >
                    <p className="text-2xl text-blue-600 font-semibold">
                      {portfolioData.personalInfo.title}
                    </p>
                    <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg text-gray-600 leading-relaxed"
                >
                  {portfolioData.personalInfo.about}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={() => setActiveSection("projects")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
                  >
                    <Presentation className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("contact")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
                <div className="relative w-96 h-96 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                  />
                  
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                    <ImageWithFallback
                      src={portfolioData.personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                      alt={portfolioData.personalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">${animatedStats.revenue}M+</p>
                        <p className="text-xs text-gray-600">Revenue Impact</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -right-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{animatedStats.clients}+</p>
                        <p className="text-xs text-gray-600">Team Members</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {executiveMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 cursor-pointer transition-all ${
                    currentMetric === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => setCurrentMetric(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Leadership Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Executive Dashboard</h3>
                  <p className="text-gray-600">Key performance indicators and achievements</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-600 font-medium">{achievement.impact}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Profile</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Strategic leader with proven track record of driving business growth and operational excellence
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Summary</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {portfolioData.personalInfo.about}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Core Strengths</h4>
                        <div className="space-y-2">
                          {["Strategic Planning", "Team Leadership", "Business Development", "Innovation"].map((strength, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Industries</h4>
                        <div className="space-y-2">
                          {["Technology", "Finance", "Healthcare", "Manufacturing"].map((industry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-700">{industry}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Leadership Philosophy</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <Target className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Vision-Driven</h4>
                          <p className="text-gray-600">Leading with clear vision and strategic direction</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">People-First</h4>
                          <p className="text-gray-600">Empowering teams to achieve their full potential</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Results-Oriented</h4>
                          <p className="text-gray-600">Focused on delivering measurable business outcomes</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="border-gray-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h3>
                    <div className="space-y-6">
                      {[
                        { metric: "$50M+", label: "Revenue Generated", period: "Last 5 years" },
                        { metric: "200+", label: "Team Members Led", period: "Peak team size" },
                        { metric: "40%", label: "Efficiency Improvement", period: "Process optimization" },
                        { metric: "8", label: "Market Expansions", period: "Geographic growth" }
                      ].map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{stat.metric}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                          <div className="text-xs text-gray-500">{stat.period}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Executive Credentials</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">MBA in Business Administration</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Certified Executive Leader</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Board Advisory Experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700">Global Business Network</span>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Competencies</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Strategic leadership capabilities that drive business success
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {leadershipAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${area.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <area.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{area.title}</h3>
                          <p className="text-gray-600">{area.description}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {area.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-700 font-medium">{skill}</span>
                              <Progress value={85 + Math.random() * 15} className="w-16 h-2" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>Expert Level Proficiency</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Skills & Technologies</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolioData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-gray-800 font-medium">{skill}</div>
                    <div className="text-xs text-gray-500 mt-1">Expert</div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Portfolio</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Strategic initiatives and transformational projects delivered
              </p>
            </div>

            {portfolioData.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {project.image && (
                        <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Delivered</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>High Impact</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-4">Portfolio Coming Soon</h3>
                <p className="text-gray-500">Executive projects will be showcased here once added.</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Experience</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Leadership roles that shaped industry standards
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-purple-500" />
              
              <div className="space-y-12">
                {portfolioData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex items-start gap-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="flex-1 group"
                    >
                      <Card className="border-gray-200 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                {exp.position}
                              </h3>
                              <p className="text-blue-600 font-semibold text-lg">{exp.company}</p>
                            </div>
                            <Badge className="w-fit bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              {exp.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg mb-6">
                            {exp.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-green-800 font-medium">Revenue Growth</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                              <Users className="w-5 h-5 text-blue-600" />
                              <span className="text-blue-800 font-medium">Team Leadership</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                              <Zap className="w-5 h-5 text-purple-600" />
                              <span className="text-purple-800 font-medium">Innovation</span>
                            </div>
                          </div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Contact</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to drive your business forward? Let's discuss strategic opportunities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                    <div className="space-y-6">
                      {[
                        {
                          icon: Mail,
                          label: "Executive Email",
                          value: portfolioData.personalInfo.email,
                          href: `mailto:${portfolioData.personalInfo.email}`,
                          color: "from-red-500 to-pink-500"
                        },
                        {
                          icon: Phone,
                          label: "Direct Line",
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
                          whileHover={{ x: 5, scale: 1.02 }}
                          className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                        >
                          <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-gray-500 text-sm">{item.label}</div>
                            <div className="text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">
                              {item.value}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Network</h3>
                    <div className="flex gap-4">
                      {[
                        { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-600" },
                        { icon: Globe, href: "#", label: "Website", color: "hover:bg-gray-600" },
                        { icon: FileText, href: "#", label: "Resume", color: "hover:bg-green-600" }
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center transition-all group ${social.color}`}
                        >
                          <social.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Drive Growth?
                  </h3>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Let's discuss how strategic leadership and proven methodologies can transform 
                    your organization's performance and drive sustainable growth.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Schedule Executive Meeting
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 py-3">
                      <Download className="w-4 h-4 mr-2" />
                      Download Executive Profile
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 flex flex-col shadow-xl">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{portfolioData.personalInfo.name.split(' ')[0]}</h2>
              <p className="text-xs text-blue-600 uppercase tracking-wider">Executive</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">Available for opportunities</span>
          </div>
        </div>

        {/* Navigation */}
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{animatedStats.revenue}M+</div>
              <div className="text-xs text-gray-600">Revenue</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{animatedStats.clients}+</div>
              <div className="text-xs text-gray-600">Team</div>
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