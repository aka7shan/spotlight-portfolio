import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../ui/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  iconWrapClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * Honest, themeable empty state for a section with no data. Used everywhere a
 * template would otherwise render a broken/empty layout (an experience timeline
 * with no items, a skills grid with no skills, etc.).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  iconWrapClassName = "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6",
  iconClassName = "w-10 h-10 text-gray-400",
  titleClassName = "text-xl font-semibold text-gray-500 mb-2",
  descriptionClassName = "text-gray-400",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn("text-center py-16", className)}
    >
      <div className={cn(iconWrapClassName)}>
        <Icon className={cn(iconClassName)} />
      </div>
      <h3 className={cn(titleClassName)}>{title}</h3>
      {description && <p className={cn(descriptionClassName)}>{description}</p>}
    </motion.div>
  );
}
