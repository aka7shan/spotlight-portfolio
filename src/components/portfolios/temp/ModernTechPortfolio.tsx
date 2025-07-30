import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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

interface ModernTechPortfolioProps {
  data: PortfolioData;
}

export function ModernTechPortfolio({ data }: ModernTechPortfolioProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [terminalText, setTerminalText] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Terminal typing effect
  useEffect(() => {
    const text = `> Welcome to ${data.name}'s portfolio\n> Loading profile...\n> Status: Available for hire\n> Type 'help' for commands`;
    let index = 0;
    const timer = setInterval(() => {
      setTerminalText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [data.name]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! I will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Matrix-like background */}
      <div className="fixed inset-0 opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {Math.random() > 0.5 ? '0' : '1'}
          </div>
        ))}
      </div>

      {/* Terminal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="ml-4 text-green-400 font-mono text-sm">portfolio.exe</span>
            </div>
            <div className="flex space-x-6">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-mono transition-colors ${
                    activeSection === section
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ./{section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-24 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="bg-gray-900 rounded-lg p-6 mb-8 font-mono text-sm">
                <div className="flex items-center mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-green-400">Terminal</span>
                </div>
                <div className="text-green-400 whitespace-pre-line">
                  {terminalText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
              <h1 className="text-6xl mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {data.name}
              </h1>
              <p className="text-2xl text-gray-300 mb-8">{data.title}</p>
              <div className="flex flex-wrap gap-6 text-sm mb-8">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {data.email}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {data.phone}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {data.location}
                </div>
              </div>
              <div className="flex space-x-4">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 font-mono"
                  onClick={() => scrollToSection('projects')}
                >
                  view_projects()
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 font-mono"
                  onClick={() => scrollToSection('contact')}
                >
                  contact_me()
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                  <div className="font-mono text-sm text-gray-400">
                    <div className="mb-2">{'{'}</div>
                    <div className="ml-4 mb-1">"status": "available",</div>
                    <div className="ml-4 mb-1">"passion": "coding",</div>
                    <div className="ml-4 mb-1">"coffee": "required"</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-12">
              <span className="text-blue-400 mr-4 text-2xl">01.</span>
              <h2 className="text-4xl text-blue-400 font-mono">about_me()</h2>
            </div>
            <div className="border border-gray-800 rounded-lg p-8 bg-gray-900/50">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="font-mono text-sm text-gray-400 mb-4">
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-400">description</span> = `
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg mb-6 pl-4">
                    {data.about}
                  </p>
                  <div className="font-mono text-sm text-gray-400 mb-4">`;;</div>
                  <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                    <div className="text-green-400 mb-2">// Core Values</div>
                    <div className="text-gray-300">
                      <div>• Clean, maintainable code</div>
                      <div>• Continuous learning</div>
                      <div>• User-centric design</div>
                      <div>• Team collaboration</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm">
                    <div className="text-green-400 mb-4">// Development Environment</div>
                    <div className="space-y-2">
                      <div><span className="text-blue-400">OS:</span> macOS / Linux</div>
                      <div><span className="text-blue-400">Editor:</span> VS Code</div>
                      <div><span className="text-blue-400">Terminal:</span> iTerm2</div>
                      <div><span className="text-blue-400">Version Control:</span> Git</div>
                      <div><span className="text-blue-400">Package Manager:</span> npm / yarn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-12">
              <span className="text-purple-400 mr-4 text-2xl">02.</span>
              <h2 className="text-4xl text-purple-400 font-mono">tech_stack()</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-purple-400 transition-all duration-300 text-center">
                    <div className="font-mono text-sm">
                      <span className="text-purple-400">{'<'}</span>
                      <span className="text-white mx-2">{skill}</span>
                      <span className="text-blue-400">{'/>'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-12">
              <span className="text-green-400 mr-4 text-2xl">03.</span>
              <h2 className="text-4xl text-green-400 font-mono">work_history()</h2>
            </div>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-green-400 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl text-green-400 font-mono mb-2">{exp.position}</h3>
                      <p className="text-gray-400 font-mono">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 font-mono">
                      {exp.duration}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm text-gray-400 mb-2">
                    <span className="text-green-400">/*</span> Role Description <span className="text-green-400">*/</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-12">
              <span className="text-yellow-400 mr-4 text-2xl">04.</span>
              <h2 className="text-4xl text-yellow-400 font-mono">my_projects()</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-gray-800 bg-gray-900/50 hover:border-yellow-400 transition-all duration-300 h-full">
                    {project.image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <ImageWithFallback
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="font-mono text-sm text-gray-400 mb-2">
                        <span className="text-yellow-400">function</span>{' '}
                        <span className="text-blue-400">{project.name.replace(/\s+/g, '_').toLowerCase()}</span>() {'{'}
                      </div>
                      <h3 className="text-xl text-yellow-400 font-mono mb-4 ml-4">{project.name}</h3>
                      <p className="text-gray-300 mb-6 ml-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6 ml-4">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700 font-mono text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="font-mono text-sm text-gray-400 mb-4">{'}'}</div>
                      <Button 
                        variant="outline" 
                        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-mono"
                      >
                        execute_project()
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-12">
              <span className="text-red-400 mr-4 text-2xl">05.</span>
              <h2 className="text-4xl text-red-400 font-mono">contact_me()</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="font-mono text-sm text-gray-400 mb-4">
                    <span className="text-red-400">const</span>{' '}
                    <span className="text-blue-400">contactInfo</span> = {'{'}
                  </div>
                  <div className="ml-4 space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-blue-400 font-mono mr-2">email:</span>
                      <span className="text-green-400 font-mono">"{data.email}"</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 font-mono mr-2">phone:</span>
                      <span className="text-green-400 font-mono">"{data.phone}"</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 font-mono mr-2">location:</span>
                      <span className="text-green-400 font-mono">"{data.location}"</span>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-gray-400">{'};'}</div>
                </div>
                <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-green-400 font-mono text-sm mb-4">// Available for:</div>
                  <div className="space-y-2 text-gray-300 font-mono text-sm">
                    <div>• Full-time opportunities</div>
                    <div>• Freelance projects</div>
                    <div>• Technical consulting</div>
                    <div>• Code reviews</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="font-mono text-sm text-gray-400 mb-6">
                    <span className="text-red-400">function</span>{' '}
                    <span className="text-blue-400">sendMessage</span>() {'{'}
                  </div>
                  <form onSubmit={handleContactSubmit} className="space-y-4 ml-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 font-mono"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 font-mono"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 font-mono resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 font-mono"
                    >
                      execute_send()
                    </Button>
                  </form>
                  <div className="font-mono text-sm text-gray-400 mt-4">{'}'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}