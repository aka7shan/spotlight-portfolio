import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Menu, X } from "lucide-react";

/**
 * SubmenuSidebarNav
 * -----------------
 * A slide-in sidebar menu with drill-down submenus. Top-level entries that own
 * a submenu push a second panel in from the right; a back affordance returns to
 * the root. Panels and rows are staggered with `AnimatePresence` so opening the
 * menu cascades the links in.
 *
 * Rendered inside its own positioned container (not `position: fixed`) so it can
 * live inside a card on the showcase; set `inline={false}` to pin it to a real
 * layout corner instead.
 */
export interface NavSubLink {
  label: string;
  href?: string;
}
export interface NavItem {
  label: string;
  tagline?: string;
  href?: string;
  submenu?: { tagline?: string; links: NavSubLink[] };
}

export interface SubmenuSidebarNavProps {
  items?: readonly NavItem[];
  title?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly NavItem[] = [
  {
    label: "Work",
    tagline: "Selected projects",
    submenu: {
      tagline: "Recent case studies",
      links: [
        { label: "Aurora — Brand System" },
        { label: "Northwind — Web Platform" },
        { label: "Field Notes — Editorial" },
        { label: "Lumen — Product UI" },
      ],
    },
  },
  {
    label: "Studio",
    tagline: "Who we are",
    submenu: {
      tagline: "About the studio",
      links: [{ label: "Approach" }, { label: "Team" }, { label: "Careers" }],
    },
  },
  { label: "Journal", tagline: "Writing & notes", href: "#" },
  { label: "Contact", tagline: "Start a project", href: "#" },
];

const panelVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export function SubmenuSidebarNav({ items = DEFAULT_ITEMS, title = "Menu", className }: SubmenuSidebarNavProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex != null ? items[activeIndex] : null;

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-xl bg-neutral-950 text-white ${className ?? ""}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="absolute left-4 top-4 z-30 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        {open ? "Close" : "Menu"}
      </button>

      <div className="flex h-full items-center justify-center text-white/30">
        <span className="text-sm">Tap “Menu”.</span>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-0 z-10 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="absolute right-0 top-0 z-20 flex h-full w-[78%] max-w-[320px] flex-col bg-neutral-900 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <AnimatePresence mode="wait">
                  {activeItem ? (
                    <motion.button
                      key="back"
                      type="button"
                      onClick={() => setActiveIndex(null)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" /> {activeItem.label}
                    </motion.button>
                  ) : (
                    <motion.span
                      key="title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50"
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence custom={activeItem ? 1 : -1} mode="popLayout">
                  {!activeItem ? (
                    <motion.ul
                      key="root"
                      custom={-1}
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 320, damping: 34 }}
                      className="absolute inset-0 flex flex-col gap-1 p-3"
                    >
                      {items.map((item, i) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + i * 0.05 }}
                        >
                          <button
                            type="button"
                            onClick={() => (item.submenu ? setActiveIndex(i) : undefined)}
                            className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-white/5"
                          >
                            <span>
                              <span className="block text-lg font-semibold">{item.label}</span>
                              {item.tagline && <span className="block text-xs text-white/45">{item.tagline}</span>}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
                          </button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div
                      key={`sub-${activeIndex}`}
                      custom={1}
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 320, damping: 34 }}
                      className="absolute inset-0 flex flex-col gap-1 p-3"
                    >
                      {activeItem.submenu?.tagline && (
                        <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-widest text-white/40">
                          {activeItem.submenu.tagline}
                        </p>
                      )}
                      {activeItem.submenu?.links.map((link, i) => (
                        <motion.a
                          key={link.label}
                          href={link.href ?? "#"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 + i * 0.05 }}
                          className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4 text-white/40" />
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
