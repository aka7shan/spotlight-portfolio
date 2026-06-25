import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";
import {
  Terminal, Eye, Send, ChevronRight, Code, Server, Database, Activity,
  MapPin, Globe, Briefcase, Folder, GraduationCap, Award,
} from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import type { PortfolioProps, Language } from "../../types/portfolio";
import { modernTechData } from "../../constants/portfolioData";
import { SectionHeader } from "./shared/SectionHeader";
import { ExperienceTimeline } from "./shared/ExperienceTimeline";
import { ProjectGrid } from "./shared/ProjectGrid";
import { SectionContainer } from "./shared/SectionContainer";
import { PortfolioShell } from "./shared/PortfolioShell";
import { PortfolioSidebar } from "./shared/PortfolioSidebar";
import { StatGrid } from "./shared/StatGrid";
import { SocialLinks } from "./shared/SocialLinks";
import { ResumeButton } from "./shared/ResumeButton";
import { EmptyState } from "./shared/EmptyState";
import { modernTechTheme } from "./shared/theme";
import { computeStats, categorizeSkills, getContactItems, yearsOfExperience } from "./shared/portfolioHelpers";
import { formatDateRange } from "../../utils/formatDate";

const SECTION_MOTION = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const SKILL_ICONS = [Code, Server, Database, Activity];
const LEVEL_PCT: Record<Language["level"], number> = {
  Beginner: 35,
  Intermediate: 60,
  Advanced: 80,
  Fluent: 95,
  Native: 100,
  Expert: 90,
};

const emptyDark = {
  iconWrapClassName: "w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4",
  iconClassName: "w-8 h-8 text-gray-500",
  titleClassName: "text-xl font-semibold text-gray-400 mb-2",
  descriptionClassName: "text-gray-500",
};

export function ModernTechPortfolio({ data = modernTechData }: PortfolioProps) {
  const portfolioData = data || modernTechData;
  const { personalInfo, education, languages, certifications } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [isTyping, setIsTyping] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState("");

  const skillGroups = categorizeSkills(portfolioData.skills);
  const contactItems = getContactItems(personalInfo);
  const yrs = yearsOfExperience(portfolioData.experience);

  const skillsStr = (n: number) => portfolioData.skills.slice(0, n).map((s) => `"${s}"`).join(", ");
  const codeSnippets = [
    { code: `const developer = { name: "${personalInfo.name}", role: "${personalInfo.title}", skills: [${skillsStr(3)}], buildAmazingThings() { return "Let's create something incredible!"; }}; console.log(developer.buildAmazingThings());` },
    { code: `class Developer:\n    def __init__(self):\n        self.name = "${personalInfo.name}"\n        self.role = "${personalInfo.title}"\n    def code(self): return "Building the future"\ndev = Developer()\nprint(dev.code())` },
  ];

  useEffect(() => {
    let snip = codeSnippets[Math.floor(Math.random() * codeSnippets.length)], idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeCode = () => {
      if (idx < snip.code.length) {
        setCodeSnippet(snip.code.substring(0, ++idx));
        timer = setTimeout(typeCode, 30);
      } else {
        setIsTyping(false);
        timer = setTimeout(() => {
          setCodeSnippet(""); setIsTyping(true); idx = 0;
          snip = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          typeCode();
        }, 5000);
      }
    };
    typeCode();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facts: { Icon: typeof MapPin; text: string }[] = [];
  if (personalInfo.location) facts.push({ Icon: MapPin, text: personalInfo.location });
  if (yrs > 0) facts.push({ Icon: Briefcase, text: `${yrs}+ years experience` });
  if (languages?.length) facts.push({ Icon: Globe, text: languages.map((l) => l.name).join(", ") });

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-12">
            <motion.div {...SECTION_MOTION} className="text-center space-y-6">
              <div className="relative mx-auto w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-75 blur-md" />
                <ImageWithFallback
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="relative w-full h-full rounded-full object-cover border-4 border-gray-800 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{personalInfo.name}</h1>
              <p className="text-xl text-blue-400 font-medium">{personalInfo.title}</p>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">{personalInfo.about}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => setActiveSection("projects")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"><Eye className="w-4 h-4 mr-2" />View Projects</Button>
                <Button variant="outline" onClick={() => setActiveSection("contact")} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"><Send className="w-4 h-4 mr-2" />Get In Touch</Button>
              </div>
            </motion.div>

            <StatGrid
              stats={computeStats(portfolioData)}
              max={4}
              itemClassName="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center"
              valueClassName="text-2xl font-bold text-white"
              labelClassName="text-sm text-gray-400 mt-1"
            />

            <motion.div {...SECTION_MOTION} transition={{ delay: 0.3 }}>
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
                      {isTyping && <span className="animate-pulse bg-blue-400 text-blue-400">&#9608;</span>}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );

      case "about":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-8">
            <SectionHeader title="About Me" {...modernTechTheme.header} />
            <p className="text-gray-300 leading-relaxed text-lg">{personalInfo.about}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {facts.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700"><CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    {facts.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <f.Icon className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-gray-300">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              )}
              {languages?.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700"><CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
                  <div className="space-y-3">
                    {languages.map((lang, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{lang.name}</span>
                          <span className="text-blue-400">{lang.level}</span>
                        </div>
                        <Progress value={LEVEL_PCT[lang.level] ?? 60} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              )}
            </div>
            {education?.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700"><CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-400" /> Education</h3>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-gray-700 pl-4">
                      <div className="text-white font-medium">{edu.degree}</div>
                      <div className="text-sm text-blue-400">{edu.institution}</div>
                      <div className="text-xs text-gray-500">{edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}</div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            )}
            {certifications?.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700"><CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-blue-400" /> Certifications</h3>
                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                      <div>
                        <div className="text-gray-200">{cert.name}</div>
                        <div className="text-xs text-gray-500">{cert.issuer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            )}
          </motion.div>
        );

      case "skills":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-8">
            <SectionHeader title="Tech Stack" {...modernTechTheme.header} />
            {skillGroups.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {skillGroups.map((group, index) => {
                    const Icon = SKILL_ICONS[index % SKILL_ICONS.length];
                    return (
                      <motion.div key={group.name} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                        <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-blue-400" /></div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{group.name}</h3>
                                <p className="text-sm text-gray-400">{group.skills.length} technologies</p>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {group.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-gray-900/50 border-gray-600 text-gray-300">{skill}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">All Technologies</h3>
                  <div className="flex flex-wrap gap-3">
                    {portfolioData.skills.map((skill, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.08, y: -2 }}>
                        <Badge variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-300 transition-colors text-sm py-1 px-3">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState icon={Code} title="No skills added yet" description="Technologies will appear here once added to your profile." {...emptyDark} />
            )}
          </motion.div>
        );

      case "projects":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-8">
            <SectionHeader title="Featured Projects" {...modernTechTheme.header} />
            {portfolioData.projects.length > 0 ? (
              <ProjectGrid items={portfolioData.projects} theme={modernTechTheme.project} />
            ) : (
              <EmptyState icon={Folder} title="No projects yet" description="Projects will appear here once added to your profile." {...emptyDark} />
            )}
          </motion.div>
        );

      case "experience":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-8">
            <SectionHeader title="Work Experience" {...modernTechTheme.header} />
            {portfolioData.experience.length > 0 ? (
              <ExperienceTimeline items={portfolioData.experience} theme={modernTechTheme.experience} />
            ) : (
              <EmptyState icon={Briefcase} title="No experience yet" description="Your work history will appear here once added." {...emptyDark} />
            )}
          </motion.div>
        );

      case "contact":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-8">
            <SectionHeader title="Let's Connect" {...modernTechTheme.header} />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">Ready to bring your ideas to life? I'm always excited to discuss new projects and collaborate on innovative solutions.</p>
                {contactItems.length > 0 && (
                  <div className="space-y-4">
                    {contactItems.map((item) => (
                      <motion.a key={item.key} href={item.href || "#"} whileHover={{ x: 5 }} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group">
                        <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center shrink-0"><item.Icon className="w-6 h-6 text-blue-400" /></div>
                        <div className="min-w-0">
                          <div className="text-gray-400 text-sm">{item.label}</div>
                          <div className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{item.value}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 ml-auto transition-colors shrink-0" />
                      </motion.a>
                    ))}
                  </div>
                )}
                <SocialLinks
                  links={personalInfo.socialLinks}
                  itemClassName="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                />
              </div>
              <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/30">
                <CardContent className="p-8 text-center space-y-6 flex flex-col justify-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto"><Send className="w-8 h-8 text-white" /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Start Something Great?</h3>
                    <p className="text-gray-300">Let's discuss your next big idea.</p>
                  </div>
                  <div className="space-y-3">
                    {personalInfo.email && (
                      <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <a href={`mailto:${personalInfo.email}`}><Send className="w-4 h-4 mr-2" />Send Message</a>
                      </Button>
                    )}
                    <ResumeButton data={portfolioData} className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent" />
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
    <PortfolioShell
      className={modernTechTheme.pageBg}
      sidebar={
        <PortfolioSidebar
          items={modernTechTheme.navItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          theme={modernTechTheme.sidebar}
          title={personalInfo.name.split(" ")[0]}
        />
      }
    >
      <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
    </PortfolioShell>
  );
}
