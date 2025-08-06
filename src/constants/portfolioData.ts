import type { PortfolioData } from '../types/portfolio';

// Comprehensive dummy data that matches real user profile structure
export const modernTechData: PortfolioData = {
  personalInfo: {
    name: "Alex Chen",
    title: "Full Stack Developer & UI/UX Designer",
    email: "alex.chen@example.com",
    phone: "+15551234567",
    location: "San Francisco, CA",
    about: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating intuitive user experiences and writing clean, efficient code. Always excited to learn new technologies and solve complex problems.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  skills: [
    "React", "TypeScript", "Node.js", "Python", "JavaScript", "HTML5", "CSS3", 
    "Next.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", 
    "Git", "GraphQL", "REST APIs", "Microservices", "CI/CD", "Jest", "Cypress",
    "Figma", "Adobe XD", "UI/UX Design", "Responsive Design", "Material-UI", "Tailwind CSS"
  ],
  experience: [
    {
      position: "Senior Full Stack Developer",
      company: "TechFlow Solutions",
      startDate: "2022-03-01",
      endDate: undefined,
      isPresent: true,
      description: "Led development of microservices architecture serving 100K+ users. Built React dashboards, optimized database queries, and mentored 3 junior developers. Implemented CI/CD pipelines reducing deployment time by 60%."
    },
    {
      position: "Full Stack Developer",
      company: "StartupHub Inc",
      startDate: "2020-06-15",
      endDate: "2022-02-28",
      isPresent: false,
      description: "Developed and maintained 5+ web applications using React and Node.js. Collaborated with design team to implement responsive UI components. Reduced page load times by 40% through code optimization."
    },
    {
      position: "Frontend Developer",
      company: "Digital Creatives",
      startDate: "2019-09-01",
      endDate: "2020-06-10",
      isPresent: false,
      description: "Created interactive web experiences for major brands. Worked with React, Vue.js, and vanilla JavaScript. Implemented pixel-perfect designs and ensured cross-browser compatibility."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      year: "2015 - 2019",
      gpa: "3.8/4.0"
    },
    {
      degree: "Full Stack Web Development Bootcamp",
      institution: "Le Wagon",
      year: "2019",
      gpa: "Distinction"
    }
  ],
  projects: [
    {
      name: "EcoTracker App",
      description: "A comprehensive sustainability tracking application that helps users monitor their carbon footprint, set eco-friendly goals, and connect with like-minded individuals. Built with React Native and Node.js.",
      tags: ["React Native", "Node.js", "MongoDB", "Socket.io", "Chart.js"],
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=300&fit=crop",
      link: "https://github.com/alexchen/ecotracker",
      status: "Completed"
    },
    {
      name: "TaskFlow Dashboard",
      description: "Modern project management dashboard with real-time collaboration features. Includes drag-and-drop task management, team chat, and progress analytics.",
      tags: ["React", "TypeScript", "Express.js", "PostgreSQL", "WebSocket"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      link: "https://taskflow-demo.com",
      status: "In Progress"
    },
    {
      name: "AI Recipe Generator",
      description: "Machine learning powered recipe suggestion app that creates personalized meal plans based on dietary preferences, available ingredients, and nutritional goals.",
      tags: ["Python", "TensorFlow", "React", "FastAPI", "Redis"],
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
      link: "https://github.com/alexchen/ai-recipes",
      status: "Completed"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-SA-2023-001"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2022",
      credentialId: "GCP-PD-2022-456"
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2023",
      credentialId: "CKA-2023-789"
    }
  ],
  achievements: [
    {
      title: "Tech Innovation Award",
      description: "Recognized for developing an AI-powered code review system that improved code quality by 35%",
      date: "2023"
    },
    {
      title: "Hackathon Winner",
      description: "First place in Bay Area DevHack 2022 for creating a real-time disaster response coordination app",
      date: "2022"
    },
    {
      title: "Open Source Contributor",
      description: "Active contributor to React ecosystem with 500+ GitHub stars across projects",
      date: "2021-Present"
    }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Mandarin", level: "Fluent" },
    { name: "Spanish", level: "Intermediate" },
    { name: "JavaScript", level: "Expert" }
  ]
};

export const creativeData: PortfolioData = {
  personalInfo: {
    name: "Maya Rodriguez",
    title: "Creative Director & Visual Designer",
    email: "maya.rodriguez@studio.com",
    phone: "+15559876543",
    location: "Brooklyn, NY",
    about: "Award-winning creative director with 8+ years of experience crafting compelling visual stories for global brands. I blend artistic vision with strategic thinking to create designs that not only look beautiful but drive real business results.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face"
  },
  skills: [
    "Visual Design", "Art Direction", "Brand Identity", "Illustration", "Typography", "Color Theory",
    "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "After Effects", "Figma",
    "Sketch", "Procreate", "Cinema 4D", "Blender", "Photography", "Video Editing",
    "Creative Strategy", "Design Systems", "User Experience", "Motion Graphics", "Print Design", "Digital Art"
  ],
  experience: [
    {
      position: "Creative Director",
      company: "Vibrant Studios",
      startDate: "2021-01-15",
      endDate: undefined,
      isPresent: true,
      description: "Lead creative vision for 20+ brand campaigns reaching millions of users. Manage team of 8 designers and collaborate with C-suite executives. Increased client retention by 45% through innovative design solutions."
    },
    {
      position: "Senior Visual Designer",
      company: "Brand Collective",
      startDate: "2019-04-01",
      endDate: "2021-01-10",
      isPresent: false,
      description: "Designed brand identities for Fortune 500 companies. Created comprehensive design systems and style guides. Led rebranding project that increased brand recognition by 60%."
    },
    {
      position: "Graphic Designer",
      company: "Creative House",
      startDate: "2017-08-01",
      endDate: "2019-03-25",
      isPresent: false,
      description: "Produced visual content for digital and print media. Specialized in packaging design and marketing materials. Worked with diverse clients from tech startups to luxury brands."
    }
  ],
  education: [
    {
      degree: "Master of Fine Arts in Graphic Design",
      institution: "Rhode Island School of Design",
      year: "2015 - 2017",
      gpa: "3.9/4.0"
    },
    {
      degree: "Bachelor of Arts in Visual Arts",
      institution: "Parsons School of Design",
      year: "2011 - 2015",
      gpa: "3.7/4.0"
    }
  ],
  projects: [
    {
      name: "Sunset Coffee Rebrand",
      description: "Complete brand transformation for a local coffee chain, including logo design, packaging, store design, and digital presence. The rebrand increased sales by 40% in the first quarter.",
      tags: ["Branding", "Packaging", "Print Design", "Illustration"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop",
      link: "https://behance.net/maya/sunset-coffee",
      status: "Completed"
    },
    {
      name: "Eco Fashion Campaign",
      description: "Visual campaign for sustainable fashion brand featuring hand-drawn illustrations and vibrant photography. Campaign reached 2M+ people across social platforms.",
      tags: ["Campaign Design", "Illustration", "Photography", "Social Media"],
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop",
      link: "https://behance.net/maya/eco-fashion",
      status: "Completed"
    },
    {
      name: "Tech Conference Identity",
      description: "Created dynamic visual identity for major tech conference including stage design, merchandise, and digital assets. Identity system used across 15+ touchpoints.",
      tags: ["Event Design", "Motion Graphics", "Print Design", "Digital"],
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop",
      link: "https://maya-design.com/tech-conf",
      status: "Completed"
    }
  ],
  certifications: [
    {
      name: "Adobe Certified Expert - Photoshop",
      issuer: "Adobe",
      date: "2023",
      credentialId: "ACE-PS-2023-001"
    },
    {
      name: "Google UX Design Certificate",
      issuer: "Google",
      date: "2022",
      credentialId: "GUX-2022-789"
    },
    {
      name: "Brand Strategy Certification",
      issuer: "Brand Institute",
      date: "2021",
      credentialId: "BSC-2021-456"
    }
  ],
  achievements: [
    {
      title: "Design Excellence Award",
      description: "Won 'Best Brand Identity' at the International Design Awards for Sunset Coffee rebrand",
      date: "2023"
    },
    {
      title: "Creative Leadership Recognition",
      description: "Featured in 'Top 30 Under 30 Creative Directors' by Design Magazine",
      date: "2022"
    },
    {
      title: "Client Impact Award",
      description: "Achieved 95% client satisfaction rate and 40% average increase in brand engagement",
      date: "2021"
    }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Native" },
    { name: "French", level: "Expert" },
    { name: "Visual Communication", level: "Expert" }
  ]
};

export const minimalistData: PortfolioData = {
  personalInfo: {
    name: "David Kim",
    title: "UX Designer & Product Strategist",
    email: "david.kim@design.co",
    phone: "+15554567890",
    location: "Seattle, WA",
    about: "Minimalist designer who believes in the power of simplicity. I create intuitive digital experiences that solve real problems through thoughtful research, strategic thinking, and clean design principles.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  skills: [
    "User Experience Design", "User Interface Design", "Product Strategy", "Design Systems", "Prototyping",
    "User Research", "Usability Testing", "Information Architecture", "Interaction Design", "Wireframing",
    "Figma", "Sketch", "Adobe XD", "Principle", "Framer", "InVision", "Miro", "Notion",
    "Design Thinking", "Agile Methodology", "Data Analysis", "A/B Testing", "Accessibility", "Typography"
  ],
  experience: [
    {
      position: "Senior UX Designer",
      company: "Minimal Co",
      startDate: "2021-05-01",
      endDate: undefined,
      isPresent: true,
      description: "Lead UX design for B2B SaaS platform with 50K+ users. Redesigned core workflows resulting in 30% increase in user engagement. Established design system used across 8 product teams."
    },
    {
      position: "Product Designer",
      company: "Clean Tech Solutions",
      startDate: "2019-02-15",
      endDate: "2021-04-30",
      isPresent: false,
      description: "Designed mobile and web experiences for clean energy platform. Conducted user research with 200+ participants. Improved conversion rates by 25% through iterative design improvements."
    },
    {
      position: "UX Designer",
      company: "Simple Apps",
      startDate: "2018-07-01",
      endDate: "2019-02-10",
      isPresent: false,
      description: "Created user interfaces for productivity applications. Specialized in minimalist design approaches. Reduced user onboarding time by 40% through simplified user flows."
    }
  ],
  education: [
    {
      degree: "Master of Design in Interaction Design",
      institution: "Carnegie Mellon University",
      year: "2016 - 2018",
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Science in Psychology",
      institution: "University of Washington",
      year: "2012 - 2016",
      gpa: "3.6/4.0"
    }
  ],
  projects: [
    {
      name: "Focus Timer App",
      description: "Minimalist productivity app that helps users maintain focus through clean design and intuitive interactions. Over 100K downloads with 4.8-star rating.",
      tags: ["Mobile App", "UX Design", "iOS", "Android"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      link: "https://focustimer.app",
      status: "Completed"
    },
    {
      name: "E-commerce Redesign",
      description: "Complete UX overhaul of fashion e-commerce platform. Simplified checkout process and improved product discovery, resulting in 35% increase in conversions.",
      tags: ["Web Design", "E-commerce", "User Research", "Conversion Optimization"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      link: "https://david-ux.com/ecommerce-case-study",
      status: "Completed"
    },
    {
      name: "Design System Framework",
      description: "Comprehensive design system for B2B software company. Created reusable components, guidelines, and documentation used by 12+ product teams.",
      tags: ["Design Systems", "Component Library", "Documentation", "Figma"],
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=300&fit=crop",
      link: "https://github.com/davidkim/design-system",
      status: "In Progress"
    }
  ],
  certifications: [
    {
      name: "Certified Usability Analyst",
      issuer: "Human Factors International",
      date: "2023",
      credentialId: "CUA-2023-001"
    },
    {
      name: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "2022",
      credentialId: "GUX-PRO-2022"
    },
    {
      name: "Design Thinking Certification",
      issuer: "IDEO U",
      date: "2021",
      credentialId: "DT-IDEO-2021"
    }
  ],
  achievements: [
    {
      title: "UX Innovation Award",
      description: "Recognized for creating accessible design solutions that improved usability for users with disabilities",
      date: "2023"
    },
    {
      title: "Product Impact Recognition",
      description: "Led design initiatives that increased overall product engagement by 40% across 3 major releases",
      date: "2022"
    },
    {
      title: "Design System Excellence",
      description: "Created design system adopted by 50+ designers, reducing design-to-development time by 60%",
      date: "2021"
    }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Korean", level: "Native" },
    { name: "Japanese", level: "Intermediate" },
    { name: "Design Language", level: "Expert" }
  ]
};

export const corporateData: PortfolioData = {
  personalInfo: {
    name: "Sarah Johnson",
    title: "VP of Engineering & Technology Strategy",
    email: "sarah.johnson@techcorp.com",
    phone: "+15552345678",
    location: "New York, NY",
    about: "Executive technology leader with 12+ years of experience scaling engineering teams and driving digital transformation. Proven track record of delivering enterprise solutions that generate $100M+ in revenue while building high-performing, diverse teams.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
  },
  skills: [
    "Engineering Leadership", "Technology Strategy", "Digital Transformation", "Team Building", "Agile Methodology",
    "Enterprise Architecture", "Cloud Computing", "DevOps", "Machine Learning", "Data Strategy",
    "AWS", "Azure", "Kubernetes", "Microservices", "API Design", "Security", "Compliance",
    "Project Management", "Stakeholder Management", "Budget Planning", "Vendor Management", "Risk Assessment", "Innovation Strategy"
  ],
  experience: [
    {
      position: "VP of Engineering",
      company: "TechCorp Solutions",
      startDate: "2020-01-01",
      endDate: undefined,
      isPresent: true,
      description: "Lead engineering organization of 150+ developers across 12 teams. Drove cloud migration saving $2M annually. Implemented DevOps practices reducing deployment time by 80%. Increased team diversity by 40% through strategic hiring initiatives."
    },
    {
      position: "Director of Technology",
      company: "Global Innovations Inc",
      startDate: "2017-09-01",
      endDate: "2019-12-31",
      isPresent: false,
      description: "Managed technology roadmap for $500M product portfolio. Led digital transformation initiative affecting 10,000+ employees. Architected microservices platform handling 1B+ requests daily. Delivered 15+ major product releases on time and budget."
    },
    {
      position: "Senior Engineering Manager",
      company: "Enterprise Systems Ltd",
      startDate: "2014-03-15",
      endDate: "2017-08-30",
      isPresent: false,
      description: "Built and managed engineering teams for B2B SaaS platform. Scaled infrastructure from 10K to 1M+ users. Implemented machine learning solutions improving customer satisfaction by 35%. Led company's first successful SOC 2 compliance audit."
    }
  ],
  education: [
    {
      degree: "Master of Business Administration",
      institution: "Harvard Business School",
      year: "2012 - 2014",
      gpa: "3.8/4.0"
    },
    {
      degree: "Master of Science in Computer Science",
      institution: "MIT",
      year: "2008 - 2010",
      gpa: "3.9/4.0"
    },
    {
      degree: "Bachelor of Engineering in Software Engineering",
      institution: "Stanford University",
      year: "2004 - 2008",
      gpa: "3.7/4.0"
    }
  ],
  projects: [
    {
      name: "Enterprise Cloud Migration",
      description: "Led organization-wide migration to AWS cloud infrastructure. Managed $5M budget, coordinated 8 teams, and delivered 6 months ahead of schedule while achieving 99.9% uptime.",
      tags: ["Cloud Computing", "AWS", "Enterprise Architecture", "Migration Strategy"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop",
      link: "https://techcorp.com/cloud-success-story",
      status: "Completed"
    },
    {
      name: "AI-Powered Analytics Platform",
      description: "Spearheaded development of machine learning platform processing 10TB+ daily data. Generated $50M in new revenue opportunities through predictive analytics and customer insights.",
      tags: ["Machine Learning", "Big Data", "Analytics", "Python", "TensorFlow"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      link: "https://techcorp.com/ai-platform",
      status: "Completed"
    },
    {
      name: "Digital Transformation Initiative",
      description: "Orchestrated company-wide digital transformation affecting 5,000+ employees. Modernized legacy systems, implemented agile practices, and established DevOps culture.",
      tags: ["Digital Transformation", "Change Management", "DevOps", "Agile"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
      link: "https://techcorp.com/transformation",
      status: "Completed"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-SAP-2023-001"
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2022",
      credentialId: "CKA-2022-456"
    },
    {
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      date: "2021",
      credentialId: "PMP-2021-789"
    },
    {
      name: "Executive Leadership Certificate",
      issuer: "Harvard Business School",
      date: "2020",
      credentialId: "ELC-HBS-2020"
    }
  ],
  achievements: [
    {
      title: "Technology Innovation Award",
      description: "Recognized by CIO Magazine as 'CTO of the Year' for leading industry-first AI implementation",
      date: "2023"
    },
    {
      title: "Business Impact Excellence",
      description: "Generated $100M+ in revenue through technology initiatives and cost optimization strategies",
      date: "2022"
    },
    {
      title: "Diversity & Inclusion Leadership",
      description: "Increased engineering team diversity by 40% and established mentorship programs for underrepresented groups",
      date: "2021"
    },
    {
      title: "Digital Transformation Success",
      description: "Led company's largest technology transformation, completed 6 months ahead of schedule with $2M cost savings",
      date: "2020"
    }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Native" },
    { name: "Mandarin", level: "Native" },
    { name: "Technical Leadership", level: "Expert" }
  ]
};

export const classicData: PortfolioData = {
  personalInfo: {
    name: "Eleanor Whitfield",
    title: "Senior Content Strategist & Editorial Director",
    email: "eleanor.whitfield@content.co",
    phone: "+15553456789",
    location: "Boston, MA",
    about: "Seasoned editorial professional with 10+ years of experience crafting compelling content strategies for leading publications and brands. I believe in the timeless power of great storytelling to connect, inspire, and drive meaningful engagement.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  skills: [
    "Content Strategy", "Editorial Leadership", "Creative Writing", "Copy Editing", "SEO Writing", "Brand Storytelling",
    "Digital Publishing", "Social Media Strategy", "Content Marketing", "Editorial Planning", "Style Guide Development",
    "WordPress", "Adobe InDesign", "Google Analytics", "Mailchimp", "Hootsuite", "Semrush",
    "Project Management", "Team Leadership", "Client Relations", "Deadline Management", "Quality Assurance", "Research & Fact-Checking"
  ],
  experience: [
    {
      position: "Editorial Director",
      company: "Heritage Publishing Group",
      startDate: "2021-10-01",
      endDate: undefined,
      isPresent: true,
      description: "Oversee editorial strategy for 5 lifestyle publications with combined readership of 2M+. Manage team of 15 writers and editors. Increased digital engagement by 65% through content optimization and audience analysis."
    },
    {
      position: "Senior Content Strategist",
      company: "Classic Media Co",
      startDate: "2018-05-15",
      endDate: "2021-09-30",
      isPresent: false,
      description: "Developed content strategies for luxury brands and lifestyle companies. Created editorial calendars, style guides, and content workflows. Improved client content performance by average of 45% across all metrics."
    },
    {
      position: "Content Manager",
      company: "Traditional Publications",
      startDate: "2016-01-01",
      endDate: "2018-05-10",
      isPresent: false,
      description: "Managed content creation and publication for monthly magazine. Coordinated with photographers, illustrators, and designers. Maintained editorial calendar and ensured timely delivery of high-quality content."
    },
    {
      position: "Staff Writer",
      company: "City Tribune",
      startDate: "2014-08-01",
      endDate: "2015-12-31",
      isPresent: false,
      description: "Covered arts, culture, and lifestyle beats for daily newspaper. Wrote feature articles, interviews, and reviews. Developed strong relationships with local businesses and community leaders."
    }
  ],
  education: [
    {
      degree: "Master of Arts in Journalism",
      institution: "Columbia University",
      year: "2012 - 2014",
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Arts in English Literature",
      institution: "Harvard University",
      year: "2008 - 2012",
      gpa: "Magna Cum Laude"
    }
  ],
  projects: [
    {
      name: "Heritage Magazine Redesign",
      description: "Led complete editorial and visual redesign of 50-year-old lifestyle magazine. Modernized content strategy while preserving classic aesthetic. Increased circulation by 30% and digital subscriptions by 85%.",
      tags: ["Editorial Strategy", "Content Planning", "Brand Evolution", "Digital Publishing"],
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&h=300&fit=crop",
      link: "https://heritagemagaizne.com/redesign-story",
      status: "Completed"
    },
    {
      name: "Luxury Brand Content Series",
      description: "Created multi-platform content series for premium fashion brand. Developed 50+ articles, videos, and social posts that increased brand awareness by 40% and drove $2M in sales.",
      tags: ["Luxury Branding", "Content Marketing", "Storytelling", "Multi-platform"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
      link: "https://eleanor-content.com/luxury-series",
      status: "Completed"
    },
    {
      name: "Editorial Style Guide",
      description: "Developed comprehensive style guide and content standards for media company. Created templates, workflows, and quality guidelines used by 20+ writers and editors daily.",
      tags: ["Style Guide", "Editorial Standards", "Process Optimization", "Team Training"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
      link: "https://styleguide.heritage.com",
      status: "Completed"
    }
  ],
  certifications: [
    {
      name: "Google Analytics Certified",
      issuer: "Google",
      date: "2023",
      credentialId: "GA-CERT-2023-001"
    },
    {
      name: "Content Marketing Institute Certification",
      issuer: "Content Marketing Institute",
      date: "2022",
      credentialId: "CMI-2022-456"
    },
    {
      name: "AP Style Certification",
      issuer: "Associated Press",
      date: "2021",
      credentialId: "AP-STYLE-2021"
    }
  ],
  achievements: [
    {
      title: "Editorial Excellence Award",
      description: "Received 'Editor of the Year' recognition from National Magazine Association for Heritage Magazine redesign",
      date: "2023"
    },
    {
      title: "Content Strategy Innovation",
      description: "Pioneered data-driven content approach that increased average engagement time by 60% across all platforms",
      date: "2022"
    },
    {
      title: "Mentorship Recognition",
      description: "Mentored 12 junior writers, with 8 receiving promotions and 3 winning industry writing awards",
      date: "2021"
    }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "Italian", level: "Intermediate" },
    { name: "Editorial Voice", level: "Expert" }
  ]
};