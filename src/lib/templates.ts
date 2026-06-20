/**
 * Display names for the public-portfolio templates, keyed by the id
 * stored on `user.activeTemplate`.
 *
 * Mirrors the render-time switch in `PublicPortfolioPage` (and the route
 * default in `App.tsx`): an unset or unknown id resolves to `classic`,
 * because that's the template the public `/p/:code` page actually falls
 * back to. Keeping this map here gives the profile UI a single source for
 * the human-readable name without importing the heavier gallery/viewer
 * template arrays (which also carry icons, images, copy, etc.).
 */
export const DEFAULT_TEMPLATE_ID = "classic";

export const TEMPLATE_NAMES: Record<string, string> = {
  "modern-tech": "Modern Tech",
  creative: "Creative Studio",
  minimalist: "Minimalist Pro",
  corporate: "Corporate Elite",
  classic: "Classic Portfolio",
};

/**
 * Resolve a template id to its display name. Falls back to the default
 * template's name for unset/unknown ids so the label always matches what
 * the public page would render.
 */
export function getTemplateName(id?: string | null): string {
  if (id && TEMPLATE_NAMES[id]) return TEMPLATE_NAMES[id];
  return TEMPLATE_NAMES[DEFAULT_TEMPLATE_ID];
}
