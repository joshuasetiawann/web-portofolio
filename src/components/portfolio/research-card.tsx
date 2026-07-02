// ResearchCard — research entry with status badge, category, authors, date, abstract, tags, and source links.
import { Code2, FileText, Link2, Users } from "lucide-react";

import { TagList } from "@/components/common/tag-list";
import { ExternalLink } from "@/components/shared/external-link";
import { Badge } from "@/components/ui/badge";
import type { Research } from "@/types/research";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";

interface ResearchCardProps {
  item: Research;
}

const STATUS_META: Record<Research["status"], { label: string; className?: string }> = {
  published: { label: "Published", className: "border-signal text-signal" },
  preprint: { label: "Preprint" },
  wip: { label: "Work in progress" },
};

export function ResearchCard({ item }: ResearchCardProps) {
  const status = STATUS_META[item.status];
  const { pdf, doi, code } = item.links;
  const hasLinks = Boolean(pdf || doi || code);

  return (
    <article className="group flex h-full flex-col gap-4 border border-border p-6 transition-colors hover:border-border-strong">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
        <Badge variant="outline">{item.category}</Badge>
        {item.venue ? (
          <span className="font-mono tabular text-mono-meta tracking-wide text-foreground-subtle uppercase">
            {item.venue}
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-lg leading-snug font-semibold text-balance text-foreground transition-colors group-hover:text-signal">
          {item.title}
        </h3>
        <p className="line-clamp-3 text-sm text-foreground-muted">{item.abstract}</p>
      </div>

      <dl className="flex flex-col gap-1.5 font-mono text-mono-meta text-foreground-subtle">
        <div className="flex items-start gap-1.5">
          <dt className="sr-only">Authors</dt>
          <Users className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <dd>{item.authors.join(", ")}</dd>
        </div>
        <div>
          <dt className="sr-only">Date</dt>
          <dd className="tabular tracking-wide uppercase">
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </dd>
        </div>
      </dl>

      {item.tags.length > 0 && <TagList tags={item.tags} className="mt-auto" />}

      {hasLinks ? (
        <div
          className={cn(
            "flex flex-wrap gap-4 border-t border-border pt-4",
            item.tags.length === 0 && "mt-auto",
          )}
        >
          {pdf ? (
            <ExternalLink
              href={pdf}
              className="inline-flex items-center gap-1.5 font-mono text-mono-meta tracking-wide text-foreground-muted uppercase hover:text-signal"
              aria-label={`Read the PDF of ${item.title}`}
            >
              <FileText className="size-4" aria-hidden="true" />
              PDF
            </ExternalLink>
          ) : null}
          {doi ? (
            <ExternalLink
              href={doi}
              className="inline-flex items-center gap-1.5 font-mono text-mono-meta tracking-wide text-foreground-muted uppercase hover:text-signal"
              aria-label={`View the DOI record for ${item.title}`}
            >
              <Link2 className="size-4" aria-hidden="true" />
              DOI
            </ExternalLink>
          ) : null}
          {code ? (
            <ExternalLink
              href={code}
              className="inline-flex items-center gap-1.5 font-mono text-mono-meta tracking-wide text-foreground-muted uppercase hover:text-signal"
              aria-label={`Browse the code for ${item.title}`}
            >
              <Code2 className="size-4" aria-hidden="true" />
              Code
            </ExternalLink>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
