import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Camera, Trash2 } from "lucide-react";
import { api, ApiError } from "../../lib/api";
import type { User } from "../../types/portfolio";
import { ImageCropDialog } from "./ImageCropDialog";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  /**
   * Called after a successful upload OR successful delete with the FULL
   * assembled user payload returned by the backend. The avatar is already
   * persisted by this point — the parent uses this to:
   *   1. Update its local user-shaped state (formData / originalData on the
   *      profile page) so the dirty-flag check stays clean.
   *   2. Refresh the shared user cache (useProfile) so other screens
   *      reading `user.avatar` (navbar, gallery) see the change without
   *      a manual reload.
   *
   * Passing the WHOLE user instead of just the URL means the parent
   * doesn't have to choose between "merge field" and "swap user" — it
   * has both options.
   */
  onAvatarPersisted: (user: User) => void;
  className?: string;
}

// Mirror the backend's limits (src/lib/storage.ts) so we can reject
// obviously-bad files before sending bytes over the wire.
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarPersisted,
  className = "",
}: AvatarUploadProps) {
  const [isWorking, setIsWorking] = useState(false);
  // Local blob URL displayed while bytes are in flight. We don't reuse
  // currentAvatar for this because we want instant feedback the moment the
  // user confirms the crop, before the network round-trip completes.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Object URL of the picked file while the crop/reposition dialog is open.
  // Upload only happens once the user confirms the crop.
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  // Whether the "view photo" preview dialog (with Change/Remove) is open.
  const [previewOpen, setPreviewOpen] = useState(false);
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

  // Pick a file → validate → open the crop dialog (no upload yet).
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const url = URL.createObjectURL(file);
      setCropSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    [],
  );

  const closeCrop = useCallback(() => {
    setCropSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  // Upload the cropped result. Optimistic preview + full-user sync — only
  // the bytes now come from the crop canvas, not the raw file.
  const uploadFile = useCallback(
    async (file: File) => {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return localUrl;
      });
      setIsWorking(true);

      try {
        const { user } = await api.me.uploadAvatar(file);
        onAvatarPersisted(user);
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        toast.success("Avatar updated");
      } catch (err) {
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
    [onAvatarPersisted],
  );

  const handleCropConfirm = useCallback(
    (blob: Blob) => {
      const file = new File([blob], "avatar.jpg", {
        type: blob.type || "image/jpeg",
      });
      closeCrop();
      void uploadFile(file);
    },
    [closeCrop, uploadFile],
  );

  const handleUploadClick = useCallback(() => {
    if (isWorking) return;
    fileInputRef.current?.click();
  }, [isWorking]);

  const handleRemove = useCallback(async () => {
    if (isWorking) return;
    setIsWorking(true);
    try {
      const { user } = await api.me.removeAvatar();
      onAvatarPersisted(user);
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
  }, [isWorking, onAvatarPersisted, previewUrl]);

  // From the preview dialog: close it, then open the file picker (which
  // leads into the crop dialog on selection).
  const handleChangeFromPreview = useCallback(() => {
    setPreviewOpen(false);
    handleUploadClick();
  }, [handleUploadClick]);

  const handleRemoveFromPreview = useCallback(() => {
    setPreviewOpen(false);
    void handleRemove();
  }, [handleRemove]);

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

      {/* The avatar is a button: clicking opens the preview dialog where the
          Change / Remove actions live (so we don't clutter the small circle). */}
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        aria-label="View profile photo"
        className="relative group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
      >
        <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
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

        {/* Hover hint that the photo is interactive. */}
        <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </span>

        {isWorking && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
            <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </button>

      {/* Preview dialog — shows the photo large with its actions. */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-[min(92vw,380px)] max-w-none">
          <DialogHeader>
            <DialogTitle>Profile photo</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-2">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={userName || "Profile"}
                className="h-56 w-56 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-6xl font-semibold text-white shadow-lg">
                {fallbackInitial}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-center">
            <Button
              onClick={handleChangeFromPreview}
              disabled={isWorking}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Camera className="mr-2 h-4 w-4" />
              {currentAvatar ? "Change photo" : "Upload photo"}
            </Button>
            {currentAvatar && (
              <Button
                onClick={handleRemoveFromPreview}
                variant="outline"
                disabled={isWorking}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={cropSrc !== null}
        imageSrc={cropSrc}
        aspect={1}
        cropShape="round"
        title="Adjust your profile photo"
        confirmLabel="Set photo"
        maxOutputSize={512}
        onCancel={closeCrop}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
