import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
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
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Info,
  LayoutTemplate,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { api, ApiError } from "../../lib/api";
import { shortLinkPath } from "../../lib/routes";
import { getTemplateName } from "../../lib/templates";

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
   * The user's `activeTemplate` id — used to surface which template the
   * public link currently renders. Falls back to the default template
   * name (Classic) when unset, matching the public page's behaviour.
   */
  activeTemplate?: string;
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

export function ShortLinkCard({
  shortCode,
  activeTemplate,
  onShortCodeChanged,
}: ShortLinkCardProps) {
  const publicUrl = useMemo(() => buildPublicUrl(shortCode), [shortCode]);
  const templateName = getTemplateName(activeTemplate);

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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-gray-900 mb-3">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold">Shareable link</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="About your shareable link"
                className="rounded text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent align="start">
              Permanent random link. Pick which template renders from the{" "}
              <span className="font-medium">Templates</span> page.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Live at
            </p>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
              title="Template currently rendered at your public link"
            >
              <LayoutTemplate className="h-3 w-3" />
              {templateName}
            </span>
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-blue-700 hover:text-blue-900 break-all underline-offset-2 hover:underline"
          >
            {publicUrl}
          </a>

          {/* Buttons stack in a 3-up grid so they stay tappable in the
              narrow sidebar without wrapping awkwardly. */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button onClick={handleCopy} size="sm" variant="secondary" className="px-2">
              {justCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="px-2"
              title="Open this portfolio in a new tab"
            >
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </a>
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" disabled={isRegenerating} className="px-2">
                  {isRegenerating ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  )}
                  New
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
      </CardContent>
    </Card>
  );
}
