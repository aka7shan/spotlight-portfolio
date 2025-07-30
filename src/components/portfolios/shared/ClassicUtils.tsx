export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  else if (hour < 17) return "Good afternoon";
  else return "Good evening";
};

export const getSkillCategories = (skills: string[]) => [
  {
    name: "Technical Skills",
    skills: skills.filter(skill => 
      ['React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Node.js'].some(tech => skill.includes(tech))
    ),
    icon: "Target",
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "Creative Skills", 
    skills: skills.filter(skill => 
      ['Design', 'UI', 'UX', 'Adobe', 'Figma', 'Creative'].some(tech => skill.includes(tech))
    ),
    icon: "Palette",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Business Skills",
    skills: skills.filter(skill => 
      ['Management', 'Leadership', 'Strategy', 'Analysis'].some(tech => skill.includes(tech))
    ),
    icon: "Crown", 
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Personal Skills",
    skills: skills.filter(skill => 
      ['Communication', 'Teamwork', 'Problem', 'Critical'].some(tech => skill.includes(tech))
    ),
    icon: "Heart",
    color: "from-green-500 to-emerald-500"
  }
];

export const getContactItems = (personalInfo: any) => [
  {
    icon: "Mail",
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "from-red-500 to-pink-500"
  },
  {
    icon: "Phone", 
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: "MapPin",
    label: "Location", 
    value: personalInfo.location,
    color: "from-blue-500 to-cyan-500"
  }
];