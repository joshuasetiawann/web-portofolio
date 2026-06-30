// AchievementCard — a recognition entry: icon, title, category badge, date, description, and an optional reference link.
import { ArrowUpRight, Trophy } from "lucide-react";

import { ExternalLink } from "@/components/shared/external-link";
import { Badge } from "@/components/ui/badge";
import type { Achievement } from "@/data/achievements";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const date =
    formatDate(achievement.date, { month: "short", year: "numeric" }) || achievement.date;

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-6",
        "transition-[transform,border-color] hover:-translate-y-0.5 hover:border-border-strong",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-primary"
        >
          <Trophy className="size-5" />
        </span>
        <Badge variant="secondary">{achievement.category}</Badge>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base leading-snug font-semibold text-foreground">
          {achievement.title}
        </h3>
        <time dateTime={achievement.date} className="font-mono text-xs text-foreground-subtle">
          {date}
        </time>
      </div>

      <p className="text-sm text-foreground-muted">{achievement.description}</p>

      {achievement.link ? (
        <ExternalLink
          href={achievement.link}
          className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-medium text-primary"
        >
          Learn more
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </ExternalLink>
      ) : null}
    </article>
  );
}
