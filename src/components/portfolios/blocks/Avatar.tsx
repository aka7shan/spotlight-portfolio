import { useEffect, useState } from "react";
import { cn } from "../../ui/utils";
import type { ResolvedTheme } from "./theme";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

interface PortfolioAvatarProps {
  name: string;
  src?: string;
  theme: ResolvedTheme;
  /** Sizing for the initials fallback text (e.g. "text-5xl"). */
  initialsClassName?: string;
  className?: string;
}

/**
 * Avatar that prefers the real uploaded photo but degrades gracefully: when
 * there's no `src` (or it fails to load) it renders the person's initials on
 * the accent gradient instead of a broken-image box showing alt text. Fills
 * its parent, which controls the size/shape (circle, rounded square, …).
 */
export function PortfolioAvatar({ name, src, theme, initialsClassName, className }: PortfolioAvatarProps) {
  const [failed, setFailed] = useState(false);
  const usable = !!src && src.trim() !== "" && !failed;

  // Reset the error state if the src changes (e.g. user uploads a new photo).
  useEffect(() => setFailed(false), [src]);

  if (usable) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={cn("w-full h-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center bg-gradient-to-br text-white font-bold select-none",
        theme.accentGradient,
        className,
      )}
      aria-label={name}
    >
      <span className={cn("leading-none", initialsClassName)}>{initialsOf(name)}</span>
    </div>
  );
}
