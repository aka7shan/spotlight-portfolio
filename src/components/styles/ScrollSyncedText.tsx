import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

/**
 * ScrollSyncedText
 * ----------------
 * A fixed prefix ("We shape") with a vertical column of words that scrolls past
 * it like a slot machine. Scroll progress maps to a continuous "active index";
 * the column translates so each word slides up onto the prefix line, and the
 * word aligned with the line is fully lit while its neighbours dim — so each
 * word is highlighted *as* it arrives in position.
 *
 * Built on `framer-motion`'s scroll primitives (no GSAP dependency).
 */
export interface ScrollSyncedTextProps {
  prefixText?: string;
  items?: readonly string[];
  inactiveOpacity?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const DEFAULT_ITEMS = ["ideas", "brands", "identities", "interactions", "interfaces", "experiences"] as const;

/** Line height as a multiple of font size; word rows and travel both use this. */
const LINE_EM = 1.15;

export function ScrollSyncedText({
  prefixText = "We shape",
  items = DEFAULT_ITEMS,
  inactiveOpacity = 0.22,
  backgroundColor = "#0b0b0c",
  textColor = "#ffffff",
  className,
}: ScrollSyncedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const words = items.filter(Boolean);
  const n = words.length;
  // Continuous active index across the scroll range; first word centred at the
  // top of the range, last word at the bottom.
  const active = useTransform(scrollYProgress, [0, 1], [0, n - 1]);
  const columnY = useTransform(active, (v) => `${-v * LINE_EM}em`);

  return (
    <section
      ref={ref}
      className={className}
      style={{ height: `${Math.max(2, n) * 70}vh`, backgroundColor }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-16">
        <div
          className="flex items-center gap-x-4 text-5xl font-extrabold leading-[1.15] tracking-tight md:text-7xl lg:text-[7rem]"
          style={{ color: textColor }}
        >
          <span className="shrink-0 whitespace-nowrap">{prefixText}</span>

          {/* One-line viewport; the column overflows above/below so neighbouring
              words stay visible (dimmed) like a wheel. */}
          <div className="relative" style={{ height: `${LINE_EM}em` }}>
            <motion.div className="absolute left-0 top-0 flex flex-col" style={{ y: columnY }}>
              {words.map((word, i) => (
                <Word key={`${word}-${i}`} index={i} active={active} inactiveOpacity={inactiveOpacity}>
                  {word}
                </Word>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  index,
  active,
  inactiveOpacity,
}: {
  children: string;
  index: number;
  active: MotionValue<number>;
  inactiveOpacity: number;
}) {
  // Brightest when aligned with the line; falls off for words above/below.
  const opacity = useTransform(active, (a) =>
    Math.max(inactiveOpacity, Math.min(1, 1 - Math.abs(a - index) * (1 - inactiveOpacity))),
  );
  return (
    <motion.span
      className="flex items-center whitespace-nowrap"
      style={{ height: `${LINE_EM}em`, opacity }}
    >
      {children}
    </motion.span>
  );
}
