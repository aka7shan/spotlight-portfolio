import { useCallback, useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * VelocityCarousel
 * ----------------
 * A stack of square cards laid out along the x-axis. The active card sits
 * centred and full-scale with its headline / copy / CTA revealed; neighbours
 * shrink and dim on either side. Drag horizontally or use the dot indicators /
 * arrow keys to move between cards.
 */
export interface VelocityCard {
  image: string;
  headline: string;
  text: string;
  buttonText: string;
  buttonLink?: string;
}

export interface VelocityCarouselProps {
  cards?: VelocityCard[];
  cardSize?: number;
  spacing?: number;
  activeScale?: number;
  inactiveScale?: number;
  backgroundColor?: string;
  className?: string;
}

const DEFAULT_CARDS: VelocityCard[] = [
  { image: SAMPLE_PHOTOS[0], headline: "Innovation", text: "Cutting-edge solutions that transform the way you work.", buttonText: "Explore" },
  { image: SAMPLE_PHOTOS[1], headline: "Performance", text: "Fast, smooth and reliable interactions across the board.", buttonText: "Get started" },
  { image: SAMPLE_PHOTOS[2], headline: "Premium quality", text: "Crafted with attention to every last detail.", buttonText: "Learn more" },
  { image: SAMPLE_PHOTOS[3], headline: "Precision", text: "Focused layouts with a clear visual hierarchy.", buttonText: "Discover" },
  { image: SAMPLE_PHOTOS[4], headline: "Experience", text: "Guide people through content with a polished flow.", buttonText: "Open" },
];

export function VelocityCarousel({
  cards = DEFAULT_CARDS,
  cardSize = 340,
  spacing = 184,
  activeScale = 1,
  inactiveScale = 0.86,
  backgroundColor = "#f5f5f5",
  className,
}: VelocityCarouselProps) {
  const [active, setActive] = useState(Math.floor(cards.length / 2));

  const clamp = useCallback((i: number) => Math.max(0, Math.min(cards.length - 1, i)), [cards.length]);
  const prev = useCallback(() => setActive((c) => (c === 0 ? cards.length - 1 : c - 1)), [cards.length]);
  const next = useCallback(() => setActive((c) => (c === cards.length - 1 ? 0 : c + 1)), [cards.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x > 56) prev();
    if (info.offset.x < -56) next();
  };

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ background: backgroundColor }}
    >
      <motion.div className="relative h-full w-full" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.16} onDragEnd={onDragEnd} style={{ touchAction: "pan-y" }}>
        {cards.map((card, i) => {
          const dist = i - active;
          const isActive = i === active;
          return (
            <motion.div
              key={i}
              role="button"
              tabIndex={isActive ? -1 : 0}
              onClick={() => !isActive && setActive(clamp(i))}
              className="absolute left-1/2 top-1/2 overflow-hidden border border-white/60 bg-neutral-300 shadow-2xl"
              style={{ width: cardSize, height: cardSize, marginLeft: -cardSize / 2, marginTop: -cardSize / 2, borderRadius: 36, cursor: isActive ? "default" : "pointer" }}
              animate={{ x: dist * spacing, scale: isActive ? activeScale : inactiveScale, opacity: Math.abs(dist) > 2 ? 0.55 : 1, zIndex: 50 - Math.abs(dist) }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <img src={card.image} alt={card.headline} draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
              <div className="absolute inset-0 bg-black/40" style={{ opacity: isActive ? 1 : 0.65 }} />
              {isActive && (
                <motion.div
                  className="pointer-events-none relative flex h-full w-full flex-col items-center justify-end gap-5 p-8 text-center text-white"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-2xl font-semibold tracking-tight">{card.headline}</h3>
                    <p className="max-w-[86%] text-sm text-white/80">{card.text}</p>
                  </div>
                  <a
                    href={card.buttonLink ?? "#"}
                    onClick={(e) => e.stopPropagation()}
                    className="pointer-events-auto inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-black no-underline shadow"
                  >
                    {card.buttonText}
                  </a>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-[7px] rounded-full bg-neutral-900 transition-all"
            style={{ width: i === active ? 18 : 7, opacity: i === active ? 1 : 0.28 }}
          />
        ))}
      </div>
    </div>
  );
}
