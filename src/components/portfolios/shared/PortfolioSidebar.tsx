import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../ui/utils";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarTheme {
  bg: string;
  border: string;
  logoGradient: string;
  logoText: string;
  activeClass: string;
  inactiveClass: string;
  footerText: string;
}

interface PortfolioSidebarProps {
  items: SidebarItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  theme: SidebarTheme;
  title?: string;
}

/**
 * Responsive navigation for sidebar-based templates.
 *
 * - lg+ : a sticky left rail (256px) that pins while content scrolls.
 * - <lg : a sticky top bar with a hamburger that toggles the section menu.
 *
 * The previous version was `position: fixed; width: 16rem` with no mobile
 * affordance at all — on phones the rail overlapped the content and there was
 * no way to switch sections.
 */
export function PortfolioSidebar({
  items,
  activeSection,
  onSectionChange,
  theme,
  title = "Portfolio",
}: PortfolioSidebarProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);

  const handleSelect = (id: string) => {
    onSectionChange(id);
    setOpen(false);
  };

  // Keep the active item visible inside the rail as scroll-spy moves it —
  // adjusting only the rail's own scrollTop (never the page) so there's no
  // feedback loop with the section scroll.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const el = nav.querySelector<HTMLElement>(`[data-nav-id="${activeSection}"]`);
    if (!el) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.top < navRect.top) {
      nav.scrollTop -= navRect.top - elRect.top + 8;
    } else if (elRect.bottom > navRect.bottom) {
      nav.scrollTop += elRect.bottom - navRect.bottom + 8;
    }
  }, [activeSection]);

  const NavButton = ({ item }: { item: SidebarItem }) => {
    const isActive = activeSection === item.id;
    const Icon = item.icon;
    return (
      <button
        type="button"
        data-nav-id={item.id}
        onClick={() => handleSelect(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
          isActive ? theme.activeClass : theme.inactiveClass,
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile / tablet top bar */}
      <div className={cn("lg:hidden sticky top-0 z-30 border-b", theme.bg, theme.border)}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1
            className={cn(
              "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
              theme.logoGradient,
            )}
          >
            {title}
          </h1>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg",
              theme.inactiveClass,
            )}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              initial={reduce ? undefined : { height: 0, opacity: 0 }}
              animate={reduce ? undefined : { height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden px-3 pb-3"
            >
              <div className="space-y-1">
                {items.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop rail */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:self-start lg:sticky lg:top-0 lg:h-screen w-64 shrink-0 border-r",
          theme.bg,
          theme.border,
        )}
      >
        <div className={cn("p-6 border-b", theme.border)}>
          <h1
            className={cn(
              "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
              theme.logoGradient,
            )}
          >
            {title}
          </h1>
        </div>

        <nav ref={navRef} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {items.map((item) => (
              <motion.div key={item.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <NavButton item={item} />
              </motion.div>
            ))}
          </div>
        </nav>

        <div className={cn("p-4 border-t", theme.border)}>
          <p className={cn("text-xs text-center", theme.footerText)}>Built with Spotlight</p>
        </div>
      </aside>
    </>
  );
}
