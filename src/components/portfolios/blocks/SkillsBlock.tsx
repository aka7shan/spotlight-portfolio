import { motion } from "framer-motion";
import { Code, Server, Database, Activity } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { cn } from "../../ui/utils";
import { SectionHeader } from "../shared/SectionHeader";
import { categorizeSkills } from "../shared/portfolioHelpers";
import { buildHeaderTheme } from "./theme";
import type { BlockComponent } from "./types";

const ICONS = [Code, Server, Database, Activity];

const Grouped: BlockComponent = ({ data, theme, title }) => {
  const groups = categorizeSkills(data.skills);
  return (
    <div className="space-y-10">
      <SectionHeader title={title ?? "Skills"} {...buildHeaderTheme(theme)} />
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((group, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Card key={group.name} className={cn(theme.surface, theme.surfaceBorder)}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", theme.accentSoftBg)}>
                    <Icon className={cn("w-5 h-5", theme.accentText)} />
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-bold", theme.headingText)}>{group.name}</h3>
                    <p className={cn("text-sm", theme.mutedText)}>{group.skills.length} skills</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s) => (
                    <Badge key={s} variant="outline" className={cn(theme.surfaceBorder, theme.mutedText, theme.mutedSurface)}>{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const Cloud: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Skills"} {...buildHeaderTheme(theme)} />
    <div className="flex flex-wrap justify-center gap-3">
      {data.skills.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.08, y: -2 }}>
          <Badge className={cn("bg-gradient-to-r text-white border-0 px-4 py-2 text-sm", theme.accentGradient)}>{s}</Badge>
        </motion.div>
      ))}
    </div>
  </div>
);

export const skillsVariants: Record<string, BlockComponent> = {
  grouped: Grouped,
  cloud: Cloud,
};
