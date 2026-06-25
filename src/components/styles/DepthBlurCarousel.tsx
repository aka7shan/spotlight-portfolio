import { useMemo, useRef } from "react";
import type { PanInfo } from "framer-motion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SAMPLE_GRADIENTS } from "./sampleData";

/**
 * DepthBlurCarousel
 * -----------------
 * A 3D "coverflow" carousel. A single scroll value drives every card: each
 * derives its signed offset from centre and maps that to size, horizontal
 * position, depth (z), rotation and z-index. Cards shrink and rotate away as
 * they leave the centre; soft blur panels on both edges fade the row out.
 *
 * Mouse wheel and click-drag both nudge a target value that a spring eases
 * toward; on idle/release it snaps to the nearest whole index. A transparent
 * top-most layer captures the gestures so they work anywhere over the stage.
 */
export interface DepthBlurCarouselProps {
  /** Image URLs or CSS gradient strings. Falls back to sample gradients. */
  items?: readonly string[];
  itemWidth?: number;
  itemHeight?: number;
  sideItemWidth?: number;
  sideItemHeight?: number;
  gap?: number;
  maxRotation?: number;
  perspective?: number;
  borderRadius?: number;
  damping?: number;
  /** Edge-blur width as a % of the stage. */
  blurSpread?: number;
  blurStrength?: number;
  className?: string;
}

export function DepthBlurCarousel({
  items,
  itemWidth = 320,
  itemHeight = 210,
  sideItemWidth = 210,
  sideItemHeight = 170,
  gap = 26,
  maxRotation = 52,
  perspective = 1100,
  borderRadius = 14,
  damping = 24,
  blurSpread = 14,
  blurStrength = 7,
  className,
}: DepthBlurCarouselProps) {
  const pool = items && items.length > 0 ? items : SAMPLE_GRADIENTS;

  // Repeat the pool so the loop wraps without a visible seam.
  const cards = useMemo(() => {
    const out: string[] = [];
    while (out.length < Math.max(15, pool.length * 3)) out.push(...pool);
    return out;
  }, [pool]);

  const total = cards.length;
  const target = useRef(0);
  const raw = useMotionValue(0);
  const scroll = useSpring(raw, { stiffness: 180, damping, mass: 1, restDelta: 0.001 });
  const snapTimer = useRef<number | null>(null);

  const snapSoon = (delay: number) => {
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      target.current = Math.round(target.current);
      raw.set(target.current);
    }, delay);
  };

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    target.current += delta * 0.0035;
    raw.set(target.current);
    snapSoon(140);
  };

  const onPan = (_e: unknown, info: PanInfo) => {
    target.current += -info.delta.x * 0.006;
    raw.set(target.current);
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
  };

  const onPanEnd = (_e: unknown, info: PanInfo) => {
    target.current = Math.round(target.current + -info.velocity.x * 0.0012);
    raw.set(target.current);
  };

  const edgeBlur = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: 0,
    width: `${blurSpread}%`,
    zIndex: 1600,
    backdropFilter: `blur(${blurStrength}px)`,
    WebkitBackdropFilter: `blur(${blurStrength}px)`,
    maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black 0%, transparent 100%)`,
    WebkitMaskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black 0%, transparent 100%)`,
    pointerEvents: "none",
  });

  return (
    <div
      className={`relative flex h-full w-full select-none items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ perspective: Math.max(perspective, 1) }}
    >
      {/* 3D stage */}
      <div className="relative h-0 w-0 [transform-style:preserve-3d]">
        {cards.map((src, i) => (
          <CarouselCard
            key={i}
            src={src}
            index={i}
            total={total}
            scroll={scroll}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            sideItemWidth={sideItemWidth}
            sideItemHeight={sideItemHeight}
            gap={gap}
            maxRotation={maxRotation}
            borderRadius={borderRadius}
          />
        ))}
      </div>

      <div style={edgeBlur("left")} />
      <div style={edgeBlur("right")} />

      {/* Gesture catcher sits above everything so wheel/drag always register. */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: 1700, touchAction: "pan-y" }}
        onWheel={onWheel}
        onPan={onPan}
        onPanEnd={onPanEnd}
      />
    </div>
  );
}

interface CardProps {
  src: string;
  index: number;
  total: number;
  scroll: MotionValueLike;
  itemWidth: number;
  itemHeight: number;
  sideItemWidth: number;
  sideItemHeight: number;
  gap: number;
  maxRotation: number;
  borderRadius: number;
}

type MotionValueLike = ReturnType<typeof useSpring>;

function CarouselCard({
  src,
  index,
  total,
  scroll,
  itemWidth,
  itemHeight,
  sideItemWidth,
  sideItemHeight,
  gap,
  maxRotation,
  borderRadius,
}: CardProps) {
  // Signed distance from centre, wrapped into [-total/2, total/2] so cards loop.
  const offset = useTransform(scroll, (v) => {
    let m = (((index - v) % total) + total) % total;
    if (m > total / 2) m -= total;
    return m;
  });
  const abs = useTransform(offset, Math.abs);

  const width = useTransform(abs, [0, 1], [itemWidth, sideItemWidth], { clamp: true });
  const height = useTransform(abs, [0, 1], [itemHeight, sideItemHeight], { clamp: true });
  const marginLeft = useTransform(width, (w) => -w / 2);
  const marginTop = useTransform(height, (h) => -h / 2);

  const x = useTransform(offset, (o) => {
    const a = Math.abs(o);
    const s = Math.sign(o);
    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;
    if (a === 0) return 0;
    if (a <= 1) return s * centerToNext * a;
    return s * (centerToNext + (a - 1) * sideToSide * 0.92);
  });
  const z = useTransform(abs, (a) => -a * 180);
  const rotateY = useTransform(offset, (o) => Math.sign(o) * Math.min(Math.abs(o) * 34, maxRotation));
  const zIndex = useTransform(abs, (a) => 1000 - Math.round(a * 10));
  const opacity = useTransform(abs, [0, 4, 6], [1, 1, 0]);

  const isImage = src.startsWith("http") || src.startsWith("data:");
  const surface: React.CSSProperties = isImage
    ? { backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: src };

  return (
    <motion.div
      className="absolute left-0 top-0 [transform-style:preserve-3d] [backface-visibility:hidden]"
      style={{ width, height, marginLeft, marginTop, x, z, rotateY, zIndex, opacity }}
    >
      <div className="absolute inset-0 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" style={{ ...surface, borderRadius }} />
    </motion.div>
  );
}
