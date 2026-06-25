import { ALL_BLOCK_TYPES } from "./types";
import type { BlockConfig, BlockType, PortfolioConfig } from "./types";
import { BLOCK_REGISTRY } from "../blocks/registry";

/**
 * Build a full, ordered block list (one per block type) from a small set of
 * per-type variant overrides. Everything is enabled by default; blocks with no
 * underlying data are skipped at render time, so toggling stays meaningful
 * without leaking empty sections.
 */
function buildBlocks(variants: Partial<Record<BlockType, string>>): BlockConfig[] {
  return ALL_BLOCK_TYPES.map((type) => ({
    type,
    enabled: true,
    variant: variants[type] ?? BLOCK_REGISTRY[type].variants[0].id,
  }));
}

/**
 * Five presets, each reproducing the look of the original template as a
 * starting point: a theme (background + accent + light/dark base) plus a
 * default set of block variants whose hero preserves the template's identity.
 */
export const PORTFOLIO_PRESETS: Record<string, PortfolioConfig> = {
  classic: {
    templateId: "classic",
    theme: { preset: "classic" },
    showNav: true,
    blocks: buildBlocks({
      hero: "split",
      about: "standard",
      skills: "grouped",
      projects: "grid",
      experience: "timeline",
      languages: "chips",
      contact: "split",
    }),
  },
  "modern-tech": {
    templateId: "modern-tech",
    theme: { preset: "modern-tech" },
    showNav: true,
    blocks: buildBlocks({
      hero: "split",
      about: "standard",
      skills: "grouped",
      projects: "grid",
      experience: "list",
      languages: "bars",
      contact: "split",
    }),
  },
  creative: {
    templateId: "creative",
    theme: { preset: "creative" },
    showNav: true,
    blocks: buildBlocks({
      hero: "centered",
      about: "text",
      skills: "cloud",
      projects: "list",
      experience: "timeline",
      languages: "chips",
      contact: "simple",
    }),
  },
  minimalist: {
    templateId: "minimalist",
    theme: { preset: "minimalist" },
    showNav: true,
    blocks: buildBlocks({
      hero: "minimal",
      about: "text",
      skills: "cloud",
      projects: "list",
      experience: "list",
      languages: "chips",
      contact: "simple",
    }),
  },
  corporate: {
    templateId: "corporate",
    theme: { preset: "corporate" },
    showNav: true,
    blocks: buildBlocks({
      hero: "split",
      about: "standard",
      skills: "grouped",
      projects: "grid",
      experience: "list",
      languages: "bars",
      contact: "split",
    }),
  },
};

export const DEFAULT_TEMPLATE_ID = "classic";

/** A fresh, mutation-safe copy of a preset (falls back to the default). */
export function getPreset(id: string): PortfolioConfig {
  const preset = PORTFOLIO_PRESETS[id] ?? PORTFOLIO_PRESETS[DEFAULT_TEMPLATE_ID];
  return {
    ...preset,
    theme: { ...preset.theme },
    blocks: preset.blocks.map((b) => ({ ...b })),
  };
}
