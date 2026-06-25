import { motion } from "framer-motion";
import { cn } from "../../ui/utils";
import { getSocialLinks } from "./portfolioHelpers";
import type { SocialLinks as SocialLinksType } from "../../../types/portfolio";

interface SocialLinksProps {
  links?: SocialLinksType;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}

/**
 * Renders the user's real social links (opens in a new tab). Renders nothing
 * when no links are set — replaces the old hardcoded `href="#"` icons that
 * pointed nowhere.
 */
export function SocialLinks({
  links,
  className = "flex flex-wrap gap-3",
  itemClassName = "w-12 h-12 bg-gray-100 hover:bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-colors",
  iconClassName = "w-5 h-5",
}: SocialLinksProps) {
  const items = getSocialLinks(links);
  if (!items.length) return null;

  return (
    <div className={cn(className)}>
      {items.map(({ key, label, href, Icon }) => (
        <motion.a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(itemClassName)}
        >
          <Icon className={cn(iconClassName)} />
        </motion.a>
      ))}
    </div>
  );
}
