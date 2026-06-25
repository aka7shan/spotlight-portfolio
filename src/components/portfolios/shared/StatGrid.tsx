import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "../../ui/utils";
import type { PortfolioStat } from "./portfolioHelpers";

function CountUp({ value, suffix, className }: { value: number; suffix?: string; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}${suffix ?? ""}`);

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

interface StatGridProps {
  stats: PortfolioStat[];
  className?: string;
  itemClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  /** Cap how many stats are shown (default: all provided). */
  max?: number;
}

/**
 * Animated count-up grid of real stats. Renders nothing when there are no
 * stats, so an empty profile never shows a row of zeros or invented numbers.
 */
export function StatGrid({
  stats,
  className,
  itemClassName = "text-center",
  valueClassName = "text-4xl font-bold text-gray-900",
  labelClassName = "text-sm text-gray-600 uppercase tracking-wider mt-1",
  max,
}: StatGridProps) {
  const shown = typeof max === "number" ? stats.slice(0, max) : stats;
  if (!shown.length) return null;

  // Static class names only — Tailwind can't see interpolated class strings.
  const colsClass =
    shown.length >= 4
      ? "grid-cols-2 md:grid-cols-4"
      : shown.length === 3
        ? "grid-cols-3"
        : shown.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  return (
    <div className={cn("grid gap-6", colsClass, className)}>
      {shown.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className={cn(itemClassName)}
        >
          <CountUp value={stat.value} suffix={stat.suffix} className={cn(valueClassName)} />
          <div className={cn(labelClassName)}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
