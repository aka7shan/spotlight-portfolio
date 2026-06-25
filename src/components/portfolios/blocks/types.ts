import type { FC } from "react";
import type { LucideIcon } from "lucide-react";
import type { PortfolioData } from "../../../types/portfolio";
import type { BlockType } from "../config/types";
import type { ResolvedTheme } from "./theme";

export interface BlockProps {
  data: PortfolioData;
  theme: ResolvedTheme;
  /** Section heading (falls back to the block's default title). */
  title?: string;
}

export type BlockComponent = FC<BlockProps>;

export interface BlockVariantMeta {
  id: string;
  label: string;
}

export interface BlockDef {
  type: BlockType;
  /** Human label for the builder + nav. */
  label: string;
  icon: LucideIcon;
  defaultTitle: string;
  variants: BlockVariantMeta[];
  /** Renderers keyed by variant id. */
  render: Record<string, BlockComponent>;
  /** True when the user's data has something to show for this block. */
  isAvailable: (data: PortfolioData) => boolean;
}
