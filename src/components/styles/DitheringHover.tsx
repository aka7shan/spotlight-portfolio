import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { SAMPLE_PHOTOS } from "./sampleData";

/**
 * DitheringHover
 * --------------
 * An image with a soft circular zone that follows the cursor. Inside the zone
 * the pixels are quantised to black/white using an ordered (8×8 Bayer) dither,
 * blended back toward the original image with a feathered, slightly ragged
 * falloff at the edge. The cursor position and zone radius are spring-smoothed.
 */
export interface DitheringHoverProps {
  image?: string;
  zoneSize?: number;
  dotSize?: number;
  className?: string;
}

// 8×8 Bayer threshold matrix, normalised to 0..1.
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => v / 64);

export function DitheringHover({
  image = SAMPLE_PHOTOS[2],
  zoneSize = 220,
  dotSize = 4,
  className,
}: DitheringHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const hovering = useRef(false);
  const seeded = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 300 });
  const radius = useMotionValue(0);
  const smoothRadius = useSpring(radius, { damping: 20, stiffness: 120 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const sync = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);

    const drawCover = () => {
      const img = imgRef.current!;
      const dW = canvas.width;
      const dH = canvas.height;
      const scale = Math.max(dW / img.naturalWidth, dH / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (dW - w) / 2, (dH - h) / 2, w, h);
    };

    let raf = 0;
    const render = () => {
      const r = smoothRadius.get();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCover();

      if (hovering.current || r >= 0.5) {
        const cx = smoothX.get();
        const cy = smoothY.get();
        const x0 = Math.max(0, Math.floor(cx - r - dotSize));
        const y0 = Math.max(0, Math.floor(cy - r - dotSize));
        const x1 = Math.min(canvas.width, Math.ceil(cx + r + dotSize));
        const y1 = Math.min(canvas.height, Math.ceil(cy + r + dotSize));
        const w = x1 - x0;
        const h = y1 - y0;
        if (w > 0 && h > 0) {
          const region = ctx.getImageData(x0, y0, w, h);
          const data = region.data;
          for (let by = 0; by < h; by += dotSize) {
            for (let bx = 0; bx < w; bx += dotSize) {
              const px = x0 + bx;
              const py = y0 + by;
              const dist = Math.hypot(px + dotSize / 2 - cx, py + dotSize / 2 - cy);
              const ragged = r * (0.82 + 0.12 * Math.sin(Math.atan2(py - cy, px - cx) * 9));
              if (dist > ragged + dotSize) continue;
              const blend = dist <= ragged ? 1 : Math.max(0, 1 - (dist - ragged) / dotSize);

              const ci = (by * w + bx) * 4;
              const luma = (0.299 * data[ci] + 0.587 * data[ci + 1] + 0.114 * data[ci + 2]) / 255;
              const t = BAYER[(Math.floor(py / dotSize) % 8) * 8 + (Math.floor(px / dotSize) % 8)];
              const v = luma > t ? 255 : 0;
              for (let yy = 0; yy < dotSize && by + yy < h; yy++) {
                for (let xx = 0; xx < dotSize && bx + xx < w; xx++) {
                  const i = ((by + yy) * w + (bx + xx)) * 4;
                  data[i] = v * blend + data[i] * (1 - blend);
                  data[i + 1] = v * blend + data[i + 1] * (1 - blend);
                  data[i + 2] = v * blend + data[i + 2] * (1 - blend);
                }
              }
            }
          }
          ctx.putImageData(region, x0, y0);
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [loaded, dotSize, smoothX, smoothY, smoothRadius]);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    if (!seeded.current) {
      smoothX.jump(x);
      smoothY.jump(y);
      smoothRadius.jump(0);
      radius.set(zoneSize / 2);
      hovering.current = true;
      seeded.current = true;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => (seeded.current = false)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        hovering.current = false;
        seeded.current = false;
        radius.set(0);
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
