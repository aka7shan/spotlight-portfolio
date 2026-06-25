import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { Home } from "lucide-react";
import { cn } from "../ui/utils";
import { PortfolioShell } from "./shared/PortfolioShell";
import { PortfolioSidebar, type SidebarItem } from "./shared/PortfolioSidebar";
import { BLOCK_REGISTRY, getBlockComponent } from "./blocks/registry";
import { resolveTheme, buildNavTheme } from "./blocks/theme";
import type { PortfolioConfig } from "./config/types";
import type { PortfolioData } from "../../types/portfolio";

interface PortfolioRendererProps {
  data: PortfolioData;
  config: PortfolioConfig;
}

/** Track which section is in view for the nav highlight. */
function useScrollSpy(ids: string[]): string {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;
    setActive((prev) => (ids.includes(prev) ? prev : ids[0]));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id.replace("block-", ""));
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(`block-${id}`);
      if (el) observer.observe(el);
    });
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
  const active = useScrollSpy(navIds);

  const navItems: SidebarItem[] = visibleBlocks.map((b) => {
    const def = BLOCK_REGISTRY[b.type];
    return {
      id: b.type,
      label: b.type === "hero" ? "Home" : def.label,
      icon: b.type === "hero" ? Home : def.icon,
    };
  });

  const handleNav = (id: string) => {
    const el = document.getElementById(`block-${id}`);
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const showNav = config.showNav && navItems.length > 1;
  const firstName = data.personalInfo.name?.split(" ")[0] || "Portfolio";

  return (
    <div className={cn(theme.pageText)} style={theme.vars as CSSProperties}>
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
        {visibleBlocks.map((block, i) => {
          const Block = getBlockComponent(block.type, block.variant);
          const def = BLOCK_REGISTRY[block.type];
          return (
            <section
              key={block.type}
              id={`block-${block.type}`}
              className={cn("scroll-mt-24", i === 0 ? "pt-8 md:pt-12" : "pt-12 md:pt-20", "pb-4")}
            >
              <Block data={data} theme={theme} title={def.defaultTitle} />
            </section>
          );
        })}
        <div className="py-10" />
      </PortfolioShell>
    </div>
  );
}
