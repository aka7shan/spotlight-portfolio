import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealSectionProps {
  /** Anchor id consumed by the scroll-spy + section nav. */
  id: string;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps a profile section in a one-shot scroll-reveal (fade + slight rise).
 *
 * Performance notes:
 *   - Animates only `opacity`/`transform` (compositor-friendly, no layout).
 *   - `viewport.once` makes the IntersectionObserver fire a single time and
 *     then disconnect, so a long page doesn't keep observers alive.
 *   - Honours `prefers-reduced-motion` by rendering a plain <section> with
 *     no animation at all.
 *
 * The `id`/`className` (notably `scroll-mt-*`) are forwarded unchanged so the
 * scroll-spy and pill-jump behaviour keep working exactly as before.
 */
export function RevealSection({ id, className, children }: RevealSectionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
