import {
  Sparkles,
  Upload,
  PenLine,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import type { User } from "../../types/portfolio";
import { CvReviewDialog } from "./CvReviewDialog";
import { useCvManager, MAX_CV_MB } from "./useCvManager";

interface ProfileGettingStartedProps {
  /** Current form-state user — the review dialog diffs against this. */
  currentUser: User;
  /** Bubbled up after a CV upload/remove persists. */
  onUserPersisted: (user: User) => void;
  /** Merges accepted CV-parse output into the parent form state. */
  onApplyExtracted: (partial: Partial<User>) => void;
  /** Dismisses the hero and drops the user into the manual editor. */
  onFillManually: () => void;
  className?: string;
}

/**
 * First-run "Get started" hero, shown above the editor only while the
 * profile is a blank slate (see `isProfileEmpty`). It puts the highest-
 * leverage action — résumé upload + AI auto-fill — front and centre, with
 * a manual fallback. Collapses the instant the profile has any content
 * (the parent stops rendering it).
 */
export function ProfileGettingStarted({
  currentUser,
  onUserPersisted,
  onApplyExtracted,
  onFillManually,
  className,
}: ProfileGettingStartedProps) {
  const cv = currentUser.cv;
  const firstName = currentUser.name?.trim().split(/\s+/)[0];

  const {
    isUploading,
    isParsing,
    uploadError,
    fileInputRef,
    handleUploadClick,
    handleFileSelect,
    handleParse,
    reviewOpen,
    setReviewOpen,
    parseResult,
    handleApplyExtracted,
  } = useCvManager({ onUserPersisted, onApplyExtracted });

  return (
    <Card className={cn("overflow-hidden border-0 shadow-sm", className)}>
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-5 text-white">
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/80">
          <Sparkles className="h-3.5 w-3.5" />
          Get started
        </div>
        <h2 className="mt-1 text-xl font-semibold">
          {firstName ? `Welcome, ${firstName}!` : "Welcome!"} Let’s build your
          portfolio.
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-white/85">
          Choose the fastest way to fill in your profile — you can edit
          everything afterwards.
        </p>
      </div>

      <CardContent className="grid gap-4 p-6 md:grid-cols-2">
        {/* Door 1 — résumé (the fast path). */}
        <div className="flex flex-col rounded-xl border-2 border-purple-200 bg-purple-50/50 p-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Start with your résumé</h3>
            <Badge className="ml-auto bg-purple-600 hover:bg-purple-600">
              Fastest
            </Badge>
          </div>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Upload a PDF or DOCX and our AI fills in your experience, skills,
            education and more. You just review and save.
          </p>

          {uploadError && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {cv ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{cv.fileName}</span>
              </div>
              <Button
                onClick={handleParse}
                disabled={isParsing || isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isParsing ? "Reading your CV…" : "Auto-fill from CV"}
              </Button>
              <Button
                onClick={handleUploadClick}
                variant="ghost"
                size="sm"
                disabled={isUploading || isParsing}
                className="w-full text-gray-500"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                {isUploading ? "Uploading…" : "Replace file"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading…" : "Upload résumé"}
            </Button>
          )}
          <p className="mt-2 text-center text-xs text-gray-400">
            PDF or DOCX, up to {MAX_CV_MB} MB
          </p>
        </div>

        {/* Door 2 — manual entry. */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gray-100 p-2">
              <PenLine className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Fill it in manually</h3>
          </div>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Prefer to type it yourself? Add your details section by section and
            watch your profile score climb.
          </p>
          <Button
            onClick={onFillManually}
            variant="outline"
            className="mt-4 w-full"
          >
            Start from scratch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-2 text-center text-xs text-gray-400">
            You can upload a résumé later too
          </p>
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
