import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleClass?: string;
  subtitleClass?: string;
  dividerClass?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  title,
  subtitle,
  titleClass = "text-3xl font-bold text-gray-900",
  subtitleClass = "text-gray-600 mt-2",
  dividerClass,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={align === "center" ? "text-center mb-12" : "mb-12"}
    >
      <h2 className={titleClass}>{title}</h2>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      {dividerClass && (
        <div className={`w-24 h-1 rounded-full mt-4 ${align === "center" ? "mx-auto" : ""} ${dividerClass}`} />
      )}
    </motion.div>
  );
}
