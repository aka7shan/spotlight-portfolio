import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface Stat {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface StatsSectionStyles {
  statsIconCircle?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  styles: StatsSectionStyles;
}

export function StatsSection({ stats, styles }: StatsSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/50 dark:to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className={styles.statsIconCircle}>
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
