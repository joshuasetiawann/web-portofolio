// Renders a wrapping list of technologies as SkillBadges.
import { SkillBadge } from "@/components/common/skill-badge";
import { cn } from "@/lib/utils";

interface TechStackListProps {
  stack: string[];
  className?: string;
}

export function TechStackList({ stack, className }: TechStackListProps) {
  if (stack.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {stack.map((item) => (
        <li key={item}>
          <SkillBadge label={item} />
        </li>
      ))}
    </ul>
  );
}
