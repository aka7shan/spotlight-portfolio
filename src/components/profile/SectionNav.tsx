import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../ui/utils";
import { PROFILE_SECTIONS, type NavSection } from "./sectionDefinitions";

interface SectionNavProps {
  /** Currently-active section id from `useScrollSpy`, or null. */
  activeId: string | null;
  /** Override the section list (rarely needed — defaults to `PROFILE_SECTIONS`). */
  sections?: ReadonlyArray<NavSection>;
  /** Map of `id` → bool. When `true`, the pill renders a red warning dot. */
  warnings?: Record<string, boolean>;
  /**
   * Click handler for a pill. When provided the parent owns the jump (so
   * it can also optimistically highlight sections it can't fully scroll
   * to). Falls back to the internal `scrollIntoView` when omitted.
   */
  onSelect?: (id: string) => void;
  /** Applied to the outer container so the parent can make it sticky. */
  className?: string;
}

/**
 * Horizontal-scrolling pill nav for the profile page.
 *
 * Behaviour:
 *   - Clicking a pill calls `scrollToSection(id)` which uses native
 *     `scrollIntoView({ behavior: 'smooth' })` — the matching section
 *     declares `scroll-mt-32` so the heading clears our sticky offset.
 *   - The currently-active pill scrolls itself into view on the
 *     horizontal axis as `activeId` changes, so on narrow widths the
 *     reader can always see the active label.
 *   - On overflow we get a native horizontal scrollbar (intentional —
 *     matches the screenshot's appearance and is more discoverable than
 *     a hidden carousel).
 */
export function SectionNav({
  activeId,
  sections = PROFILE_SECTIONS,
  warnings,
  onSelect,
  className,
}: SectionNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  // Honour the OS "reduce motion" setting: we keep the sliding indicator
  // (so the active pill is always correctly placed) but make the move
  // instant instead of springing.
  const reduce = useReducedMotion();

  // Pre-compute the warning flags into each section so the render loop
  // is a single map. Doing this here (vs. in the loop body) keeps the
  // JSX flat and makes the warning prop easy to audit.
  const items = useMemo<NavSection[]>(
    () =>
      sections.map((s) => ({
        ...s,
        hasWarning: warnings?.[s.id] ?? s.hasWarning ?? false,
      })),
    [sections, warnings],
  );

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Keep the active pill visible inside the horizontal scroll area.
  // `scrollIntoView` with `inline: 'center'` centres the active pill in
  // the strip rather than just nudging it into view at the edge —
  // smoother UX as the reader scrolls past many sections.
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const pill = listRef.current.querySelector<HTMLButtonElement>(
      `[data-section-id="${activeId}"]`,
    );
    if (!pill) return;
    pill.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return (
    <nav
      aria-label="Profile sections"
      className={cn(
        // White surface so the strip reads as a navbar against the
        // page's tinted background. Soft shadow gives it weight as
        // it sticks.
        "bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-sm",
        className,
      )}
    >
      <motion.div
        ref={listRef}
        // `layoutScroll` lets the shared-layout indicator measure this
        // element's scroll offset, so the pill lands in the right place
        // even when the strip is scrolled horizontally.
        layoutScroll
        className={cn(
          // Horizontal scroll with a sensible appearance: the native
          // scrollbar shows up on overflow (matches reference image)
          // but we use thin scrollbars on systems that support them.
          "flex items-center gap-1 overflow-x-auto px-2 py-2",
          "[scrollbar-width:thin]",
        )}
      >
        {items.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              data-section-id={s.id}
              onClick={() => (onSelect ?? scrollToSection)(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
                isActive
                  ? // Soft purple pill matches the reference design and
                    // contrasts cleanly against the white nav surface.
                    "text-purple-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {/*
                Shared-layout "magic" indicator: a single purple pill that
                physically slides from the previously-active label to the
                new one via `layoutId`. Only ever one is mounted at a time.
              */}
              {isActive && (
                <motion.span
                  layoutId="section-nav-active-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-purple-100"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 40 }
                  }
                />
              )}
              <span className="relative z-10">{s.label}</span>
              {s.hasWarning && (
                <span
                  aria-label="Needs attention"
                  className="absolute -top-0.5 -right-0.5 z-10 inline-block h-1.5 w-1.5 rounded-full bg-red-500"
                />
              )}
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
}
