import { ArrowRight, Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { ImageWithFallback } from "../../common/ImageWithFallback";
import { StatGrid } from "../shared/StatGrid";
import { computeStats } from "../shared/portfolioHelpers";
import { PortfolioAvatar } from "./Avatar";
import type { BlockComponent, BlockProps } from "./types";
import type { ResolvedTheme } from "./theme";

function HeroCTAs({ theme }: { theme: ResolvedTheme }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button asChild className={cn("bg-gradient-to-r text-white hover:opacity-90 px-6", theme.accentGradient)}>
        <a href="#block-projects">View Work<ArrowRight className="w-4 h-4 ml-2" /></a>
      </Button>
      <Button asChild variant="outline" className={cn(theme.surfaceBorder, theme.pageText)}>
        <a href="#block-contact"><Mail className="w-4 h-4 mr-2" />Get in Touch</a>
      </Button>
    </div>
  );
}

/** Full-width cover banner, shown above the hero when the user has one. */
function CoverBanner({ src }: { src: string }) {
  return (
    <div className="relative h-36 sm:h-48 md:h-56 rounded-3xl overflow-hidden shadow-lg">
      <ImageWithFallback src={src} alt="Cover" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

function heroStats(theme: ResolvedTheme, centered: boolean) {
  return {
    className: centered ? "max-w-xl mx-auto" : "",
    itemClassName: cn(theme.surface, theme.surfaceBorder, "border rounded-xl p-4 text-center"),
    valueClassName: cn("text-2xl sm:text-3xl font-bold", theme.headingText),
    labelClassName: cn("text-sm mt-1", theme.mutedText),
  };
}

function Centered({ data, theme }: BlockProps) {
  const p = data.personalInfo;
  const s = heroStats(theme, true);
  return (
    <div className="text-center space-y-8">
      {p.coverImage && <CoverBanner src={p.coverImage} />}
      <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-[color:var(--pf-accent-soft)] shadow-xl">
        <PortfolioAvatar name={p.name} src={p.avatar} theme={theme} initialsClassName="text-5xl" />
      </div>
      <div className="space-y-3">
        <h1 className={cn("text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight", theme.headingText)}>{p.name}</h1>
        {p.title && <p className={cn("text-xl", theme.accentText)}>{p.title}</p>}
      </div>
      {p.about && <p className={cn("max-w-2xl mx-auto leading-relaxed", theme.mutedText)}>{p.about}</p>}
      <div className="flex justify-center"><HeroCTAs theme={theme} /></div>
      <StatGrid stats={computeStats(data)} max={4} className={s.className} itemClassName={s.itemClassName} valueClassName={s.valueClassName} labelClassName={s.labelClassName} />
    </div>
  );
}

function Split({ data, theme }: BlockProps) {
  const p = data.personalInfo;
  const s = heroStats(theme, false);
  return (
    <div className="space-y-12">
      {p.coverImage && <CoverBanner src={p.coverImage} />}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className={cn("text-4xl md:text-5xl xl:text-6xl font-bold leading-tight", theme.headingText)}>{p.name}</h1>
            {p.title && (
              <div className="relative inline-block">
                <p className={cn("text-xl md:text-2xl font-semibold", theme.accentText)}>{p.title}</p>
                <div className={cn("absolute -bottom-2 left-0 w-20 h-1 rounded-full bg-gradient-to-r", theme.accentGradient)} />
              </div>
            )}
          </div>
          {p.about && <p className={cn("text-lg leading-relaxed", theme.mutedText)}>{p.about}</p>}
          <HeroCTAs theme={theme} />
        </div>
        <div className="relative">
          <div className="relative w-full max-w-[20rem] aspect-square mx-auto">
            <div className={cn("absolute -inset-4 rounded-3xl bg-gradient-to-r opacity-20 blur-xl", theme.accentGradient)} />
            <div className={cn("relative w-full h-full rounded-3xl overflow-hidden shadow-2xl", theme.mutedSurface)}>
              <PortfolioAvatar name={p.name} src={p.avatar} theme={theme} initialsClassName="text-6xl" />
            </div>
          </div>
        </div>
      </div>
      <StatGrid stats={computeStats(data)} max={4} itemClassName={s.itemClassName} valueClassName={s.valueClassName} labelClassName={s.labelClassName} />
    </div>
  );
}

function Cover({ data, theme }: BlockProps) {
  const p = data.personalInfo;
  const s = heroStats(theme, true);
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className={cn("relative h-48 sm:h-64 rounded-3xl overflow-hidden", theme.mutedSurface)}>
          {p.coverImage ? (
            <ImageWithFallback src={p.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className={cn("w-full h-full bg-gradient-to-r", theme.accentGradient)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="absolute left-1/2 -bottom-12 -translate-x-1/2">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-gray-100">
            <PortfolioAvatar name={p.name} src={p.avatar} theme={theme} initialsClassName="text-4xl" />
          </div>
        </div>
      </div>
      <div className="text-center space-y-3 pt-12">
        <h1 className={cn("text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight", theme.headingText)}>{p.name}</h1>
        {p.title && <p className={cn("text-lg sm:text-xl", theme.accentText)}>{p.title}</p>}
        {p.about && <p className={cn("max-w-2xl mx-auto leading-relaxed", theme.mutedText)}>{p.about}</p>}
      </div>
      <div className="flex justify-center"><HeroCTAs theme={theme} /></div>
      <StatGrid stats={computeStats(data)} max={4} className={s.className} itemClassName={s.itemClassName} valueClassName={s.valueClassName} labelClassName={s.labelClassName} />
    </div>
  );
}

function Minimal({ data, theme }: BlockProps) {
  const p = data.personalInfo;
  return (
    <div className="text-center space-y-8 py-8">
      <div className="mx-auto w-28 h-28 rounded-full overflow-hidden border border-current/10">
        <PortfolioAvatar name={p.name} src={p.avatar} theme={theme} initialsClassName="text-3xl" />
      </div>
      <div className="space-y-4">
        <h1 className={cn("text-5xl sm:text-6xl font-light tracking-tight", theme.headingText)}>{p.name}</h1>
        <div className={cn("w-20 h-px mx-auto bg-gradient-to-r", theme.accentGradient)} />
        {p.title && <p className={cn("text-lg tracking-wide", theme.mutedText)}>{p.title}</p>}
      </div>
      {p.about && <p className={cn("max-w-2xl mx-auto leading-relaxed font-light", theme.mutedText)}>{p.about}</p>}
      <div className="flex justify-center">
        <Button asChild variant="outline" className={cn("rounded-none", theme.surfaceBorder, theme.pageText)}>
          <a href="#block-contact">Get in Touch<ArrowRight className="w-4 h-4 ml-2" /></a>
        </Button>
      </div>
      <StatGrid stats={computeStats(data)} max={3} itemClassName="text-center" valueClassName={cn("text-3xl font-light", theme.headingText)} labelClassName={cn("text-sm uppercase tracking-wider mt-1", theme.mutedText)} />
    </div>
  );
}

export const heroVariants: Record<string, BlockComponent> = {
  centered: Centered,
  split: Split,
  cover: Cover,
  minimal: Minimal,
};
