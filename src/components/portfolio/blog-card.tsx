// BlogCard — linked article card: cover, title, description, date, reading time, and tags.
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";

import { TagList } from "@/components/common/tag-list";
import type { Post } from "@/lib/content";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden border border-border",
        "transition-colors focus-within:border-border-strong hover:border-border-strong",
      )}
    >
      <div
        className="relative aspect-[16/9] overflow-hidden bg-surface-2"
        aria-hidden={!post.cover}
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt={`${post.title} cover`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 border border-border bg-surface-1">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-mono-meta tracking-wide text-foreground-subtle uppercase">
          <span className="inline-flex items-center gap-1 tabular">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={String(post.date)}>{formatDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1 tabular">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </div>

        <h3 className="font-display text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-signal">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-foreground-muted">{post.description}</p>

        {post.tags.length > 0 && <TagList tags={post.tags} className="mt-auto pt-1" />}

        <ArrowUpRight
          className="absolute top-5 right-5 size-5 text-signal opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
