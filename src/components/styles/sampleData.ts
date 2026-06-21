/**
 * Shared sample content for the Styles showcase components.
 *
 * These are reusable demo assets (images, gradients, copy) so each component
 * on the Styles page can be previewed with realistic content without every
 * call-site re-declaring the same arrays. Swap these out for real data when
 * wiring a component into a production surface.
 */

export interface GalleryItem {
  image: string;
  title: string;
  subheadline: string;
  /** Page background shown while this item is the active/centered one. */
  backgroundColor: string;
  link?: string;
}

/** Stable Unsplash photo URLs (cropped + width-capped for fast loads). */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SAMPLE_PHOTOS: readonly string[] = [
  u("1500530855697-b586d89ba3ee"), // aerial dunes
  u("1469474968028-56623f02e42e"), // mountain sunbeam
  u("1470071459604-3b5ec3a7fe05"), // foggy forest
  u("1441974231531-c6227db76b6e"), // forest canopy
  u("1454165804606-c3d57bc86b40"), // desk flatlay
  u("1506744038136-46273834b3fb"), // lake landscape
];

/** CSS gradient strings used as graceful fallbacks (e.g. in the carousel). */
export const SAMPLE_GRADIENTS: readonly string[] = [
  "linear-gradient(135deg, #1e3a8a, #3b82f6)",
  "linear-gradient(135deg, #064e3b, #10b981)",
  "linear-gradient(135deg, #b91c1c, #ef4444)",
  "linear-gradient(135deg, #c2410c, #f97316)",
  "linear-gradient(135deg, #4c1d95, #8b5cf6)",
  "linear-gradient(135deg, #164e63, #06b6d4)",
];

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    image: u("1500530855697-b586d89ba3ee"),
    title: "Horizon",
    subheadline: "Where the desert meets the sky",
    backgroundColor: "#f4f1ec",
  },
  {
    image: u("1469474968028-56623f02e42e"),
    title: "Ascent",
    subheadline: "First light over the ridgeline",
    backgroundColor: "#eef2f6",
  },
  {
    image: u("1470071459604-3b5ec3a7fe05"),
    title: "Drift",
    subheadline: "Morning fog in the pines",
    backgroundColor: "#eaece9",
  },
  {
    image: u("1441974231531-c6227db76b6e"),
    title: "Canopy",
    subheadline: "Looking up through the trees",
    backgroundColor: "#e8efe6",
  },
  {
    image: u("1506744038136-46273834b3fb"),
    title: "Stillness",
    subheadline: "A quiet lake at dusk",
    backgroundColor: "#e9edf2",
  },
];
