import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/card";
import type { LucideIcon } from "lucide-react";

interface SkillCardProps {
  skill: string;
  index: number;
  icon?: LucideIcon;
  colorClass?: string;
  hoveredSkill?: number | null;
  setHoveredSkill?: (index: number | null) => void;
  variant?: 'classic' | 'modern' | 'creative' | 'corporate' | 'minimalist';
}

export function SkillCard({ 
  skill, 
  index, 
  icon: Icon, 
  colorClass,
  hoveredSkill,
  setHoveredSkill,
  variant = 'classic'
}: SkillCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'modern':
        return {
          card: "bg-gray-800/50 border-gray-700 hover:border-gray-600",
          icon: "bg-gray-900/50 group-hover:bg-gray-900/80",
          text: "text-gray-300 group-hover:text-white"
        };
      case 'creative':
        return {
          card: "bg-gray-900/50 border-0 hover:bg-gray-800/50",
          icon: colorClass || "bg-gradient-to-r from-pink-500 to-purple-500",
          text: "text-white"
        };
      case 'corporate':
        return {
          card: "hover:shadow-xl border-gray-100",
          icon: "bg-gradient-to-r from-blue-500 to-purple-500",
          text: "text-gray-900"
        };
      case 'minimalist':
        return {
          card: "border-0 shadow-none bg-transparent group-hover:bg-gray-50",
          icon: "bg-gray-100 group-hover:bg-gray-900",
          text: "text-gray-900 group-hover:text-gray-900"
        };
      default: // classic
        return {
          card: "bg-white/80 backdrop-blur-sm border-amber-100 hover:border-amber-200 hover:shadow-xl",
          icon: colorClass || "bg-gradient-to-r from-amber-400 to-orange-400",
          text: "text-gray-900 group-hover:text-amber-700"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: variant === 'classic' ? -5 : 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        rotate: variant === 'creative' ? [0, -10, 10, 0] : variant === 'classic' ? 2 : 0,
        y: -5
      }}
      onHoverStart={() => setHoveredSkill?.(index)}
      onHoverEnd={() => setHoveredSkill?.(null)}
      className="group cursor-default"
    >
      <Card className={`h-full ${styles.card} transition-all duration-300`}>
        <CardContent className="p-6 text-center">
          <motion.div
            animate={{ 
              scale: hoveredSkill === index ? 1.2 : 1,
              rotate: hoveredSkill === index ? (variant === 'classic' ? 15 : variant === 'modern' ? 360 : 0) : 0
            }}
            transition={{ duration: variant === 'modern' ? 0.5 : 0.2 }}
            className={`w-16 h-16 ${styles.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            {Icon && <Icon className="w-8 h-8 text-white" />}
          </motion.div>
          <h3 className={`font-semibold ${styles.text} transition-colors duration-300`}>
            {skill}
          </h3>
          {variant === 'classic' && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: hoveredSkill === index ? "100%" : "60%" }}
              transition={{ duration: 0.3 }}
              className="h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto mt-3"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}