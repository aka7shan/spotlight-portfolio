import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ScrollZoomReveal
 * ----------------
 * A sticky "showreel" section. As the tall outer section scrolls past, a small
 * rounded card grows to fill the viewport while its corner radius melts to 0.
 * Side labels frame the card and a centred call-to-action fades up once the
 * image is near full-bleed.
 *
 * The growing card is absolutely centred (out of flow) so expanding it never
 * pushes the side labels around, and width/height/radius are linked directly to
 * scroll progress (no spring) so the zoom tracks the wheel exactly — no
 * overshoot, lag or jitter.
 */
export interface ScrollZoomRevealProps {
  image: string;
  leftText?: string;
  rightText?: string;
  buttonText?: string;
  buttonLink?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  icon?: "play" | "arrow" | "none";
  /** Scroll length as a multiple of viewport height. */
  scrollVh?: number;
  className?: string;
}

export function ScrollZoomReveal({
  image,
  leftText = "©2026",
  rightText = "Showreel",
  buttonText = "Play showreel",
  buttonLink = "#",
  textColor = "#111111",
  buttonBgColor = "#111111",
  buttonTextColor = "#ffffff",
  icon = "play",
  scrollVh = 300,
  className,
}: ScrollZoomRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Direct, scroll-linked values (no spring) keep the zoom rock-steady.
  const width = useTransform(scrollYProgress, [0, 1], ["18vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 1], ["14vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);

  return (
    <section ref={ref} className={`relative ${className ?? ""}`} style={{ height: `${scrollVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Side labels — absolutely placed so the growing card never moves them. */}
        <span
          className="absolute left-[6vw] top-1/2 z-[1] hidden -translate-y-1/2 whitespace-nowrap text-4xl font-medium md:block lg:text-5xl"
          style={{ color: textColor }}
        >
          {leftText}
        </span>
        <span
          className="absolute right-[6vw] top-1/2 z-[1] hidden -translate-y-1/2 whitespace-nowrap text-4xl font-medium md:block lg:text-5xl"
          style={{ color: textColor }}
        >
          {rightText}
        </span>

        {/* Growing card, centred and out of flow. */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-[2] overflow-hidden"
          style={{ width, height, borderRadius: radius, x: "-50%", y: "-50%" }}
        >
          <img
            src={image}
            alt="Showreel"
            className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <motion.a
            href={buttonLink}
            className="absolute left-1/2 top-1/2 flex items-center gap-3 whitespace-nowrap text-3xl font-medium no-underline lg:text-5xl"
            style={{ x: "-50%", y: "-50%", color: buttonTextColor, opacity: ctaOpacity, translateY: ctaY }}
          >
            {buttonText}
            <CtaIcon icon={icon} bg={buttonBgColor} fg={buttonTextColor} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function CtaIcon({ icon, bg, fg }: { icon: "play" | "arrow" | "none"; bg: string; fg: string }) {
  if (icon === "none") return null;
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full lg:h-16 lg:w-16"
      style={{ background: bg }}
    >
      {icon === "play" ? (
        <span
          className="relative left-0.5"
          style={{ borderStyle: "solid", borderWidth: "9px 0 9px 16px", borderColor: `transparent transparent transparent ${fg}` }}
        />
      ) : (
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke={fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
