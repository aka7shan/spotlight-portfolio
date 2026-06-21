import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

/**
 * ScrollSyncedText
 * ----------------
 * A fixed prefix ("We shape") followed by a list of words that react to scroll.
 * Scroll progress over the tall section maps to a continuous "active index";
 * each word's appearance is derived from its distance to that index.
 *
 * Modes:
 *  - "fade-in"   words brighten as they reach the line and stay lit
 *  - "spotlight" only the aligned word is fully lit; neighbours dim
 *  - "slide"     a one-line clip window scrolls through the words (slot-machine)
 *
 * Reimplemented on `framer-motion`'s scroll primitives (no GSAP dependency).
 */
export interface ScrollSyncedTextProps {
  prefixText?: string;
  items?: readonly string[];
  mode?: "fade-in" | "spotlight" | "slide";
  inactiveOpacity?: number;
  textColor?: string;
  className?: string;
}

const DEFAULT_ITEMS = ["ideas", "brands", "identities", "interfaces", "experiences"] as const;

export function ScrollSyncedText({
  prefixText = "We shape",
  items = DEFAULT_ITEMS,
  mode = "fade-in",
  inactiveOpacity = 0.2,
  textColor = "rgb(var(--foreground))",
  className,
}: ScrollSyncedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const words = items.filter(Boolean);
  const n = words.length;
  // Continuous active index in [0, n-1] tracked across the scroll range.
  const active = useTransform(scrollYProgress, [0, 1], [0, n - 1]);

  return (
    <section ref={ref} className={`relative ${className ?? ""}`} style={{ height: `${Math.max(2, n) * 90}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-16">
        <div className="flex w-full flex-wrap items-baseline gap-x-4 gap-y-1 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          <span style={{ color: textColor }}>{prefixText}</span>

          {mode === "slide" ? (
            <SlideWindow words={words} active={active} color={textColor} />
          ) : (
            words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                index={i}
                active={active}
                mode={mode}
                inactiveOpacity={inactiveOpacity}
                color={textColor}
              >
                {word}
              </Word>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

interface WordProps {
  children: string;
  index: number;
  active: MotionValue<number>;
  mode: "fade-in" | "spotlight";
  inactiveOpacity: number;
  color: string;
}

function Word({ children, index, active, mode, inactiveOpacity, color }: WordProps) {
  const opacity = useTransform(active, (a) => {
    const d = a - index;
    if (mode === "fade-in") {
      // Lit once the active index passes this word; first word starts lit.
      if (index === 0) return 1;
      return clamp(inactiveOpacity + (1 - inactiveOpacity) * clamp(d + 1, 0, 1), inactiveOpacity, 1);
    }
    // spotlight: a triangular window peaking when d === 0.
    return clamp(1 - Math.abs(d) * (1 - inactiveOpacity), inactiveOpacity, 1);
  });

  return (
    <motion.span style={{ opacity, color }}>
      {children}
    </motion.span>
  );
}

function SlideWindow({ words, active, color }: { words: string[]; active: MotionValue<number>; color: string }) {
  // Snap to the nearest word and translate the stacked list by whole lines.
  const y = useTransform(active, (a) => `-${Math.round(clamp(a, 0, words.length - 1)) * 1.05}em`);
  return (
    <span className="relative inline-block h-[1.05em] overflow-hidden align-bottom">
      <motion.span className="flex flex-col" style={{ y, color }}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="block h-[1.05em] whitespace-nowrap">
            {w}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
