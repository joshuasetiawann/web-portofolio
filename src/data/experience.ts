// Sample professional experience data for the portfolio.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)

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
    role: "Senior Frontend Engineer",
    company: "Lumen Labs",
    start: "2023-06",
    end: "Present",
    location: "Remote",
    summary:
      "Lead the web platform team building immersive, performance-first product experiences.",
    highlights: [
      "Shipped a token-driven design system adopted across four product surfaces.",
      "Reduced Largest Contentful Paint by 38% through streaming and image strategy.",
      "Mentored three engineers and established the team's accessibility review process.",
    ],
    stack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Framer Motion"],
  },
  {
    role: "Creative Developer",
    company: "Studio Northwind",
    start: "2021-01",
    end: "2023-05",
    location: "Jakarta, ID",
    summary:
      "Built award-considered marketing sites blending WebGL, motion, and editorial storytelling.",
    highlights: [
      "Delivered 12+ launch sites with bespoke scroll and 3D interactions.",
      "Introduced a shared animation toolkit that halved project setup time.",
    ],
    stack: ["Three.js", "GSAP", "React Three Fiber", "Lenis"],
  },
  {
    role: "Software Engineer Intern",
    company: "Vertex Systems",
    start: "2020-06",
    end: "2020-12",
    location: "Bandung, ID",
    summary: "Contributed to internal tooling and data dashboards used by the operations team.",
    highlights: [
      "Built a reusable charting module consumed by five internal dashboards.",
      "Automated a manual reporting workflow, saving roughly six hours weekly.",
    ],
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  },
];
