import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export interface FeaturesSectionStyles {
  featureCard?: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  styles: FeaturesSectionStyles;
}

export function FeaturesSection({ features, styles }: FeaturesSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Why Choose Spotlight?
          </Badge>
          <h2 className="mb-4">Everything you need to shine</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Create professional portfolios that showcase your work beautifully and help you stand out from the crowd.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className={styles.featureCard}>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
