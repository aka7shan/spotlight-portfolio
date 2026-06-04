import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Check, Copy, ExternalLink, Globe, Loader2, RefreshCw } from "lucide-react";
import { api, ApiError } from "../../lib/api";
import { shortLinkPath } from "../../lib/routes";

/**
 * "Your portfolio link" card on the profile page.
 *
 * Replaces the older `ShareSection` (which managed an editable username
 * URL). Phase 1.2 dropped that concept — every portfolio is addressed
 * by a Base62 short code minted by the backend. The user no longer
 * picks the URL; they can however regenerate it (issuing a new code
 * and invalidating the old one) when they want to retire a previously-
 * shared link.
 *
 * The card surfaces three actions:
 *   - **Copy**     — copy the absolute URL to the clipboard.
 *   - **Open**     — open in a new tab for a one-click preview.
 *   - **New link** — confirm + POST regenerate, then patch local state.
 *
 * Lives outside the form-save flow because regenerate has its own
 * dedicated endpoint with its own atomic semantics — touching it
 * shouldn't put the parent's Save button into the dirty state.
 */

interface ShortLinkCardProps {
  /** The user's current short code. Comes from GET /v1/me. */
  shortCode: string;
  /**
   * Called after a successful regenerate so the parent can swap its
   * local snapshot of the user. We pass the NEW code through; the
   * parent does the merge.
   */
  onShortCodeChanged: (newCode: string) => void;
}

function buildPublicUrl(code: string): string {
  // Use the current origin so dev (localhost) and prod (vercel.app)
  // both produce a real, clickable URL with no config required.
  if (typeof window === "undefined") return shortLinkPath(code);
  return `${window.location.origin}${shortLinkPath(code)}`;
}

export function ShortLinkCard({ shortCode, onShortCodeChanged }: ShortLinkCardProps) {
  const publicUrl = useMemo(() => buildPublicUrl(shortCode), [shortCode]);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setJustCopied(true);
      // Reset the "Copied" state after a short beat so the button label
      // returns to "Copy" — kept short so a power user pasting twice in
      // quick succession sees the affirmation each time.
      window.setTimeout(() => setJustCopied(false), 1200);
      toast.success("Link copied to clipboard");
    } catch {
      // Clipboard write can fail on insecure contexts (http://) or when
      // the user denies permission. Tell them how to copy manually.
      toast.error("Couldn't copy. Long-press the link to copy manually.");
    }
  }, [publicUrl]);

  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true);
    try {
      const res = await api.me.regenerateShortLink();
      onShortCodeChanged(res.shortCode);
      toast.success("New link issued — your old one will no longer work.");
      setConfirmOpen(false);
    } catch (err) {
      // The endpoint is rate-limited at 5/min/user; we surface 429 with
      // a softer message so users don't think the system is broken.
      if (err instanceof ApiError && err.status === 429) {
        toast.error("Slow down — try regenerating again in a minute.");
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Couldn't issue a new link";
      toast.error(message);
    } finally {
      setIsRegenerating(false);
    }
  }, [onShortCodeChanged]);

  return (
    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Globe className="w-5 h-5" />
          Your shareable portfolio link
        </CardTitle>
      </CardHeader>
      <CardContent>
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
          <div className="flex flex-wrap gap-2 shrink-0">
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
            <Button
              size="sm"
              variant="outline"
              asChild
              title="Open this portfolio in a new tab"
            >
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </a>
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" disabled={isRegenerating}>
                  {isRegenerating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  New link
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Issue a new link?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your current URL{" "}
                    <span className="font-mono text-foreground">{publicUrl}</span>{" "}
                    will stop working immediately. Anyone with the old link will
                    see a 404. Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRegenerating}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      // Default behavior closes the dialog before our async
                      // call finishes; intercept so we can show the spinner
                      // and only close on success.
                      e.preventDefault();
                      void handleRegenerate();
                    }}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : null}
                    Yes, regenerate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <p className="text-xs text-blue-900/70 mt-3">
          Each portfolio gets a permanent random link. Choose which template
          renders here from the{" "}
          <span className="font-medium">Templates</span> page — the "Set as
          Public" button on any template card swaps what visitors see.
        </p>
      </CardContent>
    </Card>
  );
}
