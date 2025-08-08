// src/data/portfolioData.ts (or similar path)
import type { PortfolioData, User } from '../types/portfolio'; // Adjust path as needed

// --- Modern Tech Template Data ---
const modernTechUser: User = {
  id: "user-modern-tech-001",
  name: "Alex Chen",
  title: "Full Stack Developer & UI/UX Designer",
  email: "alex.chen@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  about: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating intuitive user experiences and writing clean, efficient code. Always excited to learn new technologies and solve complex problems.",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=400&fit=crop", // New
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
      isPresent: true, // Updated
      description: "Lead development of SaaS platform serving 10k+ users. Architected microservices backend using Node.js and Python. Implemented responsive frontend with React and TypeScript, improving user engagement by 40%.",
      location: "San Francisco, CA",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Microservices"]
    },
    {
      position: "Frontend Developer",
      company: "InnovateX",
      startDate: "2020-01-15",
      endDate: "2022-02-28", // Updated
      isPresent: false, // Explicitly set
      description: "Developed interactive dashboards for financial analytics. Collaborated with UX designers to implement pixel-perfect interfaces. Optimized application performance, reducing load times by 35%.",
      location: "Remote",
      skills: ["React", "JavaScript", "Redux", "D3.js", "CSS3"]
    }
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      startDate: "2018-09-01",
      endDate: "2020-06-15", // Updated
      isPresent: false,
      gpa: "3.9/4.0",
      description: "Specialized in Human-Computer Interaction and Distributed Systems.",
      achievements: ["Dean's List", "Published research on AI-driven UI personalization"]
    },
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "UC Berkeley",
      startDate: "2014-08-20",
      endDate: "2018-05-20", // Updated
      isPresent: false,
      gpa: "3.7/4.0"
    }
  ],
  projects: [
    {
      name: "AI-Powered Code Review Tool",
      description: "SaaS platform that uses machine learning to automate code review processes, identifying potential bugs and style issues with 95% accuracy.",
      tags: ["AI", "SaaS", "React", "Node.js", "Python", "TensorFlow"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
      link: "https://ai-code-review.example.com",
      githubLink: "https://github.com/alexchen/ai-code-review",
      status: "Completed",
      startDate: "2023-05-01",
      endDate: "2023-11-15",
      role: "Lead Developer & ML Engineer",
      technologies: ["React", "Node.js", "Python", "TensorFlow", "PostgreSQL"],
      achievements: ["Secured $500k in seed funding", "Onboarded 500+ beta users"]
    },
    {
      name: "EcoTracker Mobile App",
      description: "Cross-platform mobile application for tracking personal carbon footprint and suggesting eco-friendly alternatives.",
      tags: ["React Native", "Firebase", "Sustainability", "Gamification"],
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&h=300&fit=crop",
      link: "https://ecotracker.app",
      githubLink: "https://github.com/alexchen/ecotracker-app",
      status: "In Progress",
      startDate: "2024-01-10",
      role: "Full Stack Developer",
      technologies: ["React Native", "Firebase", "Node.js", "Express.js"],
      achievements: ["Featured on App Store", "10k+ downloads"]
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      startDate: "2023-03-01",
      endDate: "2026-03-01", // Updated
      isPresent: false, // Explicit for validity period
      credentialId: "AWS-CERT-123456",
      link: "https://www.credly.com/badges/aws-cert-123456"
    },
    {
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      startDate: "2022-07-15",
      isPresent: true, // Ongoing or no expiry mentioned
      credentialId: "GCP-CLOUD-DEV-7890",
      link: "https://www.credential.net/gcp-cloud-dev-7890"
    }
  ],
  achievements: [
    {
      title: "Hackathon Winner - FinTech Innovation",
      description: "Led a team to win the annual company hackathon with a prototype for real-time fraud detection.",
      startDate: "2023-10-20",
      organization: "TechFlow Solutions",
      link: "https://techflow.com/hackathon-2023-winners"
    },
    {
      title: "Open Source Contributor of the Year",
      description: "Recognized for significant contributions to the React ecosystem, including a popular library downloaded 100k+ times.",
      startDate: "2023-12-01", // Award date
      organization: "Open Source Initiative"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Mandarin", level: "Intermediate" },
    { name: "Spanish", level: "Beginner" }
  ],
  cv: {
    fileName: "Alex_Chen_Resume.pdf",
    fileUrl: "https://example.com/cv/alex_chen_resume.pdf",
    uploadDate: "2024-05-20T10:00:00Z",
    fileSize: 245760, // 240 KB
    fileType: "application/pdf"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/alexchen-dev",
    github: "https://github.com/alexchen",
    twitter: "https://twitter.com/alexchen_dev",
    website: "https://alexchen.dev"
  },
  createdAt: "2023-01-15T08:30:00Z",
  updatedAt: "2024-05-21T14:22:00Z"
};

export const modernTechData: PortfolioData = {
  personalInfo: {
    name: modernTechUser.name,
    title: modernTechUser.title!,
    email: modernTechUser.email,
    phone: modernTechUser.phone,
    location: modernTechUser.location,
    about: modernTechUser.about!,
    avatar: modernTechUser.avatar,
    coverImage: modernTechUser.coverImage, // New
    socialLinks: modernTechUser.socialLinks // New
  },
  skills: modernTechUser.skills!,
  experience: modernTechUser.experience!,
  education: modernTechUser.education!,
  projects: modernTechUser.projects!,
  certifications: modernTechUser.certifications!,
  achievements: modernTechUser.achievements!,
  languages: modernTechUser.languages!
};
// --- End Modern Tech ---


// --- Creative Template Data ---
const creativeUser: User = {
  id: "user-creative-002",
  name: "Maya Rodriguez",
  title: "Creative Director & Visual Designer",
  email: "maya.rodriguez@studio.com",
  phone: "+1 (555) 987-6543",
  location: "Brooklyn, NY",
  about: "Award-winning creative director with 8+ years of experience crafting compelling visual stories for global brands. I blend artistic vision with strategic thinking to create designs that not only look beautiful but drive real business results.",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&h=400&fit=crop", // New
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
      isPresent: true,
      description: "Lead creative vision for high-profile client campaigns across fashion, tech, and lifestyle sectors. Managed team of 12 designers and art directors. Increased client retention by 25% through innovative concepts.",
      location: "Brooklyn, NY"
    },
    {
      position: "Senior Visual Designer",
      company: "Pixel Perfect Agency",
      startDate: "2018-06-01",
      endDate: "2020-12-31",
      isPresent: false,
      description: "Designed brand identities, marketing materials, and digital experiences. Specialized in creating cohesive visual narratives. Worked with startups and established brands like EcoWear and TechNova.",
      location: "New York, NY"
    }
  ],
  education: [
    {
      degree: "Master of Fine Arts in Graphic Design",
      institution: "Rhode Island School of Design",
      startDate: "2015-09-01",
      endDate: "2017-05-20",
      isPresent: false,
      gpa: "3.9/4.0"
    },
    {
      degree: "Bachelor of Arts in Visual Arts",
      institution: "Parsons School of Design",
      startDate: "2011-08-25",
      endDate: "2015-05-15",
      isPresent: false,
      gpa: "3.7/4.0"
    }
  ],
  projects: [
    {
      name: "Sunset Coffee Rebrand",
      description: "Complete rebranding project for a premium coffee chain, including logo, packaging, store design, and digital presence. Focused on a warm, inviting aesthetic.",
      tags: ["Branding", "Packaging", "Logo Design", "Retail Design"],
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=300&fit=crop",
      link: "https://sunsetcoffee.com/rebrand",
      status: "Completed",
      startDate: "2023-03-01",
      endDate: "2023-08-31",
      role: "Lead Designer",
      technologies: ["Adobe Illustrator", "Adobe InDesign", "Figma"],
      achievements: ["Won A' Design Award", "Increased brand recognition by 40%"]
    },
    {
      name: "AR Art Installation 'Echoes'",
      description: "Interactive art installation blending physical sculpture with augmented reality elements, exploring themes of memory and technology.",
      tags: ["Installation", "AR", "Interactive Design", "Conceptual Art"],
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=300&fit=crop",
      link: "https://echoes-art-installation.com",
      status: "Completed",
      startDate: "2022-01-10",
      endDate: "2022-06-20",
      role: "Conceptual Designer & Lead Artist",
      achievements: ["Featured at Digital Art Biennale", "Press coverage in ArtForum"]
    }
  ],
  certifications: [
    {
      name: "Adobe Certified Expert - Illustrator",
      issuer: "Adobe",
      startDate: "2020-11-01",
      isPresent: true, // Assuming no expiry or ongoing validity
      credentialId: "ACE-ILLUSTRATOR-2020"
    }
  ],
  achievements: [
    {
      title: "Communication Arts Award Winner",
      description: "Selected for the Communication Arts Annual Design Competition for the Sunset Coffee rebrand project.",
      startDate: "2023-10-01",
      organization: "Communication Arts Magazine"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Intermediate" }
  ],
  cv: {
    fileName: "Maya_Rodriguez_Portfolio.pdf",
    fileUrl: "https://example.com/cv/maya_rodriguez_portfolio.pdf",
    uploadDate: "2024-04-10T09:15:00Z",
    fileSize: 12582912, // 12 MB
    fileType: "application/pdf"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/mayarodriguez-design",
    dribbble: "https://dribbble.com/mayarodriguez",
    behance: "https://behance.net/mayarodriguez",
    website: "https://mayarodriguez.studio",
  },
  createdAt: "2022-03-22T11:45:00Z",
  updatedAt: "2024-05-18T16:30:00Z"
};

export const creativeData: PortfolioData = {
  personalInfo: {
    name: creativeUser.name,
    title: creativeUser.title!,
    email: creativeUser.email,
    phone: creativeUser.phone,
    location: creativeUser.location,
    about: creativeUser.about!,
    avatar: creativeUser.avatar,
    coverImage: creativeUser.coverImage, // New
    socialLinks: creativeUser.socialLinks // New
  },
  skills: creativeUser.skills!,
  experience: creativeUser.experience!,
  education: creativeUser.education!,
  projects: creativeUser.projects!,
  certifications: creativeUser.certifications!,
  achievements: creativeUser.achievements!,
  languages: creativeUser.languages!
};
// --- End Creative ---


// --- Corporate Template Data ---
const corporateUser: User = {
  id: "user-corporate-003",
  name: "Sarah Johnson",
  title: "VP of Engineering & Technology Strategy",
  email: "sarah.johnson@techcorp.com",
  phone: "+1 (555) 234-5678",
  location: "New York, NY",
  about: "Executive technology leader with 12+ years of experience scaling engineering teams and driving digital transformation. Proven track record of delivering enterprise solutions that generate $100M+ in revenue while building high-performing, diverse teams.",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop", // New
  skills: [
    "Engineering Leadership", "Technology Strategy", "Digital Transformation", "Team Building", "Agile Methodology",
    "Enterprise Architecture", "Cloud Computing", "DevOps", "Machine Learning", "Data Strategy",
    "AWS", "Azure", "Kubernetes", "Microservices", "API Design", "Security", "Compliance",
    "Project Management", "Stakeholder Management", "Budget Planning", "Vendor Management", "Risk Assessment", "Innovation Strategy"
  ],
  experience: [
    {
      position: "VP of Engineering",
      company: "GlobalTech Industries",
      startDate: "2019-06-01",
      isPresent: true,
      description: "Lead engineering organization of 200+ developers, QA engineers, and DevOps specialists. Spearheaded cloud migration to AWS, reducing infrastructure costs by 30%. Implemented Agile at scale, improving delivery velocity by 50%.",
      location: "New York, NY"
    },
    {
      position: "Director of Software Engineering",
      company: "Innovate Solutions Inc.",
      startDate: "2016-03-15",
      endDate: "2019-05-31",
      isPresent: false,
      description: "Managed development teams for financial services products. Drove adoption of microservices architecture. Mentored junior engineers and led technical hiring efforts.",
      location: "Boston, MA"
    }
  ],
  education: [
    {
      degree: "Master of Business Administration",
      institution: "Harvard Business School",
      startDate: "2013-09-01",
      endDate: "2015-05-30",
      isPresent: false,
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "MIT",
      startDate: "2009-09-01",
      endDate: "2013-06-15",
      isPresent: false,
      gpa: "3.9/4.0"
    }
  ],
  projects: [
    {
      name: "Enterprise Cloud Migration",
      description: "Led the end-to-end migration of legacy on-premise systems to a hybrid cloud environment on AWS, serving 5 million customers.",
      tags: ["Cloud Migration", "AWS", "DevOps", "Enterprise Architecture"],
      // image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop", // Optional image
      status: "Completed",
      startDate: "2020-01-01",
      endDate: "2021-12-31",
      role: "Project Lead",
      technologies: ["AWS", "Kubernetes", "Terraform", "Docker"],
      achievements: ["Reduced operational costs by 30%", "Improved system uptime to 99.95%"]
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      startDate: "2020-05-15",
      isPresent: true,
      credentialId: "AWS-SAP-987654"
    },
    {
      name: "Certified Scrum Professional - Executive",
      issuer: "Scrum Alliance",
      startDate: "2018-11-20",
      isPresent: true,
      credentialId: "CSPE-555666"
    }
  ],
  achievements: [
    {
      title: "Forbes '30 Under 30' in Technology",
      description: "Recognized for innovative leadership in enterprise software development.",
      startDate: "2021-01-01",
      organization: "Forbes Magazine"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" }
  ],
  cv: {
    fileName: "Sarah_Johnson_Executive_Resume.pdf",
    fileUrl: "https://example.com/cv/sarah_johnson_exec_resume.pdf",
    uploadDate: "2024-03-15T13:20:00Z",
    fileSize: 1048576, // 1 MB
    fileType: "application/pdf"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/sarahjohnson-exec",
    twitter: "https://twitter.com/sjohnson_tech"
    // website could be company profile page
  },
  createdAt: "2019-01-10T09:00:00Z",
  updatedAt: "2024-05-20T11:10:00Z"
};

export const corporateData: PortfolioData = {
  personalInfo: {
    name: corporateUser.name,
    title: corporateUser.title!,
    email: corporateUser.email,
    phone: corporateUser.phone,
    location: corporateUser.location,
    about: corporateUser.about!,
    avatar: corporateUser.avatar,
    coverImage: corporateUser.coverImage, // New
    socialLinks: corporateUser.socialLinks // New
  },
  skills: corporateUser.skills!,
  experience: corporateUser.experience!,
  education: corporateUser.education!,
  projects: corporateUser.projects!,
  certifications: corporateUser.certifications!,
  achievements: corporateUser.achievements!,
  languages: corporateUser.languages!
};
// --- End Corporate ---


// --- Classic Template Data ---
const classicUser: User = {
  id: "user-classic-004",
  name: "Dr. Emily Harper",
  title: "Senior Research Scientist & Author",
  email: "emily.harper@research.edu",
  phone: "+1 (555) 567-8901",
  location: "Boston, MA",
  about: "Dedicated research scientist with 10+ years of experience in molecular biology and bioinformatics. Published author of 25+ peer-reviewed articles. Passionate about translating scientific discoveries into real-world applications.",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=400&fit=crop", // New
  skills: [
    "Molecular Biology", "Bioinformatics", "Data Analysis", "Genomics", "Proteomics",
    "Scientific Writing", "Grant Writing", "Project Management", "Lab Management",
    "Python", "R", "Linux", "Statistical Analysis", "Machine Learning",
    "Public Speaking", "Mentoring", "Ethics", "Regulatory Affairs"
  ],
  experience: [
    {
      position: "Senior Research Scientist",
      company: "Harvard Medical School",
      startDate: "2018-09-01",
      isPresent: true,
      description: "Lead investigator on projects related to cancer genomics. Supervise team of 5 researchers. Secure $2M+ in annual grant funding. Publish findings in top-tier journals.",
      location: "Boston, MA"
    },
    {
      position: "Postdoctoral Research Fellow",
      company: "MIT Department of Biology",
      startDate: "2015-07-01",
      endDate: "2018-08-31",
      isPresent: false,
      description: "Researched gene regulation mechanisms in stem cells. Developed novel computational tools for analyzing sequencing data. Co-authored 10 publications.",
      location: "Cambridge, MA"
    }
  ],
  education: [
    {
      degree: "Ph.D. in Molecular Biology",
      institution: "Stanford University",
      startDate: "2011-09-15",
      endDate: "2015-06-10",
      isPresent: false,
      gpa: "4.0/4.0",
      description: "Thesis: 'Computational Analysis of Transcription Factor Binding in Embryonic Development'",
      achievements: ["Outstanding Dissertation Award", "Best Poster Presentation - Biology Symposium"]
    },
    {
      degree: "Bachelor of Science in Biochemistry",
      institution: "University of California, Berkeley",
      startDate: "2007-08-20",
      endDate: "2011-05-15",
      isPresent: false,
      gpa: "3.9/4.0"
    }
  ],
  projects: [
    {
      name: "Cancer Mutation Detection Pipeline",
      description: "Developed a high-throughput computational pipeline for identifying driver mutations in cancer genomes from TCGA data.",
      tags: ["Bioinformatics", "Cancer Genomics", "Python", "Machine Learning"],
      // image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=500&h=300&fit=crop", // Optional
      link: "https://github.com/emilyharper/cancer-mutation-pipeline",
      status: "Completed",
      startDate: "2019-03-01",
      endDate: "2020-09-30",
      role: "Principal Investigator & Lead Developer",
      technologies: ["Python", "R", "Snakemake", "Machine Learning"],
      achievements: ["Published in Nature Biotechnology", "Pipeline adopted by 3 other research labs"]
    }
  ],
  certifications: [
    {
      name: "Certified Clinical Research Professional (CCRP)",
      issuer: "Society of Clinical Research Associates",
      startDate: "2020-02-01",
      isPresent: true,
      credentialId: "CCRP-777888"
    }
  ],
  achievements: [
    {
      title: "Young Investigator Award",
      description: "Awarded for outstanding contributions to cancer research.",
      startDate: "2021-11-15",
      organization: "American Association for Cancer Research"
    },
    {
      title: "NIH R01 Grant Recipient",
      description: "Principal Investigator on a 5-year, $2.1M grant for research into tumor microenvironment.",
      startDate: "2022-04-01",
      organization: "National Institutes of Health"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "German", level: "Intermediate" } // Common for science
  ],
  cv: {
    fileName: "Emily_Harper_Academic_CV.pdf",
    fileUrl: "https://example.com/cv/emily_harper_academic_cv.pdf",
    uploadDate: "2024-05-01T10:00:00Z",
    fileSize: 5242880, // 5 MB
    fileType: "application/pdf"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/emilyharper-phd",
  },
  createdAt: "2018-08-01T12:00:00Z",
  updatedAt: "2024-05-22T09:45:00Z"
};

export const classicData: PortfolioData = {
  personalInfo: {
    name: classicUser.name,
    title: classicUser.title!,
    email: classicUser.email,
    phone: classicUser.phone,
    location: classicUser.location,
    about: classicUser.about!,
    avatar: classicUser.avatar,
    coverImage: classicUser.coverImage, // New
    socialLinks: classicUser.socialLinks // New
  },
  skills: classicUser.skills!,
  experience: classicUser.experience!,
  education: classicUser.education!,
  projects: classicUser.projects!,
  certifications: classicUser.certifications!,
  achievements: classicUser.achievements!,
  languages: classicUser.languages!
};
// --- End Classic ---


// --- Minimalist Template Data ---
const minimalistUser: User = {
  id: "user-minimalist-005",
  name: "Jordan Lee",
  title: "Freelance Writer & Editor",
  email: "jordan.lee@protonmail.com",
  phone: "+1 (555) 345-6789",
  location: "Portland, OR",
  about: "Clear and concise writer helping businesses tell their story. Specializing in technology, sustainability, and lifestyle content. Available for long-term collaborations and one-off projects.",
  avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=400&fit=crop", // New
  skills: [
    "Content Strategy", "Editorial Leadership", "Creative Writing", "Copy Editing", "SEO Writing", "Brand Storytelling",
    "Digital Publishing", "Social Media Strategy", "Content Marketing", "Editorial Planning", "Style Guide Development",
    "WordPress", "Adobe InDesign", "Google Analytics", "Mailchimp", "Grammarly",
    "Project Management", "Client Relations", "Deadline Management", "Research & Fact-Checking"
  ],
  experience: [
    {
      position: "Freelance Content Specialist",
      company: "Self-Employed",
      startDate: "2020-05-01",
      isPresent: true,
      description: "Provide writing, editing, and content strategy services to tech startups and sustainable brands. Manage full content calendars and brand voice consistency.",
      location: "Portland, OR"
    },
    {
      position: "Senior Content Editor",
      company: "Heritage Publications",
      startDate: "2017-02-15",
      endDate: "2020-04-30",
      isPresent: false,
      description: "Oversaw editorial process for monthly magazine. Managed team of 4 writers and 2 editors. Developed style guide and content standards used company-wide.",
      location: "Seattle, WA"
    }
  ],
  education: [
    {
      degree: "Master of Arts in English Literature",
      institution: "University of Oregon",
      startDate: "2015-09-10",
      endDate: "2017-06-15",
      isPresent: false,
      gpa: "3.8/4.0",
      achievements: ["Graduate Writing Fellowship"]
    },
    {
      degree: "Bachelor of Arts in Journalism",
      institution: "University of Washington",
      startDate: "2011-09-20",
      endDate: "2015-06-10",
      isPresent: false,
      gpa: "3.7/4.0"
    }
  ],
  projects: [
    {
      name: "TechGrowth Startup Series",
      description: "Authored a 12-part blog series profiling emerging tech startups in the Pacific Northwest, highlighting their innovation and impact.",
      tags: ["Tech", "Startups", "Interviews", "Blog Series"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
      link: "https://techgrowth.com/startup-series",
      status: "Completed",
      startDate: "2022-01-01",
      endDate: "2022-12-31",
      role: "Lead Writer & Editor",
      achievements: ["Series drove 50% increase in website traffic", "Featured in industry newsletter"]
    }
  ],
  certifications: [
    {
      name: "Google Analytics Individual Qualification",
      issuer: "Google",
      startDate: "2021-03-15",
      isPresent: true,
      credentialId: "GAQ-2021-112233"
    },
    {
      name: "HubSpot Content Marketing Certification",
      issuer: "HubSpot Academy",
      startDate: "2020-11-01",
      endDate: "2023-11-01",
      isPresent: false,
      credentialId: "HCM-2020-445566"
    }
  ],
  achievements: [
    {
      title: "Best Feature Article - Regional Media Awards",
      description: "Awarded for investigative piece on local sustainable agriculture initiatives.",
      startDate: "2019-05-01",
      organization: "Pacific Northwest Editors Guild"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" }
  ],
  cv: {
    fileName: "Jordan_Lee_Writer_Portfolio.pdf",
    fileUrl: "https://example.com/cv/jordan_lee_writer_portfolio.pdf",
    uploadDate: "2024-02-28T14:00:00Z",
    fileSize: 3145728, // 3 MB
    fileType: "application/pdf"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/jordanlee-writer",
    website: "https://jordanleewriter.com",
  },
  createdAt: "2020-04-01T08:00:00Z",
  updatedAt: "2024-05-19T17:30:00Z"
};

export const minimalistData: PortfolioData = {
  personalInfo: {
    name: minimalistUser.name,
    title: minimalistUser.title!,
    email: minimalistUser.email,
    phone: minimalistUser.phone,
    location: minimalistUser.location,
    about: minimalistUser.about!,
    avatar: minimalistUser.avatar,
    coverImage: minimalistUser.coverImage, // New
    socialLinks: minimalistUser.socialLinks // New
  },
  skills: minimalistUser.skills!,
  experience: minimalistUser.experience!,
  education: minimalistUser.education!,
  projects: minimalistUser.projects!,
  certifications: minimalistUser.certifications!,
  achievements: minimalistUser.achievements!,
  languages: minimalistUser.languages!
};
// --- End Minimalist ---



