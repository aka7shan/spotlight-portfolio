import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import {
  Code,
  Palette,
  Briefcase,
  Building,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioProps } from "../../types/portfolio";
import { TEMPLATE_NAMES, DEFAULT_TEMPLATE_ID } from "../../lib/templates";

/**
 * SINGLE SOURCE OF TRUTH for portfolio templates.
 *
 * Before this file the id -> component mapping was duplicated as a `switch`
 * in both `PortfolioViewer` and `PublicPortfolioPage`, and the display
 * metadata (name/category/icon) was duplicated again in the viewer and the
 * gallery. Adding or renaming a template meant editing 3-4 files and hoping
 * they stayed in sync.
 *
 * Now: register a template here once. Components are still `React.lazy` so
 * we keep code-splitting (each template is its own chunk, loaded on demand).
 * Human-readable names continue to live in `lib/templates.ts` so the
 * lightweight profile UI can label the active template without importing
 * this heavier module.
 */

type TemplateComponent = LazyExoticComponent<ComponentType<PortfolioProps>>;

const ClassicPortfolio: TemplateComponent = lazy(() =>
  import("./ClassicPortfolio").then((m) => ({ default: m.ClassicPortfolio })),
);
const ModernTechPortfolio: TemplateComponent = lazy(() =>
  import("./ModernTechPortfolio").then((m) => ({ default: m.ModernTechPortfolio })),
);
const CreativePortfolio: TemplateComponent = lazy(() =>
  import("./CreativePortfolio").then((m) => ({ default: m.CreativePortfolio })),
);
const MinimalistPortfolio: TemplateComponent = lazy(() =>
  import("./MinimalistPortfolio").then((m) => ({ default: m.MinimalistPortfolio })),
);
const CorporatePortfolio: TemplateComponent = lazy(() =>
  import("./CorporatePortfolio").then((m) => ({ default: m.CorporatePortfolio })),
);

export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  Component: TemplateComponent;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern-tech",
    name: TEMPLATE_NAMES["modern-tech"],
    category: "Technology",
    description: "Perfect for developers and tech professionals",
    icon: Code,
    Component: ModernTechPortfolio,
  },
  {
    id: "creative",
    name: TEMPLATE_NAMES.creative,
    category: "Creative",
    description: "Showcase your creative work with style",
    icon: Palette,
    Component: CreativePortfolio,
  },
  {
    id: "minimalist",
    name: TEMPLATE_NAMES.minimalist,
    category: "Professional",
    description: "Clean and professional design",
    icon: Briefcase,
    Component: MinimalistPortfolio,
  },
  {
    id: "corporate",
    name: TEMPLATE_NAMES.corporate,
    category: "Business",
    description: "Professional template for business",
    icon: Building,
    Component: CorporatePortfolio,
  },
  {
    id: "classic",
    name: TEMPLATE_NAMES.classic,
    category: "Traditional",
    description: "Timeless design that never goes out of style",
    icon: Users,
    Component: ClassicPortfolio,
  },
];

export { DEFAULT_TEMPLATE_ID };

// The block renderer is driven by a PortfolioConfig preset per template id.
// Re-exported here so callers have one import for "everything about a template".
export { getPreset } from "./config/presets";

/**
 * Resolve a template id to its full metadata. Unknown / unset ids fall back
 * to the default template so the render never breaks on bad data.
 */
export function getTemplate(id?: string | null): TemplateMeta {
  const match = id ? TEMPLATES.find((t) => t.id === id) : undefined;
  if (match) return match;
  // Non-null assertion is safe: the default template is always registered.
  return TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;
}

/** Convenience: just the lazy component for an id (with default fallback). */
export function getTemplateComponent(id?: string | null): TemplateComponent {
  return getTemplate(id).Component;
}
