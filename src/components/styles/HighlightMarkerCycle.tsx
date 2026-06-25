import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * HighlightMarkerCycle
 * --------------------
 * Static lead-in / trailing text wraps a single word that cycles. A coloured
 * marker bar sweeps across to cover the word, the word is swapped while hidden,
 * then the bar sweeps off to reveal the next word — so the highlight appears to
 * travel continuously in one direction. The word slot animates its width to fit
 * each new word without layout jumps.
 */
export interface HighlightMarkerCycleProps {
  textBefore?: string;
  textAfter?: string;
  words?: string[];
  textColor?: string;
  markerColor?: string;
  holdDuration?: number;
  transitionDuration?: number;
  className?: string;
}

type Phase = "reveal" | "idle" | "cover";

export function HighlightMarkerCycle({
  textBefore = "We help you rethink",
  textAfter = "",
  words = ["workflows", "handovers", "marketing"],
  textColor = "#0b0b0c",
  markerColor = "#c700ef",
  holdDuration = 2.2,
  transitionDuration = 0.5,
  className,
}: HighlightMarkerCycleProps) {
  const safe = words.length > 0 ? words : ["text"];
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("reveal");
  const [width, setWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (measureRef.current) setWidth(measureRef.current.getBoundingClientRect().width);
  }, [index, safe]);

  useEffect(() => {
    if (phase !== "idle" || safe.length <= 1) return;
    const t = window.setTimeout(() => setPhase("cover"), holdDuration * 1000);
    return () => window.clearTimeout(t);
  }, [phase, holdDuration, safe.length]);

  const onBarComplete = () => {
    if (phase === "cover") {
      setIndex((p) => (p + 1) % safe.length);
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("idle");
    }
  };

  const ease = [0.65, 0, 0.35, 1] as const;
  const covering = phase === "cover";

  return (
    <div className={`text-4xl font-black leading-tight tracking-tight ${className ?? ""}`} style={{ color: textColor }}>
      {textBefore && <span>{textBefore} </span>}
      <motion.span
        className="relative inline-block overflow-hidden align-bottom"
        style={{ whiteSpace: "nowrap" }}
        initial={false}
        animate={width !== null ? { width } : undefined}
        transition={{ duration: transitionDuration * 0.7, ease }}
      >
        <span ref={measureRef} className="inline-block px-[0.06em]">
          {safe[index]}
        </span>
        <motion.span
          key={index}
          className="absolute inset-0"
          style={{
            background: markerColor,
            transformOrigin: covering ? "left center" : "right center",
          }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: covering ? 1 : 0 }}
          transition={{ duration: transitionDuration, ease }}
          onAnimationComplete={onBarComplete}
        />
      </motion.span>
      {textAfter && <span> {textAfter}</span>}
    </div>
  );
}
