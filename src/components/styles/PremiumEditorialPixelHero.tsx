import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

/**
 * PremiumEditorialPixelHero
 * -------------------------
 * A full-bleed image hero veiled by a grid of solid "pixel" blocks. The blocks
 * are mostly solid on the left (protecting the headline) and carved into a
 * large jagged window on the right so the image reads through. Moving the
 * pointer dissolves blocks within a soft radius, leaving a short fading trail,
 * and they reform when the pointer leaves.
 *
 * The veil is painted to an offscreen canvas (rebuilt only when size/params
 * change); the per-frame reveal just composites `destination-out` discs over a
 * fresh copy of that veil, so interaction stays cheap.
 */
export interface PremiumEditorialPixelHeroProps {
  headline?: string;
  subheadline?: string;
  subheadlineLink?: string;
  backgroundImage: string;
  pixelColor?: string;
  pixelSize?: number;
  /** 0.2–1 overall solidness of the veil. */
  pixelDensity?: number;
  revealRadius?: number;
  /** Pointer smoothing 0.02 (lazy) – 0.5 (snappy). */
  animationSpeed?: number;
  textColor?: string;
  className?: string;
}

/** Deterministic PRNG (mulberry32) so the veil is stable across renders. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

export function PremiumEditorialPixelHero({
  headline = "Creative\nSpace",
  subheadline = "LEARN MORE",
  subheadlineLink = "#",
  backgroundImage,
  pixelColor = "#ffffff",
  pixelSize = 46,
  pixelDensity = 0.8,
  revealRadius = 84,
  animationSpeed = 0.16,
  textColor = "#111111",
  className,
}: PremiumEditorialPixelHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const veilRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 1200, h: 700, px: pixelSize });

  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, strength: 0, tStrength: 0 });
  const trail = useRef<TrailPoint[]>([]);
  const raf = useRef<number | null>(null);

  const seed = useMemo(
    () => Math.floor(pixelSize * 17) + Math.floor(pixelDensity * 999) * 13 + 1337,
    [pixelSize, pixelDensity],
  );

  /** Paint the static veil (grid of blocks with a carved window) into `veilRef`. */
  const buildVeil = useCallback(
    (w: number, h: number) => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const off = veilRef.current ?? document.createElement("canvas");
      veilRef.current = off;
      off.width = Math.max(1, Math.floor(w * dpr));
      off.height = Math.max(1, Math.floor(h * dpr));
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const px = clamp(pixelSize, 8, 80);
      sizeRef.current = { w, h, px };
      const cols = Math.ceil(w / px);
      const rows = Math.ceil(h / px);
      const rand = mulberry32(seed);

      // Window opening (carved area) sits centre-right; left stays solid for text.
      const leftSolid = Math.floor(cols * 0.42);
      const ocx = cols * 0.72;
      const ocy = rows * 0.56;
      const orx = cols * 0.34;
      const ory = rows * 0.42;

      ctx.fillStyle = pixelColor;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let fill = true;

          if (gx >= leftSolid) {
            // Elliptical distance to the window centre, with per-cell jitter so
            // the rim stair-steps instead of forming a clean curve.
            const dx = (gx - ocx) / orx;
            const dy = (gy - ocy) / ory;
            const jitter = (mulberry32(seed ^ (gx * 73856093) ^ (gy * 19349663))() - 0.5) * 0.28;
            const d = Math.sqrt(dx * dx + dy * dy) + jitter;
            if (d < 1) fill = false;
            // Keep a few cluster blocks just inside the rim.
            else if (d < 1.18 && rand() < 0.5) fill = true;
          }

          // Overall density thinning of the solid field.
          if (fill && rand() > clamp(pixelDensity, 0.2, 1)) fill = false;

          // Scattered peek-through holes outside the protected left band.
          if (fill && gx >= leftSolid && mulberry32(seed + gx * 421 + gy * 811)() < 0.02) fill = false;

          // Vertical fragmentation pillars along the far-right edge.
          if (!fill && gx > cols * 0.86 && mulberry32(seed + gx * 31)() < 0.6) fill = true;

          if (fill) ctx.fillRect(gx * px, gy * px, px, px);
        }
      }
    },
    [pixelColor, pixelSize, pixelDensity, seed],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const veil = veilRef.current;
    if (!canvas || !veil) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h, px } = sizeRef.current;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const tw = Math.floor(w * dpr);
    const th = Math.floor(h * dpr);
    if (canvas.width !== tw || canvas.height !== th) {
      canvas.width = tw;
      canvas.height = th;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Ease the pointer + reveal strength toward their targets.
    const s = clamp(animationSpeed, 0.02, 0.6);
    const p = pointer.current;
    p.x += (p.tx - p.x) * s;
    p.y += (p.ty - p.y) * s;
    p.strength += (p.tStrength - p.strength) * s;

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(veil, 0, 0, w, h);

    if (p.strength > 0.001) {
      const now = performance.now();
      const tailMs = 480;
      const pts = trail.current;
      while (pts.length && now - pts[0].t > tailMs) pts.shift();
      const r0 = clamp(revealRadius, 30, Math.max(w, h));

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000";
      const stops = [{ x: p.x, y: p.y, age: 0 }, ...pts.map((pt) => ({ x: pt.x, y: pt.y, age: now - pt.t }))];
      for (const tp of stops) {
        const ageT = clamp(tp.age / tailMs, 0, 1);
        const r = r0 * (1 - ageT * 0.45) * clamp(p.strength, 0, 1);
        // Carve whole blocks so the dissolve stays pixelated, not feathered.
        const minGX = Math.floor((tp.x - r) / px);
        const maxGX = Math.floor((tp.x + r) / px);
        const minGY = Math.floor((tp.y - r) / px);
        const maxGY = Math.floor((tp.y + r) / px);
        for (let gy = minGY; gy <= maxGY; gy++) {
          for (let gx = minGX; gx <= maxGX; gx++) {
            const cx = gx * px + px / 2;
            const cy = gy * px + px / 2;
            if (Math.hypot(cx - tp.x, cy - tp.y) <= r) ctx.fillRect(gx * px, gy * px, px, px);
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }

    if (p.strength > 0.002 || Math.abs(p.tx - p.x) > 0.5) {
      raf.current = requestAnimationFrame(draw);
    } else {
      raf.current = null;
    }
  }, [animationSpeed, revealRadius]);

  const kick = useCallback(() => {
    if (raf.current == null) raf.current = requestAnimationFrame(draw);
  }, [draw]);

  // (Re)build the veil whenever the box is resized or veil params change.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const apply = (w: number, h: number) => {
      buildVeil(Math.max(1, w), Math.max(1, h));
      pointer.current.tx = w * 0.5;
      pointer.current.ty = h * 0.5;
      draw();
    };
    apply(el.clientWidth, el.clientHeight);
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) apply(r.width, r.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [buildVeil, draw]);

  useEffect(() => () => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
  }, []);

  const setTarget = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clamp(clientX - r.left, 0, r.width);
    const y = clamp(clientY - r.top, 0, r.height);
    pointer.current.tx = x;
    pointer.current.ty = y;
    const pts = trail.current;
    const last = pts[pts.length - 1];
    if (!last || (x - last.x) ** 2 + (y - last.y) ** 2 > 36) {
      pts.push({ x, y, t: performance.now() });
      if (pts.length > 24) pts.splice(0, pts.length - 24);
    }
  };

  const onMove = (e: React.PointerEvent) => {
    pointer.current.tStrength = 1;
    setTarget(e.clientX, e.clientY);
    kick();
  };
  const onLeave = () => {
    pointer.current.tStrength = 0;
    kick();
  };

  return (
    <section
      ref={wrapRef}
      aria-label="Hero"
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={onLeave}
      className={`relative h-full w-full select-none overflow-hidden bg-white ${className ?? ""}`}
      style={{ touchAction: "none" }}
    >
      <div
        role="img"
        aria-label="Background"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative z-[2] flex h-full w-full items-start p-8 md:p-12">
        <div className="max-w-[680px]" style={{ color: textColor }}>
          <motion.h1
            className="m-0 whitespace-pre-line text-6xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.h1>
          <motion.div
            className="mt-6 flex items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href={subheadlineLink} className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold no-underline" style={{ color: "inherit" }}>
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
                <path d="M3 8h9" stroke={textColor} strokeWidth={1.5} strokeLinecap="round" />
                <path d="M9 5l3 3-3 3" stroke={textColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {subheadline}
            </a>
            <span className="h-px min-w-[30px] flex-1 opacity-45" style={{ backgroundColor: textColor }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
