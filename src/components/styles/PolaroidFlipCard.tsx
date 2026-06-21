import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * PolaroidFlipCard
 * ----------------
 * A polaroid-style photo card that tilts in 3D toward the pointer on hover and
 * flips to a hand-written "back note" when clicked.
 *
 * Pointer position is normalised to [-0.5, 0.5] on each axis and mapped to a
 * tilt angle through a spring so the motion feels weighted rather than rigid.
 * The flip is a separate rotateY layer so tilt and flip compose cleanly inside
 * one `preserve-3d` context.
 */
export interface PolaroidFlipCardProps {
  image: string;
  caption?: string;
  backNote?: string;
  frameColor?: string;
  captionColor?: string;
  noteColor?: string;
  /** Max hover tilt in degrees. */
  tiltStrength?: number;
  /** 0–1 drop-shadow intensity. */
  shadowStrength?: number;
  radius?: number;
  imageFit?: "cover" | "contain" | "fill";
  className?: string;
}

const TILT_SPRING = { damping: 30, stiffness: 120, mass: 0.8 } as const;
const FLIP_SPRING = { type: "spring", damping: 24, stiffness: 240, mass: 0.7 } as const;

export function PolaroidFlipCard({
  image,
  caption = "Sunlit / 24",
  backNote = "Caught the light just right on this one.",
  frameColor = "#ffffff",
  captionColor = "#2b2b2b",
  noteColor = "#2b2b2b",
  tiltStrength = 15,
  shadowStrength = 0.22,
  radius = 6,
  imageFit = "cover",
  className,
}: PolaroidFlipCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [tiltStrength, -tiltStrength]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-tiltStrength, tiltStrength]), TILT_SPRING);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    [px, py],
  );

  const reset = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  const shadow = `0 18px 40px rgba(0,0,0,${shadowStrength}), 0 4px 12px rgba(0,0,0,${shadowStrength * 0.6})`;
  const faceClass = "absolute inset-0 overflow-hidden [backface-visibility:hidden]";

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => {
        reset();
        setFlipped((f) => !f);
      }}
      className={`relative h-full w-full cursor-pointer select-none [perspective:1000px] ${className ?? ""}`}
    >
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX, rotateY }}>
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={FLIP_SPRING}
        >
          {/* Front face */}
          <div className={faceClass} style={{ background: frameColor, borderRadius: radius, boxShadow: shadow }}>
            <div className="absolute inset-x-3 top-3 bottom-16 overflow-hidden rounded-[3px] bg-neutral-100">
              <img
                src={image}
                alt={caption}
                draggable={false}
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ objectFit: imageFit, objectPosition: "center" }}
              />
            </div>
            <div className="absolute inset-x-3 bottom-0 flex h-14 items-center justify-center">
              <p
                className="w-full text-center text-lg leading-snug"
                style={{ color: captionColor, fontFamily: "'Caveat', ui-rounded, cursive" }}
              >
                {caption}
              </p>
            </div>
          </div>

          {/* Back face */}
          <div
            className={`${faceClass} flex items-center justify-center [transform:rotateY(180deg)]`}
            style={{ background: frameColor, borderRadius: radius, boxShadow: shadow }}
          >
            <p
              className="max-w-[80%] text-center text-xl leading-relaxed"
              style={{ color: noteColor, fontFamily: "'Caveat', ui-rounded, cursive" }}
            >
              {backNote}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
