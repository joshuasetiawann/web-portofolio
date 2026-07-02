// Project data + typed accessors for the /projects pages.
// Real projects sourced from github.com/joshuasetiawann (READMEs, releases, live URLs).
import type { Project } from "@/types/project";

const GH = "https://github.com/joshuasetiawann";
const RAW = "https://raw.githubusercontent.com/joshuasetiawann";

export const projects: Project[] = [
  {
    slug: "thuos",
    title: "THUOS — Operating System from Scratch",
    summary:
      "A real, bootable x86 kernel in C and assembly: paging, multitasking, a RAM filesystem, ring-3 user mode, a 1024×768 truecolor desktop, and USB-HID input — boot-verified in QEMU on every push.",
    role: "Sole developer",
    year: 2026,
    status: "wip",
    kind: "software",
    category: "Systems / OS",
    tags: ["OS Dev", "Kernel", "Low-level", "C", "Assembly"],
    stack: ["C", "x86 Assembly", "QEMU", "GRUB", "Make", "CI"],
    featured: true,
    order: 1,
    links: { repo: `${GH}/THUNITY-OS` },
    cover: `${RAW}/THUNITY-OS/main/preview/screenshots/desktop.png`,
    team: "Solo",
    overview:
      "THUOS is a freestanding operating-system kernel written from scratch — not a Linux distribution. It boots via Multiboot, brings up paging and cooperative multitasking, and runs a windowed truecolor desktop with a terminal, file manager, settings, and calculator on its own in-RAM filesystem.",
    problem:
      "Most 'OS projects' stop at a bootloader printing text. The goal here was a genuinely usable graphical system — real input drivers, real user mode, real apps — small enough for one person to hold in their head.",
    constraints: [
      "Freestanding C + x86 assembly only — no OS, no libc underneath",
      "Every push must boot: CI smoke-boots the kernel in QEMU",
      "32-bit i386 target via Multiboot 1 (QEMU and GRUB ISO)",
    ],
    solution:
      "Built incrementally across 20 versioned releases: VGA text → paging → multitasking → RAM FS → ring-3 → a compositing 1024×768 desktop with themes, then PS/2 and USB-HID (xHCI) keyboard + mouse. v0.20 adds a host-tested, design-only AI-native service layer for a future assistant bridge.",
    architecture:
      "Multiboot 1 boot → paging + cooperative scheduler → THU Kernel services (RAM filesystem, syscalls, ring-3) → THU Desktop compositor with apps, PS/2 + xHCI USB-HID input; unit tests run on the host, boot smoke-tests run in QEMU CI.",
    features: [
      {
        title: "Truecolor desktop",
        description: "1024×768 windowed UI: terminal (29 commands), files, settings, calculator.",
      },
      {
        title: "USB-HID input",
        description: "xHCI USB keyboard and mouse alongside PS/2 — written from the datasheets.",
      },
      {
        title: "Boot-verified CI",
        description: "Every push boots the kernel in QEMU plus host-side unit tests.",
      },
    ],
    metrics: [
      { label: "Kernel releases", value: "20" },
      { label: "Shell commands", value: "29" },
      { label: "Desktop", value: "1024×768" },
    ],
    lessons: [
      "Hardware documentation is the real API — the datasheet always wins.",
      "A CI that boots the kernel catches regressions no unit test can see.",
    ],
    media: [
      {
        alt: "THUOS desktop running in QEMU",
        src: `${RAW}/THUNITY-OS/main/preview/screenshots/desktop.png`,
        caption: "The THU Desktop booted in QEMU — real kernel, not a mockup.",
      },
      {
        alt: "THUOS terminal application",
        src: `${RAW}/THUNITY-OS/main/preview/screenshots/terminal.png`,
        caption: "The thuos> shell with 29 built-in commands.",
      },
      {
        alt: "THUOS settings application",
        src: `${RAW}/THUNITY-OS/main/preview/screenshots/settings.png`,
        caption: "Settings — live themes, display, and devices.",
      },
      {
        alt: "THUOS file manager",
        src: `${RAW}/THUNITY-OS/main/preview/screenshots/files.png`,
        caption: "Browsing the in-RAM filesystem.",
      },
    ],
  },
  {
    slug: "allhaven",
    title: "AllHaven Command Center",
    summary:
      "A local-first AI command center unifying tasks, notes, finance, and routines with a multi-agent assistant — every risky AI action gated behind human approval.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "AI Platform",
    tags: ["AI Agents", "Local-first", "Full-stack", "Android"],
    stack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Supabase", "Capacitor"],
    featured: true,
    order: 2,
    links: { repo: `${GH}/AllHaven-Application` },
    cover: `${RAW}/AllHaven-Application/main/docs/assets/screenshot-dashboard.png`,
    team: "Solo",
    timeline: "v1 → v4.1 across 2026",
    overview:
      "AllHaven is a private command center for personal and business productivity: the desktop app owns a FastAPI backend and local PostgreSQL, while an Android APK companion syncs core workspace features through Supabase.",
    problem:
      "Productivity data — finances, notes, routines — is too sensitive to hand to a SaaS, but local-only tools rarely offer serious AI assistance or a mobile companion.",
    constraints: [
      "Local-first: the desktop owns the data and the private backend",
      "Every consequential AI action requires explicit human approval",
      "Honest status checks for AI providers — no silent failures",
    ],
    solution:
      "A FastAPI + Next.js desktop app with a local PostgreSQL database, up to 10 AI agents across 15 provider integrations (local Ollama included), human-in-the-loop approval on risky actions, and a Capacitor-built Android APK that syncs through Supabase only for mobile features.",
    architecture:
      "FastAPI backend + Next.js frontend over local PostgreSQL; optional Supabase cloud layer for the Android APK; local/remote AI providers behind one gateway with per-action approval and audit.",
    features: [
      {
        title: "Multi-agent AI",
        description: "Up to 10 agents across 15 providers, including fully local Ollama models.",
      },
      {
        title: "Human-in-the-loop",
        description: "Risky actions pause for explicit approval — the AI never acts silently.",
      },
      {
        title: "Mobile companion",
        description: "A Capacitor Android APK syncing core features through Supabase.",
      },
    ],
    metrics: [
      { label: "Release", value: "4.1.0" },
      { label: "AI providers", value: "15" },
      { label: "Max agents", value: "10" },
    ],
    lessons: [
      "Local-first plus a thin cloud layer beats cloud-first with a privacy toggle.",
      "An AI that asks permission earns more trust than one that only explains itself.",
    ],
    media: [
      {
        alt: "AllHaven dashboard",
        src: `${RAW}/AllHaven-Application/main/docs/assets/screenshot-dashboard.png`,
        caption: "The command-center dashboard.",
      },
      {
        alt: "AllHaven AI chat",
        src: `${RAW}/AllHaven-Application/main/docs/assets/screenshot-ai-chat.png`,
        caption: "Multi-agent AI chat with approval gating.",
      },
    ],
  },
  {
    slug: "relaycli",
    title: "RelayCLI — Terminal Coding Agent",
    summary:
      "A provider-agnostic, pipx-installable terminal coding agent in the Claude Code / Codex CLI form factor — you choose the model, it works in any project directory.",
    role: "Creator & maintainer",
    year: 2026,
    status: "wip",
    kind: "oss",
    category: "AI Agent",
    tags: ["AI Agents", "CLI", "Developer Tools", "Open Source"],
    stack: ["Python", "LiteLLM", "pipx"],
    featured: true,
    order: 3,
    links: { repo: `${GH}/relaycli` },
    team: "Solo",
    overview:
      "RelayCLI brings the terminal-agent form factor to any model: installed once as a console script, it reads and edits real files, runs shell commands, and works through requests in an interactive session — with OpenAI, Anthropic, Gemini, Groq, Mistral, or local Ollama behind one LiteLLM interface.",
    problem:
      "Terminal coding agents are tied to their vendor's models. Switching providers shouldn't mean switching tools.",
    solution:
      "A staged build on LiteLLM: layered configuration (flags → env/.env → ~/.relaycli/config.toml → defaults), standard provider key names, and an isolated pipx/uv install. Stage 1 ships the scaffold and config; the agent loop, tools, and REPL land in later stages.",
    features: [
      {
        title: "Provider-agnostic",
        description: "Six providers incl. keyless local Ollama through one LiteLLM interface.",
      },
      {
        title: "Real install",
        description: "A standard console script via pipx or uv tool — not a cloned repo script.",
      },
      {
        title: "Layered config",
        description: "CLI flags, environment, and TOML config with clear precedence.",
      },
    ],
    lessons: ["Shipping the install and config story first makes every later stage testable."],
  },
  {
    slug: "thuai",
    title: "ThuAI — Local-first AI Company OS",
    summary:
      "A private AI 'company brain' that runs entirely on your own hardware — a six-agent AI Council debates strategic questions before you decide, and no data leaves the machine.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "AI Platform",
    tags: ["AI Agents", "Local-first", "RAG", "Self-hosted"],
    stack: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Ollama", "Docker"],
    featured: false,
    order: 4,
    links: { repo: `${GH}/ThuAI-Personal-Business-Organization-AI` },
    cover: `${RAW}/ThuAI-Personal-Business-Organization-AI/main/docs/screenshots/main-chat.png`,
    team: "Solo",
    overview:
      "ThuAI is a personal AI operating system for running a business: decision-making, knowledge management, task execution, and workflow governance on a self-hosted PostgreSQL database with local Ollama models by default.",
    problem:
      "Business knowledge — documents, decisions, finances — is exactly the data you can't send to someone else's cloud, yet that's what every AI SaaS asks for.",
    solution:
      "A local-first stack (FastAPI + React + self-hosted PostgreSQL + Ollama, deployed with Docker Compose) where every document, embedding, and conversation stays on hardware you own. Its signature feature is the AI Council: six agents debate strategic questions in stages before surfacing a recommendation.",
    features: [
      {
        title: "AI Council",
        description:
          "A six-stage agent debate on every strategic question — not one model, one answer.",
      },
      {
        title: "Your database",
        description: "Self-hosted PostgreSQL owns all memory, embeddings, and decisions.",
      },
      {
        title: "Honest hybrid AI",
        description: "Local Ollama by default; any cloud call is explicit and labelled.",
      },
    ],
    metrics: [
      { label: "Council agents", value: "6" },
      { label: "Release", value: "1.3" },
    ],
  },
  {
    slug: "tasktivity",
    title: "Tasktivity — AI Productivity Platform",
    summary:
      "An AI-powered productivity web app that auto-builds daily schedules and gamifies progress with XP, levels, and streaks — vanilla JavaScript, live on Vercel.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["AI", "Productivity", "Gamification", "Automation"],
    stack: ["JavaScript", "Supabase", "OpenRouter", "n8n", "Telegram API"],
    featured: false,
    order: 5,
    links: {
      live: "https://tasktivity-productivity-app-integra.vercel.app",
      repo: `${GH}/Tasktivity-Productivity-App-Integrated-Using-AI`,
    },
    team: "Solo",
    overview:
      "Tasktivity blends task management with AI: it generates daily schedules from free-form descriptions, tracks productivity with analytics, and keeps motivation up through XP, tiered levels, and daily streaks — built in pure vanilla JS with a demo mode that runs on dummy data without any configuration.",
    features: [
      {
        title: "AI scheduling",
        description:
          "Free-form text in, a structured daily schedule out — plus a productivity chat.",
      },
      {
        title: "Gamified progress",
        description: "XP, levels, streaks, and level-up animations over real analytics.",
      },
      {
        title: "Automation",
        description: "Telegram notifications and n8n workflows wired to the task engine.",
      },
    ],
    metrics: [{ label: "Release", value: "2.0" }],
  },
  {
    slug: "nexora-ai-marketplace",
    title: "Nexora AI — AI Model Marketplace",
    summary:
      "A production-grade marketplace for discovering, buying, and selling curated AI models — one account to shop and sell, Indonesian payments, and a built-in admin console.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Marketplace", "E-commerce", "Full-stack", "Bahasa Indonesia"],
    stack: ["TypeScript", "Next.js", "React", "Supabase", "Tailwind CSS"],
    featured: false,
    order: 6,
    links: {
      live: "https://ai-marketplace-website-lake.vercel.app",
      repo: `${GH}/ai-marketplace-website`,
    },
    cover: `${RAW}/ai-marketplace-website/main/docs/preview/home.jpg`,
    team: "Solo",
    overview:
      "Nexora AI is a full two-sided marketplace on Next.js 16 + Supabase: buyers browse and purchase curated AI models, sellers open a storefront from the same account, and an admin console moderates the catalog — localized for Indonesia, payments included.",
    media: [
      {
        alt: "Nexora AI home page",
        src: `${RAW}/ai-marketplace-website/main/docs/preview/home.jpg`,
        caption: "The marketplace home.",
      },
      {
        alt: "Nexora AI seller studio",
        src: `${RAW}/ai-marketplace-website/main/docs/preview/seller-studio.jpg`,
        caption: "Seller studio — list and manage models.",
      },
    ],
  },
  {
    slug: "invento",
    title: "Invento — Warehouse Tracker",
    summary:
      "Inventory management on Next.js 16 + Supabase: products, stock in/out, low-stock alerts, and barcode scanning by camera or scanner gun.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Inventory", "Barcode", "Dashboard", "Bahasa Indonesia"],
    stack: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"],
    featured: false,
    order: 7,
    links: { repo: `${GH}/Invento-Warehouse-Tracker-Application` },
    cover: `${RAW}/Invento-Warehouse-Tracker-Application/main/docs/screenshots/02-dashboard.png`,
    team: "Solo",
    overview:
      "Invento tracks warehouse stock end to end — product catalog, in/out movements, low-stock monitoring, and a dashboard summary — with barcode input from a camera, a scanner gun, or manual entry, verified headless with a fake camera in CI.",
    media: [
      {
        alt: "Invento dashboard",
        src: `${RAW}/Invento-Warehouse-Tracker-Application/main/docs/screenshots/02-dashboard.png`,
        caption: "The stock dashboard.",
      },
      {
        alt: "Invento product list",
        src: `${RAW}/Invento-Warehouse-Tracker-Application/main/docs/screenshots/03-products.png`,
        caption: "Product management.",
      },
    ],
  },
  {
    slug: "gudang-atomy",
    title: "Gudang Atomy — Box Tracking",
    summary:
      "A working warehouse app for a real operation: box in/out logging with QR scanning, printable QR labels, Supabase RLS auth, and a full audit history.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["QR Scanner", "Operations", "Real client", "Bahasa Indonesia"],
    stack: ["TypeScript", "Next.js", "Supabase", "PostgreSQL", "Tailwind CSS"],
    featured: false,
    order: 8,
    links: { live: "https://gudang-atomy-ten.vercel.app", repo: `${GH}/gudang-atomy` },
    team: "Solo",
    overview:
      "Built for a real Atomy warehouse workflow: every box in or out is scanned via @zxing QR decoding, labels are generated and printed from the app, mutations go through Server Actions on Supabase with row-level security, and every change lands in an audit history.",
  },
  {
    slug: "prime-property",
    title: "Prime Property — Agency Platform",
    summary:
      "A premium property-agency site plus an internal agent portal: listings CRUD, role-based access (Admin/Superadmin), powered search and filters, and an audit log.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Real Estate", "RBAC", "Portal", "Bahasa Indonesia"],
    stack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
    featured: false,
    order: 9,
    links: {
      live: "https://prime-property-project.vercel.app",
      repo: `${GH}/prime-property-project`,
    },
    team: "Solo",
    overview:
      "A complete platform for a premium property agency: an elegant public site (brand system of black, gold, and editorial type) and an internal portal where agents manage listings under role-based access control with an audit trail.",
  },
  {
    slug: "hl-sales",
    title: "HL — Sales & Receivables App",
    summary:
      "An internal cash-basis sales app: customers, products, transactions, receivables, bonuses, settlements, and PDF reports — with decimal-safe rupiah math throughout.",
    role: "Sole developer",
    year: 2026,
    status: "live",
    kind: "software",
    category: "Web App",
    tags: ["Finance", "Internal Tool", "PDF Export", "Bahasa Indonesia"],
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Vitest"],
    featured: false,
    order: 10,
    links: { repo: `${GH}/hl-application` },
    team: "Solo",
    overview:
      "A single-user business tool where correctness is the feature: all money math flows through one decimal.js module (unit-tested with Vitest), omzet and profit are recognized only on settled invoices, and reports export to PDF via pdfkit.",
    features: [
      {
        title: "Decimal-safe money",
        description: "One source of truth for rupiah math — no floating-point drift.",
      },
      {
        title: "Cash-basis rules",
        description: "Revenue and bonus eligibility recognized only when status = Lunas.",
      },
      {
        title: "PDF reporting",
        description: "Receivables and sales reports exported straight from the app.",
      },
    ],
  },
  {
    slug: "yolov8-object-recognition",
    title: "Object Recognition with YOLOv8",
    summary:
      "A clean computer-vision pipeline on Ultralytics YOLOv8: detection on images, video, and live webcam, plus training custom models on labeled datasets.",
    role: "Sole developer",
    year: 2025,
    status: "live",
    kind: "research",
    category: "Computer Vision",
    tags: ["Computer Vision", "YOLOv8", "Deep Learning"],
    stack: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
    featured: false,
    order: 11,
    links: { repo: `${GH}/Object-Recognition-with-Yolo8` },
    team: "Solo",
    overview:
      "A zero-to-inference object-detection setup: run detection on an image, a video file, or a live webcam stream in a couple of commands, with training, configuration, and outputs kept cleanly separated for custom-dataset work.",
  },
  {
    slug: "php-ecommerce",
    title: "E-Commerce Platform in PHP",
    summary:
      "A security-conscious storefront and admin panel in plain PHP + MySQL: catalog, search, session cart, and prepared statements end to end.",
    role: "Sole developer",
    year: 2026,
    status: "archived",
    kind: "software",
    category: "Web App",
    tags: ["PHP", "MySQL", "E-commerce", "Security"],
    stack: ["PHP", "MySQL", "Bootstrap"],
    featured: false,
    order: 12,
    links: { repo: `${GH}/E-Commerce-Website-With-Database-Using-PHP` },
    team: "Solo",
    overview:
      "A classic LAMP build done properly: a customer-facing catalog with search and a session-based cart, a secured admin panel for categories and products, a normalized MySQL schema, and prepared statements everywhere user input touches the database.",
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
