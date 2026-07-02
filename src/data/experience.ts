// Professional experience data for the portfolio.
// Honest, self-directed track record — verifiable through github.com/joshuasetiawann.

export interface ExperienceItem {
  role: string;
  company: string;
  start: string;
  end: string;
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Independent AI & Systems Engineer",
    company: "Self-directed R&D",
    start: "2025-05",
    end: "Present",
    location: "Indonesia · Remote",
    summary:
      "Full-time deep work across the stack: a from-scratch operating system, local-first AI platforms, and a provider-agnostic coding agent.",
    highlights: [
      "Wrote THUOS, a bootable x86 kernel in C + assembly — 20 releases from VGA text to a USB-driven truecolor desktop, boot-verified in QEMU CI.",
      "Built AllHaven (v4.1) and ThuAI: local-first AI platforms with multi-agent workflows, self-hosted PostgreSQL, and human-in-the-loop approval.",
      "Started RelayCLI, a pipx-installable terminal coding agent that works with six model providers through LiteLLM.",
      "Trained and shipped YOLOv8 computer-vision pipelines for image, video, and live webcam detection.",
    ],
    stack: ["Python", "C", "FastAPI", "Next.js", "PostgreSQL", "Ollama", "QEMU"],
  },
  {
    role: "Freelance Software Developer",
    company: "Business applications",
    start: "2026-06",
    end: "Present",
    location: "Indonesia",
    summary:
      "Production web apps that real businesses run on daily — inventory, sales, and company-profile systems, several live on Vercel.",
    highlights: [
      "Gudang Atomy: warehouse box tracking with QR scanning, printable labels, Supabase RLS, and a full audit history — in production.",
      "HL: a cash-basis sales & receivables app with decimal-safe rupiah math, settlement rules, and PDF reporting.",
      "Prime Property & Nexora AI: a premium agency platform with a role-based agent portal, and a two-sided AI-model marketplace.",
    ],
    stack: ["TypeScript", "Next.js", "Supabase", "Prisma", "PostgreSQL", "Tailwind CSS"],
  },
  {
    role: "Web Developer",
    company: "Early projects",
    start: "2024-11",
    end: "2025-05",
    location: "Indonesia",
    summary:
      "First shipped work: company-profile sites, a PHP + MySQL e-commerce platform, and IoT experiments — where the habit of building real, running things started.",
    highlights: [
      "Built a security-conscious PHP/MySQL storefront with an admin panel and prepared statements end to end.",
      "Shipped company-profile websites and early automation/IoT prototypes.",
    ],
    stack: ["PHP", "MySQL", "JavaScript", "HTML/CSS", "Arduino"],
  },
];
