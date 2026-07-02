// Achievement data for the portfolio — engineering milestones, all verifiable on GitHub.

export interface Achievement {
  title: string;
  date: string;
  category: string;
  description: string;
  link?: string;
}

export const achievements: Achievement[] = [
  {
    title: "Booted a from-scratch OS with a truecolor desktop",
    date: "2026-06",
    category: "Milestone",
    description:
      "THUOS: an x86 kernel in C + assembly with paging, ring-3 user mode, a 1024×768 desktop, and USB-HID input — every push boot-verified in QEMU.",
    link: "https://github.com/joshuasetiawann/THUNITY-OS",
  },
  {
    title: "Shipped a local-first AI platform to v4.1",
    date: "2026-06",
    category: "Milestone",
    description:
      "AllHaven Command Center: 15 AI provider integrations, up to 10 agents, human-in-the-loop approval, and an Android companion — data stays on your machine.",
    link: "https://github.com/joshuasetiawann/AllHaven-Application",
  },
  {
    title: "Five production business apps in one month",
    date: "2026-06",
    category: "Milestone",
    description:
      "Gudang Atomy, HL, Prime Property, Invento, and Nexora AI — real inventory, sales, and marketplace systems, several live on Vercel.",
    link: "https://github.com/joshuasetiawann?tab=repositories",
  },
  {
    title: "100 production-grade AI prompts + browser",
    date: "2026-06",
    category: "Open Source",
    description:
      "PromptKita: a curated pack of 100 structured app-builder prompts with runnable Next.js scaffolds and a browsing site.",
    link: "https://github.com/joshuasetiawann/prompt",
  },
];
