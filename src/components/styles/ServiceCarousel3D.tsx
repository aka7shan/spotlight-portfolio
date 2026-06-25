import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * ServiceCarousel3D
 * -----------------
 * Service cards mounted on the faces of a rotating cylinder. Each card sits at
 * an even angular interval and is pushed out along Z, so rotating the cylinder
 * brings each face to the front in turn. Auto-rotates with a spring, pauses on
 * hover, and can be driven with the arrows or dots.
 */
export interface ServiceCard {
  title: string;
  description: string;
  tag?: string;
  ctaText?: string;
  ctaUrl?: string;
  accentColor: string;
  image?: string;
}

export interface ServiceCarousel3DProps {
  cards?: ServiceCard[];
  depth?: number;
  autoPlayMs?: number;
  backgroundColor?: string;
  className?: string;
}

const DEFAULT_CARDS: ServiceCard[] = [
  { title: "Brand design", description: "Memorable identities that resonate with your audience.", tag: "Popular", accentColor: "#6366f1", image: SAMPLE_PHOTOS[0] },
  { title: "Web development", description: "High-performance sites built with modern frameworks.", accentColor: "#3b82f6", image: SAMPLE_PHOTOS[1] },
  { title: "SEO strategy", description: "Data-driven optimisation that drives organic growth.", accentColor: "#10b981", image: SAMPLE_PHOTOS[2] },
  { title: "Motion design", description: "Captivating animation and micro-interactions.", tag: "New", accentColor: "#f59e0b", image: SAMPLE_PHOTOS[3] },
  { title: "Digital strategy", description: "Roadmaps aligning business goals with execution.", accentColor: "#ec4899", image: SAMPLE_PHOTOS[4] },
  { title: "CMS solutions", description: "Flexible content management for editorial teams.", accentColor: "#8b5cf6", image: SAMPLE_PHOTOS[0] },
  { title: "Analytics & data", description: "Actionable insight from advanced reporting.", accentColor: "#14b8a6", image: SAMPLE_PHOTOS[1] },
  { title: "Creative branding", description: "Full-spectrum brand experiences end to end.", tag: "Premium", accentColor: "#f43f5e", image: SAMPLE_PHOTOS[2] },
];

export function ServiceCarousel3D({
  cards = DEFAULT_CARDS,
  depth = 400,
  autoPlayMs = 4000,
  backgroundColor = "#06060f",
  className,
}: ServiceCarousel3DProps) {
  const total = Math.min(cards.length, 8);
  const anglePerCard = 360 / total;
  const [active, setActive] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || autoPlayMs <= 0) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % total);
      setRotation((r) => r - anglePerCard);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [paused, autoPlayMs, total, anglePerCard]);

  const goPrev = () => {
    setActive((p) => (p - 1 + total) % total);
    setRotation((r) => r + anglePerCard);
  };
  const goNext = () => {
    setActive((p) => (p + 1) % total);
    setRotation((r) => r - anglePerCard);
  };
  const goTo = (target: number) => {
    setActive((prev) => {
      let diff = target - prev;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      setRotation((r) => r - diff * anglePerCard);
      return target;
    });
  };

  return (
    <div
      className={`relative flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ background: backgroundColor }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="relative w-full max-w-[1100px]">
        <div className="relative h-[480px] w-full" style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}>
          <motion.div
            animate={{ rotateY: rotation }}
            transition={{ type: "spring", stiffness: 45, damping: 16, mass: 1.2 }}
            className="absolute left-1/2 top-1/2"
            style={{ width: 300, height: 440, marginLeft: -150, marginTop: -220, transformStyle: "preserve-3d" }}
          >
            {cards.slice(0, total).map((card, i) => (
              <div
                key={i}
                className="absolute left-0 top-0 h-[440px] w-[300px]"
                style={{ transform: `rotateY(${i * anglePerCard}deg) translateZ(${depth}px)`, backfaceVisibility: "hidden" }}
              >
                <ServiceFace card={card} />
              </div>
            ))}
          </motion.div>

          <NavButton dir="left" onClick={goPrev} />
          <NavButton dir="right" onClick={goNext} />
        </div>

        <div className="relative z-10 mt-5 flex justify-center gap-2">
          {cards.slice(0, total).map((card, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${card.title}`}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === active ? 24 : 8, background: i === active ? card.accentColor : "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceFace({ card }: { card: ServiceCard }) {
  return (
    <div
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0a0a14]/85 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-3"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <div className="relative min-h-[180px] flex-1 overflow-hidden">
        {card.image ? (
          <img src={card.image} alt={card.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center" style={{ background: `linear-gradient(135deg, ${card.accentColor}40, transparent)` }}>
            <span style={{ color: card.accentColor }} className="text-2xl">✦</span>
          </div>
        )}
        {card.tag && (
          <span className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white" style={{ background: `${card.accentColor}dd` }}>
            {card.tag}
          </span>
        )}
      </div>
      <div className="flex flex-col p-5">
        <h3 className="mb-1.5 text-lg font-bold tracking-tight text-white">{card.title}</h3>
        <p className="text-[13px] leading-relaxed text-white/50">{card.description}</p>
        {card.ctaText && (
          <a href={card.ctaUrl ?? "#"} className="mt-3.5 text-[13px] font-semibold no-underline opacity-70 transition-opacity group-hover:opacity-100" style={{ color: card.accentColor }}>
            {card.ctaText}
          </a>
        )}
      </div>
    </div>
  );
}

function NavButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Previous" : "Next"}
      onClick={onClick}
      className="absolute top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white backdrop-blur-md transition-colors hover:bg-white/15"
      style={{ [dir]: 12 }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
