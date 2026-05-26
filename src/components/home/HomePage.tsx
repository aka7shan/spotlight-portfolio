import {
  Palette,
  Code,
  Users,
  Zap,
  Globe,
  Layers,
  Heart,
  CheckCircle,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import type { User } from "../../types/portfolio";
import styles from "./HomePage.module.css";
import { HeroSection } from "./HeroSection";
import { ProfileStatusSection } from "./ProfileStatusSection";
import { StatsSection } from "./StatsSection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CTASection } from "./CTASection";
import type { Feature } from "./FeaturesSection";
import type { Stat } from "./StatsSection";
import type { Testimonial } from "./TestimonialsSection";
import type { MissingProfileSection } from "./ProfileStatusSection";

const FEATURES: Feature[] = [
  { icon: Palette, title: "Beautiful Templates", description: "Choose from professionally designed portfolio templates that showcase your work perfectly", gradient: "from-purple-500 to-pink-500" },
  { icon: Code, title: "No Code Required", description: "Build stunning portfolios without any technical knowledge or coding skills", gradient: "from-blue-500 to-cyan-500" },
  { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance. Your portfolio loads instantly anywhere", gradient: "from-green-500 to-emerald-500" },
  { icon: Globe, title: "Share Anywhere", description: "Get a custom URL to share your portfolio across all social platforms", gradient: "from-orange-500 to-red-500" },
];

const STATS: Stat[] = [
  { number: "10K+", label: "Portfolios Created", icon: Users },
  { number: "5+", label: "Premium Templates", icon: Layers },
  { number: "99%", label: "User Satisfaction", icon: Heart },
  { number: "24/7", label: "Support Available", icon: CheckCircle },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah Chen", role: "UX Designer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face", content: "Spotlight helped me land my dream job! The templates are beautiful and so easy to customize." },
  { name: "Marcus Johnson", role: "Web Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", content: "The best portfolio platform I've used. Clean, professional, and showcases my work perfectly." },
  { name: "Elena Rodriguez", role: "Graphic Designer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", content: "The creative template is absolutely perfect for my artistic work. Highly recommend!" },
];

const getMissingProfileSections = (user: User): MissingProfileSection[] => {
    const missing = [];

    if (!user.name || !user.title || !user.about) {
      missing.push({
        title: "Complete Basic Info",
        description: "Add your name, title, and professional summary",
        icon: UserIcon,
        action: "profile",
      });
    }
    if (!user.skills || user.skills.length === 0) {
      missing.push({
        title: "Add Skills",
        description: "List your professional skills and expertise",
        icon: Award,
        action: "profile",
      });
    }
    if (!user.experience || user.experience.length === 0) {
      missing.push({
        title: "Add Work Experience",
        description: "Include your professional work history",
        icon: Briefcase,
        action: "profile",
      });
    }
    if (!user.education || user.education.length === 0) {
      missing.push({
        title: "Add Education",
        description: "Include your educational background",
        icon: GraduationCap,
        action: "profile",
      });
    }
    return missing;
  };

const isProfileComplete = (user: User) =>
  !!(user.name && user.title && user.about && user.skills?.length && user.experience?.length && user.education?.length);

interface HomePageProps {
  onNavigate: (page: string) => void;
  user?: User | null;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  const missingSections = user ? getMissingProfileSections(user) : [];
  const profileComplete = user ? isProfileComplete(user) : false;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection user={user} profileComplete={profileComplete} onNavigate={onNavigate} styles={styles} />
      <ProfileStatusSection user={user} profileComplete={profileComplete} missingSections={missingSections} onNavigate={onNavigate} styles={styles} />
      <StatsSection stats={STATS} styles={styles} />
      <FeaturesSection features={FEATURES} styles={styles} />
      <TestimonialsSection testimonials={TESTIMONIALS} styles={styles} />
      {!user && <CTASection onNavigate={onNavigate} styles={styles} />}
    </div>
  );
}
