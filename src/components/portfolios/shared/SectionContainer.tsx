import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface SectionContainerProps {
  activeSection: string;
  children: ReactNode;
  className?: string;
}

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function SectionContainer({ activeSection, children, className = "" }: SectionContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
