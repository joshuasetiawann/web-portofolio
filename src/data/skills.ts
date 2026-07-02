// Skill groups for the portfolio, mirroring the real toolkit on github.com/joshuasetiawann.

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C", "C++", "PHP", "SQL", "x86 Assembly"],
  },
  {
    category: "AI / ML & Computer Vision",
    items: ["PyTorch", "TensorFlow", "YOLOv8", "OpenCV", "scikit-learn", "Ollama", "LiteLLM"],
  },
  {
    category: "Web & Backend",
    items: ["Next.js", "React", "FastAPI", "Node.js", "Tailwind CSS", "Astro", "Prisma"],
  },
  {
    category: "Data & Infrastructure",
    items: ["PostgreSQL", "Supabase", "MySQL", "Docker", "Vercel", "n8n"],
  },
  {
    category: "Systems & Hardware",
    items: ["Linux (Arch)", "QEMU", "Bash", "Git", "Arduino", "Raspberry Pi"],
  },
];
