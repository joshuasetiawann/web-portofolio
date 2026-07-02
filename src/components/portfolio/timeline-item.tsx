// TimelineItem — a single timeline entry (type icon, date, label, title, description, optional link) for a vertical rail.
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { TimelineEvent, TimelineEventType } from "@/data/timeline";
import { formatDate } from "@/utils/format-date";

interface TimelineItemProps {
  event: TimelineEvent;
}

const TYPE_ICON: Record<TimelineEventType, LucideIcon> = {
  role: Briefcase,
  launch: Rocket,
  award: Trophy,
  talk: Users,
  education: GraduationCap,
  milestone: Sparkles,
};

const TYPE_LABEL: Record<TimelineEventType, string> = {
  role: "Role",
  launch: "Launch",
  award: "Award",
  talk: "Talk",
  education: "Education",
  milestone: "Milestone",
};

export function TimelineItem({ event }: TimelineItemProps) {
  const Icon = TYPE_ICON[event.type];
  const label = TYPE_LABEL[event.type];
  const date = formatDate(event.date, { month: "short", year: "numeric" }) || event.date;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-none border border-border text-primary"
        >
          <Icon className="size-4" />
        </span>
        <span aria-hidden="true" className="mt-2 w-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-1 pb-1">
        <div className="flex flex-wrap items-center gap-2 font-mono text-mono-meta text-foreground-subtle">
          <time dateTime={event.date} className="tabular">
            {date}
          </time>
          <span aria-hidden="true">·</span>
          <span className="text-mono-label uppercase">{label}</span>
        </div>

        <h3 className="font-display text-base leading-snug font-semibold text-foreground">
          {event.title}
        </h3>

        <p className="text-sm text-foreground-muted">{event.description}</p>

        {event.ref ? (
          <Link
            href={event.ref}
            className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
          >
            View details
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </li>
  );
}
