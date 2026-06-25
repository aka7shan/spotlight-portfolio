import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * GlassShowcase
 * -------------
 * A frosted-glass navigation list floating over a full-bleed background. The
 * background cross-fades to the hovered item's image, and the hovered row
 * expands to reveal its description plus an "n / total" counter. Keyboard /
 * click selects an item; the active row keeps the highlighted treatment.
 */
export interface GlassItem {
  name: string;
  description: string;
  thumbnail: string;
}

export interface GlassShowcaseProps {
  items?: GlassItem[];
  fallbackImage?: string;
  className?: string;
}

const DEFAULT_ITEMS: GlassItem[] = [
  { name: "Harley Davidson", description: "Premium motorcycles and a timeless culture of freedom.", thumbnail: SAMPLE_PHOTOS[0] },
  { name: "Studio K", description: "Design-forward studio focused on craft, detail and clarity.", thumbnail: SAMPLE_PHOTOS[1] },
  { name: "Arcade", description: "Playful experiences built with precise interaction and motion.", thumbnail: SAMPLE_PHOTOS[2] },
  { name: "Lumen", description: "Lighting and ambience, engineered for modern spaces.", thumbnail: SAMPLE_PHOTOS[3] },
];

export function GlassShowcase({ items = DEFAULT_ITEMS, fallbackImage = SAMPLE_PHOTOS[4], className }: GlassShowcaseProps) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);

  const bg = hovered >= 0 ? items[hovered].thumbnail : items[active]?.thumbnail ?? fallbackImage;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="sync">
        <motion.img
          key={bg}
          src={bg}
          alt=""
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.4 }, scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative flex h-full w-full items-center p-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-[460px] flex-col gap-1 rounded-2xl border border-white/10 p-3"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(20,20,20,0.18)" }}
        >
          {items.map((item, i) => {
            const isHovered = i === hovered;
            return (
              <motion.button
                key={item.name}
                type="button"
                onClick={() => setActive(i)}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(-1)}
                initial={false}
                animate={{ backgroundColor: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)" }}
                transition={{ duration: 0.2 }}
                className="flex w-full items-start gap-3 overflow-hidden rounded-xl p-3 text-left"
              >
                <motion.div
                  className="shrink-0 overflow-hidden rounded-lg"
                  animate={{ height: isHovered ? 96 : 64 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: 96 }}
                >
                  <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
                </motion.div>
                <div className="relative flex min-w-0 flex-1 flex-col justify-center self-stretch">
                  {isHovered && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} className="absolute right-0 top-0 text-[13px] font-medium text-black">
                      {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </motion.span>
                  )}
                  <span className="truncate text-xl font-semibold tracking-tight" style={{ color: isHovered ? "#000" : "#fff" }}>
                    {item.name}
                  </span>
                  {isHovered && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm leading-relaxed text-neutral-700">
                      {item.description}
                    </motion.p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.section>
      </div>
    </div>
  );
}
