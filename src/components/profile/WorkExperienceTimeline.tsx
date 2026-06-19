import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Experience } from "../../types/portfolio";
import {
  formatExperienceDuration,
  parseFlexibleDate,
} from "../../utils/experienceMath";

/**
 * Hand-rolled SVG timeline for the work-experience section.
 *
 * Each role becomes a soft bell curve on a single year axis: the start
 * date is the curve's left foot, the end date (or today, for current
 * roles) is the right foot, and a floating card with company + role +
 * duration sits above the curve's peak.
 *
 * Choices:
 *   - **SVG, no chart lib.** Recharts would be 30-50KB to draw what's
 *     essentially `<path d="...Q...">` + `<linearGradient>` — not worth
 *     the cost for a single one-off visualisation. The whole render is
 *     declarative and re-paints in one pass on a resize/data change.
 *   - **Inner pixel coords are 1200×220** regardless of the wrapper
 *     width. We let `<svg viewBox>` do the scaling so the curve geometry
 *     is resolution-independent; the wrapper is `overflow-x-auto` so
 *     mobile gets horizontal scroll instead of squished labels (matches
 *     the reference image's scrollbar).
 *   - **One linearGradient per role**, cycled through a small palette,
 *     so adjacent jobs read as distinct without the user picking colors.
 *
 * Empty state: when there are zero parseable experiences we render a
 * compact placeholder rather than an empty chart frame. Callers can
 * still safely mount us with no data.
 */

interface WorkExperienceTimelineProps {
  experiences: readonly Experience[] | undefined;
  /**
   * Used to anchor "Present" / "current job" ends to a stable date.
   * Defaulting inside the component makes it deterministic in tests
   * when callers pass their own clock.
   */
  now?: Date;
  className?: string;
}

// Visual constants. Pinned here (vs scattered in the JSX) so the layout
// stays easy to tune in one place.
const CHART_W = 1200;
const CHART_H = 220;
const PADDING_X = 60;
const BASELINE_Y = 170;
const PEAK_Y = 40;
const AXIS_Y = BASELINE_Y;
const TICK_LENGTH = 6;
const CARD_W = 180;
const CARD_H = 64;
const MIN_BAND_PX = 80; // Don't let very short jobs collapse to a sliver

// Two complementary palettes (one for fill gradient, one for the floating
// card accent). Same length so the cycle stays in lockstep.
const CURVE_GRADIENTS: ReadonlyArray<{ from: string; to: string }> = [
  { from: "#c4b5fd", to: "#a78bfa" }, // violet
  { from: "#f9a8d4", to: "#f472b6" }, // pink
  { from: "#a5b4fc", to: "#818cf8" }, // indigo
  { from: "#fcd34d", to: "#fbbf24" }, // amber
  { from: "#86efac", to: "#4ade80" }, // emerald
];

interface PlottedExperience {
  experience: Experience;
  startMs: number;
  endMs: number;
  // Pixel coords (relative to the chart inner box).
  xStart: number;
  xEnd: number;
  xMid: number;
  paletteIndex: number;
}

export function WorkExperienceTimeline({
  experiences,
  now = new Date(),
  className,
}: WorkExperienceTimelineProps) {
  const { plotted, yearTicks } = useMemo(() => {
    if (!experiences || experiences.length === 0) {
      return { plotted: [] as PlottedExperience[], yearTicks: [] as number[] };
    }

    // Parse + filter once so the rest of the layout math operates on
    // ms timestamps rather than rec-parsing strings.
    const parsed = experiences
      .map((e) => {
        const startMs = parseFlexibleDate(e.startDate)?.getTime();
        if (startMs == null) return null;
        const endMs = e.isPresent
          ? now.getTime()
          : parseFlexibleDate(e.endDate)?.getTime() ?? now.getTime();
        if (endMs <= startMs) return null;
        return { experience: e, startMs, endMs };
      })
      .filter((x): x is { experience: Experience; startMs: number; endMs: number } => x !== null);

    if (parsed.length === 0) {
      return { plotted: [] as PlottedExperience[], yearTicks: [] as number[] };
    }

    // Find the time range. Pad by ~3 months on each side so the first
    // and last curves don't kiss the chart edges.
    const PAD_MONTHS = 3;
    const padMs = PAD_MONTHS * 30 * 24 * 60 * 60 * 1000;
    const minMs = Math.min(...parsed.map((p) => p.startMs)) - padMs;
    const maxMs = Math.max(...parsed.map((p) => p.endMs)) + padMs;

    const span = maxMs - minMs;
    const innerW = CHART_W - PADDING_X * 2;
    const xForMs = (ms: number) => PADDING_X + ((ms - minMs) / span) * innerW;

    // Sort by start date so cycling colors looks intentional rather
    // than random. Also matters when bands overlap — drawing oldest
    // first keeps the newer jobs on top.
    parsed.sort((a, b) => a.startMs - b.startMs);

    const plotted: PlottedExperience[] = parsed.map((p, i) => {
      let xStart = xForMs(p.startMs);
      let xEnd = xForMs(p.endMs);
      // Enforce a minimum visual width so a 1-month internship still
      // shows a curve rather than a vertical line.
      if (xEnd - xStart < MIN_BAND_PX) {
        const centre = (xStart + xEnd) / 2;
        xStart = centre - MIN_BAND_PX / 2;
        xEnd = centre + MIN_BAND_PX / 2;
      }
      return {
        experience: p.experience,
        startMs: p.startMs,
        endMs: p.endMs,
        xStart,
        xEnd,
        xMid: (xStart + xEnd) / 2,
        paletteIndex: i % CURVE_GRADIENTS.length,
      };
    });

    // Year tick generation: one per January-1 within the range. We
    // include the endpoints regardless so the axis always has at
    // least two labels.
    const startYear = new Date(minMs).getFullYear();
    const endYear = new Date(maxMs).getFullYear();
    const yearTicks: number[] = [];
    for (let y = startYear; y <= endYear; y++) yearTicks.push(y);

    return { plotted, yearTicks };
  }, [experiences, now]);

  if (plotted.length === 0) {
    return (
      <div
        className={
          "rounded-xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center " +
          (className ?? "")
        }
      >
        <p className="text-sm text-gray-500">
          Add a role with a start date to see your career timeline.
        </p>
      </div>
    );
  }

  // For year ticks we need the same minMs/maxMs the layout used. Recompute
  // here (it's cheap) rather than threading them out of useMemo.
  const PAD_MONTHS = 3;
  const padMs = PAD_MONTHS * 30 * 24 * 60 * 60 * 1000;
  const allStarts = plotted.map((p) => p.startMs);
  const allEnds = plotted.map((p) => p.endMs);
  const minMs = Math.min(...allStarts) - padMs;
  const maxMs = Math.max(...allEnds) + padMs;
  const span = maxMs - minMs;
  const innerW = CHART_W - PADDING_X * 2;
  const xForMs = (ms: number) => PADDING_X + ((ms - minMs) / span) * innerW;

  return (
    <div
      className={
        "rounded-xl border border-gray-100 bg-white overflow-x-auto " +
        (className ?? "")
      }
    >
      <div className="min-w-[640px]">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          height={CHART_H}
          role="img"
          aria-label="Work experience timeline"
          className="block"
        >
          <defs>
            {/* One gradient per palette entry. Inline (vs. external CSS)
                so the SVG is self-contained and copy/pastable for debug. */}
            {CURVE_GRADIENTS.map((g, i) => (
              <linearGradient
                key={i}
                id={`exp-grad-${i}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={g.from} stopOpacity={0.7} />
                <stop offset="100%" stopColor={g.to} stopOpacity={0.15} />
              </linearGradient>
            ))}
          </defs>

          {/* Axis line + year ticks */}
          <line
            x1={PADDING_X - 10}
            x2={CHART_W - PADDING_X + 10}
            y1={AXIS_Y}
            y2={AXIS_Y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          {yearTicks.map((y) => {
            const ms = new Date(y, 0, 1).getTime();
            const x = xForMs(ms);
            return (
              <g key={y}>
                <line
                  x1={x}
                  x2={x}
                  y1={AXIS_Y}
                  y2={AXIS_Y + TICK_LENGTH}
                  stroke="#d1d5db"
                />
                <text
                  x={x}
                  y={AXIS_Y + TICK_LENGTH + 14}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#6b7280"
                >
                  {y}
                </text>
              </g>
            );
          })}

          {/* One curve per experience. Drawn oldest-first so the newest
              curves sit on top of older ones at overlapping ranges. */}
          {plotted.map((p, i) => {
            const peakX = p.xMid;
            // Quadratic Bezier from baseline up through (peakX, PEAK_Y)
            // and back to baseline. The control point's y is pushed
            // ABOVE the visual peak (PEAK_Y * 0.6) because a quadratic's
            // actual apex sits halfway between control and chord — using
            // PEAK_Y directly as the control would leave the curve
            // sagging well below the intended top.
            const controlY = PEAK_Y * 0.6;
            const pathD = `M ${p.xStart},${BASELINE_Y} Q ${peakX},${controlY} ${p.xEnd},${BASELINE_Y} Z`;
            return (
              <motion.path
                key={i}
                d={pathD}
                fill={`url(#exp-grad-${p.paletteIndex})`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              />
            );
          })}

          {/* Vertical guideline + floating card per role. We render
              cards AFTER curves so they stack on top. */}
          {plotted.map((p, i) => {
            const peakX = p.xMid;
            // Clamp the card's left so it never overflows the chart's
            // right edge (long company names + late dates would cause
            // a horizontal scroll otherwise).
            const cardX = Math.min(
              Math.max(peakX - CARD_W / 2, PADDING_X - 20),
              CHART_W - PADDING_X - CARD_W + 20,
            );
            const cardY = PEAK_Y - 25;
            const dur = formatExperienceDuration(p.experience, now);
            return (
              <g key={`card-${i}`}>
                <line
                  x1={peakX}
                  x2={peakX}
                  y1={PEAK_Y + 18}
                  y2={BASELINE_Y}
                  stroke="#9ca3af"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <motion.g
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                >
                  <rect
                    x={cardX}
                    y={cardY}
                    width={CARD_W}
                    height={CARD_H}
                    rx={8}
                    fill="#fffaeb"
                    stroke="#fde68a"
                  />
                  <text
                    x={cardX + 12}
                    y={cardY + 20}
                    fontSize={11}
                    fontWeight={500}
                    fill="#6b7280"
                  >
                    {truncate(p.experience.company || "Company", 26)}
                  </text>
                  <text
                    x={cardX + 12}
                    y={cardY + 36}
                    fontSize={12}
                    fontWeight={600}
                    fill="#111827"
                  >
                    {truncate(p.experience.position || "Position", 24)}
                  </text>
                  {dur && (
                    <g>
                      <rect
                        x={cardX + 12}
                        y={cardY + 44}
                        width={dur.length * 6 + 14}
                        height={16}
                        rx={4}
                        fill="#4c1d95"
                      />
                      <text
                        x={cardX + 19}
                        y={cardY + 55}
                        fontSize={10}
                        fontWeight={600}
                        fill="#ffffff"
                      >
                        {dur}
                      </text>
                    </g>
                  )}
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}
