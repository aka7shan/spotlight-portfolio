import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from 'lucide-react';

interface ContactItem {
  Icon: LucideIcon;
  value: string;
  href?: string;
  color?: string;
}

interface ContactInfoProps {
  items: ContactItem[];
  variant?: 'classic' | 'modern' | 'creative' | 'corporate' | 'minimalist';
  delay?: number;
}

export function ContactInfo({ items, variant = 'classic', delay = 0 }: ContactInfoProps) {
  const getVariantStyles = (item: ContactItem, index: number) => {
    switch (variant) {
      case 'modern':
        return {
          container: "flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg px-4 py-2 transition-all duration-300 group",
          icon: "w-4 h-4 text-cyan-400 group-hover:text-cyan-300",
          text: "text-sm text-gray-300 group-hover:text-white"
        };
      case 'creative':
        return {
          container: "group cursor-pointer",
          icon: "w-5 h-5 text-white",
          text: ""
        };
      case 'corporate':
        return {
          container: "flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group shadow-sm hover:shadow-md",
          icon: "w-5 h-5 text-white",
          text: "text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium"
        };
      case 'minimalist':
        return {
          container: "flex items-center gap-4 text-gray-600 hover:text-gray-900 transition-colors duration-300 group",
          icon: "w-4 h-4",
          text: "font-light"
        };
      default: // classic
        return {
          container: "flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-100 hover:border-amber-200 transition-all duration-300 group shadow-sm hover:shadow-md",
          icon: "w-5 h-5 text-white",
          text: "text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium"
        };
    }
  };

  if (variant === 'creative') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex flex-wrap gap-4"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="group cursor-pointer"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <item.Icon className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-4"
    >
      {items.filter(item => item.value).map((item, index) => {
        const styles = getVariantStyles(item, index);
        
        return (
          <motion.a
            key={index}
            href={item.href || "#"}
            whileHover={{ x: variant === 'minimalist' ? 10 : variant === 'classic' || variant === 'corporate' ? 10 : 5, scale: variant === 'corporate' ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={styles.container}
          >
            {variant === 'corporate' || variant === 'classic' ? (
              <>
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                  <item.Icon className={styles.icon} />
                </div>
                <div className="flex-1">
                  <span className={styles.text}>
                    {item.value}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </>
            ) : (
              <>
                <item.Icon className={styles.icon} />
                <span className={styles.text}>{item.value}</span>
                {variant === 'minimalist' && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
              </>
            )}
          </motion.a>
        );
      })}
    </motion.div>
  );
}