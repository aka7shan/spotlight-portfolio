import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { api, ApiError, type CvParseResponse } from "../../lib/api";
import type { User } from "../../types/portfolio";
import { CvReviewDialog } from "./CvReviewDialog";

/**
 * CV upload + AI auto-fill (Phase 1.2).
 *
 * Two-step UX:
 *   1. **Upload**     — POST /v1/me/cv. The file is persisted in the
 *                       private `cvs` bucket. The signed URL the API
 *                       returns is short-lived; we offer it as a
 *                       "View" button (opens in a new tab) but do not
 *                       persist it.
 *   2. **Parse with AI** — POST /v1/me/cv/parse. Returns structured
 *                       JSON the user reviews via `CvReviewDialog`.
 *                       Accepted sections are merged into the parent
 *                       form state via `onApplyExtracted`; no DB write
 *                       happens until the user clicks Save Changes.
 *
 * Why we keep the file name `CVManager.tsx` instead of renaming
 * --------------------------------------------------------------
 * The existing ProfileTab imports this by name; renaming churns
 * unrelated files. The component's internals are entirely new (real
 * API, real upload, AI parse) but the import surface is stable.
 *
 * Why `currentUser` instead of just `cvData`
 * ------------------------------------------
 * The review dialog shows a side-by-side diff against the *current
 * form state*, not just the CV row. We accept the whole `User` so the
 * dialog can render meaningful "Current: 3 roles" vs "From CV: 5 roles"
 * messages.
 */

interface CVManagerProps {
  /** Current form-state user (NOT the saved snapshot — we want to
   *  diff against in-flight edits). */
  currentUser: User;
  /** Fired after a successful CV upload or delete. The CV file is
   *  persisted at this point; parent uses this to update local form
   *  state (so the dirty flag doesn't trip on the CV metadata change)
   *  and refresh the shared user cache. */
  onUserPersisted: (user: User) => void;
  /** Fired when the user accepts sections from the AI parse review.
   *  Receives only the fields they checked, ready to merge into
   *  formData via `setFormData(prev => ({...prev, ...partial}))`. */
  onApplyExtracted: (partial: Partial<User>) => void;
  className?: string;
}

// Backend caps (src/lib/storage.ts). Mirror here so we can reject obvious
// over-limits before the network round-trip and give a friendly message.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function CVManager({
  currentUser,
  onUserPersisted,
  onApplyExtracted,
  className = "",
}: CVManagerProps) {
  const cvData = currentUser.cv;

  // We track three independent boolean flags so the UI can show
  // accurate progress: a single "isWorking" would conflate "uploading
  // CV" with "parsing CV with AI", which look very different.
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Last signed URL returned by upload. Re-rendered each upload so the
  // "View" button always points at the most recent file. We deliberately
  // DON'T persist this — signed URLs expire (~10 min); a stale one is
  // worse than no button.
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // Parse review dialog state.
  const [parseResult, setParseResult] = useState<CvParseResponse | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Reset the input element so re-picking the same file fires onChange.
      if (event.target) event.target.value = "";
      if (!file) return;

      setUploadError(null);

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setUploadError("Please choose a PDF or .docx file.");
        return;
      }
      if (file.size > MAX_CV_BYTES) {
        setUploadError(
          `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${Math.round(
            MAX_CV_BYTES / 1024 / 1024,
          )} MB.`,
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
      // Tailored copy by status — the backend uses stable codes for
      // each failure mode (see routes/me.ts).
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
          toast.error("Hit the AI parse limit. Try again in an hour.");
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

  // Bridge the review dialog's "apply selected" event up to the form.
  // We close the dialog here (not from inside it) so the calling
  // component owns the lifecycle and we can warn the user that the
  // changes still need to be Saved.
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV / Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {cvData ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-green-900 break-all">
                      {cvData.fileName}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(cvData.uploadDate)}
                      </span>
                      <span>{formatFileSize(cvData.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleParse}
                disabled={isParsing || isUploading || isRemoving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isParsing ? "Reading your CV…" : "Auto-fill from CV"}
              </Button>

              {signedUrl && (
                <Button asChild variant="outline" size="default">
                  <a href={signedUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View file
                  </a>
                </Button>
              )}

              <Button
                onClick={handleUploadClick}
                variant="outline"
                disabled={isUploading || isParsing || isRemoving}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading…" : "Replace"}
              </Button>

              <Button
                onClick={handleRemove}
                variant="outline"
                disabled={isUploading || isParsing || isRemoving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isRemoving ? "Removing…" : "Remove"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium mb-2">No CV uploaded yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a PDF or DOCX. We can auto-fill your profile from
                  it using AI.
                </p>
              </div>
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading…" : "Upload CV"}
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Tips</p>
          <ul className="space-y-1">
            <li>• PDF or .docx, up to {Math.round(MAX_CV_BYTES / 1024 / 1024)} MB.</li>
            <li>• Auto-fill never overwrites without your review.</li>
            <li>• Stored privately — only you can download it.</li>
          </ul>
        </div>
      </CardContent>

      <CvReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        result={parseResult}
        current={currentUser}
        onApply={handleApplyExtracted}
      />
    </Card>
  );
}
