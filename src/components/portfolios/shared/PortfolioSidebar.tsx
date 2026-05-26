import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import styles from "./PortfolioSidebar.module.css";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarTheme {
  bg: string;
  border: string;
  logoGradient: string;
  logoText: string;
  activeClass: string;
  inactiveClass: string;
  footerText: string;
}

interface PortfolioSidebarProps {
  items: SidebarItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  theme: SidebarTheme;
  title?: string;
}

export function PortfolioSidebar({
  items,
  activeSection,
  onSectionChange,
  theme,
  title = "Portfolio",
}: PortfolioSidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${theme.bg} ${theme.border}`}>
      <div className={`${styles.logo} ${theme.border}`}>
        <h1 className={`${styles.logoText} bg-gradient-to-r ${theme.logoGradient} bg-clip-text text-transparent`}>
          {title}
        </h1>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navList}>
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${styles.navButton} ${
                activeSection === item.id ? theme.activeClass : theme.inactiveClass
              }`}
            >
              <item.icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      <div className={`${styles.footer} ${theme.border}`}>
        <p className={`${styles.footerText} ${theme.footerText}`}>
          Built with Spotlight
        </p>
      </div>
    </aside>
  );
}
