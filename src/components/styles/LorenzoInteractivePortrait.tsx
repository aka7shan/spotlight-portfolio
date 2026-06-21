import { useEffect, useRef } from "react";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * LorenzoInteractivePortrait
 * --------------------------
 * A pointer-driven "reveal" portrait. A muted base layer sits on top; a vivid
 * reveal layer shows through a soft blob that tracks the pointer. The blob's
 * centre is lerped toward the pointer each frame (so it trails with weight) and
 * its radius eases to zero when the pointer leaves and breathes with a subtle
 * sine wobble for an organic, liquid edge.
 *
 * The original Framer component drove this with a WebGL fragment shader; this
 * is an equivalent, dependency-free take using an animated CSS mask updated via
 * custom properties (cheap to repaint, no React re-renders per frame).
 */
export interface LorenzoInteractivePortraitProps {
  /** Muted layer shown by default. */
  baseImage?: string;
  /** Vivid layer revealed under the blob. Defaults to the base image. */
  revealImage?: string;
  /** Blob radius as a fraction of the smaller container side. */
  blobRadius?: number;
  backgroundColor?: string;
  className?: string;
}

export function LorenzoInteractivePortrait({
  baseImage = SAMPLE_PHOTOS[2],
  revealImage,
  blobRadius = 0.35,
  backgroundColor = "#0e0e10",
  className,
}: LorenzoInteractivePortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // Live state kept in refs so the rAF loop never triggers React renders.
  const state = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, r: 0, tr: 0, active: false });

  useEffect(() => {
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    if (!wrap || !mask) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      state.current.tx = (e.clientX - rect.left) / rect.width;
      state.current.ty = (e.clientY - rect.top) / rect.height;
      state.current.active = true;
      state.current.tr = blobRadius;
    };
    const onLeave = () => {
      state.current.active = false;
      state.current.tr = 0;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let t = 0;
    const tick = () => {
      const s = state.current;
      t += 0.05;
      s.x += (s.tx - s.x) * 0.12;
      s.y += (s.ty - s.y) * 0.12;
      s.r += (s.tr - s.r) * 0.1;
      const rect = wrap.getBoundingClientRect();
      const base = Math.min(rect.width, rect.height);
      // Wobble the radius slightly so the edge feels liquid rather than rigid.
      const wobble = 1 + Math.sin(t) * 0.06 + Math.cos(t * 1.7) * 0.04;
      const rpx = s.r * base * wobble;
      mask.style.setProperty("--mx", `${s.x * rect.width}px`);
      mask.style.setProperty("--my", `${s.y * rect.height}px`);
      mask.style.setProperty("--mr", `${rpx}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [blobRadius]);

  const reveal = revealImage ?? baseImage;
  const maskStyle: React.CSSProperties = {
    maskImage: "radial-gradient(circle var(--mr, 0px) at var(--mx, 50%) var(--my, 50%), #000 55%, transparent 100%)",
    WebkitMaskImage: "radial-gradient(circle var(--mr, 0px) at var(--mx, 50%) var(--my, 50%), #000 55%, transparent 100%)",
  };

  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      style={{ backgroundColor, touchAction: "none", cursor: "crosshair" }}
    >
      {/* Muted base layer. */}
      <img
        src={baseImage}
        alt="Portrait"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "grayscale(1) contrast(1.05) brightness(0.85)" }}
      />
      {/* Vivid reveal layer, clipped to the blob. */}
      <div ref={maskRef} className="absolute inset-0" style={maskStyle}>
        <img
          src={reveal}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.25) contrast(1.05)" }}
        />
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-medium tracking-widest text-white/70">
        MOVE TO REVEAL
      </span>
    </div>
  );
}
