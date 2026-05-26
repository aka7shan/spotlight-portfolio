import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Download,
  Star, Target, Coffee, Heart, Github, Linkedin,
  User, Briefcase, Folder, Send, Home, ChevronRight, Crown, Palette, Globe
} from "lucide-react";
import type { PortfolioProps } from "../../types/portfolio";
import { classicData } from "../../constants/portfolioData";
import { ClassicHero } from "./shared/ClassicHero";
import { ClassicQuoteSection } from "./shared/ClassicQuoteSection";
import { SectionHeader } from "./shared/SectionHeader";
import { ExperienceTimeline } from "./shared/ExperienceTimeline";
import { ProjectGrid } from "./shared/ProjectGrid";
import { SectionContainer } from "./shared/SectionContainer";
import { PortfolioSidebar } from "./shared/PortfolioSidebar";
import { inspirationalQuotes, classicColorPalette } from "./shared/ClassicConstants";
import { getTimeOfDay, getSkillCategories, getContactItems } from "./shared/ClassicUtils";

const SECTION_HEADER = {
  titleClass: "text-4xl font-serif text-gray-900 mb-6",
  subtitleClass: "text-gray-600 text-lg",
  dividerClass: "bg-gradient-to-r from-amber-500 to-orange-500",
};

const EXP_THEME = {
  line: "bg-amber-400",
  nodeGradient: "from-amber-500 to-orange-500",
  card: "bg-white border-amber-200 hover:shadow-2xl transition-all duration-500",
  position: "text-gray-900 group-hover:text-amber-700 transition-colors",
  company: "text-amber-600 font-medium",
  badge: "w-fit border-amber-300 text-amber-700 bg-amber-50",
  description: "text-gray-600 leading-relaxed",
  layout: "alternating" as const,
};

const PROJ_THEME = {
  card: "bg-white border-amber-200 hover:shadow-2xl transition-all duration-500",
  imageBg: "bg-amber-50",
  title: "text-xl font-serif text-gray-900",
  titleHover: "text-amber-700",
  description: "text-gray-600 leading-relaxed",
  badge: "border-amber-200 text-amber-700 bg-amber-50",
};

const SIDEBAR_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Target },
  { id: "projects", label: "Works", icon: Folder },
  { id: "experience", label: "Journey", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Send },
];

const SIDEBAR_THEME = {
  bg: "bg-white/80 backdrop-blur-md",
  border: "border-amber-200",
  logoGradient: "from-amber-500 to-orange-500",
  logoText: "text-amber-700",
  activeClass: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
  inactiveClass: "text-gray-600 hover:text-amber-600 hover:bg-amber-50",
  footerText: "text-gray-500",
};

export function ClassicPortfolio({ data = classicData }: PortfolioProps) {
  const portfolioData = data || classicData;
  const [activeSection, setActiveSection] = useState("home");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("");

  const skillCategories = getSkillCategories(portfolioData.skills);
  const contactItems = getContactItems(portfolioData.personalInfo);

  useEffect(() => {
    const id = setInterval(() => setCurrentQuote((p) => (p + 1) % inspirationalQuotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const id = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(id);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            <ClassicHero personalInfo={portfolioData.personalInfo} timeOfDay={timeOfDay} onViewWork={() => setActiveSection("projects")} onContact={() => setActiveSection("contact")} />
            <ClassicQuoteSection quote={inspirationalQuotes[currentQuote].quote} author={inspirationalQuotes[currentQuote].author} />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-amber-200">
              {[
                { value: portfolioData.experience.length || 5, label: "Years Experience", suffix: "+" },
                { value: portfolioData.projects.length || 24, label: "Projects Completed", suffix: "+" },
                { value: portfolioData.skills.length || 15, label: "Skills Mastered", suffix: "+" },
                { value: 98, label: "Client Satisfaction", suffix: "%" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + i * 0.1 }} className="text-center">
                  <div className="text-4xl font-serif text-amber-700 mb-2">{stat.value}{stat.suffix}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case "about":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <SectionHeader title="About Me" subtitle="The story behind the passion" {...SECTION_HEADER} />
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">My Story</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{portfolioData.personalInfo.about}</p>
                    <div className="space-y-4">
                      {[
                        { icon: MapPin, text: portfolioData.personalInfo.location, color: "text-amber-600" },
                        { icon: Heart, text: "Passionate about creating beautiful experiences", color: "text-red-500" },
                        { icon: Coffee, text: "Powered by creativity and caffeine", color: "text-amber-600" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Values & Principles</h3>
                    <div className="space-y-4">
                      {["Quality over Quantity", "Continuous Learning", "Collaborative Spirit", "Attention to Detail"].map((v, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          <span className="text-gray-700">{v}</span>
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
                      {["Photography", "Design", "Technology", "Travel", "Art", "Music"].map((interest, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                          <div className="text-sm font-medium text-gray-700">{interest}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case "skills":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <SectionHeader title="Skills & Expertise" subtitle="Tools and technologies I work with" {...SECTION_HEADER} />
            <div className="grid md:grid-cols-2 gap-8">
              {skillCategories.map((category, index) => {
                const IconMap: Record<string, typeof Target> = { Target, Palette, Crown, Heart };
                const Icon = IconMap[category.icon] || Heart;
                return (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}>
                    <Card className="bg-white border-amber-200 hover:shadow-xl transition-all duration-300 h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.skills.length} skills</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.skills.map((skill, si) => (
                            <motion.div key={si} whileHover={{ x: 5 }} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                              <span className="text-gray-700 font-medium">{skill}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-amber-400 fill-current" : "text-gray-300"}`} />
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
                {portfolioData.skills.map((skill, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.1, y: -2 }}>
                    <Badge className={`bg-gradient-to-r ${classicColorPalette[i % classicColorPalette.length]} text-white border-0 px-4 py-2`}>{skill}</Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "projects":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <SectionHeader title="Featured Works" subtitle="A collection of my finest creations" {...SECTION_HEADER} />
            {portfolioData.projects.length > 0 ? (
              <ProjectGrid items={portfolioData.projects} theme={PROJ_THEME} />
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif text-gray-400 mb-4">Portfolio Coming Soon</h3>
              </div>
            )}
          </motion.div>
        );

      case "experience":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <SectionHeader title="Professional Journey" subtitle="Career milestones and achievements" {...SECTION_HEADER} />
            <ExperienceTimeline items={portfolioData.experience} theme={EXP_THEME} />
          </motion.div>
        );

      case "contact":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <SectionHeader title="Let's Create Together" subtitle="Ready to bring your vision to life?" {...SECTION_HEADER} />
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">Get In Touch</h3>
                    <div className="space-y-4">
                      {contactItems.filter((c) => c.value).map((item, i) => {
                        const IconMap: Record<string, typeof Mail> = { Mail, Phone, MapPin };
                        const Icon = IconMap[item.icon] || Mail;
                        return (
                          <motion.a key={i} href={item.href || "#"} whileHover={{ x: 5, scale: 1.02 }} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-sm">{item.label}</div>
                              <div className="text-gray-800 font-medium group-hover:text-amber-700 transition-colors">{item.value}</div>
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
                        { icon: Github, label: "GitHub", color: "hover:bg-gray-700" },
                        { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-600" },
                        { icon: Globe, label: "Website", color: "hover:bg-amber-600" },
                      ].map((s, i) => (
                        <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className={`w-14 h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center transition-all group ${s.color}`}>
                          <s.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
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
                  <h3 className="text-2xl font-serif mb-4">Let's Create Something Beautiful</h3>
                  <p className="text-amber-100 mb-8 leading-relaxed">Ready to bring your vision to life? I'd love to hear about your project.</p>
                  <div className="space-y-4">
                    <Button className="w-full bg-white text-amber-600 hover:bg-amber-50 py-3"><Heart className="w-4 h-4 mr-2" />Start a Conversation</Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 py-3"><Download className="w-4 h-4 mr-2" />Download Resume</Button>
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
      <PortfolioSidebar items={SIDEBAR_ITEMS} activeSection={activeSection} onSectionChange={setActiveSection} theme={SIDEBAR_THEME} title={portfolioData.personalInfo.name.split(" ")[0]} />
      <div className="flex-1 ml-64 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
