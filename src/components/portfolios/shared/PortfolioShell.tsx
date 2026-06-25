import type { ReactNode } from "react";
import { cn } from "../../ui/utils";

interface PortfolioShellProps {
  /** Usually a <PortfolioSidebar />. Rendered as the first flex child. */
  sidebar: ReactNode;
  children: ReactNode;
  /** Outer wrapper classes — typically the page background. */
  className?: string;
  /** Inner content wrapper (defaults to a centred max-w-6xl column). */
  contentClassName?: string;
}

/**
 * Responsive layout shell for sidebar-based templates.
 *
 * Replaces the old `flex + ml-64 + h-full overflow-y-auto` pattern that:
 *   - hardcoded a 256px left margin (broke on tablet/mobile),
 *   - created a nested scroll container (broke fullscreen + the device-frame
 *     preview, and caused double scrollbars).
 *
 * Now the page scrolls naturally; the sidebar is sticky (desktop) / a top bar
 * (mobile). Works identically in the editor preview, fullscreen, and the
 * public page.
 */
export function PortfolioShell({ sidebar, children, className, contentClassName }: PortfolioShellProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      <div className="lg:flex">
        {sidebar}
        <main className="flex-1 min-w-0">
          <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12", contentClassName)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
