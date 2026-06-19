import { useEffect, useState } from "react";

/**
 * Track which section in a vertical document is currently "active" — i.e.
 * the one the reader is most likely looking at — and return its id.
 *
 * Used by the Profile page's `SectionNav` to highlight the matching pill
 * as the user scrolls (and to be the source of truth when a click on a
 * pill snaps the page to a section).
 *
 * Why IntersectionObserver instead of scroll events?
 * --------------------------------------------------
 * Scroll handlers fire many times per frame and need throttling, layout
 * reads, and a manual "which section's top is nearest the nav?" loop.
 * IntersectionObserver gives us the same answer in a single browser-
 * scheduled callback, off the main thread's hot path. Two trade-offs to
 * be aware of:
 *
 *   1. **Visibility is not "active"**: with several sections visible at
 *      once (which is the norm on a tall profile screen) every visible
 *      section satisfies the observer. We pick the one whose top is
 *      closest to (but at-or-below) the sticky nav's bottom edge — see
 *      the resolution loop below.
 *
 *   2. **Boundary jitter**: at section boundaries the active id can
 *      flip-flop on consecutive scroll ticks. We mitigate by reading
 *      `getBoundingClientRect` once per change instead of trusting
 *      `intersectionRatio`, and by only updating state when the result
 *      actually differs from the current value.
 */
export interface UseScrollSpyOptions {
  /**
   * Pixel offset from the top of the viewport that counts as "the active
   * line". A section is considered active when its top edge is at-or-
   * above this line. Should match the height of any sticky header above
   * the content (in our case ~128px — top-16 navbar + top-16 sticky
   * sub-nav). Defaults to 128.
   */
  offset?: number;
  /**
   * Disable the observer entirely. Useful for SSR or when the consumer
   * already knows the answer (e.g. user just clicked a pill and we want
   * to suppress mid-scroll flicker for ~250ms).
   */
  enabled?: boolean;
}

/**
 * @param ids Ordered list of element ids (without the leading `#`) to
 *   observe. Order matters — when no section is below the active line
 *   we fall back to the *last* id in this list (which is what you want
 *   when the reader has scrolled all the way to the bottom).
 * @returns The currently-active id, or `null` until the first frame.
 */
export function useScrollSpy(
  ids: readonly string[],
  { offset = 128, enabled = true }: UseScrollSpyOptions = {},
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || ids.length === 0) {
      setActiveId(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    /**
     * Recompute the active section.
     *
     * Rule: the active section is the one whose `top` is closest to (but
     * not greater than) the offset line. Equivalent to "the last section
     * the reader has scrolled past, accounting for the sticky header".
     *
     * Edge cases:
     *   - Before scrolling past anything: first id wins.
     *   - After scrolling past everything: last id wins (so the trailing
     *     pill stays highlighted while the user reads the last block).
     */
    const recompute = () => {
      let bestId: string | null = elements[0]?.id ?? null;
      let bestTop = -Infinity;

      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0 && top > bestTop) {
          bestTop = top;
          bestId = el.id;
        }
      }

      // After scrolling past the last section the loop's predicate
      // (`top - offset <= 0`) holds for every element, and we end up
      // with the bottom-most one — which is what we want. No special
      // case needed; the comment above documents the intent.

      setActiveId((prev) => (prev === bestId ? prev : bestId));
    };

    // Cheap entry-point: run once now so the nav highlights correctly
    // on first paint without waiting for a scroll event.
    recompute();

    // We use the same observer to fan-out a `recompute` rather than
    // relying on `entry.isIntersecting` directly — the per-element
    // intersection signal isn't expressive enough (we'd need ratios +
    // direction tracking). The observer effectively becomes a throttled
    // "something visible changed" hook.
    const observer = new IntersectionObserver(recompute, {
      // Trigger callbacks as soon as a section's edge crosses ANY
      // 10% threshold; combined with the manual recompute above this
      // gives us a smooth highlight without scroll-event throttling.
      threshold: [0, 0.1, 0.5, 0.9, 1],
      // No rootMargin negation here — we account for the sticky-header
      // offset in the recompute loop itself, which keeps the math
      // observable in one place rather than split between two configs.
    });

    elements.forEach((el) => observer.observe(el));

    // Scroll events catch the "still scrolling but no intersection
    // crossed" case (e.g. small wheel ticks inside a single tall
    // section). `passive: true` matters — we never preventDefault.
    window.addEventListener("scroll", recompute, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", recompute);
    };
  }, [ids, offset, enabled]);

  return activeId;
}
