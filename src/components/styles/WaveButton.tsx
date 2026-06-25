import { useState } from "react";
import { motion } from "framer-motion";

/**
 * WaveButton
 * ----------
 * On hover, three coloured circles rise up through the button like a wave,
 * each scaling in with a slight stagger so the colours wash over one another.
 * The label cross-fades from its default colour to the hover colour as the
 * wave covers it. On press the front wave darkens to the pressed colour.
 */
export interface WaveButtonProps {
  text?: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  pressedColor?: string;
  waveColors?: [string, string, string];
  className?: string;
}

export function WaveButton({
  text = "Click Me",
  href = "#",
  bgColor = "#004643",
  textColor = "#ffffff",
  hoverTextColor = "#ffffff",
  pressedColor = "#001e1d",
  waveColors = ["#abd1c6", "#f9bc60", "#e16162"],
  className,
}: WaveButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const ease = [0.12, 0.23, 0.09, 0.99] as const;
  const circle =
    "pointer-events-none absolute left-1/2 aspect-square w-[280%] -translate-x-1/2 rounded-full";

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[32px] text-xl font-semibold no-underline shadow-lg ${className ?? ""}`}
      style={{ background: bgColor, padding: "12px 28px" }}
    >
      {/* Rising wave layers (back → front) */}
      <motion.span
        className={circle}
        style={{ background: waveColors[0], bottom: "-260%" }}
        initial={false}
        animate={{ scale: hovered ? 1 : 0.04 }}
        transition={{ duration: 1, ease }}
      />
      <motion.span
        className={circle}
        style={{ background: waveColors[1], bottom: "-260%" }}
        initial={false}
        animate={{ scale: hovered ? 1 : 0.04 }}
        transition={{ duration: 1, ease, delay: 0.08 }}
      />
      <motion.span
        className={circle}
        style={{ background: pressed ? pressedColor : waveColors[2], bottom: "-260%" }}
        initial={false}
        animate={{ scale: hovered ? 1 : 0.04 }}
        transition={{ duration: 1, ease, delay: 0.16 }}
      />

      {/* Label: default + hover colour cross-fade */}
      <span className="relative grid">
        <motion.span
          className="col-start-1 row-start-1"
          style={{ color: textColor }}
          animate={{ opacity: hovered ? 0 : 1, y: hovered ? -6 : 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {text}
        </motion.span>
        <motion.span
          className="col-start-1 row-start-1"
          style={{ color: hoverTextColor }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.3, ease }}
        >
          {text}
        </motion.span>
      </span>
    </a>
  );
}
