import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * DirectionalCursor
 * -----------------
 * A custom cursor that rotates to point in the direction of travel. Pointer
 * velocity is sampled on every move; its angle drives a spring-eased rotation,
 * and the anchor (translate origin) snaps to one of four edges so the arrow's
 * tip always leads the motion. The cursor also dips in scale while moving.
 *
 * Scoped by default: it only appears while the pointer is inside `children`,
 * and hides the native cursor for that region only — so it can be dropped into
 * a page without taking over the whole document.
 */
export interface DirectionalCursorProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}

const SPRING = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 } as const;

export function DirectionalCursor({ children, size = 1, color = "#111111", className }: DirectionalCursorProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  // Only reveal the cursor once it has a real position (after the first move),
  // otherwise it briefly parks in the top-left corner.
  const [visible, setVisible] = useState(false);

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const tx = useSpring("-50%", SPRING);
  const ty = useSpring("-50%", SPRING);
  const rotate = useSpring(0, { ...SPRING, damping: 60, stiffness: 300 });
  const baseScale = useSpring(1, { ...SPRING, stiffness: 500, damping: 35 });
  const scale = useTransform(baseScale, (v) => v * size);

  const last = useRef({ x: 0, y: 0, t: 0 });
  const prevAngle = useRef(0);
  const accumRotation = useRef(0);
  const idleTimer = useRef<number | null>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      if (!hasMoved.current) {
        // Seed the springs at the entry point so the arrow doesn't streak in
        // from the corner on first appearance.
        hasMoved.current = true;
        x.jump(localX);
        y.jump(localY);
        setVisible(true);
      }
      x.set(localX);
      y.set(localY);

      const now = performance.now();
      const dt = now - last.current.t || 16;
      const vx = (localX - last.current.x) / dt;
      const vy = (localY - last.current.y) / dt;
      last.current = { x: localX, y: localY, t: now };

      const speed = Math.hypot(vx, vy);
      if (speed > 0.1) {
        // Unwrap the angle so the spring takes the short path across the seam.
        const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
        let diff = angle - prevAngle.current;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        accumRotation.current += diff;
        rotate.set(accumRotation.current);
        prevAngle.current = angle;

        const n = ((angle % 360) + 360) % 360;
        if (n >= 315 || n < 45) {
          tx.set("-50%");
          ty.set("0%");
        } else if (n < 135) {
          tx.set("-100%");
          ty.set("-50%");
        } else if (n < 225) {
          tx.set("-50%");
          ty.set("-100%");
        } else {
          tx.set("0%");
          ty.set("-50%");
        }

        baseScale.set(0.92);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => baseScale.set(1), 140);
      }
    };

    let raf = 0;
    const throttled = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        onMove(e);
        raf = 0;
      });
    };

    el.addEventListener("mousemove", throttled);
    return () => {
      el.removeEventListener("mousemove", throttled);
      if (raf) cancelAnimationFrame(raf);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [x, y, tx, ty, rotate, baseScale]);

  return (
    <div
      ref={areaRef}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => {
        setInside(false);
        setVisible(false);
        hasMoved.current = false;
      }}
      className={`relative ${inside ? "cursor-none" : ""} ${className ?? ""}`}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[100] will-change-transform"
        style={{ x, y, translateX: tx, translateY: ty, rotate, scale, opacity: inside && visible ? 1 : 0 }}
      >
        <svg width={50} height={54} viewBox="0 0 50 54" fill="none">
          <path
            d="M42.68 41.15 27.51 6.8c-.78-1.77-3.3-1.77-4.12 0L7.6 41.15c-.84 1.83.93 3.74 2.81 3.05l13.97-5.15c.5-.19 1.06-.19 1.56 0l13.87 5.15c1.87.69 3.67-1.23 2.87-3.05Z"
            fill={color}
            stroke="#ffffff"
            strokeWidth={2.26}
          />
        </svg>
      </motion.div>
    </div>
  );
}
