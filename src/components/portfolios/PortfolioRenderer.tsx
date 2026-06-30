import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { Home } from "lucide-react";
import { cn } from "../ui/utils";
import { PortfolioShell } from "./shared/PortfolioShell";
import { PortfolioSidebar, type SidebarItem } from "./shared/PortfolioSidebar";
import { PortfolioTopbar } from "./shared/PortfolioTopbar";
import { BLOCK_REGISTRY, getBlockComponent } from "./blocks/registry";
import { resolveTheme, buildNavTheme } from "./blocks/theme";
import type { PortfolioConfig } from "./config/types";
import type { PortfolioData } from "../../types/portfolio";

interface PortfolioRendererProps {
  data: PortfolioData;
  config: PortfolioConfig;
}

type SectionRefs = { current: Map<string, HTMLElement> };

/**
 * Track which section is in view for the nav highlight. Uses live element refs
 * (not `document.getElementById`) so it works both on the page and when the
 * renderer is portalled into an <iframe> (where `document` is the host doc).
 */
function useScrollSpy(sectionRefs: SectionRefs, ids: string[]): string {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;
    setActive((prev) => (ids.includes(prev) ? prev : ids[0]));

    const els = ids
      .map((id) => sectionRefs.current.get(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    // Use the observer from the document that actually owns the elements so
    // intersections are measured against the right viewport (e.g. the iframe).
    const win = els[0].ownerDocument?.defaultView ?? window;
    const IO = win.IntersectionObserver ?? window.IntersectionObserver;

    const observer = new IO(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.getAttribute("data-block");
        if (id) setActive(id);
      },
      { root: null, rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

export function PortfolioRenderer({ data, config }: PortfolioRendererProps) {
  const reduce = useReducedMotion();
  const theme = useMemo(() => resolveTheme(config.theme), [config.theme]);

  const visibleBlocks = useMemo(
    () =>
      config.blocks.filter(
        (b) => b.enabled && BLOCK_REGISTRY[b.type].isAvailable(data),
      ),
    [config.blocks, data],
  );

  const navIds = useMemo(() => visibleBlocks.map((b) => b.type), [visibleBlocks]);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const active = useScrollSpy(sectionRefs, navIds);

  const navItems: SidebarItem[] = visibleBlocks.map((b) => {
    const def = BLOCK_REGISTRY[b.type];
    return {
      id: b.type,
      label: b.type === "hero" ? "Home" : def.label,
      icon: b.type === "hero" ? Home : def.icon,
    };
  });

  const handleNav = (id: string) => {
    sectionRefs.current
      .get(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const layout = config.layout ?? "sidebar";
  const showNav = config.showNav && navItems.length > 1 && layout !== "minimal";
  const firstName = data.personalInfo.name?.split(" ")[0] || "Portfolio";

  // The section stack is identical across layouts — only the surrounding shell
  // (left rail / top bar / bare column) changes. Rendering it once keeps the
  // scroll-spy refs and block order in a single place.
  const sections = visibleBlocks.map((block, i) => {
    const Block = getBlockComponent(block.type, block.variant);
    const def = BLOCK_REGISTRY[block.type];
    return (
      <section
        key={block.type}
        id={`block-${block.type}`}
        data-block={block.type}
        ref={(el) => {
          if (el) sectionRefs.current.set(block.type, el);
          else sectionRefs.current.delete(block.type);
        }}
        className={cn("scroll-mt-24", i === 0 ? "pt-8 md:pt-12" : "pt-12 md:pt-20", "pb-4")}
      >
        <Block data={data} theme={theme} title={def.defaultTitle} />
      </section>
    );
  });

  const rootStyle = theme.vars as CSSProperties;

  // --- Minimal: no nav, a narrow centred reading column with extra air. ---
  if (layout === "minimal") {
    return (
      <div className={cn(theme.pageText)} style={rootStyle}>
        <div className={cn("min-h-screen", theme.pageBg)}>
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 py-10 md:py-20">
            {sections}
            <div className="py-10" />
          </div>
        </div>
      </div>
    );
  }

  // --- Top bar: sticky horizontal nav above full-width stacked sections. ---
  if (layout === "topbar") {
    return (
      <div className={cn(theme.pageText)} style={rootStyle}>
        <div className={cn("min-h-screen", theme.pageBg)}>
          {showNav && (
            <PortfolioTopbar
              items={navItems}
              activeSection={active}
              onSectionChange={handleNav}
              theme={buildNavTheme(theme)}
              title={firstName}
            />
          )}
          <main>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {sections}
              <div className="py-10" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- Sidebar (default): left rail + content column. ---
  return (
    <div className={cn(theme.pageText)} style={rootStyle}>
      <PortfolioShell
        className={theme.pageBg}
        contentClassName="py-0"
        sidebar={
          showNav ? (
            <PortfolioSidebar
              items={navItems}
              activeSection={active}
              onSectionChange={handleNav}
              theme={buildNavTheme(theme)}
              title={firstName}
            />
          ) : null
        }
      >
        {sections}
        <div className="py-10" />
      </PortfolioShell>
    </div>
  );
}
