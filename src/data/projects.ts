// Project data + typed accessors for the /projects pages.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)
import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "aurora-design-system",
    title: "Aurora Design System",
    summary: "A token-driven design system and component library powering four product surfaces.",
    role: "Lead Engineer",
    year: 2025,
    status: "live",
    kind: "software",
    category: "Design System",
    tags: ["Design Systems", "React", "Accessibility"],
    stack: ["TypeScript", "React", "Tailwind CSS", "Radix UI", "Storybook"],
    featured: true,
    order: 1,
    links: { live: "https://example.com/aurora", repo: "https://github.com/joshuasetiawan/aurora" },
    accent: "#5e8bff",
    client: "Lumen Labs",
    team: "4 engineers, 2 designers",
    timeline: "6 months",
    overview:
      "Aurora unifies a fragmented set of product UIs behind one accessible, themeable, token-first system.",
    problem:
      "Four teams shipped four divergent UIs. Color, spacing, and component behavior drifted, accessibility was inconsistent, and every new surface restarted from scratch.",
    constraints: [
      "Zero-downtime adoption across live products",
      "WCAG 2.2 AA as a hard requirement",
      "Sub-100KB component runtime",
    ],
    solution:
      "A semantic token layer feeds both CSS variables and the component theme, so a single source of truth drives light/dark and per-brand theming. Components wrap Radix primitives for built-in accessibility.",
    architecture:
      "Tokens → CSS variables → Tailwind theme → headless Radix primitives → composed components, documented in Storybook with automated a11y checks.",
    features: [
      {
        title: "Themeable tokens",
        description: "Light, dark, and per-brand themes from one variable set.",
      },
      {
        title: "Accessible by default",
        description: "Radix primitives + jest-axe gates on every component.",
      },
      {
        title: "Zero-runtime styling",
        description: "Utility-driven styles with no CSS-in-JS cost.",
      },
    ],
    metrics: [
      { label: "Surfaces adopted", value: "4" },
      { label: "A11y violations", value: "0" },
      { label: "Setup time", value: "−60%" },
    ],
    lessons: [
      "Naming tokens by role, not appearance, is what makes a rebrand a non-event.",
      "Automated a11y gates catch far more than manual review, far earlier.",
    ],
    media: [{ alt: "Aurora component gallery", caption: "The component gallery in Storybook." }],
  },
  {
    slug: "helios-webgl-launch",
    title: "Helios — WebGL Product Launch",
    summary: "An immersive, scroll-synced 3D launch experience that stayed under budget on mobile.",
    role: "Creative Developer",
    year: 2024,
    status: "live",
    kind: "creative",
    category: "Creative / WebGL",
    tags: ["WebGL", "Motion", "Performance"],
    stack: ["Three.js", "React Three Fiber", "GSAP", "Lenis", "Next.js"],
    featured: true,
    order: 2,
    links: { live: "https://example.com/helios" },
    accent: "#38e8c8",
    client: "Northwind",
    team: "Solo build, 1 art director",
    timeline: "10 weeks",
    overview:
      "A flagship marketing site where a GPU particle field reacts to scroll and pointer — built to feel alive without melting phones.",
    problem:
      "The brief wanted spectacle. The reality of marketing traffic is mid-range phones on slow networks, where naive WebGL tanks Core Web Vitals.",
    constraints: [
      "LCP ≤ 2.5s on a Moto-G-class device",
      "Full reduced-motion fallback",
      "No layout shift",
    ],
    solution:
      "The hero is a static poster (the LCP element) with the canvas fading in behind it on capable devices. Particle counts and DPR scale to a measured device tier; reduced-motion shows the poster, full stop.",
    architecture:
      "Single persistent canvas, on-demand frameloop, Lenis as the sole scroll source driving GSAP and the shader uniforms through one rAF.",
    features: [
      {
        title: "GPU particle field",
        description: "40k instanced points driven by a curl-noise vertex shader.",
      },
      {
        title: "Device tiering",
        description: "Quality scales from the static poster up to full bloom.",
      },
      { title: "One scroll source", description: "Lenis feeds GSAP and WebGL from a single loop." },
    ],
    metrics: [
      { label: "Mobile LCP", value: "2.1s" },
      { label: "Desktop FPS", value: "60" },
      { label: "Bounce rate", value: "−18%" },
    ],
    lessons: ["A great poster image is the cheapest performance win in WebGL."],
    media: [{ alt: "Helios hero particle field", caption: "The hero particle field at rest." }],
  },
  {
    slug: "tempo-realtime-collab",
    title: "Tempo — Realtime Collaboration",
    summary:
      "A collaborative whiteboard with conflict-free sync and presence built for low latency.",
    role: "Full-stack Engineer",
    year: 2024,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Realtime", "Architecture", "React"],
    stack: ["TypeScript", "React", "WebSockets", "CRDTs", "Node.js"],
    featured: true,
    order: 3,
    links: { live: "https://example.com/tempo", repo: "https://github.com/joshuasetiawan/tempo" },
    overview:
      "A multiplayer canvas where edits, cursors, and selections sync in real time with no central lock.",
    problem:
      "Collaborative editing breaks down under latency and concurrent edits without the right data model.",
    solution:
      "A CRDT document model makes concurrent edits conflict-free; presence and cursors ride a lightweight WebSocket channel separate from the document.",
    features: [
      {
        title: "Conflict-free sync",
        description: "CRDTs merge concurrent edits deterministically.",
      },
      { title: "Live presence", description: "Cursors and selections under 50ms locally." },
    ],
    metrics: [
      { label: "Sync latency", value: "<50ms" },
      { label: "Concurrent users", value: "60+" },
    ],
    lessons: [
      "Separate the document channel from the presence channel — they have different reliability needs.",
    ],
  },
  {
    slug: "atlas-analytics",
    title: "Atlas Analytics Dashboard",
    summary: "A fast, accessible analytics dashboard with streaming charts and saved views.",
    role: "Frontend Engineer",
    year: 2023,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Data Viz", "Performance", "Accessibility"],
    stack: ["TypeScript", "React", "D3", "TanStack Query"],
    featured: false,
    order: 4,
    links: { repo: "https://github.com/joshuasetiawan/atlas" },
    overview:
      "Internal analytics with streaming updates, keyboard-navigable charts, and shareable saved views.",
    features: [
      {
        title: "Streaming charts",
        description: "Incremental updates without re-rendering the world.",
      },
      {
        title: "Accessible viz",
        description: "Every chart has a keyboard and screen-reader path.",
      },
    ],
  },
  {
    slug: "prism-shader-toy",
    title: "Prism — Shader Playground",
    summary: "A browser shader editor with live preview, presets, and shareable URLs.",
    role: "Creative Developer",
    year: 2023,
    status: "archived",
    kind: "creative",
    category: "Creative / WebGL",
    tags: ["WebGL", "Shaders", "Tools"],
    stack: ["Three.js", "GLSL", "React"],
    featured: false,
    order: 5,
    links: { live: "https://example.com/prism", repo: "https://github.com/joshuasetiawan/prism" },
  },
  {
    slug: "ledger-cli",
    title: "Ledger — Open Source CLI",
    summary: "A zero-config, type-safe CLI toolkit adopted by several open-source projects.",
    role: "Maintainer",
    year: 2022,
    status: "live",
    kind: "oss",
    category: "Open Source",
    tags: ["Open Source", "Tooling", "DX"],
    stack: ["TypeScript", "Node.js", "Zod"],
    featured: false,
    order: 6,
    links: { repo: "https://github.com/joshuasetiawan/ledger" },
  },
];

export const projectCategories: string[] = [
  ...new Set(projects.map((project) => project.category)),
].sort((a, b) => a.localeCompare(b));

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 2): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  return getAllProjects()
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      project,
      shared:
        project.tags.filter((tag) => current.tags.includes(tag)).length +
        (project.category === current.category ? 1 : 0),
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.project);
}
