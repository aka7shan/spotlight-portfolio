import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Trash2, ImagePlus } from "lucide-react";
import { api, ApiError } from "../../lib/api";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  /**
   * Called after a successful upload with the new persisted avatar URL.
   * The avatar is already saved in the database by this point — the parent
   * uses this to refresh its local user state, not to trigger another save.
   */
  onAvatarChange: (avatar: string) => void;
  /**
   * Called after a successful delete. The avatar field has already been
   * cleared in the database.
   */
  onAvatarRemove: () => void;
  className?: string;
}

// Mirror the backend's limits (src/lib/storage.ts) so we can reject
// obviously-bad files before sending bytes over the wire.
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
  onAvatarRemove,
  className = "",
}: AvatarUploadProps) {
  const [isWorking, setIsWorking] = useState(false);
  // Local blob URL displayed while bytes are in flight. We don't reuse
  // currentAvatar for this because we want instant feedback the moment the
  // user picks a file, before the network round-trip completes.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up any outstanding blob: URL when this component unmounts.
  // Per-file cleanup happens in the upload/remove handlers below.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // Deliberately runs only on unmount: we revoke inline elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Reset the input element so picking the same file twice re-fires the change event.
      if (event.target) event.target.value = "";
      if (!file) return;

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        toast.error("Please select a JPG, PNG, WebP, or GIF image.");
        return;
      }
      if (file.size > MAX_AVATAR_BYTES) {
        toast.error(
          `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${Math.round(
            MAX_AVATAR_BYTES / 1024 / 1024,
          )} MB.`,
        );
        return;
      }

      // Instant local preview so the UI feels responsive on slow networks.
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return localUrl;
      });
      setIsWorking(true);

      try {
        const { avatarUrl } = await api.me.uploadAvatar(file);
        // Persisted. Swap the blob preview for the real URL via the parent.
        onAvatarChange(avatarUrl);
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        toast.success("Avatar updated");
      } catch (err) {
        // Roll back the optimistic preview.
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Avatar upload failed";
        toast.error(message);
      } finally {
        setIsWorking(false);
      }
    },
    [onAvatarChange],
  );

  const handleUploadClick = useCallback(() => {
    if (isWorking) return;
    fileInputRef.current?.click();
  }, [isWorking]);

  const handleRemove = useCallback(async () => {
    if (isWorking) return;
    setIsWorking(true);
    try {
      await api.me.removeAvatar();
      onAvatarRemove();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      toast.success("Avatar removed");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove avatar";
      toast.error(message);
    } finally {
      setIsWorking(false);
    }
  }, [isWorking, onAvatarRemove, previewUrl]);

  const displayAvatar = previewUrl || currentAvatar;
  const fallbackInitial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="relative group cursor-pointer" onClick={handleUploadClick}>
        <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
          {displayAvatar ? (
            <AvatarImage
              src={displayAvatar}
              alt={userName || "Profile"}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {fallbackInitial}
            </AvatarFallback>
          )}
        </Avatar>

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
                disabled={isWorking}
              >
                <Camera className="w-3 h-3 mr-1" />
                {isWorking ? "Uploading..." : "Change"}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  void handleRemove();
                }}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-red-600 border-0 text-xs px-3 py-1"
                disabled={isWorking}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <ImagePlus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">
                {isWorking ? "Uploading..." : "Upload Image"}
              </span>
            </div>
          )}
        </div>
      </div>

      {isWorking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
