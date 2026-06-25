import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";

/**
 * WavyTicker
 * ----------
 * An infinite horizontal marquee where each item also bobs along a sine wave,
 * giving the row a gentle undulating motion. Auto-scrolls continuously, slows
 * on hover, and fades out at both edges. The scroll offset and per-item wave
 * offset are applied by mutating DOM transforms inside a rAF loop, so the
 * animation never triggers React re-renders.
 */
export interface WavyTickerProps {
  items: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  waveAmplitude?: number;
  waveFrequency?: number;
  gap?: number;
  height?: number;
  slowdownOnHover?: number;
  fadeEdges?: boolean;
  fadeDistance?: number;
  className?: string;
}

const REPEATS = 4;

export function WavyTicker({
  items,
  speed = 60,
  direction = "left",
  waveAmplitude = 16,
  waveFrequency = 0.006,
  gap = 28,
  height = 120,
  slowdownOnHover = 0.3,
  fadeEdges = true,
  fadeDistance = 12,
  className,
}: WavyTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const basePos = useRef<number[]>([]);
  const setWidth = useRef(0);
  const hovered = useRef(false);

  const repeated = useMemo(
    () => Array.from({ length: REPEATS }, () => items).flat(),
    [items],
  );

  const measure = () => {
    const els = itemRefs.current;
    if (els.length < items.length + 1) return;
    basePos.current = els.map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0));
    const first = els[0];
    const nextSet = els[items.length];
    if (first && nextSet) setWidth.current = nextSet.offsetLeft - first.offsetLeft;
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    let raf = 0;
    let offset = 0;
    let last = performance.now();
    const dirSign = direction === "left" ? 1 : -1;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sp = hovered.current ? speed * slowdownOnHover : speed;
      offset += sp * dt * dirSign;

      const w = setWidth.current || 1;
      const wrapped = ((offset % w) + w) % w;
      const x = direction === "left" ? -wrapped : wrapped - w;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px,0,0)`;

      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const wave = Math.sin((basePos.current[i] + offset) * waveFrequency) * waveAmplitude;
        el.style.transform = `translateY(${wave}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, speed, slowdownOnHover, waveAmplitude, waveFrequency]);

  const mask = fadeEdges
    ? `linear-gradient(to right, transparent, black ${fadeDistance}%, black ${100 - fadeDistance}%, transparent)`
    : undefined;

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ height, maskImage: mask, WebkitMaskImage: mask }}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <div
        ref={trackRef}
        className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center will-change-transform"
        style={{ gap }}
      >
        {repeated.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex shrink-0 items-center justify-center will-change-transform"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
