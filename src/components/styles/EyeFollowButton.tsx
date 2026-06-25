import { useEffect, useRef } from "react";

/**
 * EyeFollowButton
 * ---------------
 * A pill button with a pair of googly eyes whose pupils track the cursor. Each
 * frame the pupil is offset toward the global pointer, clamped to the eye's
 * radius, so the pair appears to "look" at the mouse. Pupils are positioned by
 * mutating refs directly inside a rAF loop — no React re-renders while moving.
 */
export interface EyeFollowButtonProps {
  text?: string;
  href?: string;
  buttonColor?: string;
  textColor?: string;
  eyeColor?: string;
  pupilColor?: string;
  eyeSize?: number;
  pupilSize?: number;
  className?: string;
}

export function EyeFollowButton({
  text = "Get in touch",
  href = "#",
  buttonColor = "#111111",
  textColor = "#ffffff",
  eyeColor = "#ffffff",
  pupilColor = "#111111",
  eyeSize = 40,
  pupilSize = 14,
  className,
}: EyeFollowButtonProps) {
  const eye1 = useRef<HTMLDivElement>(null);
  const eye2 = useRef<HTMLDivElement>(null);
  const pupil1 = useRef<HTMLDivElement>(null);
  const pupil2 = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const maxOffset = (eyeSize - pupilSize) / 2 - 2;
    const place = (eye: HTMLDivElement | null, pupil: HTMLDivElement | null) => {
      if (!eye || !pupil) return;
      const r = eye.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = pointer.current.x - cx;
      const dy = pointer.current.y - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(maxOffset, Math.hypot(dx, dy));
      pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    };
    const tick = () => {
      place(eye1.current, pupil1.current);
      place(eye2.current, pupil2.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [eyeSize, pupilSize]);

  const eyeStyle = { width: eyeSize, height: eyeSize, background: eyeColor } as const;
  const pupilStyle = { width: pupilSize, height: pupilSize, background: pupilColor } as const;

  return (
    <a
      href={href}
      className={`inline-flex select-none items-center gap-3 rounded-full no-underline shadow-lg transition-transform active:scale-95 ${className ?? ""}`}
      style={{ background: buttonColor, color: textColor, padding: "6px 6px 6px 20px" }}
    >
      <span className="text-base font-bold tracking-tight">{text}</span>
      <span className="flex items-center gap-1">
        <span ref={eye1} className="relative grid place-items-center rounded-full" style={eyeStyle}>
          <span ref={pupil1} className="rounded-full will-change-transform" style={pupilStyle} />
        </span>
        <span ref={eye2} className="relative grid place-items-center rounded-full" style={eyeStyle}>
          <span ref={pupil2} className="rounded-full will-change-transform" style={pupilStyle} />
        </span>
      </span>
    </a>
  );
}
