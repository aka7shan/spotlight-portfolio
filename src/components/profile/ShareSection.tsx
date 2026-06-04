import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Check, Copy, Globe, Loader2, RefreshCw, X } from "lucide-react";
import { api, ApiError, type UsernameRejectionKind } from "../../lib/api";
import type { User } from "../../types/portfolio";

/**
 * Share card on the profile page. Lets the user:
 *   - See their current public URL (/spotlight/<username>)
 *   - Copy it to the clipboard
 *   - Open it in a new tab
 *   - Rename the username (debounced availability check while typing)
 *   - Get a random base62 suggestion if they don't want to think of one
 *
 * Avoids touching the parent's form-dirty state — username changes are
 * persisted by their own endpoint (PATCH /v1/me/share), so the parent
 * shouldn't think the "Save" button needs to flush them. We notify the
 * parent via `onUsernameChanged` so it can update its local user state.
 */

interface ShareSectionProps {
  user: User & { username?: string };
  /** Called after a successful rename so the parent can refresh local state. */
  onUsernameChanged: (newUser: User & { username: string }) => void;
}

type AvailabilityState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "self"; username: string }
  | { kind: "available"; username: string }
  | { kind: "unavailable"; username: string; reason: string; code: UsernameRejectionKind | "taken_by_self" };

const DEBOUNCE_MS = 350;

function buildPublicUrl(username: string): string {
  // Use the current origin so dev (localhost) and prod (vercel.app) both
  // produce a real, clickable URL without needing config.
  if (typeof window === "undefined") return `/spotlight/${username}`;
  return `${window.location.origin}/spotlight/${username}`;
}

export function ShareSection({ user, onUsernameChanged }: ShareSectionProps) {
  const currentUsername = user.username ?? "";
  const publicUrl = useMemo(() => buildPublicUrl(currentUsername), [currentUsername]);

  // Edit state. We keep a draft separate from `currentUsername` so we can
  // validate without flashing the live URL until the user confirms.
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(currentUsername);
  const [availability, setAvailability] = useState<AvailabilityState>({ kind: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  // If the parent updates the user (e.g. after a profile-save round-trip),
  // reset our local draft to match the new ground truth.
  useEffect(() => {
    if (!isEditing) {
      setDraft(currentUsername);
    }
  }, [currentUsername, isEditing]);

  // Debounced availability check. We track the in-flight request via an
  // AbortController so a fast typist's stale responses don't overwrite a
  // newer query's result.
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!isEditing) return;
    const trimmed = draft.trim();

    // No change vs current username → that's "your own" and not an error.
    if (trimmed === currentUsername) {
      setAvailability({ kind: "self", username: trimmed });
      return;
    }
    if (trimmed.length === 0) {
      setAvailability({ kind: "idle" });
      return;
    }

    setAvailability({ kind: "checking" });
    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      api.share
        .check(trimmed)
        // Pass the abort signal would be cleaner but `check` doesn't accept
        // one yet; the abortRef compare-after-resolve below guards us.
        .then((res) => {
          if (controller.signal.aborted) return;
          if (res.available) {
            setAvailability({ kind: "available", username: trimmed });
            return;
          }
          const code = (res.kind ?? "invalid_format") as UsernameRejectionKind | "taken_by_self";
          setAvailability({
            kind: "unavailable",
            username: trimmed,
            reason: res.message ?? "Not available",
            code,
          });
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          // 429s here are noisy but informational only — don't spam toasts.
          if (err instanceof ApiError && err.status === 429) {
            setAvailability({
              kind: "unavailable",
              username: trimmed,
              reason: "Slow down — too many checks. Try again in a moment.",
              code: "invalid_format",
            });
            return;
          }
          const message =
            err instanceof Error ? err.message : "Couldn't check availability";
          setAvailability({
            kind: "unavailable",
            username: trimmed,
            reason: message,
            code: "invalid_format",
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draft, isEditing, currentUsername]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setJustCopied(true);
      window.setTimeout(() => setJustCopied(false), 1200);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy. Long-press the link to copy manually.");
    }
  }, [publicUrl]);

  const handleSuggest = useCallback(async () => {
    setIsSuggesting(true);
    try {
      const res = await api.share.suggest();
      setDraft(res.username);
      setIsEditing(true);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Couldn't get a suggestion";
      toast.error(message);
    } finally {
      setIsSuggesting(false);
    }
  }, []);

  const canSubmit =
    isEditing &&
    !isSubmitting &&
    (availability.kind === "available" ||
      // Allow re-submitting the same username (it's a no-op but
      // lets the user dismiss the edit mode without explicit "Cancel").
      availability.kind === "self");

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const trimmed = draft.trim();
    if (trimmed === currentUsername) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.share.update(trimmed);
      onUsernameChanged(res.user);
      setIsEditing(false);
      toast.success(`URL updated to /spotlight/${res.username}`);
    } catch (err) {
      // Backend may have raced us (someone else claimed the name between our
      // last check and this PATCH). Surface that as an inline error instead
      // of a toast — same place the user has been looking.
      if (err instanceof ApiError && err.status === 409) {
        setAvailability({
          kind: "unavailable",
          username: trimmed,
          reason: "Just taken. Try another.",
          code: "taken",
        });
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Couldn't update username";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, draft, currentUsername, onUsernameChanged]);

  const handleCancel = useCallback(() => {
    setDraft(currentUsername);
    setAvailability({ kind: "idle" });
    setIsEditing(false);
  }, [currentUsername]);

  return (
    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Globe className="w-5 h-5" />
          Your shareable portfolio link
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current URL row */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-blue-700 mb-1 font-medium uppercase tracking-wide">
              Live at
            </p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-mono text-blue-900 hover:text-blue-700 break-all underline-offset-2 hover:underline"
            >
              {publicUrl}
            </a>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={handleCopy} size="sm" variant="secondary">
              {justCopied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                Customize
              </Button>
            )}
          </div>
        </div>

        {/* Edit row */}
        {isEditing && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm text-blue-900/60 whitespace-nowrap font-mono">
                  /spotlight/
                </span>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.toLowerCase().trim())}
                  placeholder="your-username"
                  maxLength={32}
                  className="flex-1 font-mono bg-white"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSuggest}
                  variant="outline"
                  size="sm"
                  disabled={isSuggesting}
                  title="Generate a random available username"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="ml-1 hidden sm:inline">Random</span>
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit} size="sm">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Availability hint */}
            <div className="min-h-[20px] text-sm">
              {availability.kind === "checking" && (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Checking availability…
                </span>
              )}
              {availability.kind === "available" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">
                  <Check className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              )}
              {availability.kind === "self" && (
                <span className="text-muted-foreground">
                  That's your current username.
                </span>
              )}
              {availability.kind === "unavailable" && (
                <span className="text-red-700">{availability.reason}</span>
              )}
            </div>

            <p className="text-xs text-blue-900/70">
              3–32 characters. Lowercase letters, numbers, and hyphens only.
              Changing your URL won't redirect old links.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
