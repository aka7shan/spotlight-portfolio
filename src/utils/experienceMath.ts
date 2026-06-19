import type { Experience } from "../types/portfolio";

/**
 * Date arithmetic for the Profile sidebar / Experience section.
 *
 * The wire format for experience dates is intentionally permissive — the
 * CV parser emits whatever the candidate wrote ("Aug 2021", "2019",
 * "08/2020", "2021-08-01"). These helpers attempt a best-effort parse
 * with `Date(input)` and degrade gracefully when that returns
 * `Invalid Date`. The contract is: any helper that can't compute returns
 * a sentinel `null` / `''` rather than throwing — the UI then falls
 * back to "—" or hides the field.
 */

/**
 * Robust-ish parse of one of our wire date strings. Returns `null` when
 * the input is empty or unparseable.
 *
 * We accept whatever `new Date()` does, plus an explicit "YYYY" form
 * (which `Date()` parses as midnight UTC of Jan 1 — close enough for
 * year-granularity inputs).
 */
export function parseFlexibleDate(input: string | undefined | null): Date | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;
  // Year-only: anchor to Jan 1 of that year. Avoids platform differences
  // in how "2021" is interpreted (Safari historically returned NaN).
  if (/^\d{4}$/.test(raw)) {
    const y = Number(raw);
    return Number.isFinite(y) ? new Date(y, 0, 1) : null;
  }
  // Month-year: "Aug 2021", "August 2021", "08/2020", "2021-08".
  // Browsers handle the named-month case via Date(); the slash and
  // hyphen forms work too. We don't bother normalising further.
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Diff between two dates in whole months, rounded down. Returns 0 for
 * negative / same-day diffs (rather than going negative, which would
 * surface as "-2 mos" somewhere if a user typo'd an end-before-start).
 */
function diffInMonths(start: Date, end: Date): number {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

/**
 * Format a month count as "X Yrs Y Mos", matching the reference design.
 *
 * Examples:
 *   0  → "0 Mos"
 *   3  → "3 Mos"
 *   12 → "1 Yr 0 Mos"
 *   34 → "2 Yrs 10 Mos"
 *
 * We always render BOTH yrs + mos once we cross the 12-month boundary so
 * "1 Yr" and "1 Yr 0 Mos" don't look inconsistent across cards.
 */
export function formatMonthsCompact(months: number): string {
  if (months <= 0) return "0 Mos";
  if (months < 12) return `${months} Mos`;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const yrLabel = yrs === 1 ? "Yr" : "Yrs";
  return `${yrs} ${yrLabel} ${mos} Mos`;
}

/**
 * Compute the duration string for a single experience entry, given its
 * (parsed) bounds. Returns "" when start is unparseable — caller hides
 * the field in that case.
 */
export function formatExperienceDuration(experience: Experience, now: Date = new Date()): string {
  const start = parseFlexibleDate(experience.startDate);
  if (!start) return "";
  const end = experience.isPresent
    ? now
    : parseFlexibleDate(experience.endDate) ?? now;
  return formatMonthsCompact(diffInMonths(start, end));
}

/**
 * Sum total months across all experience entries, accounting for date
 * overlap so two concurrent jobs aren't double-counted.
 *
 * Algorithm: merge overlapping [start, end] intervals (sweep), sum
 * intervals after merge. O(n log n) on n entries.
 *
 * Entries with unparseable start dates are ignored. Entries with no
 * end (isPresent or missing endDate) anchor to `now`.
 */
export function computeTotalExperience(
  experiences: readonly Experience[] | undefined,
  now: Date = new Date(),
): string {
  if (!experiences || experiences.length === 0) return formatMonthsCompact(0);

  const intervals: Array<[number, number]> = [];
  for (const e of experiences) {
    const start = parseFlexibleDate(e.startDate);
    if (!start) continue;
    const end = e.isPresent ? now : parseFlexibleDate(e.endDate) ?? now;
    if (end.getTime() <= start.getTime()) continue;
    intervals.push([start.getTime(), end.getTime()]);
  }

  if (intervals.length === 0) return formatMonthsCompact(0);

  intervals.sort((a, b) => a[0] - b[0]);

  // Sweep: merge overlapping / adjacent intervals so months in two
  // overlapping jobs are counted once.
  const merged: Array<[number, number]> = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const [s, e] = intervals[i];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  }

  // Sum months across merged intervals.
  let totalMonths = 0;
  for (const [s, e] of merged) {
    totalMonths += diffInMonths(new Date(s), new Date(e));
  }

  return formatMonthsCompact(totalMonths);
}

/**
 * Pick the "current" job from an experience list.
 *
 * Preference order:
 *   1. The first entry flagged `isPresent: true`.
 *   2. The entry with the most recent parseable `endDate`.
 *   3. The entry with the most recent parseable `startDate`.
 *   4. The first entry in the list (fallback).
 *
 * Returns `null` only if the list is empty.
 */
export function currentJob(
  experiences: readonly Experience[] | undefined,
): Experience | null {
  if (!experiences || experiences.length === 0) return null;

  const presentJob = experiences.find((e) => e.isPresent);
  if (presentJob) return presentJob;

  let best: { exp: Experience; date: Date } | null = null;
  for (const e of experiences) {
    const candidate =
      parseFlexibleDate(e.endDate) ?? parseFlexibleDate(e.startDate);
    if (!candidate) continue;
    if (!best || candidate.getTime() > best.date.getTime()) {
      best = { exp: e, date: candidate };
    }
  }
  return best?.exp ?? experiences[0];
}

/**
 * "Jun 2025 - Present" or "Aug 2023 - Jun 2025" formatted range used in
 * the sidebar + experience cards. Falls back to the raw strings when
 * parsing fails, so the UI never shows "Invalid Date".
 */
export function formatExperienceRange(experience: Experience): string {
  const start = parseFlexibleDate(experience.startDate);
  const startLabel = start ? formatMonthYear(start) : experience.startDate || "";
  if (experience.isPresent) return `${startLabel} - Present`;
  const end = parseFlexibleDate(experience.endDate);
  const endLabel = end ? formatMonthYear(end) : experience.endDate || "";
  if (!endLabel) return startLabel;
  return `${startLabel} - ${endLabel}`;
}

/**
 * "Jun 2025" formatting. Inlined here (vs. importing date-fns) because
 * the format is trivial and avoids pulling locale code into the bundle
 * for a single helper.
 */
function formatMonthYear(d: Date): string {
  // toLocaleString covers Intl and respects the user's locale, but we
  // pin `en-US` so the format is stable in screenshots/tests across
  // dev machines with different system locales.
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}
