import {
  Sparkles,
  User,
  Code,
  Folder,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Globe,
  Send,
} from "lucide-react";
import type { BlockType } from "../config/types";
import type { PortfolioData } from "../../../types/portfolio";
import type { BlockComponent, BlockDef } from "./types";
import { heroVariants } from "./HeroBlock";
import { aboutVariants } from "./AboutBlock";
import { skillsVariants } from "./SkillsBlock";
import { projectsVariants } from "./ProjectsBlock";
import { experienceVariants } from "./ExperienceBlock";
import { contactVariants } from "./ContactBlock";
import {
  educationVariants,
  certificationsVariants,
  achievementsVariants,
  languagesVariants,
} from "./CredentialBlocks";

type Data = PortfolioData;

const nonEmpty = (s?: string) => !!s && s.trim().length > 0;

export const BLOCK_REGISTRY: Record<BlockType, BlockDef> = {
  hero: {
    type: "hero",
    label: "Hero",
    icon: Sparkles,
    defaultTitle: "Hero",
    variants: [
      { id: "split", label: "Split" },
      { id: "centered", label: "Centered" },
      { id: "cover", label: "Cover Banner" },
      { id: "minimal", label: "Minimal" },
    ],
    render: heroVariants,
    isAvailable: () => true,
  },
  about: {
    type: "about",
    label: "About",
    icon: User,
    defaultTitle: "About Me",
    variants: [
      { id: "standard", label: "With Facts" },
      { id: "text", label: "Text Only" },
    ],
    render: aboutVariants,
    isAvailable: (d: Data) => nonEmpty(d.personalInfo.about),
  },
  skills: {
    type: "skills",
    label: "Skills",
    icon: Code,
    defaultTitle: "Skills",
    variants: [
      { id: "grouped", label: "Grouped" },
      { id: "cloud", label: "Cloud" },
    ],
    render: skillsVariants,
    isAvailable: (d: Data) => d.skills.length > 0,
  },
  projects: {
    type: "projects",
    label: "Projects",
    icon: Folder,
    defaultTitle: "Projects",
    variants: [
      { id: "grid", label: "Grid" },
      { id: "list", label: "List" },
    ],
    render: projectsVariants,
    isAvailable: (d: Data) => d.projects.length > 0,
  },
  experience: {
    type: "experience",
    label: "Experience",
    icon: Briefcase,
    defaultTitle: "Experience",
    variants: [
      { id: "timeline", label: "Timeline" },
      { id: "list", label: "List" },
    ],
    render: experienceVariants,
    isAvailable: (d: Data) => d.experience.length > 0,
  },
  education: {
    type: "education",
    label: "Education",
    icon: GraduationCap,
    defaultTitle: "Education",
    variants: [{ id: "list", label: "List" }],
    render: educationVariants,
    isAvailable: (d: Data) => d.education.length > 0,
  },
  certifications: {
    type: "certifications",
    label: "Certifications",
    icon: Award,
    defaultTitle: "Certifications",
    variants: [{ id: "list", label: "List" }],
    render: certificationsVariants,
    isAvailable: (d: Data) => d.certifications.length > 0,
  },
  achievements: {
    type: "achievements",
    label: "Achievements",
    icon: Trophy,
    defaultTitle: "Achievements",
    variants: [{ id: "list", label: "List" }],
    render: achievementsVariants,
    isAvailable: (d: Data) => d.achievements.length > 0,
  },
  languages: {
    type: "languages",
    label: "Languages",
    icon: Globe,
    defaultTitle: "Languages",
    variants: [
      { id: "chips", label: "Chips" },
      { id: "bars", label: "Bars" },
    ],
    render: languagesVariants,
    isAvailable: (d: Data) => d.languages.length > 0,
  },
  contact: {
    type: "contact",
    label: "Contact",
    icon: Send,
    defaultTitle: "Get In Touch",
    variants: [
      { id: "split", label: "Split" },
      { id: "simple", label: "Simple" },
    ],
    render: contactVariants,
    isAvailable: () => true,
  },
};

/** Resolve a block's component for a given variant (falls back gracefully). */
export function getBlockComponent(type: BlockType, variant: string): BlockComponent {
  const def = BLOCK_REGISTRY[type];
  return def.render[variant] ?? def.render[def.variants[0].id];
}

export function getBlockDef(type: BlockType): BlockDef {
  return BLOCK_REGISTRY[type];
}
