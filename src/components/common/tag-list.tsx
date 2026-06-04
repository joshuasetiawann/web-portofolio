// TagList — Badge chips; each tag links to `${basePath}?tag=${tag}` when basePath is given, else renders as plain labels.
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagListProps {
  tags: string[];
  basePath?: string;
  active?: string;
  className?: string;
}

export function TagList({ tags, basePath, active, className }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => {
        const isActive = active !== undefined && active === tag;

        return (
          <li key={tag}>
            {basePath ? (
              <Badge
                asChild
                variant={isActive ? "default" : "outline"}
                className={cn("transition-colors", isActive && "font-semibold ring-1 ring-ring")}
              >
                <Link
                  href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {tag}
                </Link>
              </Badge>
            ) : (
              <Badge
                variant={isActive ? "default" : "outline"}
                className={cn(isActive && "font-semibold ring-1 ring-ring")}
                aria-current={isActive ? "true" : undefined}
              >
                {tag}
              </Badge>
            )}
          </li>
        );
      })}
    </ul>
  );
}
