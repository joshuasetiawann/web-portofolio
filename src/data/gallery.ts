// Gallery data for the /gallery page.
// Real screenshots pulled from project repos on github.com/joshuasetiawann
// (dimensions measured from the actual files).

const RAW = "https://raw.githubusercontent.com/joshuasetiawann";

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
    id: "thuos-desktop",
    title: "THUOS — the THU Desktop",
    category: "Systems / OS",
    alt: "THUOS truecolor desktop with top bar, dock, and a terminal window, running in QEMU",
    caption: "A from-scratch kernel booted in QEMU — real screenshot, not a mockup.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/THUNITY-OS/main/preview/screenshots/desktop.png`,
    width: 1024,
    height: 768,
  },
  {
    id: "thuos-terminal",
    title: "THUOS — terminal",
    category: "Systems / OS",
    alt: "The thuos> shell running inside a rounded terminal window",
    caption: "The thuos> shell with 29 built-in commands.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/THUNITY-OS/main/preview/screenshots/terminal.png`,
    width: 1024,
    height: 768,
  },
  {
    id: "thuos-settings",
    title: "THUOS — settings",
    category: "Systems / OS",
    alt: "THUOS settings app showing live themes, display, and devices",
    caption: "Live themes, display, and device pages.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/THUNITY-OS/main/preview/screenshots/settings.png`,
    width: 1024,
    height: 768,
  },
  {
    id: "thuos-files",
    title: "THUOS — file manager",
    category: "Systems / OS",
    alt: "THUOS Files app browsing the in-RAM filesystem",
    caption: "Browsing the in-RAM filesystem.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/THUNITY-OS/main/preview/screenshots/files.png`,
    width: 1024,
    height: 768,
  },
  {
    id: "allhaven-dashboard",
    title: "AllHaven — command center",
    category: "AI Platform",
    alt: "AllHaven dashboard with tasks, notes, finance, and routines",
    caption: "The local-first command-center dashboard.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/AllHaven-Application/main/docs/assets/screenshot-dashboard.png`,
    width: 2880,
    height: 1800,
  },
  {
    id: "allhaven-ai-chat",
    title: "AllHaven — multi-agent chat",
    category: "AI Platform",
    alt: "AllHaven AI chat with agent selection and approval gating",
    caption: "Up to 10 agents across 15 providers, human-approved actions.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/AllHaven-Application/main/docs/assets/screenshot-ai-chat.png`,
    width: 2880,
    height: 1800,
  },
  {
    id: "thuai-main-chat",
    title: "ThuAI — founder command center",
    category: "AI Platform",
    alt: "ThuAI main chat with the founder insight panel",
    caption: "Local-first by default, with the Founder Insight Panel.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/ThuAI-Personal-Business-Organization-AI/main/docs/screenshots/main-chat.png`,
    width: 2160,
    height: 1350,
  },
  {
    id: "invento-dashboard",
    title: "Invento — stock dashboard",
    category: "Web App",
    alt: "Invento warehouse dashboard with stock summaries",
    caption: "The Tidal design system over live Supabase data.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/Invento-Warehouse-Tracker-Application/main/docs/screenshots/02-dashboard.png`,
    width: 2880,
    height: 1800,
  },
  {
    id: "nexora-seller-studio",
    title: "Nexora AI — seller studio",
    category: "Web App",
    alt: "Nexora AI seller studio for listing and managing AI models",
    caption: "One account to shop and sell AI models.",
    date: "2026-06",
    type: "image",
    src: `${RAW}/ai-marketplace-website/main/docs/preview/seller-studio.jpg`,
    width: 1920,
    height: 2141,
  },
];

export const galleryCategories: string[] = [...new Set(gallery.map((item) => item.category))].sort(
  (a, b) => a.localeCompare(b),
);
