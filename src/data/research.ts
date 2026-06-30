// Research data + accessors for the /research page.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)
import type { Research } from "@/types/research";

export const research: Research[] = [
  {
    slug: "perceptual-color-dark-ui",
    title: "Perceptual Color Scales for Dark Interfaces",
    abstract:
      "An exploration of OKLCH-based color ramps that preserve contrast and perceived brightness across dark and light themes without manual per-step tuning.",
    date: "2025-04-10",
    authors: ["Joshua Setiawan"],
    venue: "Self-published",
    status: "preprint",
    category: "Design Engineering",
    tags: ["Color", "Accessibility", "OKLCH"],
    featured: true,
    readingStatus: "implemented",
    links: {
      pdf: "https://example.com/research/perceptual-color.pdf",
      code: "https://github.com/joshuasetiawan/oklch-ramps",
    },
  },
  {
    slug: "gpu-particle-scheduling",
    title: "Frame-Budget Scheduling for GPU Particle Systems",
    abstract:
      "A practical study of how to keep large instanced particle systems within a frame budget on mobile GPUs using on-demand rendering and adaptive DPR.",
    date: "2024-11-22",
    authors: ["Joshua Setiawan", "A. Rahman"],
    status: "wip",
    category: "Graphics",
    tags: ["WebGL", "Performance", "Shaders"],
    featured: true,
    readingStatus: "exploring",
    links: { code: "https://github.com/joshuasetiawan/particle-budget" },
  },
  {
    slug: "crdt-presence-channels",
    title: "Separating Document and Presence Channels in CRDT Editors",
    abstract:
      "Notes on why splitting the conflict-free document stream from the ephemeral presence stream improves both latency and reliability in collaborative editors.",
    date: "2024-06-30",
    authors: ["Joshua Setiawan"],
    venue: "Engineering notes",
    status: "published",
    category: "Distributed Systems",
    tags: ["Realtime", "CRDT", "Architecture"],
    readingStatus: "implemented",
    links: {
      doi: "https://doi.org/10.0000/example",
      pdf: "https://example.com/research/crdt-presence.pdf",
    },
  },
];

export const researchCategories: string[] = [
  ...new Set(research.map((item) => item.category)),
].sort((a, b) => a.localeCompare(b));

export function getAllResearch(): Research[] {
  return [...research].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedResearch(): Research[] {
  return getAllResearch().filter((item) => item.featured);
}
