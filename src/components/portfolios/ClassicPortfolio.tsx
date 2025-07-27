import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
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

interface ClassicPortfolioProps {
  data: PortfolioData;
}

export function ClassicPortfolio({ data }: ClassicPortfolioProps) {
  const [activeSection, setActiveSection] = useState('introduction');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [currentQuote, setCurrentQuote] = useState(0);

  const sections = ['introduction', 'biography', 'expertise', 'experience', 'portfolio', 'correspondence'];

  const quotes = [
    "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
    "The expert in anything was once a beginner who refused to give up.",
    "Quality is not an act, it is a habit."
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your correspondence. I shall respond with utmost priority.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Elegant Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-serif text-xl">{data.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-lg font-serif text-amber-900">{data.name}</h1>
                <p className="text-sm text-amber-700 italic">{data.title}</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-serif transition-colors ${
                    activeSection === section
                      ? 'text-amber-900 border-b-2 border-amber-600'
                      : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="introduction" className="pt-16 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
              <span className="text-4xl text-white font-serif">{data.name.charAt(0)}</span>
            </div>
            <h1 className="text-5xl mb-4 text-amber-900 font-serif">{data.name}</h1>
            <p className="text-2xl text-amber-700 italic mb-8">{data.title}</p>
            <div className="max-w-2xl mx-auto">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="bg-white/70 rounded-lg p-6 shadow-md border border-amber-200 mb-8"
              >
                <p className="text-amber-800 italic font-serif text-lg">"{quotes[currentQuote]}"</p>
              </motion.div>
            </div>
            <div className="flex justify-center space-x-6 mb-8">
              <span className="text-amber-700 font-serif">{data.email}</span>
              <span className="text-amber-600">•</span>
              <span className="text-amber-700 font-serif">{data.phone}</span>
              <span className="text-amber-600">•</span>
              <span className="text-amber-700 font-serif">{data.location}</span>
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-serif shadow-lg"
                onClick={() => scrollToSection('portfolio')}
              >
                View My Work
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-600 text-amber-700 hover:bg-amber-100 px-8 py-3 rounded-full font-serif"
                onClick={() => scrollToSection('correspondence')}
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Biography Section */}
      <section id="biography" className="py-24 px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl text-amber-900 font-serif mb-4">Biography</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="bg-white rounded-lg p-8 shadow-lg border border-amber-200">
                  <p className="text-amber-800 leading-relaxed text-lg font-serif mb-6">
                    {data.about}
                  </p>
                  <p className="text-amber-700 font-serif">
                    With a dedication to excellence and a passion for continuous learning, 
                    I strive to create meaningful work that stands the test of time.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-lg p-6 text-center border border-amber-200">
                    <div className="text-3xl text-amber-600 font-serif mb-2">15+</div>
                    <div className="text-amber-700 font-serif text-sm">Years of Excellence</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-6 text-center border border-amber-200">
                    <div className="text-3xl text-amber-600 font-serif mb-2">100+</div>
                    <div className="text-amber-700 font-serif text-sm">Projects Completed</div>
                  </div>
                </div>
              </div>
              <div>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-6xl text-amber-800">📸</span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-amber-200">
                    <span className="text-2xl text-amber-600">✨</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl text-amber-900 font-serif mb-4">Areas of Expertise</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg border border-amber-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {data.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center cursor-pointer"
                  >
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-6 border border-amber-200 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-serif text-lg">
                          {skill.charAt(0)}
                        </span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-amber-100 text-amber-800 border-amber-200 font-serif px-4 py-2"
                      >
                        {skill}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl text-amber-900 font-serif mb-4">Professional Journey</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
              <div className="space-y-16">
                {data.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className="w-1/2 pr-8">
                      <div className="bg-white rounded-lg p-8 shadow-lg border border-amber-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl text-amber-900 font-serif mb-2">{exp.position}</h3>
                            <p className="text-amber-700 font-serif italic">{exp.company}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="border-amber-300 text-amber-700 font-serif"
                          >
                            {exp.duration}
                          </Badge>
                        </div>
                        <Separator className="my-4 bg-amber-200" />
                        <p className="text-amber-800 leading-relaxed font-serif">{exp.description}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg z-10">
                      <span className="text-white font-serif text-lg">{index + 1}</span>
                    </div>
                    <div className="w-1/2 pl-8">
                      {index % 2 === 0 ? (
                        <div className="text-right">
                          <div className="text-amber-700 font-serif italic">
                            "Achievement and excellence through dedication"
                          </div>
                        </div>
                      ) : (
                        <div className="text-left">
                          <div className="text-amber-700 font-serif italic">
                            "Continuous growth and learning"
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl text-amber-900 font-serif mb-4">Selected Works</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-white border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    {project.image && (
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-serif text-sm">{index + 1}</span>
                        </div>
                        <h3 className="text-2xl text-amber-900 font-serif">{project.name}</h3>
                      </div>
                      <p className="text-amber-800 font-serif mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="bg-amber-100 text-amber-800 border-amber-200 font-serif"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 font-serif"
                      >
                        View Project Details
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
      <section id="correspondence" className="py-24 px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl text-amber-900 font-serif mb-4">Correspondence</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="bg-white rounded-lg p-8 shadow-lg border border-amber-200 mb-8">
                  <h3 className="text-2xl text-amber-900 font-serif mb-6">I would be delighted to hear from you</h3>
                  <p className="text-amber-800 font-serif leading-relaxed mb-6">
                    Whether you have a project in mind, seek collaboration, or simply wish to connect, 
                    I welcome meaningful conversations and opportunities to create exceptional work together.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xs">✉</span>
                      </div>
                      <span className="text-amber-800 font-serif">{data.email}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xs">📞</span>
                      </div>
                      <span className="text-amber-800 font-serif">{data.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xs">📍</span>
                      </div>
                      <span className="text-amber-800 font-serif">{data.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-lg p-8 shadow-lg border border-amber-200">
                  <h3 className="text-2xl text-amber-900 font-serif mb-6">Send a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="border-amber-300 focus:border-amber-500 font-serif"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="border-amber-300 focus:border-amber-500 font-serif"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                        className="border-amber-300 focus:border-amber-500 font-serif"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        className="border-amber-300 focus:border-amber-500 font-serif resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-serif py-3 shadow-lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}