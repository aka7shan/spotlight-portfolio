import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motion } from "framer-motion";

interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  projects: {
    name: string;
    description: string;
    tags: string[];
    image?: string;
    link?: string;
  }[];
}

interface CorporatePortfolioProps {
  data: PortfolioData;
}

export function CorporatePortfolio({ data }: CorporatePortfolioProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [darkMode, setDarkMode] = useState(false);

  const sections = ['overview', 'qualifications', 'experience', 'projects', 'contact'];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry. I will respond within 24 hours.');
    setContactForm({ name: '', email: '', company: '', message: '' });
  };

  const skillLevels = [
    { name: 'Leadership', level: 95 },
    { name: 'Project Management', level: 90 },
    { name: 'Strategic Planning', level: 85 },
    { name: 'Team Building', level: 92 },
    { name: 'Business Development', level: 88 },
    { name: 'Analytics', level: 80 }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-slate-800' : 'bg-slate-900'} text-white sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium">{data.name}</h1>
              <p className="text-gray-300">{data.title}</p>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === section
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className={`w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} h-screen sticky top-20 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8`}>
          <div className="text-center mb-8">
            <div className={`w-32 h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mx-auto mb-4 flex items-center justify-center`}>
              <span className="text-2xl">{data.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-medium mb-2">{data.name}</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{data.title}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Email:</strong> {data.email}
                </div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Phone:</strong> {data.phone}
                </div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Location:</strong> {data.location}
                </div>
              </div>
            </div>
            
            <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />
            
            <div>
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => scrollToSection('contact')}
                >
                  📧 Schedule Meeting
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  📄 Download Resume
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  🔗 LinkedIn Profile
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Overview Section */}
          <section id="overview" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg mb-6`}>
                    {data.about}
                  </p>
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-semibold text-blue-600">10+</div>
                      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Years Experience</div>
                    </div>
                    <div>
                      <div className="text-3xl font-semibold text-green-600">50+</div>
                      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Projects Completed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-semibold text-purple-600">25+</div>
                      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Team Members Led</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Qualifications Section */}
          <section id="qualifications" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-2xl">Core Competencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-4">Skills Assessment</h3>
                      <div className="space-y-4">
                        {skillLevels.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{skill.name}</span>
                              <span className="text-sm font-medium">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Technical Skills</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {data.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="justify-center py-2">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-medium">{exp.position}</h3>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {exp.duration}
                          </Badge>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="secondary" className="text-xs">Leadership</Badge>
                          <Badge variant="secondary" className="text-xs">Strategy</Badge>
                          <Badge variant="secondary" className="text-xs">Team Management</Badge>
                        </div>
                        {index < data.experience.length - 1 && (
                          <Separator className={`mt-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-2xl">Key Projects &amp; Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {data.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}>
                          {project.image && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <ImageWithFallback
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-6">
                            <h4 className="font-medium mb-2">{project.name}</h4>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-4">Let's discuss opportunities</h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                        I'm always open to discussing new projects, partnerships, and career opportunities. 
                        Please feel free to reach out for a confidential conversation.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                          <span className="text-sm">{data.email}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                          <span className="text-sm">{data.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                          <span className="text-sm">{data.location}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <Input
                            placeholder="Your Name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Company (Optional)"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Your Message"
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Send Professional Inquiry
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}