// Responsive 1/2/3-column grid of ProjectCard with lightweight, staggered in-view reveals.
import { ProjectCard } from "@/components/portfolio/project-card";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: Project[];
  className?: string;
}

export function ProjectGrid({ projects, className }: ProjectGridProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((project, index) => (
        <li key={project.slug} className="flex">
          <Reveal delay={Math.min(index, 5) * 0.05} className="flex w-full">
            <ProjectCard project={project} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
