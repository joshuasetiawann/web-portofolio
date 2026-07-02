// Research data + accessors for the /research page.
// Self-published engineering writing — design docs from the THUOS repo, readable on GitHub.
import type { Research } from "@/types/research";

const THUOS_DOCS = "https://github.com/joshuasetiawann/THUNITY-OS/blob/main/docs";

export const research: Research[] = [
  {
    slug: "ai-native-os-foundation",
    title: "An AI-Native Foundation for a General-Purpose OS",
    abstract:
      "Design notes for building AI into an operating system as a first-class kernel service: an in-kernel AI service/model/task core with permissions and audit, exposed through an `ai` shell namespace — specified and host-tested before any inference runs in kernel space.",
    date: "2026-06-20",
    authors: ["Joshua Setiawan"],
    venue: "THUOS engineering docs",
    status: "published",
    category: "Operating Systems",
    tags: ["OS Design", "AI", "Kernel"],
    featured: true,
    readingStatus: "implemented",
    links: {
      pdf: `${THUOS_DOCS}/39_AI_NATIVE_GENERAL_OS_FOUNDATION.md`,
      code: "https://github.com/joshuasetiawann/THUNITY-OS",
    },
  },
  {
    slug: "thunity-ai-bridge-strategy",
    title: "THUNITY AI Bridge Strategy",
    abstract:
      "How a freestanding kernel with no networking or Python can still get real AI assistance: a staged bridge design connecting THUOS to host-side inference, with explicit trust boundaries and a design-only first phase.",
    date: "2026-06-22",
    authors: ["Joshua Setiawan"],
    venue: "THUOS engineering docs",
    status: "published",
    category: "Operating Systems",
    tags: ["OS Design", "AI", "Architecture"],
    featured: true,
    readingStatus: "exploring",
    links: {
      pdf: `${THUOS_DOCS}/40_THUNITY_AI_BRIDGE_STRATEGY.md`,
      code: "https://github.com/joshuasetiawann/THUNITY-OS",
    },
  },
  {
    slug: "thuos-reality-check",
    title: "THUOS Reality Check",
    abstract:
      "An honest audit of what the kernel actually does versus what it claims: boot verification methodology, what 'working' means for each subsystem, and the gap between a demo and a daily driver.",
    date: "2026-06-15",
    authors: ["Joshua Setiawan"],
    venue: "THUOS engineering docs",
    status: "published",
    category: "Operating Systems",
    tags: ["Verification", "Testing", "Kernel"],
    readingStatus: "implemented",
    links: {
      pdf: `${THUOS_DOCS}/THUOS_REALITY_CHECK.md`,
      code: "https://github.com/joshuasetiawann/THUNITY-OS",
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
