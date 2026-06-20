import {
  FileText,
  Sparkles,
  Upload,
  Trash2,
  ExternalLink,
  AlertCircle,
  Info,
  Calendar,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { User } from "../../types/portfolio";
import { CvReviewDialog } from "./CvReviewDialog";
import { useCvManager, MAX_CV_MB } from "./useCvManager";

interface CvQuickBarProps {
  /** Current form-state user — the review dialog diffs against this. */
  currentUser: User;
  /** Bubbled up after a CV upload/remove persists. */
  onUserPersisted: (user: User) => void;
  /** Merges accepted CV-parse output into the parent form state. */
  onApplyExtracted: (partial: Partial<User>) => void;
  className?: string;
}

/**
 * Slim CV/résumé bar that pins to the top of the editor column for users
 * who already have content. Replaces the old bottom-of-the-rail CV card so
 * the highest-leverage action (AI auto-fill) reads as a feature, not an
 * afterthought — without stealing a full card slot. New/blank profiles see
 * the richer `ProfileGettingStarted` hero instead.
 */
export function CvQuickBar({
  currentUser,
  onUserPersisted,
  onApplyExtracted,
  className,
}: CvQuickBarProps) {
  const cv = currentUser.cv;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const {
    isUploading,
    isParsing,
    isBusy,
    uploadError,
    signedUrl,
    fileInputRef,
    handleUploadClick,
    handleFileSelect,
    handleParse,
    handleRemove,
    reviewOpen,
    setReviewOpen,
    parseResult,
    handleApplyExtracted,
  } = useCvManager({ onUserPersisted, onApplyExtracted });

  const infoTooltip = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="CV upload tips"
          className="rounded text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent align="start">
        <ul className="space-y-1">
          <li>PDF or .docx, up to {MAX_CV_MB} MB.</li>
          <li>Auto-fill never overwrites without your review.</li>
          <li>Stored privately — only you can download it.</li>
        </ul>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-3.5">
        {uploadError && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="shrink-0 rounded-lg bg-purple-100 p-2">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            {cv ? (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    CV / Resume
                  </span>
                  {infoTooltip}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="truncate">{cv.fileName}</span>
                  <span className="shrink-0 text-gray-300">·</span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-gray-400">
                    <Calendar className="h-3 w-3" />
                    Updated {formatDate(cv.uploadDate)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    Auto-fill from your résumé
                  </span>
                  {infoTooltip}
                </div>
                <span className="block truncate text-xs text-gray-500">
                  Upload a PDF or DOCX and let AI complete your profile.
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {cv ? (
              <>
                <Button
                  onClick={handleParse}
                  disabled={isBusy}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isParsing ? "Reading…" : "Auto-fill from CV"}
                </Button>
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {isUploading ? "Uploading…" : "Replace"}
                </Button>
                <Button
                  onClick={handleRemove}
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  aria-label="Remove CV"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {signedUrl && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    aria-label="View CV file"
                  >
                    <a href={signedUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading…" : "Upload résumé"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="hidden"
      />

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
