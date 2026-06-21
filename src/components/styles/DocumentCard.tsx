import { motion } from "framer-motion";
import { FileText } from "lucide-react";

/**
 * DocumentCard
 * ------------
 * A tactile "document" card with a folded top-right corner (dog-ear), a file
 * meta row and a hover lift. The dog-ear is drawn with a pair of clip-path
 * triangles so the fold catches light correctly. Two visual variants ship:
 * "paper" (light) and "ink" (dark).
 */
export interface DocumentCardProps {
  title?: string;
  fileType?: string;
  meta?: string;
  excerpt?: string;
  variant?: "paper" | "ink";
  className?: string;
  onClick?: () => void;
}

export function DocumentCard({
  title = "Brand Guidelines",
  fileType = "PDF",
  meta = "2.4 MB · Updated today",
  excerpt = "Logo usage, color tokens, typography scale and spacing rules for the 2026 identity refresh.",
  variant = "paper",
  className,
  onClick,
}: DocumentCardProps) {
  const ink = variant === "ink";
  const fold = 34;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative flex aspect-[4/5] w-full flex-col justify-between p-5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
        ink ? "bg-neutral-900 text-white" : "bg-white text-neutral-900"
      } ${className ?? ""}`}
      style={{ clipPath: `polygon(0 0, calc(100% - ${fold}px) 0, 100% ${fold}px, 100% 100%, 0 100%)`, borderRadius: 12 }}
    >
      {/* Folded corner highlight. */}
      <span
        className="pointer-events-none absolute right-0 top-0"
        style={{
          width: fold,
          height: fold,
          background: ink ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.08)",
          clipPath: `polygon(0 0, 100% 100%, 0 100%)`,
        }}
      />

      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            ink ? "bg-white/10 text-white" : "bg-neutral-900/5 text-neutral-700"
          }`}
        >
          <FileText className="h-5 w-5" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
            ink ? "bg-white/15 text-white" : "bg-neutral-900 text-white"
          }`}
        >
          {fileType}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        <p className={`line-clamp-3 text-xs leading-relaxed ${ink ? "text-white/60" : "text-neutral-500"}`}>{excerpt}</p>
        <p className={`pt-1 text-[11px] font-medium ${ink ? "text-white/40" : "text-neutral-400"}`}>{meta}</p>
      </div>

      {/* Hover underline accent. */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
          ink ? "bg-white" : "bg-neutral-900"
        }`}
      />
    </motion.button>
  );
}
