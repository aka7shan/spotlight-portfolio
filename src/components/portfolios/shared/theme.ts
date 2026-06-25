import { Home, User, Target, Folder, Briefcase, Send, Code } from "lucide-react";
import type { SidebarItem, SidebarTheme } from "./PortfolioSidebar";
import type { ExperienceTheme } from "./ExperienceTimeline";
import type { ProjectTheme } from "./ProjectGrid";

/**
 * Theme-token system for the sidebar-based templates (Classic, Modern Tech,
 * Corporate). Each preset is the single source of truth for that template's
 * colours, gradients, nav items and per-section sub-themes, so styling lives
 * in one typed object instead of a scatter of inline consts per file.
 *
 * Bespoke templates (Creative cycles its palette; Minimalist uses a dot nav)
 * keep their own local theming — forcing them through this shape would lose
 * what makes them distinct.
 */

export interface SectionHeaderTheme {
  titleClass: string;
  subtitleClass?: string;
  dividerClass?: string;
  align?: "center" | "left";
}

export interface PortfolioTheme {
  id: string;
  /** Page background (outer wrapper). */
  pageBg: string;
  /** Primary accent gradient, e.g. "from-amber-500 to-orange-500". */
  accentGradient: string;
  navItems: SidebarItem[];
  sidebar: SidebarTheme;
  header: SectionHeaderTheme;
  experience: ExperienceTheme;
  project: ProjectTheme;
}

export const classicTheme: PortfolioTheme = {
  id: "classic",
  pageBg: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
  accentGradient: "from-amber-500 to-orange-500",
  navItems: [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Target },
    { id: "projects", label: "Works", icon: Folder },
    { id: "experience", label: "Journey", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send },
  ],
  sidebar: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-amber-200",
    logoGradient: "from-amber-500 to-orange-500",
    logoText: "text-amber-700",
    activeClass: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
    inactiveClass: "text-gray-600 hover:text-amber-600 hover:bg-amber-50",
    footerText: "text-gray-500",
  },
  header: {
    titleClass: "text-3xl sm:text-4xl font-serif text-gray-900",
    subtitleClass: "text-gray-600 text-lg",
    dividerClass: "bg-gradient-to-r from-amber-500 to-orange-500",
    align: "center",
  },
  experience: {
    line: "bg-amber-400",
    nodeGradient: "from-amber-500 to-orange-500",
    card: "bg-white border-amber-200 hover:shadow-2xl transition-all duration-500",
    position: "text-gray-900 group-hover:text-amber-700 transition-colors",
    company: "text-amber-600 font-medium",
    badge: "border-amber-300 text-amber-700 bg-amber-50",
    description: "text-gray-600 leading-relaxed",
    layout: "alternating",
  },
  project: {
    card: "bg-white border-amber-200 hover:shadow-2xl transition-all duration-500",
    imageBg: "bg-amber-50",
    title: "text-xl font-serif text-gray-900",
    titleHover: "group-hover:text-amber-700",
    description: "text-gray-600 leading-relaxed",
    badge: "border-amber-200 text-amber-700 bg-amber-50",
  },
};

export const modernTechTheme: PortfolioTheme = {
  id: "modern-tech",
  pageBg: "bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white",
  accentGradient: "from-blue-600 to-purple-600",
  navItems: [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Stack", icon: Code },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send },
  ],
  sidebar: {
    bg: "bg-gray-900/50 backdrop-blur-md",
    border: "border-gray-800",
    logoGradient: "from-blue-500 to-purple-500",
    logoText: "text-white",
    activeClass: "bg-blue-600/20 text-blue-300 border border-blue-600/30",
    inactiveClass: "text-gray-400 hover:text-white hover:bg-gray-800/50",
    footerText: "text-gray-500",
  },
  header: {
    titleClass: "text-3xl font-bold text-white",
    subtitleClass: "text-gray-400 mt-2",
    dividerClass: "bg-gradient-to-r from-blue-500 to-purple-500",
    align: "left",
  },
  experience: {
    line: "bg-gradient-to-b from-blue-500 to-purple-500",
    nodeGradient: "from-blue-600 to-purple-600",
    card: "bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors",
    position: "text-white",
    company: "text-blue-400 font-medium",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description: "text-gray-300 leading-relaxed",
    layout: "left",
  },
  project: {
    card: "bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300",
    imageBg: "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
    title: "text-xl font-bold text-white",
    titleHover: "group-hover:text-blue-400",
    description: "text-gray-300 leading-relaxed",
    badge: "bg-gray-700/50 text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 text-xs",
  },
};

export const corporateTheme: PortfolioTheme = {
  id: "corporate",
  pageBg: "bg-gradient-to-br from-slate-50 to-gray-100",
  accentGradient: "from-blue-600 to-purple-600",
  navItems: [
    { id: "home", label: "Overview", icon: Home },
    { id: "about", label: "Profile", icon: User },
    { id: "skills", label: "Expertise", icon: Target },
    { id: "projects", label: "Portfolio", icon: Folder },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Send },
  ],
  sidebar: {
    bg: "bg-white/90 backdrop-blur-md",
    border: "border-gray-200",
    logoGradient: "from-blue-600 to-purple-600",
    logoText: "text-gray-900",
    activeClass: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
    inactiveClass: "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
    footerText: "text-gray-600",
  },
  header: {
    titleClass: "text-3xl sm:text-4xl font-bold text-gray-900",
    subtitleClass: "text-lg text-gray-600",
    dividerClass: "bg-gradient-to-r from-blue-500 to-purple-500",
    align: "center",
  },
  experience: {
    line: "bg-gradient-to-b from-blue-500 to-purple-500",
    nodeGradient: "from-blue-600 to-purple-600",
    card: "border-gray-200 hover:shadow-xl transition-all duration-300",
    position: "text-gray-900 group-hover:text-blue-600 transition-colors",
    company: "text-blue-600 font-semibold text-lg",
    badge: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2",
    description: "text-gray-700 leading-relaxed",
    layout: "left",
  },
  project: {
    card: "border-gray-200 hover:shadow-xl transition-all duration-300",
    imageBg: "bg-gradient-to-br from-blue-50 to-purple-50",
    title: "text-xl font-bold text-gray-900",
    titleHover: "group-hover:text-blue-600",
    description: "text-gray-600 leading-relaxed",
    badge: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
  },
};
