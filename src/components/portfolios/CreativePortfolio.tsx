import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles, Heart, Eye, User, Briefcase, Home, Camera, Brush, Palette, Send,
  Lightbulb, PenTool, Award, GraduationCap, Globe, MapPin, ChevronRight,
  Volume2, VolumeX, Menu, X,
} from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { creativeData } from "../../constants/portfolioData";
import { SectionHeader } from "./shared/SectionHeader";
import { ExperienceTimeline } from "./shared/ExperienceTimeline";
import { ProjectGrid } from "./shared/ProjectGrid";
import { SectionContainer } from "./shared/SectionContainer";
import { SocialLinks } from "./shared/SocialLinks";
import { ResumeButton } from "./shared/ResumeButton";
import { EmptyState } from "./shared/EmptyState";
import { yearsOfExperience, categorizeSkills, getContactItems } from "./shared/portfolioHelpers";
import { formatDateRange } from "../../utils/formatDate";

const COLOR_THEMES = [
  {
    name: "Sunset", primary: "from-orange-500 to-pink-500", bg: "from-orange-50 to-pink-50",
    expTheme: { line: "bg-orange-500", nodeGradient: "from-orange-500 to-pink-500", card: "bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all", position: "text-gray-900", company: "text-orange-600 font-semibold", badge: "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0", description: "text-gray-700 leading-relaxed", layout: "alternating" as const },
    projTheme: { card: "bg-white border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all", imageBg: "bg-gray-100", title: "text-xl font-bold text-gray-900", titleHover: "group-hover:text-pink-600", description: "text-gray-600 leading-relaxed mb-4", badge: "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 text-xs", cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" },
  },
  {
    name: "Ocean", primary: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50",
    expTheme: { line: "bg-blue-500", nodeGradient: "from-blue-500 to-cyan-500", card: "bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all", position: "text-gray-900", company: "text-blue-600 font-semibold", badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0", description: "text-gray-700 leading-relaxed", layout: "alternating" as const },
    projTheme: { card: "bg-white border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all", imageBg: "bg-gray-100", title: "text-xl font-bold text-gray-900", titleHover: "group-hover:text-blue-600", description: "text-gray-600 leading-relaxed mb-4", badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs", cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" },
  },
  {
    name: "Forest", primary: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50",
    expTheme: { line: "bg-green-500", nodeGradient: "from-green-500 to-emerald-500", card: "bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all", position: "text-gray-900", company: "text-green-600 font-semibold", badge: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0", description: "text-gray-700 leading-relaxed", layout: "alternating" as const },
    projTheme: { card: "bg-white border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all", imageBg: "bg-gray-100", title: "text-xl font-bold text-gray-900", titleHover: "group-hover:text-green-600", description: "text-gray-600 leading-relaxed mb-4", badge: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs", cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" },
  },
  {
    name: "Purple", primary: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50",
    expTheme: { line: "bg-purple-500", nodeGradient: "from-purple-500 to-pink-500", card: "bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all", position: "text-gray-900", company: "text-purple-600 font-semibold", badge: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0", description: "text-gray-700 leading-relaxed", layout: "alternating" as const },
    projTheme: { card: "bg-white border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all", imageBg: "bg-gray-100", title: "text-xl font-bold text-gray-900", titleHover: "group-hover:text-purple-600", description: "text-gray-600 leading-relaxed mb-4", badge: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs", cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" },
  },
  {
    name: "Golden", primary: "from-yellow-500 to-orange-500", bg: "from-yellow-50 to-orange-50",
    expTheme: { line: "bg-yellow-500", nodeGradient: "from-yellow-500 to-orange-500", card: "bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all", position: "text-gray-900", company: "text-orange-600 font-semibold", badge: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0", description: "text-gray-700 leading-relaxed", layout: "alternating" as const },
    projTheme: { card: "bg-white border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all", imageBg: "bg-gray-100", title: "text-xl font-bold text-gray-900", titleHover: "group-hover:text-orange-600", description: "text-gray-600 leading-relaxed mb-4", badge: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs", cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" },
  },
];

const NAV_ITEMS = [
  { id: "home", label: "Cover Story", icon: Home, page: "01" },
  { id: "about", label: "The Artist", icon: User, page: "02" },
  { id: "skills", label: "Toolkit", icon: Palette, page: "03" },
  { id: "projects", label: "Gallery", icon: Camera, page: "04" },
  { id: "experience", label: "Journey", icon: Briefcase, page: "05" },
  { id: "contact", label: "Connect", icon: Send, page: "06" },
];

const SECTION_HEADER_BASE = {
  titleClass: "text-4xl sm:text-5xl md:text-6xl font-black mb-4",
  dividerClass: "h-2 rounded-full",
  align: "center" as const,
};

const SKILL_ICONS = [Palette, PenTool, Lightbulb, Camera];

export function CreativePortfolio({ data = creativeData }: PortfolioProps) {
  const portfolioData = data || creativeData;
  const { personalInfo, education, certifications, achievements, languages } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  const currentTheme = COLOR_THEMES[currentColorIndex];
  const skillGroups = categorizeSkills(portfolioData.skills);
  const contactItems = getContactItems(personalInfo);
  const yrs = yearsOfExperience(portfolioData.experience);
  const projCount = portfolioData.projects?.length || 0;

  const nameParts = personalInfo.name.trim().split(" ");
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(" ");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setCurrentColorIndex((prev) => (prev + 1) % COLOR_THEMES.length), 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const go = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="relative min-h-[80vh] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000`} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={reduce ? undefined : { y: [0, -30, 0], x: [0, Math.sin(i) * 20, 0], rotate: [0, 360] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className={`absolute w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full opacity-20`}
                  style={{ left: `${10 + i * 15}%`, top: `${20 + i * 10}%` }}
                />
              ))}
            </div>
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                    <div className="space-y-6">
                      {personalInfo.title && (
                        <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white border-0 px-5 py-2 text-base md:text-lg`}>
                          <Sparkles className="w-4 h-4 mr-2" />{personalInfo.title}
                        </Badge>
                      )}
                      <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-none break-words">
                        <span className="block text-gray-900">{firstName}</span>
                        {restName && <span className={`block bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>{restName}</span>}
                      </h1>
                      <div className={`h-2 w-40 bg-gradient-to-r ${currentTheme.primary} rounded-full`} />
                    </div>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">{personalInfo.about}</p>
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={() => go("projects")} size="lg" className={`bg-gradient-to-r ${currentTheme.primary} hover:scale-105 text-white px-8 py-4 rounded-full shadow-xl transition-all duration-300`}>
                        <Eye className="w-5 h-5 mr-2" />Explore My Work
                      </Button>
                      <Button onClick={() => go("contact")} size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-4 rounded-full transition-all duration-300">
                        <Heart className="w-5 h-5 mr-2" />Let's Create
                      </Button>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative">
                    <div className="relative w-full max-w-md mx-auto">
                      <motion.div animate={reduce ? undefined : { rotate: [0, 3, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative bg-white p-5 sm:p-6 rounded-3xl shadow-2xl rotate-3">
                        <div className="aspect-square rounded-2xl overflow-hidden">
                          <ImageWithFallback src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
                        </div>
                      </motion.div>
                      <motion.div animate={reduce ? undefined : { y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center shadow-lg`}>
                        <Brush className="w-7 h-7 text-white" />
                      </motion.div>
                      {projCount > 0 && (
                        <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl p-5 shadow-xl">
                          <div className="text-center">
                            <div className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>{projCount}+</div>
                            <div className="text-gray-600 text-sm">Projects</div>
                          </div>
                        </div>
                      )}
                      {yrs > 0 && (
                        <div className="absolute -top-6 -left-4 sm:-left-6 bg-white rounded-2xl p-5 shadow-xl">
                          <div className="text-center">
                            <div className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>{yrs}+</div>
                            <div className="text-gray-600 text-sm">Years</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="flex justify-center items-center gap-4 mt-16">
                  <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" size="sm" className="rounded-full" aria-label={isPlaying ? "Pause palette" : "Play palette"}>
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="flex gap-3">
                    {COLOR_THEMES.map((theme, index) => (
                      <motion.button key={index} onClick={() => setCurrentColorIndex(index)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} aria-label={`${theme.name} palette`} className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.primary} ${index === currentColorIndex ? "ring-4 ring-gray-400" : ""} transition-all duration-300`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-12 md:py-16`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="THE ARTIST" {...SECTION_HEADER_BASE} dividerClass={`h-2 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden"><CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">My Story</h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">{personalInfo.about}</p>
                    {personalInfo.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                        <span className="text-gray-700">{personalInfo.location}</span>
                      </div>
                    )}
                    {languages?.length > 0 && (
                      <div className="flex items-start gap-3 mt-4">
                        <Globe className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                        <div className="flex flex-wrap gap-2">
                          {languages.map((l, i) => (
                            <Badge key={i} variant="outline" className="border-gray-200 text-gray-700">{l.name} · {l.level}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent></Card>
                  {education?.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3"><GraduationCap className="w-7 h-7 text-orange-500" /> Education</h3>
                      <div className="space-y-5">
                        {education.map((edu, i) => (
                          <div key={i} className="border-l-2 border-orange-200 pl-4">
                            <div className="font-bold text-gray-900">{edu.degree}</div>
                            <div className="text-orange-600">{edu.institution}</div>
                            <div className="text-sm text-gray-500">{edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent></Card>
                  )}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Awards &amp; Recognition</h3>
                    {achievements?.length > 0 ? (
                      <div className="space-y-6">
                        {achievements.map((a, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mt-1 shrink-0`}><Award className="w-6 h-6 text-white" /></div>
                            <div>
                              <h4 className="font-bold text-gray-900">{a.title}</h4>
                              {a.description && <p className="text-gray-600 text-sm">{a.description}</p>}
                              {a.startDate && <span className="text-orange-500 text-sm font-medium">{formatDateRange(a.startDate, undefined, false).replace(/\s*-\s*$/, "")}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No awards added yet.</p>
                    )}
                  </CardContent></Card>
                  {certifications?.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Certifications</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {certifications.map((c, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.03, y: -2 }} className={`bg-gradient-to-r ${currentTheme.primary} rounded-xl p-4 text-white shadow-lg`}>
                            <div className="font-semibold">{c.name}</div>
                            {c.issuer && <div className="text-white/80 text-sm">{c.issuer}</div>}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent></Card>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-12 md:py-16`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="CREATIVE TOOLKIT" {...SECTION_HEADER_BASE} dividerClass={`h-2 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
              {skillGroups.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {skillGroups.map((group, index) => {
                      const Icon = SKILL_ICONS[index % SKILL_ICONS.length];
                      return (
                        <motion.div key={group.name} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl h-full"><CardContent className="p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-6">
                              <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center shrink-0`}><Icon className="w-8 h-8 text-white" /></div>
                              <div>
                                <h3 className="text-2xl font-bold">{group.name}</h3>
                                <p className="text-gray-600">{group.skills.length} skills</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">{skill}</Badge>
                              ))}
                            </div>
                          </CardContent></Card>
                        </motion.div>
                      );
                    })}
                  </div>
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Complete Skill Set</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {portfolioData.skills.map((skill, index) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ scale: 1.1, y: -2 }}>
                          <Badge className={`bg-gradient-to-r ${COLOR_THEMES[index % COLOR_THEMES.length].primary} text-white border-0 px-4 py-2 text-sm`}>{skill}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent></Card>
                </>
              ) : (
                <EmptyState icon={Palette} title="No skills added yet" description="Your creative toolkit will appear here once skills are added." />
              )}
            </div>
          </div>
        );

      case "projects":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-12 md:py-16`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="CREATIVE GALLERY" {...SECTION_HEADER_BASE} dividerClass={`h-2 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
              {projCount > 0 ? (
                <ProjectGrid items={portfolioData.projects} theme={currentTheme.projTheme} />
              ) : (
                <EmptyState icon={Camera} title="Gallery coming soon" description="Add projects to your profile to showcase your creative work here." />
              )}
            </div>
          </div>
        );

      case "experience":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-12 md:py-16`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="CREATIVE JOURNEY" {...SECTION_HEADER_BASE} dividerClass={`h-2 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
              {portfolioData.experience.length > 0 ? (
                <ExperienceTimeline items={portfolioData.experience} theme={currentTheme.expTheme} />
              ) : (
                <EmptyState icon={Briefcase} title="No experience yet" description="Add your work experience to showcase your professional journey." />
              )}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-12 md:py-16`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="LET'S CREATE MAGIC" {...SECTION_HEADER_BASE} dividerClass={`h-2 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                  {contactItems.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Get In Touch</h3>
                      <div className="space-y-4">
                        {contactItems.map((item) => (
                          <motion.a key={item.key} href={item.href || "#"} whileHover={{ x: 8 }} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                            <div className={`w-14 h-14 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shrink-0`}><item.Icon className="w-6 h-6 text-white" /></div>
                            <div className="min-w-0">
                              <div className="text-gray-500 text-sm">{item.label}</div>
                              <div className="text-gray-900 font-semibold truncate">{item.value}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto transition-colors shrink-0" />
                          </motion.a>
                        ))}
                      </div>
                    </CardContent></Card>
                  )}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Follow My Journey</h3>
                    <SocialLinks
                      links={personalInfo.socialLinks}
                      itemClassName="w-14 h-14 bg-gray-100 hover:bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                      iconClassName="w-6 h-6"
                    />
                  </CardContent></Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <Card className={`bg-gradient-to-br ${currentTheme.primary} text-white border-0 shadow-xl rounded-3xl overflow-hidden h-full`}><CardContent className="p-8 text-center h-full flex flex-col justify-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"><Heart className="w-12 h-12 text-white" /></div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Something Amazing?</h3>
                    <p className="text-white/90 mb-8 leading-relaxed text-lg">Let's collaborate and bring your vision to life.</p>
                    <div className="space-y-4">
                      {personalInfo.email && (
                        <Button asChild className="w-full bg-white text-gray-800 hover:bg-gray-100 py-4 text-lg rounded-full">
                          <a href={`mailto:${personalInfo.email}`}><Sparkles className="w-5 h-5 mr-2" />Start a Project</a>
                        </Button>
                      )}
                      <ResumeButton data={portfolioData} label="Download Resume" className="w-full border-white text-white hover:bg-white/10 bg-transparent py-4 text-lg rounded-full" />
                    </div>
                  </CardContent></Card>
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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center shrink-0`}><Brush className="w-5 h-5 text-white" /></div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black truncate">{personalInfo.name}</h1>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Creative Magazine</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              {NAV_ITEMS.map((item) => (
                <motion.button key={item.id} onClick={() => go(item.id)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full transition-all duration-200 ${activeSection === item.id ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg` : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.nav
              initial={reduce ? undefined : { height: 0, opacity: 0 }}
              animate={reduce ? undefined : { height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button key={item.id} onClick={() => go(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeSection === item.id ? `bg-gradient-to-r ${currentTheme.primary} text-white` : "text-gray-600 hover:bg-gray-100"}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
    </div>
  );
}
