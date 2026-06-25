import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";

/**
 * SubmenuSidebarNav
 * -----------------
 * A slide-in sidebar menu with drill-down submenus. Top-level entries that own
 * a submenu push a second panel in from the right; a back affordance returns to
 * the root. Panels cross-slide and their rows stagger in.
 *
 * Rendered inside its own positioned container (not `position: fixed`) so it can
 * live inside a card on the showcase.
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
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function SubmenuSidebarNav({ items = DEFAULT_ITEMS, title = "Menu", className }: SubmenuSidebarNavProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex != null ? items[activeIndex] : null;

  const close = () => {
    setOpen(false);
    // Reset the drill-down after the drawer finishes sliding out.
    window.setTimeout(() => setActiveIndex(null), 300);
  };

  return (
    <div className={`relative h-full w-full overflow-hidden bg-neutral-950 text-white ${className ?? ""}`}>
      {/* Idle state */}
      <div className="flex h-full flex-col items-start justify-between p-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/20"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
        <div className="text-white/30">
          <p className="text-2xl font-semibold tracking-tight text-white/60">Studio Aria</p>
          <p className="text-sm">Open the menu to explore.</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="absolute left-0 top-0 z-20 flex h-full w-[86%] max-w-[340px] flex-col bg-neutral-900 shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 38 }}
            >
              {/* Header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
                <AnimatePresence mode="wait" initial={false}>
                  {activeItem ? (
                    <motion.button
                      key="back"
                      type="button"
                      onClick={() => setActiveIndex(null)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="inline-flex items-center gap-2 text-base font-semibold text-white hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" /> {activeItem.label}
                    </motion.button>
                  ) : (
                    <motion.span
                      key="title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45"
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Panels */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence custom={activeItem ? 1 : -1} mode="popLayout" initial={false}>
                  {!activeItem ? (
                    <motion.ul
                      key="root"
                      custom={-1}
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 420, damping: 40 }}
                      className="absolute inset-0 flex flex-col gap-1 overflow-y-auto p-3"
                    >
                      {items.map((item, i) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.06 + i * 0.05, type: "spring", stiffness: 500, damping: 40 }}
                        >
                          <button
                            type="button"
                            onClick={() => (item.submenu ? setActiveIndex(i) : undefined)}
                            className="group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition hover:bg-white/[0.07]"
                          >
                            <span className="min-w-0">
                              <span className="block text-xl font-semibold leading-tight">{item.label}</span>
                              {item.tagline && (
                                <span className="mt-0.5 block text-xs text-white/45">{item.tagline}</span>
                              )}
                            </span>
                            {item.submenu ? (
                              <ChevronRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:text-white" />
                            )}
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
                      transition={{ type: "spring", stiffness: 420, damping: 40 }}
                      className="absolute inset-0 flex flex-col gap-1 overflow-y-auto p-3"
                    >
                      {activeItem.submenu?.tagline && (
                        <p className="px-4 pb-2 pt-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
                          {activeItem.submenu.tagline}
                        </p>
                      )}
                      {activeItem.submenu?.links.map((link, i) => (
                        <motion.a
                          key={link.label}
                          href={link.href ?? "#"}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.05, type: "spring", stiffness: 500, damping: 40 }}
                          className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium text-white/85 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4 text-white/35" />
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
