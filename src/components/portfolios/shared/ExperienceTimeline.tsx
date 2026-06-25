import { motion } from "framer-motion";
import { Building, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { cn } from "../../ui/utils";
import { formatDateRange } from "../../../utils/formatDate";
import type { Experience } from "../../../types/portfolio";
import styles from "./ExperienceTimeline.module.css";

export interface ExperienceTheme {
  line: string;
  nodeGradient: string;
  card: string;
  position: string;
  company: string;
  badge: string;
  description: string;
  layout: "left" | "alternating";
  /**
   * Explicit border colour for the alternating-layout node ring. Provide this
   * when `line` is a CSS-variable class (e.g. `bg-[var(--pf-accent)]`) because
   * the automatic `bg-` -> `border-` swap would produce an ambiguous arbitrary
   * value Tailwind can't classify as a colour.
   */
  nodeBorder?: string;
}

interface ExperienceTimelineProps {
  items: Experience[];
  theme: ExperienceTheme;
}

export function ExperienceTimeline({ items, theme }: ExperienceTimelineProps) {
  // Safety net: callers should render an EmptyState, but never draw a lone
  // timeline line with no entries.
  if (!items?.length) return null;

  // `theme.line` is a bg-* class (sometimes a gradient). Derive a matching
  // border colour for the node ring; fall back to neutral for gradients.
  // An explicit `nodeBorder` wins (needed for CSS-variable accent classes).
  const nodeBorder =
    theme.nodeBorder ??
    (theme.line.includes("gradient")
      ? "border-gray-300"
      : theme.line.replace("bg-", "border-"));

  if (theme.layout === "alternating") {
    return (
      <div className="relative space-y-8 md:space-y-12">
        {/* Spine: left on mobile, centre on md+ */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-0.5 left-4 md:left-1/2 md:-translate-x-1/2",
            theme.line,
          )}
        />
        {items.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cn(
                "relative flex md:items-center pl-12 md:pl-0",
                isLeft ? "md:justify-start md:pr-[calc(50%+2rem)]" : "md:justify-end md:pl-[calc(50%+2rem)]",
              )}
            >
              <div
                className={cn(
                  "absolute w-5 h-5 rounded-full border-4 bg-white shadow-lg z-10",
                  "left-4 -translate-x-1/2 top-6 md:left-1/2 md:top-1/2 md:-translate-y-1/2",
                  nodeBorder,
                )}
              />
              <motion.div whileHover={{ scale: 1.02, y: -4 }} className="w-full md:max-w-md group">
                <Card className={theme.card}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shrink-0", theme.nodeGradient)}>
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className={cn("text-lg", theme.position)}>{exp.position}</CardTitle>
                        <p className={theme.company}>{exp.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("w-fit", theme.badge)}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className={theme.description}>{exp.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      <div className={cn(styles.timelineLine, theme.line)} />
      {items.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={styles.item}
        >
          <div className={cn(styles.nodeIcon, "bg-gradient-to-r shrink-0", theme.nodeGradient)}>
            <Building className={styles.nodeIconInner} />
          </div>
          <motion.div whileHover={{ x: 5 }} className={styles.cardWrapper}>
            <Card className={theme.card}>
              <CardContent className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div className="min-w-0">
                    <h3 className={cn(styles.position, theme.position)}>{exp.position}</h3>
                    <p className={theme.company}>{exp.company}</p>
                  </div>
                  <Badge className={cn("w-fit", theme.badge)}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                  </Badge>
                </div>
                <p className={cn(styles.description, theme.description)}>{exp.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
