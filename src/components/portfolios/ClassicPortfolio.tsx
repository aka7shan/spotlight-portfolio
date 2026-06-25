import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";
import { motion } from "framer-motion";
import {
  Heart, Target, Palette, Crown, Folder, Briefcase,
  GraduationCap, Award, Trophy, MapPin, Globe, ChevronRight, Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PortfolioProps } from "../../types/portfolio";
import { classicData } from "../../constants/portfolioData";
import { ClassicHero } from "./shared/ClassicHero";
import { ClassicQuoteSection } from "./shared/ClassicQuoteSection";
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
import { classicTheme } from "./shared/theme";
import { computeStats, categorizeSkills, getContactItems, yearsOfExperience } from "./shared/portfolioHelpers";
import { formatDateRange } from "../../utils/formatDate";
import { inspirationalQuotes, classicColorPalette } from "./shared/ClassicConstants";
import { getTimeOfDay } from "./shared/ClassicUtils";

const SKILL_ICONS: LucideIcon[] = [Target, Palette, Crown, Heart];

export function ClassicPortfolio({ data = classicData }: PortfolioProps) {
  const portfolioData = data || classicData;
  const { personalInfo, education, languages, certifications, achievements } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("");

  const skillGroups = categorizeSkills(portfolioData.skills);
  const contactItems = getContactItems(personalInfo);

  useEffect(() => {
    const id = setInterval(() => setCurrentQuote((p) => (p + 1) % inspirationalQuotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const id = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(id);
  }, []);

  const aboutFacts: { Icon: LucideIcon; text: string }[] = [];
  if (personalInfo.location) aboutFacts.push({ Icon: MapPin, text: personalInfo.location });
  if (languages?.length) aboutFacts.push({ Icon: Globe, text: languages.map((l) => l.name).join(", ") });
  const yrs = yearsOfExperience(portfolioData.experience);
  if (yrs > 0) aboutFacts.push({ Icon: Briefcase, text: `${yrs}+ years of experience` });

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            <ClassicHero
              personalInfo={personalInfo}
              timeOfDay={timeOfDay}
              onViewWork={() => setActiveSection("projects")}
              onContact={() => setActiveSection("contact")}
            />
            <ClassicQuoteSection quote={inspirationalQuotes[currentQuote].quote} author={inspirationalQuotes[currentQuote].author} />
            <StatGrid
              stats={computeStats(portfolioData)}
              max={4}
              className="py-12 border-t border-amber-200"
              valueClassName="text-4xl font-serif text-amber-700"
              labelClassName="text-sm text-gray-600 uppercase tracking-wider mt-2"
            />
          </div>
        );

      case "about":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <SectionHeader title="About Me" subtitle="The story behind the work" {...classicTheme.header} />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-6">My Story</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{personalInfo.about}</p>
                    {aboutFacts.length > 0 && (
                      <div className="space-y-4">
                        {aboutFacts.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <item.Icon className="w-5 h-5 text-amber-600 shrink-0" />
                            <span className="text-gray-700">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {education?.length > 0 && (
                  <Card className="bg-white border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-amber-600" /> Education
                      </h3>
                      <div className="space-y-5">
                        {education.map((edu, i) => (
                          <div key={i} className="border-l-2 border-amber-200 pl-4">
                            <div className="font-medium text-gray-900">{edu.degree}</div>
                            <div className="text-sm text-amber-700">{edu.institution}</div>
                            <div className="text-xs text-gray-500">
                              {edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-8">
                {languages?.length > 0 && (
                  <Card className="bg-white border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6">Languages</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {languages.map((lang, i) => (
                          <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <div className="font-medium text-gray-800">{lang.name}</div>
                            <div className="text-xs text-amber-600">{lang.level}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {certifications?.length > 0 && (
                  <Card className="bg-white border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-600" /> Certifications
                      </h3>
                      <div className="space-y-4">
                        {certifications.map((cert, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0" />
                            <div>
                              <div className="text-gray-800 font-medium">{cert.name}</div>
                              <div className="text-sm text-gray-500">{cert.issuer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {achievements?.length > 0 && (
                  <Card className="bg-white border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-600" /> Achievements
                      </h3>
                      <div className="space-y-4">
                        {achievements.map((ach, i) => (
                          <div key={i}>
                            <div className="text-gray-800 font-medium">{ach.title}</div>
                            <div className="text-sm text-gray-600">{ach.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        );

      case "skills":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <SectionHeader title="Skills & Expertise" subtitle="Tools and technologies I work with" {...classicTheme.header} />
            {skillGroups.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {skillGroups.map((group, index) => {
                    const Icon = SKILL_ICONS[index % SKILL_ICONS.length];
                    const color = classicColorPalette[index % classicColorPalette.length];
                    return (
                      <motion.div key={group.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                        <Card className="bg-white border-amber-200 hover:shadow-xl transition-all duration-300 h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r", color)}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-serif text-gray-900">{group.name}</h3>
                                <p className="text-sm text-gray-600">{group.skills.length} skills</p>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {group.skills.map((skill) => (
                                <Badge key={skill} className="bg-amber-50 text-amber-700 border border-amber-100">{skill}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  {portfolioData.skills.map((skill, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.08, y: -2 }}>
                      <Badge className={cn("text-white border-0 px-4 py-2 bg-gradient-to-r", classicColorPalette[i % classicColorPalette.length])}>{skill}</Badge>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={Target}
                title="No skills added yet"
                description="Skills will appear here once added to your profile."
                iconWrapClassName="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
                iconClassName="w-10 h-10 text-amber-500"
                titleClassName="text-2xl font-serif text-gray-400 mb-2"
              />
            )}
          </motion.div>
        );

      case "projects":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <SectionHeader title="Featured Works" subtitle="A collection of recent projects" {...classicTheme.header} />
            {portfolioData.projects.length > 0 ? (
              <ProjectGrid items={portfolioData.projects} theme={classicTheme.project} />
            ) : (
              <EmptyState
                icon={Folder}
                title="Portfolio coming soon"
                description="Add projects to your profile to showcase your work here."
                iconWrapClassName="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
                iconClassName="w-12 h-12 text-amber-500"
                titleClassName="text-2xl font-serif text-gray-400 mb-2"
              />
            )}
          </motion.div>
        );

      case "experience":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <SectionHeader title="Professional Journey" subtitle="Career milestones and achievements" {...classicTheme.header} />
            {portfolioData.experience.length > 0 ? (
              <ExperienceTimeline items={portfolioData.experience} theme={classicTheme.experience} />
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No experience added yet"
                description="Your work history will appear here once added."
                iconWrapClassName="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
                iconClassName="w-12 h-12 text-amber-500"
                titleClassName="text-2xl font-serif text-gray-400 mb-2"
              />
            )}
          </motion.div>
        );

      case "contact":
        return (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <SectionHeader title="Let's Create Together" subtitle="Ready to bring your vision to life?" {...classicTheme.header} />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              <div className="space-y-8">
                {contactItems.length > 0 && (
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6">Get In Touch</h3>
                      <div className="space-y-4">
                        {contactItems.map((item) => (
                          <motion.a
                            key={item.key}
                            href={item.href || "#"}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shrink-0">
                              <item.Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-gray-500 text-sm">{item.label}</div>
                              <div className="text-gray-800 font-medium truncate group-hover:text-amber-700 transition-colors">{item.value}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 ml-auto transition-colors shrink-0" />
                          </motion.a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {personalInfo.socialLinks && (
                  <Card className="bg-white border-amber-200">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif text-gray-900 mb-6">Follow My Work</h3>
                      <SocialLinks
                        links={personalInfo.socialLinks}
                        className="flex flex-wrap gap-4"
                        itemClassName="w-14 h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
                        iconClassName="w-6 h-6"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">Let's Create Something Beautiful</h3>
                  <p className="text-amber-100 mb-8 leading-relaxed">Ready to bring your vision to life? I'd love to hear about your project.</p>
                  <div className="space-y-4">
                    {personalInfo.email && (
                      <Button asChild className="w-full bg-white text-amber-600 hover:bg-amber-50">
                        <a href={`mailto:${personalInfo.email}`}><Mail className="w-4 h-4 mr-2" />Start a Conversation</a>
                      </Button>
                    )}
                    <ResumeButton data={portfolioData} className="w-full border-white text-white hover:bg-white/10 bg-transparent" />
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
      className={classicTheme.pageBg}
      sidebar={
        <PortfolioSidebar
          items={classicTheme.navItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          theme={classicTheme.sidebar}
          title={personalInfo.name.split(" ")[0]}
        />
      }
    >
      <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
    </PortfolioShell>
  );
}
