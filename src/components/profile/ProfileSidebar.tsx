import type { User } from "../../types/portfolio";
import { cn } from "../ui/utils";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { ContactCard } from "./ContactCard";
import { SocialLinksSection } from "./ProfileSections";

interface ProfileSidebarProps {
  user: User;
  /** Bubbled from AvatarUpload via ProfileSummaryCard. */
  onUserPersisted: (user: User) => void;
  /** Pill-jump callback shared with the other columns. */
  onJumpToSection: (sectionId: string) => void;
  /** Field setter passed through to the inline Social links editor. */
  handleInputChange: (field: keyof User, value: any) => void;
  className?: string;
}

/**
 * Left identity column for the profile page.
 *
 * Holds the cards that *describe* the person — the summary header
 * (avatar, name, title, cover), contact details, and social links.
 * Everything that acts on the profile (save, score, share link,
 * templates, CV) lives in the right-hand `ProfileActionRail` instead.
 *
 * Kept intentionally dumb: the parent applies `lg:sticky` so the stack
 * stays visible while the middle column scrolls.
 */
export function ProfileSidebar({
  user,
  onUserPersisted,
  onJumpToSection,
  handleInputChange,
  className,
}: ProfileSidebarProps) {
  return (
    <aside className={cn("space-y-4", className)}>
      <ProfileSummaryCard
        user={user}
        onUserPersisted={onUserPersisted}
        onJumpToSection={onJumpToSection}
      />
      <ContactCard user={user} onJumpToSection={onJumpToSection} />
      <SocialLinksSection formData={user} handleInputChange={handleInputChange} />
    </aside>
  );
}
