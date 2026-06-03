// Gallery data for the /gallery page.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)
// `src` is intentionally omitted on samples so the GalleryItem renders a tasteful
// gradient placeholder until real media is provided.

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  alt: string;
  caption?: string;
  date: string;
  type: "image" | "video";
  src?: string;
  width: number;
  height: number;
  accent?: string;
}

export const gallery: GalleryItem[] = [
  {
    id: "helios-hero",
    title: "Helios — particle hero",
    category: "WebGL",
    alt: "A glowing field of particles drifting in dark space",
    caption: "GPU particle field at rest.",
    date: "2024-08",
    type: "image",
    width: 1600,
    height: 1000,
    accent: "#38e8c8",
  },
  {
    id: "aurora-tokens",
    title: "Aurora — token board",
    category: "Design System",
    alt: "A board of color and spacing tokens",
    caption: "The semantic token board.",
    date: "2025-02",
    type: "image",
    width: 1200,
    height: 1200,
    accent: "#5e8bff",
  },
  {
    id: "prism-shader",
    title: "Prism — shader study",
    category: "Shaders",
    alt: "A colorful generative shader gradient",
    date: "2023-05",
    type: "image",
    width: 1600,
    height: 900,
    accent: "#a78bfa",
  },
  {
    id: "tempo-canvas",
    title: "Tempo — multiplayer canvas",
    category: "Product",
    alt: "A collaborative whiteboard with multiple cursors",
    caption: "Live presence on the canvas.",
    date: "2024-04",
    type: "image",
    width: 1600,
    height: 1000,
    accent: "#3dd68c",
  },
  {
    id: "atlas-charts",
    title: "Atlas — streaming charts",
    category: "Data Viz",
    alt: "An analytics dashboard with line and bar charts",
    date: "2023-09",
    type: "image",
    width: 1400,
    height: 1050,
    accent: "#f5b544",
  },
  {
    id: "desk-setup",
    title: "Workspace",
    category: "Behind the scenes",
    alt: "A tidy desk with a monitor and warm lighting",
    date: "2025-01",
    type: "image",
    width: 1600,
    height: 1067,
  },
];

export const galleryCategories: string[] = [...new Set(gallery.map((item) => item.category))].sort(
  (a, b) => a.localeCompare(b),
);
