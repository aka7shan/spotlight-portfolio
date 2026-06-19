import { Mail, Phone, Pencil } from "lucide-react";
import type { User } from "../../types/portfolio";
import { Card, CardContent } from "../ui/card";

interface ContactCardProps {
  user: User;
  /**
   * Opens / scrolls to Personal Details so the user can edit
   * phone/email. Optional so the card works standalone.
   */
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Lightweight phone + email card for the profile sidebar.
 *
 * The pencil icon next to the phone is the only edit affordance — both
 * fields actually live in the Personal Details section, so we delegate
 * editing there rather than building a second inline edit flow.
 * Keeping the card itself read-only also means the dirty-flag state
 * machine in `ProfilePage` doesn't gain any new entry points.
 */
export function ContactCard({ user, onJumpToSection }: ContactCardProps) {
  // Hide the whole card when both fields are empty — the empty card
  // would just be noise. The user can still edit Personal Details
  // from the section nav and the score card's pending-action list.
  if (!user.email && !user.phone) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5 space-y-3">
        {user.phone && (
          <Row icon={<Phone className="h-4 w-4 text-emerald-600" />}>
            <span className="text-sm text-gray-700">{user.phone}</span>
            <button
              type="button"
              aria-label="Edit phone"
              onClick={() => onJumpToSection?.("section-personal")}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </Row>
        )}
        {user.email && (
          <Row icon={<Mail className="h-4 w-4 text-emerald-600" />}>
            <a
              href={`mailto:${user.email}`}
              className="text-sm text-gray-700 hover:text-purple-700 truncate"
              title={user.email}
            >
              {user.email}
            </a>
          </Row>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        {children}
      </div>
    </div>
  );
}
