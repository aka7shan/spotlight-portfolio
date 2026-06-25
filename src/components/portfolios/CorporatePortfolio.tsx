import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import {
  Target, Users, TrendingUp, Zap, GraduationCap, Award, Trophy, Globe,
  Folder, Briefcase, ChevronRight, Handshake, MessageSquare, MapPin, Code,
} from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { corporateData } from "../../constants/portfolioData";
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
import { corporateTheme } from "./shared/theme";
import { computeStats, categorizeSkills, getContactItems } from "./shared/portfolioHelpers";
import { formatDateRange } from "../../utils/formatDate";

const SECTION_MOTION = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const SKILL_ICONS = [Target, Users, TrendingUp, Zap];
const yearOf = (d?: string) => (d ? new Date(d).getFullYear() : "");

export function CorporatePortfolio({ data = corporateData }: PortfolioProps) {
  const portfolioData = data || corporateData;
  const { personalInfo, education, certifications, achievements, languages } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");

  const skillGroups = categorizeSkills(portfolioData.skills);
  const contactItems = getContactItems(personalInfo);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            <motion.div {...SECTION_MOTION} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  {personalInfo.location && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-5 py-2.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm">{personalInfo.location}</span>
                    </div>
                  )}
                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">{personalInfo.name}</h1>
                  <div className="relative">
                    <p className="text-xl md:text-2xl text-blue-600 font-semibold">{personalInfo.title}</p>
                    <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">{personalInfo.about}</p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setActiveSection("projects")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4">
                    <Folder className="w-4 h-4 mr-2" />View Portfolio
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection("contact")} className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4">
                    <MessageSquare className="w-4 h-4 mr-2" />Get In Touch
                  </Button>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -inset-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                    <ImageWithFallback src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <StatGrid
              stats={computeStats(portfolioData)}
              max={4}
              itemClassName="p-6 bg-white rounded-xl shadow-lg border border-gray-100 text-center"
              valueClassName="text-3xl font-bold text-gray-900"
              labelClassName="text-sm text-gray-600 mt-1"
            />

            {achievements?.length > 0 && (
              <motion.div {...SECTION_MOTION} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0"><Trophy className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Key Achievements</h3>
                    <p className="text-gray-600">Recognitions and milestones</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-white" /></div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900">{a.title}</h4>
                          {(a.organization || a.startDate) && (
                            <p className="text-sm text-blue-600">{[a.organization, yearOf(a.startDate)].filter(Boolean).join(" · ")}</p>
                          )}
                        </div>
                      </div>
                      {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );

      case "about":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-12">
            <SectionHeader title="Professional Profile" {...corporateTheme.header} />
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"><CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed">{personalInfo.about}</p>
            </CardContent></Card>

            <div className="grid lg:grid-cols-2 gap-8">
              {education?.length > 0 && (
                <Card className="border-gray-200"><CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" /> Education</h3>
                  <div className="space-y-5">
                    {education.map((edu, i) => (
                      <div key={i} className="border-l-2 border-blue-200 pl-4">
                        <div className="font-semibold text-gray-900">{edu.degree}</div>
                        <div className="text-blue-600">{edu.institution}</div>
                        <div className="text-sm text-gray-500">{edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              )}
              {certifications?.length > 0 && (
                <Card className="border-gray-200"><CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Certifications</h3>
                  <div className="space-y-4">
                    {certifications.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                        <div>
                          <div className="text-gray-900 font-medium">{c.name}</div>
                          <div className="text-sm text-gray-500">{[c.issuer, c.date || yearOf(c.startDate)].filter(Boolean).join(" · ")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              )}
            </div>

            {languages?.length > 0 && (
              <Card className="border-gray-200"><CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /> Languages</h3>
                <div className="flex flex-wrap gap-3">
                  {languages.map((l, i) => (
                    <Badge key={i} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1.5">
                      {l.name} <span className="text-blue-400 ml-1.5">· {l.level}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent></Card>
            )}
          </motion.div>
        );

      case "skills":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-12">
            <SectionHeader title="Core Competencies" {...corporateTheme.header} />
            {skillGroups.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {skillGroups.map((group, index) => {
                    const Icon = SKILL_ICONS[index % SKILL_ICONS.length];
                    return (
                      <motion.div key={group.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
                        <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0"><Icon className="w-7 h-7 text-white" /></div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                                <p className="text-gray-600 text-sm">{group.skills.length} competencies</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">{skill}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Skills &amp; Technologies</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {portfolioData.skills.map((skill, index) => (
                      <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }} whileHover={{ scale: 1.05 }} className="bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-gray-800 font-medium">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState icon={Code} title="No competencies added yet" description="Skills and expertise areas will appear here once added." />
            )}
          </motion.div>
        );

      case "projects":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-12">
            <SectionHeader title="Portfolio" {...corporateTheme.header} />
            {portfolioData.projects.length > 0 ? (
              <ProjectGrid items={portfolioData.projects} theme={corporateTheme.project} />
            ) : (
              <EmptyState icon={Folder} title="No projects yet" description="Projects and initiatives will be showcased here once added." />
            )}
          </motion.div>
        );

      case "experience":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-12">
            <SectionHeader title="Experience" {...corporateTheme.header} />
            {portfolioData.experience.length > 0 ? (
              <ExperienceTimeline items={portfolioData.experience} theme={corporateTheme.experience} />
            ) : (
              <EmptyState icon={Briefcase} title="No experience yet" description="Leadership roles and positions will appear here once added." />
            )}
          </motion.div>
        );

      case "contact":
        return (
          <motion.div {...SECTION_MOTION} className="space-y-12">
            <SectionHeader title="Get In Touch" {...corporateTheme.header} />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-8">
                {contactItems.length > 0 && (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"><CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h3>
                    <div className="space-y-4">
                      {contactItems.map((item) => (
                        <motion.a key={item.key} href={item.href || "#"} whileHover={{ x: 5 }} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><item.Icon className="w-6 h-6 text-white" /></div>
                          <div className="min-w-0">
                            <div className="text-gray-500 text-sm">{item.label}</div>
                            <div className="text-gray-900 font-semibold truncate group-hover:text-blue-600 transition-colors">{item.value}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto transition-colors shrink-0" />
                        </motion.a>
                      ))}
                    </div>
                  </CardContent></Card>
                )}
                <Card className="border-gray-200"><CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Network</h3>
                  <SocialLinks
                    links={personalInfo.socialLinks}
                    itemClassName="w-14 h-14 bg-gray-100 hover:bg-blue-600 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                    iconClassName="w-6 h-6"
                  />
                </CardContent></Card>
              </div>
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0"><CardContent className="p-8 text-center flex flex-col justify-center h-full">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"><Handshake className="w-10 h-10 text-white" /></div>
                <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">Open to new opportunities and collaborations. Reach out to start a conversation.</p>
                <div className="space-y-4">
                  {personalInfo.email && (
                    <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3">
                      <a href={`mailto:${personalInfo.email}`}><MessageSquare className="w-4 h-4 mr-2" />Send a Message</a>
                    </Button>
                  )}
                  <ResumeButton data={portfolioData} className="w-full border-white text-white hover:bg-white/10 bg-transparent" />
                </div>
              </CardContent></Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <PortfolioShell
      className={corporateTheme.pageBg}
      sidebar={
        <PortfolioSidebar
          items={corporateTheme.navItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          theme={corporateTheme.sidebar}
          title={personalInfo.name.split(" ")[0]}
        />
      }
    >
      <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
    </PortfolioShell>
  );
}
