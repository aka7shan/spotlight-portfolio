import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * ScrollZoomReveal
 * ----------------
 * A sticky "showreel" section. As the tall outer section scrolls past, a small
 * rounded card grows to fill the viewport while its corner radius melts to 0.
 * Side labels frame the card and a centred call-to-action fades up once the
 * image is roughly full-bleed. Width/height/radius are spring-eased off scroll
 * progress so the zoom glides instead of tracking the wheel 1:1.
 *
 * Because the effect needs real scroll distance, render it on a page (or a
 * scroll container) rather than a short fixed box.
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
  scrollVh = 320,
  className,
}: ScrollZoomRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const spring = { stiffness: 90, damping: 25, mass: 0.6 } as const;
  const width = useSpring(useTransform(scrollYProgress, [0, 1], ["16vw", "100vw"]), spring);
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ["12vh", "100vh"]), spring);
  const radius = useSpring(useTransform(scrollYProgress, [0, 1], [44, 0]), spring);

  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.62], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.45, 0.62], [50, 0]);

  return (
    <section ref={ref} className={`relative ${className ?? ""}`} style={{ height: `${scrollVh}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center gap-5 overflow-hidden px-5">
        <span
          className="hidden shrink-0 whitespace-nowrap text-right text-4xl font-medium md:block lg:text-5xl"
          style={{ color: textColor, width: 220 }}
        >
          {leftText}
        </span>

        <motion.div className="relative shrink-0 overflow-hidden" style={{ width, height, borderRadius: radius }}>
          <img
            src={image}
            alt="Showreel"
            className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <motion.a
            href={buttonLink}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap text-3xl font-medium no-underline lg:text-5xl"
            style={{ color: buttonTextColor, opacity: ctaOpacity, y: ctaY }}
          >
            {buttonText}
            <CtaIcon icon={icon} bg={buttonBgColor} fg={buttonTextColor} />
          </motion.a>
        </motion.div>

        <span
          className="hidden shrink-0 whitespace-nowrap text-left text-4xl font-medium md:block lg:text-5xl"
          style={{ color: textColor, width: 220 }}
        >
          {rightText}
        </span>
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
