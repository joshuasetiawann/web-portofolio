// Sample skills data grouped by category for the portfolio.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "GLSL", "SQL"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "Next.js", "Three.js", "React Three Fiber", "Node.js"],
  },
  {
    category: "Styling & Motion",
    items: ["Tailwind CSS", "Framer Motion", "GSAP", "Lenis"],
  },
  {
    category: "Tooling & Platforms",
    items: ["Git", "Vite", "Vercel", "Storybook", "Docker"],
  },
];
