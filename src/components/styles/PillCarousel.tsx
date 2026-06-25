import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * PillCarousel
 * ------------
 * Pill-shaped cards arranged on a diagonal arc with depth. The front card is
 * upright and sharp; cards stepping away shrink, blur and drift toward the
 * corners. Auto-plays through the deck, and a tooltip button floats above the
 * active card. Clicking a side card brings it to the front.
 */
export interface PillItem {
  image: string;
  tooltipText: string;
  link?: string;
}

export interface PillCarouselProps {
  items?: PillItem[];
  backgroundColor?: string;
  cardBorderRadius?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const DEFAULT_ITEMS: PillItem[] = [
  { image: SAMPLE_PHOTOS[0], tooltipText: "View details" },
  { image: SAMPLE_PHOTOS[1], tooltipText: "Learn more" },
  { image: SAMPLE_PHOTOS[2], tooltipText: "Explore" },
  { image: SAMPLE_PHOTOS[3], tooltipText: "Discover" },
  { image: SAMPLE_PHOTOS[4], tooltipText: "See more" },
];

export function PillCarousel({
  items = DEFAULT_ITEMS,
  backgroundColor = "#6b2c2c",
  cardBorderRadius = 160,
  autoPlay = true,
  autoPlayInterval = 3000,
  className,
}: PillCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const n = items.length;

  const next = useCallback(() => setIndex((p) => (p + 1) % n), [n]);

  useEffect(() => {
    if (!autoPlay || n <= 1) return;
    const t = setInterval(next, autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay, autoPlayInterval, n, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") setIndex((p) => (p - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, next]);

  const styleFor = (i: number): CSSProperties => {
    const diff = (i - index + n) % n;
    const isH = hovered === i;
    const base = { left: "50%", top: "50%", transform: "translate(-50%,-50%) scale(1)", zIndex: 50, opacity: 1, filter: "blur(0px)" };
    if (diff === 0) return base;
    if (diff === 1) return { left: "86%", top: "36%", transform: `translate(-50%,-50%) scale(${isH ? 0.9 : 0.85})`, zIndex: 40, opacity: 0.95, filter: "blur(0.5px)" };
    if (diff === 2) return { left: "118%", top: "24%", transform: `translate(-50%,-50%) scale(0.7)`, zIndex: 30, opacity: 0.85, filter: "blur(1.5px)" };
    if (diff === n - 1) return { left: "14%", top: "64%", transform: `translate(-50%,-50%) scale(${isH ? 0.9 : 0.85})`, zIndex: 40, opacity: 0.95, filter: "blur(0.5px)" };
    if (diff === n - 2) return { left: "-18%", top: "76%", transform: `translate(-50%,-50%) scale(0.7)`, zIndex: 30, opacity: 0.85, filter: "blur(1.5px)" };
    return { left: "50%", top: "50%", transform: "translate(-50%,-50%) scale(0.5)", zIndex: 10, opacity: 0, filter: "blur(3px)" };
  };

  const activeItem = items[index];

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`} style={{ background: backgroundColor }}>
      <div className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2" style={{ width: 280 }}>
        {items.map((item, i) => {
          const isCenter = i === index;
          return (
            <div
              key={i}
              className="absolute h-[60%] w-full transition-all duration-[600ms]"
              style={{ ...styleFor(i), transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", cursor: isCenter ? "default" : "pointer" }}
              onClick={() => !isCenter && setIndex(i)}
              onMouseEnter={() => !isCenter && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                style={{ borderRadius: cardBorderRadius, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: isCenter ? "6px solid #fff" : "none" }}
              >
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.a
          key={index}
          href={activeItem.link ?? "#"}
          onClick={(e) => !activeItem.link && e.preventDefault()}
          initial={{ opacity: 0, x: "-50%", y: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ scale: 1.05 }}
          className="absolute left-1/2 top-[calc(20%-56px)] z-[100] whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-black no-underline shadow-lg"
        >
          {activeItem.tooltipText}
          <span className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white" />
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
