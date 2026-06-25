import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * ElevatedCarousel
 * ----------------
 * A draggable row of cards where the active (centred) card rises above the
 * others and reveals its title / subheadline / CTA beneath it. The track
 * springs sideways to keep the active card centred; dragging or clicking a
 * neighbour changes the selection.
 */
export interface ElevatedItem {
  image: string;
  title: string;
  subheadline: string;
  tag?: string;
}

export interface ElevatedCarouselProps {
  items?: ElevatedItem[];
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  elevation?: number;
  backgroundColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: ElevatedItem[] = [
  { image: SAMPLE_PHOTOS[0], title: "Explore nature", subheadline: "Natural landscapes", tag: "New" },
  { image: SAMPLE_PHOTOS[1], title: "Urban adventures", subheadline: "City life energy", tag: "Featured" },
  { image: SAMPLE_PHOTOS[2], title: "Creative spaces", subheadline: "Modern design" },
  { image: SAMPLE_PHOTOS[3], title: "Digital innovation", subheadline: "Future technology", tag: "Popular" },
  { image: SAMPLE_PHOTOS[4], title: "Peaceful moments", subheadline: "Tranquil settings" },
];

export function ElevatedCarousel({
  items = DEFAULT_ITEMS,
  cardWidth = 300,
  cardHeight = 380,
  gap = 24,
  elevation = 72,
  backgroundColor = "#ffffff",
  className,
}: ElevatedCarouselProps) {
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const step = cardWidth + gap;
  const totalWidth = items.length * step;

  useEffect(() => {
    const center = (containerRef.current?.offsetWidth ?? 0) / 2 - cardWidth / 2;
    const controls = animate(x, -active * step + center, { type: "spring", stiffness: 300, damping: 30 });
    return controls.stop;
  }, [active, cardWidth, step, x]);

  const onDragEnd = (_e: unknown, _info: PanInfo) => {
    const center = (containerRef.current?.offsetWidth ?? 0) / 2 - cardWidth / 2;
    const idx = Math.round((-x.get() + center) / step);
    setActive(Math.max(0, Math.min(items.length - 1, idx)));
    setDragging(false);
  };

  return (
    <div ref={containerRef} className={`relative flex h-full w-full items-center overflow-hidden ${className ?? ""}`} style={{ background: backgroundColor }}>
      <motion.div
        className="flex items-center"
        style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
        drag="x"
        dragConstraints={{ left: -(totalWidth - (containerRef.current?.offsetWidth ?? 0)), right: step }}
        dragElastic={0.1}
        onDragStart={() => setDragging(true)}
        onDragEnd={onDragEnd}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div key={i} className="flex shrink-0 flex-col" style={{ width: cardWidth }} onClick={() => !dragging && setActive(i)}>
              <motion.div
                className="relative overflow-hidden"
                style={{ height: cardHeight, borderRadius: 18, cursor: "pointer" }}
                animate={{ y: isActive ? -elevation : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img src={item.image} alt={item.title} draggable={false} className="h-full w-full select-none object-cover" />
                {item.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/25 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    {item.tag}
                  </span>
                )}
              </motion.div>
              <motion.div
                className="pointer-events-none mt-5 flex items-start justify-between gap-4"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? -elevation + 16 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-2xl font-semibold tracking-tight text-neutral-900">{item.title}</h3>
                  <p className="truncate text-sm font-medium text-neutral-500">{item.subheadline}</p>
                </div>
                <button
                  type="button"
                  aria-label="View details"
                  className="pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full text-neutral-900 transition-transform hover:scale-110"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </button>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
