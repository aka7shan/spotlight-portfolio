import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Folder, ChevronDown, Mail, Coffee } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import type { PortfolioProps } from "../../types/portfolio";
import { minimalistData } from "../../constants/portfolioData";
import { SectionHeader } from "./shared/SectionHeader";
import { SectionContainer } from "./shared/SectionContainer";
import { StatGrid } from "./shared/StatGrid";
import { SocialLinks } from "./shared/SocialLinks";
import { ResumeButton } from "./shared/ResumeButton";
import { EmptyState } from "./shared/EmptyState";
import { computeStats, categorizeSkills, getContactItems, yearsOfExperience } from "./shared/portfolioHelpers";
import { formatDateRange } from "../../utils/formatDate";

const SECTIONS = [
  { id: "home", label: "Home", number: "01" },
  { id: "about", label: "About", number: "02" },
  { id: "skills", label: "Skills", number: "03" },
  { id: "projects", label: "Work", number: "04" },
  { id: "experience", label: "Path", number: "05" },
  { id: "contact", label: "Contact", number: "06" },
];

const HEADER_THEME = {
  titleClass: "text-3xl sm:text-4xl font-light text-gray-900",
  dividerClass: "w-16 h-px bg-gray-900 rounded-none",
  align: "center" as const,
};

export function MinimalistPortfolio({ data = minimalistData }: PortfolioProps) {
  const portfolioData = data || minimalistData;
  const { personalInfo, education, languages } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const skillGroups = categorizeSkills(portfolioData.skills);
  const contactItems = getContactItems(personalInfo);
  const yrs = yearsOfExperience(portfolioData.experience);

  const MinimalistSectionHeader = ({ number, title }: { number: string; title: string }) => (
    <div className="text-center space-y-4">
      <div className="text-sm text-gray-400 uppercase tracking-widest">{number}</div>
      <SectionHeader title={title} {...HEADER_THEME} />
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min((scrolled / maxScroll) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="relative min-h-[85vh] flex items-center justify-center bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-12">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <ImageWithFallback src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full" />
                </motion.div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-gray-900 break-words">{personalInfo.name}</h1>
                    <div className="w-24 h-px bg-gray-900 mx-auto" />
                    <p className="text-lg sm:text-xl text-gray-600 font-light tracking-wide">{personalInfo.title}</p>
                  </div>
                  <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto font-light">{personalInfo.about}</p>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4">
                    <Button onClick={() => setActiveSection("projects")} variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-none font-light">
                      View Work<ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={() => setActiveSection("contact")} variant="ghost" className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-none font-light">Get in Touch</Button>
                  </div>
                </div>

                <div className="pt-16 border-t border-gray-200">
                  <StatGrid
                    stats={computeStats(portfolioData)}
                    max={3}
                    itemClassName="text-center"
                    valueClassName="text-3xl font-light text-gray-900"
                    labelClassName="text-sm text-gray-500 uppercase tracking-wider mt-1"
                  />
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <ChevronDown className="w-6 h-6 text-gray-300" />
              </motion.div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="min-h-screen bg-white py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <MinimalistSectionHeader number="02" title="About" />
                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Story</h3>
                      <p className="text-gray-600 leading-relaxed font-light">{personalInfo.about}</p>
                    </div>
                    {languages?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-light text-gray-900 mb-6">Languages</h3>
                        <div className="space-y-3">
                          {languages.map((l, i) => (
                            <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100">
                              <span className="text-gray-700 font-light">{l.name}</span>
                              <span className="text-gray-400 font-light text-sm">{l.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-6">Details</h3>
                      <div className="space-y-4">
                        {personalInfo.location && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500 font-light">Location</span>
                            <span className="text-gray-900 font-light">{personalInfo.location}</span>
                          </div>
                        )}
                        {yrs > 0 && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500 font-light">Experience</span>
                            <span className="text-gray-900 font-light">{yrs}+ years</span>
                          </div>
                        )}
                        {personalInfo.email && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500 font-light">Email</span>
                            <span className="text-gray-900 font-light truncate ml-4">{personalInfo.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {education?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-light text-gray-900 mb-6">Education</h3>
                        <div className="space-y-4">
                          {education.map((edu, index) => (
                            <div key={index} className="space-y-1">
                              <div className="text-gray-900 font-light">{edu.degree}</div>
                              <div className="text-gray-500 text-sm font-light">{[edu.institution, edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)].filter(Boolean).join(" • ")}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="min-h-screen bg-gray-50 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <MinimalistSectionHeader number="03" title="Skills" />
                {skillGroups.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                      {skillGroups.map((group) => (
                        <div key={group.name}>
                          <h3 className="text-xl font-light text-gray-900 mb-8">{group.name}</h3>
                          <div className="space-y-3">
                            {group.skills.map((skill, index) => (
                              <motion.div key={skill} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="py-3 border-b border-gray-200 text-gray-700 font-light">
                                {skill}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-light text-gray-900 mb-8 text-center">Complete Set</h3>
                      <div className="flex flex-wrap justify-center gap-3">
                        {portfolioData.skills.map((skill, index) => (
                          <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }} whileHover={{ scale: 1.05 }}>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 font-light px-3 py-1 rounded-none">{skill}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState icon={Folder} title="No skills added yet" description="Skills will be displayed here once added to your profile." />
                )}
              </motion.div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="min-h-screen bg-white py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <MinimalistSectionHeader number="04" title="Selected Work" />
                {portfolioData.projects.length > 0 ? (
                  <div className="space-y-16 md:space-y-24">
                    {portfolioData.projects.map((project, index) => {
                      const href = project.link || project.githubLink;
                      return (
                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group">
                          <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}>
                            <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-400 font-light">0{index + 1}</span>
                                  <div className="flex-1 h-px bg-gray-200" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-light text-gray-900 group-hover:text-gray-600 transition-colors">{project.name}</h3>
                                <p className="text-gray-600 leading-relaxed font-light text-lg">{project.description}</p>
                                {project.tags?.length > 0 && (
                                  <div className="flex flex-wrap gap-3">
                                    {project.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="border-gray-300 text-gray-600 bg-transparent font-light px-3 py-1 rounded-none">{tag}</Badge>
                                    ))}
                                  </div>
                                )}
                                {href && (
                                  <div className="pt-4">
                                    <Button asChild variant="ghost" className="text-gray-900 hover:text-gray-600 p-0 h-auto font-light">
                                      <a href={href} target="_blank" rel="noopener noreferrer">View Project<ArrowRight className="w-4 h-4 ml-2" /></a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={index % 2 === 1 ? "md:col-start-1" : ""}>
                              {project.image ? (
                                <motion.div whileHover={{ scale: 1.02 }} className="aspect-video bg-gray-100 overflow-hidden">
                                  <ImageWithFallback src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                                </motion.div>
                              ) : (
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                  <Folder className="w-16 h-16 text-gray-300" />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState icon={Folder} title="No work to display" description="Projects will appear here once added." />
                )}
              </motion.div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="min-h-screen bg-gray-50 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <MinimalistSectionHeader number="05" title="Experience" />
                {portfolioData.experience.length > 0 ? (
                  <div className="space-y-12 md:space-y-16">
                    {portfolioData.experience.map((exp, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative border-l-2 border-gray-200 pl-8 pb-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full absolute -left-[7px] top-2" />
                        <div className="space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-light text-gray-900">{exp.position}</h3>
                              <p className="text-gray-600 font-light">{exp.company}</p>
                            </div>
                            <Badge variant="outline" className="w-fit border-gray-300 text-gray-600 bg-transparent font-light px-3 py-1 rounded-none">
                              {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-light">{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Briefcase} title="No experience to display" description="Experience will appear here once added." />
                )}
              </motion.div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="min-h-screen bg-white py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <MinimalistSectionHeader number="06" title="Contact" />
                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-8">Let's Work Together</h3>
                      <p className="text-gray-600 leading-relaxed font-light text-lg">I'm open to new opportunities and meaningful collaborations. Let's discuss how we can create something exceptional together.</p>
                    </div>
                    {contactItems.length > 0 && (
                      <div className="space-y-6">
                        {contactItems.map((item) => (
                          <motion.a key={item.key} href={item.href || "#"} whileHover={{ x: 5 }} className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition-colors group">
                            <item.Icon className="w-5 h-5 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-500 font-light">{item.label}</div>
                              <div className="font-light truncate">{item.value}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                          </motion.a>
                        ))}
                      </div>
                    )}
                    <div className="space-y-4">
                      <h3 className="text-xl font-light text-gray-900">Connect</h3>
                      <SocialLinks
                        links={personalInfo.socialLinks}
                        className="flex flex-wrap gap-4"
                        itemClassName="w-12 h-12 bg-gray-100 hover:bg-gray-900 flex items-center justify-center transition-colors text-gray-600 hover:text-white rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-8">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Coffee className="w-14 h-14 text-gray-400" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-light text-gray-900">Ready to Start?</h3>
                        <p className="text-gray-600 font-light">I'd love to hear about your project.</p>
                        <div className="flex flex-col items-center gap-3">
                          {personalInfo.email && (
                            <Button asChild variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-none font-light">
                              <a href={`mailto:${personalInfo.email}`}><Mail className="w-4 h-4 mr-2" />Send Message</a>
                            </Button>
                          )}
                          <ResumeButton data={portfolioData} variant="ghost" className="text-gray-600 hover:text-gray-900 rounded-none font-light" />
                        </div>
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

  const active = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="h-px bg-gray-200">
          <motion.div className="h-full bg-gray-900 origin-left" style={{ scaleX: scrollProgress / 100 }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-light uppercase tracking-wider truncate">{active?.number} — {active?.label}</div>
          <nav className="flex items-center gap-3">
            {SECTIONS.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={section.label}
                aria-current={activeSection === section.id ? "page" : undefined}
                title={section.label}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${activeSection === section.id ? "bg-gray-900 scale-125" : "bg-gray-300 hover:bg-gray-500"}`}
              />
            ))}
          </nav>
        </div>
      </header>

      <SectionContainer activeSection={activeSection}>{renderSection()}</SectionContainer>
    </div>
  );
}
