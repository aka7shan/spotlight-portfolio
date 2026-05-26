import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ImageWithFallback } from "../../common/ImageWithFallback";
import type { Project } from "../../../types/portfolio";
import styles from "./ProjectGrid.module.css";

export interface ProjectTheme {
  card: string;
  imageBg: string;
  title: string;
  titleHover: string;
  description: string;
  badge: string;
  cols?: string;
}

interface ProjectGridProps {
  items: Project[];
  theme: ProjectTheme;
}

export function ProjectGrid({ items, theme }: ProjectGridProps) {
  return (
    <div className={theme.cols || styles.gridWrap}>
      {items.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ y: -10 }}
          className="group"
        >
          <Card className={`${theme.card} overflow-hidden h-full`}>
            {project.image && (
              <div className={`${styles.imageWrapper} ${theme.imageBg}`}>
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className={styles.image}
                />
              </div>
            )}
            <CardContent className={styles.cardBody}>
              <div className={styles.titleRow}>
                <h3 className={`${styles.title} ${theme.title} group-hover:${theme.titleHover}`}>
                  {project.name}
                </h3>
                <ExternalLink className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className={`${styles.description} ${theme.description}`}>
                {project.description}
              </p>
              <div className={styles.tags}>
                {project.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className={theme.badge}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
