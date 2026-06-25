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

/** Smaller variants for thumbnails / dense surfaces (e.g. the magazine pages). */
export const SAMPLE_PHOTOS_SM: readonly string[] = SAMPLE_PHOTOS.map((url) =>
  url.replace("w=1200", "w=560"),
);

/** Square portrait photos for avatars / ticker faces. */
export const SAMPLE_FACES: readonly string[] = [
  "1500648767791-00dcc994a43e",
  "1494790108377-be9c29b29330",
  "1633332755192-727a05c4013d",
  "1438761681033-6461ffad8d80",
  "1507003211169-0a1dd7228f2d",
  "1534528741775-53994a69daeb",
].map((id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&h=200&q=80`);

export interface SampleVideo {
  src: string;
  poster: string;
}

/** Public sample MP4s (Google's gtv-videos bucket) with Unsplash posters. */
export const SAMPLE_VIDEOS: readonly SampleVideo[] = [
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: u("1500530855697-b586d89ba3ee", 800),
  },
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: u("1469474968028-56623f02e42e", 800),
  },
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: u("1470071459604-3b5ec3a7fe05", 800),
  },
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: u("1506744038136-46273834b3fb", 800),
  },
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
