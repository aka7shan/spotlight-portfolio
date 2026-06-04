import { Badge } from "../ui/badge";
import { MapPin, Mail, Phone } from "lucide-react";
import type { User } from "../../types/portfolio";
import { AvatarUpload } from "./AvatarUpload";
import { CoverUpload } from "./CoverUpload";

interface ProfileHeaderProps {
  user: User;
  profileCompleteness: number;
  /**
   * Notified when avatar OR cover is persisted server-side. Both children
   * forward the full assembled user payload they received from the
   * backend, so the parent can sync its own state without a follow-up
   * GET /v1/me. See AvatarUpload + CoverUpload for the contract.
   */
  onUserPersisted: (user: User) => void;
  className?: string;
}

export function ProfileHeader({
  user,
  profileCompleteness,
  onUserPersisted,
  className = ""
}: ProfileHeaderProps) {
  // ProfileHeader is intentionally dumb about the avatar/cover flow now —
  // both children call the backend themselves and surface the full updated
  // user via `onUserPersisted`. We just thread the callback through.

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletenessText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${className}`}>
      {/* Cover Image Section — uploads directly to Supabase Storage. */}
      <CoverUpload
        currentCover={user.coverImage}
        onCoverPersisted={onUserPersisted}
      />

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar positioned to overlap cover */}
        <div className="absolute -top-16 left-6">
          <AvatarUpload
            currentAvatar={user.avatar}
            userName={user.name}
            onAvatarPersisted={onUserPersisted}
          />
        </div>

        {/* Profile completeness indicator */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getCompletenessColor(profileCompleteness)}`} />
              <span className="text-sm font-medium">{getCompletenessText(profileCompleteness)}</span>
            </div>
            <Badge variant="secondary" className="bg-white/50">
              {profileCompleteness}% Complete
            </Badge>
          </div>
        </div>

        {/* Name and Title - Fixed text overlay with better positioning and background */}
        <div className="mt-20 mb-4">
          {/* Text container with subtle background for better readability */}
          <div className="text-overlay-bg rounded-lg p-4 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name || 'Your Name'}
            </h1>
            {user.title && (
              <p className="text-xl text-gray-700 mb-3">{user.title}</p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="profile-stat-card rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{user.projects?.length || 0}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="profile-stat-card rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{user.skills?.length || 0}</div>
            <div className="text-sm text-gray-600">Skills</div>
          </div>
          <div className="profile-stat-card rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{user.experience?.length || 0}</div>
            <div className="text-sm text-gray-600">Experience</div>
          </div>
          <div className="profile-stat-card rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{user.certifications?.length || 0}</div>
            <div className="text-sm text-gray-600">Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}