import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../ui/utils";

interface ScrollCueProps {
  /** Hides the cue once the user has scrolled past this many pixels. */
  hideAfterPx?: number;
  /**
   * Only show the cue when there's at least this much content below the
   * fold — no point hinting "scroll" on a page that doesn't scroll.
   */
  minOverflowPx?: number;
  /** Label above the mouse glyph. */
  label?: string;
  className?: string;
}

/**
 * "Scroll to explore" affordance — a centered label above an animated
 * mouse (outer pill + a dot that drifts down), adapted from the reference
 * portfolio's landing cue.
 *
 * Behaviour:
 *   - Appears only near the top of a scrollable page, so a first-time
 *     visitor knows there's more below the fold.
 *   - Fades out the moment they start scrolling (it has done its job).
 *   - Clicking it pages down ~85% of the viewport.
 *
 * Performance / a11y:
 *   - Scroll handler is `passive` and only flips a boolean; React bails on
 *     same-value `setState`, so frequent scroll events don't re-render.
 *   - Animates transform/opacity only; honours `prefers-reduced-motion`
 *     by dropping the looping bob (the cue still shows, just static).
 */
export function ScrollCue({
  hideAfterPx = 80,
  minOverflowPx = 240,
  label = "Scroll to explore",
  className,
}: ScrollCueProps) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const overflow =
        document.documentElement.scrollHeight - window.innerHeight;
      setVisible(overflow > minOverflowPx && scrollTop < hideAfterPx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [hideAfterPx, minOverflowPx]);

  const handleClick = () => {
    window.scrollBy({
      top: Math.round(window.innerHeight * 0.85),
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2",
            "rounded-full text-gray-400 transition-colors hover:text-gray-600",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
            className,
          )}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
            {label}
          </span>
          <motion.span
            className="block"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span className="flex h-8 w-5 justify-center rounded-full border border-gray-300 pt-1.5">
              <motion.span
                className="h-1 w-1 rounded-full bg-gray-400"
                animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </span>
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
