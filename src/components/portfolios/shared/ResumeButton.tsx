import { Download } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { getResumeHref } from "./portfolioHelpers";
import type { PortfolioData } from "../../../types/portfolio";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive";

interface ResumeButtonProps {
  data: PortfolioData;
  label?: string;
  className?: string;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg";
}

/**
 * Download button wired to the user's actual uploaded CV. Renders nothing when
 * there's no CV — replaces the dead "Download Resume" buttons that every
 * template shipped regardless of whether a file existed.
 */
export function ResumeButton({
  data,
  label = "Download Resume",
  className,
  variant = "outline",
  size = "default",
}: ResumeButtonProps) {
  const href = getResumeHref(data);
  if (!href) return null;

  const fileName = data.cv?.fileName;

  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" download={fileName}>
        <Download className="w-4 h-4 mr-2" />
        {label}
      </a>
    </Button>
  );
}
