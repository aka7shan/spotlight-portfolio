import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { api, ApiError } from "../../lib/api";
import type { User } from "../../types/portfolio";

/**
 * Landscape cover image uploader for the profile header.
 *
 * This is the cover counterpart of `AvatarUpload`. The two components are
 * deliberately kept separate (not generalized into one `ImageUpload`) because
 * their layouts diverge — the avatar is a circle anchored to a fixed size,
 * the cover stretches to fill its container — and the affordance vocabulary
 * is different (avatars get hover-overlay buttons inside the circle; covers
 * float buttons over the whole banner with a gradient placeholder).
 *
 * Upload flow mirrors `AvatarUpload`:
 *   1. Validate MIME + size client-side (cheap rejection).
 *   2. Optimistic `blob:` preview for instant feedback.
 *   3. POST /v1/me/cover (multipart) — backend writes to Storage AND DB.
 *   4. On success the parent receives the FULL assembled user via
 *      `onCoverPersisted` so it can sync both its local form state and
 *      the shared useProfile cache (navbar, gallery, etc.) at once.
 *   5. On failure the optimistic preview is rolled back.
 */

interface CoverUploadProps {
  currentCover?: string;
  /**
   * Called after a successful upload OR successful delete with the FULL
   * assembled user payload. See AvatarUpload for the symmetric design
   * rationale — short version: passing the user (not just the URL) lets
   * the parent surgically update form state AND refresh the global
   * useProfile cache in one shot.
   */
  onCoverPersisted: (user: User) => void;
  /**
   * Tailwind height class(es) for the banner. Defaults to the full-height
   * header treatment; the sidebar summary card passes a shorter value
   * (e.g. `h-20`) via `compact`.
   */
  heightClassName?: string;
  /**
   * Compact treatment for tight containers (the sidebar summary card):
   * a slim banner with a small icon button cluster instead of the large
   * centered CTA / hover overlay. Pairs with a short `heightClassName`.
   */
  compact?: boolean;
  className?: string;
}

// Mirror backend limits in src/lib/storage.ts so we can reject obviously-bad
// files before sending bytes over the wire.
const MAX_COVER_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function CoverUpload({
  currentCover,
  onCoverPersisted,
  heightClassName = "h-48 md:h-64",
  compact = false,
  className = "",
}: CoverUploadProps) {
  const [isWorking, setIsWorking] = useState(false);
  // Local blob URL displayed while bytes are in flight. Cleared on success or
  // failure; the parent's `currentCover` takes over once the upload resolves.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Final safety net: revoke any blob URL on unmount so we don't leak handles
  // if the user navigates away mid-upload. Per-file revocation happens inline
  // in the handlers below.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Reset so the same file can be re-selected and re-fire the event.
      if (event.target) event.target.value = "";
      if (!file) return;

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        toast.error("Please select a JPG, PNG, WebP, or GIF image.");
        return;
      }
      if (file.size > MAX_COVER_BYTES) {
        toast.error(
          `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${Math.round(
            MAX_COVER_BYTES / 1024 / 1024,
          )} MB.`,
        );
        return;
      }

      const localUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return localUrl;
      });
      setIsWorking(true);

      try {
        // Forward the full assembled user; the parent will surgically
        // sync formData.coverImage + originalData.coverImage AND swap
        // the useProfile cache. See AvatarUpload for the same pattern.
        const { user } = await api.me.uploadCover(file);
        onCoverPersisted(user);
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        toast.success("Cover updated");
      } catch (err) {
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Cover upload failed";
        toast.error(message);
      } finally {
        setIsWorking(false);
      }
    },
    [onCoverPersisted],
  );

  const handleUploadClick = useCallback(() => {
    if (isWorking) return;
    fileInputRef.current?.click();
  }, [isWorking]);

  const handleRemove = useCallback(async () => {
    if (isWorking) return;
    setIsWorking(true);
    try {
      const { user } = await api.me.removeCover();
      onCoverPersisted(user);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      toast.success("Cover removed");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove cover";
      toast.error(message);
    } finally {
      setIsWorking(false);
    }
  }, [isWorking, onCoverPersisted, previewUrl]);

  const displayCover = previewUrl || currentCover;

  return (
    <div className={`relative ${heightClassName} overflow-hidden ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {displayCover ? (
        <div className="relative w-full h-full group">
          <img
            src={displayCover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {compact ? (
            // Compact: small icon buttons pinned top-right so they never
            // collide with the avatar that overlaps the banner.
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isWorking}
                aria-label="Change cover"
                className="h-7 w-7 rounded-full bg-white/85 hover:bg-white text-gray-700 flex items-center justify-center shadow disabled:opacity-60"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isWorking}
                aria-label="Remove cover"
                className="h-7 w-7 rounded-full bg-white/85 hover:bg-white text-red-600 flex items-center justify-center shadow disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            // Hover overlay — desktop hover OR persistent on touch via :focus-within.
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                onClick={handleUploadClick}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-black"
                disabled={isWorking}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isWorking ? "Uploading..." : "Change Cover"}
              </Button>
              <Button
                onClick={handleRemove}
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-red-600"
                disabled={isWorking}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : compact ? (
        // Compact empty-state: a slim gradient band that is itself the
        // upload button. No big CTA — the summary card stays tight.
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isWorking}
          className="w-full h-full bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center group"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 group-hover:text-gray-800">
            <Camera className="w-3.5 h-3.5" />
            {isWorking ? "Uploading…" : "Add cover"}
          </span>
        </button>
      ) : (
        // Empty-state: gradient placeholder + single CTA. Same visual as the
        // legacy FileReader-based implementation so the redesign is a drop-in.
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ImagePlus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Cover Image</h3>
              <p className="text-sm opacity-90 mb-4">Make your profile stand out</p>
            </div>
            <Button
              onClick={handleUploadClick}
              variant="secondary"
              size="sm"
              disabled={isWorking}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isWorking ? "Uploading..." : "Upload Cover Image"}
            </Button>
          </div>
        </div>
      )}

      {/* Spinner overlay for in-flight uploads. pointer-events-none so the
          underlying hover overlay can still receive clicks if the user is
          impatient. */}
      {isWorking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
