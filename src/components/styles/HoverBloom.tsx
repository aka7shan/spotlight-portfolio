import { useEffect, useRef } from "react";

/**
 * HoverBloom
 * ----------
 * A generative canvas that sprouts little watercolour flowers along the
 * pointer's path. Each bloom grows a stem and a ring of soft, jittered petals,
 * easing in from nothing to full size, then persists. Blooms are spawned as the
 * pointer travels (and on click), capped for performance, and the whole field
 * is redrawn every frame so it stays crisp on resize.
 */
export interface HoverBloomProps {
  backgroundColor?: string;
  palette?: number[];
  maxBlooms?: number;
  spawnGap?: number;
  className?: string;
}

interface Bloom {
  x: number;
  y: number;
  age: number;
  petals: number;
  radius: number;
  stemLen: number;
  sway: number;
  hue: number;
  sat: number;
  light: number;
}

const DEFAULT_PALETTE = [350, 15, 330, 40, 300, 5, 345, 20];
const GROW = 42;

export function HoverBloom({
  backgroundColor = "#ffffff",
  palette = DEFAULT_PALETTE,
  maxBlooms = 70,
  spawnGap = 26,
  className,
}: HoverBloomProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blooms = useRef<Bloom[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hovering = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(host.clientWidth * dpr);
      canvas.height = Math.floor(host.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const hsl = (h: number, s: number, l: number, a: number) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

    const blob = (x: number, y: number, rx: number, ry: number, angle: number, h: number, s: number, l: number, a: number) => {
      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), angle, 0, Math.PI * 2);
      ctx.fillStyle = hsl(h, s, l, a);
      ctx.fill();
    };

    const draw = (b: Bloom) => {
      const t = Math.min(1, b.age / GROW);
      const e = 1 - Math.pow(1 - t, 3);
      const baseX = b.x + b.sway;
      const baseY = b.y + b.stemLen;

      // stem
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(b.x + b.sway * 0.4, b.y + b.stemLen * 0.5, b.x, b.y);
      ctx.strokeStyle = hsl(115, 30, 34, 0.85 * e);
      ctx.lineWidth = 2.4 * e;
      ctx.lineCap = "round";
      ctx.stroke();

      // a leaf
      blob((baseX + b.x) / 2, (baseY + b.y) / 2, 9 * e, 4 * e, b.sway > 0 ? 0.7 : -0.7, 120, 32, 40, 0.5 * e);

      // petals
      const r = b.radius * e;
      for (let i = 0; i < b.petals; i++) {
        const a = (i / b.petals) * Math.PI * 2 + b.age * 0.004;
        const px = b.x + Math.cos(a) * r * 0.7;
        const py = b.y + Math.sin(a) * r * 0.7;
        blob(px, py, r * 0.62, r * 0.32, a, b.hue, b.sat, b.light + 6, 0.5);
        blob(px, py, r * 0.5, r * 0.26, a, b.hue, Math.min(100, b.sat + 8), b.light - 14, 0.45);
      }
      // center
      blob(b.x, b.y, r * 0.42, r * 0.42, 0, 42, 80, 56, 0.85);
    };

    let raf = 0;
    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const b of blooms.current) {
        b.age += 1;
        draw(b);
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [backgroundColor]);

  const spawn = (x: number, y: number) => {
    const hue = palette[(Math.random() * palette.length) | 0] + (Math.random() * 10 - 5);
    blooms.current.push({
      x,
      y,
      age: 0,
      petals: 5 + ((Math.random() * 4) | 0),
      radius: 16 + Math.random() * 14,
      stemLen: 40 + Math.random() * 60,
      sway: (Math.random() - 0.5) * 30,
      hue,
      sat: 74 + Math.random() * 14,
      light: 60 + Math.random() * 8,
    });
    if (blooms.current.length > maxBlooms) blooms.current.splice(0, blooms.current.length - maxBlooms);
  };

  const localPoint = (e: React.PointerEvent) => {
    const rect = hostRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      ref={hostRef}
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      style={{ background: backgroundColor, backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px", touchAction: "none" }}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => {
        hovering.current = false;
        last.current = null;
      }}
      onPointerMove={(e) => {
        if (!hovering.current) return;
        const p = localPoint(e);
        if (!last.current || Math.hypot(p.x - last.current.x, p.y - last.current.y) >= spawnGap) {
          spawn(p.x + (Math.random() - 0.5) * 8, p.y + (Math.random() - 0.5) * 8);
          last.current = p;
        }
      }}
      onPointerDown={(e) => {
        const p = localPoint(e);
        spawn(p.x, p.y);
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <span className="pointer-events-none absolute bottom-3 left-4 text-xs text-black/40">Move your cursor to plant flowers</span>
    </div>
  );
}
