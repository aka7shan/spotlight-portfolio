import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SAMPLE_VIDEOS } from "./sampleData";

/**
 * VideoCarousel
 * -------------
 * A 3D deck of video cards. The active card is centred, sharp and playing;
 * neighbours rotate back along Z, blur and dim. Only the active video plays
 * (muted by default with a toggle), and playback pauses entirely when the
 * carousel scrolls out of view. Drag, arrows, dots and arrow keys all navigate.
 */
export interface VideoItem {
  src: string;
  poster?: string;
}

export interface VideoCarouselProps {
  items?: VideoItem[];
  cardWidth?: number;
  cardHeight?: number;
  spacing?: number;
  depth?: number;
  perspective?: number;
  loop?: boolean;
  className?: string;
}

export function VideoCarousel({
  items = SAMPLE_VIDEOS as VideoItem[],
  cardWidth = 420,
  cardHeight = 260,
  spacing = 74,
  depth = 220,
  perspective = 1000,
  loop = true,
  className,
}: VideoCarouselProps) {
  const count = items.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.35 });
  const videoEls = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStart = useRef<{ x: number; active: number } | null>(null);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);

  const goTo = useCallback(
    (raw: number) => {
      if (count <= 0) return;
      const next = loop ? ((raw % count) + count) % count : Math.max(0, Math.min(count - 1, raw));
      setActive(next);
    },
    [count, loop],
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    videoEls.current.forEach((v, i) => {
      if (!v) return;
      if (!inView || i !== active) {
        v.pause();
      } else {
        v.muted = muted;
        void v.play().catch(() => undefined);
      }
    });
  }, [active, inView, muted]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    dragStart.current = { x: e.clientX, active };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) < 24) return;
    goTo(start.active + (dx < 0 ? 1 : -1));
  };

  const half = Math.floor(count / 2);

  return (
    <div ref={containerRef} className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className ?? ""}`}>
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{ perspective, touchAction: "pan-y", userSelect: "none" }}
        role="region"
        aria-label="Video carousel"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
      >
        <div className="relative" style={{ width: cardWidth + depth + spacing * 2, height: cardHeight + depth, transformStyle: "preserve-3d" }}>
          {items.map((item, i) => {
            let rel = i - active;
            if (loop && count > 2) {
              if (rel > half) rel -= count;
              if (rel < -half) rel += count;
            }
            const abs = Math.abs(rel);
            const isActive = rel === 0;
            const transform = `translateX(${rel * spacing}px) translateZ(${-abs * depth * 0.35}px) rotateY(${rel * -18}deg)`;
            const opacity = abs > 3 ? 0 : 1 - Math.min(0.75, abs * 0.18);
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 overflow-hidden bg-black"
                style={{ width: cardWidth, height: cardHeight, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2, borderRadius: 16, transformStyle: "preserve-3d", pointerEvents: isActive ? "auto" : "none" }}
                initial={false}
                animate={{ opacity, transform: `${transform} scale(${isActive ? 1 : 0.92})`, filter: `blur(${isActive ? 0 : 10}px)`, zIndex: 50 - abs }}
                transition={{ type: "spring", stiffness: 520, damping: 44 }}
                whileHover={isActive ? { transform: `${transform} scale(1.03)`, filter: "blur(0px)" } : undefined}
              >
                <video
                  ref={(el) => {
                    videoEls.current[i] = el;
                  }}
                  src={item.src}
                  poster={item.poster}
                  muted={i === active ? muted : true}
                  playsInline
                  loop
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                {!isActive && <div className="absolute inset-0 bg-black/20" />}
                {isActive && (
                  <button
                    type="button"
                    aria-label={muted ? "Unmute" : "Mute"}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMuted((m) => !m);
                    }}
                    className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white text-black"
                  >
                    {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button type="button" aria-label="Previous" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
              <ChevronRight className="h-[18px] w-[18px] rotate-180" />
            </button>
            <button type="button" aria-label="Next" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
              <ChevronRight className="h-[18px] w-[18px]" />
            </button>
          </>
        )}

        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-2.5 py-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to item ${i + 1}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="h-2 w-2 rounded-full"
                style={{ background: i === active ? "#000" : "rgba(0,0,0,0.25)" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
