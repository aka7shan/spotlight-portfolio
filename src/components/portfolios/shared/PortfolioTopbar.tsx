import { useEffect, useRef } from "react";
import { cn } from "../../ui/utils";
import type { SidebarItem, SidebarTheme } from "./PortfolioSidebar";

interface PortfolioTopbarProps {
  items: SidebarItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  theme: SidebarTheme;
  title?: string;
}

/**
 * Sticky horizontal navigation for top-bar templates.
 *
 * The structural counterpart to `PortfolioSidebar`: instead of a left rail it
 * pins a translucent bar to the top of the scroll container while the sections
 * scroll beneath it. Behaviour mirrors the profile page nav:
 *   - click a pill → parent scrolls to that section,
 *   - scroll-spy keeps the active pill highlighted,
 *   - the active pill auto-centres itself on overflow (narrow screens / many
 *     sections) by scrolling only its own strip — never the page.
 */
export function PortfolioTopbar({
  items,
  activeSection,
  onSectionChange,
  theme,
  title = "Portfolio",
}: PortfolioTopbarProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-nav-id="${activeSection}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeSection]);

  return (
    <header className={cn("sticky top-0 z-30 border-b", theme.bg, theme.border)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <h1
            className={cn(
              "shrink-0 text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
              theme.logoGradient,
            )}
          >
            {title}
          </h1>
          <nav
            ref={listRef}
            aria-label="Sections"
            className={cn(
              "flex-1 flex items-center gap-1 overflow-x-auto",
              // Hide the scrollbar — the bar reads as a clean navbar; overflow
              // is still reachable via the auto-centring + drag/trackpad.
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {items.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-nav-id={item.id}
                  onClick={() => onSectionChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                    isActive ? theme.activeClass : theme.inactiveClass,
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
