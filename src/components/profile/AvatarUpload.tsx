import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Upload, Trash2, ImagePlus } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange: (avatar: string) => void;
  onAvatarRemove: () => void;
  className?: string;
}

export function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onAvatarChange, 
  onAvatarRemove,
  className = ""
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      
      // In a real app, you would upload to a server here
      // For now, we'll just use the data URL
      setTimeout(() => {
        onAvatarChange(result);
        setIsUploading(false);
        setPreviewUrl(null);
      }, 1000);
    };
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    onAvatarRemove();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onAvatarRemove]);

  const displayAvatar = previewUrl || currentAvatar;
  const fallbackInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Avatar with hover overlay */}
      <div className="relative group cursor-pointer" onClick={handleUploadClick}>
        <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
          {displayAvatar ? (
            <AvatarImage src={displayAvatar} alt={userName || 'Profile'} className="object-cover" />
          ) : (
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {fallbackInitial}
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          {displayAvatar ? (
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-black border-0 text-xs px-3 py-1"
                disabled={isUploading}
              >
                <Camera className="w-3 h-3 mr-1" />
                {isUploading ? 'Uploading...' : 'Change'}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-red-600 border-0 text-xs px-3 py-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <ImagePlus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}