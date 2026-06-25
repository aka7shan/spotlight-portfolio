/**
 * Theme resolution for the block renderer.
 *
 * Colours are driven by CSS variables (`--pf-accent`, `--pf-accent-2`, and
 * pre-computed translucent variants). The renderer paints these onto a wrapper
 * via inline style; every block references them through *static* Tailwind
 * arbitrary-value classes like `text-[color:var(--pf-accent)]` and
 * `from-[var(--pf-accent)]`. Those are literal strings, so Tailwind's JIT can
 * see them — which is exactly what lets a user pick an arbitrary accent colour
 * at runtime without recompiling CSS. Note the mandatory `color:` type hint on
 * every variable colour (`text-[color:var(--x)]`, `from-[color:var(--x)]`): a
 * bare `var()` is type-ambiguous in v3 and silently compiles to nothing.
 *
 * Neutral surfaces/text come from a light or dark base. A "template" is just a
 * preset = base mode + page background + default accent.
 */
import type { ThemeConfig } from "../config/types";
import type { SectionHeaderTheme } from "../shared/theme";
import type { ProjectTheme } from "../shared/ProjectGrid";
import type { ExperienceTheme } from "../shared/ExperienceTimeline";
import type { SidebarTheme } from "../shared/PortfolioSidebar";
import { cn } from "../../ui/utils";

export type ThemeMode = "light" | "dark";

export interface ThemePresetDef {
  id: string;
  label: string;
  mode: ThemeMode;
  /** Outer page background (Tailwind classes). */
  pageBg: string;
  /** Default accent gradient endpoints, as hex. */
  accent: [string, string];
}

export const THEME_PRESETS: Record<string, ThemePresetDef> = {
  classic: {
    id: "classic",
    label: "Classic",
    mode: "light",
    pageBg: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
    accent: ["#f59e0b", "#f97316"],
  },
  "modern-tech": {
    id: "modern-tech",
    label: "Modern Tech",
    mode: "dark",
    pageBg: "bg-gradient-to-br from-gray-900 via-slate-900 to-black",
    accent: ["#3b82f6", "#8b5cf6"],
  },
  creative: {
    id: "creative",
    label: "Creative",
    mode: "light",
    pageBg: "bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50",
    accent: ["#f97316", "#ec4899"],
  },
  minimalist: {
    id: "minimalist",
    label: "Minimalist",
    mode: "light",
    pageBg: "bg-white",
    accent: ["#111827", "#374151"],
  },
  corporate: {
    id: "corporate",
    label: "Corporate",
    mode: "light",
    pageBg: "bg-gradient-to-br from-slate-50 to-gray-100",
    accent: ["#2563eb", "#7c3aed"],
  },
};

export const DEFAULT_THEME_PRESET = "classic";

export interface ResolvedTheme {
  id: string;
  mode: ThemeMode;
  /** CSS custom properties to spread onto the renderer's root element. */
  vars: Record<string, string>;
  // Neutral surface/text tokens (Tailwind classes).
  pageBg: string;
  pageText: string;
  headingText: string;
  mutedText: string;
  surface: string;
  surfaceBorder: string;
  mutedSurface: string;
  hoverSurface: string;
  // Accent helpers (reference the CSS vars; JIT-safe literal strings).
  accentText: string;
  accentBg: string;
  accentSoftBg: string;
  accentBorder: string;
  /** Gradient stops only, e.g. "from-[var(--pf-accent)] to-[var(--pf-accent-2)]". */
  accentGradient: string;
}

const LIGHT_BASE = {
  pageText: "text-gray-700",
  headingText: "text-gray-900",
  mutedText: "text-gray-600",
  surface: "bg-white",
  surfaceBorder: "border-gray-200",
  mutedSurface: "bg-gray-50",
  hoverSurface: "hover:bg-gray-100",
};

const DARK_BASE = {
  pageText: "text-gray-300",
  headingText: "text-white",
  mutedText: "text-gray-400",
  surface: "bg-gray-900/60",
  surfaceBorder: "border-gray-800",
  mutedSurface: "bg-gray-800/50",
  hoverSurface: "hover:bg-gray-800/60",
};

// Tailwind v3 can't infer the colour type of a *bare* `var()` arbitrary value
// (it could be a background-image, length, etc.), so it silently emits nothing.
// The `color:` hint disambiguates it — required for every variable-based colour.
const ACCENT = {
  accentText: "text-[color:var(--pf-accent)]",
  accentBg: "bg-[color:var(--pf-accent)]",
  accentSoftBg: "bg-[color:var(--pf-accent-soft)]",
  accentBorder: "border-[color:var(--pf-accent)]",
  accentGradient: "from-[color:var(--pf-accent)] to-[color:var(--pf-accent-2)]",
};

function normalizeHex(hex: string): string {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "111827";
  return h;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba([r, g, b]: [number, number, number], a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Mix a colour toward white by `t` (0..1) — used to derive a 2nd accent stop. */
function lighten(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  const m = (c: number) => Math.round(c + (255 - c) * t);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(m(r))}${toHex(m(g))}${toHex(m(b))}`;
}

export function resolveTheme(config: ThemeConfig): ResolvedTheme {
  const preset = THEME_PRESETS[config.preset] ?? THEME_PRESETS[DEFAULT_THEME_PRESET];
  const base = preset.mode === "dark" ? DARK_BASE : LIGHT_BASE;

  const a1 = config.accent ? `#${normalizeHex(config.accent)}` : preset.accent[0];
  const a2 = config.accent ? lighten(a1, 0.25) : preset.accent[1];
  const rgb1 = hexToRgb(a1);

  return {
    id: preset.id,
    mode: preset.mode,
    vars: {
      "--pf-accent": a1,
      "--pf-accent-2": a2,
      "--pf-accent-soft": rgba(rgb1, 0.12),
      "--pf-accent-softer": rgba(rgb1, 0.06),
      "--pf-accent-ring": rgba(rgb1, 0.35),
    },
    pageBg: preset.pageBg,
    ...base,
    ...ACCENT,
  };
}

// --- Builders that adapt ResolvedTheme to the existing kernel theme shapes ---

export function buildHeaderTheme(t: ResolvedTheme): SectionHeaderTheme {
  return {
    titleClass: cn("text-3xl sm:text-4xl font-bold", t.headingText),
    subtitleClass: cn("text-lg", t.mutedText),
    dividerClass: cn("bg-gradient-to-r", t.accentGradient),
    align: "center",
  };
}

export function buildProjectTheme(t: ResolvedTheme): ProjectTheme {
  return {
    card: cn(t.surface, t.surfaceBorder, "hover:shadow-2xl transition-all duration-500"),
    imageBg: t.mutedSurface,
    title: cn("text-xl font-bold", t.headingText),
    titleHover: "group-hover:text-[color:var(--pf-accent)]",
    description: cn("leading-relaxed", t.mutedText),
    badge: "border-[color:var(--pf-accent)] text-[color:var(--pf-accent)] bg-[color:var(--pf-accent-soft)]",
    cols: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
  };
}

export function buildExperienceTheme(
  t: ResolvedTheme,
  layout: "left" | "alternating",
): ExperienceTheme {
  return {
    line: "bg-[color:var(--pf-accent)]",
    nodeBorder: "border-[color:var(--pf-accent)]",
    nodeGradient: t.accentGradient,
    card: cn(t.surface, t.surfaceBorder, "hover:shadow-2xl transition-all duration-500"),
    position: cn(t.headingText, "group-hover:text-[color:var(--pf-accent)] transition-colors"),
    company: "text-[color:var(--pf-accent)] font-medium",
    badge: "border-[color:var(--pf-accent)] text-[color:var(--pf-accent)] bg-[color:var(--pf-accent-soft)]",
    description: cn("leading-relaxed", t.mutedText),
    layout,
  };
}

export function buildNavTheme(t: ResolvedTheme): SidebarTheme {
  return {
    bg: cn(t.mode === "dark" ? "bg-gray-900/60" : "bg-white/80", "backdrop-blur-md"),
    border: t.surfaceBorder,
    logoGradient: t.accentGradient,
    logoText: t.headingText,
    activeClass: cn("bg-gradient-to-r", t.accentGradient, "text-white shadow-lg"),
    inactiveClass: cn(t.mutedText, "hover:text-[color:var(--pf-accent)]", t.hoverSurface),
    footerText: t.mutedText,
  };
}
