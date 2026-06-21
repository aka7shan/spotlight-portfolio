import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * ThreeDMagazine
 * --------------
 * An interactive flip-through magazine rendered entirely with CSS 3D transforms
 * (no WebGL). Leaves are stacked in a shared `preserve-3d` scene; each turned
 * leaf rotates about its spine (`transform-origin: left`) with a soft fold
 * gradient for depth. The whole book counter-rotates as you flip so the open
 * spread stays centred, and tilts toward the pointer for a parallax feel.
 *
 * Click the right half to advance, the left half to go back.
 */
export interface ThreeDMagazineProps {
  /** Page image URLs. The first is treated as the cover. */
  pages?: readonly string[];
  coverTitle?: string;
  className?: string;
}

export function ThreeDMagazine({ pages = SAMPLE_PHOTOS, coverTitle = "FIELD NOTES", className }: ThreeDMagazineProps) {
  // Group images into leaves (front + back). Leaf 0's front is the cover.
  const leaves = useMemo(() => {
    const out: { front: string; back: string }[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      out.push({ front: pages[i], back: pages[(i + 1) % pages.length] });
    }
    return out;
  }, [pages]);

  const [turned, setTurned] = useState(0); // how many leaves are flipped
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -ny * 12, y: nx * 16 });
  };

  const total = leaves.length;
  const next = () => setTurned((t) => Math.min(total, t + 1));
  const prev = () => setTurned((t) => Math.max(0, t - 1));

  // Shift the book left→right as it opens so the spread stays centred.
  const opened = turned > 0 && turned < total;
  const shiftX = opened ? "25%" : turned === 0 ? "0%" : "50%";

  return (
    <div
      ref={tiltRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`flex h-full w-full items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ perspective: 2000 }}
    >
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ width: 280, height: 380 }}
        animate={{ rotateX: 8 + tilt.x, rotateY: tilt.y, x: shiftX }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* Floor shadow */}
        <div className="absolute -bottom-8 left-1/2 h-6 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />

        {leaves.map((leaf, i) => {
          const isTurned = i < turned;
          return (
            <motion.div
              key={i}
              className="absolute inset-0 origin-left [transform-style:preserve-3d]"
              style={{ zIndex: isTurned ? i : total - i }}
              animate={{ rotateY: isTurned ? -178 : 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
            >
              {/* Front of leaf */}
              <Face image={leaf.front} side="front">
                {i === 0 && (
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/10 via-transparent to-black/60 p-5 text-white">
                    <span className="text-[11px] font-semibold tracking-[0.3em]">ISSUE 01</span>
                    <span className="text-3xl font-black leading-none tracking-tight">{coverTitle}</span>
                  </div>
                )}
              </Face>
              {/* Back of leaf */}
              <Face image={leaf.back} side="back" />
            </motion.div>
          );
        })}

        {/* Click zones */}
        <button
          type="button"
          aria-label="Previous page"
          onClick={prev}
          className="absolute left-0 top-0 z-[60] h-full w-1/2 cursor-w-resize"
          style={{ transform: "translateZ(2px)" }}
        />
        <button
          type="button"
          aria-label="Next page"
          onClick={next}
          className="absolute right-0 top-0 z-[60] h-full w-1/2 cursor-e-resize"
          style={{ transform: "translateZ(2px)" }}
        />
      </motion.div>
    </div>
  );
}

function Face({ image, side, children }: { image: string; side: "front" | "back"; children?: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-r-md bg-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.25)] [backface-visibility:hidden]"
      style={side === "back" ? { transform: "rotateY(180deg)" } : undefined}
    >
      <img src={image} alt="" className="h-full w-full object-cover" draggable={false} />
      {/* Spine shading for paper depth. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{
          background:
            side === "front"
              ? "linear-gradient(to right, rgba(0,0,0,0.28), transparent)"
              : "linear-gradient(to left, rgba(0,0,0,0.28), transparent)",
        }}
      />
      {children}
    </div>
  );
}
