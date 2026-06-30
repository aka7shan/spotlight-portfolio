import { ALL_BLOCK_TYPES, ALL_LAYOUTS, CONFIG_VERSION } from "./types";
import type { BlockConfig, PortfolioConfig } from "./types";
import { BLOCK_REGISTRY } from "../blocks/registry";
import { getPreset } from "./presets";

/**
 * Persistence boundary for portfolio configs. The renderer/builder only ever
 * talk to this interface, so swapping localStorage for a backend later is a
 * single new implementation + one wiring change — no UI churn. Mirrors the
 * existing `api.me.setTemplate` pattern.
 */
export interface ConfigStore {
  load(userId: string, templateId: string): PortfolioConfig | null;
  save(userId: string, config: PortfolioConfig): void;
  clear(userId: string, templateId: string): void;
}

const keyFor = (userId: string, templateId: string) =>
  `pf:config:${userId}:${templateId}`;

interface StoredEnvelope {
  v: number;
  config: PortfolioConfig;
}

/**
 * Merge a stored config over the preset so the result is always complete and
 * valid: unknown block types are dropped, missing ones are appended with preset
 * defaults, and invalid variants fall back. This keeps old saves working when
 * new blocks/variants ship.
 */
export function mergeWithPreset(
  templateId: string,
  stored: Partial<PortfolioConfig> | null | undefined,
): PortfolioConfig {
  const preset = getPreset(templateId);
  if (!stored) return preset;

  const blocks: BlockConfig[] = [];
  const seen = new Set<string>();

  for (const b of stored.blocks ?? []) {
    if (!b || !ALL_BLOCK_TYPES.includes(b.type) || seen.has(b.type)) continue;
    const def = BLOCK_REGISTRY[b.type];
    const variant = def.variants.some((v) => v.id === b.variant)
      ? b.variant
      : def.variants[0].id;
    blocks.push({ type: b.type, enabled: b.enabled !== false, variant });
    seen.add(b.type);
  }

  // Append any block types added since the config was saved.
  for (const t of ALL_BLOCK_TYPES) {
    if (seen.has(t)) continue;
    const fromPreset = preset.blocks.find((pb) => pb.type === t);
    blocks.push(fromPreset ?? { type: t, enabled: true, variant: BLOCK_REGISTRY[t].variants[0].id });
  }

  return {
    templateId: preset.templateId,
    theme: {
      preset: stored.theme?.preset ?? preset.theme.preset,
      accent: stored.theme?.accent,
    },
    layout: stored.layout && ALL_LAYOUTS.includes(stored.layout) ? stored.layout : preset.layout,
    showNav: typeof stored.showNav === "boolean" ? stored.showNav : preset.showNav,
    blocks,
  };
}

function hasWindow(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export const localStorageConfigStore: ConfigStore = {
  load(userId, templateId) {
    if (!hasWindow()) return null;
    try {
      const raw = window.localStorage.getItem(keyFor(userId, templateId));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredEnvelope;
      return mergeWithPreset(templateId, parsed.config);
    } catch {
      return null;
    }
  },
  save(userId, config) {
    if (!hasWindow()) return;
    try {
      const envelope: StoredEnvelope = { v: CONFIG_VERSION, config };
      window.localStorage.setItem(keyFor(userId, config.templateId), JSON.stringify(envelope));
    } catch {
      /* quota / privacy mode — non-fatal, config just won't persist */
    }
  },
  clear(userId, templateId) {
    if (!hasWindow()) return;
    try {
      window.localStorage.removeItem(keyFor(userId, templateId));
    } catch {
      /* ignore */
    }
  },
};

/**
 * Resolve the effective config for a user+template: a saved (merged) config if
 * one exists, otherwise the pristine preset.
 */
export function resolveConfig(
  userId: string | undefined,
  templateId: string,
  store: ConfigStore = localStorageConfigStore,
): PortfolioConfig {
  if (userId) {
    const saved = store.load(userId, templateId);
    if (saved) return saved;
  }
  return getPreset(templateId);
}
