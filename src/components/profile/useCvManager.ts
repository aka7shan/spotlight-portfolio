import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { api, ApiError, type CvParseResponse } from "../../lib/api";
import type { User } from "../../types/portfolio";

/**
 * Shared CV upload + AI auto-fill logic (Phase 1.2).
 *
 * Why a hook
 * ----------
 * The same upload → parse → review flow now drives two very different
 * surfaces: the onboarding hero (`ProfileGettingStarted`, shown to blank
 * profiles) and the slim `CvQuickBar` (shown to everyone else). Extracting
 * the ~150 lines of stateful logic here keeps those presentational shells
 * thin and guarantees identical behaviour/error-handling across both.
 *
 * The consumer renders the bits that need a DOM home — the hidden file
 * `<input ref={fileInputRef} onChange={handleFileSelect} />` and the
 * `<CvReviewDialog .../>`. Only one consumer is mounted at a time (hero
 * XOR quick-bar) so there's no duplicate-input clash.
 */

// Backend caps (server src/lib/storage.ts). Mirror here so we can reject
// obvious over-limits before the network round-trip and give a friendly
// message instead of a 413.
export const MAX_CV_BYTES = 4 * 1024 * 1024;
export const MAX_CV_MB = Math.round(MAX_CV_BYTES / 1024 / 1024);
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

interface UseCvManagerArgs {
  /** Fired after a successful upload/remove — the file is persisted at
   *  this point. Parent merges the CV metadata into form state. */
  onUserPersisted: (user: User) => void;
  /** Fired when the user accepts sections from the AI parse review. */
  onApplyExtracted: (partial: Partial<User>) => void;
}

export function useCvManager({
  onUserPersisted,
  onApplyExtracted,
}: UseCvManagerArgs) {
  // Three independent flags (not one "isWorking") so the UI can label the
  // active step precisely — "Uploading…" vs "Reading your CV…" look very
  // different to the user.
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Last signed URL from upload. Short-lived (~10 min) so we offer it as a
  // "View" affordance but never persist it — a stale link is worse than none.
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const [parseResult, setParseResult] = useState<CvParseResponse | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Reset the input so re-picking the same file fires onChange again.
      if (event.target) event.target.value = "";
      if (!file) return;

      setUploadError(null);

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setUploadError("Please choose a PDF or .docx file.");
        return;
      }
      if (file.size > MAX_CV_BYTES) {
        setUploadError(
          `File is ${(file.size / 1024 / 1024).toFixed(
            1,
          )} MB. The limit is ${MAX_CV_MB} MB.`,
        );
        return;
      }

      setIsUploading(true);
      try {
        const res = await api.me.uploadCv(file);
        setSignedUrl(res.cv.signedUrl);
        onUserPersisted(res.user);
        toast.success("CV uploaded", {
          description:
            "Click \u201cAuto-fill from CV\u201d to extract your details with AI.",
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Upload failed. Please try again.";
        setUploadError(message);
        toast.error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [onUserPersisted],
  );

  const handleParse = useCallback(async () => {
    setIsParsing(true);
    try {
      const result = await api.me.parseCv();
      setParseResult(result);
      setReviewOpen(true);
    } catch (err) {
      // Tailored copy by status — the backend uses stable codes for each
      // failure mode (see server routes/me.ts).
      if (err instanceof ApiError) {
        if (err.status === 404) {
          toast.error("Upload a CV first before extracting.");
        } else if (err.status === 415) {
          toast.error(
            "We can't read .doc files. Please re-upload as PDF or .docx.",
          );
        } else if (err.status === 422) {
          toast.error("We couldn't read any text from this CV.", {
            description:
              "If it's a scanned PDF, please upload a text-based version.",
          });
        } else if (err.status === 429) {
          // Backend message carries the wait-time + ownership info.
          toast.error(err.message);
        } else if (err.status === 503) {
          toast.error("AI auto-fill isn't enabled on this server yet.");
        } else if (err.status === 502) {
          toast.error("AI provider is temporarily unavailable. Try again.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Could not parse your CV. Please try again.");
      }
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleRemove = useCallback(async () => {
    setIsRemoving(true);
    try {
      const res = await api.me.removeCv();
      setSignedUrl(null);
      setParseResult(null);
      onUserPersisted(res.user);
      toast.success("CV removed");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not remove CV. Please try again.";
      toast.error(message);
    } finally {
      setIsRemoving(false);
    }
  }, [onUserPersisted]);

  // Bridge the review dialog's "apply selected" up to the form. We toast
  // here (not inside the dialog) so the calling surface owns the lifecycle
  // and can remind the user the changes still need Saving.
  const handleApplyExtracted = useCallback(
    (partial: Partial<User>) => {
      onApplyExtracted(partial);
      const sectionCount = Object.keys(partial).length;
      toast.success(
        sectionCount === 1
          ? "Applied 1 section from your CV."
          : `Applied ${sectionCount} sections from your CV.`,
        {
          description:
            "Review the tabs, then click Save Changes to persist them.",
        },
      );
    },
    [onApplyExtracted],
  );

  const isBusy = isUploading || isParsing || isRemoving;

  return {
    isUploading,
    isParsing,
    isRemoving,
    isBusy,
    uploadError,
    signedUrl,
    parseResult,
    reviewOpen,
    setReviewOpen,
    fileInputRef,
    handleUploadClick,
    handleFileSelect,
    handleParse,
    handleRemove,
    handleApplyExtracted,
  };
}
