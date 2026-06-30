// SkillBadge — a single skill/tech chip with an optional resolved lucide icon.
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  label: string;
  icon?: string;
  className?: string;
}

export function SkillBadge({ label, icon, className }: SkillBadgeProps) {
  const Icon = getIcon(icon);

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-normal", className)}>
      {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
      {label}
    </Badge>
  );
}
