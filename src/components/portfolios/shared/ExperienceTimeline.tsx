import { motion } from "framer-motion";
import { Building, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
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
}

interface ExperienceTimelineProps {
  items: Experience[];
  theme: ExperienceTheme;
}

export function ExperienceTimeline({ items, theme }: ExperienceTimelineProps) {
  if (theme.layout === "alternating") {
    return (
      <div className="relative space-y-12">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5">
          <div className={`w-full h-full ${theme.line}`} />
        </div>
        {items.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative flex items-center ${
              index % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8"
            }`}
          >
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 rounded-full shadow-lg z-10 ${theme.line.replace("bg-", "border-")}`} />
            <motion.div whileHover={{ scale: 1.02, y: -5 }} className="w-full max-w-md group">
              <Card className={theme.card}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme.nodeGradient} rounded-xl flex items-center justify-center`}>
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg ${theme.position}`}>{exp.position}</CardTitle>
                      <p className={theme.company}>{exp.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={theme.badge}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className={theme.description}>{exp.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      <div className={`${styles.timelineLine} ${theme.line}`} />
      {items.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className={styles.item}
        >
          <div className={`${styles.nodeIcon} bg-gradient-to-r ${theme.nodeGradient}`}>
            <Building className={styles.nodeIconInner} />
          </div>
          <motion.div whileHover={{ x: 5 }} className={styles.cardWrapper}>
            <Card className={theme.card}>
              <CardContent className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={`${styles.position} ${theme.position}`}>{exp.position}</h3>
                    <p className={theme.company}>{exp.company}</p>
                  </div>
                  <Badge className={theme.badge}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                  </Badge>
                </div>
                <p className={`${styles.description} ${theme.description}`}>{exp.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
