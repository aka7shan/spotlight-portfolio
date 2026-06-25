import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { cn } from "../../ui/utils";
import { ImageWithFallback } from "../../common/ImageWithFallback";
import type { Project } from "../../../types/portfolio";
import styles from "./ProjectGrid.module.css";

export interface ProjectTheme {
  card: string;
  imageBg: string;
  title: string;
  /**
   * Full hover utility for the title, e.g. "group-hover:text-amber-700".
   * Must be a complete, literal class string (NOT a bare colour) so Tailwind
   * can see it — interpolating `group-hover:${x}` silently produced no styles.
   */
  titleHover?: string;
  description: string;
  badge: string;
  cols?: string;
}

interface ProjectGridProps {
  items: Project[];
  theme: ProjectTheme;
}

export function ProjectGrid({ items, theme }: ProjectGridProps) {
  if (!items?.length) return null;

  return (
    <div className={theme.cols || styles.gridWrap}>
      {items.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <Card className={cn(theme.card, "overflow-hidden h-full")}>
            {project.image && (
              <div className={cn(styles.imageWrapper, theme.imageBg)}>
                <ImageWithFallback src={project.image} alt={project.name} className={styles.image} />
              </div>
            )}
            <CardContent className={styles.cardBody}>
              <div className={styles.titleRow}>
                <h3 className={cn(styles.title, theme.title, theme.titleHover)}>{project.name}</h3>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} source code`}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name}`}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <p className={cn(styles.description, theme.description)}>{project.description}</p>
              {project.tags?.length > 0 && (
                <div className={styles.tags}>
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className={theme.badge}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
