import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GalleryItem } from "./sampleData";
import { GALLERY_ITEMS } from "./sampleData";

/**
 * VerticalScrollGallery
 * ---------------------
 * A vertically scrolling stack where the item nearest the viewport centre
 * becomes "active": it scales up and reaches full opacity while the rest
 * recede. The container background cross-fades to the active item's colour,
 * and side labels echo its title/subheadline.
 *
 * The active item is found by measuring each card's centre against the scroll
 * container's centre on every scroll frame — robust to variable item sizes.
 * Background changes are scoped to this component (no document-level mutation).
 */
export interface VerticalScrollGalleryProps {
  items?: readonly GalleryItem[];
  activeScale?: number;
  inactiveScale?: number;
  inactiveOpacity?: number;
  imageWidth?: number;
  imageHeight?: number;
  spacing?: number;
  borderRadius?: number;
  titleColor?: string;
  className?: string;
}

export function VerticalScrollGallery({
  items = GALLERY_ITEMS,
  activeScale = 1.18,
  inactiveScale = 0.74,
  inactiveOpacity = 0.45,
  imageWidth = 380,
  imageHeight = 240,
  spacing = 90,
  borderRadius = 14,
  titleColor = "#111111",
  className,
}: VerticalScrollGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const center = container.clientHeight / 2;
      const containerTop = container.getBoundingClientRect().top;
      let closest = 0;
      let min = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const itemCenter = r.top - containerTop + r.height / 2;
        const d = Math.abs(itemCenter - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive((prev) => (prev === closest ? prev : closest));
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const pad = `calc(50% - ${imageHeight / 2}px)`;

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      animate={{ backgroundColor: items[active]?.backgroundColor ?? "#ffffff" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        key={`title-${active}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute left-6 top-1/2 z-10 hidden max-w-[24%] -translate-y-1/2 text-3xl font-bold tracking-tight lg:block"
        style={{ color: titleColor }}
      >
        {items[active]?.title}
      </motion.div>
      <motion.div
        key={`sub-${active}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute right-6 top-1/2 z-10 hidden max-w-[24%] -translate-y-1/2 text-right text-sm font-medium lg:block"
        style={{ color: titleColor }}
      >
        {items[active]?.subheadline}
      </motion.div>

      <div
        ref={scrollRef}
        className="relative z-[1] h-full w-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="flex flex-col items-center"
          style={{ gap: spacing, paddingTop: pad, paddingBottom: pad }}
        >
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                animate={{ scale: isActive ? activeScale : inactiveScale, opacity: isActive ? 1 : inactiveOpacity }}
                whileHover={{ scale: (isActive ? activeScale : inactiveScale) * 1.04 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="shrink-0 overflow-hidden"
                style={{
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius,
                  boxShadow: isActive ? "0 24px 48px rgba(0,0,0,0.18)" : "0 10px 22px rgba(0,0,0,0.08)",
                }}
              >
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
