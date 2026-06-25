import { motion } from "framer-motion";
import { ArrowRight, Folder } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { ImageWithFallback } from "../../common/ImageWithFallback";
import { SectionHeader } from "../shared/SectionHeader";
import { ProjectGrid } from "../shared/ProjectGrid";
import { buildHeaderTheme, buildProjectTheme } from "./theme";
import type { BlockComponent } from "./types";

const Grid: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Projects"} {...buildHeaderTheme(theme)} />
    <ProjectGrid items={data.projects} theme={buildProjectTheme(theme)} />
  </div>
);

const List: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Selected Work"} {...buildHeaderTheme(theme)} />
    <div className="space-y-16 md:space-y-24">
      {data.projects.map((project, index) => {
        const href = project.link || project.githubLink;
        return (
          <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group">
            <div className={cn("grid md:grid-cols-2 gap-8 md:gap-12 items-center", index % 2 === 1 ? "md:grid-flow-col-dense" : "")}>
              <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <span className={cn("text-sm", theme.mutedText)}>0{index + 1}</span>
                    <div className={cn("flex-1 h-px", theme.surfaceBorder, "border-t")} />
                  </div>
                  <h3 className={cn("text-2xl sm:text-3xl font-bold group-hover:text-[color:var(--pf-accent)] transition-colors", theme.headingText)}>{project.name}</h3>
                  <p className={cn("leading-relaxed text-lg", theme.mutedText)}>{project.description}</p>
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, ti) => (
                        <Badge key={ti} variant="outline" className={cn(theme.surfaceBorder, theme.mutedText)}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                  {href && (
                    <Button asChild variant="ghost" className={cn("p-0 h-auto", theme.accentText)}>
                      <a href={href} target="_blank" rel="noopener noreferrer">View Project<ArrowRight className="w-4 h-4 ml-2" /></a>
                    </Button>
                  )}
                </div>
              </div>
              <div className={index % 2 === 1 ? "md:col-start-1" : ""}>
                {project.image ? (
                  <motion.div whileHover={{ scale: 1.02 }} className={cn("aspect-video rounded-2xl overflow-hidden", theme.mutedSurface)}>
                    <ImageWithFallback src={project.image} alt={project.name} className="w-full h-full object-cover" />
                  </motion.div>
                ) : (
                  <div className={cn("aspect-video rounded-2xl flex items-center justify-center", theme.mutedSurface)}>
                    <Folder className={cn("w-16 h-16 opacity-40", theme.mutedText)} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export const projectsVariants: Record<string, BlockComponent> = {
  grid: Grid,
  list: List,
};
