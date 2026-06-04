// ContentCard — generic linked content card primitive (internal or external) with eyebrow, title, description, meta, and tags.
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TagList } from "@/components/common/tag-list";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  href: string;
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: string;
  tags?: string[];
  external?: boolean;
}

export function ContentCard({
  href,
  title,
  description,
  eyebrow,
  meta,
  tags,
  external = false,
}: ContentCardProps) {
  const linkProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-6",
        "transition-all focus-within:border-border-strong hover:-translate-y-0.5 hover:border-border-strong",
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-xs tracking-wide text-foreground-subtle uppercase">
          {eyebrow}
        </span>
      ) : null}

      <h3 className="font-display text-lg leading-snug font-semibold text-balance text-foreground">
        <Link
          href={href}
          {...linkProps}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {title}
          {external ? <span className="sr-only"> (opens in new tab)</span> : null}
        </Link>
      </h3>

      {description ? (
        <p className="line-clamp-3 text-sm text-foreground-muted">{description}</p>
      ) : null}

      {meta ? <p className="text-xs text-foreground-subtle">{meta}</p> : null}

      {tags && tags.length > 0 ? <TagList tags={tags} className="mt-auto pt-1" /> : null}

      <ArrowUpRight
        className="absolute top-6 right-6 size-5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </article>
  );
}
