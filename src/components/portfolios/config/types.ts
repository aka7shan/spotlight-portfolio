/**
 * Config model for the composable portfolio builder.
 *
 * A portfolio is no longer a hardcoded template component. It is:
 *   - a `PortfolioData` (the user's real content), plus
 *   - a `PortfolioConfig` (which blocks are shown, in what order, with which
 *     layout variant, under which theme/accent).
 *
 * Templates become *presets* (a default PortfolioConfig). The builder edits a
 * copy of that config; `PortfolioRenderer` turns (data + config) into a page.
 */

export type BlockType =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "achievements"
  | "languages"
  | "contact";

/** Every block type, in a sensible default order. */
export const ALL_BLOCK_TYPES: readonly BlockType[] = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "languages",
  "contact",
] as const;

export interface BlockConfig {
  type: BlockType;
  enabled: boolean;
  /** Layout variant id, resolved against the block registry. */
  variant: string;
}

export interface ThemeConfig {
  /** Preset id from the theme registry (e.g. "classic", "modern-tech"). */
  preset: string;
  /**
   * Optional custom accent (hex). When set it overrides the preset's accent
   * by swapping the CSS variables the renderer paints with.
   */
  accent?: string;
}

/**
 * Overall page structure. This is what makes templates *structurally* distinct
 * (not just recolours):
 *   - sidebar : left vertical rail + content column (classic).
 *   - topbar  : sticky horizontal nav + full-width stacked sections.
 *   - minimal : no nav, a narrow centred reading column.
 */
export type PortfolioLayout = "sidebar" | "topbar" | "minimal";

export const ALL_LAYOUTS: readonly PortfolioLayout[] = ["sidebar", "topbar", "minimal"] as const;

export interface PortfolioConfig {
  /** Which preset this config was derived from. */
  templateId: string;
  theme: ThemeConfig;
  /** Page structure / navigation style. */
  layout: PortfolioLayout;
  /** Ordered; rendered top-to-bottom. Disabled/empty blocks are skipped. */
  blocks: BlockConfig[];
  /** Show the sticky section nav (rail on desktop, top bar on mobile). */
  showNav: boolean;
}

/** Current persisted-config schema version (for forward-compatible merges). */
export const CONFIG_VERSION = 1;
