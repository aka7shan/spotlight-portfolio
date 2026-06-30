import { mergeWithPreset } from "./store";
import type { PortfolioConfig } from "./types";

/**
 * Share-link encoding for the public page.
 *
 * localStorage is owner-browser only, so a recruiter opening `/p/<code>` can't
 * see the owner's customizations. Until config is persisted server-side, we
 * encode a compact config into the URL hash (`/p/<code>#c=<base64url>`) so a
 * shared link carries the layout/theme with it. The public page decodes it and
 * merges over the template preset; if absent or malformed it falls back to the
 * preset cleanly.
 */

const PARAM = "c";

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** A trimmed, persistence-friendly view of the config (no derived data). */
function minify(config: PortfolioConfig) {
  return {
    templateId: config.templateId,
    theme: config.theme,
    layout: config.layout,
    showNav: config.showNav,
    blocks: config.blocks.map((b) => ({ type: b.type, enabled: b.enabled, variant: b.variant })),
  };
}

/** `"c=<base64url>"` fragment (without the leading `#`). */
export function encodeConfigToHash(config: PortfolioConfig): string {
  return `${PARAM}=${utf8ToBase64Url(JSON.stringify(minify(config)))}`;
}

/** Decode a config from `window.location.hash`, merged over the preset. */
export function decodeConfigFromHash(
  hash: string,
  templateId: string,
): PortfolioConfig | null {
  const clean = hash.replace(/^#/, "");
  if (!clean) return null;
  const parts = new URLSearchParams(clean);
  const raw = parts.get(PARAM);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(base64UrlToUtf8(raw)) as Partial<PortfolioConfig>;
    return mergeWithPreset(templateId, parsed);
  } catch {
    return null;
  }
}
