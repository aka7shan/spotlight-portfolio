import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * ExpandableDrawers
 * -----------------
 * A vertical stack of coloured drawers (a process / timeline accordion). Each
 * collapsed row shows a number and title; clicking expands it to reveal a set
 * of sub-points, while any previously open drawer closes. Heading text colour
 * is chosen automatically for contrast against each drawer's colour.
 */
export interface DrawerPoint {
  heading: string;
  text: string;
}

export interface DrawerItem {
  number: string;
  title: string;
  color: string;
  points: DrawerPoint[];
}

export interface ExpandableDrawersProps {
  drawers?: DrawerItem[];
  className?: string;
}

const DEFAULT_DRAWERS: DrawerItem[] = [
  {
    number: "01",
    title: "Discovery",
    color: "rgb(233, 224, 255)",
    points: [
      { heading: "Understand the problem", text: "We focus on deeply understanding the real challenge, gathering insights and defining clear objectives." },
      { heading: "Market & user research", text: "We analyse behaviour, competitors and trends to validate assumptions and uncover opportunities." },
      { heading: "Define the vision", text: "We clarify the mission, scope and success metrics to create alignment and a strategic foundation." },
    ],
  },
  {
    number: "02",
    title: "Design",
    color: "rgb(206, 189, 252)",
    points: [
      { heading: "Craft the experience", text: "We translate insights into intuitive user journeys and thoughtful interactions." },
      { heading: "Build the system", text: "Cohesive design systems that ensure consistency, scalability and a strong visual identity." },
      { heading: "Prototype & refine", text: "We test ideas quickly through prototypes; feedback guides improvements before development." },
    ],
  },
  {
    number: "03",
    title: "Development",
    color: "rgb(175, 146, 252)",
    points: [
      { heading: "Bring it to life", text: "We transform designs into functional, reliable products using modern technologies." },
      { heading: "Iterative building", text: "Features are developed in focused cycles, allowing continuous improvement and flexibility." },
      { heading: "Quality assurance", text: "We rigorously test performance, usability and stability for a polished, dependable product." },
    ],
  },
  {
    number: "04",
    title: "Growth",
    color: "rgb(133, 90, 250)",
    points: [
      { heading: "Launch strategically", text: "We release with intention — coordinating messaging, positioning and rollout." },
      { heading: "Measure performance", text: "Data guides our decisions; we track key metrics to understand what works." },
      { heading: "Optimise & scale", text: "We refine the product, enhance features and scale based on real-world insights." },
    ],
  },
];

function readableText(rgb: string): string {
  const m = rgb.match(/(\d+)/g);
  if (!m) return "#1a1030";
  const [r, g, b] = m.map(Number);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#1a1030" : "#ffffff";
}

export function ExpandableDrawers({ drawers = DEFAULT_DRAWERS, className }: ExpandableDrawersProps) {
  const [open, setOpen] = useState(0);

  return (
    <div className={`w-full overflow-hidden rounded-[28px] ${className ?? ""}`}>
      {drawers.map((drawer, i) => {
        const isOpen = i === open;
        const fg = readableText(drawer.color);
        return (
          <div key={drawer.number} style={{ background: drawer.color, color: fg }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center gap-5 px-7 py-6 text-left"
            >
              <span className="text-sm font-semibold tabular-nums opacity-70">{drawer.number}</span>
              <span className="flex-1 text-2xl font-semibold tracking-tight">{drawer.title}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <Plus className="h-6 w-6" style={{ opacity: 0.8 }} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 px-7 pb-8 sm:grid-cols-3" style={{ borderTop: `1px solid ${fg}22` }}>
                    {drawer.points.map((p) => (
                      <div key={p.heading} className="pt-6">
                        <h4 className="mb-2 text-base font-semibold">{p.heading}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: fg, opacity: 0.75 }}>
                          {p.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
