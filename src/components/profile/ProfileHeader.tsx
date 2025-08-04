import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Camera, MapPin, Mail, Phone } from "lucide-react";
import type { User } from "../../types/portfolio";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileHeaderProps {
  user: User;
  profileCompleteness: number;
  onUpdateUser: (field: keyof User, value: any) => void;
  className?: string;
}

export function ProfileHeader({ 
  user, 
  profileCompleteness, 
  onUpdateUser,
  className = ""
}: ProfileHeaderProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback((avatar: string) => {
    onUpdateUser('avatar', avatar);
  }, [onUpdateUser]);

  const handleAvatarRemove = useCallback(() => {
    onUpdateUser('avatar', undefined);
  }, [onUpdateUser]);

  const handleCoverUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingCover(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTimeout(() => {
        onUpdateUser('coverImage', result);
        setIsUploadingCover(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  }, [onUpdateUser]);

  const handleCoverClick = useCallback(() => {
    coverInputRef.current?.click();
  }, []);

  const handleCoverRemove = useCallback(() => {
    onUpdateUser('coverImage', undefined);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  }, [onUpdateUser]);

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
      {/* Hidden file input for cover image */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {user.coverImage ? (
          <div className="relative w-full h-full group">
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            {/* Cover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                onClick={handleCoverClick}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-black"
                disabled={isUploadingCover}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingCover ? 'Uploading...' : 'Change Cover'}
              </Button>
              <Button
                onClick={handleCoverRemove}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-red-600"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Add Cover Image</h3>
                <p className="text-sm opacity-90 mb-4">Make your profile stand out</p>
              </div>
              <Button 
                onClick={handleCoverClick}
                variant="secondary"
                size="sm"
                disabled={isUploadingCover}
                className="bg-white/90 hover:bg-white text-black"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingCover ? 'Uploading...' : 'Upload Cover Image'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar positioned to overlap cover */}
        <div className="absolute -top-16 left-6">
          <AvatarUpload
            currentAvatar={user.avatar}
            userName={user.name}
            onAvatarChange={handleAvatarChange}
            onAvatarRemove={handleAvatarRemove}
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